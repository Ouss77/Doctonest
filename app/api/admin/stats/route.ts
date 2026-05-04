export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get platform statistics (admin only)
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

    // Get user statistics
    const userStats = await db.sql`
      SELECT 
        user_type,
        COUNT(*) as count
      FROM users 
      WHERE user_type != 'admin'
      GROUP BY user_type
    `

    // Get profile status statistics
    const profileStats = await db.sql`
      SELECT 
        'replacement' as user_type,
        profile_status,
        COUNT(*) as count
      FROM replacement_profiles
      GROUP BY profile_status
      UNION ALL
      SELECT 
        'employer' as user_type,
        profile_status,
        COUNT(*) as count
      FROM employer_profiles
      GROUP BY profile_status
    `

    // Get mission statistics
    const missionStats = await db.sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM missions
      GROUP BY status
    `

    // Get recent activity
    const recentUsers = await db.sql`
      SELECT u.*, rp.specialty, ep.organization_name
      FROM users u
      LEFT JOIN replacement_profiles rp ON u.id = rp.user_id
      LEFT JOIN employer_profiles ep ON u.id = ep.user_id
      WHERE u.user_type != 'admin'
      ORDER BY u.created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      userStats,
      profileStats,
      missionStats,
      recentUsers,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
