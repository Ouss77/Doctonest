"use client"

import EmployerDocumentsSection from "../_components/profile/EmployerDocumentsSection"
import { useEmployerDashboardData } from "../hooks/useEmployerDashboardData"

export default function EmployerDocumentsPage() {
  const { employerId } = useEmployerDashboardData()

  if (!employerId) {
    return null
  }

  return <EmployerDocumentsSection employerId={employerId} />
}
