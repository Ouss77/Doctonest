import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!");
  console.error("Please create a .env.local file with your database connection string:");
  console.error("DATABASE_URL=postgresql://username:password@host:port/database");
  console.error("");
  console.error("You can get a free Neon database at: https://neon.tech");
  console.error("");
  throw new Error("DATABASE_URL is not set. Please check the console for setup instructions.");
}

export const sql = neon(process.env.DATABASE_URL);

export const db = {
  async savePasswordResetToken(userId: string, token: string, expiresAt: number) {
    try {
      await sql`
        INSERT INTO password_resets (user_id, token, expires_at)
        VALUES (${userId}, ${token}, to_timestamp(${expiresAt} / 1000.0))
        ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = to_timestamp(${expiresAt} / 1000.0)
      `;
    } catch (error) {
      console.error("Error saving password reset token:", error);
      throw new Error("Failed to save password reset token");
    }
  },
  async getEmployers() {
    try {
      const result = await sql`
        SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
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
  },
  async getReplacementDoctors() {
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
  },
  // User operations
  async createUser(userData: {
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
  },

  async getUserByEmail(email: string) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email} AND is_active = true
      `
      return result[0]
    } catch (error) {
      console.error("Error getting user by email:", error)
      return null
    }
  },

  async getUserById(id: string) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${id} AND is_active = true
      `
      return result[0]
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  },

  // Replacement profile operations
  async createReplacementProfile(profileData: {
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
  },

  async getReplacementProfile(user_id: string) {
    try {
      const result = await sql`
  SELECT rp.photo_url, rp.profession, rp.specialty, rp.location, rp.bio,
  rp.availability_start, rp.availability_end, rp.is_available, rp.languages, rp.profile_status,
  rp.experience_years, u.first_name, u.last_name, u.email, u.phone
        FROM replacement_profiles rp
        JOIN users u ON rp.user_id = u.id
        WHERE rp.user_id = ${user_id}
      `
      return result[0]
    } catch (error) {
      console.error("Error getting replacement profile:", error)
      return null
    }
  },

  // Employer profile operations
  async createEmployerProfile(profileData: {
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
  },

  async getEmployerProfile(user_id: string) {
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
  },

  // Mission operations
  async createMission(missionData: {
    employer_id: string
    title: string
    description: string
    specialty_required: string
    location: string
  }) {
    try {
      const result = await sql`
        INSERT INTO missions (employer_id, title, description, specialty_required, location)
        VALUES (
          ${missionData.employer_id},
          ${missionData.title},
          ${missionData.description},
          ${missionData.specialty_required},
          ${missionData.location}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating mission:", error)
      throw new Error("Failed to create mission")
    }
  },

  async getMissions(filters?: {
    specialty?: string
    location?: string
    status?: string
    employer_id?: string
  }) {
    try {
      let query = sql`
        SELECT m.*, ep.organization_name, u.first_name, u.last_name, u.email,
          (SELECT COUNT(*) FROM applications a WHERE a.mission_id = m.id) AS applications_count
        FROM missions m
        JOIN users u ON m.employer_id = u.id
        LEFT JOIN employer_profiles ep ON u.id = ep.user_id
        WHERE 1=1
      `

      if (filters?.specialty) {
        query = sql`${query} AND m.specialty_required = ${filters.specialty}`
      }
      if (filters?.location) {
        query = sql`${query} AND m.location ILIKE ${"%" + filters.location + "%"}`
      }
      if (filters?.status) {
        query = sql`${query} AND m.status = ${filters.status}`
      }
      if (filters?.employer_id) {
        query = sql`${query} AND m.employer_id = ${filters.employer_id}`
      }

      query = sql`${query} ORDER BY m.created_at DESC`

      return await query
    } catch (error) {
      console.error("Error getting missions:", error)
      return []
    }
  },

  // Application operations
  async createApplication(applicationData: {
    mission_id: string;
    replacement_id: string;
    cover_letter?: string;
    proposed_rate?: number;
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
  },

  async getApplications(filters?: {
    mission_id?: string;
    replacement_id?: string;
    status?: string;
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
      `;
      const conditions = [];
      if (filters?.mission_id) {
        conditions.push(sql`a.mission_id = ${filters.mission_id}`);
      }
      if (filters?.replacement_id) {
        conditions.push(sql`a.replacement_id = ${filters.replacement_id}`);
      }
      if (filters?.status) {
        conditions.push(sql`a.status = ${filters.status}`);
      }
      let query = base;
      if (conditions.length > 0) {
        query = sql`${base} WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}`;
      }
      query = sql`${query} ORDER BY a.applied_at DESC`;
      return await query;
    } catch (error) {
      console.error("Error getting applications:", error);
      return [];
    }
  },

  // Experience operations
  async createExperience(experienceData: {
    replacement_id: string;
    workplace_name: string;
    workplace_type: string;
    location: string;
    start_date: string;
    end_date?: string;
    duration_months?: number;
    specialty?: string;
    description?: string;
    reference_contact?: string;
    reference_phone?: string;
    reference_email?: string;
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
  },

  async updateExperience(id: string, replacement_id: string, 
    data: {
    workplace_name: string;
    workplace_type: string;
    location: string;
    start_date: string;
    end_date?: string;
    duration_months?: number;
    specialty?: string;
    description?: string;
    reference_contact?: string;
    reference_phone?: string;
    reference_email?: string;
  }) {
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
      return true;
    } catch (error) {
      console.error("Error updating experience:", error)
      throw new Error("Failed to update experience")
    }
  },

  async deleteExperience(id: string, replacement_id: string) {
    try {
      await sql`
        DELETE FROM experiences 
        WHERE id = ${id} AND replacement_id = ${replacement_id}
      `
      return true;
    } catch (error) {
      console.error("Error deleting experience:", error)
      throw new Error("Failed to delete experience")
    }
  },

  async getExperiences(replacement_id: string) {
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
  },

    // Diploma operations
  async getDiplomasByUser(user_id: string) {
    try {
      const result = await sql`
        SELECT * FROM diplomas WHERE user_id = ${user_id} ORDER BY year DESC, created_at DESC
      `
      return result
    } catch (error) {
      console.error("Error getting diplomas:", error)
      return []
    }
  },

  async createDiploma(diplomaData: {user_id: string, title: string, institution: string, year?: string, description?: string
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
  },

  async deleteDiploma({ id, user_id }: { id: string; user_id: string }) {
    try {
      const result = await sql`
        DELETE FROM diplomas WHERE id = ${id} AND user_id = ${user_id} RETURNING *
      `
      return result[0] || null
    } catch (error) {
      console.error("Error deleting diploma:", error)
      throw new Error("Failed to delete diploma")
    }
  },

  async updateProfilePhoto(user_id: string, user_type: "replacement" | "employer", photo_url: string) {
    try {
      let result;
      if (user_type === "replacement") {
        result = await sql`
          UPDATE replacement_profiles SET photo_url = ${photo_url} WHERE user_id = ${user_id} RETURNING *
        `;
      } else if (user_type === "employer") {
        result = await sql`
          UPDATE employer_profiles SET photo_url = ${photo_url} WHERE user_id = ${user_id} RETURNING *
        `;
      } else {
        throw new Error("Invalid user type");
      }
      return result[0];
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw new Error("Failed to update profile photo");
    }
  },

  // Document operations
  async getDocumentsByUser(user_id: string) {
    try {
      const result = await sql`
        SELECT * FROM documents WHERE user_id = ${user_id} ORDER BY uploaded_at DESC
      `;
      return result;
    } catch (error) {
      console.error("Error getting documents by user:", error);
      return [];
    }
  }
}
