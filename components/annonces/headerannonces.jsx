
import Link from "next/link"
import { Button } from "@/components/ui/button";
function Headerannonces() {
  return (
    <div>
            {/* HEADER Annonces */}
    <div
      className="relative top-0 w-full bg-cover bg-center min-h-[500px]"
      style={{
        
        backgroundImage: "url('annonces.png')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#071d45]/20 to-[#071d45]/30"></div>
      <header className="relative top-5 z-20 max-w-7xl mx-auto px-10 py-3 mt-0 flex items-center justify-between bg-[#071d45]/40 backdrop-blur-md rounded-xl shadow">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" className="w-10 h-10 rounded-xl" />
          <span className="text-xl font-semibold text-white group-hover:text-blue-200 transition">Le Foyer Médical</span>
        </Link>
        {/* <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-white font-medium hover:text-blue-200 transition">Fonctionnalités</Link>
          <Link href="/blog" className="text-white font-medium hover:text-blue-200 transition">Blog</Link>
        </nav> */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              S’inscrire
            </Button>
          </Link>
        </div>
      </header>
      {/* HERO CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-10 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl leading-tight">
          Annonces Médicales au Maroc :<br />Votre Avenir en Santé
        </h1>
        <p className="text-lg mt-4 text-blue-200 max-w-xl">
          Explorez les opportunités d'emploi et de stages dans tout le Royaume.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/annonces/new">
            <Button className="bg-white text-lg text-gray-900 h-15 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition">
              Publier une demande
            </Button>
          </Link>
          <Link href="/annonces/new">
            <Button className="bg-blue-700 hover:bg-blue-800 text-lg h-15 text-white font-semibold px-6 py-3 rounded-xl transition">
              Publier une Offre
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Headerannonces