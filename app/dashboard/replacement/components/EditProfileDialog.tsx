import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";

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
  open,
  onOpenChange,
  profileData,
  setProfileData,
  fileInputRef,
  previewUrl,
  setPreviewUrl,
  selectedFile,
  setSelectedFile,
  setIsEditProfileOpen,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");

    let photoUrl = profileData.photoUrl;

    try {
      if (selectedFile && profileData.userId) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", profileData.userId);

        const res = await fetch("/api/profile/upload-photo", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Erreur upload photo");
        const data = await res.json();
        photoUrl = data.photo_url;
      }

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          profileData: {
            specialty: profileData.specialty,
            location: profileData.location,
            photoUrl,
            experience_years: profileData.experience_years,
            languages: profileData.languages,
            bio: profileData.bio,
            is_available: profileData.is_available,
          },
        }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");

      setIsEditProfileOpen(false);
      setSelectedFile(null);
      setPreviewUrl(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Modifier le profil
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-full">
          {/* LEFT PANEL */}
          <div className="bg-blue-50 border-r p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border shadow flex items-center justify-center">
              {previewUrl || profileData.photoUrl ? (
                <img
                  src={previewUrl || profileData.photoUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-blue-400" />
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Changer la photo
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Nom</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Téléphone</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>

              {profileData.profession === "Medecin" && (
                <div>
                  <Label>Spécialité</Label>
                  <Input
                    className="mt-1 h-9"
                    value={profileData.specialty || ""}
                    onChange={(e) =>
                      setProfileData((p: any) => ({
                        ...p,
                        specialty: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div>
                <Label>Localisation</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.location || ""}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      location: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Bio</Label>
                <Input
                  className="mt-1 h-9"
                  value={profileData.bio || ""}
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      bio: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Disponibilité</Label>
                <select
                  className="mt-1 w-full h-9 border rounded-md px-2 bg-white"
                  value={
                    profileData.is_available === true
                      ? "true"
                      : profileData.is_available === false
                      ? "false"
                      : ""
                  }
                  onChange={(e) =>
                    setProfileData((p: any) => ({
                      ...p,
                      is_available: e.target.value === "true",
                    }))
                  }
                >
                  <option value="">--</option>
                  <option value="true">Disponible</option>
                  <option value="false">Non disponible</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-slate-50">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            onClick={handleSaveProfile}
            disabled={loading}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
