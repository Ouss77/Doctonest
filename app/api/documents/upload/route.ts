export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db, sql } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Allowed file types and sizes
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed",
        },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB",
        },
        { status: 400 },
      )
    }

    // Validate document type
    const validDocumentTypes = ["rpps", "diploma", "cv", "cin", "diplome"]
    if (!validDocumentTypes.includes(documentType)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 })
    }


    // Determine subfolder based on document type
    let subfolder = "uploadsOther"
    if (documentType === "cv") subfolder = "uploadsCV"
    else if (documentType === "cin") subfolder = "uploadsCIN"
    else if (documentType === "diplome" || documentType === "diploma") subfolder = "uploadsDiploms"

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", subfolder, decoded.userId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${documentType}_${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    const publicPath = `/${subfolder}/${decoded.userId}/${fileName}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Delete any existing document of this type for this user
    await sql`
      DELETE FROM documents WHERE user_id = ${decoded.userId} AND document_type = ${documentType}
    `

    // Save document info to database
    const document = await sql`
      INSERT INTO documents (
        user_id, document_type, file_name, file_path, file_size, mime_type
      )
      VALUES (
        ${decoded.userId}, ${documentType}, ${file.name}, ${publicPath}, 
        ${file.size}, ${file.type}
      )
      RETURNING *
    `

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        document: document[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("File upload error:", error)
    let message = "Internal server error"
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === "string") {
      message = error
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
