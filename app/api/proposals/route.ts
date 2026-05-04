export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get proposals (replacement doctors see received proposals, employers see sent proposals)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    let proposals
    if (decoded.userType === "replacement") {
      // Get proposals received by this replacement doctor
      proposals = await db.sql`
        SELECT p.*, m.title, m.description, m.location, m.start_date, m.end_date,
               ep.organization_name, u.first_name, u.last_name
        FROM proposals p
        JOIN missions m ON p.mission_id = m.id
        JOIN users u ON p.employer_id = u.id
        LEFT JOIN employer_profiles ep ON u.id = ep.user_id
        WHERE p.replacement_id = ${decoded.userId}
        ORDER BY p.sent_at DESC
      `
    } else if (decoded.userType === "employer") {
      // Get proposals sent by this employer
      proposals = await db.sql`
        SELECT p.*, m.title, m.description, 
               rp.specialty, u.first_name, u.last_name
        FROM proposals p
        JOIN missions m ON p.mission_id = m.id
        JOIN users u ON p.replacement_id = u.id
        LEFT JOIN replacement_profiles rp ON u.id = rp.user_id
        WHERE p.employer_id = ${decoded.userId}
        ORDER BY p.sent_at DESC
      `
    } else {
      return NextResponse.json({ error: "Invalid user type" }, { status: 403 })
    }

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error("Proposals fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send proposal (employers only)
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "Only employers can send proposals" }, { status: 403 })
    }

    const body = await request.json()
    const { missionId, replacementId, message, proposedRate } = body

    if (!missionId || !replacementId) {
      return NextResponse.json({ error: "Mission ID and replacement ID are required" }, { status: 400 })
    }

    // Check if proposal already exists
    const existingProposal = await db.sql`
      SELECT id FROM proposals 
      WHERE mission_id = ${missionId} AND replacement_id = ${replacementId} AND employer_id = ${decoded.userId}
    `

    if (existingProposal.length > 0) {
      return NextResponse.json({ error: "Proposal already sent to this doctor" }, { status: 409 })
    }

    const proposal = await db.sql`
      INSERT INTO proposals (mission_id, replacement_id, employer_id, message, proposed_rate)
      VALUES (${missionId}, ${replacementId}, ${decoded.userId}, 
              ${message || null}, ${proposedRate ? Number.parseFloat(proposedRate) : null})
      RETURNING *
    `

    // Get mission details for notification
    const mission = await db.sql`
      SELECT title FROM missions WHERE id = ${missionId}
    `

    if (mission.length > 0) {
      // Notify replacement doctor
      await db.sql`
        INSERT INTO notifications (user_id, title, message, notification_type, related_id)
        VALUES (${replacementId}, 'Nouvelle proposition', 
                ${`Vous avez reçu une proposition pour la mission "${mission[0].title}".`}, 
                'new_proposal', ${proposal[0].id})
      `
    }

    return NextResponse.json({ proposal: proposal[0] }, { status: 201 })
  } catch (error) {
    console.error("Proposal creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
