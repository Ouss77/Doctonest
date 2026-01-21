"use client"
import { Button } from "@/components/ui/button"
import { Bell, Home, Briefcase, Mail, User, FileText, LogOut, Search, Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth"
import ProfileHeader from "./components/ProfileHeader"
import AvailableMissionsSection from "./components/AvailableMissionsSection"
import MyMissionsSection from "./components/MyMissionsSection"
import DiplomasSection from "./components/DiplomasSection"
import FeedSection from "./components/FeedSection"
import EditProfileDialog from "./components/EditProfileDialog"

export default function ReplacementDashboard() {
  const { user, profile, loading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("feed")
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [profileData, setProfileData] = useState({
    userId: "",
    imageProfile: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    availability: "",
    profession: "",
    experience_years: 0,
    is_available: false,
  })

  useEffect(() => { 
    if (user && profile) {
      setProfileData({
        userId: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        imageProfile: profile.photo_url || "",
        specialty: profile.specialty || "",
        location: profile.location || "",
        availability: profile.availability || "",
        profession: profile.profession || "",
        experience_years: profile.experience_years || 0,
        is_available: profile.is_available ?? false,
      })
    }
  }, [user, profile])

  const navigationItems = [
    { id: "feed", label: "Accueil", icon: Home },
    { id: "missions", label: "Missions", icon: Briefcase },
    { id: "profile", label: "Profil", icon: User },
  ]

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

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        // Page Accueil avec feed LinkedIn/Facebook style
        return <FeedSection />
      case "missions":
        return (
          <div className="space-y-4">
            <AvailableMissionsSection />
          </div>
        )
      case "profile":
        // Expériences et formations uniquement dans le tab Profile
        return (
          <div className="space-y-4">
            <MyMissionsSection />
            <DiplomasSection />
          </div>
        )
      default:
        return null
    }
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
              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right: User Menu and Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Mail className="w-5 h-5" />
              </button>
              
              {/* Bouton Déconnexion - Plus visible */}
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Déconnexion</span>
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* User Avatar - Cliquable avec dropdown pour déconnexion */}
              <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md p-2 group relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  {profileData.imageProfile ? (
                    <img
                      src={profileData.imageProfile}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {profileData.firstName?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-gray-900">{profileData.firstName}</div>
                  <div className="text-xs text-gray-500">Mon profil</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
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

      {/* Main Content Area - LinkedIn Feed Style - Élargi */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header - Visible uniquement dans le tab Profile */}
        {activeTab === "profile" ? (
          <ProfileHeader
            profileData={profileData}
            setProfileData={setProfileData}
            isEditProfileOpen={isEditProfileOpen}
            setIsEditProfileOpen={setIsEditProfileOpen}
          />
        ) : null}

        {/* Feed Content */}
        <div className="space-y-4">
          {renderContent()}
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profileData={profileData}
        setProfileData={setProfileData}
        fileInputRef={fileInputRef}
        previewUrl={previewUrl || profileData.imageProfile}
        setPreviewUrl={(url) => {
          setPreviewUrl(url)
          if (typeof url === 'string') {
            setProfileData(prev => ({ ...prev, imageProfile: url }))
          }
        }}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
    </div>
  )
}
