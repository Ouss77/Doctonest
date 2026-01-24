"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  User,
  Pencil,
  FileText,
  Briefcase,
  Languages,
  BookOpen,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProfileProps {
  profileData: any;
  setProfileData: (data: any) => void;
  setIsEditProfileOpen: (open: boolean) => void;
}

async function fetchProfileData() {
  try {
    const res = await fetch("/api/users/profile", {
      credentials: "include",
    });
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
      is_available: profile?.is_available ?? false,
      languages: profile?.languages || [],
      bio: profile?.bio || "",
      profile_status: profile?.profile_status || "",
    };
  } catch {
    return null;
  }
}

export default function Profile({
  profileData,
  setProfileData,
  setIsEditProfileOpen,
}: ProfileProps) {
  const { user } = useAuth();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchProfileData();
      if (data) setProfileData(data);
    })();
  }, [setProfileData]);

  if (!profileData) return null;

  const ContactDialog = () => (
    <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contacter {profileData.firstName} {profileData.lastName}
          </DialogTitle>
          <DialogDescription>
            Coordonnées de contact
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(profileData.email);
                  alert("Email copié !");
                }}
                className="h-8 w-8"
              >
                <FileText className="w-4 h-4" />
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(profileData.phone);
                  alert("Numéro copié !");
                }}
                className="h-8 w-8"
              >
                <FileText className="w-4 h-4" />
              </Button>
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
  );

  return (
    <>
      <ContactDialog />
      
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
        {/* Bandeau bleu */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-700" />

        {/* Contenu avec layout responsive */}
        <div className="px-4 md:px-8 py-6 md:py-8">
          {/* Section photo + infos en flex-col sur mobile */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Photo */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white bg-slate-100 flex-shrink-0 shadow-lg mx-auto md:mx-0 -mt-20 md:-mt-6">
              {profileData.imageProfile ? (
                <img
                  src={profileData.imageProfile}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
                </div>
              )}
            </div>

            {/* Infos principales - pleine largeur sur mobile */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                {/* Informations gauche */}
                <div className="flex-1">
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center md:text-left">
                      {profileData.firstName} {profileData.lastName}
                    </h1>

                    {/* Profession et spécialité */}
                    <div className="flex text-center md:text-left">
                      {profileData.profession && (
                        <span className="text-lg md:text-xl text-blue-700 font-semibold flex items-center justify-center md:justify-start gap-2">
                          <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                          {profileData.profession} 
                        </span>
                      )}
                      {profileData.specialty && profileData.specialty !== profileData.profession && (
                        <span className="text-base md:text-lg text-slate-600">
                           ({profileData.specialty})
                        </span>
                      )}
                    </div>

                    {/* Localisation et expérience - responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-4">
                      {profileData.location && (
                        <div className="flex items-center gap-2 text-slate-600 justify-center sm:justify-start">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{profileData.location}</span>
                        </div>
                      )}
                      {profileData.experience_years && profileData.experience_years > 0 && (
                        <div className="flex items-center gap-2 text-slate-600 justify-center sm:justify-start">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {profileData.experience_years} an{profileData.experience_years > 1 ? 's' : ''} d'expérience
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Disponibilité */}
                    <div className="mt-4 flex justify-center sm:justify-start">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${profileData.is_available ? "bg-green-100" : "bg-red-100"}`}>
                        {profileData.is_available ? (
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-700" />
                        ) : (
                          <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-700" />
                        )}
                        <span className={`font-semibold text-xs sm:text-sm ${profileData.is_available ? "text-green-800" : "text-red-800"}`}>
                          {profileData.is_available ? "🟢 Disponible" : "🔴 Non disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons - responsive */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  {user ? (
                    <>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                        <Button
                          variant="outline"
                          className="font-semibold border-slate-300 hover:bg-slate-50"
                          onClick={() => setIsEditProfileOpen(true)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>

                        <Button
                          variant="outline"
                          className="font-semibold text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                      </div>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        onClick={() => setContactDialogOpen(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacter
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      onClick={() => setContactDialogOpen(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio - pleine largeur sans espacement gauche */}
              {profileData.bio && (
                <div className="ml-[-200px] mt-6 md:mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <p className="text-sm uppercase text-slate-600 font-semibold">
                      À propos
                    </p>
                  </div>
                  <div className="p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                      {profileData.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}