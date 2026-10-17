export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { NextRequest, NextResponse } from "next/server"
import { db, sql } from "@/lib/database"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyAuthToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) {
    return { error: "Authentication required", status: 401 }
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }
    return { decoded }
  } catch {
    return { error: "Invalid or expired token", status: 401 }
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAuthToken(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    if (!auth.decoded || auth.decoded.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const userId = params.id
    const body = await request.json()
    const { profile_status } = body
    if (!profile_status || !["pending", "approved", "rejected"].includes(profile_status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const user = await db.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let updated: { id: string; profile_status: string }[] = []
    if (user.user_type === "replacement") {
      updated = await sql`
        UPDATE replacement_profiles
        SET profile_status = ${profile_status}, updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING id, profile_status
      `
    } else if (user.user_type === "employer") {
      updated = await sql`
        UPDATE employer_profiles
        SET profile_status = ${profile_status}, updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING id, profile_status
      `
    } else {
      return NextResponse.json(
        { error: "This user type has no profile status" },
        { status: 400 }
      )
    }

    if (!updated.length) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Status updated",
      profile_status: updated[0].profile_status,
    })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
