import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MissionFilterBar from "./MissionFilterBar";
import MissionCard from "./MissionCard";
import MissionContactDialog from "./MissionContactDialog";
import { Briefcase } from "lucide-react";

export default function AvailableMissionsSection() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<any[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any | null>(null);
  const [applyStatus, setApplyStatus] = useState<{ [missionId: string]: string }>({});
  const [appliedMissions, setAppliedMissions] = useState<Set<string>>(new Set());

  const handleApply = async (missionId: string) => {
    if (!user?.id) {
      setApplyStatus((prev) => ({ ...prev, [missionId]: "Vous devez être connecté pour postuler." }));
      return;
    }
    setApplyStatus((prev) => ({ ...prev, [missionId]: "Envoi en cours..." }));
    try { 
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, userId: user.id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la candidature");
      setApplyStatus((prev) => ({ ...prev, [missionId]: "Candidature envoyée !" }));
    } catch (err) {
      setApplyStatus((prev) => ({ ...prev, [missionId]: "Erreur lors de la candidature" }));
    }
  };

  useEffect(() => {
    const fetchMissions = async () => { 
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/missions");
        if (!res.ok) throw new Error("Erreur lors du chargement des missions");
        const data = await res.json();
        setMissions(data.missions || []); 
      } catch (err) {
        setError("Erreur lors du chargement des missions");
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  // Filter missions when filters or missions change
  useEffect(() => {
    let filtered = missions;
    if (specialtyFilter) {
      filtered = filtered.filter(m => (m.specialty_required || "").toLowerCase().includes(specialtyFilter.toLowerCase()));
    }
    if (locationFilter) {
      filtered = filtered.filter(m => (m.location || "").toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (keywordFilter) {
      filtered = filtered.filter(m =>
        (m.title || "").toLowerCase().includes(keywordFilter.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(keywordFilter.toLowerCase())
      );
    }
    setFilteredMissions(filtered);
  }, [missions, specialtyFilter, locationFilter, keywordFilter]);

  // Fetch applications for the current user and mark applied missions
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/applications?userId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json(); 
        const applied = new Set<string>((data.applications || []).map((a: any) => String(a.mission_id)));
        setAppliedMissions(applied);
      } catch (err) {
        // ignore
      }
    };
    fetchApplications();
  }, [user]);

  return (
    <>
      {/* LinkedIn-style Card: Available Missions Section */}
      <Card className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Missions disponibles</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Parcourez les offres de remplacement</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Filter Bar */}
          <div className="mb-4">
            <MissionFilterBar
              specialtyFilter={specialtyFilter}
              setSpecialtyFilter={setSpecialtyFilter} 
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              keywordFilter={keywordFilter}
              setKeywordFilter={setKeywordFilter}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-500 py-12 text-sm">
              Chargement des missions...
            </div>
          ) : filteredMissions.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Aucune mission disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {filteredMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <MissionCard
                    mission={mission}
                    onContact={(m) => { setSelectedMission(m); setContactOpen(true); }}
                    onApply={handleApply}
                    applied={appliedMissions.has(mission.id)}
                    applyStatus={applyStatus[mission.id]}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MissionContactDialog open={contactOpen} onOpenChange={setContactOpen} mission={selectedMission} />
    </>
  );
}
