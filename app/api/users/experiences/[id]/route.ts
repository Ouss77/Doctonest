export const dynamic = "force-dynamic"

// PATCH experience (alias for PUT)
export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx);
}
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Update experience
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Only replacement doctors can update experiences" }, { status: 403 })
    }

    const body = await request.json()
    const {
      workplaceName,
      workplaceType,
      location,
      startDate,
      endDate,
      specialty,
      description,
      referenceContact,
      referencePhone,
      referenceEmail,
    } = body


    await db.updateExperience(
      params.id,
      decoded.userId,
      {
        workplace_name: workplaceName,
        workplace_type: workplaceType,
        location,
        start_date: startDate,
        end_date: endDate,
        specialty,
        description,
        reference_contact: referenceContact,
        reference_phone: referencePhone,
        reference_email: referenceEmail,
      }
    );

    return NextResponse.json({ message: "Experience updated successfully" })
  } catch (error) {
    console.error("Experience update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete experience
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Only replacement doctors can delete experiences" }, { status: 403 })
    }

  await db.deleteExperience(params.id, decoded.userId)

    return NextResponse.json({ message: "Experience deleted successfully" })
  } catch (error) {
    console.error("Experience deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
 