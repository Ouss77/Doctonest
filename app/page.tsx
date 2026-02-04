'use client';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, Search, MessageSquare } from 'lucide-react';

import { Menu, X, ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram,  Stethoscope, Heart, Pill, Syringe, Activity, Users
} from "lucide-react";

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/lefoyermedical' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lefoyermedical' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/lefoyermedical' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/lefoyermedical' },
];

const steps = [
  {
    title: "Créez votre profil",
    description: "Inscrivez-vous en quelques clics et renseignez votre spécialité et vos disponibilités.",
    icon: <UserPlus className="w-8 h-8 text-blue-400" />,
    stepNumber: "01"
  },
  {
    title: "Publiez ou Recherchez",
    description: "Déposez une annonce de remplacement ou parcourez les offres disponibles dans votre région.",
    icon: <Search className="w-8 h-8 text-purple-400" />,
    stepNumber: "02"
  },
  {
    title: "Connectez-vous",
    description: "Échangez directement via notre messagerie sécurisée et validez votre remplacement en toute confiance.",
    icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
    stepNumber: "03"
  }
];

// Enhanced professionals data with better icons and colors
const professionals = [
  {
    title: "Médecins Généralistes",
    description: "Trouvez des médecins qualifiés pour remplacer votre cabinet médical",
    icon: Stethoscope,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBorder: "group-hover:border-blue-500/50"
  },
  {
    title: "Kinésithérapeutes",
    description: "Connectez-vous avec des kinés expérimentés pour vos remplacements",
    icon: Activity,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverBorder: "group-hover:border-purple-500/50"
  },
  {
    title: "Dentistes",
    description: "Remplacez vos cabinets dentaires avec des professionnels de confiance",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    hoverBorder: "group-hover:border-emerald-500/50"
  },
  {
    title: "Infirmiers",
    description: "Solutions de remplacement pour infirmiers et centres médicaux",
    icon: Syringe,
    gradient: "from-rose-500 to-orange-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    hoverBorder: "group-hover:border-rose-500/50"
  },
  {
    title: "Pharmaciens",
    description: "Trouvez des pharmaciens qualifiés pour vos remplacements temporaires",
    icon: Pill,
    gradient: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    hoverBorder: "group-hover:border-amber-500/50"
  },
  {
    title: "Aides-Soignants",
    description: "Connectez avec des aides-soignants dévoués pour assurer la continuité des soins",
    icon: Users,
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    hoverBorder: "group-hover:border-indigo-500/50"
  }
];

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock-auth');
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 pointer-events-auto flex items-center justify-between px-10 transition-all duration-300 ${
          scrolled ? 'py-4 bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-800' : 'py-8 bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <img src="logo.png" alt="Logo DoctoNest" className="w-10 h-10 rounded-full ring-2 ring-blue-500/20" />
          <span className="font-bold text-xl text-white">DoctoNest</span>
        </div>
        <nav className="hidden md:flex gap-10">
          <Link href="#features" className="text-gray-300 text-base font-medium hover:text-blue-400 transition">Fonctionnalités</Link>
          <Link href="/annonces" className="text-gray-300 text-base font-medium hover:text-blue-400 transition">Annonces</Link>
          <Link href='/#how-it-works' className="text-gray-300 text-base font-medium hover:text-blue-400 transition">Comment ça marche ?</Link>  
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/annonces/new" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all">
            Déposer une annonce
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white px-6 py-2 rounded-xl font-semibold hover:bg-slate-800">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-slate-950 px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-gray-100">S'inscrire</Button>
          </Link>
          
        </div>
        <button className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
        {mobileOpen && (
          <div className="md:hidden bg-slate-950/95 shadow-md border-t border-slate-800 absolute top-full left-0 w-full">
            <nav className="flex flex-col items-start gap-4 p-4">
              <Link href="#features" className="text-gray-300 text-base font-medium hover:text-blue-400 transition" onClick={() => setMobileOpen(false)}>Fonctionnalités</Link>
              <Link href="/annonces" className="text-gray-300 text-base font-medium hover:text-blue-400 transition" onClick={() => setMobileOpen(false)}>Annonces</Link>
              <Link href="/#how-it-works" className="text-gray-300 text-base font-medium hover:text-blue-400 transition" onClick={() => setMobileOpen(false)}>Comment ça marche ?</Link>
              <hr className="w-full border-slate-800 my-2" />
              <Link href="/annonces/new" onClick={() => setMobileOpen(false)} className="w-full">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg">Publier une mission</button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen sm:h-[700px] flex items-center justify-center overflow-hidden bg-slate-950 py-16">
          <div 
            className="absolute inset-0 w-full h-full z-0" 
            style={{ backgroundImage: 'url(/bg-doctonest.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} 
          />
          <div className="absolute inset-0 w-full h-full bg-slate-950/60 z-10" />
          
          <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 sm:p-10 md:gap-20">
            <div className="flex w-full flex-col justify-center items-center md:items-start text-center md:text-left gap-8 md:gap-10 mt-10 md:mt-0">
              <h1
                className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-2 md:mb-6 drop-shadow-lg tracking-tight"
                style={{ fontFamily: '', letterSpacing: '-0.01em' }}
              >
                Votre Réseau Médical,<br/> Toujours Connecté.<br />Votre Remplacement, Assuré
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
                <Link href="/register?type=replacement">
                  <button
                    className="text-lg sm:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  >
                    Rejoindre notre réseau
                  </button>
                </Link>
                
                <Link href="/annonces">
                  <button
                    className="text-lg sm:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  >
                    Explorer les opportunités
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Professionnels de santé Section - ENHANCED VERSION */}
        <section id="features" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Tous les professionnels de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  santé
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Notre plateforme couvre tous les domaines de la santé pour répondre à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {professionals.map((prof, index) => {
                const Icon = prof.icon;
                return (
                  <div
                    key={index}
                    className={`group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border ${prof.borderColor} ${prof.hoverBorder} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${prof.bgColor}`}
                  >
                    {/* Icon container with gradient */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${prof.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                      {prof.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {prof.description}
                    </p>

                    {/* Decorative corner gradient */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${prof.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300 rounded-full`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">Prêt à simplifier vos remplacements ?</h2>
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Rejoignez des milliers de professionnels qui font confiance à DoctoNest pour leurs remplacements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300 rounded-xl font-bold"
                >
                  Commencer gratuitement <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced */}
        <section id="how-it-works" className="py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">marche ?</span>
            </h2>
            <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
              Une plateforme simplifiée pour permettre aux professionnels de santé de se concentrer sur l'essentiel : le soin.
            </p>

            <div className="flex flex-col md:flex-row md:justify-center gap-12 md:gap-20">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-blue-500/20 -translate-y-12"></div>

              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 z-10 group-hover:border-blue-500/50 group-hover:bg-gradient-to-br group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300 shadow-xl">
                    {step.icon}
                  </div>
                  
                  <span className="absolute -top-4 right-1/4 md:right-1/3 text-6xl font-black text-white/5 select-none">
                    {step.stepNumber}
                  </span>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 border-t border-slate-800/50 mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo DoctoNest" className="w-12 h-12 rounded-full ring-2 ring-blue-500/20" />
                <span className="text-xl font-bold text-white tracking-wide">
                  DoctoNest
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La plateforme de référence pour simplifier les remplacements médicaux au Maroc. Connecter les talents, assurer la continuité des soins.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Nous Contacter</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <a href="mailto:contact@lefoyermedical.com" className="hover:text-blue-400 transition-colors">
                    contact@lefoyermedical.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>+212 6 00 00 00 00</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>Rabat, Maroc</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              &copy; {new Date().getFullYear()} DoctoNest. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <a href="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</a>
              <a href="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}