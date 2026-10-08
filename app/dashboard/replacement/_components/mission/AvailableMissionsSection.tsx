import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import MissionFilterBar from "./MissionFilterBar";
import MissionCard from "./MissionCard";
import MissionContactDialog from "./MissionContactDialog";
import { Briefcase, ChevronDown, Stethoscope, TrendingUp, Shield } from "lucide-react";

const sortOptions = [
  { value: "recent",  label: "Les plus récentes" },
  { value: "oldest",  label: "Les plus anciennes" },
  { value: "urgent",  label: "Urgentes en premier" },
];

function HeroIllustration() {
  return (
    <div className="relative w-48 h-40 flex-shrink-0 select-none" aria-hidden>
      {/* Outer glow ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full bg-white/8 border border-white/15 animate-pulse [animation-duration:3s]" />
      </div>
      {/* Inner circle with icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/12 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
          <Stethoscope className="w-12 h-12 text-white/90" strokeWidth={1.2} />
        </div>
      </div>
      {/* Floating badge — top right */}
      <div className="absolute top-1 right-0 bg-white/18 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-white/25 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-xs font-semibold">En ligne</span>
        </div>
      </div>
      {/* Floating badge — bottom left */}
      <div className="absolute bottom-3 left-0 bg-white/18 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-white/25 shadow-sm">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-blue-200" />
          <span className="text-white text-xs font-semibold">+24% ce mois</span>
        </div>
      </div>
      {/* Floating badge — top left */}
      <div className="absolute top-6 left-0 bg-white/18 backdrop-blur-sm rounded-xl px-2 py-1 border border-white/25 shadow-sm">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-blue-200" />
          <span className="text-white text-xs font-semibold">Certifié</span>
        </div>
      </div>
      {/* Decorative dots */}
      <div className="absolute top-0 right-12 w-2 h-2 rounded-full bg-white/20" />
      <div className="absolute bottom-1 right-6 w-1.5 h-1.5 rounded-full bg-white/20" />
    </div>
  );
}

export default function AvailableMissionsSection() {
  const { user } = useAuth();
  const [missions, setMissions]                 = useState<any[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<any[]>([]);
  const [specialtyFilter, setSpecialtyFilter]   = useState("");
  const [locationFilter, setLocationFilter]     = useState("");
  const [keywordFilter, setKeywordFilter]       = useState("");
  const [sortBy, setSortBy]                     = useState("recent");
  const [showSort, setShowSort]                 = useState(false);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState("");
  const [contactOpen, setContactOpen]           = useState(false);
  const [selectedMission, setSelectedMission]   = useState<any | null>(null);
  const [applyStatus, setApplyStatus]           = useState<{ [id: string]: string }>({});
  const [appliedMissions, setAppliedMissions]   = useState<Set<string>>(new Set());

  const handleApply = async (missionId: string) => {
    if (!user?.id) {
      setApplyStatus(p => ({ ...p, [missionId]: "Vous devez être connecté pour postuler." }));
      return;
    }
    setApplyStatus(p => ({ ...p, [missionId]: "Envoi en cours..." }));
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, userId: user.id }),
      });
      if (!res.ok) throw new Error();
      setApplyStatus(p => ({ ...p, [missionId]: "Candidature envoyée !" }));
      setAppliedMissions(prev => new Set(prev).add(missionId));
    } catch {
      setApplyStatus(p => ({ ...p, [missionId]: "Erreur lors de la candidature" }));
    }
  };

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/missions?visibility=private", { credentials: "include" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMissions(data.missions || []);
      } catch {
        setError("Erreur lors du chargement des missions.");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/applications?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        const applied = new Set<string>((data.applications || []).map((a: any) => String(a.mission_id)));
        setAppliedMissions(applied);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    let result = [...missions];
    if (specialtyFilter)
      result = result.filter(m => (m.specialty_required || "").toLowerCase().includes(specialtyFilter.toLowerCase()));
    if (locationFilter)
      result = result.filter(m => (m.location || "").toLowerCase().includes(locationFilter.toLowerCase()));
    if (keywordFilter)
      result = result.filter(m =>
        (m.title || "").toLowerCase().includes(keywordFilter.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(keywordFilter.toLowerCase())
      );
    if (sortBy === "oldest")
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sortBy === "urgent")
      result.sort((a, b) => (b.is_urgent ? 1 : 0) - (a.is_urgent ? 1 : 0));
    else
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredMissions(result);
  }, [missions, specialtyFilter, locationFilter, keywordFilter, sortBy]);

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label ?? "Les plus récentes";
  const hasFilters = !!(specialtyFilter || locationFilter || keywordFilter);

  return (
    <>
      <div>

        {/* ── Hero + floating filter ──────────────────────────────── */}
        <div className="relative mb-6">

          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-7 sm:px-10 pt-9 sm:pt-11 pb-24">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
              <div className="absolute top-1/3 -right-6  w-48 h-48 rounded-full bg-blue-500/20" />
              <div className="absolute -bottom-12 -left-10 w-56 h-56 rounded-full bg-indigo-700/50" />
              <div className="absolute bottom-6 right-1/3 w-20 h-20 rounded-full bg-white/5" />
            </div>

            {/* Content row */}
            <div className="relative z-10 flex items-center justify-between gap-6">
              <div className="max-w-xl">
                {/* Live pill */}
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {!loading && missions.length > 0
                    ? `${missions.length} mission${missions.length > 1 ? "s" : ""} disponible${missions.length > 1 ? "s" : ""}`
                    : "Missions disponibles"}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mb-3">
                  Trouvez votre prochaine{" "}
                  <span className="text-blue-200">mission médicale</span>
                </h1>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                  Découvrez des opportunités de remplacement adaptées à votre expertise, partout au Maroc.
                </p>
              </div>

              {/* Illustration — hidden on small screens */}
              <div className="hidden lg:block">
                <HeroIllustration />
              </div>
            </div>
          </div>

          {/* Floating filter card — overlaps hero bottom */}
          <div className="relative -mt-12 z-20 mx-1 sm:mx-0">
            <MissionFilterBar
              specialtyFilter={specialtyFilter}
              setSpecialtyFilter={setSpecialtyFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              keywordFilter={keywordFilter}
              setKeywordFilter={setKeywordFilter}
            />
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* ── Results header ─────────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">
                  {filteredMissions.length} mission{filteredMissions.length !== 1 ? "s" : ""} disponible{filteredMissions.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-500">
                  {hasFilters
                    ? "Résultats filtrés — modifiez vos critères pour voir plus."
                    : "Toutes les missions disponibles au Maroc."}
                </p>
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 text-sm font-medium text-gray-700 transition-all shadow-sm"
              >
                <span className="text-gray-400 text-xs">Trier :</span>
                <span>{currentSortLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "text-blue-600 font-semibold bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Cards ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-1 bg-gray-100" />
                <div className="p-5 flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-5 bg-gray-100 rounded-lg w-2/5" />
                    <div className="h-4 bg-gray-100 rounded-full w-24" />
                    <div className="flex gap-3">
                      <div className="h-3.5 bg-gray-100 rounded w-24" />
                      <div className="h-3.5 bg-gray-100 rounded w-28" />
                    </div>
                    <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-28" />
                  </div>
                  <div className="hidden sm:flex flex-col gap-2 w-36">
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl font-bold text-gray-900 mb-2">Aucune mission trouvée</p>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Modifiez vos critères de recherche ou revenez plus tard.
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSpecialtyFilter("");
                  setLocationFilter("");
                  setKeywordFilter("");
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onContact={m => { setSelectedMission(m); setContactOpen(true); }}
                onApply={handleApply}
                applied={appliedMissions.has(String(mission.id))}
                applyStatus={applyStatus[mission.id]}
              />
            ))}
          </div>
        )}
      </div>

      <MissionContactDialog open={contactOpen} onOpenChange={setContactOpen} mission={selectedMission} />
    </>
  );
}
