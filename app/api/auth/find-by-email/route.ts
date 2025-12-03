import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }
  try {
    const users = await sql`SELECT id, email, user_type FROM users WHERE email = ${email} LIMIT 1`;
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ user: users[0], success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
