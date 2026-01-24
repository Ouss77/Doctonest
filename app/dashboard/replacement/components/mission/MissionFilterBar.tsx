import { Stethoscope, MapPin, Search, RefreshCcw } from "lucide-react";

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
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-end bg-white p-4 rounded-2xl shadow-sm border">
      {/* Specialty */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-blue-500" /> Spécialité
        </label>
        <div className="relative">
          <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: Cardiologie"
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
          />
        </div>
      </div>
      {/* Location */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> Localisation
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: Paris"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          />
        </div>
      </div>
      {/* Keywords */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" /> Mots-clés
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ex: urgence, nuit, clinique..."
            value={keywordFilter}
            onChange={e => setKeywordFilter(e.target.value)}
          />
        </div>
      </div>
      {/* Reset button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => {
            setSpecialtyFilter("");
            setLocationFilter("");
            setKeywordFilter("");
          }}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm"
        >
          <RefreshCcw className="w-4 h-4" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}
