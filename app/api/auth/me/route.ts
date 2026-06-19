export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import jwt from "jsonwebtoken"
import { existsSync, readdirSync } from "fs"
import path from "path"

const JWT_SECRET = process.env.JWT_SECRET || "medical-replacement-platform-secret-key-2024"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No authentication token" }, { status: 401 })
    }

    let decoded: { userId: string; email: string; userType: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; userType: string }
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const user = await db.getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let profile = null
    if (user.user_type === "replacement") {
      profile = await db.getReplacementProfile(user.id)
    } else if (user.user_type === "employer") {
      profile = await db.getEmployerProfile(user.id)
    }

    // Auto-heal stale photo_url: if the stored file no longer exists on disk,
    // find the most recent upload for this user and update the DB.
    let resolvedProfile = profile
    if (profile?.photo_url) {
      const rel = profile.photo_url.startsWith("/") ? profile.photo_url.slice(1) : profile.photo_url
      const fullPath = path.join(process.cwd(), "public", rel)
      if (!existsSync(fullPath)) {
        const uploadDir = path.join(process.cwd(), "public", "uploads")
        try {
          const candidates = readdirSync(uploadDir)
            .filter(f => f.startsWith(user.id + "_") && /\.(png|jpe?g|webp|JPG|PNG)$/.test(f))
            .sort()
            .reverse() // highest timestamp = most recent
          const healedUrl = candidates.length > 0 ? `/uploads/${candidates[0]}` : null
          if (healedUrl) {
            await db.updateProfilePhoto(user.id, user.user_type as "replacement" | "employer", healedUrl)
          }
          resolvedProfile = { ...profile, photo_url: healedUrl }
        } catch {
          resolvedProfile = { ...profile, photo_url: null }
        }
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
      profile: resolvedProfile,
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
