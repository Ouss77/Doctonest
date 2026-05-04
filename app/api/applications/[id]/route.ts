export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Update application status (employer only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    const body = await request.json()
    const { status, message } = body

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get application details
    const application = await db.sql`
      SELECT a.*, m.employer_id, m.title, u.first_name, u.last_name
      FROM applications a
      JOIN missions m ON a.mission_id = m.id
      JOIN users u ON a.replacement_id = u.id
      WHERE a.id = ${params.id}
    `

    if (application.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user is the employer for this mission
    if (decoded.userType !== "employer" || decoded.userId !== application[0].employer_id) {
      return NextResponse.json({ error: "Not authorized to update this application" }, { status: 403 })
    }

    // Update application status
    await db.sql`
      UPDATE applications 
      SET status = ${status}, responded_at = NOW()
      WHERE id = ${params.id}
    `

    // Create notification for replacement doctor
    const notificationTitle = status === "accepted" ? "Candidature acceptée" : "Candidature refusée"
    const notificationMessage =
      status === "accepted"
        ? `Votre candidature pour "${application[0].title}" a été acceptée.`
        : `Votre candidature pour "${application[0].title}" a été refusée. ${message || ""}`

    await db.sql`
      INSERT INTO notifications (user_id, title, message, notification_type, related_id)
      VALUES (${application[0].replacement_id}, ${notificationTitle}, 
              ${notificationMessage}, ${`application_${status}`}, ${params.id})
    `

    // If accepted, update mission status and reject other applications
    if (status === "accepted") {
      await db.sql`
        UPDATE missions 
        SET status = 'in_progress'
        WHERE id = ${application[0].mission_id}
      `

      // Reject other pending applications
      await db.sql`
        UPDATE applications 
        SET status = 'rejected', responded_at = NOW()
        WHERE mission_id = ${application[0].mission_id} 
        AND id != ${params.id} 
        AND status = 'pending'
      `
    }

    return NextResponse.json({ message: "Application updated successfully" })
  } catch (error) {
    console.error("Application update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Withdraw application (replacement doctor only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Only replacement doctors can withdraw applications" }, { status: 403 })
    }

    await db.sql`
      UPDATE applications 
      SET status = 'withdrawn'
      WHERE id = ${params.id} AND replacement_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Application withdrawn successfully" })
  } catch (error) {
    console.error("Application withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
