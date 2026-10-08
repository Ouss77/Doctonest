import { sql } from "./client"

export async function createApplication(applicationData: {
  mission_id: string
  replacement_id: string
  cover_letter?: string
  proposed_rate?: number
}) {
  try {
    const result = await sql`
      INSERT INTO applications (mission_id, replacement_id, cover_letter, proposed_rate)
      VALUES (${applicationData.mission_id}, ${applicationData.replacement_id}, 
              ${applicationData.cover_letter || null}, ${applicationData.proposed_rate || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating application:", error)
    throw new Error("Failed to create application")
  }
}

export async function getApplications(filters?: {
  mission_id?: string
  replacement_id?: string
  status?: string
}) {
  try {
    let base = sql`
      SELECT a.*, m.title as mission_title, m.specialty_required,
             u.id as user_id, u.first_name, u.last_name, u.email, u.phone,
             rp.photo_url, rp.specialty, rp.location
      FROM applications a
      JOIN missions m ON a.mission_id = m.id
      JOIN users u ON a.replacement_id = u.id
      LEFT JOIN replacement_profiles rp ON u.id = rp.user_id
    `
    const conditions = []
    if (filters?.mission_id) {
      conditions.push(sql`a.mission_id = ${filters.mission_id}`)
    }
    if (filters?.replacement_id) {
      conditions.push(sql`a.replacement_id = ${filters.replacement_id}`)
    }
    if (filters?.status) {
      conditions.push(sql`a.status = ${filters.status}`)
    }
    let query = base
    if (conditions.length > 0) {
      query = sql`${base} WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}`
    }
    query = sql`${query} ORDER BY a.applied_at DESC`
    return await query
  } catch (error) {
    console.error("Error getting applications:", error)
    return []
  }
}
