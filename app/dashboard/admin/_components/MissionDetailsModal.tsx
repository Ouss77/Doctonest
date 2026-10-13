import React from "react"
import { Badge } from "@/components/ui/badge"

export default function MissionDetailsModal({
  mission,
  onClose,
}: {
  mission: any
  onClose: () => void
}) {
  if (!mission) return null

  const statusLabel: Record<string, string> = {
    open: "À valider",
    pending: "À valider",
    public: "Publiée",
    private: "Privée",
    refused: "Refusée",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071d45]/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative">
        <div className="h-2 bg-gradient-to-r from-teal-400 via-indigo-400 to-violet-500" />
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 text-xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="p-8">
          <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold mb-1">Annonce</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 pr-6">{mission.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-teal-100 text-teal-900 border-teal-200 font-semibold">
              {statusLabel[mission.status] || mission.status}
            </Badge>
            <span className="text-xs text-slate-500 self-center">
              {mission.publishedDate
                ? new Date(mission.publishedDate).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-500">Auteur :</span> {mission.author || mission.employer || "-"}</div>
            <div><span className="font-semibold text-slate-500">Email :</span> {mission.email || "-"}</div>
            <div><span className="font-semibold text-slate-500">Lieu :</span> {mission.location}</div>
            <div><span className="font-semibold text-slate-500">Dates :</span> {mission.dates || "-"}</div>
            <div><span className="font-semibold text-slate-500">Candidatures :</span> {mission.applicants}</div>
            <div className="pt-2">
              <span className="font-semibold text-slate-500">Description :</span>
              <p className="mt-1 text-slate-600 leading-relaxed">{mission.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
