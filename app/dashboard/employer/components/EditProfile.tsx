import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, User, X, Camera, Mail, Phone, MapPin, Building, Briefcase, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export default function EditProfile({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] !max-w-[900px] h-[85vh] p-0 rounded-xl bg-white shadow-2xl flex flex-col border-0">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Modifier le profil
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange?.(false)}
            className="h-8 w-8 rounded-full hover:bg-slate-200"
          >
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6">
          <div className="flex flex-col md:flex-row h-full gap-8">
            
            {/* LEFT - Photo Section */}
            <div className="md:w-1/3 flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                <div className="w-48 h-48 rounded-3xl overflow-hidden bg-white border-2 border-slate-300 shadow-md flex items-center justify-center">
                  {previewUrl || form?.photo_url ? (
                    <img
                      src={previewUrl || form.photo_url}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <User className="w-16 h-16 text-slate-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-slate-300 hover:border-slate-400 mb-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl || form?.photo_url ? "Changer la photo" : "Ajouter une photo"}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
                disabled={loading}
              />

              <p className="text-xs text-slate-500 text-center mt-2">
                JPG, PNG, GIF • Max 5MB
              </p>
            </div>

            {/* RIGHT - Form Fields */}
            <div className="md:w-2/3 overflow-y-auto p-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Column */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-4 h-4 text-slate-500" />
                        Prénom
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.firstName || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({ ...f, firstName: e.target.value }))
                        }
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-4 h-4 text-slate-500" />
                        Nom
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.lastName || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({ ...f, lastName: e.target.value }))
                        }
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fonction" className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        Fonction
                      </Label>
                      <Input
                        id="fonction"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.fonction || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({ ...f, fonction: e.target.value }))
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Second Column */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4 text-slate-500" />
                        Email professionnel
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.email || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({ ...f, email: e.target.value }))
                        }
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                        <Phone className="w-4 h-4 text-slate-500" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.phone || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({ ...f, phone: e.target.value }))
                        }
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="establishmentName" className="flex items-center gap-2 text-sm font-medium">
                        <Building className="w-4 h-4 text-slate-500" />
                        Établissement
                      </Label>
                      <Input
                        id="establishmentName"
                        className="h-11 text-sm border-slate-300 focus:border-blue-500"
                        value={form?.establishmentName || ""}
                        onChange={(e) =>
                          setForm((f: any) => ({
                            ...f,
                            establishmentName: e.target.value,
                          }))
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Full Width Address Field */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    className="h-11 text-sm border-slate-300 focus:border-blue-500"
                    value={form?.address || ""}
                    onChange={(e) =>
                      setForm((f: any) => ({ ...f, address: e.target.value }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-slate-500">
              <span className="text-red-500">*</span> Champs obligatoires
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={loading}
                className="h-10 px-4"
              >
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 font-medium"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}