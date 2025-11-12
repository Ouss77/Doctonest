import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
const sql = neon(process.env.DATABASE_URL!);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const body = await request.json();
    const { status } = body;
    if (!status || !['open','in_progress','completed','cancelled','active','rejected','pending'].includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    try {
      const updated = await sql`
        UPDATE missions
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, status
      `;
      if (!updated || updated.length === 0) {
        return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });
      }

      return NextResponse.json({ success: true, mission: updated[0] });
    } catch (dbErr) {
      console.error('DB update error (missions):', dbErr);
      const message = process.env.NODE_ENV === 'production' ? 'Erreur base de données' : String(dbErr);
      return NextResponse.json({ error: message }, { status: 500 });
    }

  } catch (err) {
    console.error('PATCH /api/missions/[id]/status error:', err);
    const message = process.env.NODE_ENV === 'production' ? 'Erreur serveur' : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
