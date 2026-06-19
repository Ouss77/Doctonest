'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Eye, RotateCcw, Briefcase,
  Clock, Phone, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Headerannonces from '@/components/annonces/Headerannonces';

export interface Announcement {
  id: string;
  title: string;
  specialty: string;
  location: string;
  type: string;
  description: string;
  posted_date: string;
  urgency: string;
  authorName?: string;
  phone?: string;
  hideContact?: boolean;
}

interface Props {
  initialAnnouncements: Announcement[];
}

const specialties = [
  "Cardiologie", "Médecine générale", "Pédiatrie", "Dermatologie", "Gynécologie",
  "Ophtalmologie", "Orthopédie", "Psychiatrie", "Radiologie", "Chirurgie",
  "Anesthésie", "ORL", "Urologie", "Neurologie", "Endocrinologie", "Rhumatologie",
];

const cities = [
  "Rabat", "Casablanca", "Fès", "Marrakech", "Tanger", "Agadir", "Oujda",
  "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Errachidia", "Taza",
];

export default function AnnoncesClient({ initialAnnouncements }: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const [announcements] = useState<Announcement[]>(initialAnnouncements);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [error] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    let filtered = [...announcements];
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw)
      );
    }
    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter(a =>
        a.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter(a =>
        a.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }
    setFilteredAnnouncements(filtered);
  }, [searchKeyword, selectedSpecialty, selectedCity, announcements]);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const hasActiveFilters = searchKeyword || selectedSpecialty || selectedCity;

  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedSpecialty("");
    setSelectedCity("");
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Headerannonces />

      {/* ── Filter bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description…"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition"
              />
            </div>

            {/* Specialty */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedSpecialty}
                onChange={e => setSelectedSpecialty(e.target.value)}
                className="pl-9 pr-8 h-10 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition appearance-none cursor-pointer min-w-[170px]"
              >
                <option value="">Toutes spécialités</option>
                {specialties.map(s => (
                  <option key={s} value={s.toLowerCase()}>{s}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="pl-9 pr-8 h-10 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="">Toutes villes</option>
                {cities.map(c => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>

            {/* Reset — only visible when filters are active */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 transition whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="mt-2.5 text-xs text-gray-400">
            {filteredAnnouncements.length} annonce{filteredAnnouncements.length !== 1 ? 's' : ''} trouvée{filteredAnnouncements.length !== 1 ? 's' : ''}
            {hasActiveFilters && <span className="ml-1 text-blue-500">· filtres actifs</span>}
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8" ref={listRef}>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3.5 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Empty */}
        {filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune annonce trouvée</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-xs">
              Modifiez vos critères de recherche pour voir plus de résultats.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

        /* Grid */
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredAnnouncements.map(a => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────── */
function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  const isOffer = a.type === 'offer';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

      {/* Colored top strip */}
      <div className={`h-1 w-full ${isOffer ? 'bg-blue-600' : 'bg-emerald-500'}`} />

      <div className="p-5 flex flex-col flex-1">

        {/* Badges + date */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            isOffer
              ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
              : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
          }`}>
            {isOffer ? 'Offre' : 'Recherche'}
          </span>

          {a.urgency === 'high' && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-red-50 text-red-500 ring-1 ring-red-100">
              Urgent
            </span>
          )}

          <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {a.posted_date
              ? new Date(a.posted_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              : '—'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[0.95rem] font-semibold text-gray-900 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors min-h-[2.8rem]">
          {a.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mb-3">
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            {a.location}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            {a.specialty}
          </span>
        </div>

        {/* Description */}
        <p className="text-[0.8rem] text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {a.description}
        </p>

        {/* Author */}
        {a.authorName && (
          <div className="mb-4 flex items-center gap-2.5 py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-7 h-7 rounded-full bg-[#0d1b3e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {a.authorName[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400">Publié par</p>
              <p className="text-xs font-semibold text-gray-700 truncate">{a.authorName}</p>
            </div>
            {a.phone && !a.hideContact && (
              <a
                href={`tel:${a.phone}`}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-700 transition whitespace-nowrap"
              >
                <Phone className="w-3 h-3" />
                {a.phone}
              </a>
            )}
          </div>
        )}

        {/* CTA */}
        <Link href={`/annonces/${encodeURIComponent(a.id)}`} className="mt-auto block">
          <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isOffer
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}>
            <Eye className="w-4 h-4" />
            Voir les détails
          </button>
        </Link>

      </div>
    </div>
  );
}
