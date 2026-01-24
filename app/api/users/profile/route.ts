import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken" 
import { sql, db } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "medical-replacement-platform-secret-key-2024"

// Get user profile
export async function GET(request: NextRequest) {
  try {
  const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      userType: string
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

    // Format profile data to match frontend expectations
    let formattedProfile = null;
    if (profile) {
      if (user.user_type === "replacement") {
        formattedProfile = {
          specialty: profile.specialty,
          profession: profile.profession,
          location: profile.location,
          experience_years: profile.experience_years,
          languages: Array.isArray(profile.languages) ? profile.languages : (profile.languages ? [profile.languages] : []),
          bio: profile.bio,
          is_available: profile.is_available,
          photo_url: profile.photo_url,
          profile_status: profile.profile_status,
        };
      } else if (user.user_type === "employer") {
        formattedProfile = {
          organization_name: profile.organization_name,
          organization_type: profile.organization_type,
          siret_number: profile.siret_number,
          address: profile.address,
          description: profile.description,
          fonction: profile.fonction,
          photo_url: profile.photo_url,
        };
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
      profile: formattedProfile,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let decoded: { userId: string; userType: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    // Accept both flat and nested employer fields
    const { firstName, lastName, email, phone, profileData,
      establishment_name, establishment_type, address, siret, description, fonction
    } = body;

    if (!firstName && !lastName && !email && !phone && !profileData && !establishment_name && !establishment_type && !address && !siret && !description && !fonction) {
      return NextResponse.json({ error: "No profile data provided" }, { status: 400 })
    }

    // Update basic user info
    if (firstName || lastName || email || phone) {
      try {
        await sql`
          UPDATE users 
          SET first_name = ${firstName || null}, 
              last_name = ${lastName || null}, 
              email = ${email || null},
              phone = ${phone || null},
              updated_at = NOW()
          WHERE id = ${decoded.userId}
        `
      } catch (err) {
        console.error("User update error:", err)
        return NextResponse.json({ error: "Failed to update user info" }, { status: 500 })
      }
    }

    // Update profile-specific data
    if (profileData && decoded.userType === "replacement") {
      try {
        await sql`
          UPDATE replacement_profiles 
          SET specialty = ${profileData.specialty || null},
              profession = ${profileData.profession || null},
              location = ${profileData.location || null},
              experience_years = ${profileData.experience_years || null},
              diploma = ${profileData.diploma || null},
              languages = ${profileData.languages || []},
              bio = ${profileData.bio || null},
              is_available = ${typeof profileData.is_available === 'boolean' ? profileData.is_available : null},
              photo_url = ${profileData.photo_url || profileData.photoUrl || null},
              updated_at = NOW()
          WHERE user_id = ${decoded.userId}
        `
      } catch (err) {
        console.error("Replacement profile update error:", err)
        return NextResponse.json({ error: "Failed to update replacement profile" }, { status: 500 })
      }
    } else if ((profileData && decoded.userType === "employer") || (decoded.userType === "employer" && (establishment_name || establishment_type || address || siret || description))) {
      // Accept both nested and flat employer fields
      const employer = profileData || {};
      try {
        await sql`
          UPDATE employer_profiles 
          SET organization_name = ${employer.organizationName || establishment_name || null},
              organization_type = ${employer.organizationType || establishment_type || null},
              siret_number = ${employer.siretNumber || siret || null},
              address = ${employer.address || address || null},
              description = ${employer.description || description || null},
              fonction = ${employer.fonction || fonction || null},
              photo_url = ${employer.photoUrl || profileData?.photoUrl || null},
              updated_at = NOW()
          WHERE user_id = ${decoded.userId}
        `
      } catch (err) {
        console.error("Employer profile update error:", err)
        return NextResponse.json({ error: "Failed to update employer profile" }, { status: 500 })
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
