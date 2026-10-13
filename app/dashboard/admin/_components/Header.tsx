"use client"

import { useAuth } from "@/lib/auth"

interface HeaderProps {
  activeTab: string
  sidebarItems: { id: string; label: string; icon: any; badge: any }[]
}

export default function Header({ activeTab, sidebarItems }: HeaderProps) {
  const { user } = useAuth()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim()
  const displayName = fullName || "Administrateur"
  const email = user?.email || ""
  const initials = (user?.firstName?.[0] || "A") + (user?.lastName?.[0] || "")
  const currentLabel = sidebarItems.find((item) => item.id === activeTab)?.label

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-600">Administration</p>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">{currentLabel}</h1>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block text-right min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              Admin · {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#071d45] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initials.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
