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
    if (!status) {
      return NextResponse.json({ error: 'Statut manquant' }, { status: 400 });
    }

    // Map front-end status values to DB allowed statuses for missions table
    const statusMap: Record<string, string> = {
      // friendly / legacy values -> DB values
      'approve': 'open',
      'approved': 'open',
      'active': 'open',
      'reject': 'cancelled',
      'rejected': 'cancelled',
      // allow direct DB statuses if provided
      'open': 'open',
      'in_progress': 'in_progress',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    const mappedStatus = statusMap[String(status).toLowerCase()];
    if (!mappedStatus) {
      return NextResponse.json({ error: 'Statut invalide ou non autorisé pour les missions' }, { status: 400 });
    }

    // Update mission status (use missions table, not announcements)
    try {
      const updated = await sql`
        UPDATE missions
        SET status = ${mappedStatus}, updated_at = NOW()
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
    console.error('PATCH /api/announcements/[id]/status error:', err);
    const message = process.env.NODE_ENV === 'production' ? 'Erreur serveur' : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
