import React from "react";
import { Badge } from "@/components/ui/badge";

export default function MissionDetailsModal({ mission, onClose }: {
  mission: any;
  onClose: () => void;
}) {
  if (!mission) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">{mission.title}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">{mission.status}</Badge>
          <span className="text-xs text-gray-500">{mission.publishedDate ? new Date(mission.publishedDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Auteur :</span> {mission.author || mission.employer || "-"}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Email :</span> {mission.email || "-"}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Lieu :</span> {mission.location}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Dates :</span> {mission.dates}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Candidatures :</span> {mission.applicants}
        </div>
                <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Description :</span> {mission.description}
        </div>
      </div>
    </div>
  );
}
