import { useState } from "react";
import { Download } from "lucide-react";

interface DownloadCVButtonProps {
  userId: string;
}

export function DownloadCVButton({ userId }: DownloadCVButtonProps) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCV = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents?documentType=cv&userId=${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error("CV introuvable");
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        setCvUrl(data.documents[0].file_path);
      } else {
        setError("CV non disponible");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération du CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex gap-2 items-center">
      {cvUrl ? (
        <a
          href={cvUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex items-center gap-2 px-3 py-1 border rounded text-blue-700 border-blue-200 hover:bg-blue-50 transition">
            <Download className="w-4 h-4" /> CV
          </button>
        </a>
      ) : (
        <button
          className="flex items-center gap-2 px-3 py-1 border rounded text-blue-700 border-blue-200 hover:bg-blue-50 transition"
          onClick={fetchCV}
          disabled={loading}
        >
          <Download className="w-4 h-4" /> {loading ? "Recherche..." : "CV"}
        </button>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}