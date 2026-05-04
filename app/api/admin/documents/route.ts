export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get all documents for admin review
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

    if (decoded.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"
    const documentType = searchParams.get("documentType")
    const userType = searchParams.get("userType")

    let query = db.sql`
      SELECT d.*, u.first_name, u.last_name, u.email, u.user_type,
             rp.specialty, ep.organization_name,
             v.first_name as verified_by_first_name, v.last_name as verified_by_last_name
      FROM documents d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN replacement_profiles rp ON u.id = rp.user_id
      LEFT JOIN employer_profiles ep ON u.id = ep.user_id
      LEFT JOIN users v ON d.verified_by = v.id
      WHERE d.verification_status = ${status}
    `

    if (documentType) {
      query = db.sql`${query} AND d.document_type = ${documentType}`
    }

    if (userType) {
      query = db.sql`${query} AND u.user_type = ${userType}`
    }

    query = db.sql`${query} ORDER BY d.uploaded_at ASC`

    const documents = await query

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Admin documents fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
