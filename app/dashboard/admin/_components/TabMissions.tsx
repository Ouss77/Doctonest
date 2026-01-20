"use client";

import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  MapPin,
  Calendar,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type Mission = {
  email: ReactNode;
  last_name: any;
  first_name: any;
  id: string;
  title: string;
  employer: string;
  location: string;
  dates: string;
  salary: string;
  status: string;
  applicants: number;
  publishedDate: string;
  author?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  const doValidate = async (missionId: string, action: string) => {
    if (processingIds.includes(missionId)) return;
    setProcessingIds((s) => [...s, missionId]);

    try {
      const statusMap: Record<string, string> = {
        approve: "in_progress",
        active: "in_progress",
        reject: "cancelled",
        rejected: "cancelled",
        hidden: "cancelled",
      };

      const dbStatus = statusMap[action.toLowerCase()];
      if (!dbStatus) throw new Error("Action invalide");

      if (handleValidateMission) {
        await handleValidateMission(missionId, action);
      } else {
        const res = await fetch(`/api/missions/${missionId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Erreur serveur");
      }

      setLocalMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, status: dbStatus } : m))
      );
      
      // Toast notification would be better, but using alert for now
      alert(
        action === "approve"
          ? "Mission approuvée avec succès."
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette mission ?")) return;

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

  const mapStatusForUI = (dbStatus: string): string => {
    const statusMap: Record<string, string> = {
      'open': 'pending',
      'in_progress': 'active',
      'completed': 'completed',
      'cancelled': 'rejected',
      'pending': 'pending',
      'active': 'active',
      'rejected': 'rejected',
      'hidden': 'hidden',
    };
    return statusMap[dbStatus.toLowerCase()] || dbStatus;
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
      pending: {
        label: "En attente",
        color: "text-amber-700",
        bgColor: "bg-amber-50 border-amber-200",
        icon: Clock,
      },
      active: {
        label: "Active",
        color: "text-green-700",
        bgColor: "bg-green-50 border-green-200",
        icon: CheckCircle2,
      },
      rejected: {
        label: "Rejetée",
        color: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
        icon: XCircle,
      },
      completed: {
        label: "Terminée",
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        icon: CheckCircle,
      },
      hidden: {
        label: "Masquée",
        color: "text-gray-700",
        bgColor: "bg-gray-50 border-gray-200",
        icon: AlertCircle,
      },
    };
    return configs[status] || configs.pending;
  };
  
  const visibleMissions = localMissions.filter((m) => {
    const uiStatus = mapStatusForUI(m.status);
    return uiStatus !== "deleted";
  });

  // Filter missions
  const filteredMissions = visibleMissions.filter((mission) => {
    const matchesSearch = 
      !searchQuery ||
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mission.author && String(mission.author).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const uiStatus = mapStatusForUI(mission.status);
    const matchesStatus = statusFilter === "all" || uiStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: visibleMissions.length,
    pending: visibleMissions.filter(m => mapStatusForUI(m.status) === "pending").length,
    active: visibleMissions.filter(m => mapStatusForUI(m.status) === "active").length,
    rejected: visibleMissions.filter(m => mapStatusForUI(m.status) === "rejected").length,
    completed: visibleMissions.filter(m => mapStatusForUI(m.status) === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header Card with Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Gestion des Missions
              </CardTitle>
              <CardDescription className="text-base">
                Modération et supervision des offres de remplacement
              </CardDescription>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-amber-600">{statusCounts.pending}</div>
                <div className="text-xs text-gray-500">En attente</div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                <div className="text-xs text-gray-500">Actives</div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Search and Filter Bar */}
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par titre, localisation, auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "Tous", count: statusCounts.all },
                { value: "pending", label: "En attente", count: statusCounts.pending },
                { value: "active", label: "Actives", count: statusCounts.active },
                { value: "rejected", label: "Rejetées", count: statusCounts.rejected },
                { value: "completed", label: "Terminées", count: statusCounts.completed },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                      statusFilter === filter.value
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missions List */}
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Aucune mission trouvée
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Aucune mission à afficher pour le moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMissions.map((mission) => {
            const uiStatus = mapStatusForUI(mission.status);
            const statusConfig = getStatusConfig(uiStatus);
            const StatusIcon = statusConfig.icon;
            const isProcessing = processingIds.includes(mission.id);

            return (
              <Card
                key={mission.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Mission Info */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {mission.title}
                            </h3>
                            <Badge
                              className={`${statusConfig.bgColor} ${statusConfig.color} border px-3 py-1 flex items-center gap-1.5`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span className="font-semibold">{statusConfig.label}</span>
                            </Badge>
                          </div>
                          
                          {/* Author Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            {mission.author && (
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{mission.author}</span>
                              </div>
                            )}
                            {mission.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{mission.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Localisation</div>
                            <div className="font-medium text-gray-900">{mission.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Candidatures</div>
                            <div className="font-medium text-gray-900">{mission.applicants} candidat{mission.applicants > 1 ? 's' : ''}</div>
                          </div>
                        </div>

                        {mission.publishedDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Publié le</div>
                              <div className="font-medium text-gray-900">
                                {new Date(mission.publishedDate).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      {/* Primary Action - Details */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMission(mission)}
                        className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        disabled={isProcessing}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir les détails
                      </Button>

                      {/* Status Actions - Grouped buttons */}
                      <div className="flex flex-col gap-2">
                        {uiStatus === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => doValidate(mission.id, "approve")}
                              disabled={isProcessing}
                              className="w-full justify-start bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approuver
                            </Button>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => doValidate(mission.id, "reject")}
                                disabled={isProcessing}
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Rejeter
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => doValidate(mission.id, "hidden")}
                                disabled={isProcessing}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Masquer
                              </Button>
                            </div>
                          </>
                        )}
                        {uiStatus === "active" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => doValidate(mission.id, "hidden")}
                              disabled={isProcessing}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Masquer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => doValidate(mission.id, "reject")}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        )}
                        {(uiStatus === "hidden" || uiStatus === "rejected") && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => doValidate(mission.id, "approve")}
                              disabled={isProcessing}
                              className="w-full justify-start bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Réactiver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => doValidate(mission.id, "hidden")}
                              disabled={isProcessing}
                              className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Masquer
                            </Button>
                          </>
                        )}
                        {uiStatus === "completed" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => doValidate(mission.id, "approve")}
                              disabled={isProcessing}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Réactiver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => doValidate(mission.id, "reject")}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => doDelete(mission.id)}
                          disabled={isProcessing}
                          className="w-full justify-start bg-red-600 hover:bg-red-700 text-white mt-1"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
