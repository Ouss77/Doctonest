export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get document statistics (admin only)
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

    // Get document statistics by type and status
    const documentStats = await db.sql`
      SELECT 
        document_type,
        verification_status,
        COUNT(*) as count
      FROM documents
      GROUP BY document_type, verification_status
      ORDER BY document_type, verification_status
    `

    // Get recent document uploads
    const recentDocuments = await db.sql`
      SELECT d.*, u.first_name, u.last_name, u.user_type
      FROM documents d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.uploaded_at DESC
      LIMIT 20
    `

    // Get verification statistics
    const verificationStats = await db.sql`
      SELECT 
        verification_status,
        COUNT(*) as count
      FROM documents
      GROUP BY verification_status
    `

    return NextResponse.json({
      documentStats,
      recentDocuments,
      verificationStats,
    })
  } catch (error) {
    console.error("Document stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
