"use client"

import { useEffect, useState } from "react"

export type AdminMission = {
  id: number
  title: string
  employer: string
  location: string
  dates: string
  salary: string
  status: string
  applicants: number
  publishedDate: string
  email?: string
  description?: string
  author?: string
}

export function useAdminMissionsData() {
  const [missions, setMissions] = useState<AdminMission[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/missions")
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`)
        }

        const { missions = [] } = await res.json()

        const mapped: AdminMission[] = missions.map((m: any) => ({
          id: m.id,
          title: m.title ?? "Sans titre",
          employer: m.organization_name ?? "",
          location: m.location ?? "",
          dates:
            m.dates ??
            (m.start_date && m.end_date ? `${m.start_date} → ${m.end_date}` : ""),
          status: m.status ?? "pending",
          applicants: m.applications_count ?? 0,
          publishedDate: m.created_at ?? "",
          email: m.email ?? "Not found",
          description: m.description ?? "No description provided",
          author:
            m.first_name || m.last_name
              ? `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim()
              : undefined,
          salary: "",
        }))

        setMissions(mapped)
      } catch (err: any) {
        setError(err.message ?? "Erreur lors du chargement des missions")
        setMissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [])

  return {
    missions,
    loading,
    error,
  }
}
