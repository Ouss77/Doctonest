"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Briefcase, User, Pencil, Camera, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";

interface ProfileHeaderProps {
  profileData: any;
  setProfileData: (data: any) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
}

async function fetchProfileData() {
  try {
    const res = await fetch("/api/users/profile", { credentials: "include" });
    if (!res.ok) return null;
    const { user, profile } = await res.json();
    return {
      userId: user?.id || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      imageProfile: profile?.photo_url || "",
      specialty: profile?.specialty || "",
      profession: profile?.profession || "",
      location: profile?.location || "",
      experience_years: profile?.experience_years ?? 0,
      languages: profile?.languages || [],
      bio: profile?.bio || "",
      is_available: profile?.is_available ?? false,
      availability_start: profile?.availability_start || "",
      availability_end: profile?.availability_end || "",
      profile_status: profile?.profile_status || undefined,
    };
  } catch {
    return null;
  }
}

export default function ProfileHeader({ profileData, setProfileData, isEditProfileOpen, setIsEditProfileOpen }: ProfileHeaderProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    (async () => {
      const data = await fetchProfileData();
      if (data) {
        setProfileData(data);
        setForm(data);
      }
    })();
  }, [setProfileData]);

  useEffect(() => {
    if (profileData && !form) {
      setForm(profileData);
    }
  }, [profileData, form]);

  async function handleSave() {
    try {
      if (!form) return;
      setIsSaving(true);
      let photo_url = form?.imageProfile || profileData?.imageProfile || "";

      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", profileData.userId);
        fd.append("userType", "doctor");
        const uploadRes = await fetch("/api/profile/upload-photo", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Erreur lors du téléchargement de la photo");
        const uploadJson = await uploadRes.json();
        photo_url = uploadJson.photo_url || photo_url;
      }

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        profession: form.profession,
        location: form.location,
        experience_years: form.experience_years,
        languages: form.languages,
        bio: form.bio,
        is_available: form.is_available,
        availability_start: form.availability_start,
        availability_end: form.availability_end,
        profileData: { photoUrl: photo_url },
      };
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde du profil");

      setProfileData({ ...form, imageProfile: photo_url });
      setIsEditProfileOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
    }
  }

  // Generate a gradient cover photo based on user name or use default
  const getCoverGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #0077b5 0%, #005885 100%)",
      "linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)",
      "linear-gradient(135deg, #005885 0%, #0077b5 100%)",
    ];
    const index = (profileData?.firstName?.length || 0) % gradients.length;
    return gradients[index];
  };

  if (!profileData) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Cover Photo */}
      <div
        className="relative h-20 bg-gradient-to-r from-blue-600 to-blue-800"
        style={{ background: getCoverGradient() }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl font-bold">
            {profileData.firstName?.[0]?.toUpperCase() || "L"}F
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Profile Picture and Name Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 pt-20">
          <div className="flex flex-col md:flex-row md:items-end gap-4 flex-1">
            {/* Profile Picture - Positionné pour chevaucher légèrement la couverture */}
            <div className="relative -mt-32 md:-mt-32 flex-shrink-0">
              <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {profileData.imageProfile ? (
                  <img
                    src={profileData.imageProfile}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                {!profileData.imageProfile && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="text-center">
                      <User className="w-16 h-16 text-white mx-auto mb-2" />
                      <div className="text-white text-xl font-bold">
                        {profileData.firstName?.[0]?.toUpperCase() || '?'}
                        {profileData.lastName?.[0]?.toUpperCase() || '?'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {user && (
                <button
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 border-2 border-gray-200"
                  onClick={() => {/* Handle profile photo upload */}}
                >
                  <Camera className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>

            {/* Name and Info - Toujours visible, pas masqué */}
            <div className="flex-1 pt-4 md:pt-0 pb-2 md:pb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {profileData.profession || "Médecin remplaçant"}
                {profileData.specialty && ` • ${profileData.specialty}`}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {profileData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.experience_years && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{profileData.experience_years} ans d'expérience</span>
                  </div>
                )}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  profileData.is_available
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    profileData.is_available ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
                  <span>{profileData.is_available ? "Disponible" : "Non disponible"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Modifier le profil
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Modifier le profil</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsEditProfileOpen(false)} className="text-slate-500 hover:text-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border border-slate-200 mx-auto md:mx-0">
                {previewUrl || form?.imageProfile ? (
                  <img src={(previewUrl as string) || form?.imageProfile} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" /> Changer la photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setSelectedFile(f);
                    setPreviewUrl(f ? URL.createObjectURL(f) : undefined);
                  }}
                />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input className="mt-1" value={form?.firstName || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, firstName: e.target.value }))} />
              </div>
              <div>
                <Label>Nom</Label>
                <Input className="mt-1" value={form?.lastName || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, lastName: e.target.value }))} />
              </div>
              <div>
                <Label>Profession</Label>
                <Input className="mt-1" value={form?.profession || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, profession: e.target.value }))} />
              </div>
              <div>
                <Label>Spécialité</Label>
                <Input className="mt-1" value={form?.specialty || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, specialty: e.target.value }))} />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" type="email" value={form?.email || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, email: e.target.value }))} />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input className="mt-1" value={form?.phone || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Localisation</Label>
                <Input className="mt-1" value={form?.location || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, location: e.target.value }))} />
              </div>
              <div>
                <Label>Années d'expérience</Label>
                <Input className="mt-1" type="number" value={form?.experience_years || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Biographie</Label>
                <Input className="mt-1" value={form?.bio || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, bio: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setForm(profileData)}>Annuler</Button>
            <Button className="bg-blue-600 text-white" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Sauvegarde..." : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

