import { sql } from "./client"

export async function updateProfilePhoto(
  user_id: string,
  user_type: "replacement" | "employer",
  photo_url: string
) {
  try {
    let result
    if (user_type === "replacement") {
      result = await sql`
        UPDATE replacement_profiles SET photo_url = ${photo_url} WHERE user_id = ${user_id} RETURNING *
      `
    } else if (user_type === "employer") {
      result = await sql`
        UPDATE employer_profiles SET photo_url = ${photo_url} WHERE user_id = ${user_id} RETURNING *
      `
    } else {
      throw new Error("Invalid user type")
    }
    return result[0]
  } catch (error) {
    console.error("Error updating profile photo:", error)
    throw new Error("Failed to update profile photo")
  }
}
