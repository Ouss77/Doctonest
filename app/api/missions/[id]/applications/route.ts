import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get applications for a mission (employer) or apply to mission (replacement)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    if (decoded.userType !== "employer") {
      return NextResponse.json({ error: "Only employers can view applications" }, { status: 403 })
    }

    const applications = await db.getApplications({ mission_id: params.id })
    console.log(applications)

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Apply to mission (replacement doctors only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    if (decoded.userType !== "replacement") {
      return NextResponse.json({ error: "Only replacement doctors can apply to missions" }, { status: 403 })
    }

    const body = await request.json()
    const { coverLetter, proposedRate } = body

    // Check if already applied
    const existingApplication = await db.sql`
      SELECT id FROM applications 
      WHERE mission_id = ${params.id} AND replacement_id = ${decoded.userId}
    `

    if (existingApplication.length > 0) {
      return NextResponse.json({ error: "You have already applied to this mission" }, { status: 409 })
    }

    const application = await db.createApplication({
      mission_id: params.id,
      replacement_id: decoded.userId,
      cover_letter: coverLetter,
      proposed_rate: proposedRate ? Number.parseFloat(proposedRate) : undefined,
    })

    // Get mission details for notification
    const mission = await db.sql`
      SELECT title, employer_id, is_guest FROM missions WHERE id = ${params.id}
    `

    if (mission.length > 0) {
      if (mission[0].employer_id) {
        // Notify employer
        await db.sql`
          INSERT INTO notifications (user_id, title, message, notification_type, related_id)
          VALUES (${mission[0].employer_id}, 'Nouvelle candidature', 
                  ${`Un médecin a postulé pour votre mission "${mission[0].title}".`}, 
                  'new_application', ${application.id})
        `
      }
    }

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error("Application creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
