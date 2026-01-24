"use client"

import { Bell, Home, Briefcase, Users, UserCheck, Building2, Mail, LogOut, Search, Menu, Heart, MessageCircle, Share2, Bookmark, MoreVertical, Calendar, TrendingUp, Users as UsersIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import MissionsList from "./components/mission/MissionsList"
import DoctorsList from "./components/DoctorsList"
import ProfileTabs from "./components/profile/ProfileTabs"
import EmployerDocumentsSection from "./components/profile/EmployerDocumentsSection"

import Candidature from "./components/Candidature"

export default function EmployerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"feed" | "missions" | "doctors" | "applications" | "profile" | "documents">("feed")
  const [showCreateMission, setShowCreateMission] = useState(false)
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

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
  ]

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    if (tab === "feed") {
      params.delete("tab")
    } else {
      params.set("tab", tab)
    }
    const query = params.toString()
    router.push(query ? `/dashboard/employer?${query}` : `/dashboard/employer`, { scroll: false })
  }

  useEffect(() => {
    const tab = searchParams.get("tab") as typeof activeTab | null
    if (tab && ["feed", "missions", "doctors", "applications", "profile", "documents"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <ComingSoonFeed />
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
        return <ProfileTabs onOpenDocuments={() => handleTabChange("documents")} />
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
                <span className="hidden md:block text-xl font-bold text-gray-900">DoctoNest</span>
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
        {/* Page Content */}
        <div className="space-y-4">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

// Design de feed LinkedIn/Facebook
function ComingSoonFeed() {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likes, setLikes] = useState(42)
  const [comments, setComments] = useState(8)

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <div className="space-y-4">
      {/* Zone de création de post (vide mais stylisée) */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            DN
          </div>
          <div className="flex-1">
            <div 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-text text-gray-500"
              onClick={() => alert("Bientôt disponible !")}
            >
              Partagez une actualité avec votre communauté...
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Photo</span>
          </button>
          <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Vidéo</span>
          </button>
          <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Événement</span>
          </button>
        </div>
      </div>

      {/* Post officiel DoctoNest */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* En-tête du post */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  DN
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">DoctoNest</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Officiel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Entreprise • Technologie Médicale</span>
                  <span className="text-gray-300">•</span>
                  <span>2h</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu du post */}
        <div className="p-4">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Annonce importante</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              🎉 Une nouvelle ère commence sur DoctoNest !
            </h2>
            <p className="text-gray-700 mb-4">
              Nous sommes ravis de vous annoncer que nous travaillons actuellement sur 
              <span className="font-semibold text-blue-600"> notre toute nouvelle section "Fil d'Actualités"</span> !
            </p>
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-gray-700 italic">
                "Imaginez un espace où vous pourrez échanger avec vos collègues, 
                partager des opportunités, et rester informé des dernières tendances 
                du secteur médical. C'est exactement ce que nous préparons pour vous !"
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              Cette fonctionnalité vous permettra de :
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: UsersIcon, text: "Réseauter avec des médecins" },
                { icon: Bell, text: "Recevoir des alertes personnalisées" },
                { icon: Briefcase, text: "Découvrir des opportunités" },
                { icon: MessageCircle, text: "Échanger avec la communauté" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Graphique placeholder */}
          <div className="mb-4 overflow-hidden rounded-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
              <div className="max-w-md mx-auto">
                <div className="text-4xl font-bold mb-2">EN DÉVELOPPEMENT</div>
                <div className="text-xl font-light mb-4">Lancement prévu : Décembre 2024</div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats du post */}
          <div className="flex items-center justify-between text-sm text-gray-500 py-3 border-t border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span>{likes} mentions J'aime • {comments} commentaires</span>
            </div>
            <span>5 partages</span>
          </div>

          {/* Actions du post */}
          <div className="grid grid-cols-4 py-2">
            <button 
              onClick={handleLike}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${liked ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} />
              <span className="font-medium">J'aime</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Commenter</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Partager</span>
            </button>
            <button 
              onClick={handleBookmark}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${bookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600' : ''}`} />
              <span className="font-medium">Enregistrer</span>
            </button>
          </div>
        </div>

        {/* Commentaires placeholder */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Les commentaires seront bientôt disponibles...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}