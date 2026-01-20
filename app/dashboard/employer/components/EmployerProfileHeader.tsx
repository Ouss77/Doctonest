"use client";

import { MapPin, Building2, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface EmployerProfileHeaderProps {
  profileData: any;
}

export default function EmployerProfileHeader({ profileData }: EmployerProfileHeaderProps) {
  const name =
    profileData?.establishmentName ||
    profileData?.organization_name ||
    profileData?.company_name ||
    "Établissement";

  const address =
    profileData?.address ||
    [profileData?.city, profileData?.postal_code].filter(Boolean).join(" ") ||
    "";

  const contactName =
    (profileData?.first_name && profileData?.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : profileData?.contact_person) || "";

  const position = profileData?.position || profileData?.fonction || "Responsable d'établissement";
  const email = profileData?.email;
  const phone = profileData?.phone || profileData?.phone_number;
  const description = profileData?.description;

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <CardContent className="pt-0 pb-4 px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 gap-4">
          {/* Left: Logo & main info */}
          <div className="flex items-end gap-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              {profileData?.photo_url ? (
                <img
                  src={profileData.photo_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-700 text-white text-2xl font-bold">
                  {name?.[0] || "E"}
                </div>
              )}
            </Avatar>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{position}</span>
              </p>
              {address && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right: contact */}
          <div className="flex flex-col items-start md:items-end gap-2">
            {contactName && (
              <p className="text-sm font-medium text-gray-900">{contactName}</p>
            )}
            <div className="flex flex-col md:items-end text-sm text-gray-600 gap-1">
              {email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>{email}</span>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {description && (
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}