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
    let filtered = announcements;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Landing Page Header */}
      <Header />

      {/* Page Title Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Annonces Médicales</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">Découvrez les opportunités d'emploi dans le secteur médical au Maroc</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par mot-clé, spécialité, employeur..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Specialty Filter */}
            <div className="w-full lg:w-56">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Spécialité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les spécialités</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty.toLowerCase()}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="w-full lg:w-56">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={resetFilters} variant="outline" className="px-4 py-3 rounded-lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Chargement des annonces...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucune annonce trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Résultats de recherche</h2>
              <p className="text-gray-600">
                {filteredAnnouncements.length} annonce{filteredAnnouncements.length > 1 ? 's' : ''} trouvée{filteredAnnouncements.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl border-0 bg-white shadow-md">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${getTypeColor(announcement.type)} border-0 text-xs px-3 py-1 rounded-full font-medium`}>
                          {announcement.type === 'offer' ? 'Offre d\'emploi' : 'Demande d\'emploi'}
                        </Badge>
                        {announcement.urgency && (
                          <Badge className={`${getUrgencyColor(announcement.urgency)} border-0 text-xs px-3 py-1 rounded-full font-medium`}>
                            {announcement.urgency === 'high' ? 'Urgent' : 
                             announcement.urgency === 'medium' ? 'Modéré' : 'Non urgent'}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                        {announcement.title}
                      </h3>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>{announcement.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {announcement.description}
                    </p>

                    {/* Posted Date */}
                    <p className="text-xs text-gray-400 mb-4">
                      Publié le {new Date(announcement.posted_date).toLocaleDateString('fr-FR')}
                    </p>

                    {/* Action Button */}
                    <Link href={`/annonces/${encodeURIComponent(announcement.title.toLowerCase().replace(/ /g, '-'))}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
