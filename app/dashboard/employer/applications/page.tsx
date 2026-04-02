"use client"

import Candidature from "../components/Candidature"
import { useEmployerDashboardData } from "../hooks/useEmployerDashboardData"

export default function EmployerApplicationsPage() {
  const { missions } = useEmployerDashboardData()

  return <Candidature missions={missions} />
}
