"use client"

import { useEffect, useMemo, useState } from "react"

type User = {
  id: number
  name: string
  email: string
  type: string
  specialty?: string
  location: string
  created_at?: string
  status: string
  documents: string[]
}

export function useAdminUsersData() {
  const [allDoctors, setAllDoctors] = useState<User[]>([])
  const [allEmployers, setAllEmployers] = useState<User[]>([])
  const [userTypeFilter, setUserTypeFilter] = useState<"doctor" | "employer">(
    "doctor"
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" })
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des utilisateurs")
        }

        const data = await res.json()

        const doctors: User[] = (data.doctors || []).map((u: any) => ({
          id: u.id,
          name:
            (u.first_name ? u.first_name : "") +
            (u.last_name ? " " + u.last_name : ""),
          email: u.email,
          type: "Médecin remplaçant",
          specialty: u.specialty || undefined,
          location: u.location || "",
          created_at: u.created_at
            ? new Date(u.created_at).toLocaleDateString()
            : "",
          status: u.profile_status || u.rp_status || "pending",
          documents: [],
        }))

        const employers: User[] = (data.employers || []).map((u: any) => ({
          id: u.id,
          name:
            u.organization_name ||
            (u.first_name ? u.first_name : "") +
              (u.last_name ? " " + u.last_name : ""),
          email: u.email,
          type: "Établissement",
          specialty: undefined,
          location: u.address || u.city || "",
          created_at: u.created_at
            ? new Date(u.created_at).toLocaleDateString()
            : "",
          status: u.profile_status || u.ep_status || "pending",
          documents: [],
        }))

        setAllDoctors(doctors)
        setAllEmployers(employers)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const users = useMemo(
    () => (userTypeFilter === "doctor" ? allDoctors : allEmployers),
    [allDoctors, allEmployers, userTypeFilter]
  )

  return {
    users,
    userTypeFilter,
    setUserTypeFilter,
    loading,
    error,
  }
}
