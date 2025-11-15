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

    // Adjust query to match your missions table/schema
    const rows = await sql`
      SELECT
        id,
        title,
        specialty_required AS specialty,
        location,
        description,
        start_date,
        end_date,
        mission_type,
        status,
        created_at AS posted_date
      FROM missions
      WHERE id = ${id}
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
