// app/api/missions/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

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

    const missionRows = await sql`
      SELECT id, title, status, guest_email, guest_name, edit_token
      FROM missions
      WHERE id = ${id}
      LIMIT 1
    `

    if (!missionRows || missionRows.length === 0) {
      return NextResponse.json(
        { error: "Mission introuvable" },
        { status: 404 }
      )
    }

    const mission = missionRows[0]

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

    if (status === "public" && mission.guest_email) {
      const hasSmtpConfig =
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS

      if (hasSmtpConfig) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const publicUrl = `${request.nextUrl.origin}/annonces/${id}`
        const managementUrl = mission.edit_token
          ? `${request.nextUrl.origin}/edit-mission?token=${mission.edit_token}`
          : null

        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || "no-reply@doctonest.com",
            to: mission.guest_email,
            subject: "Votre annonce a été publiée",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
                <h2 style="margin: 0 0 12px; color: #1d4ed8;">Votre annonce est maintenant publiée</h2>
                <p>Bonjour${mission.guest_name ? ` ${mission.guest_name}` : ""},</p>
                <p>Votre annonce <strong>${mission.title}</strong> a été approuvée par notre équipe et est désormais visible publiquement.</p>
                <p><a href="${publicUrl}">Voir l'annonce publique</a></p>
                ${managementUrl ? `<p><a href="${managementUrl}">Modifier ou supprimer l'annonce</a></p>` : ""}
                <p>Merci pour votre patience.</p>
              </div>
            `,
          })
        } catch (mailError) {
          console.error("Approval email delivery failed:", mailError)
        }
      } else {
        console.warn("SMTP not configured, approval email skipped for mission:", id)
      }
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
