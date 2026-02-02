'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Clock, Building, User, Mail, Phone, Menu, X, Star, Users, TrendingUp, Shield, Award, CheckCircle } from 'lucide-react';
import Link from "next/link";

interface AnnouncementDetail {
  id: string;
  title: string;
  specialty: string;
  location: string;
  type: string;
  description: string;
  posted_date: string;
  urgency: string;
  start_date?: string;
  end_date?: string;
}

export default function AnnouncementDetailPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => { 
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/announcements/${params.titre}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Annonce non trouvée");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        if (data.success && data.announcement) {
          setAnnouncement(data.announcement);
        } else {
          throw new Error(data.error || "Erreur lors du chargement de l'annonce");
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
        setError(error instanceof Error ? error.message : "Erreur lors du chargement de l'annonce");
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.titre) {
      fetchAnnouncement();
    }
  }, [params.titre]);

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }; 

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo DoctoNest" className="w-10 h-10 rounded-full" />
              <span className="font-bold text-xl text-white">DoctoNest</span>
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Chargement de l'annonce...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo DoctoNest" className="w-10 h-10 rounded-full" />
              <span className="font-bold text-xl text-white">DoctoNest</span>
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Annonce non trouvée</h1>
            <Button onClick={() => router.back()} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Landing Page Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo DoctoNest" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-xl text-white">DoctoNest</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/#features" className="text-blue-100 text-base font-medium hover:text-white transition">Fonctionnalités</Link>
            <Link href="/annonces" className="text-white text-base font-medium border-b-2 border-white">Annonces</Link>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-50">S'inscrire</Button>
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/20" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          size="lg"
          className="mb-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux annonces
        </Button>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-xl border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`${announcement?.type === 'offer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} border-0 text-sm px-3 py-1 rounded`}>
                        {announcement?.type === 'offer' ? 'Offre d\'emploi' : 'Demande d\'emploi'}
                      </Badge>
                      {announcement?.urgency && (
                        <Badge className={`${getUrgencyColor(announcement.urgency)} border-0 text-sm px-3 py-1 rounded`}>
                          {announcement.urgency === 'high' ? 'Urgent' : 
                           announcement.urgency === 'medium' ? 'Modéré' : 'Non urgent'}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {announcement?.title}
                    </h1>
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Localisation</p>
                      <p className="font-semibold text-gray-900">{announcement?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Publié le</p>
                      <p className="font-semibold text-gray-900">
                        {announcement ? new Date(announcement.posted_date).toLocaleDateString('fr-FR') : ''}
                      </p>
                    </div>
                  </div>
                </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Building className="w-5 h-5 text-blue-600" />
                Description de la mission
              </h2>

              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {announcement?.description}
              </div>
            </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar (1 column) */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="rounded-xl border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  Information de la mission
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold text-gray-900">{announcement?.location}</p>
                    </div>
                  </div>
                  
                  {announcement?.start_date && announcement?.end_date && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Période</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          Du {new Date(announcement.start_date).toLocaleDateString('fr-FR')} au {new Date(announcement.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-3 font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                    <Mail className="w-4 h-4 mr-2" />
                    Postuler maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specialty Card */}
            <Card className="rounded-lg border shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Spécialité médicale
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-700 font-semibold text-lg">
                    {announcement?.specialty}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
