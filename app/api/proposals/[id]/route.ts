export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Respond to proposal (replacement doctors only)
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

    if (decoded.userType !== "replacement") {
      return NextResponse.json({ error: "Only replacement doctors can respond to proposals" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get proposal details
    const proposal = await db.sql`
      SELECT p.*, m.title, m.employer_id
      FROM proposals p
      JOIN missions m ON p.mission_id = m.id
      WHERE p.id = ${params.id} AND p.replacement_id = ${decoded.userId}
    `

    if (proposal.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Update proposal status
    await db.sql`
      UPDATE proposals 
      SET status = ${status}, responded_at = NOW()
      WHERE id = ${params.id}
    `

    // Create notification for employer
    const notificationTitle = status === "accepted" ? "Proposition acceptée" : "Proposition refusée"
    const notificationMessage =
      status === "accepted"
        ? `Votre proposition pour "${proposal[0].title}" a été acceptée.`
        : `Votre proposition pour "${proposal[0].title}" a été refusée.`

    await db.sql`
      INSERT INTO notifications (user_id, title, message, notification_type, related_id)
      VALUES (${proposal[0].employer_id}, ${notificationTitle}, 
              ${notificationMessage}, ${`proposal_${status}`}, ${params.id})
    `

    // If accepted, update mission status
    if (status === "accepted") {
      await db.sql`
        UPDATE missions 
        SET status = 'in_progress'
        WHERE id = ${proposal[0].mission_id}
      `
    }

    return NextResponse.json({ message: "Proposal response recorded successfully" })
  } catch (error) {
    console.error("Proposal response error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
