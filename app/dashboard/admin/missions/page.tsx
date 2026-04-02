"use client"

import { useState } from "react"
import TabMissions from "../_components/TabMissions"
import MissionDetailsModal from "../_components/MissionDetailsModal"
import { useAdminMissionsData } from "../hooks/useAdminMissionsData"

export default function AdminMissionsPage() {
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const { missions, loading, error } = useAdminMissionsData()

  if (loading) {
    return <div className="p-8 text-center text-blue-600">Chargement des missions...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <>
      <TabMissions missions={missions as any} setSelectedMission={setSelectedMission} />
      {selectedMission && (
        <MissionDetailsModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}
    </>
  )
}
