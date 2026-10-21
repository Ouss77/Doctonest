"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import SpecialtyCombobox from "./SpecialtyCombobox"
import {
  REPLACEMENT_PROFESSIONS,
  defaultSpecialtyForProfession,
  specialtiesForProfession,
} from "./register-options"

const fieldClass =
  "h-10 rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
const errorClass = "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15"

interface RegisterFormProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  handleInputChange: (field: string, value: string | boolean | File) => void
  handleSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
}

export default function ReplacementRegisterForm({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  handleInputChange,
  handleSubmit,
  isSubmitting = false,
}: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

  const specialtyOptions = specialtiesForProfession(formData.profession)
  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStepOne = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName?.trim()) newErrors.firstName = "Indiquez votre prénom."
    if (!formData.lastName?.trim()) newErrors.lastName = "Indiquez votre nom."
    if (!formData.email?.trim()) {
      newErrors.email = "Indiquez votre adresse e-mail."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Cette adresse e-mail n’est pas valide."
    }
    if (!formData.profession) newErrors.profession = "Choisissez votre profession."
    if (!formData.specialty?.trim()) newErrors.specialty = "Choisissez votre spécialité."
    setErrors((prev) => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName?.trim()) newErrors.firstName = "Indiquez votre prénom."
    if (!formData.lastName?.trim()) newErrors.lastName = "Indiquez votre nom."
    if (!formData.email?.trim()) {
      newErrors.email = "Indiquez votre adresse e-mail."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Cette adresse e-mail n’est pas valide."
    }
    if (!formData.profession) newErrors.profession = "Choisissez votre profession."
    if (!formData.specialty?.trim()) newErrors.specialty = "Choisissez votre spécialité."
    if ((formData.password || "").length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères."
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les deux mots de passe ne correspondent pas."
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = "Veuillez accepter les conditions pour continuer."
    setErrors(newErrors)
    if (Object.keys(newErrors).some((key) => ["firstName", "lastName", "email", "profession", "specialty"].includes(key))) {
      setCurrentStep(1)
    }
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) handleSubmit(e)
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
      <ol className="flex items-center gap-2 text-xs" aria-label="Progression de l’inscription">
        {[
          { step: 1, label: "Profil" },
          { step: 2, label: "Sécurité" },
        ].map((item, index) => (
          <li key={item.step} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                  currentStep === item.step
                    ? "bg-blue-600 text-white"
                    : currentStep > item.step
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                )}
              >
                {item.step}
              </span>
              <span className={cn("font-medium", currentStep === item.step ? "text-slate-900" : "text-slate-500")}>
                {item.label}
              </span>
            </div>
            {index === 0 && <div className="h-px flex-1 bg-slate-200" />}
          </li>
        ))}
      </ol>

      {currentStep === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm text-slate-700">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                disabled={isSubmitting}
                onChange={(e) => {
                  handleInputChange("firstName", e.target.value)
                  clearError("firstName")
                }}
                className={cn(fieldClass, errors.firstName && errorClass)}
                placeholder="Youssef"
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm text-slate-700">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                disabled={isSubmitting}
                onChange={(e) => {
                  handleInputChange("lastName", e.target.value)
                  clearError("lastName")
                }}
                className={cn(fieldClass, errors.lastName && errorClass)}
                placeholder="El Amrani"
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && (
                <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-slate-700">
              Adresse e-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              disabled={isSubmitting}
              onChange={(e) => {
                handleInputChange("email", e.target.value)
                clearError("email")
              }}
              className={cn(fieldClass, errors.email && errorClass)}
              placeholder="youssef.elamrani@exemple.ma"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium text-slate-700">
              Profession <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {REPLACEMENT_PROFESSIONS.map((profession) => {
                const selected = formData.profession === profession
                return (
                  <button
                    key={profession}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setFormData((prev: any) => ({
                        ...prev,
                        profession,
                        specialty: defaultSpecialtyForProfession(profession),
                      }))
                      clearError("profession")
                      clearError("specialty")
                    }}
                    className={cn(
                      "h-10 rounded-lg border text-sm font-medium transition-colors",
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    {profession}
                  </button>
                )
              })}
            </div>
            {errors.profession && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.profession}
              </p>
            )}
          </fieldset>

          <div className="space-y-1">
            <Label htmlFor="specialty" className="text-sm text-slate-700">
              Spécialité <span className="text-red-500">*</span>
            </Label>
            <SpecialtyCombobox
              id="specialty"
              value={formData.specialty}
              options={specialtyOptions}
              disabled={isSubmitting}
              error={Boolean(errors.specialty)}
              placeholder="Choisir votre spécialité"
              onChange={(value) => {
                handleInputChange("specialty", value)
                clearError("specialty")
              }}
            />
            {errors.specialty && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.specialty}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm text-slate-700">
                Téléphone <span className="font-normal text-slate-400">(facultatif)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={fieldClass}
                placeholder="06 12 34 56 78"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location" className="text-sm text-slate-700">
                Ville <span className="font-normal text-slate-400">(facultatif)</span>
              </Label>
              <Input
                id="location"
                autoComplete="address-level2"
                value={formData.location}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={fieldClass}
                placeholder="Casablanca"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={() => {
              if (validateStepOne()) setCurrentStep(2)
            }}
            className="h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continuer
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm text-slate-700">
              Mot de passe <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                disabled={isSubmitting}
                onChange={(e) => {
                  handleInputChange("password", e.target.value)
                  clearError("password")
                }}
                className={cn(fieldClass, "pr-11", errors.password && errorClass)}
                placeholder="Au moins 6 caractères"
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm text-slate-700">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              disabled={isSubmitting}
              onChange={(e) => {
                handleInputChange("confirmPassword", e.target.value)
                clearError("confirmPassword")
              }}
              className={cn(fieldClass, errors.confirmPassword && errorClass)}
              placeholder="Répétez le mot de passe"
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  handleInputChange("acceptTerms", Boolean(checked))
                  clearError("acceptTerms")
                }}
                className="mt-0.5"
              />
              <Label htmlFor="acceptTerms" className="cursor-pointer text-sm font-normal leading-relaxed text-slate-600">
                J’accepte les{" "}
                <Link href="/terms" className="font-medium text-blue-700 hover:underline">
                  conditions d’utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="font-medium text-blue-700 hover:underline">
                  politique de confidentialité
                </Link>
                .
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(1)}
              className="h-10 rounded-lg border-slate-200 text-slate-700"
            >
              Retour
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
