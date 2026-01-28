'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Euro, Eye, Filter, RotateCcw, Menu, X } from "lucide-react";
import Link from "next/link";
import Header from '@/components/annonces/header';
import Headerannonces from '@/components/annonces/Headerannonces';
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


return (
  <div className="min-h-screen bg-white">
    {/* HEADER Annonces */}
  <Headerannonces />
    
    {/* BARRE DE FILTRE SUR UNE SEULE LIGNE */}
    <div className="relative z-30 max-w-7xl mx-auto -mt-10 px-10">
      <div className="bg-white shadow-xl rounded-2xl p-5 border flex items-center gap-4">
        {/* Input principal */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par mot-clé, spécialité..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300"
          />
        </div>
        {/* Select spécialité */}
        <select
          value={selectedSpecialty}
          onChange={e => setSelectedSpecialty(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="">Spécialité</option>
          <option value="all">Toutes les spécialités</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec.toLowerCase()}>{spec}</option>
          ))}
        </select>
        {/* Select ville */}
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="">Ville</option>
          <option value="all">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city.toLowerCase()}>{city}</option>
          ))}
        </select>
        {/* Bouton réinitialiser sur la même ligne */}
        <button
          className="px-6 py-3 rounded-xl bg-gray-100 border hover:bg-gray-200"
          onClick={resetFilters}
        >
          Réinitialiser
        </button>
      </div>
    </div>

    {/* Contenu principal */}
    <main className="max-w-7xl mx-auto px-6 py-5">
      {/* Liste des annonces */}
      <div id="annonces-list" className="py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</div>
        )}
        
        {loading ? (
          <div className="text-center text-gray-700 py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Chargement des annonces...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center text-gray-700 py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucune annonce trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {announcement.type === 'offer' ? "Offre d'emploi" : "Demande d'emploi"}
                    </span>
                    {announcement.urgency === 'high' && (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {announcement.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{announcement.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {announcement.posted_date && `Publié le ${new Date(announcement.posted_date).toLocaleDateString('fr-FR')}`}
                      </span>
                    </div>
                    
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded">
                      {announcement.specialty}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-3 mb-6">
                    {announcement.description}
                  </p>
                  
                  <Link href={`/annonces/${encodeURIComponent(String(announcement.id))}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
                      <div className="flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" />
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
