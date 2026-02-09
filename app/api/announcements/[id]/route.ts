import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const rows = await sql`
      SELECT
        m.id,
        m.title,
        m.specialty_required AS specialty,
        m.location,
        m.description,
        m.mission_type,
        m.status,
        m.created_at AS posted_date,
        ep.organization_name,
        u.first_name,
        u.last_name,
        u.phone,
        (u.phone IS NOT NULL) AS hide_contact
      FROM missions m
      LEFT JOIN users u ON m.employer_id = u.id
      LEFT JOIN employer_profiles ep ON u.id = ep.user_id
      WHERE m.id = ${id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    return NextResponse.json({ success: true, announcement: rows[0] });
  } catch (err) {
    console.error('GET /api/announcements/[id] error:', err);
    const message = process.env.NODE_ENV === 'production' ? 'Erreur serveur' : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
