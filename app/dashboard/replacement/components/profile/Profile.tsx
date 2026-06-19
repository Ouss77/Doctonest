"use client";

import { useEffect, useState } from "react";
import {
  MapPin, User, Pencil, FileText, Briefcase, BookOpen,
  CheckCircle, XCircle, Calendar, Mail, Phone,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface ProfileProps {
  profileData: any;
  setProfileData: (data: any) => void;
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
      is_available: profile?.is_available ?? false,
      languages: profile?.languages || [],
      bio: profile?.bio || "",
      profile_status: profile?.profile_status || "",
    };
  } catch {
    return null;
  }
}

export default function Profile({ profileData, setProfileData, setIsEditProfileOpen }: ProfileProps) {
  const { user, refreshUser } = useAuth();
  const [imgError, setImgError] = useState(false);

  // Reset error flag when the image URL changes (e.g. after auto-heal provides a new URL)
  useEffect(() => {
    setImgError(false);
  }, [profileData.imageProfile]);

  useEffect(() => {
    (async () => {
      const data = await fetchProfileData();
      if (data) {
        setProfileData(data);
        // Re-sync useAuth so the header avatar also gets the healed photo_url
        refreshUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProfileData]);

  if (!profileData) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-100 mb-6">

        {/* Gradient hero banner */}
        <div className="relative h-36 sm:h-44 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-t-2xl overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-1/3 right-1/3  w-28 h-28 rounded-full bg-blue-500/15" />
            <div className="absolute -bottom-10 -left-8  w-44 h-44 rounded-full bg-indigo-700/50" />
          </div>

          {/* Banner action buttons */}
          {user && (
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex gap-2">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 hover:bg-white/30 active:scale-95 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modifier le profil</span>
              </button>
              <button className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 hover:bg-white/30 active:scale-95 transition-all">
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Documents</span>
              </button>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="px-5 sm:px-8 pb-7 sm:pb-8">

          {/* Avatar + contact info row — overlaps hero banner */}
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-white bg-blue-50 shadow-xl flex-shrink-0">
              {profileData.imageProfile && !imgError ? (
                <img
                  src={profileData.imageProfile}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <User className="w-16 h-16 text-blue-400" />
                </div>
              )}
            </div>

            {/* Contact info — beside the avatar to fill the empty space */}
            {(profileData.email || profileData.phone) && (
              <div className="flex flex-wrap gap-2 justify-end pb-1">
                {profileData.email && (
                  <a
                    href={`mailto:${profileData.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[180px]">{profileData.email}</span>
                  </a>
                )}
                {profileData.phone && (
                  <a
                    href={`tel:${profileData.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {profileData.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Name & profession */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {profileData.firstName} {profileData.lastName}
            </h1>
            {profileData.profession && (
              <p className="flex items-center gap-2 text-blue-600 font-semibold text-base mt-1.5">
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                {profileData.profession}
                {profileData.specialty && profileData.specialty !== profileData.profession && (
                  <span className="text-gray-500 font-normal text-sm">({profileData.specialty})</span>
                )}
              </p>
            )}
          </div>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-2">
            {profileData.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                {profileData.location}
              </span>
            )}
            {profileData.experience_years > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                {profileData.experience_years} an{profileData.experience_years > 1 ? "s" : ""} d'expérience
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl border ${
              profileData.is_available
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {profileData.is_available ? (
                <><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> Disponible</>
              ) : (
                <><XCircle className="w-3.5 h-3.5 flex-shrink-0" /> Non disponible</>
              )}
            </span>
          </div>

          {/* Bio */}
          {profileData.bio && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">À propos</p>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {profileData.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
