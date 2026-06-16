"use client"

import { Button } from "@/components/ui/button"
import { Home, Briefcase, User, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"

const navigationItems = [
  { href: "/dashboard/replacement/feed", label: "Accueil", icon: Home },
  { href: "/dashboard/replacement/missions", label: "Missions", icon: Briefcase },
  { href: "/dashboard/replacement/profile", label: "Profil", icon: User },
]

export default function ReplacementDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerImgError, setHeaderImgError] = useState(false)

  // Reset the error flag whenever the profile photo URL is refreshed
  useEffect(() => {
    setHeaderImgError(false)
  }, [profile?.photo_url])
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Button onClick={() => (window.location.href = "/login")} className="bg-blue-600 hover:bg-blue-700">
            Se connecter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-blue-100 flex-shrink-0">
                <img src="/logo.png" alt="DoctoNest" className="w-full h-full object-cover" />
              </div>
              <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                DoctoNest
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 min-w-[160px] justify-end">
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Déconnexion</span>
              </Button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link
                href="/dashboard/replacement/profile"
                className="hidden md:flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2.5 py-1.5 transition-all border border-transparent hover:border-gray-200 group"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-blue-100 shadow-sm flex-shrink-0">
                  {profile?.photo_url && !headerImgError ? (
                    <img
                      src={profile.photo_url}
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                      onError={() => setHeaderImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-blue-500 font-medium group-hover:text-blue-600">Mon profil</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  )
}