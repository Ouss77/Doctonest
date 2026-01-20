import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GraduationCap, Plus, Trash2, Calendar } from "lucide-react";

interface Diploma {
  id: string;
  title: string;
  institution: string;
  year?: string;
  description?: string;
}

export default function DiplomasSection() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    institution: "",
    year: "",
    description: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDiplomas();
  }, []);

  const fetchDiplomas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users/diplomas");
      if (!res.ok) throw new Error("Erreur lors du chargement des diplômes");
      const data = await res.json();
      setDiplomas(data.diplomas || []);
    } catch (err) {
      setError("Erreur lors du chargement des diplômes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDiploma = async () => {
    if (!form.title || !form.institution) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/users/diplomas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du diplôme");
      setForm({ title: "", institution: "", year: "", description: "" });
      setOpenDialog(false);
      setSuccess("Diplôme ajouté avec succès ! Il sera vérifié par l'administration.");
      fetchDiplomas();
    } catch (err) {
      setError("Erreur lors de l'ajout du diplôme");
    }
  };

  const handleDeleteDiploma = async (id: string) => {
    if (!window.confirm("Supprimer ce diplôme ?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/users/diplomas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du diplôme");
      setSuccess("Diplôme supprimé avec succès.");
      fetchDiplomas();
    } catch (err) {
      setError("Erreur lors de la suppression du diplôme");
    }
  };

  return (
    <>
      {/* LinkedIn-style Card: Education/Diplomas Section */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Diplômes & Formations</CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">Vos diplômes, certificats et formations</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenDialog(true)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Ajouter
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
            <div className="text-center text-gray-500 py-8 text-sm">Chargement des diplômes...</div>
          ) : diplomas.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">Aucun diplôme ou formation ajouté.</p>
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
            <div className="space-y-4">
              {diplomas.map((diploma) => (
                <div
                  key={diploma.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 truncate">
                            {diploma.title}
                          </h3>
                          <p className="text-sm text-gray-600">{diploma.institution}</p>
                        </div>
                      </div>

                      <div className="ml-14 space-y-1">
                        {diploma.year && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{diploma.year}</span>
                          </div>
                        )}
                        {diploma.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {diploma.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteDiploma(diploma.id)}
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

      {/* Add Diploma Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Ajouter un diplôme ou une formation
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Ajoutez un diplôme, certificat, université, forum, etc.
            </p>
          </DialogHeader>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Titre du diplôme ou certificat
              </label>
              <Input
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Doctorat en Médecine"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Université, forum, organisme
              </label>
              <Input
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Ex: Université de Paris"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Année d'obtention
              </label>
              <Input
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Ex: 2020"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Description, mentions, détails
              </label>
              <Textarea
                className="min-h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Détails supplémentaires..."
              />
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setForm({ title: "", institution: "", year: "", description: "" });
              }}
            >
              Annuler
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddDiploma}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
