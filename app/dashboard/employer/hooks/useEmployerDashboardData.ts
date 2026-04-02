"use client"

import { useEffect, useState } from "react"

export function useEmployerDashboardData() {
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur lors du chargement du profil")
        const data = await res.json()
        setEmployerId(data.user?.id || null)
        setProfileData(data.profile || null)
      } catch {
        setError("Impossible de charger le profil utilisateur")
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (!employerId) return

    setLoading(true)
    setError(null)

    fetch(`/api/missions?employerId=${employerId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setMissions(data.missions || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Erreur lors du chargement des missions")
        setLoading(false)
      })
  }, [employerId])

  return {
    missions,
    setMissions,
    loading,
    setLoading,
    error,
    setError,
    employerId,
    profileData,
  }
}