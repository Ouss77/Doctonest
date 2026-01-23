import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  User,
  Info,
  Hash,
  Briefcase,
  FileText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditProfile from "./EditProfile";

export default function ProfileTabs({
  onOpenDocuments,
}: {
  onOpenDocuments: () => void;
}) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "include",
        });
        const data = await res.json();

        setProfileData({
          userId: data.user?.id || "",
          photo_url: data.profile?.photo_url || "",
          establishmentName: data.profile?.organization_name || "",
          establishmentType: data.profile?.organization_type || "hospital",
          address: data.profile?.address || "",
          siret: data.profile?.siret_number || "",
          description: data.profile?.description || "",
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          fonction: data.profile?.fonction || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  /* =========================
     SAVE PROFILE
  ========================= */
  async function handleSave() {
    try {
      let photo_url = form?.photo_url || profileData?.photo_url || "";

      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", profileData.userId);
        fd.append("userType", "employer");

        const uploadRes = await fetch("/api/profile/upload-photo", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok)
          throw new Error("Erreur lors du téléchargement de la photo");

        const uploadJson = await uploadRes.json();
        photo_url = uploadJson.photo_url || photo_url;
      }

      const payload = {
        establishment_name: form.establishmentName,
        establishment_type: form.establishmentType,
        address: form.address,
        siret: form.siret,
        description: form.description,
        firstName: form.firstName,
        lastName: form.lastName,
        fonction: form.fonction,
        email: form.email,
        phone: form.phone,
        profileData: { photoUrl: photo_url },
      };

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error("Erreur lors de la sauvegarde du profil");

      setProfileData({ ...form, photo_url });
      setEditOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }

  if (loading)
    return (
      <div className="py-12 text-center text-slate-500 font-medium">
        Chargement du profil...
      </div>
    );

  if (!profileData) return null;

  return (
    <div className="max-w-6xl mx-auto font-sans">
      {/* PROFILE CARD */}
      <Card className="overflow-hidden border-slate-200 shadow-xl rounded-2xl pt-0">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 relative" />

        <CardContent className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 -mt-20">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-48 h-56 mt-16 rounded-3xl border-[6px] border-white overflow-hidden bg-slate-100 shadow-lg">
                {profileData.photo_url ? (
                  <img
                    src={profileData.photo_url}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={80} />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-24 space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-xl font-semibold text-blue-600 flex items-center gap-2 mt-1">
                    <Briefcase size={18} />
                    {profileData.fonction || "Poste non renseigné"}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    onClick={() => {
                      setForm({ ...profileData });
                      setEditOpen(true);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-slate-900 rounded-lg px-6"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onOpenDocuments}
                    className="border-blue-200 text-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Voir les documents
                  </Button>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 pt-6 border-t border-slate-100">
                <InfoItem
                  icon={<Building2 size={18} />}
                  label="Établissement"
                  value={profileData.establishmentName}
                />
                <InfoItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value={profileData.email}
                />
                <InfoItem
                  icon={<Phone size={18} />}
                  label="Téléphone"
                  value={profileData.phone}
                />
                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Localisation"
                  value={profileData.address}
                />
                <InfoItem
                  icon={<Hash size={18} />}
                  label="SIRET"
                  value={profileData.siret}
                />
                <InfoItem
                  icon={<Info size={18} />}
                  label="Type de structure"
                  value={profileData.establishmentType}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABOUT */}
      <Card className="mt-6 border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-600" /> À propos
          </h2>
          <p className="text-slate-600 italic text-lg">
            {profileData.description || "Aucune description renseignée."}
          </p>
        </CardContent>
      </Card>

      {/* EDIT DIALOG (NEW COMPONENT) */}
      <EditProfile
        open={editOpen}
        onOpenChange={setEditOpen}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
    </div>
  );
}

/* =========================
   SMALL UI HELPER
========================= */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
