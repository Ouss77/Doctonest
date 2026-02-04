"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Shield, Stethoscope, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [formValid, setFormValid] = useState(false)
  const router = useRouter()
  const { refreshUser } = useAuth()

  // Validation du formulaire en temps réel
  useEffect(() => {
    const isValid = email.includes("@") && 
                   email.includes(".") && 
                   email.length > 5 && 
                   password.length >= 6
    setFormValid(isValid)
  }, [email, password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formValid) {
      setError("Veuillez remplir tous les champs correctement")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
        credentials: "include"
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Connexion réussie ! Redirection en cours...")
        await refreshUser()
        
        // Petite animation avant la redirection
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirection basée sur le type d'utilisateur
        switch (data.user.userType) {
          case "replacement":
            router.push("/dashboard/replacement")
            break
          case "employer":
            router.push("/dashboard/employer")
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        // Messages d'erreur plus spécifiques
        switch (response.status) {
          case 401:
            setError("Email ou mot de passe incorrect")
            break
          case 403:
            setError("Compte non vérifié. Vérifiez vos emails")
            break
          case 429:
            setError("Trop de tentatives. Veuillez réessayer plus tard")
            break
          default:
            setError(data.error || "Erreur de connexion")
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("La requête a expiré. Vérifiez votre connexion")
      } else {
        setError("Erreur de connexion. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl"
      >
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
          {/* Gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image et description */}
            <div className="lg:w-3/6 p-6 lg:p-8 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900 border-r border-gray-700">
              <div className="h-full flex flex-col">
                {/* Logo et titre */}
                <div className="mb-6 lg:mb-8">
                  <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <img 
                        src="/logo.png" 
                        alt="DoctoNest" 
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyNCIgZmlsbD0idXJsKCNwYWludDBfYW5ndWxhcl8xXzExMjMpIi8+PHBhdGggZD0iTTE2LjUgMzEuNUwxOC41IDI4LjVMMjEuNSAzMS41TDI2LjUgMjQuNUwyOS41IDI3LjVMMzIuNSAyMi41IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9hbmd1bGFyXzFfMTEyMyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDI0IDAgMCAyNCAyNCAyNCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNjA3QUQxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSI4QzVDRTUiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
                        }}
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        DoctoNest
                      </h1>
                      <p className="text-sm text-gray-400">Espace professionnel</p>
                    </div>
                  </Link>
                  <p className="text-lg text-gray-200 font-medium">
                    La plateforme de remplacement médical
                  </p>
                </div>

                {/* Image plus petite et texte autour */}
                <div className="flex-2 flex flex-col justify-center">
                  <div className="relative mb-6">
                    <img
                      src="/logo-login.png"
                      alt="Interface DoctoNest"
                      className="w-full rounded-xl    max-h-[220px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFlMWUyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2Mzc3ZGYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+RG9jdG9OZXN0PC90ZXh0Pjwvc3ZnPg=="
                      }}
                    />
                  </div>

                  {/* Texte descriptif */}
                  <div className="text-center mb-8">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Simplifiez la gestion des remplacements médicaux avec une interface intuitive et sécurisée, conçue spécialement pour les professionnels de santé.
                    </p>
                  </div>

                  {/* Features list compacte */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <Shield className="h-4 w-4 text-green-400" />, text: "Sécurisé" },
                      { icon: <Stethoscope className="h-4 w-4 text-blue-400" />, text: "Médical" },
                      { icon: <Clock className="h-4 w-4 text-purple-400" />, text: "Efficace" },
                      { icon: <Users className="h-4 w-4 text-pink-400" />, text: "Collaboratif" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3">
                        {feature.icon}
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la section gauche */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    Plateforme certifiée pour les professionnels de santé
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Formulaire */}
            <div className="lg:w-3/6 p-6 lg:p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-2xl font-bold text-white">
                  Connexion à votre compte
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Accédez à votre tableau de bord professionnel
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-green-300 text-sm">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email professionnel
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@hopital.fr"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      autoComplete="email"
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="text-sm font-medium text-gray-300">
                        Mot de passe
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError("")
                        }}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-xl border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 transition-all"
                        autoComplete="current-password"
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 hover:bg-gray-800"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Remember me et lien aide */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                        Se souvenir de moi
                      </label>
                    </div>
                    <Link
                      href="/aide"
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Besoin d'aide ?
                    </Link>
                  </div>

                  {/* Bouton de connexion */}
                  <Button
                    type="submit"
                    disabled={isLoading || !formValid}
                    className="w-full h-12 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>

                {/* Lien d'inscription */}
                <div className="text-center pt-6 border-t border-gray-700 mt-8">
                  <p className="text-gray-400 text-sm">
                    Nouveau sur DoctoNest ?{" "}
                    <Link
                      href="/register"
                      className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                    >
                      Créer un compte professionnel
                    </Link>
                  </p>
                  <p className="text-gray-500 text-xs mt-3">
                    En vous connectant, vous acceptez nos{" "}
                    <Link href="/terms" className="text-blue-400 hover:underline">
                      Conditions d'utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link href="/privacy" className="text-blue-400 hover:underline">
                      Politique de confidentialité
                    </Link>
                  </p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DoctoNest. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </div>
  )
}