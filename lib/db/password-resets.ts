import { sql } from "./client"

export async function savePasswordResetToken(userId: string, token: string, expiresAt: number) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      )
    `
    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${userId}, ${token}, to_timestamp(${expiresAt} / 1000.0))
      ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = to_timestamp(${expiresAt} / 1000.0)
    `
  } catch (error) {
    console.error("Error saving password reset token:", error)
    throw new Error("Failed to save password reset token")
  }
}
