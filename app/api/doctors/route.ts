export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

import { NextResponse } from "next/server"
import { db } from "@/lib/database"

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
}

// GET /api/doctors - List approved replacement doctors
export async function GET() {
  try {
    const doctors = await db.getApprovedReplacementDoctors()
    return NextResponse.json(
      { doctors },
      { headers: noStoreHeaders }
    )
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: noStoreHeaders }
    )
  }
}
