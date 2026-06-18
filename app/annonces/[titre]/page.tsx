'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Clock, Phone, X, Shield, CheckCircle, Send, Briefcase, FileText, Calendar } from 'lucide-react';
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

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
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
      const res = await fetch(`/api/announcements/${params.titre}/contact`, {
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

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/announcements/${params.titre}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Annonce non trouvée' : 'Erreur serveur');
        const data = await res.json();
        if (data.success && data.announcement) {
          setAnnouncement(data.announcement);
        } else {
          throw new Error(data.error || "Erreur lors du chargement");
        }
      } catch (err) {
        console.error(err);
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.titre) fetchAnnouncement();
  }, [params.titre]);

  const authorName = announcement?.organization_name ||
    [announcement?.first_name, announcement?.last_name].filter(Boolean).join(' ') ||
    'Annonceur';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">😞</p>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Annonce introuvable</h1>
            <p className="text-sm text-gray-500 mb-6">Cette annonce n'existe plus ou a été supprimée.</p>
            <Button onClick={() => router.back()} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                  announcement.type === 'offer'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {announcement.type === 'offer' ? 'Offre' : 'Recherche'}
                </span>
                {announcement.urgency === 'high' && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-50 text-red-600">
                    Urgent
                  </span>
                )}
                <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {new Date(announcement.posted_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                {announcement.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {announcement.location}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  {announcement.specialty}
                </span>
                {announcement.start_date && announcement.end_date && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(announcement.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {new Date(announcement.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {announcement.description}
              </p>
            </div>

          </div>

          {/* Right — sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Annonceur
              </h3>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                  {authorName[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{authorName}</p>
                  <p className="text-xs text-gray-400 truncate">{announcement.specialty}</p>
                </div>
              </div>

              {/* Phone */}
              {announcement.hide_contact && (
                <button
                  onClick={() => setShowPhone(prev => !prev)}
                  className="w-full mb-4 flex items-center justify-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {showPhone && announcement.phone ? announcement.phone : 'Afficher le téléphone'}
                </button>
              )}

              {/* CTA */}
              <Button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Postuler maintenant
              </Button>

              <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Annonce vérifiée
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            {/* Modal header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Envoyer une candidature</h2>
                <p className="text-sm text-gray-400 truncate max-w-xs mt-0.5">{announcement.title}</p>
              </div>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-10 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Message envoyé !</h3>
                <p className="text-sm text-gray-500 mb-6">
                  L'annonceur vous contactera directement par email.
                </p>
                <Button onClick={closeForm} variant="outline" className="px-8">
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="senderName" className="text-sm text-gray-700">
                      Nom complet <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="senderName"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleFormChange}
                      placeholder="Dr. Dupont"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="senderPhone" className="text-sm text-gray-700">
                      Téléphone
                    </Label>
                    <Input
                      id="senderPhone"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleFormChange}
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="senderEmail" className="text-sm text-gray-700">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    value={formData.senderEmail}
                    onChange={handleFormChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm text-gray-700">
                    Message <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé(e)..."
                    rows={4}
                    className="resize-none"
                    required
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    disabled={submitting}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Envoi...
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

function Nav() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="DoctoNest" className="w-7 h-7 rounded-lg" />
          <span className="font-semibold text-gray-900">DoctoNest</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
