"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Users, FileText, CheckCircle, BarChart3 } from "lucide-react"
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeTab = useMemo(() => {
    const tab = pathname.split("/")[3]
    if (tab && allowedTabs.includes(tab as (typeof allowedTabs)[number])) {
      return tab
    }
    return "users"
  }, [pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 font-['Nunito', 'Segoe UI', 'Arial', 'sans-serif'] text-[16px] md:text-[17px]">
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
          <div className="px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
