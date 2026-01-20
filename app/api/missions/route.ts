import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db, sql } from "@/lib/database"

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

/*** GET /api/missions 
 * Supports filtering + employer restriction */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: Record<string, any> = {}

    const decoded = getUserFromJWT(request)
    
    // Status filter: only apply if explicitly requested or for non-admin users
    const statusParam = searchParams.get("status")
    if (statusParam) {
      filters.status = statusParam
    } else if (decoded?.userType === "employer") {
      // Employers see only open missions by default
      filters.status = "open"
    } else {
      // Admin sees all missions by default (no status filter)
      // Only filter if explicitly requested
    }

    // Optional filters
    if (searchParams.get("specialty")) {
      filters.specialty = searchParams.get("specialty")
    }
    if (searchParams.get("location")) {
      filters.location = searchParams.get("location")
    }

    if (decoded?.userType === "employer") {
      // Employers only see their own missions
      filters.employer_id = decoded.userId
    } else if (searchParams.get("employerId")) {
      // Admin or others can filter explicitly
      filters.employer_id = searchParams.get("employerId")
    }

    const missions = await db.getMissions(filters)
    return NextResponse.json({ missions })
  } catch (error) {
    console.error("GET /missions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/missions * Employers create new missions
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
      employer_id: employerIdFromBody
    } = body;

    if (!title || !description || !specialty_required || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // NEW LOGIC:
    const finalEmployerId =
      employerIdFromBody ||
      decoded?.userId ||
      null;

    if (!finalEmployerId) {
      return NextResponse.json({
        error: "No employer ID available. User must be logged in or email must match an existing user."
      }, { status: 400 });
    }

    const mission = await db.createMission({
      employer_id: finalEmployerId,
      ...body
    });

    return NextResponse.json({ mission }, { status: 201 });
  }
  catch (error) {
    console.error("POST /missions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
