export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db, sql } from "@/lib/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyAuthToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return { error: "Authentication required", status: 401 };
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };
    return { decoded };
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAuthToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { decoded } = auth;
    if (!decoded || decoded.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const userId = params.id;
    const body = await request.json();
    const { profile_status } = body;
    if (!profile_status || !["pending", "approved", "rejected"].includes(profile_status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
    // Try to update both replacement and employer profiles
    await sql`
      UPDATE replacement_profiles SET profile_status = ${profile_status} WHERE user_id = ${userId}
    `;
    await sql`
      UPDATE employer_profiles SET profile_status = ${profile_status} WHERE user_id = ${userId}
    `;
    return NextResponse.json({ message: "Status updated", profile_status });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
