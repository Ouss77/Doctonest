'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, MapPin, Clock, Phone, X, Shield,
  CheckCircle, Send, Briefcase, FileText, Calendar,
} from 'lucide-react';
import Link from "next/link";

export interface AnnouncementDetail {
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

interface ContactForm {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
}

export default function AnnouncementDetailClient({ announcement }: { announcement: AnnouncementDetail }) {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.senderEmail.trim() || !formData.message.trim()) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch(`/api/announcements/${announcement.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setFormError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowContactForm(false);
    setSubmitted(false);
    setFormError('');
    setFormData({ senderName: '', senderEmail: '', senderPhone: '', message: '' });
  };

  const authorName = announcement.organization_name ||
    [announcement.first_name, announcement.last_name].filter(Boolean).join(' ') ||
    'Annonceur';

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Nav />

      {/* ── Hero — dark navy ──────────────────────────────────── */}
      <div className="bg-[#0d1b3e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-8">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-blue-300 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux annonces
          </button>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
              announcement.type === 'offer'
                ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/40'
                : 'bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/40'
            }`}>
              {announcement.type === 'offer' ? 'Offre de remplacement' : 'Recherche de remplacement'}
            </span>

            {announcement.urgency === 'high' && (
              <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-400/40">
                Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-[1.8rem] font-bold text-white leading-snug mb-6">
            {announcement.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-blue-200/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {announcement.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" />
              {announcement.specialty}
            </span>
            {announcement.start_date && announcement.end_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                {new Date(announcement.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                {' – '}
                {new Date(announcement.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            )}
            <span className="flex items-center gap-1.5 sm:ml-auto text-blue-300/60">
              <Clock className="w-4 h-4" />
              Publié le {new Date(announcement.posted_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">Description de la mission</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-[0.9rem] text-gray-600 leading-7 whitespace-pre-line">
                  {announcement.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm sticky top-6">

              {/* Author — blue header */}
              <div className="bg-blue-600 px-5 py-5">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">
                  Annonceur
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white text-blue-600 font-bold text-base flex items-center justify-center flex-shrink-0 shadow-md">
                    {authorName[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{authorName}</p>
                    <p className="text-xs text-blue-200 truncate mt-0.5">{announcement.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-5 space-y-3">
                {announcement.hide_contact && (
                  <button
                    onClick={() => setShowPhone(prev => !prev)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {showPhone && announcement.phone ? announcement.phone : 'Afficher le téléphone'}
                  </button>
                )}

                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm shadow-blue-200"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Postuler maintenant
                </Button>

                <div className="flex items-center justify-center gap-1.5 pt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-gray-400">Annonce vérifiée par DoctoNest</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Contact Modal ──────────────────────────────────────── */}
      {showContactForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden border border-gray-200/80">

            {/* Header */}
            <div className="bg-[#0d1b3e] px-6 pt-5 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Envoyer une candidature</h2>
                <p className="text-xs text-blue-300 mt-0.5 truncate max-w-[300px]">{announcement.title}</p>
              </div>
              <button
                onClick={closeForm}
                className="p-1 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">Message envoyé !</h3>
                <p className="text-sm text-gray-400 mb-7 max-w-[260px] mx-auto">
                  L'annonceur va recevoir votre message et vous contactera par email.
                </p>
                <Button onClick={closeForm} variant="outline" size="sm" className="px-8">
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="senderName" className="text-xs font-medium text-gray-600">
                      Nom complet <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="senderName"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleFormChange}
                      placeholder="Dr. Dupont"
                      className="h-9 text-sm rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="senderPhone" className="text-xs font-medium text-gray-600">
                      Téléphone
                    </Label>
                    <Input
                      id="senderPhone"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleFormChange}
                      placeholder="+212 6XX XXX XXX"
                      className="h-9 text-sm rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="senderEmail" className="text-xs font-medium text-gray-600">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    value={formData.senderEmail}
                    onChange={handleFormChange}
                    placeholder="votre@email.com"
                    className="h-9 text-sm rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-medium text-gray-600">
                    Message <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé(e)…"
                    rows={4}
                    className="text-sm rounded-lg resize-none"
                    required
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                    {formError}
                  </p>
                )}

                <div className="flex gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    disabled={submitting}
                    className="flex-1 h-9 rounded-lg text-sm"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        Envoyer
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Nav ──────────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="DoctoNest" className="w-7 h-7 rounded-lg" />
          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition">DoctoNest</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4">
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
