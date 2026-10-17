import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const ADMIN_MISSION_NOTIFY_EMAIL = "ousssamasassour24@gmail.com"
const PENDING_PUBLIC_STATUSES = new Set(["pending", "open"])

function getAdminOrigin(request: NextRequest) {
  return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
}

async function notifyAdminOfPendingPublicMission(mission: any, origin: string) {
  if (!mission?.id) return
  if (mission.status === "public" || mission.status === "private") return
  if (!PENDING_PUBLIC_STATUSES.has(mission.status)) return

  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS

  if (!hasSmtpConfig) {
    console.warn("SMTP not configured, pending public mission email skipped:", mission.id)
    return
  }

  const authorName = mission.guest_name || mission.organization_name || null
  const publishedAt = mission.created_at
    ? new Date(mission.created_at).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Non renseignée"
  const adminUrl = `${origin.replace(/\/$/, "")}/dashboard/admin/missions`

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@doctonest.com",
    to: ADMIN_MISSION_NOTIFY_EMAIL,
    subject: `Nouvelle mission à valider : ${mission.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin: 0 0 12px; color: #1d4ed8;">Nouvelle mission publique en attente</h2>
        <p>Une mission publique vient d'être publiée et attend une validation.</p>
        <ul>
          <li><strong>Titre :</strong> ${mission.title || "Non renseigné"}</li>
          <li><strong>Auteur :</strong> ${authorName || "Non renseigné"}</li>
          <li><strong>Date de publication :</strong> ${publishedAt}</li>
          <li><strong>Statut :</strong> en attente de validation</li>
        </ul>
        <p><a href="${adminUrl}">Consulter la mission et l'accepter ou la refuser</a></p>
      </div>
    `,
  })
}

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const decoded = getUserFromJWT(request)
    const visibility = (searchParams.get("visibility") || "public") as
      | "public"
      | "private"
      | "mine"

    if (!["public", "private", "mine"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility value" },
        { status: 400 }
      )
    }

    if (visibility === "private" && !decoded?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (
      visibility === "mine" &&
      (!decoded?.userId || decoded?.userType !== "employer")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const filters: Record<string, any> = {}

    if (searchParams.get("specialty")) {
      filters.specialty = searchParams.get("specialty")
    }

    if (searchParams.get("location")) {
      filters.location = searchParams.get("location")
    }

    const missions = await db.listMissions(filters, {
      visibility,
      userId: decoded?.userId,
      userType: decoded?.userType as "replacement" | "employer" | "admin" | undefined,
    })

    return NextResponse.json({ missions })
  } catch (error) {
    console.error("GET /missions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


/**
 * POST /api/missions
 * Authenticated employers create missions with employer_id.
 * Guests create missions with an edit token.
 */ 
export async function POST(request: NextRequest) {
  try {
    const decoded = getUserFromJWT(request);
    const body = await request.json();

    const {
      title, 
      description,
      specialty_required,
      location,
      guest_email: guestEmail,
      guest_name: guestName
    } = body;

    if (!title || !description || !location || !specialty_required) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isEmployer = decoded?.userType === "employer" && decoded?.userId

    if (isEmployer) {
      const mission = await db.createMission({
        title: String(title).trim(),
        description: String(description).trim(),
        specialty_required: String(specialty_required).trim(),
        location: String(location).trim(),
        employer_id: decoded.userId,
        status: "private",
        is_guest: false,
      });

      return NextResponse.json({ mission }, { status: 201 });
    }

    if (!guestName || !guestEmail) {
      return NextResponse.json(
        { error: "Guest name and email are required" },
        { status: 400 }
      )
    }

    const editToken = crypto.randomBytes(32).toString("hex")
    const mission = await db.createMission({
      title: String(title).trim(),
      description: String(description).trim(),
      specialty_required: String(specialty_required).trim(),
      location: String(location).trim(),
      employer_id: null,
      status: "open",
      is_guest: true,
      guest_email: String(guestEmail).trim(),
      guest_name: String(guestName).trim(),
      edit_token: editToken,
    });

    try {
      await notifyAdminOfPendingPublicMission(mission, getAdminOrigin(request))
    } catch (mailError) {
      console.error("Pending public mission email delivery failed:", mailError)
    }

    return NextResponse.json({ mission }, { status: 201 });
  }
  catch (error) {
    console.error("POST /missions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
