"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  MapPin,
  Calendar,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type Mission = {
  id: string; // UUID string
  title: string;
  employer: string;
  location: string;
  dates: string;
  salary: string;
  status: string;
  applicants: number;
  publishedDate: string;
};

interface TabMissionsProps {
  missions: Mission[];
  setSelectedMission: (mission: Mission) => void;
  handleValidateMission?: (missionId: string, action: string) => Promise<void> | void;
}

export default function TabMissions({
  missions,
  setSelectedMission,
  handleValidateMission,
}: TabMissionsProps) {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [localMissions, setLocalMissions] = useState<Mission[]>(missions);
  const router = useRouter();

  const doValidate = async (missionId: string, action: string) => {
    if (processingIds.includes(missionId)) return;
    setProcessingIds((s) => [...s, missionId]);

    try {
      if (handleValidateMission) {
        await handleValidateMission(missionId, action);
      } else {
        const status = action === "approve" ? "active" : "rejected";
        const res = await fetch(`/api/missions/${missionId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Erreur serveur");

        setLocalMissions((prev) =>
          prev.map((m) => (m.id === missionId ? { ...m, status } : m))
        );
      }

      alert(action === "approve" ? "Annonce approuvée." : "Annonce rejetée.");
      router.refresh();
    } catch (err: any) {
      console.error("Validation error:", err);
      alert(err?.message || "Erreur lors de la mise à jour du statut.");
    } finally {
      setProcessingIds((s) => s.filter((id) => id !== missionId));
    }
  };

  const doDelete = async (missionId: string) => {
    if (processingIds.includes(missionId)) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) return;

    setProcessingIds((s) => [...s, missionId]);

    try {
      const res = await fetch(`/api/missions/${missionId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur lors de la suppression");

      setLocalMissions((prev) => prev.filter((m) => m.id !== missionId));
      alert("Mission supprimée avec succès.");
      router.refresh();
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.message || "Erreur lors de la suppression.");
    } finally {
      setProcessingIds((s) => s.filter((id) => id !== missionId));
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-green-50/60 shadow rounded-2xl border-0">
        <CardHeader className="bg-transparent pb-2">
          <CardTitle className="text-green-800 font-bold">
            Supervision des missions
          </CardTitle>
          <CardDescription>
            Modération et gestion des offres de remplacement
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {localMissions.map((mission) => (
              <div
                key={mission.id}
                className="border border-green-100 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {mission.title}
                    </h3>
                    <Badge
                      variant={mission.status === "active" ? "default" : "secondary"}
                      className="text-xs px-2 py-1"
                    >
                      {mission.status === "active"
                        ? "Active"
                        : mission.status === "rejected"
                        ? "Rejetée"
                        : "En attente"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {mission.employer}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {mission.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {mission.dates}
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {mission.salary}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-blue-600 font-medium">
                      {mission.applicants} candidatures
                    </span>
                    <span className="text-gray-500">
                      Publié le {mission.publishedDate}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMission(mission)}
                    className="hover:bg-green-50 hover:border-green-300 rounded-xl"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => doValidate(mission.id, "approve")}
                    disabled={processingIds.includes(mission.id)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => doValidate(mission.id, "reject")}
                    disabled={processingIds.includes(mission.id)}
                    className="rounded-xl"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => doDelete(mission.id)}
                    disabled={processingIds.includes(mission.id)}
                    className="rounded-xl bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
