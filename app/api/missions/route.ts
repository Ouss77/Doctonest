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

/**
 * GET /api/missions
 * Supports filtering + employer restriction
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: Record<string, any> = {
      status: searchParams.get("status") || "open",
    }

    // Optional filters
    if (searchParams.get("specialty")) {
      filters.specialty = searchParams.get("specialty")
    }
    if (searchParams.get("location")) {
      filters.location = searchParams.get("location")
    }

    // Auth check
    const decoded = getUserFromJWT(request)
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
    const decoded = getUserFromJWT(request)

    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })}
    // if (decoded.userType !== "employer") {
    //   return NextResponse.json({ error: "Only employers can create missions" }, { status: 403 })}
    const body = await request.json()
    const {
      title, description, specialty_required, location
    } = body

    // Basic validation
    if (!title || !description || !specialty_required || !location ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let mission
    try {
      mission = await db.createMission({
        employer_id: decoded.userId,
        title,
        description,
        specialty_required,
        location

      })
    } catch (dbError) {
      console.error("DB createMission error:", dbError)
      return NextResponse.json({ error: `DB error: ${dbError instanceof Error ? dbError.message : dbError}` }, { status: 500 })
    }

    return NextResponse.json({ mission }, { status: 201 })
  } catch (error) {
    console.error("POST /missions error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
