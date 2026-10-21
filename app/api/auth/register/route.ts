export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { sql } from "@/lib/database";

const REPLACEMENT_PROFESSIONS = ["Médecin", "Dentiste"] as const

export async function POST(request: NextRequest) {
  try {
    const { 
      email,  
      password, 
      userType, 
      firstName, 
      lastName, 
      phone, 
      location, 
      companyName, 
      companyType, 
      description, 
      profession, 
      specialty, // Added specialty field
      hideContact = false
    } = await request.json();

if (!password || !email || !userType || !firstName) {
    return NextResponse.json(
      { error: 'Email, mot de passe, type et prénom requis pour la création de compte' },
      { status: 400 }
    );
}

    if (userType === "replacement") {
      const allowedProfession = (REPLACEMENT_PROFESSIONS as readonly string[]).includes(profession)
      if (!allowedProfession) {
        return NextResponse.json(
          { error: "Profession non autorisée. Choisissez Médecin ou Dentiste." },
          { status: 400 }
        )
      }
      if (!String(specialty || "").trim()) {
        return NextResponse.json(
          { error: "La spécialité est requise" },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Create user — always persist the phone entered at signup
    const normalizedPhone =
      typeof phone === "string" && phone.trim() ? phone.trim() : null;
    const hashedPassword = await hash(password, 12);

    const user = await sql`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone)
      VALUES (${email}, ${hashedPassword}, ${userType}, ${firstName}, ${lastName}, ${normalizedPhone})
      RETURNING id, email, user_type, first_name, last_name, phone
    `;

    const userId = user[0].id;

    if (userType === 'replacement') {
      const trimmedSpecialty = typeof specialty === "string" ? specialty.trim() : ""
      const trimmedProfession = typeof profession === "string" ? profession.trim() : ""
      const normalizedSpecialty = trimmedSpecialty || (trimmedProfession === "Médecin" ? "Médecine générale" : trimmedProfession)

      await sql`
        INSERT INTO replacement_profiles (user_id, profession, specialty, location)
        VALUES (${userId}, ${trimmedProfession}, ${normalizedSpecialty}, ${location || ''})
      `;
    } else if (userType === 'employer') {
  // Map frontend fields to DB schema
  const organization_name = companyName || '';
  const organization_type = companyType || 'independent';
  const address = location || '';
  const city = location || '';

  await sql`
    INSERT INTO employer_profiles (
      user_id,organization_name,
      organization_type,
      address,
      city,
      description
    ) VALUES ( 
      ${userId},
      ${organization_name},
      ${organization_type},
      ${address},
      ${city},
      ${description || ''}
    )
  `;
}

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: userId,
        email,
        userType,
        firstName,
        lastName,
        hideContact: Boolean(hideContact),
      },
    });

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60,
    }
    response.cookies.set('auth-token', token, cookieOptions)
    response.cookies.set('token', token, cookieOptions)

    return response;

  } catch (error: any) {
  console.error('Registration error details:', error);
  return NextResponse.json(
    { error: error.message || 'Erreur serveur lors de l\'inscription' },
    { status: 500 }
  );
}
}
