import { sql } from "./client"

export async function createExperience(experienceData: {
  replacement_id: string
  workplace_name: string
  workplace_type: string
  location: string
  start_date: string
  end_date?: string
  duration_months?: number
  specialty?: string
  description?: string
  reference_contact?: string
  reference_phone?: string
  reference_email?: string
}) {
  try {
    const result = await sql`
      INSERT INTO experiences (
        replacement_id, workplace_name, workplace_type, location,
        start_date, end_date, duration_months, specialty, description,
        reference_contact, reference_phone, reference_email
      )
      VALUES (
        ${experienceData.replacement_id}, ${experienceData.workplace_name},
        ${experienceData.workplace_type}, ${experienceData.location},
        ${experienceData.start_date}, ${experienceData.end_date || null},
        ${experienceData.duration_months || null}, ${experienceData.specialty || null},
        ${experienceData.description || null}, ${experienceData.reference_contact || null},
        ${experienceData.reference_phone || null}, ${experienceData.reference_email || null}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating experience:", error)
    throw new Error("Failed to create experience")
  }
}

export async function updateExperience(
  id: string,
  replacement_id: string,
  data: {
    workplace_name: string
    workplace_type: string
    location: string
    start_date: string
    end_date?: string
    duration_months?: number
    specialty?: string
    description?: string
    reference_contact?: string
    reference_phone?: string
    reference_email?: string
  }
) {
  try {
    await sql`
      UPDATE experiences 
      SET workplace_name = ${data.workplace_name},
          workplace_type = ${data.workplace_type},
          location = ${data.location},
          start_date = ${data.start_date},
          end_date = ${data.end_date || null},
          duration_months = ${data.duration_months || null},
          specialty = ${data.specialty || null},
          description = ${data.description || null},
          reference_contact = ${data.reference_contact || null},
          reference_phone = ${data.reference_phone || null},
          reference_email = ${data.reference_email || null}
      WHERE id = ${id} AND replacement_id = ${replacement_id}
    `
    return true
  } catch (error) {
    console.error("Error updating experience:", error)
    throw new Error("Failed to update experience")
  }
}

export async function deleteExperience(id: string, replacement_id: string) {
  try {
    await sql`
      DELETE FROM experiences 
      WHERE id = ${id} AND replacement_id = ${replacement_id}
    `
    return true
  } catch (error) {
    console.error("Error deleting experience:", error)
    throw new Error("Failed to delete experience")
  }
}

export async function getExperiences(replacement_id: string) {
  try {
    const result = await sql`
      SELECT * FROM experiences 
      WHERE replacement_id = ${replacement_id}
      ORDER BY start_date DESC
    `
    return result
  } catch (error) {
    console.error("Error getting experiences:", error)
    return []
  }
}
