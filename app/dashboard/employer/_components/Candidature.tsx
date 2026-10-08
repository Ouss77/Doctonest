import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DownloadCVButton } from "./DownloadCVButton";
import { Mail, Phone, Search, Filter, User, Briefcase, Calendar, MessageSquare, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CandidatureProps {
  missions: any[];
}

export default function Candidature({ missions }: CandidatureProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [missionFilter, setMissionFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchAllApplications() {
      setLoading(true);
      setError("");
      try {
        let allApps: any[] = [];
        for (const mission of missions) {
          const res = await fetch(`/api/applications?missionId=${mission.id}`);
          if (res.ok) {
            console.log('Fetched applications for mission:', mission.id);
            const data = await res.json(); 
            console.log('Applications data:', data);
            const apps = (data.applications || []).map((app: any) => ({ ...app, mission }));
            allApps = allApps.concat(apps);
          }
        }
        setApplications(allApps);
      } catch (err) {
        setError("Erreur lors du chargement des candidatures");
      } finally {
        setLoading(false);
      }
    }
    if (missions.length > 0) fetchAllApplications();
    else setLoading(false);
  }, [missions]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des candidatures...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 text-red-700">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!missions.length) return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune mission trouvée</h3>
        <p className="text-slate-600">Commencez par créer une mission pour recevoir des candidatures.</p>
      </CardContent>
    </Card>
  );

  if (!applications.length) return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune candidature reçue</h3>
        <p className="text-slate-600 mb-4">Aucune candidature n'a été soumise pour vos missions actuellement.</p>
        <Button variant="outline" className="border-blue-600 text-blue-600">
          Partager une mission
        </Button>
      </CardContent>
    </Card>
  );

  // Filter logic
  const filteredApps = applications.filter(app => {
    const matchesSearch = search.trim() === "" || 
      `${app.first_name} ${app.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      app.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase());
    const matchesMission = missionFilter === "" || missionFilter === "all" || app.mission.id === missionFilter;
    return matchesSearch && matchesMission;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Candidatures reçues </h1>
            <p className="text-slate-600 text-sm mt-1">
              {applications.length} candidature{applications.length > 1 ? 's' : ''} • {missions.length} mission{missions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un candidat..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={missionFilter} onValueChange={setMissionFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Toutes les missions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les missions</SelectItem>
                  {missions.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-500 flex items-center justify-center md:justify-end">
                {filteredApps.length} résultat{filteredApps.length > 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow border-slate-200">
              <CardContent className="p-6">
                {/* Candidate Header */}
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-14 h-14 border-2 border-slate-100">
                    <AvatarImage src={app.photo_url || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {app.first_name?.[0]}{app.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">
                      {app.first_name} {app.last_name}
                    </h3>
                    {app.specialty && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs mt-1">
                        {app.specialty}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Mission Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Mission postulée</span>
                  </div>
                  <p className="text-slate-900 font-medium text-sm">{app.mission.title}</p>
                </div>

                {/* Contact Info - Hidden by default */}
                <div className="space-y-3 mb-10">
                  {app.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 truncate">{app.email}</span>
                    </div>
                  )}
                  {app.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{app.phone}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2  items-center w-full pt-0 ">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setSelectedCandidate(app)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                  {/* <DownloadCVButton className="mt-0 pt-0" userId={app.user_id || app.id} /> */}
                  {app.phone && (
                    <div className="flex-1">
                      <a
                        href={`https://wa.me/${app.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="block h-full"
                      >
                        <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 w-full">
                          <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun résultat</h3>
              <p className="text-slate-600">Aucune candidature ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Contacter {selectedCandidate?.first_name} {selectedCandidate?.last_name}
            </DialogTitle>
            <DialogDescription>
              Coordonnées du candidat
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedCandidate?.email && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <a 
                    href={`mailto:${selectedCandidate.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedCandidate.email}
                  </a>
                </div>
              </div>
            )}

            {selectedCandidate?.phone && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Téléphone</p>
                  <a 
                    href={`tel:${selectedCandidate.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedCandidate.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedCandidate(null)}
              className="flex-1"
            >
              Fermer
            </Button>
            {selectedCandidate?.email && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => window.location.href = `mailto:${selectedCandidate.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Missing AlertCircle component - add import if needed
const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);