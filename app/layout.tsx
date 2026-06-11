import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.doctonest.com"),
  title: {
    default: "DoctoNest - Médecin Remplaçant au Maroc | Remplacement Médical",
    template: "%s | DoctoNest Maroc",
  },
  description:
    "DoctoNest connecte les médecins remplaçants et les établissements de santé au Maroc. Trouvez votre médecin remplaçant ou votre mission médicale à Casablanca, Rabat, Marrakech, Fès, Tanger et partout au Maroc.",
  keywords: [
    "médecin remplaçant Maroc",
    "remplacement médical Maroc",
    "médecin remplaçant",
    "remplacement médecin Maroc",
    "offre remplacement médical",
    "mission médicale Maroc",
    "médecin Maroc",
    "DoctoNest",
    "cabinet médical Maroc",
    "remplaçant médecin généraliste Maroc",
    "remplacement dentiste Maroc",
    "remplacement kinésithérapeute Maroc",
    "annonce remplacement médical",
    "médecin remplaçant Casablanca",
    "médecin remplaçant Rabat",
  ],
  authors: [{ name: "DoctoNest" }],
  creator: "DoctoNest",
  publisher: "DoctoNest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://www.doctonest.com",
    siteName: "DoctoNest",
    title: "DoctoNest - Médecin Remplaçant au Maroc",
    description:
      "La plateforme de référence pour les remplacements médicaux au Maroc. Connectez-vous avec des médecins remplaçants qualifiés.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DoctoNest - Remplacement médical au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DoctoNest - Médecin Remplaçant au Maroc",
    description:
      "La plateforme de référence pour les remplacements médicaux au Maroc.",
    images: ["/og-image.png"],
    creator: "@doctonest",
  },
  alternates: {
    canonical: "https://www.doctonest.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${merriweather.variable} antialiased`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
