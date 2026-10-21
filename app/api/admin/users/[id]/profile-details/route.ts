import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    // Get experiences
    const experiences = await db.getExperiences(userId);
    // Get diplomas
    const diplomas = await db.getDiplomasByUser(userId);

    return NextResponse.json({
      experiences,
      diplomas,
    });
  } catch (error) {
    console.error("Profile details fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
