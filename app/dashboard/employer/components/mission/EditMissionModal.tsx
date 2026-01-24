import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Calendar, Euro, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={!!editMission} onOpenChange={(open) => { if (!open) setEditMission(null); }}>
      <DialogContent className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">Modifier la mission</DialogTitle>
              <CardDescription className="text-blue-700">Modifiez les informations de la mission</CardDescription>
            </div>
          </div>
        </DialogHeader>
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
              const missionsRes = await fetch(`/api/missions?employerId=${employerId}`, {
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
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Titre
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-lg transition-all"
                  placeholder="Entrez le titre de la mission"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">
                Spécialité
              </Label>
              <Input
                id="specialty"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                required
                className="py-3 bg-blue-50 border-blue-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-lg transition-all"
                placeholder="Entrez la spécialité"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Date de début
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 bg-blue-50 border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-lg transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                Date de fin
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                <Input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 bg-purple-50 border-purple-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-lg transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Lieu
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 bg-indigo-50 border-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-transparent rounded-lg transition-all"
                  placeholder="Entrez le lieu"
                />
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditMission(null)}
              className="rounded-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 font-semibold transition-all"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 font-semibold shadow-md transition-all"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}