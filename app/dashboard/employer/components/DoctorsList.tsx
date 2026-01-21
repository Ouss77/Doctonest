import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Users, Star, MapPin, Euro, Search, Mail, Phone } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import DoctorProfileModal from "./DoctorProfileModal";

  interface Doctor {
    id: string;
    first_name: string;
    last_name: string;
    photo_url?: string;
    specialty?: string;
    location?: string;
    rating?: number;
    completed_missions?: number;
    daily_rate?: number;
    availability?: string;
    last_active?: string;
    about?: string;
    phone?: string;
    email?: string;
    cv_url?: string;
    is_available?: boolean;
  }

  export default function DoctorsList() {
  const [availability, setAvailability] = useState("all");
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    const [search, setSearch] = useState("");
    const [specialty, setSpecialty] = useState("all");
    const [location, setLocation] = useState(""); 
    const [profileOpen, setProfileOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [contactOpen, setContactOpen] = useState(false);
    const [contactDoctor, setContactDoctor] = useState<Doctor | null>(null);


    const allSpecialties = [
      "Cardiologie", "Médecine générale", "Pédiatrie", "Dermatologie", "Gynécologie", "Ophtalmologie", "Orthopédie", "Psychiatrie", "Radiologie", "Chirurgie", "Anesthésie", "ORL", "Urologie", "Neurologie", "Endocrinologie", "Rhumatologie", "Gastro-entérologie", "Hématologie", "Oncologie", "Néphrologie", "Pneumologie", "Médecine interne", "Médecine du travail", "Médecine nucléaire", "Médecine physique et réadaptation", "Médecine tropicale", "Autre"
    ];

    useEffect(() => {
      const fetchDoctors = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/doctors");
          if (!res.ok) throw new Error("Erreur lors du chargement des médecins");
          const data = await res.json();
          setDoctors(data.doctors || []);
        } catch {
          setError("Erreur lors du chargement des médecins");
        } finally {
          setLoading(false);
        }
      };
      fetchDoctors(); 
    }, []); 
    const filteredDoctors = useMemo(() => {
      return doctors.filter((doctor) => {
        const name = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
        const matchesSearch = search.trim() === "" || name.includes(search.toLowerCase());
        const matchesSpecialty =
          specialty === "" || specialty === "all" || doctor.specialty?.toLowerCase() === specialty.toLowerCase();
        const matchesLocation = location.trim() === "" || doctor.location?.toLowerCase().includes(location.toLowerCase());
        const matchesAvailability =
          availability === "all" ||
          (availability === "disponible" && doctor.is_available === true) ||
          (availability === "indisponible" && doctor.is_available === false);
        return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
      });
    }, [doctors, search, specialty, location, availability]);

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Doctor Profile Modal */}
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DoctorProfileModal open={profileOpen} onOpenChange={setProfileOpen} doctorId={selectedDoctorId} />
        </Dialog>
        {/* Modale de contact */}
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogContent className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border border-slate-200">
            {contactDoctor && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h2 className="text-base font-semibold text-slate-900">Coordonnées</h2>
                </div>
                <p className="text-slate-500 mb-4 text-sm">Contact direct et documents disponibles.</p>
                <div className="space-y-4 text-sm">
                  {/* Nom */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700 font-medium">{contactDoctor.first_name} {contactDoctor.last_name}</span>
                    </div>
                  </div>
                  {/* Téléphone */}
                  {contactDoctor.phone && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 font-medium">{contactDoctor.phone}</span>
                      </div>
                    </div>
                  )}
                  {/* Email */}
                  {contactDoctor.email && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <a href={`mailto:${contactDoctor.email}`} className="text-sky-700 underline">{contactDoctor.email}</a>
                      </div>
                    </div>
                  )}

                  {/* Télécharger le CV */}
                  {contactDoctor.cv_url && (
                    <div>
                      <Button asChild variant="outline" className="rounded-lg border-slate-200">
                        <a href={contactDoctor.cv_url} target="_blank" rel="noopener noreferrer" download>
                          Télécharger le CV
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-lg px-8 py-2 font-medium text-slate-700 border-slate-200 w-full">
                      Fermer
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>


        {/* Filters - Enhanced */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-3 items-center">
            {/* Search by name */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un médecin par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-lg border-slate-200 bg-white focus-visible:ring-1 focus-visible:ring-slate-300"
              />
            </div>

            {/* Specialty dropdown - all specialties from doctors */}
            <div className="w-full md:w-56">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white focus:ring-1 focus:ring-slate-300">
                  <SelectValue placeholder="Spécialité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les spécialités</SelectItem>
                  {allSpecialties.map((spec) => (
                    <SelectItem key={spec} value={spec.toLowerCase()}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location search input */}
            <div className="w-full md:w-56 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par localisation..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="pl-10 h-10 rounded-lg border-slate-200 bg-white focus-visible:ring-1 focus-visible:ring-slate-300"
              />
            </div>

            {/* Availability filter dropdown */}
            <div className="w-full md:w-56">
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white focus:ring-1 focus:ring-slate-300">
                  <SelectValue placeholder="Disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les disponibilités</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="indisponible">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <main className="max-w-6xl mx-auto flex-1 px-6 py-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-semibold text-lg">{error}</div>
          )}
          {loading ? (
            <div className="text-center text-gray-600 text-lg py-12 font-medium">Chargement des médecins...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-gray-600 text-center text-lg font-medium py-12">Aucun médecin disponible.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="h-full rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-4">
                      <Avatar className="w-20 h-20 rounded-full">
                        <AvatarImage src={doctor.photo_url || undefined} />
                        <AvatarFallback className="text-xl font-semibold bg-slate-200 text-slate-700">
                          {(doctor.first_name?.[0] || '?').toUpperCase()}
                          {(doctor.last_name?.[0] || '').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-xl text-slate-900">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <Badge className="mt-2 bg-blue-50 text-blue-700 border-0 px-2 py-0.5 text-xs rounded">
                          {doctor.specialty}
                        </Badge>
                        <div className="mt-2 text-sm text-slate-500 font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          {doctor.location}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-slate-700 text-sm mb-4 flex-1">
                      {doctor.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-xs text-slate-400">Note</span>
                        </div>
                      )}
                      {doctor.completed_missions && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-sky-600" />
                          <span className="font-medium">{doctor.completed_missions}</span>
                          <span className="text-xs text-slate-400">missions</span>
                        </div>
                      )}
                      {doctor.daily_rate && (
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">{doctor.daily_rate}€/jour</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className={`${doctor.is_available ? 'text-green-600' : 'text-red-600'} text-xs font-medium`}>
                          {doctor.is_available === true ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      {doctor.about && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-3">{doctor.about}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-2 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                        onClick={() => {
                          setSelectedDoctorId(doctor.id);
                          setProfileOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Profil
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 text-white rounded-lg"
                        onClick={() => {
                          setContactDoctor(doctor);
                          setContactOpen(true);
                        }}
                      >
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }