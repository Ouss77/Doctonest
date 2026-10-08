import { sql } from "./client"

export async function getEmployers() {
  try {
    const result = await sql`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
      ep.organization_name, ep.organization_type, ep.address, ep.city, ep.contact_person, ep.description, ep.profile_status
      FROM users u
      JOIN employer_profiles ep ON u.id = ep.user_id
      WHERE u.user_type = 'employer'
      ORDER BY ep.organization_name
    `
    return result
  } catch (error) {
    console.error("Error fetching employers:", error)
    return []
  }
}

export async function createEmployerProfile(profileData: {
  user_id: string
  organization_name: string
  organization_type: string
  address: string
  city: string
  description?: string
  website?: string
}) {
  try {
    // Map organization type to database enum values
    const typeMapping: { [key: string]: string } = {
      "Hôpital public": "hospital",
      "Clinique privée": "clinic",
      "Cabinet médical": "clinic",
      "Maison de santé": "clinic",
      "Centre de soins": "clinic",
      EHPAD: "clinic",
      "Médecin indépendant": "independent",
    }

    const mappedType = typeMapping[profileData.organization_type] || "clinic"

    const result = await sql`
      INSERT INTO employer_profiles (
        user_id, organization_name, organization_type, 
        address, city, description
      )
      VALUES (
        ${profileData.user_id}, ${profileData.organization_name}, 
        ${mappedType}, ${profileData.address}, ${profileData.city},
        ${profileData.description || null}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating employer profile:", error)
    throw new Error("Failed to create employer profile")
  }
}

export async function getEmployerProfile(user_id: string) {
  try {
    const result = await sql`
      SELECT ep.*, u.first_name, u.last_name, u.email, u.phone
      FROM employer_profiles ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.user_id = ${user_id}
    `
    return result[0]
  } catch (error) {
    console.error("Error getting employer profile:", error)
    return null
  }
}
