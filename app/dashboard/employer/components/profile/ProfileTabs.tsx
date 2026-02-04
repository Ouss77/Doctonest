import { Building2, Mail, Phone, MapPin, Pencil, User, Info, Hash, Briefcase, FileText, MessageSquare, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditProfile from "./EditProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ProfileTabs({
  onOpenDocuments,
}: {
  onOpenDocuments: () => void;
}) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  async function handleSave() {
    try {
      let photo_url = form?.photo_url || profileData?.photo_url || "";

      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", profileData.userId);
        fd.append("userType", "employer");

        const uploadRes = await fetch("/api/users/profile/upload-photo", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok)
          throw new Error("Erreur lors du téléchargement de la photo");

        const uploadJson = await uploadRes.json();
        photo_url = uploadJson.photo_url || photo_url;
      }

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        establishment_name: form.establishmentName,
        establishment_type: form.establishmentType,
        address: form.address,
        siret: form.siret,
        description: form.description,
        fonction: form.fonction,
        profileData: { photoUrl: photo_url },
      };

      console.log("Sending profile update:", payload);

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde du profil");
      }

      setProfileData({ ...form, photo_url });
      return true,
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
    <div className="max-w-6xl mx-auto font-sans px-4 sm:px-6">
      {/* PROFILE CARD */}
      <Card className="overflow-hidden border-slate-200 shadow-md hover:shadow-lg transition-shadow rounded-2xl pt-0">
        {/* Banner */}
        <div className="h-16 sm:h-20 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 relative" />

        <CardContent className="relative px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Avatar - Responsive positioning */}
            <div className="shrink-0 -mt-12 sm:-mt-16 md:-mt-20 mx-auto md:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-56 rounded-2xl md:rounded-3xl border-4 md:border-[6px] border-white overflow-hidden bg-slate-100 shadow-lg">
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
            <div className="flex-1 pt-4 md:pt-24 space-y-4 md:space-y-6">
              <div className="flex flex-col gap-4">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 flex items-center justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    <Briefcase size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="break-words">{profileData.fonction || "Poste non renseigné"}</span>
                  </p>
                  {profileData.address && (
                    <p className="text-sm sm:text-base text-slate-600 flex items-center justify-center md:justify-start gap-2 mt-2 flex-wrap">
                      <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{profileData.address}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-2 w-full">
                  <Button
                    onClick={() => setContactDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>

                  <Button
                    onClick={() => {
                      setForm({ ...profileData });
                      setEditOpen(true);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-slate-900 rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>

                  <Button
                    variant="outline"
                    onClick={onOpenDocuments}
                    className="border-blue-200 text-blue-700 px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                </div>
              </div>

              {/* Info grid - Améliorée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-100">
                <InfoItem
                  icon={<Building2 size={20} />}
                  label="Nom d'établissement"
                  value={profileData.establishmentName || "Non renseigné"}
                />
                <InfoItem
                  icon={<Hash size={20} />}
                  label="SIRET"
                  value={profileData.siret || "Non renseigné"}
                />
                <InfoItem
                  icon={<Info size={20} />}
                  label="Type"
                  value={profileData.establishmentType || "Non renseigné"}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABOUT */}
      <Card className="mt-4 sm:mt-6 border-slate-200 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Info size={18} className="sm:w-5 sm:h-5 text-blue-600" /> À propos
          </h2>
          <p className="text-slate-600 italic text-sm sm:text-base md:text-lg leading-relaxed break-words">
            {profileData.description || "Aucune description renseignée."}
          </p>
        </CardContent>
      </Card>

      {/* CONTACT DIALOG */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Coordonnées de contact
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Contactez {profileData.firstName} {profileData.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {profileData.email && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <a 
                    href={`mailto:${profileData.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {profileData.email}
                  </a>
                </div>
              </div>
            )}

            {profileData.phone && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Téléphone</p>
                  <a 
                    href={`tel:${profileData.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {profileData.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setContactDialogOpen(false)}
              className="flex-1"
            >
              Fermer
            </Button>
            {profileData.email && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => window.location.href = `mailto:${profileData.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
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
   IMPROVED UI HELPER
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
    <div className="flex items-start gap-2 sm:gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="p-1.5 sm:p-2 bg-white rounded-lg text-blue-600 shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase font-semibold text-slate-500 mb-1 truncate">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-medium text-slate-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}