"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Mail, MapPin, Stethoscope, Calendar, Eye, UserCheck, UserX, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useMemo, useState } from "react"

type User = {
  id: number
  name: string
  email: string
  type: string
  specialty?: string
  location: string
  created_at?: string
  status: string
  documents: string[]
}

interface TabUsersProps {
  pendingUsers: User[]
  searchTerm: string
  setSearchTerm: (v: string) => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  setSelectedUser: (user: User) => void
  handleValidateUser: (userId: number, action: string) => void
}

const statusStyles: Record<string, { label: string; chip: string; bar: string; avatar: string }> = {
  approved: {
    label: "Approuvé",
    chip: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "from-emerald-400 to-teal-500",
    avatar: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  rejected: {
    label: "Rejeté",
    chip: "bg-rose-100 text-rose-800 border-rose-200",
    bar: "from-rose-400 to-pink-500",
    avatar: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  pending: {
    label: "En attente",
    chip: "bg-amber-100 text-amber-900 border-amber-200",
    bar: "from-amber-400 to-orange-400",
    avatar: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?"
}

export default function TabUsers({
  pendingUsers,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: TabUsersProps) {
  const [modalUser, setModalUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(pendingUsers)
  const [profileDetails, setProfileDetails] = useState<{
    experiences: any[]
    diplomas: any[]
    documents?: Record<string, any[]>
  } | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  React.useEffect(() => {
    setUsers(pendingUsers)
  }, [pendingUsers])

  const counts = useMemo(
    () => ({
      all: users.length,
      pending: users.filter((u) => u.status === "pending").length,
      approved: users.filter((u) => u.status === "approved").length,
      rejected: users.filter((u) => u.status === "rejected").length,
    }),
    [users]
  )

  const visibleUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        [user.name, user.email, user.specialty, user.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || user.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, filterStatus])

  const handleShowModal = async (user: User) => {
    setModalUser(user)
    setProfileDetails(null)
    setLoadingDetails(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/profile-details`)
      if (!res.ok) throw new Error("Erreur lors du chargement des détails du profil")
      const data = await res.json()
      setProfileDetails(data)
    } catch {
      setProfileDetails({ experiences: [], diplomas: [] })
    } finally {
      setLoadingDetails(false)
    }
  }

  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_status: newStatus }),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut")
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
      if (modalUser && modalUser.id === userId) setModalUser({ ...modalUser, status: newStatus })
    } catch {
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const handleApprove = async (userId: number) => {
    if (window.confirm("Confirmer l'approbation de cet utilisateur ?")) {
      await updateUserStatus(userId, "approved")
    }
  }
  const handleReject = async (userId: number) => {
    if (window.confirm("Confirmer le rejet de cet utilisateur ?")) {
      await updateUserStatus(userId, "rejected")
    }
  }
  const handleDeactivateApproval = async (userId: number) => {
    if (window.confirm("Révoquer l'approbation de cet utilisateur ?")) {
      await updateUserStatus(userId, "pending")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: "all", label: "Tous", value: counts.all, accent: "text-[#071d45] bg-white border-slate-200" },
          { key: "pending", label: "En attente", value: counts.pending, accent: "text-amber-800 bg-amber-50 border-amber-200" },
          { key: "approved", label: "Approuvés", value: counts.approved, accent: "text-teal-800 bg-teal-50 border-teal-200" },
          { key: "rejected", label: "Rejetés", value: counts.rejected, accent: "text-rose-800 bg-rose-50 border-rose-200" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilterStatus(stat.key)}
            className={`rounded-2xl border p-4 text-left transition-all ${stat.accent} ${
              filterStatus === stat.key ? "ring-2 ring-offset-2 ring-[#071d45]/30 shadow-md" : "hover:shadow-sm"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Nom, email, spécialité, ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
        />
      </div>

      {visibleUsers.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/60">
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Aucun profil ne correspond à cette recherche.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {visibleUsers.map((user) => {
            const style = statusStyles[user.status] || statusStyles.pending
            const isDoctor = user.type === "Médecin remplaçant"
            return (
              <article
                key={user.id}
                className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className={`h-1.5 bg-gradient-to-r ${style.bar}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-2xl ${style.avatar} text-white flex items-center justify-center text-lg font-bold shadow-inner flex-shrink-0`}
                    >
                      {initials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg text-slate-900 truncate">{user.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            {isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                            {user.type}
                          </p>
                        </div>
                        <Badge className={`${style.chip} border shrink-0`}>{style.label}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-2 truncate">
                          <Mail className="h-3.5 w-3.5 text-teal-600" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-2 truncate">
                          <MapPin className="h-3.5 w-3.5 text-orange-500" />
                          {user.location || "Non renseigné"}
                        </span>
                        {user.specialty && (
                          <span className="flex items-center gap-2 truncate">
                            <Stethoscope className="h-3.5 w-3.5 text-indigo-500" />
                            {user.specialty}
                          </span>
                        )}
                        <span className="flex items-center gap-2 truncate">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {user.created_at ? `Inscrit le ${user.created_at}` : "Date inconnue"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowModal(user)}
                      className="rounded-xl border-slate-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Dossier
                    </Button>
                    {user.status === "approved" ? (
                      <>
                        <Button
                          size="sm"
                          disabled
                          className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 opacity-100 cursor-default"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Validé
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivateApproval(user.id)}
                          className="rounded-xl border-amber-200 text-amber-800 hover:bg-amber-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Désactiver
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    {user.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleReject(user.id)}
                        className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071d45]/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-lg w-full relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className={`h-2 bg-gradient-to-r ${(statusStyles[modalUser.status] || statusStyles.pending).bar}`} />
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl leading-none"
              onClick={() => setModalUser(null)}
            >
              ×
            </button>
            <div className="p-8 overflow-y-auto">
              <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold">Dossier profil</p>
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{modalUser.name}</h2>
              <p className="text-sm text-slate-500 mb-4">{modalUser.type}</p>
              <div className="space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold text-slate-500">Email :</span> {modalUser.email}</div>
                {modalUser.specialty && (
                  <div><span className="font-semibold text-slate-500">Spécialité :</span> {modalUser.specialty}</div>
                )}
                <div><span className="font-semibold text-slate-500">Localisation :</span> {modalUser.location}</div>
                <div><span className="font-semibold text-slate-500">Inscription :</span> {modalUser.created_at}</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Statut :</span>
                  <Badge className={`${(statusStyles[modalUser.status] || statusStyles.pending).chip} border`}>
                    {(statusStyles[modalUser.status] || statusStyles.pending).label}
                  </Badge>
                </div>
              </div>

              {profileDetails?.documents && (
                <div className="mt-5">
                  <p className="font-semibold text-slate-800 mb-2">Documents</p>
                  <div className="flex flex-col gap-1">
                    {["cv", "cin", "diplome"].map((type) =>
                      profileDetails.documents && profileDetails.documents[type]?.length > 0 ? (
                        <div key={type}>
                          {profileDetails.documents[type].map((doc: any, idx: number) => (
                            <a
                              key={doc.id || idx}
                              href={doc.file_url || doc.url || `/api/documents/download/${doc.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 underline hover:text-teal-900 text-sm mr-2"
                            >
                              Télécharger {type.toUpperCase()}{" "}
                              {profileDetails.documents && profileDetails.documents[type].length > 1 ? idx + 1 : ""}
                            </a>
                          ))}
                        </div>
                      ) : null
                    )}
                    {profileDetails.documents &&
                      ["cv", "cin", "diplome"].every((type) => !profileDetails.documents?.[type]?.length) && (
                        <span className="text-slate-500 text-sm">Aucun document disponible.</span>
                      )}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <h3 className="font-semibold text-teal-800 mb-2">Expériences</h3>
                {loadingDetails ? (
                  <div className="text-slate-500 text-sm">Chargement...</div>
                ) : profileDetails && profileDetails.experiences.length > 0 ? (
                  <ul className="space-y-2">
                    {profileDetails.experiences.map((exp, idx) => (
                      <li key={idx} className="text-sm bg-slate-50 rounded-xl p-3">
                        <span className="font-semibold">{exp.workplace_name}</span> — {exp.specialty} ({exp.start_date} - {exp.end_date || "présent"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-500 text-sm">Aucune expérience renseignée.</div>
                )}
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-teal-800 mb-2">Études / Diplômes</h3>
                {loadingDetails ? (
                  <div className="text-slate-500 text-sm">Chargement...</div>
                ) : profileDetails && profileDetails.diplomas.length > 0 ? (
                  <ul className="space-y-2">
                    {profileDetails.diplomas.map((diploma, idx) => (
                      <li key={idx} className="text-sm bg-slate-50 rounded-xl p-3">
                        <span className="font-semibold">{diploma.title}</span> — {diploma.institution} ({diploma.year || "année inconnue"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-500 text-sm">Aucun diplôme renseigné.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
