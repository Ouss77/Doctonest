"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription,} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {  FileText,  MapPin,  Calendar,  BarChart3,  Eye,  CheckCircle,  XCircle,  Trash2,  Search,
  Clock,  User,  Mail,} from "lucide-react"
import { Button } from "@/components/ui/button"

export type Mission = {
  id: string
  title: string
  location: string
  status: "pending" | "public" | "private" | "refused"
  applicants: number
  publishedDate?: string
  author?: string
  email?: string
}

interface TabMissionsProps {
  missions: Mission[]
  setSelectedMission: (mission: Mission) => void
}

export default function TabMissions({
  missions,
  setSelectedMission,
}: TabMissionsProps) {
  const [processingIds, setProcessingIds] = useState<string[]>([])
  const [localMissions, setLocalMissions] = useState<Mission[]>(missions)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "public" | "private" | "refused"
  >("all")

  const router = useRouter()

  const getStatusConfig = (status: Mission["status"]) => {
    const configs = {
      pending: {
        label: "En attente",
        color: "text-amber-700",
        bgColor: "bg-amber-50 border-amber-200",
        icon: Clock,
      },
      public: {
        label: "Publique",
        color: "text-green-700",
        bgColor: "bg-green-50 border-green-200",
        icon: CheckCircle,
      },
      private: {
        label: "Privée",
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        icon: Eye,
      },
      refused: {
        label: "Refusée",
        color: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
        icon: XCircle,
      },
    }
    return configs[status] ?? configs.pending
  }

  const updateStatus = async (
    missionId: string,
    newStatus: "public" | "refused"
  ) => {
    if (processingIds.includes(missionId)) return

    setProcessingIds((p) => [...p, missionId])

    try {
      const res = await fetch(`/api/missions/${missionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Erreur serveur")

      setLocalMissions((prev) =>
        prev.map((m) =>
          m.id === missionId ? { ...m, status: newStatus } : m
        )
      )

      alert(
        newStatus === "public"
          ? "Mission approuvée"
          : "Mission refusée"
      )

      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la mise à jour")
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== missionId))
    }
  }

  const deleteMission = async (missionId: string) => {
    if (processingIds.includes(missionId)) return
    if (!confirm("Supprimer définitivement cette mission ?")) return

    setProcessingIds((p) => [...p, missionId])

    try {
      const res = await fetch(`/api/missions/${missionId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Erreur suppression")

      setLocalMissions((prev) =>
        prev.filter((m) => m.id !== missionId)
      )

      alert("Mission supprimée")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la suppression")
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== missionId))
    }
  }

  const filteredMissions = localMissions.filter((mission) => {
    const matchesSearch =
      !searchQuery ||
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || mission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: localMissions.length,
    pending: localMissions.filter((m) => m.status === "pending").length,
    public: localMissions.filter((m) => m.status === "public").length,
    private: localMissions.filter((m) => m.status === "private").length,
    refused: localMissions.filter((m) => m.status === "refused").length,
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Gestion des missions</CardTitle>
          <CardDescription>
            Validation et modération des annonces
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {(
                ["all", "pending", "public", "private", "refused"] as const
              ).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                >
                  {s} ({statusCounts[s]})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      {filteredMissions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucune mission trouvée</p>
          </CardContent>
        </Card>
      ) : (
        filteredMissions.map((mission) => {
          const config = getStatusConfig(mission.status)
          const Icon = config.icon
          const isProcessing = processingIds.includes(mission.id)

          return (
            <Card key={mission.id} className="shadow-sm">
              <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{mission.title}</h3>
                    <Badge
                      className={`${config.bgColor} ${config.color} border`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {mission.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4" />
                    {mission.applicants} candidature(s)
                  </div>

                  {mission.publishedDate && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(mission.publishedDate).toLocaleDateString("fr-FR")}
                    </div>
                  )}

                  {mission.author && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      {mission.author}
                    </div>
                  )}

                  {mission.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      {mission.email}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMission(mission)}
                    disabled={isProcessing}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>

                  {mission.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(mission.id, "public")}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approuver
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMission(mission.id)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
