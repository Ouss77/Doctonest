import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/database";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extract user from JWT (copied from diplomas/route.ts)
function getUserFromJWT(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      userType?: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromJWT(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const diplomaId = params.id;
  try {
    // Only allow user to delete their own diploma
    const deleted = await db.deleteDiploma({ id: diplomaId, user_id: user.userId });
    if (!deleted) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Diplomas API][DELETE] Diploma deletion error:", error, { userId: user.userId, diplomaId });
    return NextResponse.json({ error: "Erreur lors de la suppression du diplôme" }, { status: 500 });
  }
}
 
// ✅ Update diplomas

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromJWT(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diplomaId = params.id;
  console.log("UPDATE DIPLOMA", {
  diplomaId,
  userId: user.userId,
});

  try {
    const body = await req.json();

    const {
      title,
      institution,
      year,
      description,
    } = body;

    const updated = await db.updateDiploma({
      id: diplomaId,
      user_id: user.userId,
      title: title.trim(),
      institution: institution.trim(),
      year: year || null,
      description: description || null,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Diplôme introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      diploma: updated,
    });
  } catch (error) {
    console.error("[Diplomas][PUT] error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du diplôme" },
      { status: 500 }
    );
  }
}