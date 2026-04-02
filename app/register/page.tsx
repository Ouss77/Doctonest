"use client";

import type React from "react";
import { useState, useEffect } from "react";
import EmployerRegisterForm from "./EmployerRegisterForm";
import ReplacementRegisterForm from "./ReplacementRegisterForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Shield, Stethoscope, Clock, Users, Building, UserPlus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"replacement" | "employer">("replacement");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    location: "",
    companyName: "",
    companyType: "",
    description: "",
    profession: "",
    specialty: "",
  });
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setShowLeftPanel(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeFromUrl = params.get("type");
      if (typeFromUrl === "replacement" || typeFromUrl === "employer") {
        setUserType(typeFromUrl as "replacement" | "employer");
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation");
      return;
    }

    if (userType === "replacement" && formData.profession === "Médecin" && !formData.specialty) {
      alert("Veuillez sélectionner une spécialité médicale");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          companyName: formData.companyName,
          companyType: formData.companyType,
          description: formData.description,
          profession: formData.profession,
          specialty: formData.specialty,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          if (userType === "replacement") {
            router.push("/dashboard/replacement");
          } else {
            router.push("/dashboard/employer");
          }
        }, 2000);
      } else {
        alert(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const companyTypes = [
    "Hôpital public",
    "Clinique privée",
    "Cabinet médical",
    "Maison de santé",
    "Centre de soins",
    "EHPAD",
    "Médecin indépendant",
  ];

  // Définition des features selon le type d'utilisateur
  const replacementFeatures = [
    { icon: <Stethoscope className="h-4 w-4 text-blue-400" />, text: "Missions variées" },
    { icon: <Clock className="h-4 w-4 text-purple-400" />, text: "Flexibilité" },
    { icon: <Shield className="h-4 w-4 text-green-400" />, text: "Sécurité" },
    { icon: <Users className="h-4 w-4 text-pink-400" />, text: "Réseau" }
  ];

  const employerFeatures = [
    { icon: <Building className="h-4 w-4 text-blue-400" />, text: "Gestion simplifiée" },
    { icon: <UserPlus className="h-4 w-4 text-purple-400" />, text: "Recrutement rapide" },
    { icon: <Shield className="h-4 w-4 text-green-400" />, text: "Sécurité" },
    { icon: <Users className="h-4 w-4 text-pink-400" />, text: "Large choix" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Inscription réussie !</h3>
              <p className="text-gray-300 mb-4">
                Votre compte {userType === "replacement" ? "médecin remplaçant" : "établissement"} est prêt.
              </p>
              <p className="text-sm text-gray-400 mb-6">Redirection en cours...</p>
              <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl"
      >
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
          {/* Gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="flex w-full flex-col lg:flex-row">
            {/* Bouton pour afficher/masquer le panneau gauche sur mobile */}
            {isMobile && !showLeftPanel && (
              <div className="p-4 border-b border-gray-700">
                <button
                  onClick={() => setShowLeftPanel(true)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                  <span>Voir les informations</span>
                </button>
              </div>
            )}

            {/* Left Side - Image et description */}
            <AnimatePresence>
              {showLeftPanel && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${isMobile ? 'fixed inset-0 z-50 bg-gray-900' : 'lg:w-4/6'} p-6 lg:p-8 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900 border-r border-gray-700`}
                >
                  {/* Bouton de fermeture sur mobile */}
                  {isMobile && (
                    <button
                      onClick={() => setShowLeftPanel(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  
                  <div className="h-full flex flex-col">
                    {/* Logo et titre */}
                    <div className="mt-0">
                      <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <img 
                            src="/logo.png" 
                            alt="DoctoNest" 
                            className="w-10 h-10 rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyNCIgZmlsbD0idXJsKCNwYWludDBfYW5ndWxhcl8xXzExMjMpIi8+PHBhdGggZD0iTTE2LjUgMzEuNUwxOC41IDI4LjVMMjEuNSAzMS41TDI2LjUgMjQuNUwyOS41IDI3LjVMMzIuNSAyMi41IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9hbmd1bGFyXzFfMTEyMyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDI0IDAgMCAyNCAyNCAyNCIpIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjNjA3QUQxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSI4QzVDRTUiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
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
                        Rejoignez la communauté médicale
                      </p>
                    </div>

                    {/* Image plus petite */}
                    <div className="flex flex-col justify-center">
                      <div className="relative mb-6 mt-5">
                        <img
                          src="/logo-login.png"
                          alt="Inscription DoctoNest"
                          className="w-full rounded-xl max-h-[220px] object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFlMWUyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2Mzc3ZGYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+RG9jdG9OZXN0PC90ZXh0Pjwvc3ZnPg=="
                          }}
                        />
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                            {userType === "replacement" ? "Médecin remplaçant" : "Établissement recruteur"}
                          </div>
                        </div>
                      </div>

                      {/* Texte descriptif */}
                      <div className="text-center mb-8">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {userType === "replacement" 
                            ? "Rejoignez notre plateforme pour trouver des missions de remplacement adaptées à votre profil médical."
                            : "Trouvez les meilleurs médecins remplaçants pour assurer la continuité des soins dans votre établissement."
                          }
                        </p>
                      </div>

                      {/* Features list adaptée au type d'utilisateur */}
                      <div className="grid grid-cols-2 gap-3">
                        {(userType === "replacement" ? replacementFeatures : employerFeatures).map((feature, index) => (
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
                    
                    {/* Bouton pour retourner au formulaire sur mobile */}
                    {isMobile && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowLeftPanel(false)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Continuer l'inscription
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Side - Formulaire d'inscription */}
            <div className={`${showLeftPanel && isMobile ? 'hidden' : 'lg:w-5/6'} w-full p-6 lg:p-8`}>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Créer votre compte
                    </h2>
                    <p className="text-gray-400">
                      Choisissez votre profil pour commencer
                    </p>
                  </div>
                  {/* Bouton pour voir les informations sur mobile */}
                  {isMobile && (
                    <button
                      onClick={() => setShowLeftPanel(true)}
                      className="lg:hidden text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                      <span>Infos</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs pour choisir le type de compte */}
              <Tabs 
                value={userType} 
                onValueChange={(value: string) => setUserType(value as 'replacement' | 'employer')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 h-full w-full mb-8 bg-gray-900/50 p-1 rounded-xl border border-gray-700">
                  <TabsTrigger
                    value="replacement"
                    className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-800/50 data-[state=inactive]:border data-[state=inactive]:border-gray-600 rounded-lg py-3 transition-all hover:text-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 7.292M15 12h6m-3-3v6m-6 9a9 9 0 100-18 9 9 0 000 18z" />
                      </svg>
                      <span>Médecin</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="employer"
                    className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-800/50 data-[state=inactive]:border data-[state=inactive]:border-gray-600 rounded-lg py-3 transition-all hover:text-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m3-9a4 4 0 118 0 4 4 0 01-8 0z" />
                      </svg>
                      <span>Recruteur</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="replacement" className="mt-0">
                  <ReplacementRegisterForm 
                    formData={formData}
                    setFormData={setFormData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                </TabsContent>

                <TabsContent value="employer" className="mt-0">
                  <EmployerRegisterForm
                    formData={formData}
                    setFormData={setFormData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    companyTypes={companyTypes}
                  />
                </TabsContent>
              </Tabs>

              {/* Lien de connexion */}
              <div className="text-center pt-6 border-t border-gray-700 mt-8">
                <p className="text-gray-400 text-sm">
                  Déjà inscrit ?{" "}
                  <Link
                    href="/login"
                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-3">
                  En créant un compte, vous acceptez nos{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Conditions d'utilisation
                  </Link>{" "}
                  et notre{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    Politique de confidentialité
                  </Link>
                </p>
              </div>
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
  );
}