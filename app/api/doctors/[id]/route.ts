export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextResponse } from "next/server";
import { db } from "@/lib/database";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

// GET /api/doctors/[id] - Get all details for a specific doctor, including experiences, diplomas, and personal details
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Fetch user details
    const user = await db.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404, headers: noStoreHeaders });
    }
    // Only keep public fields
    const publicUser = {
      id: user.id,
      first_name: user.first_name, 
      last_name: user.last_name,
    };
    if (user.user_type !== "replacement") {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404, headers: noStoreHeaders });
    }
    // Fetch replacement profile
    const profile = await db.getReplacementProfile(id);
    if (!profile || profile.profile_status !== "approved") {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404, headers: noStoreHeaders });
    }
    // Fetch experiences
    const experiences = await db.getExperiences(id);
    // Fetch diplomas
    const diplomas = await db.getDiplomasByUser(id);
    // Combine all data

    return NextResponse.json({
      ...publicUser,
      profile,
      experiences,
      diplomas,
    }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: noStoreHeaders });
  }
}
