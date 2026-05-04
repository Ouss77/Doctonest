export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Update replacement doctor rates
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    if (decoded.userType !== "replacement") {
      return NextResponse.json({ error: "Only replacement doctors can update rates" }, { status: 403 })
    }

    const body = await request.json()
    const { hourlyRate, dailyRate } = body

    await db.sql`
      UPDATE replacement_profiles 
      SET hourly_rate = ${hourlyRate ? Number.parseFloat(hourlyRate) : null},
          daily_rate = ${dailyRate ? Number.parseFloat(dailyRate) : null},
          updated_at = NOW()
      WHERE user_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Rates updated successfully" })
  } catch (error) {
    console.error("Rates update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
