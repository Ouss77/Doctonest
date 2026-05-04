import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Calendar, Clock3, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditMissionModalProps {
  editMission: {     id: string;     title: string;     specialty_required?: string;
    specialty?: string;     start_date?: string;     startDate?: string;
    end_date?: string;     endDate?: string;     daily_rate?: string;
    dailyRate?: string;     location: string;     description: string;   } | null;
  employerId: string;
  setEditMission: (mission: any) => void;
  setMissions: (missions: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export default function EditMissionModal({
  editMission,  employerId,   setEditMission,   setMissions,  setLoading,   setError,}: EditMissionModalProps) {
  const [form, setForm] = useState({
    title: "",
    specialty: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
  }); 

  useEffect(() => {
    if (editMission) {
      setForm({
        title: editMission.title || "",
        specialty: editMission.specialty_required || editMission.specialty || "",
        startDate: editMission.start_date || editMission.startDate || "",
        endDate: editMission.end_date || editMission.endDate || "",
        location: editMission.location || "",
        description: editMission.description || "",
      });
    }
  }, [editMission]);


  if (!editMission) return null;

  const missionSpecialty = form.specialty || editMission.specialty_required || editMission.specialty || "";

  const formatDate = (value: string) => {
    if (!value) return "Non renseignée";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={!!editMission} onOpenChange={(open) => { if (!open) setEditMission(null); }}>
      <DialogContent className="max-w-5xl overflow-hidden border-0 bg-slate-50 p-0 shadow-2xl sm:rounded-3xl">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-sky-800 px-6 py-6 text-white">
          <DialogHeader className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Briefcase className="w-7 h-7 text-sky-200" />
              </div>
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-100 ring-1 ring-white/15">
                  <Sparkles className="h-3.5 w-3.5" />
                  Edition de mission
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Modifier la mission
                </DialogTitle>
                <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
                  Ajustez les informations de la mission sans quitter votre espace employeur.
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="bg-white px-6 py-6 md:px-8 md:py-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
              const res = await fetch(`/api/missions/${editMission.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  title: form.title,
                  description: form.description,
                  specialty: form.specialty,
                  location: form.location,
                  startDate: form.startDate,
                  endDate: form.endDate,
                }),
              });
              if (!res.ok) throw new Error("Erreur lors de la modification de la mission");
              const missionsRes = await fetch(`/api/missions?visibility=mine`, {
                credentials: "include",
              });
              const missionsData = await missionsRes.json();
              setMissions(missionsData.missions || []);
              setEditMission(null);
            } catch (err) {
              setError("Erreur lors de la modification de la mission");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-7"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Titre
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Entrez le titre de la mission"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-sm font-semibold text-slate-700">
                Spécialité
              </Label>
              <Input
                id="specialty"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                required
                className="h-12 border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                placeholder="Entrez la spécialité"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-semibold text-slate-700">
                Date de début
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-semibold text-slate-700">
                Date de fin
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                Lieu
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ville, adresse, région"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="min-h-[150px] resize-none border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              placeholder="Décrivez la mission, le contexte, la durée, les contraintes et les attentes..."
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMission(null)}
              className="h-11 rounded-xl border-slate-200 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 px-7 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:via-sky-700 hover:to-indigo-700"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </form>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 px-6 py-6 md:px-8 lg:border-l lg:border-t-0">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Aperçu de la mission</p>
                  <p className="text-xs text-slate-500">Ce que les candidats verront</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Titre</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{form.title || editMission.title}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MapPin className="h-4 w-4 text-indigo-500" />
                      Localisation
                    </div>
                    <p className="mt-2 text-sm text-slate-900">{form.location || "Non renseignée"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Clock3 className="h-4 w-4 text-sky-500" />
                      Dates
                    </div>
                    <p className="mt-2 text-sm text-slate-900">
                      {formatDate(form.startDate)} - {formatDate(form.endDate)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 p-4 ring-1 ring-sky-100">
                  <p className="text-xs font-medium uppercase tracking-wide text-sky-700">Spécialité</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{missionSpecialty || "Non renseignée"}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Gardez un titre clair, une localisation précise et une description structurée pour améliorer la lisibilité de votre annonce.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}