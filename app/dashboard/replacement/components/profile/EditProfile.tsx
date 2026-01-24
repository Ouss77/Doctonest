import React, { useState } from "react";
import { User, Upload, MapPin, Briefcase, Languages, Calendar, Phone, Mail, Check, Badge, Camera, AlertCircle, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditProfileProps {
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

export default function EditProfile({
  open, onOpenChange,
  profileData, setProfileData,
  fileInputRef, previewUrl,
  setPreviewUrl, selectedFile,
  setSelectedFile, setIsEditProfileOpen,
}: EditProfileProps) {
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
      <DialogContent className="w-[95vw] !max-w-6xl h-[95vh] md:h-[90vh] p-0 rounded-xl bg-white shadow-2xl flex flex-col border-0 overflow-hidden">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Modifier le profil
            </DialogTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange?.(false)}
            className="h-8 w-8 rounded-full hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* CONTENT AREA - Fixed height with scroll */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-full">
            
            {/* LEFT PANEL - Fixed height */}
            <div className="bg-slate-50 border-r p-4 md:p-6 flex flex-col overflow-y-auto">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden bg-white border-2 border-slate-300 shadow-md flex items-center justify-center">
                    {previewUrl || profileData.imageProfile ? (
                      <img
                        src={previewUrl || profileData.imageProfile}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-300 hover:border-slate-400 text-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload className="w-3 h-3 mr-2" />
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
                
                <p className="text-xs text-slate-500 text-center">
                  JPG, PNG, GIF • Max 5MB
                </p>
              </div>
            </div>

            {/* RIGHT FORM - Scrollable content */}
            <div className="overflow-y-auto p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Success/Error Message */}
                {(success || error) && (
                  <div className={`p-4 rounded-lg border ${success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-3">
                      {success ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className={`font-medium ${success ? 'text-green-800' : 'text-red-800'}`}>
                          {success ? 'Succès' : 'Erreur'}
                        </p>
                        <p className={`text-sm mt-1 ${success ? 'text-green-700' : 'text-red-700'}`}>
                          {successMessage || error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1 - Informations personnelles */}
                <section className="space-y-4">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations personnelles
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Prénom", key: "firstName", required: true, icon: User },
                      { label: "Nom", key: "lastName", required: true, icon: Badge },
                      { label: "Email", key: "email", type: "email", required: true, icon: Mail },
                      { label: "Téléphone", key: "phone", type: "tel", icon: Phone }
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
                          {field.icon && <field.icon className="w-3 h-3 text-slate-500" />}
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type || "text"}
                          className="h-10 text-sm"
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
                <section className="space-y-4">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Informations professionnelles
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
                            {field.icon && <field.icon className="w-3 h-3 text-slate-500" />}
                            {field.label}
                          </Label>
                          <Input
                            id={field.key}
                            type={field.type || "text"}
                            className="h-10 text-sm"
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
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        Bio
                        <span className="text-slate-500 text-xs ml-1">(max 500 caractères)</span>
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="bio"
                          className="min-h-[100px] text-sm resize-none"
                          value={profileData.bio || ""}
                          onChange={(e) =>
                            setProfileData((p: any) => ({
                              ...p,
                              bio: e.target.value.slice(0, 500),
                            }))
                          }
                          placeholder="Décrivez votre parcours professionnel, vos compétences, vos domaines d'expertise..."
                          disabled={loading}
                          maxLength={500}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                          {profileData.bio?.length || 0}/500
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 - Disponibilité */}
                <section className="space-y-4">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Disponibilité
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="is_available" className="text-sm font-medium">
                      Statut de disponibilité
                    </Label>
                    <select
                      id="is_available"
                      className="w-full h-10 text-sm border rounded-md px-3 bg-white"
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
                      <option value="true">🟢 Disponible</option>
                      <option value="false">🔴 Non disponible</option>
                    </select>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Fixed at bottom */}
        <DialogFooter className="px-6 py-4 border-t bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="text-sm text-slate-500 order-2 sm:order-1">
              <span className="text-red-500">*</span> Champs obligatoires
            </div>
            <div className="flex items-center gap-3 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditProfileOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(undefined);
                  setError("");
                }}
                disabled={loading}
                className="h-10 px-4 text-sm"
              >
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 text-sm font-medium"
                onClick={handleSaveProfile}
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