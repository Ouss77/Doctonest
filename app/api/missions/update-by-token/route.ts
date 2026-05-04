import { NextRequest, NextResponse } from "next/server"
import { missionsService } from "@/lib/services/missions"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const token = String(body?.token || "").trim()

    if (!token) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const mission = await missionsService.getByEditToken(token)

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const updated = await missionsService.updateByEditToken(token, {
      title: body?.title ? String(body.title).trim() : undefined,
      description: body?.description ? String(body.description).trim() : undefined,
      specialty_required: body?.specialty_required ? String(body.specialty_required).trim() : undefined,
      location: body?.location ? String(body.location).trim() : undefined,
    })

    if (!updated) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    return NextResponse.json({ mission: updated })
  } catch (error) {
    console.error("PUT /api/missions/update-by-token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}