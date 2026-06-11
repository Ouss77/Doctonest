import type { Metadata } from "next"
import AnnoncesClient from "./_components/AnnoncesClient"
import JsonLd from "@/components/JsonLd"

export const metadata: Metadata = {
  title: "Annonces de Remplacement Médical au Maroc",
  description:
    "Consultez toutes les annonces de remplacement médical au Maroc. Offres et demandes de remplacement pour médecins généralistes, dentistes, kinésithérapeutes, infirmiers et autres spécialistes à Casablanca, Rabat, Marrakech et partout au Maroc.",
  keywords: [
    "annonce remplacement médical Maroc",
    "offre remplacement médecin",
    "mission médicale Maroc",
    "remplacement médecin généraliste",
    "remplacement dentiste",
    "remplacement kinésithérapeute",
  ],
  alternates: {
    canonical: "https://www.doctonest.com/annonces",
  },
  openGraph: {
    title: "Annonces de Remplacement Médical au Maroc | DoctoNest",
    description:
      "Consultez toutes les annonces de remplacement médical au Maroc.",
    url: "https://www.doctonest.com/annonces",
  },
}

const annoncesPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Annonces de remplacement médical au Maroc",
  description:
    "Toutes les annonces de remplacement médical au Maroc : offres et demandes pour médecins généralistes, dentistes, kinésithérapeutes, infirmiers et pharmaciens.",
  url: "https://www.doctonest.com/annonces",
  isPartOf: {
    "@type": "WebSite",
    name: "DoctoNest",
    url: "https://www.doctonest.com",
  },
  about: {
    "@type": "MedicalWebPage",
    name: "Remplacement médical au Maroc",
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Clinician",
    },
  },
  inLanguage: "fr-MA",
}

export default function AnnoncesPage() {
  return (
    <>
      <JsonLd data={annoncesPageSchema} />
      <AnnoncesClient />
    </>
  )
}
