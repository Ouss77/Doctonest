import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }
    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Cet email n’est pas inscrit. Vérifiez l’adresse ou créez d’abord un compte",
        },
        { status: 404 }
      );
    }
    // Generate a reset token (simple random string for demo, use JWT or crypto in prod)
    const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
    // Save token and expiry to user (implement this in your db, or use a separate table)
    await db.savePasswordResetToken(user.id, token, Date.now() + 1000 * 60 * 30); // 30 min expiry
    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    const hasSmtpConfig =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
      console.error("SMTP not configured, cannot send reset email");
      return NextResponse.json(
        { error: "La configuration email est manquante." },
        { status: 500 }
      );
    }
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
    await transporter.verify();
    console.log("SMTP connecté avec succès");
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@doctonest.com',
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetUrl}">${resetUrl}</a></p>`
      });
    } catch (mailError) {
      console.error("Reset email delivery failed:", mailError);
      return NextResponse.json(
        { error: "Impossible d'envoyer l'email de réinitialisation." },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Erreur lors de la demande de réinitialisation." }, { status: 500 });
  }
}
