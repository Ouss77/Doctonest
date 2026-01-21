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
import { Upload, User } from "lucide-react";
import React, { useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl p-8 bg-white border border-slate-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Modifier le profil
          </DialogTitle>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex items-center gap-6 mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border flex items-center justify-center">
            {previewUrl || form?.photo_url ? (
              <img
                src={previewUrl || form.photo_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Changer la photo
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
          />
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <Label>Prénom</Label>
            <Input
              className="mt-1"
              value={form?.firstName || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Nom</Label>
            <Input
              className="mt-1"
              value={form?.lastName || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Fonction</Label>
            <Input
              className="mt-1"
              value={form?.fonction || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, fonction: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Email professionnel</Label>
            <Input
              className="mt-1"
              type="email"
              value={form?.email || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, email: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Téléphone</Label>
            <Input
              className="mt-1"
              value={form?.phone || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Établissement</Label>
            <Input
              className="mt-1"
              value={form?.establishmentName || ""}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  establishmentName: e.target.value,
                }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label>Adresse</Label>
            <Input
              className="mt-1"
              value={form?.address || ""}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, address: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
            onClick={onSave}
          >
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
