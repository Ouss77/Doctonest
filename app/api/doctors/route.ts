export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { db } from "@/lib/database" 

// GET /api/doctors - List all available replacement doctors
export async function GET() {
  try {
    // Only fetch users with type 'replacement' and active
    const doctors = await db.getApprovedReplacementDoctors()
    return NextResponse.json({ doctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
