'use client';

import { useState, useRef, useEffect	 } from 'react';
import { useRouter } from 'next/navigation';
import {  ArrowRight,  FileText,  User,  Phone,  Mail,  MapPin,  Building2,  Stethoscope,  CheckCircle2,  AlertCircle,   X,
  Shield,   Eye,  EyeOff,  Loader2,  Info } from 'lucide-react';
import Header from '@/components/annonces/header';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specialtyRequired, setSpecialtyRequired] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [userRole, setUserRole] = useState<'medecin' | 'institution'>('medecin');
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [editLink, setEditLink] = useState<string | null>(null);

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!title.trim()) return "Le titre est obligatoire";
      if (!location.trim()) return "La localisation est obligatoire";
      if (!specialtyRequired.trim()) return "La spécialité requise est obligatoire";
      if (description.trim().length < 50) return "La description doit contenir au moins 50 caractères";
      return null;
    }
    if (step === 2) {
      if (!contactName.trim()) return "Le nom est obligatoire";
      if (!contactEmail.trim()) return "L'email est obligatoire";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return "Format d'email invalide";
      return null;
    }
    return null;
  };

  const nextStep = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setError(null);
    setEditLink(null);

    const step1Error = validateStep(1);
    const step2Error = validateStep(2);
    
    if (step1Error || step2Error) {
      setError(step1Error || step2Error);
      return;
    } 

    setLoading(true);

    try {
      const resMission = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          specialty_required: specialtyRequired.trim(),
          guest_email: contactEmail.trim(),
          guest_name: contactName.trim(),
        }),
      });

      const missionData = await resMission.json();

      if (!resMission.ok) {
        throw new Error(missionData?.error || 'Erreur lors de la création de l\'annonce.');
      }

      setEditLink(missionData?.editLink || null);
      setPublishMessage(
        missionData?.editLink
          ? "Annonce créée avec succès. Ce lien sécurisé vous permet de la modifier ou de la supprimer."
          : "Annonce soumise avec succès ! Votre annonce est en attente de validation par un administrateur. Vous serez notifié(e) par email après validation."
      );
      setPublishSuccess(true);

      if (!missionData?.editLink) {
        setTimeout(() => {
          router.push('/annonces');
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
  const timer = setTimeout(() => {
    listRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 500); // ⏳ 2.5 secondes (tu peux mettre 2000 ou 3000)

  return () => clearTimeout(timer);
}, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* SUCCESS BANNER */}
      {publishSuccess && publishMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-fade-in">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-2xl p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">Annonce soumise !</h3>
                <p className="text-sm mt-1 text-white/95">{publishMessage}</p>
                {editLink && (
                  <div className="mt-3 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm break-all">
                    <a href={editLink} className="underline underline-offset-2" target="_blank" rel="noreferrer">
                      {editLink}
                    </a>
                  </div>
                )}
                <div className="mt-3 flex items-center text-sm text-white/80">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {editLink ? 'Conservez ce lien pour modifier ou supprimer votre annonce.' : 'Redirection dans 5 secondes...'}
                </div>
              </div>
              <button 
                onClick={() => setPublishSuccess(false)}
                className="text-white/80 hover:text-white p-1"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8" id="annonces-list" ref={listRef}>
        {/* HEADER */}
        {/* <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4 shadow-lg">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publier une annonce
          </h1>
          <p className="text-gray-600">
            Remplissez les informations pour publier votre annonce de remplacement
          </p>
        </div> */}
        {/* PROGRESS INDICATOR */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Détails
              </span> 
            </div>
            
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div 
                className={`h-full bg-blue-600 transition-all duration-300 ${currentStep >= 2 ? 'w-full' : 'w-1/2'}`}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                Contact
              </span>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        )}

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="p-6 md:p-8">
            {/* STEP 1: ANNOUNCEMENT DETAILS */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    Détails de l'annonce
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre de l'annonce *
                        </label>
                        <input
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="Ex : Recherche médecin généraliste - Cabinet Rabat"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localisation *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Ville, adresse, région"
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialité requise *
                      </label>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          value={specialtyRequired}
                          onChange={e => setSpecialtyRequired(e.target.value)}
                          placeholder="Ex : Médecine générale, Cardiologie..."
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description détaillée *
                        </label>
                        <span className="text-xs text-gray-500">
                          {description.length}/50 caractères minimum
                        </span>
                      </div>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={5}
                        placeholder="Décrivez la mission, les responsabilités, les horaires, la patientèle, les équipements disponibles..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      />
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Soyez précis pour attirer les candidats pertinents
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT INFORMATION */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    Informations de contact
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vous êtes *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUserRole('medecin')}
                          className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                            userRole === 'medecin'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Stethoscope className="w-4 h-4" />
                          <span className="font-medium">Médecin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserRole('institution')}
                          className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                            userRole === 'institution'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">Institution</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          placeholder="votre@email.com"
                          type="email"
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="+212 6 XX XX XX XX"
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          id="hidePhone"
                          type="checkbox"
                          checked={showContact}
                          onChange={e => setShowContact(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="hidePhone" className="text-sm text-gray-700 flex items-center gap-2">
                          {showContact ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          Afficher mon numéro sur l'annonce publique
                        </label>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                          <strong>Confidentialité :</strong> Votre email ne sera pas affiché publiquement. 
                          Seuls les médecins inscrits pourront vous contacter.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-lg border font-medium transition ${
                  currentStep === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ← Retour
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Publier l'annonce
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            L'annonce sera validée par notre équipe sous 24h maximum
          </p>
        </div>
      </div>
    </div>
  );
}