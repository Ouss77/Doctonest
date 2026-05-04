export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"
import { unlink } from "fs/promises"
import { join } from "path"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Delete document
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

    // Get document details
    const document = await db.sql`
      SELECT * FROM documents 
      WHERE id = ${params.id} AND user_id = ${decoded.userId}
    `

    if (document.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), "public", document[0].file_path)
      await unlink(filePath)
    } catch (fileError) {
      console.error("File deletion error:", fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await db.sql`
      DELETE FROM documents 
      WHERE id = ${params.id} AND user_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Document deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
