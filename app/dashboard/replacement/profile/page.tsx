"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/lib/auth"
import Profile from "@/app/dashboard/replacement/components/profile/Profile"
import MyExperiences from "@/app/dashboard/replacement/components/profile/MyExperiences"
import MyEducations from "@/app/dashboard/replacement/components/profile/MyEducations"
import EditProfile from "@/app/dashboard/replacement/components/profile/EditProfile"

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [profileData, setProfileData] = useState({
    userId: "",
    imageProfile: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    availability: "",
    profession: "",
    experience_years: 0,
    is_available: false,
  })

  useEffect(() => {
    if (user && profile) {
      setProfileData({
        userId: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        imageProfile: profile.photo_url || "",
        specialty: profile.specialty || "",
        location: profile.location || "",
        availability: profile.availability || "",
        profession: profile.profession || "",
        experience_years: profile.experience_years || 0,
        is_available: profile.is_available ?? false,
      })
    }
  }, [user, profile])

  return (
    <>
      <Profile
        profileData={profileData}
        setProfileData={setProfileData}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />

      <div className="space-y-4">
        <MyExperiences />
        <MyEducations />
      </div>

      <EditProfile
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profileData={profileData}
        setProfileData={setProfileData}
        fileInputRef={fileInputRef}
        previewUrl={previewUrl || profileData.imageProfile}
        setPreviewUrl={(url) => {
          setPreviewUrl(url)
          if (typeof url === "string") {
            setProfileData((prev) => ({ ...prev, imageProfile: url }))
          }
        }}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
    </>
  )
}