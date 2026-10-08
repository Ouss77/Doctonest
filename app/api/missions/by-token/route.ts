export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const mission = await db.getMissionByEditToken(token)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    return NextResponse.json({ mission })
  } catch (error) {
    console.error("GET /api/missions/by-token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}