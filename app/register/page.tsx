"use client";

import type React from "react";
import { useState, useEffect } from "react";
import EmployerRegisterForm from "./EmployerRegisterForm";
import ReplacementRegisterForm from "./ReplacementRegisterForm";
import {  CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {  CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"replacement" | "employer">("replacement");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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
    specialty: "", // Added specialty field
  });
  const router = useRouter();

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

    // Validation for medical specialty
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
          specialty: formData.specialty, // Include specialty in API call
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-900">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-sm w-full text-center shadow-lg animate-in zoom-in-95 duration-300 border border-gray-700">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Inscription réussie !</h3>
            <p className="text-gray-300 mb-4">
              Votre compte {userType === "replacement" ? "médecin remplaçant" : "établissement"} est prêt.
            </p>
            <p className="text-sm text-gray-500">Redirection en cours...</p>
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Left side: Logo Section - Dark Hero Style */}
      <div className="hidden lg:w-3/6 h-lvh md:flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-10">
        <h2 className="text-4xl font-extrabold mb-4 text-center drop-shadow-lg">
          Bienvenue sur Le Foyer Médical
        </h2>
        <img
          src="/register.png"
          alt="Connexion illustration"
          className="mb-6 drop-shadow-2xl rounded-2xl w-full max-w-lg mx-auto"
        />

      </div>

      {/* Right side: Registration Form - Modern Card */}
      <div className="lg:w-3/6 w-full mx-auto flex flex-col p-0 mt-4 ">
        <CardContent className="p-0 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto ">
          <Tabs value={userType} onValueChange={(value: string) => setUserType(value as 'replacement' | 'employer')}>
            {/* Mobile-optimized: Grid layout for small screens, horizontal for larger */}
            <TabsList className="grid grid-cols-2 md:flex md:flex-row w-full mx-auto gap-2.5 md:gap-4 lg:gap-6 mb-4 md:mb-6 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="replacement"
                className="group relative flex flex-col items-center justify-center gap-2 md:flex-row md:gap-3 
                  w-full h-[110px] md:h-auto md:min-h-[70px]
                  py-3.5 px-3 md:py-5 md:px-5 lg:py-6 lg:px-8 
                  text-[18px] leading-tight md:text-base lg:text-lg font-semibold 
                  rounded-xl md:rounded-xl lg:rounded-2xl 
                  border-2 md:border
                  transition-all duration-300 ease-in-out
                  data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-purple-700
                  data-[state=active]:text-white data-[state=active]:border-blue-400 data-[state=active]:shadow-2xl 
                  data-[state=active]:shadow-blue-500/30 data-[state=active]:scale-[0.97] md:data-[state=active]:scale-105
                  data-[state=inactive]:bg-gray-800/60 data-[state=inactive]:text-blue-300/80 data-[state=inactive]:border-blue-600/40
                  hover:data-[state=inactive]:bg-gray-700/70 hover:data-[state=inactive]:border-blue-500/60 hover:data-[state=inactive]:text-blue-200
                  active:scale-[0.94] md:active:scale-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                  touch-manipulation"
              >
                {/* Icon with animation */}
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className="w-7 h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 flex-shrink-0 transition-all duration-300
                    data-[state=active]:scale-110 data-[state=active]:rotate-3" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 7.292M15 12h6m-3-3v6m-6 9a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
                {/* Text optimized for mobile */}
                <span className="text-center font-medium md:font-semibold">
                  <span className="block md:inline">Médecin</span>
                  <span className="block md:inline md:ml-1">remplaçant</span>
                </span>
                {/* Active badge indicator */}
                {userType === "replacement" && (
                  <div className="absolute -top-1 -right-1 md:hidden w-3 h-3 rounded-full bg-blue-400 border-2 border-gray-900 animate-pulse"></div>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="employer"
                className="group relative flex flex-col items-center justify-center gap-2 md:flex-row md:gap-3 
                  w-full h-[110px] md:h-auto md:min-h-[70px]
                  py-3.5 px-3 md:py-5 md:px-5 lg:py-6 lg:px-8 
                  text-[18px] leading-tight md:text-base lg:text-lg font-semibold 
                  rounded-xl md:rounded-xl lg:rounded-2xl 
                  border-2 md:border
                  transition-all duration-300 ease-in-out
                  data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-purple-700
                  data-[state=active]:text-white data-[state=active]:border-blue-400 data-[state=active]:shadow-2xl 
                  data-[state=active]:shadow-blue-500/30 data-[state=active]:scale-[0.97] md:data-[state=active]:scale-105
                  data-[state=inactive]:bg-gray-800/60 data-[state=inactive]:text-blue-300/80 data-[state=inactive]:border-blue-600/40
                  hover:data-[state=inactive]:bg-gray-700/70 hover:data-[state=inactive]:border-blue-500/60 hover:data-[state=inactive]:text-blue-200
                  active:scale-[0.94] md:active:scale-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                  touch-manipulation"
              >
                {/* Icon with animation */}
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className="w-7 h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 flex-shrink-0 transition-all duration-300
                    data-[state=active]:scale-110 data-[state=active]:rotate-3" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m3-9a4 4 0 118 0 4 4 0 01-8 0z" />
                </svg>
                {/* Text */}
                <span className="text-center font-medium md:font-semibold">Recruteur</span>
                {/* Active badge indicator */}
                {userType === "employer" && (
                  <div className="absolute -top-1 -right-1 md:hidden w-3 h-3 rounded-full bg-blue-400 border-2 border-gray-900 animate-pulse"></div>
                )}
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
              <div className="text-center mt-0">
                <p className="text-base text-gray-400">
                  Déjà inscrit ?{" "}
                  <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                    Se connecter
                  </Link>
                </p>
              </div>
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
              <div className="text-center !mt-0">
                <p className="text-base text-gray-400">
                  Déjà inscrit ?{" "}
                  <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                    Se connecter
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </div>
    </div>
  );
}
