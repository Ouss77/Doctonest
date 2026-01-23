import React, { useState } from "react";
import { User, Upload, MapPin, Briefcase, Languages, Calendar, Phone, Mail, Check, Badge, Camera, AlertCircle, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  previewUrl?: string;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setIsEditProfileOpen: (open: boolean) => void;
}

export default function EditProfileDialog({
  open, onOpenChange,
  profileData,  setProfileData,
  fileInputRef,  previewUrl,
  setPreviewUrl,  selectedFile,
  setSelectedFile,  setIsEditProfileOpen,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setSuccessMessage("");

    let photoUrl = profileData.imageProfile;

    try {
      // Upload photo first if selected
      if (selectedFile && profileData.userId) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", profileData.userId);
        fd.append("userType", "replacement");

        console.log("[CLIENT] Uploading photo...");
        console.log("[CLIENT] userId:", profileData.userId);
        console.log("[CLIENT] userType: replacement");
        
        const uploadRes = await fetch("/api/profile/upload-photo", {
          method: "POST",
          body: fd,
        });
        
        console.log("[CLIENT] Upload response status:", uploadRes.status);
        
        if (!uploadRes.ok) {
          let errorMessage = "Erreur upload photo";
          try {
            const errorData = await uploadRes.json();
            console.error("[CLIENT] Upload error details:", errorData);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("[CLIENT] Could not parse error response");
          }
          throw new Error(errorMessage);
        }
        
        const uploadData = await uploadRes.json();
        console.log("[CLIENT] Upload success, photo_url:", uploadData.photo_url);
        photoUrl = uploadData.photo_url;
      }

      // Save profile data
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        profileData: {
          specialty: profileData.specialty,
          profession: profileData.profession,
          location: profileData.location,
          experience_years: profileData.experience_years,
          languages: profileData.languages,
          bio: profileData.bio,
          is_available: profileData.is_available,
          photo_url: photoUrl,
        },
      };

      console.log("[CLIENT] Saving payload:", payload);

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("[CLIENT] Save error:", errorData);
        throw new Error(errorData.error || "Erreur sauvegarde");
      }

      const result = await res.json();
      console.log("[CLIENT] Save successful:", result);

      // Update parent state with all new data
      setProfileData({ ...profileData, imageProfile: photoUrl });
      
      // Show success message
      setSuccess(true);
      setSuccessMessage("Profil mis à jour avec succès ✓");
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setSelectedFile(null);
        setPreviewUrl(undefined);
        setSuccess(false);
      }, 2000);
      
    } catch (e) {
      console.error("[CLIENT] Error saving profile:", e);
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className=" !w-[98vw]    !max-w-5xl     h-[650px]  p-0 rounded-xl bg-white    shadow-2xl     flex  flex-col">
        {/* HEADER avec bouton fermer */}
        <DialogHeader className="px-10 py-2 border-b bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Modifier le profil
            </DialogTitle>
          </div>
          <Button  variant="ghost"  size="icon"
            onClick={() => onOpenChange?.(false)}
            className="h-10 w-10 rounded-full hover:bg-slate-200">
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] flex-1 min-h-0 overflow-hidden">
          {/* LEFT PANEL - Navigation agrandie */}
          <div className="bg-slate-50 border-r p-8 flex flex-col">
            <div className="flex flex-col items-center gap-6 mb-10">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-40 h-48 rounded-2xl overflow-hidden bg-white border-3 border-slate-300 shadow-lg flex items-center justify-center">
                  {previewUrl || profileData.imageProfile ? (
                    <img
                      src={previewUrl || profileData.imageProfile}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <User className="w-16 h-16 text-slate-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full justify-center border-2 border-slate-300 hover:border-slate-400 text-base h-12"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Upload className="w-5 h-5 mr-3" />
                {previewUrl || profileData.imageProfile ? "Changer la photo" : "Ajouter une photo"}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
              
              <p className="text-sm text-slate-500 text-center px-4">
                Formats acceptés : JPG, PNG, GIF • Taille max : 5MB
              </p>
            </div>
          </div>

          {/* RIGHT FORM avec plus d'espace */}
          <div className="p-10 overflow-y-auto mt-0 pt-0">
            <div className="max-w-5xl mx-auto space-y-12">
              
              {/* Section 1 - Informations personnelles */}
              <section id="personal-info" className="space-y-2">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <User className="w-6 h-6" />
                    Informations personnelles
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[
                    { label: "Prénom", key: "firstName", required: true, icon: User },
                    { label: "Nom", key: "lastName", required: true, icon: Badge },
                    { label: "Email", key: "email", type: "email", required: true, icon: Mail },
                    { label: "Téléphone", key: "phone", type: "tel", icon: Phone }
                  ].map((field) => (
                    <div key={field.key} className="space-y-3">
                      <Label htmlFor={field.key} className="flex items-center gap-2 text-base font-medium">
                        {field.icon && <field.icon className="w-4 h-4 text-slate-500" />}
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id={field.key}
                        type={field.type || "text"}
                        className="h-14 text-base px-4 border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all"
                        value={profileData[field.key] || ""}
                        onChange={(e) =>
                          setProfileData((p: any) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
                        }
                        disabled={loading}
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2 - Informations professionnelles */}
              <section id="professional-info" className="space-y-8">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <Briefcase className="w-6 h-6" />
                    Informations professionnelles
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[
                    { label: "Profession", key: "profession", icon: Briefcase },
                    { label: "Spécialité", key: "specialty", icon: Badge },
                    { label: "Localisation", key: "location", icon: MapPin },
                    { 
                      label: "Années d'expérience", 
                      key: "experience_years", 
                      type: "number",
                      min: 0,
                      max: 50,
                      icon: Calendar
                    }
                  ].map((field) => (
                    <div key={field.key} className="space-y-3">
                      <Label htmlFor={field.key} className="flex items-center gap-2 text-base font-medium">
                        {field.icon && <field.icon className="w-4 h-4 text-slate-500" />}
                        {field.label}
                      </Label>
                      <Input
                        id={field.key}
                        type={field.type || "text"}
                        className="h-14 text-base px-4 border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                        value={profileData[field.key] ?? ""}
                        onChange={(e) => {
                          const value = field.type === "number" 
                            ? parseInt(e.target.value) || 0
                            : e.target.value;
                          
                          setProfileData((p: any) => ({
                            ...p,
                            [field.key]: value,
                          }));
                        }}
                        disabled={loading}
                        min={field.min}
                        max={field.max}
                      />
                    </div>
                  ))}
                  
                  {/* Langues */}
                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="languages" className="flex items-center gap-2 text-base font-medium">
                      <Languages className="w-4 h-4 text-slate-500" />
                      Langues parlées
                      <span className="text-slate-500 text-sm font-normal ml-2">
                        (séparées par une virgule)
                      </span>
                    </Label>
                    <textarea
                      id="languages"
                      className="w-full h-24 text-base px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                      value={(profileData.languages || []).join(", ")}
                      onChange={(e) => {
                        const languages = e.target.value
                          .split(",")
                          .map((lang) => lang.trim())
                          .filter(Boolean);
                        setProfileData((p: any) => ({ ...p, languages }));
                      }}
                      placeholder="Ex: Français, Anglais, Espagnol, Arabe"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>
                  
                  {/* Bio */}
                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="bio" className="flex items-center gap-2 text-base font-medium">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      Bio
                      <span className="text-slate-500 text-sm font-normal ml-2">
                        (max 500 caractères)
                      </span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="bio"
                        className="min-h-[180px] text-base p-4 border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none"
                        value={profileData.bio || ""}
                        onChange={(e) =>
                          setProfileData((p: any) => ({
                            ...p,
                            bio: e.target.value.slice(0, 500),
                          }))
                        }
                        placeholder="Décrivez votre parcours professionnel, vos compétences, vos domaines d'expertise et votre approche..."
                        disabled={loading}
                        maxLength={500}
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-slate-500 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200">
                        {profileData.bio?.length || 0}/500 caractères
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 - Disponibilité */}
              <section id="availability" className="space-y-8">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    Disponibilité
                  </h3>
                  <p className="text-slate-600 text-base mt-3">
                    Définissez vos périodes de disponibilité pour les consultations
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="is_available" className="text-base font-medium">
                      Statut de disponibilité
                    </Label>
                    <select
                      id="is_available"
                      className="w-full h-14 text-base border-2 border-slate-300 rounded-lg px-4 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                      value={profileData.is_available?.toString() || ""}
                      onChange={(e) =>
                        setProfileData((p: any) => ({
                          ...p,
                          is_available: e.target.value === "true",
                        }))
                      }
                      disabled={loading}
                    >
                      <option value="">Sélectionnez votre statut</option>
                      <option value="true" className="text-green-600">🟢 Disponible pour consultations</option>
                      <option value="false" className="text-red-600">🔴 Non disponible</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        {/* MESSAGE GLOBAL (succès / erreur) */}
{(success || error) && (
  <div className="sticky bottom-[96px] z-50 px-10">
    <div
      className={`p-5 rounded-xl border-2 shadow-lg flex items-start gap-4 ${
        success
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      {success ? (
        <Check className="w-6 h-6 text-green-600 mt-0.5" />
      ) : (
        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
      )}
      <div>
        <p
          className={`text-base font-bold ${
            success ? "text-green-800" : "text-red-800"
          }`}
        >
          {success ? "Succès" : "Erreur"}
        </p>
        <p
          className={`text-base mt-2 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {successMessage || error}
        </p>
      </div>
    </div>
  </div>
)}

        {/* FOOTER amélioré */}
        <DialogFooter className="px-10 py-6 border-t bg-white flex flex-col sm:flex-row items-center justify-between gap-6 sticky bottom-0 shadow-lg">
          <div className="text-base text-slate-600">
            <span className="font-medium">Champs obligatoires :</span> 
            <span className="text-red-500 mx-2">*</span>
            <span className="text-slate-500">Doivent être remplis</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditProfileOpen(false);
                setSelectedFile(null);
                setPreviewUrl(undefined);
                setError("");
              }}
              disabled={loading}
              className="min-w-[140px] h-12 text-base border-2 rounded-lg"
            >
              Annuler
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 min-w-[180px] h-12 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enregistrement en cours...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}