export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Get user experiences
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    if (decoded.userType !== "replacement") {
      return NextResponse.json({ error: "Only replacement doctors have experiences" }, { status: 403 })
    }

    const experiences = await db.getExperiences(decoded.userId)

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error("Experiences fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add new experience
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
    }

    if (decoded.userType !== "replacement") {
      return NextResponse.json({ error: "Only replacement doctors can add experiences" }, { status: 403 })
    }

    const body = await request.json()
    const {
      workplaceName,
      workplaceType,
      location,
      startDate,
      endDate,
      durationMonths,
      specialty,
      description,
      referenceContact,
      referencePhone,
      referenceEmail,
    } = body

    if (!workplaceName || !workplaceType || !location || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const experience = await db.createExperience({
      replacement_id: decoded.userId,
      workplace_name: workplaceName,
      workplace_type: workplaceType,
      location,
      start_date: startDate,
      end_date: endDate,
      duration_months: durationMonths ? Number.parseInt(durationMonths) : undefined,
      specialty,
      description,
      reference_contact: referenceContact,
      reference_phone: referencePhone,
      reference_email: referenceEmail,
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error("Experience creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
