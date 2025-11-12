"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MapPin, Calendar, BarChart3, Eye, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"

type Mission = {
  id: number;
  title: string;
  employer: string;
  location: string;
  dates: string;
  salary: string;
  status: string;
  applicants: number;
  publishedDate: string;
}

interface TabMissionsProps {
  missions: Mission[];
  setSelectedMission: (mission: Mission) => void;
  handleValidateMission: (missionId: number, action: string) => void;
}

export default function TabMissions({ missions, setSelectedMission, handleValidateMission }: TabMissionsProps) {
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const doValidate = async (missionId: number, action: string) => {
    if (processingIds.includes(missionId)) return;
    setProcessingIds((s) => [...s, missionId]);

    try {
      // call parent handler if provided (parent may refresh list)
      if (handleValidateMission) {
        await handleValidateMission(missionId, action);
      } else {
        // default: call API to update status
        const status = action === 'approve' ? 'active' : 'rejected';
        const res = await fetch(`/api/missions/${missionId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Erreur serveur');
        }
      }
      alert(action === 'approve' ? 'Annonce approuvée.' : 'Annonce rejetée.');
      // optional: refresh page or let parent handle refresh
       location.reload();
    } catch (err: any) {
      console.error('Validation error:', err);
      alert(err?.message || 'Erreur lors de la mise à jour du statut.');
    } finally {
      setProcessingIds((s) => s.filter((id) => id !== missionId));
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-green-50/60 shadow rounded-2xl border-0">
        <CardHeader className="bg-transparent pb-2">
          <CardTitle className="text-green-800 font-bold">Supervision des missions</CardTitle>
          <CardDescription>Modération et gestion des offres de remplacement</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="border border-green-100 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-900">{mission.title}</h3>
                    <Badge variant={mission.status === "active" ? "default" : "secondary"} className="text-xs px-2 py-1">
                      {mission.status === "active" ? "Active" : "En attente"}
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
                    <span className="text-blue-600 font-medium">{mission.applicants} candidatures</span>
                    <span className="text-gray-500">Publié le {mission.publishedDate}</span>
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
                  {mission.status === "pending" && ( 
                    <>
                      <Button
                        size="sm"
                        onClick={() => doValidate(mission.id, "approve")}
                        className={`bg-green-500 hover:bg-green-600 text-white rounded-xl ${processingIds.includes(mission.id) ? 'opacity-70 pointer-events-none' : ''}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => doValidate(mission.id, "reject")}
                        className="rounded-xl"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
