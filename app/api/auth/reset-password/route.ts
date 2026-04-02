import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetRecord = await sql`
      SELECT user_id, expires_at FROM password_resets 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (resetRecord.length === 0) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    const userId = resetRecord[0].user_id;
    const hashedPassword = await hash(password, 12);
    // Update user's password
    await sql`
      UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${userId}
    `;

    // Delete the reset token
    await sql`
      DELETE FROM password_resets WHERE token = ${token}
    `;

    return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}