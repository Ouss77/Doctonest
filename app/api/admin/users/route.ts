export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"


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

// Get all doctors and employers (admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuthToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { decoded } = auth;
    if (!decoded || decoded.userType !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    // Fetch both replacement doctors and employers
    // Fetch doctors and employers, ensuring profile_status is included
    const doctors = await db.getReplacementDoctors();
    const employers = await db.getEmployers();
    // Map status for each
    const mappedDoctors = doctors.map((u: any) => ({ ...u, profile_status: u.profile_status || u.rp_status || "pending" }));
    const mappedEmployers = employers.map((u: any) => ({ ...u, profile_status: u.profile_status || u.ep_status || "pending" }));
    return NextResponse.json({ doctors: mappedDoctors, employers: mappedEmployers })
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
