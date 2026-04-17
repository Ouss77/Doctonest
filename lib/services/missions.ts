import { sql } from "@/lib/database"
 
export type MissionFilters = {
  specialty?: string
  location?: string
  status?: string
  employerId?: string
}

export type MissionVisibility = "public" | "private" | "mine"

type ListMissionsOptions = {
  visibility?: MissionVisibility
  userId?: string
  userType?: "replacement" | "employer" | "admin"
}

export type CreateMissionInput = {
  employer_id: string
  title: string
  description: string
  specialty_required: string
  location: string
  status?: string
  mission_type?: string
  start_date?: string
  end_date?: string
}
 
async function listMissions(
  filters: MissionFilters = {},
  options: ListMissionsOptions = {}
) {
  const visibility = options.visibility || "public"

  let query = sql`
    SELECT m.*, ep.organization_name, u.first_name, u.last_name, u.phone,
      (SELECT COUNT(*) FROM applications a WHERE a.mission_id = m.id) AS applications_count
    FROM missions m
    LEFT JOIN users u ON m.employer_id = u.id
    LEFT JOIN employer_profiles ep ON u.id = ep.user_id
    WHERE 1=1
  `

  // Admin users can access all missions regardless of visibility.
  if (options.userType === "admin") {
    // no restriction
  } else if (visibility === "public") {
    query = sql`${query} AND m.status = 'public'`
  } else if (visibility === "private") {
    query = sql`${query} AND m.status = 'private'`
  } else if (visibility === "mine") {
    query = sql`${query}
      AND m.employer_id = ${options.userId}
    `
  }

  // 🎯 Filtres métier autorisés
  if (filters.specialty) {
    query = sql`${query} AND m.specialty_required = ${filters.specialty}`
  }

  if (filters.location) {
    query = sql`${query} AND m.location ILIKE ${"%" + filters.location + "%"}`
  }

  query = sql`${query} ORDER BY m.created_at DESC`

  return await query
}

async function createMission(payload: CreateMissionInput) {
  const result = await sql`
    INSERT INTO missions (employer_id, title, description, specialty_required, location, status)
    VALUES (
      ${payload.employer_id},
      ${payload.title},
      ${payload.description},
      ${payload.specialty_required}, 
      ${payload.location},
      ${payload.status || 'pending'}
    )
    RETURNING *
  `

  return result[0]
}

export const missionsService = {
  list: listMissions,
  create: createMission, 
}

// Named exports for convenience
export const getMissions = listMissions
export { createMission }
