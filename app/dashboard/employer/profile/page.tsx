"use client"

import { useRouter } from "next/navigation"
import ProfileTabs from "../_components/profile/ProfileTabs"

export default function EmployerProfilePage() {
  const router = useRouter()

  return (
    <ProfileTabs
      onOpenDocuments={() => router.push("/dashboard/employer/documents")}
    />
  )
}
