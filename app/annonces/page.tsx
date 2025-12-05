'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Euro, Eye, Filter, RotateCcw, Menu, X } from "lucide-react";
import Link from "next/link";
import Header from '@/components/annonces/header';
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
        const res = await fetch("/api/announcements");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
          setFilteredAnnouncements(data.announcements);
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
    let filtered = announcements.filter(a => !a.status || a.status === 'active');

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

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'offer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  };

return (
  <div className="min-h-screen bg-white">
    <div
      className="relative top-0 w-full bg-cover bg-center min-h-[500px]"
      style={{
        
        backgroundImage: "url('annonces.png')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#071d45]/20 to-[#071d45]/30"></div>
      {/* NAVBAR sur le même fond que le hero */}
      <header className="relative top-5 z-20 max-w-7xl mx-auto px-10 py-3 mt-0 flex items-center justify-between bg-[#071d45]/40 backdrop-blur-md rounded-xl shadow">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" className="w-10 h-10 rounded-xl" />
          <span className="text-xl font-semibold text-white group-hover:text-blue-200 transition">Le Foyer Médical</span>
        </Link>
        {/* <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-white font-medium hover:text-blue-200 transition">Fonctionnalités</Link>
          <Link href="/how-it-works" className="text-white font-medium hover:text-blue-200 transition">Comment ça marche</Link>
          <Link href="/blog" className="text-white font-medium hover:text-blue-200 transition">Blog</Link>
        </nav> */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              S’inscrire
            </Button>
          </Link>
        </div>
      </header>
      {/* HERO CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-10 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl leading-tight">
          Annonces Médicales au Maroc :<br />Votre Avenir en Santé
        </h1>
        <p className="text-lg mt-4 text-blue-200 max-w-xl">
          Explorez les opportunités d'emploi et de stages dans tout le Royaume.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/annonces/new">
            <Button className="bg-white text-lg text-gray-900 h-15 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition">
              Publier une demande
            </Button>
          </Link>
          <Link href="/annonces/new">
            <Button className="bg-blue-700 hover:bg-blue-800 text-lg h-15 text-white font-semibold px-6 py-3 rounded-xl transition">
              Publier une Offre
            </Button>
          </Link>
        </div>
      </div>
    </div>

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
