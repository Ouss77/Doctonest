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
  companyTypes?: string[]
  isSubmitting?: boolean
}

export default function EmployerRegisterForm({
  formData,
  showPassword,
  setShowPassword,
  handleInputChange,
  handleSubmit,
  isSubmitting = false,
}: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

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
    if ((formData.password || "").length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères."
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les deux mots de passe ne correspondent pas."
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = "Veuillez accepter les conditions pour continuer."
    setErrors(newErrors)
    if (Object.keys(newErrors).some((key) => ["firstName", "lastName", "email"].includes(key))) {
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
          { step: 1, label: "Établissement" },
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
              <Label htmlFor="employerFirstName" className="text-sm text-slate-700">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employerFirstName"
                autoComplete="given-name"
                value={formData.firstName}
                disabled={isSubmitting}
                onChange={(e) => {
                  handleInputChange("firstName", e.target.value)
                  clearError("firstName")
                }}
                className={cn(fieldClass, errors.firstName && errorClass)}
                placeholder="Sara"
              />
              {errors.firstName && (
                <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="employerLastName" className="text-sm text-slate-700">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employerLastName"
                autoComplete="family-name"
                value={formData.lastName}
                disabled={isSubmitting}
                onChange={(e) => {
                  handleInputChange("lastName", e.target.value)
                  clearError("lastName")
                }}
                className={cn(fieldClass, errors.lastName && errorClass)}
                placeholder="El Idrissi"
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
            <Label htmlFor="employerEmail" className="text-sm text-slate-700">
              Adresse e-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employerEmail"
              type="email"
              autoComplete="email"
              value={formData.email}
              disabled={isSubmitting}
              onChange={(e) => {
                handleInputChange("email", e.target.value)
                clearError("email")
              }}
              className={cn(fieldClass, errors.email && errorClass)}
              placeholder="contact@clinique.ma"
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="companyName" className="text-sm text-slate-700">
              Établissement <span className="font-normal text-slate-400">(facultatif)</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              disabled={isSubmitting}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className={fieldClass}
              placeholder="Clinique, cabinet, hôpital…"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="employerPhone" className="text-sm text-slate-700">
                Téléphone <span className="font-normal text-slate-400">(facultatif)</span>
              </Label>
              <Input
                id="employerPhone"
                type="tel"
                value={formData.phone}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={fieldClass}
                placeholder="05 22 34 56 78"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="employerLocation" className="text-sm text-slate-700">
                Ville <span className="font-normal text-slate-400">(facultatif)</span>
              </Label>
              <Input
                id="employerLocation"
                value={formData.location}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={fieldClass}
                placeholder="Rabat"
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
            <Label htmlFor="employerPassword" className="text-sm text-slate-700">
              Mot de passe <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="employerPassword"
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
            <Label htmlFor="employerConfirmPassword" className="text-sm text-slate-700">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employerConfirmPassword"
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
                id="employerAcceptTerms"
                checked={formData.acceptTerms}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  handleInputChange("acceptTerms", Boolean(checked))
                  clearError("acceptTerms")
                }}
                className="mt-0.5"
              />
              <Label htmlFor="employerAcceptTerms" className="cursor-pointer text-sm font-normal leading-relaxed text-slate-600">
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
