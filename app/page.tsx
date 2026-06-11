import type { Metadata } from "next"
import HomePageClient from "./_components/HomePageClient"
import JsonLd from "@/components/JsonLd"

export const metadata: Metadata = {
  title: "DoctoNest - Médecin Remplaçant au Maroc | Remplacement Médical",
  description:
    "Trouvez un médecin remplaçant au Maroc ou déposez votre annonce de remplacement médical. DoctoNest connecte les médecins remplaçants et établissements de santé à Casablanca, Rabat, Marrakech, Fès, Tanger et dans toutes les villes du Maroc.",
  alternates: {
    canonical: "https://www.doctonest.com",
  },
  openGraph: {
    title: "DoctoNest - Médecin Remplaçant au Maroc",
    description:
      "Trouvez un médecin remplaçant au Maroc ou déposez votre annonce de remplacement médical.",
    url: "https://www.doctonest.com",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DoctoNest",
  url: "https://www.doctonest.com",
  logo: "https://www.doctonest.com/logo.png",
  description:
    "Plateforme de mise en relation entre médecins remplaçants et établissements de santé au Maroc.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+212699945245",
    contactType: "customer service",
    availableLanguage: ["French", "Arabic"],
    areaServed: "MA",
  },
  sameAs: [
    "https://facebook.com/doctonest",
    "https://twitter.com/doctonest",
    "https://linkedin.com/company/doctonest",
    "https://instagram.com/doctonest",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "MA",
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DoctoNest",
  url: "https://www.doctonest.com",
  description:
    "Plateforme de remplacement médical au Maroc — médecins remplaçants, dentistes, kinésithérapeutes.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.doctonest.com/annonces?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "fr-MA",
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <HomePageClient />
    </>
  )
}
