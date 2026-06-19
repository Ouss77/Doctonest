import { Stethoscope, MapPin, Search, RotateCcw } from "lucide-react";

interface MissionFilterBarProps {
  specialtyFilter: string;
  setSpecialtyFilter: (v: string) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  keywordFilter: string;
  setKeywordFilter: (v: string) => void;
}

export default function MissionFilterBar({
  specialtyFilter,
  setSpecialtyFilter,
  locationFilter,
  setLocationFilter,
  keywordFilter,
  setKeywordFilter,
}: MissionFilterBarProps) {
  const reset = () => {
    setSpecialtyFilter("");
    setLocationFilter("");
    setKeywordFilter("");
  };

  const hasFilters = !!(specialtyFilter || locationFilter || keywordFilter);

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100/80 p-5 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">

        {/* Keyword */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Mot clé
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Ex : cardiologue, urgence..."
              value={keywordFilter}
              onChange={e => setKeywordFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm bg-gray-50 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Localisation
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Ex : Rabat, Casablanca..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm bg-gray-50 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Spécialité
          </label>
          <div className="relative">
            <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Ex : Cardiologie..."
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm bg-gray-50 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={reset}
            title="Réinitialiser les filtres"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              hasFilters
                ? "border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <RotateCcw className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-600/25 hover:shadow-blue-600/35 text-sm whitespace-nowrap">
            <Search className="w-4 h-4" />
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
