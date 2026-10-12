export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"
import { isReplacementApproved } from "@/lib/db/replacements"

const JWT_SECRET = process.env.JWT_SECRET || "medical-replacement-platform-secret-key-2024"

function getAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }
  } catch {
    return null
  }
}

// GET /api/applications?userId=... or /api/applications?missionId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const missionId = searchParams.get("missionId")
    if (missionId) {
      const applications = await db.getApplications({ mission_id: missionId })
      return NextResponse.json({ applications })
    } else if (userId) {
      const applications = await db.getApplications({ replacement_id: userId })
      return NextResponse.json({ applications })
    } else {
      return NextResponse.json({ error: "Missing missionId or userId" }, { status: 400 })
    }
  } catch (error) {
    console.error("[APPLICATION-API] Error (GET):", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST /api/applications
export async function POST(req: NextRequest) {
  try {
    const decoded = getAuth(req)
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    if (decoded.userType !== "replacement") {
      return NextResponse.json(
        { error: "Seuls les médecins remplaçants peuvent postuler." },
        { status: 403 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const missionId = body?.missionId
    if (!missionId) {
      return NextResponse.json({ error: "Missing missionId" }, { status: 400 })
    }

    const approved = await isReplacementApproved(decoded.userId)
    if (!approved) {
      return NextResponse.json(
        { error: "Votre profil doit être vérifié par l'administration avant de postuler." },
        { status: 403 }
      )
    }

    const existing = await db.getApplications({
      mission_id: missionId,
      replacement_id: decoded.userId,
    })
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Vous avez déjà postulé à cette mission." },
        { status: 409 }
      )
    }

    const application = await db.createApplication({
      mission_id: missionId,
      replacement_id: decoded.userId,
    })
    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error("[APPLICATION-API] Error:", error)
    return NextResponse.json({ error: "Failed to apply to mission" }, { status: 500 })
  }
}
