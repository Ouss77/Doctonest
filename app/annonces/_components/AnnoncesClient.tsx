'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Euro, Eye, Filter, RotateCcw, Menu, X, Briefcase, Clock, Phone, User } from "lucide-react";
import Link from "next/link";
import Headerannonces from '@/components/annonces/Headerannonces';
import { useRef } from "react";

interface Announcement {
  id: string;
  title: string;
  specialty: string;
  location: string;
  type: string;
  description: string;
  posted_date: string;
  urgency: string;
  status?: string;
  authorName?: string;
  phone?: string;
  hideContact?: boolean;
}

const specialties = [
  "Cardiologie", "Médecine générale", "Pédiatrie", "Dermatologie", "Gynécologie",
  "Ophtalmologie", "Orthopédie", "Psychiatrie", "Radiologie", "Chirurgie",
  "Anesthésie", "ORL", "Urologie", "Neurologie", "Endocrinologie", "Rhumatologie"
];

const cities = [
  "Rabat", "Casablanca", "Fès", "Marrakech", "Tanger", "Agadir", "Oujda",
  "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Errachidia", "Taza"
];

export default function AnnoncesPage() {
  const listRef = useRef<HTMLDivElement | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/missions?visibility=public");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        if (data.missions && Array.isArray(data.missions)) {
          const normalized: Announcement[] = data.missions.map((m: any) => {
            const authorName =
              m.organization_name ||
              [m.first_name, m.last_name].filter(Boolean).join(" ") ||
              "Annonceur";

            return {
              id: String(m.id),
              title: m.title ?? "",
              specialty: m.specialty_required ?? m.specialty ?? "",
              location: m.location ?? "",
              type: m.mission_type ?? "offer",
              description: m.description ?? "",
              posted_date: m.created_at ?? "",
              urgency: m.is_urgent ? "high" : "",
              status: m.status,
              authorName,
              phone: m.phone ?? "",
              hideContact:
                typeof m.hideContact === "boolean"
                  ? m.hideContact
                  : typeof m.hide_contact === "boolean"
                  ? m.hide_contact
                  : Boolean(m.phone),
            };
          });

          setAnnouncements(normalized);
          setFilteredAnnouncements(normalized);
        } else {
          throw new Error(data.error || "Erreur lors du chargement des annonces");
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError("Erreur lors du chargement des annonces. Veuillez réessayer plus tard.");
        setAnnouncements([]);
        setFilteredAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const applyFilters = () => {
    let filtered = announcements.filter(a => !a.status || a.status === 'public');

    if (searchKeyword.trim()) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter(announcement =>
        announcement.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter(announcement =>
        announcement.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedSpecialty("");
    setSelectedCity("");
    setFilteredAnnouncements(announcements);
  };

  useEffect(() => {
    applyFilters();
  }, [searchKeyword, selectedSpecialty, selectedCity, announcements]);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* HEADER */}
      <Headerannonces />

      {/* BARRE DE FILTRE MODERNISÉE */}
      <div className="relative z-30 max-w-7xl mx-auto -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-10">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-200/50">
          {/* Header des filtres */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filtrer les annonces</h2>
              <p className="text-sm text-gray-500">{filteredAnnouncements.length} annonce{filteredAnnouncements.length > 1 ? 's' : ''} trouvée{filteredAnnouncements.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Filtres */}
          <div className="space-y-4">
            {/* Recherche principale */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Grille de filtres */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Spécialité */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Toutes spécialités</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec.toLowerCase()}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Ville */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Toutes villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city.toLowerCase()}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Bouton réinitialiser */}
              <button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300 transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-gray-700 hover:shadow-md active:scale-95"
                onClick={resetFilters}
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div
          id="annonces-list"
          ref={listRef}
          className="scroll-mt-28"
        >
          {error && (
            <div className="mb-6 p-5 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 text-sm sm:text-base flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-700 py-20">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-lg font-semibold text-gray-800">Chargement des annonces...</p>
              <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto border border-gray-100">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Aucune annonce trouvée</h3>
                <p className="text-base text-gray-600 mb-6">Essayez de modifier vos critères de recherche pour voir plus de résultats</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="group bg-white rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* En-tête colorée */}
                  <div className={`h-2 ${announcement.type === 'offer' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}></div>

                  <div className="p-6">
                    {/* Badges et urgence */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <span className={`${announcement.type === 'offer' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200'} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                        {announcement.type === 'offer' ? "Offre" : "Demande"}
                      </span>
                    {/* Spécialité badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 text-sm font-semibold px-4 py-2 rounded-lg">
                        <Briefcase className="w-4 h-4" />
                        {announcement.specialty}
                      </span>
                    </div>
                      {announcement.urgency === 'high' && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg">
                          🔥 Urgent
                        </span>
                      )}
                    </div>

                    {/* Titre */}
                    <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                      {announcement.title}
                    </h3>

                    {/* Métadonnées */}
                    <div className="space-y-2.5 mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 text-gray-700 text-sm">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{announcement.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <span>
                          {announcement.posted_date && `Publié le ${new Date(announcement.posted_date).toLocaleDateString('fr-FR')}`}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {announcement.description}
                      </p>
                    </div>

                    {/* Informations de l'annonceur */}
                    {announcement.authorName && (
                      <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Publié par</p>
                            <p className="text-sm font-bold text-gray-900">{announcement.authorName}</p>
                          </div>
                        </div>

                        {announcement.phone && !announcement.hideContact && (
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-200">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <a
                              href={`tel:${announcement.phone}`}
                              className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                            >
                              {announcement.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bouton CTA */}
                    <Link href={`/annonces/${encodeURIComponent(String(announcement.id))}`}>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 group">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Voir les détails</span>
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
