import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { missionsService } from "@/lib/services/missions"

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

    const missions = await missionsService.list(filters, {
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
      const mission = await missionsService.create({
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
    const mission = await missionsService.create({
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

    const editLink = `${request.nextUrl.origin}/edit-mission?token=${editToken}`

    return NextResponse.json({ mission, editLink }, { status: 201 });
  }
  catch (error) {
    console.error("POST /missions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
