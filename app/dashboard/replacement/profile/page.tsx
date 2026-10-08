"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/lib/auth"
import Profile from "../_components/profile/Profile"
import MyExperiences from "../_components/profile/MyExperiences"
import MyEducations from "../_components/profile/MyEducations"
import EditProfile from "../_components/profile/EditProfile"

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <MyExperiences />
        <MyEducations />
      </div>

      <EditProfile
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profileData={profileData}
        setProfileData={setProfileData}
        fileInputRef={fileInputRef}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
    </>
  )
}