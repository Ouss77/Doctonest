import { sql } from "./client"

export async function createUser(userData: {
  email: string
  password_hash: string
  user_type: "replacement" | "employer" | "admin"
  first_name?: string
  last_name?: string
  phone?: string
}) {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone)
      VALUES (${userData.email}, ${userData.password_hash}, ${userData.user_type}, 
              ${userData.first_name || null}, ${userData.last_name || null}, ${userData.phone || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} 
    `
    return result[0]
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id} 
    `
    return result[0]
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}
