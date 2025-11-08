'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, User, Phone, Mail } from 'lucide-react';
import Header from '@/components/annonces/header';

const specialties = [
  "Cardiologie","Médecine générale","Pédiatrie","Dermatologie","Gynécologie",
  "Ophtalmologie","Orthopédie","Psychiatrie","Radiologie","Chirurgie",
  "Anesthésie","ORL","Urologie","Neurologie","Endocrinologie","Rhumatologie"
];

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [missionType, setMissionType] = useState('replacement');

  // New: contact/info fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactOrg, setContactOrg] = useState('');

  // NEW: user role + hidePhone + password (password kept local only)
  const [userRole, setUserRole] = useState<'medecin' | 'institution'>('medecin');
  const [hidePhone, setHidePhone] = useState(false);
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null); // <-- nouveau

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !specialty || !location.trim() || !description.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // default dates (today) because DB requires start_date and end_date NOT NULL
    const today = new Date().toISOString().slice(0,10);

    // Append contact info into description so it's stored with the mission
    const fullDescription = `${description.trim()}

--- Contact de l'annonceur ---
${contactName ? `Nom : ${contactName}` : ''}
${contactOrg ? `Organisation : ${contactOrg}` : ''}
${contactEmail ? `Email : ${contactEmail}` : ''}
${contactPhone && !hidePhone ? `Téléphone : ${contactPhone}` : (contactPhone && hidePhone ? `Téléphone : (masqué par l'annonceur)` : '')}
Rôle annonceur : ${userRole === 'medecin' ? 'Médecin' : 'Institution'}
${password ? 'Mot de passe fourni : oui' : ''}
`.trim();

    setLoading(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: fullDescription,
          specialty,
          location: location.trim(),
          start_date: today,
          end_date: today,
          mission_type: missionType
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Erreur serveur.');
        setLoading(false);
        return;
      }
      router.push('/annonces');
    } catch (err) {
      console.error(err);
      setError('Erreur réseau, réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main full-width pale-blue container (like the image) */}
      <div className="w-full bg-gradient-to-b from-blue-50 to-white py-2">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="bg-sky-50 rounded-3xl p-8 md:p-12 shadow-xl">
            {/* Header of the card with avatar + title */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                {/* small avatar icon */}
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Déposer une annonce
                </h1>
                <p className="text-sm md:text-base text-slate-700 mt-1">
                  Remplissez les informations ci‑dessous. Les dates sont définies automatiquement.
                </p>
              </div>
            </div>

            {/* Two-column cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left card - Votre annonce */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-blue-100 flex items-center justify-center text-blue-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Votre annonce</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Titre de l'annonce *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Ex : Médecin généraliste - Cabinet Rabat"
                    className="w-full border rounded-lg px-4 py-2 text-base" />

                  <label className="block text-sm font-medium text-slate-700">Spécialité *</label>
                  <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-base bg-white">
                    <option value="">Sélectionnez une spécialité</option>
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <label className="block text-sm font-medium text-slate-700">Localisation *</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ville, région" className="w-full border rounded-lg px-4 py-2 text-base" />

                  <label className="block text-sm font-medium text-slate-700">Description *</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Détails sur la mission, horaires, patientèle, équipement..."
                    className="w-full border rounded-lg px-4 py-2 text-base h-36 resize-vertical" />

                  <label className="block text-sm font-medium text-slate-700">Type de mission</label>
                  <select value={missionType} onChange={e => setMissionType(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-base bg-white">
                    <option value="replacement">Remplacement</option>
                    <option value="vacation">Vacation</option>
                    <option value="emergency">Urgence</option>
                  </select>
                </div>
              </div>

              {/* Right card - Vos informations */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Vos informations</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-2">Vous êtes *</div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setUserRole('medecin')}
                        className={`px-3 py-2 rounded-full border ${userRole === 'medecin' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}>Médecin</button>
                      <button type="button" onClick={() => setUserRole('institution')}
                        className={`px-3 py-2 rounded-full border ${userRole === 'institution' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}>Institution</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom / Contact</label>
                    <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Votre nom" className="w-full border rounded-lg px-4 py-2 text-base" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Votre email" type="email" className="w-full border rounded-lg px-4 py-2 text-base" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+212 6 .. .. .. .." className="w-full border rounded-lg px-4 py-2 text-base" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input id="hidePhone" type="checkbox" checked={hidePhone} onChange={e => setHidePhone(e.target.checked)} className="mt-1" />
                      <label htmlFor="hidePhone" className="text-sm text-slate-600">Masquer mon numéro de téléphone sur l'annonce</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organisation (optionnel)</label>
                    <input value={contactOrg} onChange={e => setContactOrg(e.target.value)} placeholder="Cabinet, Clinique..." className="w-full border rounded-lg px-4 py-2 text-base" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Votre mot de passe (optionnel)</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Votre mot de passe" type="password" className="w-full border rounded-lg px-4 py-2 text-base" />
                    <p className="text-xs text-slate-500 mt-1">Le mot de passe n'est pas envoyé au serveur par défaut.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Publish button centered below the two cards */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={loading}
                className="bg-blue-600 text-white rounded-full px-8 py-3 text-lg shadow-lg hover:bg-blue-700"
              >
                {loading ? 'Publication...' : "Publier l'annonce"}
              </button>
            </div>

            {/* Small helper text */}
            <p className="mt-6 text-sm text-slate-600 text-center">
              Note : les dates de la mission sont automatiquement réglées à aujourd'hui. Vous pouvez les mettre à jour après publication.
            </p>
          </div>
        </div>
      </div>

      {/* existing rest of page (if any) */}
    </div>
  );
}
