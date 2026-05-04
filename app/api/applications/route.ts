export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/database";
// GET /api/applications?userId=... or /api/applications?missionId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url); 
    const userId = searchParams.get("userId"); 
    const missionId = searchParams.get("missionId");
    if (missionId) {
      const applications = await db.getApplications({ mission_id: missionId });
      return NextResponse.json({ applications });
    } else if (userId) {
      const applications = await db.getApplications({ replacement_id: userId });
      return NextResponse.json({ applications });
    } else {
      return NextResponse.json({ error: "Missing missionId or userId" }, { status: 400 });
    }
  } catch (error) {
    console.error("[APPLICATION-API] Error (GET):", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications
export async function POST(req: Request) {
  try {
    const { missionId, userId } = await req.json();
    if (!missionId || !userId) {
      return NextResponse.json({ error: "Missing missionId or userId" }, { status: 400 });
    }
    // Save application in DB
    const application = await db.createApplication({ mission_id: missionId, replacement_id: userId });
    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("[APPLICATION-API] Error:", error);
    return NextResponse.json({ error: "Failed to apply to mission" }, { status: 500 });
  }
}
