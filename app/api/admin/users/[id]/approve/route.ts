export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Approve user profile (admin only)
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

    // Get user to determine profile type
    const user = await db.getUserById(params.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update profile status based on user type
    if (user.user_type === "replacement") {
      await db.sql`
        UPDATE replacement_profiles 
        SET profile_status = 'approved', updated_at = NOW()
        WHERE user_id = ${params.id}
      `
    } else if (user.user_type === "employer") {
      await db.sql`
        UPDATE employer_profiles 
        SET profile_status = 'approved', updated_at = NOW()
        WHERE user_id = ${params.id}
      `
    }

    // Create notification
    await db.sql`
      INSERT INTO notifications (user_id, title, message, notification_type)
      VALUES (${params.id}, 'Profil approuvé', 'Votre profil a été approuvé par notre équipe.', 'profile_approved')
    `

    return NextResponse.json({ message: "Profile approved successfully" })
  } catch (error) {
    console.error("Profile approval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
