import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
const sql = neon(process.env.DATABASE_URL!);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { senderName, senderEmail, senderPhone, message } = body;

    if (!senderName?.trim() || !senderEmail?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Nom, email et message sont obligatoires' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    const rows = await sql`
      SELECT m.title, m.guest_email, m.guest_name, u.email AS employer_email
      FROM missions m
      LEFT JOIN users u ON m.employer_id = u.id
      WHERE m.id = ${id} AND m.status = 'public'
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    const mission = rows[0];
    const recipientEmail = mission.guest_email || mission.employer_email;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email de contact de l'annonceur non disponible" },
        { status: 400 }
      );
    }

    const hasSmtpConfig =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
      console.warn('SMTP not configured, contact email skipped for announcement:', id);
      return NextResponse.json(
        { error: 'Service email non configuré' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@doctonest.com',
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `Candidature pour votre annonce : ${mission.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <div style="background: linear-gradient(135deg, #1d4ed8, #4f46e5); padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Nouvelle candidature reçue</h1>
            <p style="margin: 6px 0 0; color: #bfdbfe; font-size: 14px;">Via DoctoNest</p>
          </div>
          <div style="background: #f8fafc; padding: 28px 32px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="margin: 0 0 16px; font-size: 15px;">
              Bonjour${mission.guest_name ? ` <strong>${mission.guest_name}</strong>` : ''},
            </p>
            <p style="margin: 0 0 20px; font-size: 15px; color: #334155;">
              Vous avez reçu une candidature pour votre annonce <strong style="color: #1d4ed8;">${mission.title}</strong>.
            </p>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 14px; font-size: 16px; color: #1e293b;">Informations du candidat</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 120px;">Nom :</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${senderName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Email :</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #1d4ed8;">
                    <a href="mailto:${senderEmail}" style="color: #1d4ed8; text-decoration: none;">${senderEmail}</a>
                  </td>
                </tr>
                ${senderPhone ? `
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Téléphone :</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${senderPhone}</td>
                </tr>` : ''}
              </table>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">Message</h2>
              <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line;">${message}</p>
            </div>

            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
              Pour répondre directement au candidat, utilisez son adresse email :
              <a href="mailto:${senderEmail}" style="color: #1d4ed8;">${senderEmail}</a>
            </p>
          </div>
          <div style="background: #f1f5f9; padding: 16px 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">DoctoNest — Plateforme de remplacement médical</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/announcements/[id]/contact error:', err);
    const message = process.env.NODE_ENV === 'production' ? 'Erreur serveur' : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
