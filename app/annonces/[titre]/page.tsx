'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Clock, Building, User, Mail, Phone, Menu, X, Star, Users, TrendingUp, Shield, Award, CheckCircle, Stethoscope, Send, Briefcase, FileText, Eye, Heart, Sparkles } from 'lucide-react';
import Link from "next/link";
import Headerannonces from '@/components/annonces/header';

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
  organization_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  hide_contact?: boolean;
}

export default function AnnouncementDetailPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPhone, setShowPhone] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl"></div>
              <span className="font-bold text-lg text-gray-900">DoctoNest</span>
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Chargement de l'annonce...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl"></div>
              <span className="font-bold text-lg text-gray-900">DoctoNest</span>
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md border-l-4 border-blue-600">
            <div className="text-5xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce introuvable</h1>
            <p className="text-gray-600 mb-6 text-sm">Cette annonce n'existe plus</p>
            <Button onClick={() => router.back()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const authorName = announcement?.organization_name ||
    [announcement?.first_name, announcement?.last_name].filter(Boolean).join(" ") ||
    "Annonceur";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Colorful Header */}
              {/* HEADER NAV */}
              <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-4">
                <div className="flex items-center justify-between gap-4 bg-[#071d45]/60 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-3 shadow-xl">
                  {/* LOGO */}
                  <Link href="/" className="flex items-center gap-3 group">
                    <img
                      src="/logo.png"
                      alt="DoctoNest"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md"
                    />
                    <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-300 transition">
                    DoctoNest
                    </span>
                  </Link>
      
                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="text-white border border-white/30 hover:bg-white/10 hover:border-white/50 rounded-xl px-4"
                      >
                        Connexion
                      </Button>
                    </Link>
      
                    <Link href="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 shadow-md">
                        S’inscrire
                      </Button>
                    </Link>
                  </div>
                </div>
              </header>
   
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Creative Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 text-sm text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2 transition shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </button>

        {/* Compact & Creative Title Card */}
        <div className="relative bg-white rounded-2xl border-l-4 border-blue-600 p-6 mb-6 shadow-lg overflow-hidden">
          {/* Decorative gradient blob */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                    announcement?.type === 'offer' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  }`}>
                    {announcement?.type === 'offer' ? '💼 Offre d\'emploi' : '🔍 Recherche'}
                  </span>
                  {announcement?.urgency === 'high' && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm animate-pulse">
                      🔥 Urgent
                    </span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {new Date(announcement.posted_date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {announcement?.title}
                </h1>
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">{announcement?.location}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">{announcement?.specialty}</span>
              </div>
              {announcement?.start_date && announcement?.end_date && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-semibold text-blue-900">
                    {new Date(announcement.start_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} - {new Date(announcement.end_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description Card with gradient border */}
            <div className="relative bg-white rounded-2xl p-[2px] shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl"></div>
              <div className="relative bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-700" />
                  </div>
                  Description de la mission
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {announcement?.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Creative Contact Card */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl overflow-hidden sticky top-24">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-blue-200" />
                  <h3 className="text-lg font-bold text-white">Contact</h3>
                </div>

                {/* Annonceur Info */}
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/20">
                  <p className="text-xs text-white/70 mb-2 uppercase tracking-wide font-semibold">Annonceur</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {authorName[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{authorName}</p>
                      <p className="text-xs text-white/80 truncate">{announcement?.specialty}</p>
                    </div>
                  </div>

                  {announcement?.hide_contact && (
                    <button
                      onClick={() => setShowPhone((prev) => !prev)}
                      className="w-full mt-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {showPhone && announcement?.phone ? announcement.phone : "Afficher téléphone"}
                    </button>
                  )}
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-white hover:bg-gray-50 text-purple-700 font-bold py-3.5 rounded-xl shadow-xl transition-all active:scale-95">
                  <Send className="w-4 h-4 mr-2" />
                  Postuler maintenant
                </Button>

                {/* Trust Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-xs">
                  <Shield className="w-4 h-4 text-green-300" />
                  <span className="font-semibold">Annonce vérifiée ✓</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}