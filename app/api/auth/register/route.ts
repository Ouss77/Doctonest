export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);

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
      specialty // Added specialty field
    } = await request.json();

    // Validate required fields
    // if (!email || !password || !userType || !firstName || !lastName) {
    //   return NextResponse.json(
    //     { error: 'Tous les champs requis doivent être remplis' },
    //     { status: 400 }
    //   );
    // }
if (password) {
  if (!email || !userType || !firstName) {
    return NextResponse.json(
      { error: 'Email, type et prénom requis pour la création de compte' },
      { status: 400 }
    );
  }
}

    // Validate medical specialty for doctors
    if (userType === 'replacement' && profession === 'Médecin' && !specialty) {
      return NextResponse.json(
        { error: 'La spécialité médicale est requise pour les médecins' },
        { status: 400 }
      );
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

    // Create user
    const user = await sql`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone)
      VALUES (${email}, ${password}, ${userType}, ${firstName}, ${lastName}, ${phone})
      RETURNING id, email, user_type, first_name, last_name, phone
    `;

    const userId = user[0].id;

    // Create profile based on user type
    if (userType === 'replacement') {
      await sql`
        INSERT INTO replacement_profiles (user_id, profession, specialty, location)
        VALUES (${userId}, ${profession || ''}, ${specialty || ''}, ${location || ''})
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
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error: any) {
  console.error('Registration error details:', error);
  return NextResponse.json(
    { error: error.message || 'Erreur serveur lors de l\'inscription' },
    { status: 500 }
  );
}
}
