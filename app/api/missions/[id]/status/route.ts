// app/api/missions/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL!);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 }); 

    const body = await request.json();
    const { status: action } = body;
    if (!action) {
      return NextResponse.json({ error: "Action manquante" }, { status: 400 });
    }

    // Map frontend action to DB status
    // Database schema allows: 'open', 'in_progress', 'completed', 'cancelled'
    const statusMap: Record<string, string> = {
      approve: "in_progress",      // Approve = make active (in_progress)
      active: "in_progress",        // Active = in_progress
      reject: "cancelled",          // Reject = cancelled
      rejected: "cancelled",        // Rejected = cancelled
      hidden: "cancelled",          // Hidden = cancelled (or could be kept as open but filtered)
      delete: "cancelled",          // Delete = cancelled (soft delete)
      deleted: "cancelled",         // Deleted = cancelled
      pending: "open",              // Pending = open (waiting approval)
      open: "open",                 // Open = open
      completed: "completed",      // Completed = completed
      cancelled: "cancelled",       // Cancelled = cancelled
      in_progress: "in_progress",   // In progress = in_progress
    };

    const status = statusMap[action.toLowerCase()];
    if (!status) {
      return NextResponse.json(
        { error: `Action invalide pour les missions: ${action}. Actions valides: approve, reject, hidden, open, completed, cancelled` },
        { status: 400 }
      );
    }

    const updated = await sql`
      UPDATE missions
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, mission: updated[0] });
  } catch (err) {
    console.error("PATCH /api/missions/[id]/status error:", err);
    const message =
      process.env.NODE_ENV === "production" ? "Erreur serveur" : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
