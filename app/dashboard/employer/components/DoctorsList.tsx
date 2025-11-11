import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Eye, Users, Star, MapPin, Euro, Search, Mail } from "lucide-react";
  import React, { useEffect, useState } from "react";
  import { Dialog } from "@/components/ui/dialog";
  import { DialogContent, DialogClose } from "@/components/ui/dialog";
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
    const [specialty, setSpecialty] = useState("");
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
          console.log("the data", data)
                  setDoctors(data.doctors || []);
        } catch {
          setError("Erreur lors du chargement des médecins");
        } finally {
          setLoading(false);
        }
      };
      fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter((doctor) => {
      const matchesSearch =
        search.trim() === "" ||
        (`${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(search.toLowerCase()));
      const matchesSpecialty =
        specialty === "" || specialty === "all" || doctor.specialty?.toLowerCase() === specialty.toLowerCase();
      const matchesLocation =
        location.trim() === "" || doctor.location?.toLowerCase().includes(location.toLowerCase());
      const matchesAvailability =
        availability === "all" ||
        (availability === "disponible" && doctor.is_available === true) ||
        (availability === "indisponible" && doctor.is_available === false);
      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
    });

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
        {/* Doctor Profile Modal */}
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DoctorProfileModal open={profileOpen} onOpenChange={setProfileOpen} doctorId={selectedDoctorId} />
        </Dialog>
        {/* Modale de contact */}
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogContent className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200">
            {contactDoctor && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Contact de l'établissement</h2>
                  </div>
                </div>
                <p className="text-gray-500 mb-6">Coordonnées et adresse complète du cabinet ou de la clinique.</p>
                <div className="space-y-6">
                  {/* Nom */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-500">Nom</span>
                    </div>
                    <div className="ml-7 text-base text-gray-900 font-semibold">{contactDoctor.first_name}</div>
                  </div>
                  {/* Téléphone */}
                  {contactDoctor.phone && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        <span className="text-sm text-gray-500">Téléphone</span>
                      </div>
                      <div className="ml-7 text-base text-gray-900 font-semibold">{contactDoctor.phone}</div>
                    </div>
                  )}
                  {/* Email */}
                  {contactDoctor.email && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 10-8 0m8 0v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4a4 4 0 014-4h8a4 4 0 014 4z" /></svg>
                        <span className="text-sm text-gray-500">Email</span>
                      </div>
                      <div className="ml-7 text-base text-gray-900 font-semibold">
                        <a href={`mailto:${contactDoctor.email}`} className="text-blue-600 underline">{contactDoctor.email}</a>
                      </div>
                    </div>
                  )}

                  {/* Télécharger le CV */}
                  {contactDoctor.cv_url && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-sm text-gray-500">CV</span>
                      </div>
                      <div className="ml-7">
                        <Button asChild variant="secondary" className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2">
                          <a href={contactDoctor.cv_url} target="_blank" rel="noopener noreferrer" download>
                            Télécharger le CV
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-8">
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl px-8 py-2 font-bold text-blue-700 border-blue-300 w-full">
                      Fermer
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>


        {/* Filters - Enhanced */}
        <div className="sticky top-0 mt-2 z-20 bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-4 items-center">
            {/* Search by name */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un médecin par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 py-4 text-lg rounded-2xl border-blue-200 focus:ring-2 focus:ring-blue-500 bg-blue-50"
              />
            </div>

            {/* Specialty dropdown - all specialties from doctors */}
            <div className="w-full md:w-56">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="py-4 text-lg rounded-2xl border-blue-200 focus:ring-2 focus:ring-indigo-500 bg-blue-50">
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
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par localisation..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="pl-10 py-4 text-lg rounded-2xl border-purple-200 focus:ring-2 focus:ring-purple-500 bg-purple-50"
              />
            </div>

            {/* Availability filter dropdown */}
            <div className="w-full md:w-56">
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="py-4 text-lg rounded-2xl border-green-200 focus:ring-2 focus:ring-green-500 bg-green-50">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-200 bg-white overflow-hidden"
                >
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
                      <Avatar className="w-24 h-24 rounded-full ring-4 ring-blue-200 shadow-lg">
                        <AvatarImage src={doctor.photo_url || undefined} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-800 border-2 border-blue-300">
                          {(doctor.first_name?.[0] || '?').toUpperCase()}
                          {(doctor.last_name?.[0] || '').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-2xl text-blue-900">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <Badge className="mt-2 bg-gradient-to-r from-indigo-200 to-purple-200 text-purple-700 border-0 px-3 py-1 text-sm rounded-lg">
                          {doctor.specialty}
                        </Badge>
                        <div className="mt-2 text-sm text-gray-500 font-medium">{doctor.location}</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 text-gray-700 text-base mb-6">
                      {doctor.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold">{doctor.rating}</span>
                          <span className="text-xs text-gray-400">Note</span>
                        </div>
                      )}
                      {doctor.completed_missions && (
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-pink-400" />
                          <span className="font-semibold">{doctor.completed_missions}</span>
                          <span className="text-xs text-gray-400">missions</span>
                        </div>
                      )}
                      {doctor.daily_rate && (
                        <div className="flex items-center gap-2">
                          <Euro className="w-5 h-5 text-green-400" />
                          <span className="font-semibold">{doctor.daily_rate}€/jour</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-400" /> 
                        <span className="text-xs text-gray-400">
                          {doctor.is_available === true ? "Disponible" : "Indisponible"}
                        </span>
                      </div>
                      {doctor.about && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doctor.about}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full font-semibold shadow"
                        onClick={() => {
                          setSelectedDoctorId(doctor.id);
                          setProfileOpen(true);
                        }}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Profil
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-300"
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