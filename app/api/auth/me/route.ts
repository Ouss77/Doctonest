export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET || "medical-replacement-platform-secret-key-2024"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No authentication token" }, { status: 401 })
    }

    let decoded: { userId: string; email: string; userType: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; userType: string }
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Get user from database
    const user = await db.getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get profile data based on user type
    let profile = null
    if (user.user_type === "replacement") {
      profile = await db.getReplacementProfile(user.id)
    } else if (user.user_type === "employer") {
      profile = await db.getEmployerProfile(user.id)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        
      },
      profile,
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
