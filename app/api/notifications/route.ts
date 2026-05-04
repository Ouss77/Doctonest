export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get user notifications
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
    }

    const notifications = await db.sql`
      SELECT * FROM notifications 
      WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
    }

    const body = await request.json()
    const { notificationId } = body

    await db.sql`
      UPDATE notifications 
      SET is_read = true
      WHERE id = ${notificationId} AND user_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
