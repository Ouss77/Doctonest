"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Mail, MapPin, FileText, Calendar, Eye, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useMemo, useState } from "react"

type User = {
  id: number;
  name: string;
  email: string;
  type: string;
  specialty?: string;
  location: string;
  created_at?: string;
  status: string;
  documents: string[];
}

interface TabUsersProps {
  pendingUsers: User[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  setSelectedUser: (user: User) => void;
  handleValidateUser: (userId: number, action: string) => void;
}

export default function TabUsers({ pendingUsers, searchTerm, setSearchTerm, filterStatus, setFilterStatus, setSelectedUser, handleValidateUser }: TabUsersProps) {
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(pendingUsers);
  const [profileDetails, setProfileDetails] = useState<{ experiences: any[]; diplomas: any[]; documents?: Record<string, any[]> } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  React.useEffect(() => {
    setUsers(pendingUsers);
  }, [pendingUsers]);

  const visibleUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        [user.name, user.email, user.specialty, user.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

  const handleShowModal = async (user: User) => {
    setModalUser(user);
    setProfileDetails(null);
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/profile-details`);
      if (!res.ok) throw new Error('Erreur lors du chargement des détails du profil');
      const data = await res.json();
      setProfileDetails(data);
    } catch (err) {
      setProfileDetails({ experiences: [], diplomas: [] });
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      // Call API to update status
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_status: newStatus }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour du statut');
      // Update local state
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      if (modalUser && modalUser.id === userId) setModalUser({ ...modalUser, status: newStatus });
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleApprove = async (userId: number) => {
    if (window.confirm("Confirmer l'approbation de cet utilisateur ?")) {
      await updateUserStatus(userId, 'approved');
    }
  };
  const handleReject = async (userId: number) => {
    if (window.confirm("Confirmer le rejet de cet utilisateur ?")) {
      await updateUserStatus(userId, 'rejected');
    }
  };

  const handleDeactivateApproval = async (userId: number) => {
    if (window.confirm("Révoquer l'approbation de cet utilisateur ?")) {
      await updateUserStatus(userId, 'pending');
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Card className="bg-blue-50/60 shadow rounded-2xl border-0">

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Rechercher un utilisateur</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom, email, spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 focus:ring-2 focus:ring-blue-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Pending Users */}
      <Card className="bg-orange-50/60 shadow rounded-2xl border-0">
        <CardHeader className="bg-transparent pb-2">
          <CardTitle className="text-orange-800 font-bold">Utilisateurs</CardTitle>
          <CardDescription>Liste complète filtrable par statut et recherche</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {visibleUsers.map((user) => (
              <div key={user.id} className="border border-orange-100 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                    <Badge variant={user.type === "Médecin remplaçant" ? "default" : "secondary"} className="text-xs px-2 py-1">
                      {user.type}
                    </Badge>
                    {user.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-700 border-green-300 ml-2">Approuvé</Badge>
                    )}
                    {user.status === 'rejected' && (
                      <Badge className="bg-red-100 text-red-700 border-red-300 ml-2">Rejeté</Badge>
                    )}
                    {user.status === 'pending' && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 ml-2">En attente</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                    {user.specialty && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {user.specialty}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Inscrit le {user.created_at}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {user.documents.map((doc) => (
                      <Badge key={doc} variant="outline" className="text-xs px-2 py-1">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowModal(user)}
                    className="hover:bg-blue-50 hover:border-blue-300 rounded-xl"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  {user.status === "approved" ? (
                    <>
                      <Button
                        size="sm"
                        disabled
                        className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm cursor-default opacity-100"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Déjà approuvé
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeactivateApproval(user.id)}
                        className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Désactiver
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                  )}
                  {user.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user.id)}
                      className="rounded-xl"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Modal for user details */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setModalUser(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Détails du médecin</h2>
            <div className="mb-2"><span className="font-semibold">Nom:</span> {modalUser.name}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {modalUser.email}</div>
            {modalUser.specialty && <div className="mb-2"><span className="font-semibold">Spécialité:</span> {modalUser.specialty}</div>}
            <div className="mb-2"><span className="font-semibold">Localisation:</span> {modalUser.location}</div>
            <div className="mb-2"><span className="font-semibold">Date d'inscription:</span> {modalUser.created_at}</div>
            <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Statut:</span>
              {modalUser.status === 'approved' && <Badge className="bg-green-100 text-green-700 border-green-300">Approuvé</Badge>}
              {modalUser.status === 'rejected' && <Badge className="bg-red-100 text-red-700 border-red-300">Rejeté</Badge>}
              {modalUser.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">En attente</Badge>}
            </div>
            {/* Download links for documents */}
            {profileDetails && profileDetails.documents && (
              <div className="mb-2">
                <span className="font-semibold">Documents:</span>
                <div className="flex flex-col gap-1 mt-1">
                  {['cv', 'cin', 'diplome'].map((type) => (
                    profileDetails.documents && profileDetails.documents[type]?.length > 0 ? (
                      <div key={type}>
                        {profileDetails.documents[type].map((doc: any, idx: number) => (
                          <a
                            key={doc.id || idx}
                            href={doc.file_url || doc.url || `/api/documents/download/${doc.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 text-sm mr-2"
                          >
                            Télécharger {type.toUpperCase()} {profileDetails.documents && profileDetails.documents[type].length > 1 ? idx + 1 : ''}
                          </a>
                        ))}
                      </div>
                    ) : null
                  ))}
                  {/* If no docs at all */}
                  {profileDetails.documents && ['cv', 'cin', 'diplome'].every((type) => !profileDetails.documents?.[type]?.length) && (
                    <span className="text-gray-500 text-sm">Aucun document disponible.</span>
                  )}
                </div>
              </div>
            )}
            {/* Experiences */}
            <div className="mt-4">
              <h3 className="font-semibold text-blue-700 mb-2">Expériences</h3>
              {loadingDetails ? (
                <div>Chargement...</div>
              ) : profileDetails && profileDetails.experiences.length > 0 ? (
                <ul className="list-disc ml-5">
                  {profileDetails.experiences.map((exp, idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-semibold">{exp.workplace_name}</span> - {exp.specialty} ({exp.start_date} - {exp.end_date || 'présent'})
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">Aucune expérience renseignée.</div>
              )}
            </div>
            {/* Diplomas */}
            <div className="mt-4">
              <h3 className="font-semibold text-blue-700 mb-2">Études / Diplômes</h3>
              {loadingDetails ? (
                <div>Chargement...</div> 
              ) : profileDetails && profileDetails.diplomas.length > 0 ? (
                <ul className="list-disc ml-5">
                  {profileDetails.diplomas.map((diploma, idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-semibold">{diploma.title}</span> - {diploma.institution} ({diploma.year || 'année inconnue'})
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">Aucun diplôme renseigné.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
