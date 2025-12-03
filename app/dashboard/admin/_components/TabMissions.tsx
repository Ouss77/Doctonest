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
  id: string;
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
  handleValidateMission?: (
    missionId: string,
    action: string
  ) => Promise<void> | void;
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
      // For admin actions: approve -> in_progress (active), reject -> cancelled, hidden -> cancelled (or we could add a hidden status)
      const statusMap: Record<string, string> = {
        approve: "in_progress",    // Approve = make active (in_progress in DB)
        active: "in_progress",      // Active = in_progress in DB
        reject: "cancelled",        // Reject = cancelled in DB
        rejected: "cancelled",      // Rejected = cancelled in DB
        hidden: "cancelled",        // Hidden = cancelled (or we keep it as cancelled for now)
      };

      const dbStatus = statusMap[action.toLowerCase()];
      if (!dbStatus) throw new Error("Action invalide");

      if (handleValidateMission) {
        await handleValidateMission(missionId, action);
      } else {
        // Send the action to API, which will map it correctly
        const res = await fetch(`/api/missions/${missionId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }), // Send action, let API map it
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Erreur serveur");
      }

      // Update local state with the database status
      setLocalMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, status: dbStatus } : m))
      );
      alert(
        action === "approve"
          ? "Mission approuvée."
          : action === "reject"
          ? "Mission rejetée."
          : "Mission masquée."
      );
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
      const res = await fetch(`/api/missions/${missionId}?admin=true`, { method: "DELETE" });
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

  // Map database statuses to UI statuses for display
  const mapStatusForUI = (dbStatus: string): string => {
    const statusMap: Record<string, string> = {
      'open': 'pending',           // DB 'open' = UI 'pending' (needs approval)
      'in_progress': 'active',     // DB 'in_progress' = UI 'active'
      'completed': 'completed',     // DB 'completed' = UI 'completed'
      'cancelled': 'rejected',      // DB 'cancelled' = UI 'rejected'
      'pending': 'pending',         // Keep for backward compatibility
      'active': 'active',
      'rejected': 'rejected',
      'hidden': 'hidden',
    };
    return statusMap[dbStatus.toLowerCase()] || dbStatus;
  };

  // Admin should see ALL missions (except truly deleted ones)
  // Allow admin to manage missions regardless of their status
  const visibleMissions = localMissions.filter((m) => {
    const uiStatus = mapStatusForUI(m.status);
    // Only filter out missions that are explicitly marked as deleted
    // Show all other missions: pending, active, rejected, hidden, completed
    return uiStatus !== "deleted";
  });

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
            {visibleMissions.map((mission) => {
              const uiStatus = mapStatusForUI(mission.status);
              return (
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
                      variant={
                        uiStatus === "active"
                          ? "default"
                          : uiStatus === "hidden"
                          ? "secondary"
                          : uiStatus === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs px-2 py-1"
                    >
                      {uiStatus === "active"
                        ? "Active"
                        : uiStatus === "hidden"
                        ? "Masquée"
                        : uiStatus === "rejected"
                        ? "Rejetée"
                        : uiStatus === "completed"
                        ? "Terminée"
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

                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMission(mission)}
                    className="hover:bg-green-50 hover:border-green-300 rounded-xl"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>

                  {/* Admin can always change status - Show all action buttons based on current status */}
                  {/* If pending/open: show approve, reject, hide */}
                  {uiStatus === "pending" && (
                    <>
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
                        variant="secondary"
                        onClick={() => doValidate(mission.id, "hidden")}
                        disabled={processingIds.includes(mission.id)}
                        className="rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        Masquer
                      </Button>
                    </>
                  )}

                  {/* If active/in_progress: show reject and hide options, but also allow to keep active */}
                  {uiStatus === "active" && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => doValidate(mission.id, "hidden")}
                        disabled={processingIds.includes(mission.id)}
                        className="rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        Masquer
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
                    </>
                  )}

                  {/* If hidden or rejected: show approve to reactivate */}
                  {(uiStatus === "hidden" || uiStatus === "rejected") && (
                    <>
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
                        variant="secondary"
                        onClick={() => doValidate(mission.id, "hidden")}
                        disabled={processingIds.includes(mission.id)}
                        className="rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        Masquer
                      </Button>
                    </>
                  )}

                  {/* If completed: show options to reactivate or reject */}
                  {uiStatus === "completed" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => doValidate(mission.id, "approve")}
                        disabled={processingIds.includes(mission.id)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Réactiver
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
                    </>
                  )}

                  {/* Delete always visible */}
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
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
