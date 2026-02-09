// app/api/missions/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

type DecodedToken = {
  userId: string
  userType?: string
}

function getUserFromJWT(req: NextRequest): DecodedToken | null {
  const token = req.cookies.get("auth-token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch {
    return null
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    /* ===========================
       AUTH — ADMIN ONLY
    ============================ */

    const decoded = getUserFromJWT(request)

    if (!decoded || decoded.userType !== "admin") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      )
    }

    /* ===========================
       BODY VALIDATION
    ============================ */

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: "Statut manquant" },
        { status: 400 }
      )
    }

    if (!["public", "refused"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Statut invalide. Valeurs autorisées: public, refused",
        },
        { status: 400 }
      )
    }

    /* ===========================
       UPDATE
    ============================ */

    const updated = await sql`
      UPDATE missions
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
        AND status IN ('pending', 'open')
      RETURNING id, status
    `

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { error: "Mission introuvable ou déjà traitée" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      mission: updated[0],
    })
  } catch (err) {
    console.error("PATCH /api/missions/[id]/status error:", err)

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
