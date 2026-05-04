export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db, sql } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Verify document (admin only)
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

    if (decoded.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid verification status" }, { status: 400 })
    }

    // Get document details
  const document = await sql`
      SELECT d.*, u.first_name, u.last_name
      FROM documents d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ${params.id}
    `

    if (document.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update document verification status
  await sql`
      UPDATE documents 
      SET verification_status = ${status},
          verified_by = ${decoded.userId},
          verified_at = NOW(),
          rejection_reason = ${rejectionReason || null}
      WHERE id = ${params.id}
    `

    // Create notification for user
    const notificationTitle = status === "approved" ? "Document approuvé" : "Document rejeté"
    const notificationMessage =
      status === "approved"
        ? `Votre document ${document[0].document_type} a été approuvé.`
        : `Votre document ${document[0].document_type} a été rejeté. ${rejectionReason || ""}`

  await sql`
      INSERT INTO notifications (user_id, title, message, notification_type, related_id)
      VALUES (${document[0].user_id}, ${notificationTitle}, 
              ${notificationMessage}, ${`document_${status}`}, ${params.id})
    `

    return NextResponse.json({ message: "Document verification updated successfully" })
  } catch (error) {
    console.error("Document verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
