import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  Building,
  BookOpen,
  Loader2,
  AlertCircle,
  Edit2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
interface Diploma {
  id: string;
  title: string;
  institution: string;
  year?: string;
  description?: string;
  createdAt?: string;
}

export default function DiplomasSection() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogSuccess, setDialogSuccess] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [form, setForm] = useState({
    title: "",
    institution: "",
    year: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDiplomas();
  }, []);

  const fetchDiplomas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users/diplomas");
      if (!res.ok) throw new Error("Échec du chargement des diplômes");
      const data = await res.json();
      setDiplomas(data.diplomas || []);
    } catch (err) {
      setError("Impossible de charger vos diplômes. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.title.trim()) {
      errors.title = "Le titre est requis";
    } else if (form.title.length < 2) {
      errors.title = "Le titre doit contenir au moins 2 caractères";
    }

    if (!form.institution.trim()) {
      errors.institution = "L'établissement est requis";
    }

    if (form.year && !/^\d{4}$/.test(form.year)) {
      errors.year = "Format d'année invalide (ex: 2024)";
    }

    if (form.description && form.description.length > 500) {
      errors.description = "La description ne doit pas dépasser 500 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddDiploma = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const method = selectedDiploma ? "PUT" : "POST";
      const url = selectedDiploma
        ? `/api/users/diplomas/${selectedDiploma.id}`
        : "/api/users/diplomas";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          institution: form.institution.trim(),
          description: form.description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || selectedDiploma
            ? "Échec de la mise à jour du diplôme"
            : "Échec de l'ajout du diplôme",
        );
      }

      setForm({ title: "", institution: "", year: "", description: "" });
      setSelectedDiploma(null);
      setDialogSuccess(
        selectedDiploma
          ? "Diplôme mis à jour avec succès"
          : "Diplôme ajouté avec succès. En attente de vérification.",
      );
      fetchDiplomas();
    } catch (err) {
      setDialogError(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDiploma = async (id: string) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce diplôme ? Cette action est irréversible.",
      )
    )
      return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/users/diplomas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Échec de la suppression");

      setSuccess("Diplôme supprimé avec succès");
      fetchDiplomas();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError("Impossible de supprimer le diplôme");
    }
  };

  const openEditDialog = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
    setForm({
      title: diploma.title,
      institution: diploma.institution,
      year: diploma.year || "",
      description: diploma.description || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDiploma(null);
    setForm({ title: "", institution: "", year: "", description: "" });
    setFormErrors({});
    setDialogSuccess(null);
    setDialogError(null);
  };

  return (
    <>
      {/* Card Section */}
      <Card className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Diplômes & Formations
                </CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Vos diplômes, certificats et formations
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenDialog(true)}
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
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
              {success}
            </div>
          )}
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement...</span>
              </div>
            </div>
          ) : diplomas.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">
                Aucun diplôme ou formation ajouté.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenDialog(true)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un diplôme
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {diplomas.map((diploma) => (
                <div
                  key={diploma.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all bg-white group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-sm text-slate-900 truncate">
                                {diploma.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {diploma.institution}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => openEditDialog(diploma)}
                                title="Modifier"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteDiploma(diploma.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="ml-14 space-y-1 mt-1">
                            <div className="flex items-center gap-2">
                              {diploma.year && (
                                <div className="flex items-center gap-1 text-xs text-slate-600">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  <span>{diploma.year}</span>
                                </div>
                              )}
                            </div>

                            {diploma.description && (
                              <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                                {diploma.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="w-[95vw] !max-w-5xl h-[85vh] p-0 rounded-xl bg-white shadow-2xl flex flex-col border-0">
          <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {selectedDiploma ? "Modifier le diplôme" : "Ajouter un diplôme"}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm mt-1">
                {selectedDiploma
                  ? "Modifiez les informations de votre diplôme"
                  : "Ajoutez un diplôme, certificat, ou formation professionnelle"}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseDialog}
              className="h-8 w-8 rounded-full hover:bg-slate-200"
            ></Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      Titre du diplôme
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className={`h-11 text-sm border-slate-300 focus:border-blue-500 ${formErrors.title ? "border-red-500" : ""}`}
                      placeholder="Ex: Doctorat en Médecine"
                      required
                    />
                    {formErrors.title && (
                      <p className="text-xs text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="year"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Année d'obtention
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className={`h-11 text-sm border-slate-300 focus:border-blue-500 ${formErrors.year ? "border-red-500" : ""}`}
                      placeholder="Ex: 2020"
                    />
                    {formErrors.year && (
                      <p className="text-xs text-red-600">{formErrors.year}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="institution"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Building className="w-4 h-4 text-slate-500" />
                      Établissement
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      className={`h-11 text-sm border-slate-300 focus:border-blue-500 ${formErrors.institution ? "border-red-500" : ""}`}
                      placeholder="Ex: Université de Paris"
                      required
                    />
                    {formErrors.institution && (
                      <p className="text-xs text-red-600">
                        {formErrors.institution}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  Description
                  <span className="text-slate-500 text-xs">(optionnel)</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className={`min-h-[100px] text-sm border-slate-300 focus:border-blue-500 resize-none ${formErrors.description ? "border-red-500" : ""}`}
                    placeholder="Détails supplémentaires, mentions, spécialisation..."
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white px-2 py-1 rounded">
                    {form.description.length}/500
                  </div>
                </div>
                {formErrors.description && (
                  <p className="text-xs text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Vérification des diplômes
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      Tous les diplômes ajoutés sont soumis à vérification par
                      notre équipe. Vous serez notifié une fois la vérification
                      terminée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(dialogSuccess || dialogError) && (
            <div className="mb-3 w-full">
              <div
                className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                  dialogSuccess
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {dialogSuccess ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5" />
                )}
                <span>{dialogSuccess || dialogError}</span>
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
                  onClick={handleCloseDialog}
                  disabled={submitting}
                  className="h-10 px-4 min-w-[100px]"
                >
                  Annuler
                </Button>
                <Button
                  className={`px-6 h-10 font-medium min-w-[120px] ${
                    dialogSuccess
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                  onClick={() => {
                    if (dialogSuccess) {
                      handleCloseDialog();
                    } else {
                      handleAddDiploma();
                    }
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </div>
                  ) : dialogSuccess ? (
                    "Fermer"
                  ) : selectedDiploma ? (
                    "Enregistrer"
                  ) : (
                    "Ajouter"
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
