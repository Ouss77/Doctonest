import Link from "next/link";
import { Button } from "@/components/ui/button";

function Headerannonces() {
  return (
    <div className="relative w-full">
      {/* BACKGROUND */}
      <div
        className="relative w-full min-h-[420px] sm:min-h-[480px] md:min-h-[540px] bg-cover bg-center"
        style={{ backgroundImage: "url('/annonces.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#071d45]/30 via-[#071d45]/40 to-[#071d45]/70" />

        {/* HEADER NAV */}
        <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-4">
          <div className="flex items-center justify-between gap-4 bg-[#071d45]/60 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-6 py-3 shadow-xl">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="DoctoNest"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md"
              />
              <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-300 transition">
              DoctoNest
              </span>
            </Link>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10 hover:border-white/50 rounded-xl px-4"
                >
                  Connexion
                </Button>
              </Link>

              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 shadow-md">
                  S’inscrire
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-24">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-600/20 text-blue-200 text-sm font-medium">
              🇲🇦 Opportunités médicales au Maroc
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Annonces Médicales <br className="hidden sm:block" />
              pour construire votre avenir
            </h1>

            <p className="mt-4 text-base sm:text-lg text-blue-200 max-w-xl">
              Trouvez des missions, emplois et collaborations médicales
              partout au Royaume, en toute simplicité.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4 mb-5">
              <Link href="/annonces/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 rounded-xl font-semibold shadow-lg">
                  Publier une annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Headerannonces;
