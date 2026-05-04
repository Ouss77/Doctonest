"use client"

import { Suspense, useEffect, useState, type ChangeEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, Trash2, Save, Briefcase, MapPin, Sparkles, Clock3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Mission = {
  id: string
  title: string
  description: string
  specialty_required: string
  location: string
  guest_name?: string | null
  guest_email?: string | null
}

function EditMissionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    specialty_required: "",
    location: "",
  })

  const formatDate = (value?: string | null) => {
    if (!value) return "Non renseignée"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  useEffect(() => {
    const loadMission = async () => {
      if (!token) {
        setError("Lien de modification manquant")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/missions/by-token?token=${encodeURIComponent(token)}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || "Mission introuvable")
        }

        setMission(data.mission)
        setForm({
          title: data.mission.title || "",
          description: data.mission.description || "",
          specialty_required: data.mission.specialty_required || "",
          location: data.mission.location || "",
        })
      } catch (fetchError: any) {
        setError(fetchError.message || "Mission introuvable")
      } finally {
        setLoading(false)
      }
    }

    loadMission()
  }, [token])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/missions/update-by-token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...form,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors de la mise à jour")
      }

      setMission(data.mission)
      setSuccess("Mission mise à jour avec succès")
    } catch (saveError: any) {
      setError(saveError.message || "Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!token) return
    if (!window.confirm("Supprimer définitivement cette mission ?")) return

    setDeleting(true)
    setError(null)

    try {
      const res = await fetch("/api/missions/delete-by-token", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Erreur lors de la suppression")
      }

      router.push("/annonces")
    } catch (deleteError: any) {
      setError(deleteError.message || "Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-sky-800 px-6 py-6 text-white md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Briefcase className="h-7 w-7 text-sky-200" />
              </div>
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-100 ring-1 ring-white/15">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modification sécurisée
                </div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Modifier la mission</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
                  Utilisez ce lien sécurisé pour éditer ou supprimer votre annonce sans créer de compte.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
            {loading ? (
              <div className="py-16 text-center text-slate-500">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                Chargement de la mission...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Titre</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500" />
                      <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Entrez le titre de la mission"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty_required" className="text-sm font-semibold text-slate-700">Spécialité requise</Label>
                    <Input
                      id="specialty_required"
                      name="specialty_required"
                      value={form.specialty_required}
                      onChange={handleChange}
                      className="h-12 border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                      placeholder="Entrez la spécialité"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-slate-700">Localisation</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500" />
                      <Input
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Ville, adresse, région"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={8}
                      value={form.description}
                      onChange={handleChange}
                      className="min-h-[160px] resize-none border-slate-200 bg-slate-50 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                      placeholder="Décrivez la mission, le contexte, la durée, les contraintes et les attentes..."
                    />
                  </div>
                </div>

                {mission?.guest_name || mission?.guest_email ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">Informations du créateur</p>
                    {mission.guest_name && <p>Nom: {mission.guest_name}</p>}
                    {mission.guest_email && <p>Email: {mission.guest_email}</p>}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{success}</p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/annonces")}
                    className="h-11 rounded-xl border-slate-200 bg-white px-6 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={saving || deleting}
                    className="h-11 rounded-xl px-6 font-semibold shadow-sm"
                  >
                    {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Supprimer
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || deleting}
                    className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:via-sky-700 hover:to-indigo-700"
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer
                  </Button>
                </div>
              </>
            )}
          </div>

            <aside className="border-t border-slate-200 bg-slate-50 px-6 py-6 md:px-8 lg:border-l lg:border-t-0">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Aperçu de la mission</p>
                    <p className="text-xs text-slate-500">Résumé visible lors de l’édition</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Titre</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{form.title || mission?.title || "Non renseigné"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MapPin className="h-4 w-4 text-indigo-500" />
                      Localisation
                    </div>
                    <p className="mt-2 text-sm text-slate-900">{form.location || "Non renseignée"}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Clock3 className="h-4 w-4 text-sky-500" />
                      Mission sécurisée
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Cette mission est protégée par un lien privé. Toute modification ici affecte uniquement cette annonce.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 p-4 ring-1 ring-sky-100">
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-700">Spécialité</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{form.specialty_required || "Non renseignée"}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Gardez un titre clair, une localisation précise et une description structurée pour améliorer la lisibilité de votre annonce.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditMissionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-100 px-4 py-10">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-2xl">
            Chargement de la page de modification...
          </div>
        </div>
      }
    >
      <EditMissionContent />
    </Suspense>
  )
}