import { 
  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DoctorProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string | null;
}

export default function DoctorProfileModal({ open, onOpenChange, doctorId }: DoctorProfileModalProps) {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !doctorId) return;
    setLoading(true); 
    setError("");
    fetch(`/api/doctors/${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement du profil médecin");
        
        return res.json();
      })
      .then((data) => setDoctor(data))
      
      .catch(() => setError("Erreur lors du chargement du profil médecin"))
      .finally(() => setLoading(false));
  }, [open, doctorId]);

  if (!open) return null;

  return (
    <DialogContent
      className={`max-w-3xl w-full rounded-2xl p-0 overflow-hidden
        ${doctor && doctor.profile?.is_available === false
          ? 'bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-red-500 shadow-[0_0_24px_#b0b0b0]'
          : 'bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 shadow-[0_0_24px_#a5d8ff]'}
      `}
    >
      {loading ? (
        <div className="py-12 text-center text-lg text-gray-500">Chargement du profil...</div>
      ) : error ? (
        <div className="py-12 text-center text-lg text-red-500">{error}</div>
      ) : doctor ? (
        <div className="bg-white">
          {/* Top half: image left, info right */}
          <div className="flex flex-row gap-8 p-8 items-start border-b">
            {/* Doctor image, left side */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-xl bg-gray-200 overflow-hidden border border-gray-100 flex items-center justify-center">
                <img
                  src={doctor.profile?.photo_url || "logo.png"}
                  alt="doctor"
                  className="w-full h-full object-cover rounded-xl"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            {/* Basic info, right side */}
            <div className="flex-1 flex flex-col justify-start ">
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Dr. {(doctor.profile?.first_name || doctor.first_name) ?? ""} {(doctor.profile?.last_name || doctor.last_name) ?? ""}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <span>{doctor.profile?.specialty || doctor.specialty || "Spécialité non renseignée"}</span>
                  {doctor.profile?.location && <span>• {doctor.profile.location}</span>}
                  <Badge className={`ml-2 ${doctor.profile?.is_available ? "bg-green-500" : "bg-gray-400"}`}>
                    {doctor.profile?.is_available ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
                {doctor.profile?.bio && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="font-semibold mb-1">Biographie</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{doctor.profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Tabs below */}
          <div className="px-8 pb-8 pt-4">
            <Tabs defaultValue="profil">
              <TabsList className="border-b w-full justify-start">
                <TabsTrigger value="profil">Profil</TabsTrigger>
                <TabsTrigger value="experience">Expérience</TabsTrigger>
                <TabsTrigger value="diplomes">Diplômes</TabsTrigger>
              </TabsList>
              {/* Profil */}
              <TabsContent value="profil" className="mt-4 space-y-3 text-gray-700">
                {doctor.profile?.location && (
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {doctor.profile.location}</p>
                )}
                {doctor.profile?.experience_years !== undefined && (
                  <p className="flex items-center gap-2">Années d'expérience : <span className="font-semibold">{doctor.profile.experience_years}</span></p>
                )}
                {doctor.profile?.languages && Array.isArray(doctor.profile.languages) && doctor.profile.languages.length > 0 && (
                  <p className="flex items-center gap-2">Langues : <span className="font-semibold">{doctor.profile.languages.join(', ')}</span></p>
                )}
              </TabsContent>
              {/* Expérience */}
              <TabsContent value="experience" className="mt-4">
                {doctor.experiences?.length > 0 ? (
                  doctor.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="p-3 border-b flex flex-row items-center justify-between">
                      <div>
                        <p className="font-semibold">{exp.workplace_name}</p>
                        <p className="text-sm text-gray-500">{exp.specialty} • {exp.location}</p>
                      </div>
                      {exp.reference_contact && (
                        <div className="flex flex-col items-end min-w-[180px]">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                            <span className="font-semibold">Réf:</span> {exp.reference_contact}
                            {exp.reference_phone && <span className="ml-2 text-blue-600">{exp.reference_phone}</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune expérience renseignée.</p>
                )}
              </TabsContent>
              {/* Diplômes */}
              <TabsContent value="diplomes" className="mt-4">
                {doctor.diplomas?.length > 0 ? (
                  doctor.diplomas.map((dip: any, idx: number) => (
                    <div key={idx} className="p-3 border-b">
                      <p className="font-semibold">{dip.title}</p>
                      <p className="text-sm text-gray-500">{dip.institution} • {dip.year}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun diplôme renseigné.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : null}
    </DialogContent>
  );
}
 