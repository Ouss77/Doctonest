import { NextResponse } from "next/server";
import { db } from "@/lib/database";

// GET /api/doctors/[id] - Get all details for a specific doctor, including experiences, diplomas, and personal details
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Fetch user details
    const user = await db.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    // Only keep public fields
    const publicUser = {
      id: user.id,
      first_name: user.first_name, 
      last_name: user.last_name,
    };
    // Fetch replacement profile
    const profile = await db.getReplacementProfile(id);
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
    });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
