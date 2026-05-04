import { NextRequest, NextResponse } from "next/server"
import { missionsService } from "@/lib/services/missions"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = String(body?.token || "").trim()

    if (!token) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const mission = await missionsService.getByEditToken(token)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const deleted = await missionsService.deleteByEditToken(token)

    if (!deleted) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/missions/delete-by-token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}