"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MapPin, Briefcase, User, Pencil, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface ProfileHeaderProps {
  profileData: {
    userId: string;
    imageProfile: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialty: string;
    location: string;
    profession?: string;
    experience_years?: number;
    is_available?: boolean;
  };
  onEditClick: () => void;
}

export default function ProfileHeader({ profileData, onEditClick }: ProfileHeaderProps) {
  const { user } = useAuth();

  // Generate a gradient cover photo based on user name or use default
  const getCoverGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #0077b5 0%, #005885 100%)",
      "linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)",
      "linear-gradient(135deg, #005885 0%, #0077b5 100%)",
    ];
    const index = (profileData.firstName?.length || 0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Cover Photo */}
      <div
        className="relative h-52 bg-gradient-to-r from-blue-600 to-blue-800"
        style={{ background: getCoverGradient() }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl font-bold">
            {profileData.firstName?.[0]?.toUpperCase() || "L"}F
          </div>
        </div>
        {user && (
          <button
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-md"
            onClick={() => {/* Handle cover photo upload */}}
          >
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
        )}
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
              onClick={onEditClick}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Modifier le profil
            </Button>
          </div>
        </div>

        {/* Stats Bar (similar to LinkedIn) */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">Expériences</span>
              <span className="text-gray-600">Voir le détail</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">Diplômes</span>
              <span className="text-gray-600">Voir le détail</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">Missions</span>
              <span className="text-gray-600">Voir le détail</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

