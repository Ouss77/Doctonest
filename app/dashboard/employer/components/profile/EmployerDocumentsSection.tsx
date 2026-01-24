import { useEffect, useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function EmployerDocumentsSection({ employerId }: { employerId: string }) {
  const [cin, setCin] = useState<any>(null)
  const [diplome, setDiplome] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch the latest uploaded document by type
  const fetchDocument = async (type: string, setter: (doc: any) => void) => {
    setLoading(type)
    setError(null)
    try {
      const res = await fetch(`/api/documents?documentType=${type}&userId=${employerId}`, { credentials: "include" })
      if (!res.ok) throw new Error(`Erreur lors de la récupération du document ${type}`)
      const data = await res.json()
      setter(data.documents && data.documents.length > 0 ? data.documents[0] : null)
    } catch (err: any) {
      setError(err.message || `Erreur lors de la récupération du document ${type}`)
    } finally {
      setLoading(null)
    }
  }

  useEffect(() => {
    if (employerId) {
      fetchDocument("cin", setCin)
      fetchDocument("diplome", setDiplome)
    }
  }, [employerId])

  const handleDelete = async (doc: any, type: string, setter: (doc: any) => void) => {
    setLoading(type)
    setError(null)
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`Erreur lors de la suppression du document ${type}`)
      setter(null)
    } catch (err: any) {
      setError(err.message || `Erreur lors de la suppression du document ${type}`)
    } finally {
      setLoading(null)
    }
  }

  const renderDocSection = (label: string, docType: string, doc: any, setter: (doc: any) => void) => (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{label}</span>
      </div>

      <FileUpload
        documentType={docType}
        onUploadComplete={() => fetchDocument(docType, setter)}
        acceptedTypes={["application/pdf"]}
        className="max-w-md"
      />

      {loading === docType && <p className="text-xs text-gray-500 mt-2">Chargement du document...</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {doc && (
        <>
          <p className="text-xs text-gray-500 mt-2">
            Dernier upload : {new Date(doc.uploaded_at).toLocaleString()}
          </p>
          <div className="mt-4 border rounded-md overflow-hidden">
            <iframe
              src={doc.file_path}
              className="w-full h-96"
              title={`Aperçu du ${label}`}
            />
          </div>
          <div className="flex gap-2 items-center mt-2">
            <a
              href={doc.file_path}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 px-3 py-1 border rounded text-blue-700 border-blue-200 hover:bg-blue-50 transition">
                <Download className="w-4 h-4" /> Télécharger
              </button>
            </a>
            <button
              className="flex items-center gap-2 px-3 py-1 border rounded text-red-700 border-red-200 hover:bg-red-50 transition"
              onClick={() => handleDelete(doc, docType, setter)}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Documents Employeur</CardTitle>
        <CardDescription>Gérez et téléchargez vos documents professionnels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-6">
          {renderDocSection("Carte d'identité nationale (CIN)", "cin", cin, setCin)}
          {renderDocSection("Diplôme", "diplome", diplome, setDiplome)}
        </div>
      </CardContent>
    </Card>
  )
}
