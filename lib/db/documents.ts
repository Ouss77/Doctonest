import { sql } from "./client"

export async function getDocumentsByUser(user_id: string) {
  try {
    const result = await sql`
      SELECT * FROM documents WHERE user_id = ${user_id} ORDER BY uploaded_at DESC
    `
    return result
  } catch (error) {
    console.error("Error getting documents by user:", error)
    return []
  }
}
