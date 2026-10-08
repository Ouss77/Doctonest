"use client"

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarItems: { id: string; label: string; icon: any; badge: any }[]
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeTab,
  setActiveTab,
  sidebarItems,
}: SidebarProps) {
  const { user, logout } = useAuth()

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim()
  const displayName = fullName || "Administrateur"
  const email = user?.email || ""
  const initials = (user?.firstName?.[0] || "A") + (user?.lastName?.[0] || "")

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-20" : "w-64"
      } h-screen bg-[#071d45] shadow-xl transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-0 z-40`}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="DoctoNest"
              className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/10"
            />
            <span className="text-lg font-semibold text-white tracking-tight truncate">
              DoctoNest
            </span>
          </div>
        )}
        {sidebarCollapsed && (
          <img
            src="/logo.png"
            alt="DoctoNest"
            className="h-10 w-10 rounded-xl object-cover shadow-md mx-auto border border-white/10"
          />
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors ${
            sidebarCollapsed ? "hidden" : ""
          }`}
          aria-label={sidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="mx-auto mt-3 p-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Agrandir le menu"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-blue-100/80 hover:bg-white/10 hover:text-white"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10 flex-shrink-0 flex flex-col gap-3">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {initials.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                Admin · {displayName}
              </p>
              <p className="text-xs text-blue-200 truncate">{email}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {initials.toUpperCase()}
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-colors border border-white/10 bg-white/5 text-red-300 hover:bg-red-500/20 hover:text-red-100 hover:border-red-400/30 ${
            sidebarCollapsed ? "justify-center" : "justify-center"
          }`}
        >
          <LogOut className="h-4 w-4" />
          {!sidebarCollapsed && "Se déconnecter"}
        </button>
      </div>
    </div>
  )
}
