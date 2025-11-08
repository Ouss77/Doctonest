
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
  return (
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Le Foyer Médical" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-2xl text-white">Le Foyer Médical</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/#features" className="text-blue-100 text-base font-medium hover:text-white transition">Fonctionnalités</Link>
            <Link href="/#how-it-works" className="text-blue-100 text-base font-medium hover:text-white transition">Comment ça marche</Link>
            <Link href="/annonces" className="text-white text-base font-medium border-b-2 border-white">Annonces</Link>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/annonces/new" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-sm">
              Déposer une annonce
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700">S'inscrire</Button>
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/20" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
          {mobileOpen && (
            <div className="md:hidden bg-white shadow-lg border-t absolute top-full left-0 w-full z-50">
              <nav className="flex flex-col items-start gap-4 p-4">
                <Link href="/#features" className="text-gray-600 text-base font-medium hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Fonctionnalités</Link>
                <Link href="/#how-it-works" className="text-gray-600 text-base font-medium hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Comment ça marche</Link>
                <Link href="/annonces" className="text-blue-600 text-base font-medium" onClick={() => setMobileOpen(false)}>Annonces</Link>
                <hr className="w-full border-gray-200 my-2" />
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="text-gray-600">Connexion</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-blue-600 text-white">S'inscrire</Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>  )
}

export default Header