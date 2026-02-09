import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }
    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      // Always return success for security
      return NextResponse.json({ success: true });
    }
    // Generate a reset token (simple random string for demo, use JWT or crypto in prod)
    const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
    // Save token and expiry to user (implement this in your db, or use a separate table)
    await db.savePasswordResetToken(user.id, token, Date.now() + 1000 * 60 * 30); // 30 min expiry
    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@doctonest.com',
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetUrl}">${resetUrl}</a></p>`
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Erreur lors de la demande de réinitialisation." }, { status: 500 });
  }
}
