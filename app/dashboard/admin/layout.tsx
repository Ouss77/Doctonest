"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Users, FileText, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import Sidebar from "./_components/Sidebar"
import Header from "./_components/Header"

const sidebarItems = [
  { id: "users", label: "Utilisateurs", icon: Users, badge: null },
  { id: "missions", label: "Missions", icon: FileText, badge: null },
  { id: "documents", label: "Documents", icon: CheckCircle, badge: null },
  { id: "analytics", label: "Analyses", icon: BarChart3, badge: null },
]

const allowedTabs = ["users", "missions", "documents", "analytics"] as const

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeTab = useMemo(() => {
    const tab = pathname.split("/")[3]
    if (tab && allowedTabs.includes(tab as (typeof allowedTabs)[number])) {
      return tab
    }
    return "users"
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 border border-slate-100">
          <img src="/logo.png" alt="DoctoNest" className="h-12 w-12 rounded-xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Accès non autorisé</h1>
          <p className="text-slate-600 mb-6">Vous devez être connecté pour accéder à l'administration.</p>
          <Button onClick={() => (window.location.href = "/login")} className="bg-blue-600 hover:bg-blue-700">
            Se connecter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[16px]">
      <div className="flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={(tab) => router.push(`/dashboard/admin/${tab}`)}
          sidebarItems={sidebarItems}
        />

        <div
          className={`flex-1 min-h-screen ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } transition-all duration-300`}
        >
          <Header activeTab={activeTab} sidebarItems={sidebarItems} />
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
