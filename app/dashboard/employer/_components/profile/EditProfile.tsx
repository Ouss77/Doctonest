import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, User, X, Camera, Mail, Phone, MapPin, Building, Briefcase, Loader2, Hash, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import React, { useRef, useState } from "react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export default function EditProfile({
  open, onOpenChange, form, setForm, onSave, selectedFile, setSelectedFile, previewUrl, setPreviewUrl,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form?.firstName?.trim()) {
      errors.firstName = "Le prénom est requis";
    }
    
    if (!form?.lastName?.trim()) {
      errors.lastName = "Le nom est requis";
    }
    
    if (!form?.email?.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format d'email invalide";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await onSave();
      setSuccessMessage("Profil mis à jour avec succès ✅");
      
      setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la sauvegarde"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setFormErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((f: any) => ({ ...f, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] !max-w-6xl h-[85vh] p-0 rounded-lg bg-white shadow-xl flex flex-col border-0">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Modifier le profil
            </DialogTitle>
            <p className="text-slate-500 text-xs mt-1">
              Mettez à jour vos informations personnelles et professionnelles
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="flex flex-col lg:flex-row h-full gap-6">
            
            {/* LEFT SIDE - Photo & Basic Info */}
            <div className="lg:w-1/3 flex flex-col">
              {/* Photo Section */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex flex-col items-center">
                  <div 
                    className="relative group cursor-pointer mb-4"
                    onClick={() => !loading && fileInputRef.current?.click()}
                  >
                    <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border-2 border-slate-300 shadow-md flex items-center justify-center">
                      {previewUrl || form?.photo_url ? (
                        <img
                          src={previewUrl || form.photo_url}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300 hover:border-slate-400 mb-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    {previewUrl || form?.photo_url ? "Changer la photo" : "Ajouter une photo"}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                      setPreviewUrl(file ? URL.createObjectURL(file) : null);
                    }}
                    disabled={loading}
                  />

                  <p className="text-xs text-slate-500 text-center">
                    JPG, PNG, GIF • Max 5MB
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE - Form Fields */}
            <div className="lg:w-2/3 overflow-y-auto p-1 mt-0 pt-0">
              <div className="space-y-4">
                {/* SUCCESS / ERROR MESSAGE - Retour à la position originale */}
                {(successMessage || errorMessage) && (
                  <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                    successMessage
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                    {successMessage ? (
                      <span className="font-medium">{successMessage}</span>
                    ) : (
                      <span className="font-medium">{errorMessage}</span>
                    )}
                  </div>
                )}

                {/* Section 1: Personal Information */}
                <section className="space-y-2">
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations personnelles
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-3 h-3 text-slate-500" />
                        Prénom
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        className={`h-10 text-sm ${formErrors.firstName ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"}`}
                        value={form?.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={loading}
                        required
                      />
                      {formErrors.firstName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-3 h-3 text-slate-500" />
                        Nom
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        className={`h-10 text-sm ${formErrors.lastName ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"}`}
                        value={form?.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={loading}
                        required
                      />
                      {formErrors.lastName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 2: Professional Information */}
                <section className="space-y-4">
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Informations professionnelles
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Détails sur votre activité professionnelle
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fonction" className="flex items-center gap-2 text-sm font-medium">
                          <Briefcase className="w-3 h-3 text-slate-500" />
                          Fonction / Poste
                        </Label>
                        <Input
                          id="fonction"
                          className="h-10 text-sm border-slate-300 focus:border-blue-500"
                          value={form?.fonction || ""}
                          onChange={(e) => handleInputChange("fonction", e.target.value)}
                          disabled={loading}
                          placeholder="Ex: Médecin généraliste"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="establishmentName" className="flex items-center gap-2 text-sm font-medium">
                          <Building className="w-3 h-3 text-slate-500" />
                          Nom de l'établissement
                        </Label>
                        <Input
                          id="establishmentName"
                          className="h-10 text-sm border-slate-300 focus:border-blue-500"
                          value={form?.establishmentName || ""}
                          onChange={(e) => handleInputChange("establishmentName", e.target.value)}
                          disabled={loading}
                          placeholder="Ex: Hôpital Saint-Louis"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="establishmentType" className="flex items-center gap-2 text-sm font-medium">
                          <Building className="w-3 h-3 text-slate-500" />
                          Type de structure
                        </Label>
                        <Select
                          value={form?.establishmentType || ""}
                          onValueChange={(value) => handleInputChange("establishmentType", value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="h-10 text-sm border-slate-300 focus:border-blue-500">
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hospital">Hôpital</SelectItem>
                            <SelectItem value="clinic">Clinique</SelectItem>
                            <SelectItem value="private_practice">Cabinet privé</SelectItem>
                            <SelectItem value="medical_center">Centre médical</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="siret" className="flex items-center gap-2 text-sm font-medium">
                          <Hash className="w-3 h-3 text-slate-500" />
                          Numéro SIRET
                        </Label>
                        <Input
                          id="siret"
                          className="h-10 text-sm border-slate-300 focus:border-blue-500"
                          placeholder="123 456 789 00012"
                          value={form?.siret || ""}
                          onChange={(e) => handleInputChange("siret", e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        Adresse complète
                      </Label>
                      <Input
                        id="address"
                        className="h-10 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={loading}
                        placeholder="Ex: 123 Rue de la Santé, 75000 Paris"
                      />
                    </div>
                  </div>
                </section>

                {/* Section 3: Contact Information */}
                <section className="space-y-4">
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Informations de contact
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Comment vous contacter
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-3 h-3 text-slate-500" />
                        Email professionnel
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className={`h-10 text-sm ${formErrors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"}`}
                        value={form?.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={loading}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                        <Phone className="w-3 h-3 text-slate-500" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        className="h-10 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={loading}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                  </div>
                </section>

                {/* Section 4: Description */}
                <section className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="w-3 h-3 text-slate-500" />
                      Description de l'établissement
                      <span className="text-slate-500 text-xs ml-1">(optionnel)</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        className="min-h-[120px] text-sm border-slate-300 focus:border-blue-500 resize-none p-3"
                        placeholder="Décrivez votre établissement, votre équipe, vos spécialités, vos besoins en personnel..."
                        value={form?.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        disabled={loading}
                        maxLength={1000}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                        {form?.description?.length || 0}/1000
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-slate-500">
              <span className="text-red-500">*</span> Champs obligatoires
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="h-10 px-4 text-sm"
              >
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 font-medium text-sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}