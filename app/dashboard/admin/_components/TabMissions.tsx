"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Clock,
  User,
  Users,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type Mission = {
  id: string
  title: string
  location: string
  status: "open" | "pending" | "public" | "private" | "refused"
  applicants: number
  publishedDate?: string
  author?: string
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
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "public" | "private" | "refused">("all")

  const router = useRouter()

  const isAwaitingReview = (status: Mission["status"]) =>
    status === "pending" || status === "open"

  const getStatusConfig = (status: Mission["status"]) => {
    const configs = {
      open: {
        label: "À valider",
        color: "text-amber-800",
        chip: "bg-amber-100 text-amber-900 border-amber-200",
        bar: "from-amber-400 via-orange-400 to-yellow-400",
        icon: Clock,
      },
      pending: {
        label: "À valider",
        color: "text-amber-800",
        chip: "bg-amber-100 text-amber-900 border-amber-200",
        bar: "from-amber-400 via-orange-400 to-yellow-400",
        icon: Clock,
      },
      public: {
        label: "Publiée",
        color: "text-teal-800",
        chip: "bg-teal-100 text-teal-900 border-teal-200",
        bar: "from-teal-400 to-emerald-500",
        icon: CheckCircle,
      },
      private: {
        label: "Privée",
        color: "text-indigo-800",
        chip: "bg-indigo-100 text-indigo-900 border-indigo-200",
        bar: "from-indigo-400 to-violet-500",
        icon: Eye,
      },
      refused: {
        label: "Refusée",
        color: "text-rose-800",
        chip: "bg-rose-100 text-rose-900 border-rose-200",
        bar: "from-rose-400 to-pink-500",
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
      statusFilter === "all" ||
      (statusFilter === "pending" && isAwaitingReview(mission.status)) ||
      mission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: localMissions.length,
    pending: localMissions.filter((m) => isAwaitingReview(m.status)).length,
    public: localMissions.filter((m) => m.status === "public").length,
    private: localMissions.filter((m) => m.status === "private").length,
    refused: localMissions.filter((m) => m.status === "refused").length,
  }

  const filterLabels: Record<typeof statusFilter, string> = {
    all: "Toutes",
    pending: "À valider",
    public: "Publiées",
    private: "Privées",
    refused: "Refusées",
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(filterLabels) as Array<typeof statusFilter>).map((s) => {
          const active = statusFilter === s
          const tones: Record<string, string> = {
            all: "bg-white text-[#071d45] border-slate-200",
            pending: "bg-amber-50 text-amber-900 border-amber-200",
            public: "bg-teal-50 text-teal-900 border-teal-200",
            private: "bg-indigo-50 text-indigo-900 border-indigo-200",
            refused: "bg-rose-50 text-rose-900 border-rose-200",
          }
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-2xl border p-3 text-left transition-all ${tones[s]} ${
                active ? "ring-2 ring-offset-2 ring-[#071d45]/30 shadow-md" : "hover:shadow-sm"
              }`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">{filterLabels[s]}</p>
              <p className="text-2xl font-bold mt-0.5">{statusCounts[s]}</p>
            </button>
          )
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
          placeholder="Rechercher un titre ou une ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMissions.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/60">
          <CardContent className="py-16 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Aucune mission trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMissions.map((mission) => {
            const config = getStatusConfig(mission.status)
            const Icon = config.icon
            const isProcessing = processingIds.includes(mission.id)

            return (
              <article
                key={mission.id}
                className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
              >
                <div className={`h-1.5 bg-gradient-to-r ${config.bar}`} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        Annonce
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{mission.title}</h3>
                    </div>
                    <Badge className={`${config.chip} border shrink-0`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{mission.location || "Lieu non renseigné"}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      {mission.applicants} candidature{mission.applicants !== 1 ? "s" : ""}
                    </span>
                    {mission.publishedDate && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        {new Date(mission.publishedDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {mission.author && (
                      <span className="flex items-center gap-2 min-w-0">
                        <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{mission.author}</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMission(mission)}
                      disabled={isProcessing}
                      className="rounded-xl border-slate-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>

                    {isAwaitingReview(mission.status) && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(mission.id, "public")}
                          disabled={isProcessing}
                          className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          Approuver
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => updateStatus(mission.id, "refused")}
                          disabled={isProcessing}
                          className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          Refuser
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMission(mission.id)}
                      disabled={isProcessing}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 ml-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
