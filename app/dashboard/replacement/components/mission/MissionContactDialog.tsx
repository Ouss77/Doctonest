import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

interface MissionContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mission: any | null;
}

export default function MissionContactDialog({ open, onOpenChange, mission }: MissionContactDialogProps) {
  const { profile } = useAuth();
  console.log("MissionContactDialog profile:", profile);
  const [employer, setEmployer] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mission && mission.employer_id) {
      setLoading(true);
      fetch(`/api/employers/${mission.employer_id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setEmployer(data?.employer || null))
        .finally(() => setLoading(false));
    } else {
      setEmployer(null);
    }
  }, [mission]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M9 8h6m-6 4h6m-7 8V5a2 2 0 012-2h4a2 2 0 012 2v15" />
            </svg>
            Contact de l'établissement
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Coordonnées et adresse complète du cabinet ou de la clinique.
          </DialogDescription>
        </DialogHeader>

        {mission ? (
          loading ? (
            <div className="text-gray-500 text-center py-6">Chargement...</div>
          ) : profile?.profile_status !== "approved" ? (
            <div className="text-center py-8 text-red-600 font-semibold text-base">
              Votre profil n'est pas encore vérifié. Vous devez être validé par l'administration pour accéder aux coordonnées de contact.
            </div>
          ) : (
            <div className="space-y-5 mt-6 text-gray-800">
              {/* Nom */}
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20V10h6v10M4 10l8-8 8 8" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Nom</p>
                  <p className="font-medium">{employer?.organization_name || mission.organization_name || mission.title || "-"}</p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2l2 4-2 2a16 16 0 006 6l2-2 4 2v2a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="font-medium">{employer?.phone || "Non renseigné"}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{employer?.email || "Non renseigné"}</p>
                </div>
              </div>

              {/* Adresse */}
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Adresse complète</p>
                  <p className="font-medium">{employer?.address || mission.full_address || mission.location || "Non renseignée"}</p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center py-6">Aucune mission sélectionnée.</div>
        )}

        <DialogClose asChild>
          <Button
            variant="outline"
            className="mt-6 w-full border-gray-300 text-gray-900 hover:bg-gray-100 rounded-xl py-2.5 font-semibold transition-colors duration-200"
          >
            Fermer
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
