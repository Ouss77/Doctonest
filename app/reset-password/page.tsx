"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Lien de réinitialisation invalide.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Votre mot de passe a été réinitialisé avec succès.");
      } else {
        setMessage(data.error || "Erreur lors de la réinitialisation.");
      }
    } catch (err) {
      setMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-900">
      {/* Left Side - Dark Hero Style */}
      <div className="hidden md:flex flex-col items-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-10 relative">
        <h2 className="text-3xl font-extrabold text-center w-full absolute top-0 left-0 mt-0 pt-8 drop-shadow-lg">
          Bienvenue sur Doctonest
        </h2>
        <div className="flex-1 flex flex-col justify-center w-full pt-20">
          <img
            src="/login.png"
            alt="Connexion illustration"
            className="mb-6 drop-shadow-2xl rounded-2xl w-full max-w-lg mx-auto"
          />
        </div>
      </div>

      {/* Right Side (Form) - Modern Card */}
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
        <div className="w-full max-w-xl rounded-3xl shadow-2xl p-6 md:p-10 bg-gray-800 border border-gray-700">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="Doctonest" className="w-10 h-10 rounded-full" />
              </div>
            </Link>
            <p className="text-gray-300 text-lg font-bold">Réinitialisez votre mot de passe</p>
          </div>

          <Card className="rounded-2xl shadow-xl bg-gray-900 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-400">Nouveau mot de passe</CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Saisissez et confirmez votre nouveau mot de passe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div className={`mb-3 p-3 rounded-lg text-sm ${message.includes('succès') ? 'bg-green-900/20 border border-green-400 text-green-400' : 'bg-red-900/20 border border-red-400 text-red-400'}`}>
                  <p>{message}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="py-3 px-4 text-base placeholder:text-base rounded-2xl border-blue-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 h-12"
                    style={{ fontSize: "1rem" }}
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="py-3 px-4 text-base placeholder:text-base rounded-2xl border-blue-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 h-12"
                    style={{ fontSize: "1rem" }}
                  />
                </div>
                <Button type="submit" className="w-full py-3 text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    "Réinitialiser"
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Retour à la page de {" "}
                  <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                    connexion
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
