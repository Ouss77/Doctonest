import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EditMissionModalProps {
  editMission: {
    id: string;
    title: string;
    specialty_required?: string;
    specialty?: string;
    start_date?: string;
    startDate?: string;
    end_date?: string;
    endDate?: string;
    daily_rate?: string;
    dailyRate?: string;
    location: string;
    description: string;
  } | null;
  employerId: string;
  setEditMission: (mission: any) => void;
  setMissions: (missions: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export default function EditMissionModal({
  editMission,
  employerId,
  setEditMission,
  setMissions,
  setLoading,
  setError,
}: EditMissionModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    specialty: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (editMission) {
      setForm({
        title: editMission.title || "",
        specialty: editMission.specialty_required || editMission.specialty || "",
        location: editMission.location || "",
        description: editMission.description || "",
      });
    }
  }, [editMission]);

  if (!editMission) return null;

  const missionSpecialty =
    form.specialty || editMission.specialty_required || editMission.specialty || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={!!editMission} onOpenChange={(open) => { if (!open) setEditMission(null); }}>
      {/* flex flex-col + max-h-[90vh] : la modale ne dépasse plus l'écran.
          L'en-tête reste fixe (shrink-0), seul le contenu défile. */}
      <DialogContent className="flex max-h-[88vh] max-w-[76rem] flex-col overflow-hidden border-0 bg-slate-50 p-0 shadow-2xl sm:rounded-[28px]">
        {/* En-tête fixe */}
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-sky-800 px-5 py-4 text-white md:px-6 md:py-5">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm md:h-12 md:w-12">
                <Briefcase className="h-6 w-6 text-sky-200" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-white md:text-2xl">
                  Modifier la mission
                </DialogTitle>
                <p className="text-sm text-slate-200">Ajustez les champs essentiels.</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Zone scrollable : formulaire + aperçu */}
        <div className="">
          <div className="bg-white px-5 py-5 md:px-7 md:py-7">
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
                    }),
                  });
                  if (!res.ok) throw new Error("Erreur lors de la modification de la mission");
                  const missionsRes = await fetch(`/api/missions?visibility=mine`, {
                    credentials: "include",
                  });
                  const missionsData = await missionsRes.json();
                  setMissions(missionsData.missions || []);
                  toast({
                    title: "Mission modifiée",
                    description: "Les modifications ont bien été enregistrées.",
                    variant: "success",
                  });
                  setEditMission(null);
                } catch (err) {
                  setError("Erreur lors de la modification de la mission");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
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
                      className="h-11 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
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
                    className="h-11 border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Entrez la spécialité"
                  />
                </div>

                <div className="space-y-2">
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
                      className="h-11 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
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
                  rows={4}
                  className="min-h-[130px] resize-none border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Décrivez la mission, le contexte, les contraintes et les attentes principales..."
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditMission(null)}
                  className="h-10 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="h-10 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:via-sky-700 hover:to-indigo-700"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}