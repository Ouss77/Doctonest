'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Star, Plus, Pencil, Trash2, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

const formatMonthYear = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR", { month: "long", year: "numeric" });
};

interface Experience {
  id: string;
  workplace_name: string;
  workplace_type: string;
  location: string;
  start_date: string;
  end_date?: string;
  duration_months?: number;
  specialty?: string;
  description?: string;
  reference_contact?: string;
  reference_phone?: string;
  reference_email?: string;
  rating?: number;
}

export default function MyMissionsSection() {
  const [openDialog, setOpenDialog] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Experience>>({});
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/experiences");
      if (!res.ok) throw new Error("Erreur lors du chargement des expériences");
      const data = await res.json();
      setExperiences(data.experiences || []);
    } catch (err) {
      setError("Erreur lors du chargement des expériences");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setForm({});
    setEditId(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setForm({ ...exp });
    setEditId(exp.id);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = {
        workplaceName: form.workplace_name || "",
        workplaceType: form.workplace_type || "",
        location: form.location || "",
        startDate: form.start_date || "",
        endDate: form.end_date,
        specialty: form.specialty,
        description: form.description,
        referenceContact: form.reference_contact,
        referencePhone: form.reference_phone,
        referenceEmail: form.reference_email,
      };
      let res;
      if (editId) {
        res = await fetch(`/api/users/experiences/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Erreur lors de la modification de l'expérience");
      } else {
        res = await fetch("/api/users/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Erreur lors de l'ajout de l'expérience");
      }
      setOpenDialog(false);
      setEditId(null);
      fetchExperiences();
    } catch (err) {
      setError(editId ? "Erreur lors de la modification de l'expérience" : "Erreur lors de l'ajout de l'expérience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette expérience ?")) return;
    setError("");
    try {
      const res = await fetch(`/api/users/experiences/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'expérience");
      fetchExperiences();
    } catch (err) {
      setError("Erreur lors de la suppression de l'expérience");
    }
  };

  const handleChange = (field: keyof Experience, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* LinkedIn-style Card: Experiences Section */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Expériences</CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">Historique de vos remplacements</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenAdd}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500 py-8 text-sm">Chargement des expériences...</div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">Aucune expérience enregistrée.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenAdd}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter une expérience
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 truncate">
                            {exp.workplace_name}
                          </h3>
                          <p className="text-sm text-gray-600">{exp.workplace_type}</p>
                        </div>
                      </div>

                      <div className="ml-14 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {formatMonthYear(exp.start_date)}
                            {exp.end_date ? ` - ${formatMonthYear(exp.end_date)}` : " - Actuel"}
                          </span>
                        </div>
                        {exp.specialty && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Spécialité :</span> {exp.specialty}
                          </div>
                        )}
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
                        )}
                        {exp.reference_contact && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Référence : {exp.reference_contact}
                              {exp.reference_phone && ` • ${exp.reference_phone}`}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3 ml-14">
                        {exp.start_date && exp.end_date && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            {(() => {
                              const start = new Date(exp.start_date);
                              const end = new Date(exp.end_date);
                              const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
                              return `${months} mois`;
                            })()}
                          </Badge>
                        )}
                        {exp.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-700">{exp.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpenEdit(exp)}
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(exp.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={(open) => { setOpenDialog(open); if (!open) setEditId(null); }}>
        <DialogContent className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editId ? "Modifier l'expérience" : "Ajouter une expérience"}
            </DialogTitle>
          </DialogHeader>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Établissement</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.workplace_name || ""}
                onChange={(e) => handleChange("workplace_name", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Type d'établissement</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.workplace_type || ""}
                onChange={(e) => handleChange("workplace_type", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Localisation</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Date de début</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                type="date"
                value={form.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Date de fin</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                type="date"
                value={form.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Spécialité</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.specialty || ""}
                onChange={(e) => handleChange("specialty", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Référence (contact)</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.reference_contact || ""}
                onChange={(e) => handleChange("reference_contact", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Téléphone de référence</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.reference_phone || ""}
                onChange={(e) => handleChange("reference_phone", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email de référence</Label>
              <Input
                className="mt-1.5 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                type="email"
                value={form.reference_email || ""}
                onChange={(e) => handleChange("reference_email", e.target.value)}
              />
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setEditId(null);
              }}
            >
              Annuler
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
            >
              {editId ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
