'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Euro, Eye, Filter, RotateCcw, Menu, X } from "lucide-react";
import Link from "next/link";
import Headerannonces from '@/components/annonces/Headerannonces';
import {useRef} from "react";
interface Announcement {
  id: string;
  title: string;
  specialty: string;
  location: string;
  type: string;
  description: string;
  posted_date: string;
  urgency: string;
  status?: string; // 'pending' | 'active' | 'rejected' etc.
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
        const res = await fetch("/api/missions");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        if (data.missions && Array.isArray(data.missions)) {
          setAnnouncements(data.missions);
          setFilteredAnnouncements(data.missions);
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
    // Only consider approved/visible announcements for public listing.
    // Keep backward compatibility: if announcement.status is undefined, treat as visible.
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
  }, 2500); // ⏳ 2.5 secondes (tu peux mettre 2000 ou 3000)

  return () => clearTimeout(timer);
}, []);

return (
  <div className="min-h-screen bg-gray-100">
    {/* HEADER Annonces */}
  <Headerannonces />
    
    {/* BARRE DE FILTRE RESPONSIVE */}
    <div className="relative z-30 max-w-7xl mx-auto -mt-3 sm:-mt-7 px-4 sm:px-6 lg:px-10">
      <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200">
        {/* Layout empilé sur mobile, ligne sur desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Input principal */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
            />
          </div>
          
          {/* Filtres en grille sur mobile, ligne sur desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Select spécialité */}
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="border border-gray-300 p-2.5 sm:p-3 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="">Toutes spécialités</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec.toLowerCase()}>{spec}</option>
              ))}
            </select>
            
            {/* Select ville */}
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="border border-gray-300 p-2.5 sm:p-3 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="">Toutes villes</option>
              {cities.map((city) => (
                <option key={city} value={city.toLowerCase()}>{city}</option>
              ))}
            </select>
            
            {/* Bouton réinitialiser */}
            <button
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 border border-gray-300 hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium whitespace-nowrap"
              onClick={resetFilters}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Réinitialiser</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Contenu principal */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Liste des annonces */}
<div
  id="annonces-list"
  ref={listRef}
  className="py-6 sm:py-8 scroll-mt-28"
>        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm sm:text-base">{error}</div>
        )}
        
        {loading ? (
          <div className="text-center text-gray-700 py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-base sm:text-lg font-medium">Chargement des annonces...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center text-gray-700 py-12 sm:py-16 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Aucune annonce trouvée</h3>
            <p className="text-sm sm:text-base text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-200"
              >
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full">
                      {announcement.type === 'offer' ? "Offre d'emploi" : "Demande d'emploi"}
                    </span>
                    {announcement.urgency === 'high' && (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
                    {announcement.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{announcement.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {announcement.posted_date && `Publié le ${new Date(announcement.posted_date).toLocaleDateString('fr-FR')}`}
                      </span>
                    </div>
                    
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded truncate max-w-full">
                      {announcement.specialty}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 mb-4 sm:mb-6 leading-relaxed">
                    {announcement.description}
                  </p>
                  
                  <Link href={`/annonces/${encodeURIComponent(String(announcement.id))}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base">
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        Voir détails
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
