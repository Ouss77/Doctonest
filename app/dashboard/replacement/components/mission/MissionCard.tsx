import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, MapPin, Building2 } from "lucide-react";

interface MissionCardProps {
  mission: any;
  onContact: (mission: any) => void;
  onApply: (missionId: string) => void;
  applied: boolean;
  applyStatus: string | undefined;
}

export default function MissionCard({ mission, onContact, onApply, applied, applyStatus }: MissionCardProps) {
  return (
    <div
      key={mission.id}
  className="relative border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-gray-50 group text-[0.9rem]"
      role="article"
      aria-labelledby={`mission-title-${mission.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative flex flex-col gap-2">
        {/* Title and Clinic Name flexed row */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3
            id={`mission-title-${mission.id}`}
            className="font-bold text-base text-gray-900 line-clamp-2 leading-tight"
          >
            {mission.title || "Mission"}
          </h3>
          {(mission.organization_name || mission.first_name || mission.last_name) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-medium text-xs shadow-sm border border-blue-100">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {mission.organization_name
                ? mission.organization_name
                : [mission.first_name, mission.last_name].filter(Boolean).join(" ")}
            </span>
          )}
        </div>
        {/* Specialty left, Location right flexed row */}
        <div className="flex items-center justify-between my-2 w-full">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Briefcase className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span className="line-clamp-1">{mission.specialty_required || "Non spécifié"}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span className="line-clamp-1">{mission.location}</span>
          </div>
        </div>
        {/* Description */}
        <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-1">
          {mission.description || "Aucune description disponible."}
        </p>
        {/* Dates and duration flexed row, single line */}
        {/* <div className="flex items-center gap-2 text-xs mb-1 whitespace-nowrap">
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-900 font-semibold px-1.5 py-0.5 rounded-full min-w-0"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(mission.start_date)} - {formatDate(mission.end_date)}
          </Badge>
          {mission.start_date && mission.end_date && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-900 font-semibold px-1.5 py-0.5 rounded-full min-w-0"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {(() => {
                const start = new Date(mission.start_date);
                const end = new Date(mission.end_date);
                const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                return `${diff} jour${diff > 1 ? 's' : ''}`;
              })()}
            </Badge>
          )}
        </div> */}
        {/* Action buttons */}
        <div className="mt-2 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 px-3 py-2 rounded-xl transition-colors duration-200 text-xs"
            onClick={() => onContact(mission)}
          >
            Contacter
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-indigo-600 text-indigo-700 font-semibold hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors duration-200 text-xs"
            onClick={() => onApply(mission.id)}
            disabled={applied || (!!applyStatus && applyStatus !== "Erreur lors de la candidature")}
          >
            {applied || applyStatus?.startsWith("Candidature") ? "Deja postulé" : "Postuler"}
          </Button>
        </div>
        {applyStatus && (
          <div className={`mt-2 text-xs ${applyStatus.startsWith("Candidature") ? "text-green-600" : "text-red-600"}`}>
            {applyStatus}
          </div>
        )}
      </div>
    </div>
  );
}
