'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Star, Plus, Pencil, Trash2, MapPin, Calendar, X, Loader2, Mail, Phone, User, FileText, Clock, Building, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccess(false);
    setError("");

  };

  const handleOpenEdit = (exp: Experience) => {
    setForm({ ...exp });
    setEditId(exp.id);
    setOpenDialog(true);
    setSuccess(false);
    setError("");

  };

const handleSave = async () => {
  setError("");
  setSuccess(false);
  setSaveLoading(true);

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

    // ✅ ICI LE MESSAGE
    setSuccess(true);
    setSuccessMessage(
      editId
        ? "Expérience modifiée avec succès"
        : "Expérience ajoutée avec succès"
    );

    fetchExperiences(); // recharge la liste

  } catch (err) {
    setError(
      editId
        ? "Erreur lors de la modification de l'expérience"
        : "Erreur lors de l'ajout de l'expérience"
    );
  } finally {
    setSaveLoading(false);
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
      <Card className="bg-white rounded-xl border border-slate-200 shadow-sm ">
        <CardHeader className="pb-4 border-b border-slate-200 bg-slate-50 mt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Expériences professionnelles</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">Historique de vos missions et remplacements</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenAdd}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium h-10 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une expérience
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement des expériences...</span>
              </div>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-base mb-4">Aucune expérience enregistrée.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenAdd}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une première expérience
              </Button>
            </div>
          ) : (
  <div className="divide-y divide-slate-200">
  {experiences.map((exp) => (
    <div
      key={exp.id}
      className="py-4 flex items-start gap-4 hover:bg-slate-50 transition"
    >
      {/* Small icon */}
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <Briefcase className="w-5 h-5 text-amber-600" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">
              {exp.workplace_name}
            </h3>
            <p className="text-sm text-slate-600">
              {exp.workplace_type}
              {exp.location && ` • ${exp.location}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-blue-600"
              onClick={() => handleOpenEdit(exp)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-red-600"
              onClick={() => handleDelete(exp.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Meta line */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
          <span>
            {formatMonthYear(exp.start_date)} –{" "}
            {exp.end_date ? formatMonthYear(exp.end_date) : "Actuel"}
          </span>

          {exp.specialty && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {exp.specialty}
            </span>
          )}

          {exp.start_date && exp.end_date && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {(() => {
                const start = new Date(exp.start_date);
                const end = new Date(exp.end_date);
                const months =
                  (end.getFullYear() - start.getFullYear()) * 12 +
                  (end.getMonth() - start.getMonth()) +
                  1;
                return `${months} mois`;
              })()}
            </span>
          )}
        </div>

        {/* Optional description (collapsed) */}
        {exp.description && (
          <details className="mt-2 text-sm text-slate-600">
            <summary className="cursor-pointer text-blue-600 hover:underline">
              Voir plus
            </summary>
            <p className="mt-2 leading-relaxed">{exp.description}</p>
          </details>
        )}
      </div>
    </div>
  ))}
</div>

          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={(open) => { setOpenDialog(open); if (!open) setEditId(null); }}>
        <DialogContent className="w-[95vw] !max-w-6xl h-[90vh] p-0 rounded-xl bg-white shadow-2xl flex flex-col border-0">
          <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {editId ? "Modifier l'expérience" : "Ajouter une expérience"}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm mt-1">
                Renseignez les informations de votre mission ou remplacement
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setOpenDialog(false); setEditId(null); }}
              className="h-8 w-8 rounded-full hover:bg-slate-200"
            >
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-0 mt-0">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Section 1 - Informations principales */}
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Informations de l'établissement
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="workplace_name" className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      Nom de l'établissement
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="workplace_name"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.workplace_name || ""}
                      onChange={(e) => handleChange("workplace_name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="workplace_type" className="flex items-center gap-2 text-sm font-medium">
                      <Building className="w-4 h-4 text-slate-500" />
                      Type d'établissement
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="workplace_type"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.workplace_type || ""}
                      onChange={(e) => handleChange("workplace_type", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      Localisation
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="specialty" className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      Spécialité / Service
                    </Label>
                    <Input
                      id="specialty"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.specialty || ""}
                      onChange={(e) => handleChange("specialty", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Section 2 - Période */}
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Période de la mission
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="start_date" className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Date de début
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.start_date || ""}
                      onChange={(e) => handleChange("start_date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="end_date" className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Date de fin
                      <span className="text-slate-500 text-xs ml-1">(laissez vide si en cours)</span>
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.end_date || ""}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Section 3 - Description */}
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    id="description"
                    className="min-h-[120px] text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                    value={form.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Décrivez vos responsabilités, les compétences acquises, les projets réalisés..."
                  />
                </div>
              </section>

              {/* Section 4 - Référence */}
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact de référence
                  </h3>
                  <p className="text-slate-600 text-sm mt-2">
                    Personne à contacter pour vérifier cette expérience
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="reference_contact" className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4 text-slate-500" />
                      Nom du référent
                    </Label>
                    <Input
                      id="reference_contact"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.reference_contact || ""}
                      onChange={(e) => handleChange("reference_contact", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reference_phone" className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Téléphone du référent
                    </Label>
                    <Input
                      id="reference_phone"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.reference_phone || ""}
                      onChange={(e) => handleChange("reference_phone", e.target.value)}
                    />
                  </div>

                  <div className=" space-y-3">
                    <Label htmlFor="reference_email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email du référent
                    </Label>
                    <Input
                      id="reference_email"
                      type="email"
                      className="h-11 text-sm border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      value={form.reference_email || ""}
                      onChange={(e) => handleChange("reference_email", e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
          {/* MESSAGE GLOBAL (succès / erreur) */}
{(success || error) && (
  <div className="sticky bottom-[72px] z-50 px-6">
    <div
      className={`p-4 rounded-xl border-2 shadow-lg flex items-start gap-3 ${
        success
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      {success ? (
        <Check className="w-5 h-5 text-green-600 mt-0.5" />
      ) : (
        <X className="w-5 h-5 text-red-600 mt-0.5" />
      )}
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${
            success ? "text-green-800" : "text-red-800"
          }`}
        >
          {success ? "Succès" : "Erreur"}
        </p>
        <p
          className={`text-sm mt-1 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? successMessage : error}
        </p>
      </div>

      {/* Bouton fermer le message */}
      <button
        className="text-slate-400 hover:text-slate-600"
        onClick={() => {
          setSuccess(false);
          setError("");
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
)}


          <DialogFooter className="px-6 py-4 border-t bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-slate-500">
                <span className="text-red-500">*</span> Champs obligatoires
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setOpenDialog(false); setEditId(null); }}
                  disabled={saveLoading}
                  className="h-10 px-4 min-w-[100px]"
                >
                  Annuler
                </Button>
<Button
  className={`px-6 h-10 font-medium min-w-[140px] ${
    success
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700"
  } text-white`}
  onClick={() => {
    if (success) {
      setOpenDialog(false);
      setEditId(null);
      setSuccess(false);
      setError("");
    } else {
      handleSave();
    }
  }}
  disabled={saveLoading}
>
  {saveLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Enregistrement...</span>
    </div>
  ) : success ? (
    "Fermer"
  ) : editId ? (
    "Enregistrer les modifications"
  ) : (
    "Ajouter l'expérience"
  )}
</Button>

              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}