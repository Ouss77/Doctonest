import { useState } from "react";
import { Briefcase, Calendar, Euro, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


interface AddMissionModalProps {
  showForm: boolean;
  setShowForm: (open: boolean) => void;
  setMissions: (missions: any[]) => void;
  employerId: string;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export default function AddMissionModal({ showForm, setShowForm, setMissions, employerId, setLoading, setError }: AddMissionModalProps) {
  const [form, setForm] = useState({
    title: "",
    specialty: "",
    location: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.specialty) {
      setError("Veuillez sélectionner une spécialité.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          specialty_required: form.specialty,
          location: form.location,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur lors de l'ajout de la mission");
      }
      const missionsRes = await fetch(`/api/missions?employerId=${employerId}`, { credentials: "include" });
      const missionsData = await missionsRes.json();
      setMissions(missionsData.missions || []);
      setForm({ title: "", specialty: "", location: "", description: "" });
      setSuccess(true);
      // Only close modal after message is shown
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout de la mission");
    } finally {
      setLoading(false);
    }
  }

  // List of specialties
  const allSpecialties = [
    "Cardiologie", "Médecine générale", "Pédiatrie", "Dermatologie", "Gynécologie", "Ophtalmologie", "Orthopédie", "Psychiatrie", "Radiologie", "Chirurgie", "Anesthésie", "ORL", "Urologie", "Neurologie", "Endocrinologie", "Rhumatologie", "Gastro-entérologie", "Hématologie", "Oncologie", "Néphrologie", "Pneumologie", "Médecine interne", "Médecine du travail", "Médecine nucléaire", "Médecine physique et réadaptation", "Médecine tropicale", "Autre"
  ];

  // Always show dialog if success is true, so message is visible
  const dialogOpen = showForm || success;
  return (
    <Dialog open={dialogOpen} onOpenChange={setShowForm}>
      <DialogContent className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">Nouvelle mission</DialogTitle>
              <CardDescription className="text-blue-700">Ajoutez une nouvelle mission à votre établissement</CardDescription>
            </div>
          </div>
        </DialogHeader>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg text-center font-semibold text-lg transition-all duration-300">
            Mission ajoutée avec succès !
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Titre full width */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Titre
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="pl-10 py-3 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-all w-full"
                    placeholder="Entrez le titre de la mission"
                  />
                </div>
              </div>
              {/* Spécialité et Lieu side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">
                    Spécialité
                  </Label>
                  <Select
                    value={form.specialty}
                    onValueChange={value => setForm({ ...form, specialty: value })}
                  >
                    <SelectTrigger className={`py-3 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-lg transition-all w-full ${!form.specialty && 'border-red-400'}`}>
                      <SelectValue placeholder="Sélectionnez la spécialité *" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSpecialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Lieu
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      className="pl-10 py-3 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-lg transition-all"
                      placeholder="Entrez le lieu"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent rounded-lg transition-all resize-none"
                placeholder="Décrivez la mission..."
              />
            </div>

            <DialogFooter className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 font-semibold transition-all"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 font-semibold shadow-md transition-all"
              >
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}