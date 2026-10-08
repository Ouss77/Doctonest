import type { Metadata } from "next"
import AnnoncesClient, { type Announcement } from "./_components/AnnoncesClient"
import JsonLd from "@/components/JsonLd"
import { db } from "@/lib/database"

export const revalidate = 60

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

export default async function AnnoncesPage() {
  let initialAnnouncements: Announcement[] = []

  try {
    const rows = await db.listMissions({}, { visibility: 'public' })
    initialAnnouncements = rows.map((m: any) => ({
      id: String(m.id),
      title: m.title ?? '',
      specialty: m.specialty_required ?? '',
      location: m.location ?? '',
      type: m.mission_type ?? 'offer',
      description: m.description ?? '',
      posted_date: m.created_at ? new Date(m.created_at).toISOString() : '',
      urgency: m.is_urgent ? 'high' : '',
      authorName:
        m.organization_name ||
        [m.first_name, m.last_name].filter(Boolean).join(' ') ||
        undefined,
      phone: m.phone ?? '',
      hideContact: typeof m.hide_contact === 'boolean' ? m.hide_contact : Boolean(m.phone),
    }))
  } catch (err) {
    console.error('SSR fetch announcements failed:', err)
  }

  return (
    <>
      <JsonLd data={annoncesPageSchema} />
      <AnnoncesClient initialAnnouncements={initialAnnouncements} />
    </>
  )
}
