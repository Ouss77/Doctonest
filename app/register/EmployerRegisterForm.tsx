"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, AlertCircle, User, Mail, Phone, MapPin, Briefcase, Stethoscope, Lock, FileText, Shield } from "lucide-react";

interface ReplacementRegisterFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleInputChange: (field: string, value: string | boolean | File) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ReplacementRegisterForm({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  handleInputChange,
  handleSubmit,
}: ReplacementRegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const professions = [
    "Médecin généraliste",
    "Médecin spécialiste",
    "Chirurgien",
    "Dentiste",
    "Infirmier(ère)",
    "Kinésithérapeute",
    "Sage-femme",
    "Pharmacien(ne)",
  ];

  const specialties = [
    "Cardiologie",
    "Dermatologie",
    "Gastro-entérologie",
    "Gynécologie",
    "Neurologie",
    "Ophtalmologie",
    "ORL",
    "Pédiatrie",
    "Psychiatrie",
    "Radiologie",
    "Rhumatologie",
    "Urologie",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.profession) newErrors.profession = "La profession est requise";
    if (formData.profession === "Médecin spécialiste" && !formData.specialty) {
      newErrors.specialty = "La spécialité est requise";
    }
    if (!formData.location.trim()) newErrors.location = "La localisation est requise";
    if (formData.password.length < 6) newErrors.password = "Minimum 6 caractères";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {/* Informations personnelles */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          Informations personnelles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-300">
              Prénom <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  handleInputChange("firstName", e.target.value);
                  if (errors.firstName) setErrors(prev => ({...prev, firstName: ""}));
                }}
                className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
                placeholder="Jean"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-300">
              Nom <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  handleInputChange("lastName", e.target.value);
                  if (errors.lastName) setErrors(prev => ({...prev, lastName: ""}));
                }}
                className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
                placeholder="Dupont"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange("email", e.target.value);
                if (errors.email) setErrors(prev => ({...prev, email: ""}));
              }}
              className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
              placeholder="jean.dupont@email.fr"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300">
            Téléphone <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                handleInputChange("phone", e.target.value);
                if (errors.phone) setErrors(prev => ({...prev, phone: ""}));
              }}
              className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
              placeholder="06 12 34 56 78"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Profession et spécialité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profession" className="text-gray-300">
            Profession <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Select
              value={formData.profession}
              onValueChange={(value) => {
                handleInputChange("profession", value);
                if (errors.profession) setErrors(prev => ({...prev, profession: ""}));
              }}
            >
              <SelectTrigger className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11">
                <SelectValue placeholder="Sélectionner votre profession" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                {professions.map((profession) => (
                  <SelectItem key={profession} value={profession} className="hover:bg-gray-800">
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.profession && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.profession}
            </p>
          )}
        </div>

        {formData.profession === "Médecin spécialiste" && (
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-gray-300">
              Spécialité <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Select
                value={formData.specialty}
                onValueChange={(value) => {
                  handleInputChange("specialty", value);
                  if (errors.specialty) setErrors(prev => ({...prev, specialty: ""}));
                }}
              >
                <SelectTrigger className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11">
                  <SelectValue placeholder="Sélectionner votre spécialité" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty} className="hover:bg-gray-800">
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.specialty && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.specialty}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Localisation */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-gray-300">
          Localisation (Ville/Département) <span className="text-red-400">*</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => {
              handleInputChange("location", e.target.value);
              if (errors.location) setErrors(prev => ({...prev, location: ""}));
            }}
            className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
            placeholder="Paris, Île-de-France"
          />
        </div>
        {errors.location && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300 flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-400" />
          Présentation / Expérience
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="min-h-[100px] rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Parlez-nous de votre expérience, vos disponibilités..."
        />
      </div>

      {/* Sécurité */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          Sécurité du compte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Mot de passe <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  handleInputChange("password", e.target.value);
                  if (errors.password) setErrors(prev => ({...prev, password: ""}));
                }}
                className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11 pr-12"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-9 w-9 hover:bg-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirmer le mot de passe <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleInputChange("confirmPassword", e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({...prev, confirmPassword: ""}));
                }}
                className="h-11 rounded-lg border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-11"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Minimum 6 caractères - Majuscules, minuscules et chiffres recommandés
        </p>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => {
              handleInputChange("acceptTerms", e.target.checked);
              if (errors.acceptTerms) setErrors(prev => ({...prev, acceptTerms: ""}));
            }}
            className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
          />
          <div className="flex-1">
            <Label htmlFor="acceptTerms" className="text-gray-300 cursor-pointer">
              J'accepte les{" "}
              <a href="/terms" className="text-blue-400 hover:underline">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="/privacy" className="text-blue-400 hover:underline">
                politique de confidentialité
              </a>{" "}
              <span className="text-red-400">*</span>
            </Label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.acceptTerms}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bouton d'inscription */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Créer mon compte médecin
      </Button>
    </form>
  );
}