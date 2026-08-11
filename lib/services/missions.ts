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
  employer_id?: string | null
  title: string
  description: string
  specialty_required: string
  location: string
  status?: string
  mission_type?: string
  start_date?: string
  end_date?: string
  is_guest?: boolean
  guest_email?: string | null
  guest_name?: string | null
  edit_token?: string | null
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
    INSERT INTO missions (
      employer_id,
      title,
      description,
      specialty_required,
      location,
      status,
      is_guest,
      guest_email,
      guest_name,
      edit_token
    )
    VALUES (
      ${payload.employer_id || null},
      ${payload.title},
      ${payload.description},
      ${payload.specialty_required}, 
      ${payload.location},
      ${payload.status || 'pending'},
      ${payload.is_guest || false},
      ${payload.guest_email || null},
      ${payload.guest_name || null},
      ${payload.edit_token || null}
    )
    RETURNING *
  `

  return result[0]
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getPublicMissionById(id: string) {
  if (!UUID_RE.test(id)) return null

  const result = await sql`
    SELECT m.*, ep.organization_name, u.first_name, u.last_name, u.phone
    FROM missions m
    LEFT JOIN users u ON m.employer_id = u.id
    LEFT JOIN employer_profiles ep ON u.id = ep.user_id
    WHERE m.id = ${id} AND m.status = 'public'
    LIMIT 1
  `

  return result[0] || null
}

async function getMissionByEditToken(editToken: string) {
  const result = await sql`
    SELECT m.*, ep.organization_name, u.first_name, u.last_name, u.phone
    FROM missions m
    LEFT JOIN users u ON m.employer_id = u.id
    LEFT JOIN employer_profiles ep ON u.id = ep.user_id
    WHERE m.edit_token = ${editToken}
    LIMIT 1
  `

  return result[0] || null
}

async function updateMissionByEditToken(
  editToken: string,
  updates: Partial<Pick<CreateMissionInput, "title" | "description" | "specialty_required" | "location">>
) {
  const result = await sql`
    UPDATE missions
    SET title = COALESCE(${updates.title || null}, title),
        description = COALESCE(${updates.description || null}, description),
        specialty_required = COALESCE(${updates.specialty_required || null}, specialty_required),
        location = COALESCE(${updates.location || null}, location),
        updated_at = NOW()
    WHERE edit_token = ${editToken}
    RETURNING *
  `

  return result[0] || null
}

async function deleteMissionByEditToken(editToken: string) {
  const result = await sql`
    DELETE FROM missions
    WHERE edit_token = ${editToken}
    RETURNING id
  `

  return result[0] || null
}

export const missionsService = {
  list: listMissions,
  create: createMission,
  getPublicById: getPublicMissionById,
  getByEditToken: getMissionByEditToken,
  updateByEditToken: updateMissionByEditToken,
  deleteByEditToken: deleteMissionByEditToken,
}

// Named exports for convenience
export const getMissions = listMissions
export { createMission }
