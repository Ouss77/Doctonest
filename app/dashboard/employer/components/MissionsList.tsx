// Helper to format ISO date to dd/mm/yyyy
function formatDateDMY(dateString: string | undefined) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('fr-FR');
} 

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Users, Calendar, MapPin, Euro, Plus, CheckCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import EditMissionModal from "./EditMissionModal";
import AddMissionModal from "./AddMissionModal";

export default function MissionsList({  
  missions, setMissions, employerId, loading, setLoading, error, setError, setShowCreateMission
}: {
  missions: any[];
  setMissions: React.Dispatch<React.SetStateAction<any[]>>;
  employerId: string | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCreateMission: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [editMission, setEditMission] = useState<any | null>(null);
  const [showCreateMission, setShowCreateMissionLocal] = useState(false);

  // Edit mission handler (opens modal)
  function handleEditMission(mission: any) {
    setEditMission(mission);
    setShowCreateMission(false);
  }

  // Delete mission handler
  async function handleDeleteMission(id: string) {
    if (!window.confirm("Supprimer cette mission ?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/missions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de la mission");
      setMissions((prev) => prev.filter((mission) => mission.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de la mission");
    } finally {
      setLoading(false);
    }
  }

  // Search/filter logic
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const specialties = useMemo(
    () => Array.from(new Set(missions.map(m => m.specialty_required || m.specialty).filter(Boolean))),
    [missions]
  );
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const matchesSearch = search.trim() === "" || m.title.toLowerCase().includes(search.toLowerCase());
      const spec = m.specialty_required || m.specialty;
      const matchesSpecialty = specialtyFilter === "all" || spec === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [missions, search, specialtyFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <Input
          placeholder="Rechercher une mission..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-10 rounded-lg border-slate-200 md:w-1/3"
        />
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger className="h-10 rounded-lg border-slate-200 md:w-1/4">
            <SelectValue placeholder="Spécialité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les spécialités</SelectItem>
            {specialties.map(spec => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setShowCreateMissionLocal(true)}
          className="bg-blue-600 text-white rounded-lg px-4 h-10 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle mission
        </Button>
      </div>
      {loading ? (
        <div className="py-12 text-center text-gray-500 font-medium">Chargement des missions...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 font-medium">{error}</div>
      ) : filteredMissions.length === 0 ? (
        <div className="py-12 text-center text-gray-400 font-medium">
          Aucune mission trouvée.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map(mission => (
            <Card key={mission.id} className="rounded-xl border border-slate-200 bg-white">
              <CardContent className="p-6">
              <div className="sm:flex sm:items-start sm:justify-between gap-4">
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900">{mission.title}</h3>
                    <Badge className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs">
                      {mission.specialty_required || mission.specialty}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {mission.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {formatDateDMY(mission.start_date || mission.startDate)} - {formatDateDMY(mission.end_date || mission.endDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-600" />
                      {mission.applications_count} candidature(s)
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-2 line-clamp-3">{mission.description}</p>
                  {mission.selectedDoctor && (
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" /> Assigné à {mission.selectedDoctor}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-1">
                    Publié le {formatDateDMY(mission.created_at)} 
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col sm:min-w-[140px] sm:items-end mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMission(mission)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg px-3 py-1 text-xs flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMission(mission.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Add Mission Modal */}
      <AddMissionModal
        showForm={showCreateMission}
        setShowForm={setShowCreateMissionLocal}
        setMissions={setMissions}
        employerId={employerId || ''}
        setLoading={setLoading}
        setError={setError}
      />
      {/* Edit Modal */}
      <EditMissionModal
        editMission={editMission}
        employerId={employerId || ''}
        setEditMission={setEditMission}
        setMissions={setMissions}
        setLoading={setLoading}
        setError={setError}
      />
    </div>
  );
}
  