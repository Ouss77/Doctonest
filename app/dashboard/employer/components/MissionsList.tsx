// Helper to format ISO date to dd/mm/yyyy
function formatDateDMY(dateString: string | undefined) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('fr-FR');
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users, Calendar, MapPin, Euro, Plus, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import EditMissionModal from "./EditMissionModal";

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
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const specialties = Array.from(new Set(missions.map(m => m.specialty_required || m.specialty).filter(Boolean)));
  const filteredMissions = missions.filter(m => {
    const matchesSearch = search.trim() === "" || m.title.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter === "" || (m.specialty_required || m.specialty) === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher une mission..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/3"
        />
        <select
          value={specialtyFilter}
          onChange={e => setSpecialtyFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/4"
        >
          <option value="">Toutes les spécialités</option>
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        <Button
          onClick={() => setShowCreateMission(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
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
        <div className="space-y-6">
          {filteredMissions.map(mission => (
            <div key={mission.id} className="flex flex-col md:flex-row items-stretch gap-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{mission.title}</h3>
                  <Badge className="bg-indigo-50 text-indigo-700 rounded-lg px-3 py-1 text-xs">
                    {mission.specialty_required || mission.specialty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    {mission.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    {formatDateDMY(mission.start_date || mission.startDate)} - {formatDateDMY(mission.end_date || mission.endDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-500" />
                    {mission.applications_count} candidature(s)
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2 line-clamp-3">{mission.description}</p>
                {mission.selectedDoctor && (
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Assigné à {mission.selectedDoctor}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Publié le {formatDateDMY(mission.created_at)} 
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditMission(mission)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full px-3 py-1 shadow-sm transition-all duration-200 text-xs flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMission(mission.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50 rounded-full px-3 py-1 shadow-sm transition-all duration-200 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
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
