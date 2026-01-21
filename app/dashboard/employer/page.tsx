"use client"

import { Bell, Home, Briefcase, Users, UserCheck, Building2, FileText, Mail, LogOut, Search, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import MissionsList from "./components/MissionsList"
import DoctorsList from "./components/DoctorsList"
import ProfileTabs from "./components/ProfileTabs"
import EmployerDocumentsSection from "./components/EmployerDocumentsSection"
import Candidature from "./components/Candidature"
import EmployerProfileHeader from "./components/EmployerProfileHeader"
import FeedSection from "../replacement/components/FeedSection"

export default function EmployerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"feed" | "missions" | "doctors" | "applications" | "profile" | "documents">("feed")
  const [showCreateMission, setShowCreateMission] = useState(false)
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur lors du chargement du profil")
        const data = await res.json()
        setEmployerId(data.user?.id || null)
        setProfileData(data.profile || null)
      } catch (err) {
        setError("Impossible de charger le profil utilisateur")
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!employerId) return
    setLoading(true)
    setError(null)
    fetch(`/api/missions?employerId=${employerId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setMissions(data.missions || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Erreur lors du chargement des missions")
        setLoading(false)
      })
  }, [employerId])

  const pendingApplications = 7

  const navigationItems: { id: typeof activeTab; label: string; icon: any; badge?: number }[] = [
    { id: "feed", label: "Accueil", icon: Home },
    { id: "missions", label: "Missions", icon: Briefcase },
    { id: "doctors", label: "Médecins", icon: Users },
    { id: "applications", label: "Candidatures", icon: UserCheck, badge: pendingApplications },
    { id: "profile", label: "Établissement", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <FeedSection />
      case "missions":
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
      case "doctors":
        return <DoctorsList />
      case "applications":
        return <Candidature missions={missions} />
      case "profile":
        return <ProfileTabs />
      case "documents":
        return employerId ? <EmployerDocumentsSection employerId={employerId} /> : null
      default:
        return null
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - LinkedIn Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo and Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Logo Le Foyer Médical"
                  className="h-10 w-10 rounded-full"
                />
                <span className="hidden md:block text-xl font-bold text-gray-900">Le Foyer Médical</span>
              </div>
              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium flex items-center gap-1">
                      {item.label}
                      {item.badge && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] rounded-full bg-red-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Mail className="w-5 h-5" />
              </button> */}
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Déconnexion</span>
              </Button>
              <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Employer Profile Header only on profile tab */}
        {activeTab === "profile" && profileData && (
          <EmployerProfileHeader profileData={profileData} />
        )}

        {/* Page Content */}
        <div className="space-y-4">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

