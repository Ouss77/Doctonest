"use client"

import { useState } from "react"
import MissionsList from "../_components/mission/MissionsList"
import { useEmployerDashboardData } from "../hooks/useEmployerDashboardData"

export default function EmployerMissionsPage() {
  const [showCreateMission, setShowCreateMission] = useState(false)
  const {
    missions,
    setMissions,
    loading,
    setLoading,
    error,
    setError,
    employerId,
  } = useEmployerDashboardData()

  return (
    <MissionsList
      setShowCreateMission={setShowCreateMission}
      missions={missions}
      setMissions={setMissions}
      employerId={employerId}
      loading={loading}
      setLoading={setLoading}
      error={error}
      setError={setError}
    />
  )
}
