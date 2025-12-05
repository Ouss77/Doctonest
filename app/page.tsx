'use client'; // Important! Forces client-side rendering

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; // remove useRef import
import Link from "next/link";
import {
  Menu,
  X,
  Stethoscope,
  ArrowRight,
  UserPlus,
  UploadCloud,
  MailCheck,
  FilePenLine, 
  FileSearch,
  Handshake,

} from "lucide-react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/lefoyermedical' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lefoyermedical' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/lefoyermedical' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/lefoyermedical' },
  ];

export default function HomePage() {
  // Use useEffect to clear auth data only once on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('mock-auth');
      // Clear auth-token cookie
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, []); // Empty dependency array ensures this runs only once

  const [mobileOpen, setMobileOpen] = useState(false);

  // NEW: header scrolled state
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    // initialize
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
        <header
          className={`fixed top-0 left-0 w-full z-50 pointer-events-auto flex items-center justify-between px-10 transition-all duration-300 ${scrolled ? 'py-4 bg-gray-900/95 backdrop-blur-md shadow-lg' : 'py-8 bg-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <img src="logo.png" alt="Logo Le Foyer Médical" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-xl text-white">Le Foyer Médical</span>
          </div>
          <nav className="hidden md:flex gap-10">
            <Link href="#features" className="text-white text-base font-medium hover:text-blue-200 transition">Fonctionnalités</Link>
            <Link href="#how-it-works" className="text-white text-base font-medium hover:text-blue-200 transition">Comment ça marche</Link>
            <Link href="/annonces" className="text-white text-base font-medium hover:text-blue-200 transition">Annonces</Link>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {/* Replace inline form trigger with a persistent link to the dedicated page */}
            <Link href="/annonces/new" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-sm">
              Déposer une annonce
            </Link>

            <Link href="/login">
              <Button variant="ghost" className="text-white px-6 py-2 rounded-xl font-semibold">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold shadow-lg">S'inscrire</Button>
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
          {mobileOpen && (
            <div className="md:hidden bg-gray-900/95 shadow-md border-t absolute top-full left-0 w-full">
              <nav className="flex flex-col items-start gap-4 p-4">
                <Link href="#features" className="text-white text-base font-medium hover:text-blue-200 transition" onClick={() => setMobileOpen(false)}>Fonctionnalités</Link>
                <Link href="#how-it-works" className="text-white text-base font-medium hover:text-blue-200 transition" onClick={() => setMobileOpen(false)}>Comment ça marche</Link>
                <Link href="/annonces" className="text-white text-base font-medium hover:text-blue-200 transition" onClick={() => setMobileOpen(false)}>Annonces</Link>
                <hr className="w-full border-gray-700 my-2" />
                <Link href="/annonces/new" onClick={() => setMobileOpen(false)} className="w-full">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg">Publier une mission</button>
                </Link>
              </nav>
            </div>
          )}
        </header>

      <main>
        {/* Hero Section - New Design */}
 <section className="relative h-screen sm:h-[700px] flex items-center justify-center overflow-hidden bg-gray-900 py-16">
      {/* Background Image and Overlay (Z-Index remains the same) */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ backgroundImage: 'url(/herofoyer.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} 
      />
      <div className="absolute inset-0 w-full h-full bg-gray-900/60 z-10" />
      
      {/* Content Container */}
      {/* Updated: reduced the fixed gap-40. Changed to p-4 sm:p-10 for better padding on small devices. */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 sm:p-10 md:gap-20">
        
        {/* Left: Headline and CTA buttons */}
        {/* Updated: Added text-center on mobile, changed to items-center on mobile, removed flex-1 from mobile view to allow full width. */}
        <div className="flex w-full flex-col justify-center items-center md:items-start text-center md:text-left gap-8 md:gap-10 mt-10 md:mt-0">
          <h1
            // Updated: text-4xl on mobile, text-6xl on md screens. Changed mb-6 to mb-2 for smaller screens.
            className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2 md:mb-6 drop-shadow-lg tracking-tight"
            style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif', letterSpacing: '-0.03em' }}
          >
            Simplifier les remplacements<br /> garantir les soins.
          </h1>
          
          {/* CTA Buttons Container */}
          {/* Updated: Changed w-full and max-w-sm on mobile for better flow. Added mx-auto for center alignment on mobile. */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-sm sm:max-w-lg mt-2 mx-auto md:mx-0">
            {/* Button 1 */}
            <Link href="/register?type=replacement" passHref legacyBehavior>
              <a className="w-full">
                {/* Updated: text-lg on mobile, text-2xl on larger screens. Reduced py/px for smaller buttons on mobile. */}
                <button
                  className="w-full text-lg sm:text-2xl py-4 sm:py-6 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all duration-200"
                  style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif' }}
                >
                  Vous cherchez une mission ?
                </button>
              </a>
            </Link>
            
            {/* Button 2 */}
            <Link href="/register?type=employer" passHref legacyBehavior>
              <a className="w-full">
                {/* Updated: text-lg on mobile, text-2xl on larger screens. Reduced py/px for smaller buttons on mobile. */}
                <button
                  className="w-full text-lg sm:text-2xl py-4 sm:py-6 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold bg-purple-600 text-white shadow-xl hover:bg-purple-700 transition-all duration-200"
                  style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif' }}
                >
                  Vous cherchez un médecin ?
                </button>
              </a>
            </Link>
          </div>
        </div>
        
        {/* Right: Floating card */}
        {/* Key change: Card is hidden on small screens and reappears on medium (md) screens, 
            positioned to the right without the fixed ml-72 mt-32.
            If you want it visible on mobile, remove 'hidden' and adjust the positioning. */}
        <div className="hidden md:flex justify-center items-center md:pt-16 md:mt-0">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-6 w-[340px] max-w-full">
            <div className="mb-4 flex items-center gap-2">
              {/* NOTE: Replace Stethoscope with an actual icon component */}
              <div className="bg-blue-100 rounded-lg p-2">{/* <Stethoscope className="w-6 h-6 text-blue-600" /> */}</div>
              <span className="font-semibold text-gray-700">Médecin Disponible</span>
              <span className="ml-auto text-gray-400">...</span>
            </div>
            <div className="mb-3 p-3 rounded-xl bg-white shadow flex flex-col gap-1">
              <div className="font-bold text-gray-800">Medecin généraliste</div>
              <div className="text-blue-600 text-sm">TAZA</div>
                            <div className="text-gray-400 text-xs">Disponible Weekend</div>

            </div>
            <div className="mb-3 p-3 rounded-xl bg-white shadow flex flex-col gap-1">
              <div className="font-bold text-gray-800">Cardiologue</div>
              <div className="text-blue-600 text-sm">Rabat</div>
              <div className="text-gray-400 text-xs">Temps plein</div>

            </div>
            <div className="mb-3 p-3 rounded-xl bg-white shadow flex flex-col gap-1">
              <div className="font-bold text-gray-800">Pediatre</div>
              <div className="text-blue-600 text-sm">Fata, Ile de l'rance</div>
              <div className="text-gray-400 text-xs">Temps partiel</div>
            </div>
          </div>
        </div>
        
      </div>
    </section>

        {/* Professionnels de santé Section - Adapted for dark mode */}
        <section id="features" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-4">Tous les professionnels de santé</h2>
            <p className="text-lg text-center text-gray-300 mb-12">Notre plateforme couvre tous les domaines de la santé pour répondre à vos besoins</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="bg-gray-800 rounded-2xl shadow-sm p-8 flex flex-col items-center">
                <div className="bg-blue-600 rounded-2xl shadow-sm p-8 flex flex-col items-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h8" /><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 12h.01" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Médecins Généralistes</h3>
                <p className="text-gray-300 text-center">Trouvez des médecins qualifiés pour remplacer votre cabinet médical</p>
              </div>
              {/* Card 2 */}
              <div className="bg-gray-800 rounded-2xl shadow-sm p-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 bg-blue-600">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 7 16.5 7 12.5C7 9.5 9.5 7 12 7C14.5 7 17 9.5 17 12.5C17 16.5 12 21 12 21Z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Kinésithérapeutes</h3>
                <p className="text-gray-300 text-center">Connectez-vous avec des kinés expérimentés pour vos remplacements</p>
              </div>
              {/* Card 3 */}
              <div className="bg-gray-800 rounded-2xl shadow-sm p-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 bg-blue-600">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M8 16c1.333-1.333 2.667-1.333 4 0" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Dentistes</h3>
                <p className="text-gray-300 text-center">Remplacez vos cabinets dentaires avec des professionnels de confiance</p>
              </div>
              {/* Card 4 */}
              <div className="bg-gray-800 rounded-2xl shadow-sm p-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 bg-blue-600">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M7 7h10" /><path d="M7 13h10" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Cliniques</h3>
                <p className="text-gray-300 text-center">Solutions de remplacement pour cliniques et centres médicaux</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 md:py-10 bg-gray-900">
          <div className="container mx-auto px-6 lg:px-12">
            {/* En-tête de la section */}
            <div className="text-center mb-16 md:mb-20">
              <Badge className="mb-4 bg-purple-100 text-purple-700 border-0">
                Processus
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Un processus simple et efficace pour tous
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-24">
              
              {/* === Carte pour les Remplaçants === */}
              <div className="relative">
                {/* Le Titre qui chevauche */}
                <h3 className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-xl font-serif font-bold bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg border border-gray-200">
                  Pour les Remplaçants
                </h3>
                
                {/* Conteneur de la carte avec l'image de fond */}
                <div className="relative flex flex-col rounded-2xl bg-cover bg-center overflow-hidden h-full p-8 md:p-12 pt-20" style={{ backgroundImage: 'url(/rep.png)' }}>
                  {/* Superposition de dégradé pour la lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0"></div>
                  
                  <div className="relative z-10 w-full space-y-8">
                    {/* Ligne de connexion verticale */}
                    <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-white/20" aria-hidden="true" />

                    {[
                      {
                        icon: <UserPlus className="w-6 h-6 text-blue-400" />,
                        title: "Créez votre profil",
                        desc: "Renseignez vos spécialités, disponibilités et tarifs en quelques minutes.",
                      },
                      {
                        icon: <UploadCloud className="w-6 h-6 text-blue-400" />,
                        title: "Uploadez vos documents",
                        desc: "RPPS, diplômes et certifications pour validation rapide et sécurisée.",
                      },
                      {
                        icon: <MailCheck className="w-6 h-6 text-blue-400" />,
                        title: "Recevez des propositions",
                        desc: "Acceptez ou refusez les missions qui correspondent à vos critères.",
                      },
                    ].map((item, index) => (
                      <div key={index} className="relative flex gap-5 items-start top-10">
                        <div className="relative z-10 w-12 h-12 bg-gray-800/50 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-grow">
                          <h4 className="font-bold text-white mb-1 text-lg">{item.title}</h4>
                          <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* === Carte pour les Établissements === */}
              <div className="relative">
                {/* Le Titre qui chevauche */}
                <h3 className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-xl font-serif font-bold bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg border border-gray-200">
                  Pour les Établissements
                </h3>

                {/* Conteneur de la carte avec l'image de fond */}
                <div className="relative flex flex-col rounded-2xl bg-cover bg-center overflow-hidden h-full p-8 md:p-12 pt-20" style={{ backgroundImage: 'url(/emp.png)' }}>
                  {/* Superposition de dégradé pour la lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0"></div>

                  <div className="relative z-10 w-full space-y-8">
                    {/* Ligne de connexion verticale */}
                    <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-white/20" aria-hidden="true" />

                    {[
                      {
                        icon: <FilePenLine className="w-6 h-6 text-green-400" />,
                        title: "Publiez votre mission",
                        desc: "Spécialité, dates, tarif et localisation en quelques clics.",
                      },
                      {
                        icon: <FileSearch className="w-6 h-6 text-green-400" />,
                        title: "Consultez les profils",
                        desc: "Parcourez les médecins correspondant parfaitement à vos critères.",
                      },
                      {
                        icon: <Handshake className="w-6 h-6 text-green-400" />,
                        title: "Trouvez votre remplaçant",
                        desc: "Envoyez des propositions et gérez vos contrats facilement.",
                      },
                    ].map((item, index) => (
                      <div key={index} className="relative flex gap-5 items-start top-10">
                        <div className="relative z-10 w-12 h-12 bg-gray-800/50 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-grow">
                          <h4 className="font-bold text-white mb-1 text-lg">{item.title}</h4>
                          <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold mb-6">Prêt à simplifier vos remplacements ?</h2>
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Rejoignez des milliers de professionnels qui font confiance à Le Foyer Médical pour leurs remplacements.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
                >
                  Commencer gratuitement <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- REMOVE inline "Déposer une annonce" form section --- */}
        {/* ...existing content continues... */}
      </main>

      {/* Footer */}
  <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        
        {/* === Section principale du footer === */} 
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16">
          
          {/* Col 1: Marque et Slogan */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo Le Foyer Médical" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-bold text-white tracking-wide">
                Le Foyer Médical
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              La plateforme de référence pour simplifier les remplacements médicaux au Maroc. Connecter les talents, assurer la continuité des soins.
            </p>
          </div>
          
          {/* Col 2: Contact */}
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

          {/* Col 3: Réseaux Sociaux */}
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
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* === Barre de copyright inférieure === */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Le Foyer Médical. Tous droits réservés.
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