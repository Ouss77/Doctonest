import { sql } from "./client"

export async function getReplacementDoctors() {
  try {
    const result = await sql`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
        rp.photo_url, rp.profession, rp.specialty, rp.location, rp.created_at, rp.bio, rp.availability_start,
        rp.availability_end, rp.experience_years, rp.is_available, rp.profile_status
      FROM users u
      JOIN replacement_profiles rp ON u.id = rp.user_id
      WHERE u.user_type = 'replacement'
      ORDER BY u.first_name, u.last_name
    `
    return result
  } catch (error) {
    console.error("Error fetching replacement doctors:", error)
    return []
  }
}

export async function getApprovedReplacementDoctors() {
  try {
    const result = await sql`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
        rp.photo_url, rp.profession, rp.specialty, rp.location, rp.created_at, rp.bio, rp.availability_start,
        rp.availability_end, rp.experience_years, rp.is_available, rp.profile_status
      FROM users u
      JOIN replacement_profiles rp ON u.id = rp.user_id
      WHERE u.user_type = 'replacement'
        AND rp.profile_status = 'approved'
      ORDER BY u.first_name, u.last_name
    `
    return result
  } catch (error) {
    console.error("Error fetching approved replacement doctors:", error)
    return []
  }
}

export async function createReplacementProfile(profileData: {
  user_id: string
  profession: string
  location: string
}) {
  try {
    const result = await sql`
      INSERT INTO replacement_profiles (
        user_id, profession, location, specialty
      )
      VALUES (
        ${profileData.user_id}, ${profileData.profession}, ${profileData.location}, 'medecin generaliste'
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating replacement profile:", error)
    throw new Error("Failed to create replacement profile")
  }
}

export async function getReplacementProfile(user_id: string) {
  try {
    const result = await sql`
      SELECT rp.photo_url, rp.profession, rp.specialty, rp.location, rp.bio,
      rp.is_available, rp.languages, rp.profile_status, rp.experience_years, u.first_name, u.last_name, u.email, u.phone
      FROM replacement_profiles rp
      JOIN users u ON rp.user_id = u.id
      WHERE rp.user_id = ${user_id}
    `
    return result[0]
  } catch (error) {
    console.error("Error getting replacement profile:", error)
    return null
  }
}
