import {
  Calendar, Briefcase, MapPin, Building2, Phone, Send,
  Bookmark, Heart, Stethoscope, Activity, Eye, Syringe,
  Users, Pill, Zap, Clock,
} from "lucide-react";

interface MissionCardProps {
  mission: any;
  onContact: (mission: any) => void;
  onApply: (missionId: string) => void;
  applied: boolean;
  applyStatus: string | undefined;
}

const specialtyConfig: Record<string, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  accent: string;
}> = {
  "cardiologie":        { icon: Heart,       color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",   accent: "from-blue-400 to-blue-600" },
  "médecine générale":  { icon: Stethoscope, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", accent: "from-emerald-400 to-teal-500" },
  "pédiatrie":          { icon: Users,       color: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200",   accent: "from-teal-400 to-cyan-500" },
  "dermatologie":       { icon: Activity,    color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200", accent: "from-orange-400 to-amber-500" },
  "gynécologie":        { icon: Heart,       color: "text-pink-700",    bg: "bg-pink-50",    border: "border-pink-200",   accent: "from-pink-400 to-rose-500" },
  "neurologie":         { icon: Zap,         color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",  accent: "from-amber-400 to-yellow-500" },
  "pneumologie":        { icon: Activity,    color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200", accent: "from-purple-400 to-violet-500" },
  "radiologie":         { icon: Eye,         color: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-200", accent: "from-indigo-400 to-blue-500" },
  "chirurgie":          { icon: Syringe,     color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",    accent: "from-red-400 to-rose-500" },
  "anesthésie":         { icon: Syringe,     color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200", accent: "from-violet-400 to-purple-500" },
  "ophtalmologie":      { icon: Eye,         color: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200",   accent: "from-cyan-400 to-teal-500" },
  "pharmacie":          { icon: Pill,        color: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200",   accent: "from-teal-400 to-green-500" },
};

function getSpecialtyConfig(specialty: string) {
  return specialtyConfig[specialty?.toLowerCase()] ?? {
    icon: Briefcase,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "from-blue-400 to-indigo-500",
  };
}

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Publié aujourd'hui";
  if (diffDays === 1) return "Publié hier";
  if (diffDays < 7) return `Publié il y a ${diffDays} jours`;
  if (diffDays < 30) {
    const w = Math.floor(diffDays / 7);
    return `Publié il y a ${w} semaine${w > 1 ? "s" : ""}`;
  }
  const m = Math.floor(diffDays / 30);
  return `Publié il y a ${m} mois`;
}

function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return "";
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  if (start) return `Dès le ${fmt(start)}`;
  return `Jusqu'au ${fmt(end!)}`;
}

export default function MissionCard({
  mission, onContact, onApply, applied, applyStatus,
}: MissionCardProps) {
  const specialty = mission.specialty_required || "";
  const spec = getSpecialtyConfig(specialty);
  const SpecIcon = spec.icon;

  const orgName =
    mission.organization_name ||
    [mission.first_name, mission.last_name].filter(Boolean).join(" ") ||
    null;

  const isApplied = applied || applyStatus?.startsWith("Candidature");
  const isLoading = applyStatus === "Envoi en cours...";
  const dateRange = formatDateRange(mission.start_date, mission.end_date);

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.11)] hover:border-blue-200/80 transition-all duration-300 overflow-hidden"
      role="article"
      aria-labelledby={`mission-title-${mission.id}`}
    >
      {/* Specialty-colored top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${spec.accent}`} />

      <div className="p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-5 items-start">

          {/* Specialty icon */}
          <div
            className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${spec.bg} border-2 ${spec.border} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}
          >
            <SpecIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${spec.color}`} strokeWidth={1.5} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Title + urgency badge */}
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3
                id={`mission-title-${mission.id}`}
                className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight"
              >
                {mission.title || "Mission"}
              </h3>
              {mission.is_urgent && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                  🔥 Urgent
                </span>
              )}
            </div>

            {/* Specialty badge */}
            {specialty && (
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${spec.bg} ${spec.color} border ${spec.border}`}>
                  <SpecIcon className="w-3 h-3" strokeWidth={2.5} />
                  {specialty}
                </span>
              </div>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
              {mission.location && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {mission.location}
                </span>
              )}
              {orgName && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {orgName}
                </span>
              )}
              {dateRange && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {dateRange}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {mission.description || "Aucune description disponible."}
            </p>

            {/* Relative publish date */}
            {mission.created_at && (
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {formatRelativeDate(mission.created_at)}
              </p>
            )}
          </div>

          {/* Action buttons — desktop */}
          <div className="hidden sm:flex flex-col items-stretch gap-2 flex-shrink-0 min-w-[148px]">
            <button
              onClick={() => !isApplied && !isLoading && onApply(mission.id)}
              disabled={isApplied || isLoading}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                isApplied
                  ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default"
                  : isLoading
                  ? "bg-blue-400 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-600/25 hover:shadow-blue-600/35 hover:shadow-lg"
              }`}
            >
              <Send className="w-4 h-4" />
              {isApplied ? "Candidature envoyée" : isLoading ? "Envoi..." : "Postuler"}
            </button>
            <button
              onClick={() => onContact(mission)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Contacter
            </button>
            <button className="flex items-center justify-center p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Apply status error message */}
        {applyStatus && !applyStatus.startsWith("Candidature") && applyStatus !== "Envoi en cours..." && (
          <div className="mt-3 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
            {applyStatus}
          </div>
        )}

        {/* Mobile buttons */}
        <div className="sm:hidden mt-4 flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onContact(mission)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            Contacter
          </button>
          <button
            onClick={() => !isApplied && !isLoading && onApply(mission.id)}
            disabled={isApplied || isLoading}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
              isApplied
                ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                : "bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700"
            }`}
          >
            <Send className="w-4 h-4" />
            {isApplied ? "Postulé" : "Postuler"}
          </button>
        </div>
      </div>
    </div>
  );
}
