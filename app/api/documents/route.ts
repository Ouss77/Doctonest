export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { sql } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get user documents
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


    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get("documentType")
    const userIdParam = searchParams.get("userId")

    let targetUserId = decoded.userId
    if (userIdParam && decoded.userType === "employer") {
      targetUserId = userIdParam
    }

    let documents
    if (documentType) {
      documents = await sql`
        SELECT * FROM documents
        WHERE user_id = ${targetUserId} AND document_type = ${documentType}
        ORDER BY uploaded_at DESC
      `
    } else {
      documents = await sql`
        SELECT * FROM documents
        WHERE user_id = ${targetUserId}
        ORDER BY uploaded_at DESC
      `
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Documents fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
