"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import EmployerRegisterForm from "./_components/EmployerRegisterForm"
import ReplacementRegisterForm from "./_components/ReplacementRegisterForm"
import { AlertCircle, ArrowLeft, Building2, CheckCircle2, Shield, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"

type UserType = "replacement" | "employer"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>("replacement")
  const [pathChosen, setPathChosen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    location: "",
    companyName: "",
    companyType: "",
    profession: "Médecin",
    specialty: "Médecine générale",
  })
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const typeFromUrl = params.get("type")
    if (typeFromUrl === "replacement" || typeFromUrl === "employer") {
      setUserType(typeFromUrl)
      setPathChosen(true)
    }
  }, [])

  const choosePath = (type: UserType) => {
    setUserType(type)
    setPathChosen(true)
    setServerError("")
    const url = new URL(window.location.href)
    url.searchParams.set("type", type)
    window.history.replaceState({}, "", url.pathname + "?" + url.searchParams.toString())
  }

  const changePath = () => {
    setPathChosen(false)
    setServerError("")
    const url = new URL(window.location.href)
    url.searchParams.delete("type")
    window.history.replaceState({}, "", url.pathname)
  }

  const handleInputChange = (field: string, value: string | boolean | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (serverError) setServerError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setServerError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          companyName: formData.companyName,
          companyType: formData.companyType,
          profession: formData.profession,
          specialty: formData.specialty,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccessPopup(true)
        setTimeout(() => {
          router.push(userType === "replacement" ? "/dashboard/replacement" : "/dashboard/employer")
        }, 1600)
      } else {
        setServerError(data.error || "Impossible de créer le compte. Vérifiez vos informations.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setServerError("Erreur de connexion au serveur. Réessayez dans un instant.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg">
            <CheckCircle2 className="mx-auto mb-3 h-11 w-11 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">Compte créé</h3>
            <p className="mt-1.5 text-sm text-slate-600">Redirection vers votre espace DoctoNest…</p>
          </div>
        </div>
      )}

      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-slate-900 px-9 py-8 text-white lg:flex lg:flex-col">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <img src="/logo.png" alt="DoctoNest" className="h-11 w-11 rounded-xl bg-white object-cover" />
            <div>
              <p className="text-lg font-semibold tracking-tight">DoctoNest</p>
              <p className="text-xs text-slate-400">Remplacement médical au Maroc</p>
            </div>
          </Link>

          <div className="relative z-10 mt-10 max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300">Espace professionnel</p>
            <h1 className="mt-2.5 text-3xl font-semibold leading-tight">Rejoignez DoctoNest</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              La plateforme de remplacement médical dédiée aux médecins, dentistes et établissements de santé.
            </p>
          </div>

          <ul className="relative z-10 mt-8 space-y-3 text-sm text-slate-200">
            {[
              { icon: Stethoscope, text: "Missions ciblées selon votre profession et votre spécialité" },
              { icon: Shield, text: "Profils et échanges réservés aux professionnels de santé" },
              { icon: Building2, text: "Mise en relation directe avec les établissements" },
            ].map((item) => (
              <li key={item.text} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="relative z-10 mt-auto pt-8 text-xs text-slate-500">
            Vos données ne sont utilisées que pour votre compte et la mise en relation professionnelle.
          </p>
        </aside>

        <main className="flex items-start justify-center bg-slate-100 px-4 py-5 sm:px-6 lg:py-6">
          <div className="w-full max-w-[440px]">
            <Link href="/" className="mb-4 flex items-center gap-2.5 lg:hidden">
              <img src="/logo.png" alt="DoctoNest" className="h-9 w-9 rounded-xl object-cover" />
              <span className="text-base font-semibold text-slate-900">DoctoNest</span>
            </Link>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6">
              {!pathChosen ? (
                <div>
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">Que recherchez-vous sur DoctoNest ?</h2>
                    <p className="mt-1 text-sm text-slate-500">Choisissez votre parcours pour afficher le formulaire adapté.</p>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <button
                      type="button"
                      onClick={() => choosePath("replacement")}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                    >
                      <span className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <Stethoscope className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">Je cherche une mission</span>
                          <span className="mt-1 block text-sm leading-snug text-slate-500">
                            Je suis médecin ou dentiste et je recherche des missions de remplacement adaptées à ma spécialité.
                          </span>
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => choosePath("employer")}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                    >
                      <span className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                          <Building2 className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">Je cherche un médecin</span>
                          <span className="mt-1 block text-sm leading-snug text-slate-500">
                            Je représente un établissement et je recherche un professionnel pour un remplacement.
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 pb-4">
                    <button
                      type="button"
                      onClick={changePath}
                      className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Changer de parcours
                    </button>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">Créer un compte</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {userType === "replacement"
                        ? "Inscription réservée aux médecins et dentistes."
                        : "Inscription destinée aux établissements de santé."}
                    </p>
                  </div>

                  {serverError && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{serverError}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    {userType === "replacement" ? (
                      <ReplacementRegisterForm
                        key="replacement"
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                    ) : (
                      <EmployerRegisterForm
                        key="employer"
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </div>
                </>
              )}
            </section>

            <p className="mt-4 text-center text-sm text-slate-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-medium text-blue-700 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
