export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

// Advanced mission search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const specialty = searchParams.get("specialty")
    const location = searchParams.get("location")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const minRate = searchParams.get("minRate")
    const maxRate = searchParams.get("maxRate")
    const isUrgent = searchParams.get("isUrgent")
    const missionType = searchParams.get("missionType")

    let sqlQuery = db.sql`
      SELECT m.*, ep.organization_name, u.first_name, u.last_name
      FROM missions m
      LEFT JOIN users u ON m.employer_id = u.id
      LEFT JOIN employer_profiles ep ON u.id = ep.user_id
      WHERE m.status = 'open'
    `

    if (query) {
      sqlQuery = db.sql`${sqlQuery} AND (m.title ILIKE ${"%" + query + "%"} OR m.description ILIKE ${"%" + query + "%"})`
    }

    if (specialty) {
      sqlQuery = db.sql`${sqlQuery} AND m.specialty_required = ${specialty}`
    }

    if (location) {
      sqlQuery = db.sql`${sqlQuery} AND m.location ILIKE ${"%" + location + "%"}`
    }

    if (startDate) {
      sqlQuery = db.sql`${sqlQuery} AND m.start_date >= ${startDate}`
    }

    if (endDate) {
      sqlQuery = db.sql`${sqlQuery} AND m.end_date <= ${endDate}`
    }

    if (minRate) {
      sqlQuery = db.sql`${sqlQuery} AND (m.daily_rate >= ${Number.parseFloat(minRate)} OR m.hourly_rate >= ${Number.parseFloat(minRate)})`
    }

    if (maxRate) {
      sqlQuery = db.sql`${sqlQuery} AND (m.daily_rate <= ${Number.parseFloat(maxRate)} OR m.hourly_rate <= ${Number.parseFloat(maxRate)})`
    }


    if (missionType) {
      sqlQuery = db.sql`${sqlQuery} AND m.mission_type = ${missionType}`
    }

    sqlQuery = db.sql`${sqlQuery} ORDER BY m.is_urgent DESC, m.created_at DESC`

    const missions = await sqlQuery

    return NextResponse.json({ missions })
  } catch (error) {
    console.error("Mission search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
