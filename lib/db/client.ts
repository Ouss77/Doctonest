import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!")
  console.error("Please create a .env.local file with your database connection string:")
  console.error("DATABASE_URL=postgresql://username:password@host:port/database")
  console.error("")
  console.error("You can get a free Neon database at: https://neon.tech")
  console.error("")
  throw new Error("DATABASE_URL is not set. Please check the console for setup instructions.")
}

export const sql = neon(process.env.DATABASE_URL)
