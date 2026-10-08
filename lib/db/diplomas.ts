import { sql } from "./client"

export async function getDiplomasByUser(user_id: string) {
  try {
    const result = await sql`
      SELECT * FROM diplomas WHERE user_id = ${user_id} ORDER BY year DESC, created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error getting diplomas:", error)
    return []
  }
}

export async function createDiploma(diplomaData: {
  user_id: string
  title: string
  institution: string
  year?: string
  description?: string
}) {
  try {
    const result = await sql`
      INSERT INTO diplomas (user_id, title, institution, year, description)
      VALUES (${diplomaData.user_id}, ${diplomaData.title}, ${diplomaData.institution}, ${diplomaData.year || null}, ${diplomaData.description || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating diploma:", error)
    throw new Error("Failed to create diploma")
  }
}

export async function deleteDiploma({ id, user_id }: { id: string; user_id: string }) {
  try {
    const result = await sql`
      DELETE FROM diplomas WHERE id = ${id} AND user_id = ${user_id} RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error deleting diploma:", error)
    throw new Error("Failed to delete diploma")
  }
}

export async function updateDiploma(diplomaData: {
  id: string
  user_id: string
  title: string
  institution: string
  year?: string
  description?: string
}) {
  try {
    const result = await sql`
      UPDATE diplomas
      SET
        title = ${diplomaData.title},
        institution = ${diplomaData.institution},
        year = ${diplomaData.year || null},
        description = ${diplomaData.description || null}
      WHERE id = ${diplomaData.id}
        AND user_id = ${diplomaData.user_id}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error updating diploma:", error)
    throw new Error("Failed to update diploma")
  }
}
