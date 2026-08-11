import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { missionsService } from "@/lib/services/missions"
import AnnouncementDetailClient, { type AnnouncementDetail } from "./AnnouncementDetailClient"

export const revalidate = 60

function toDetail(m: any): AnnouncementDetail {
  return {
    id: String(m.id),
    title: m.title ?? "",
    specialty: m.specialty_required ?? "",
    location: m.location ?? "",
    type: m.mission_type ?? "offer",
    description: m.description ?? "",
    posted_date: m.created_at ? new Date(m.created_at).toISOString() : "",
    urgency: m.is_urgent ? "high" : "",
    start_date: m.start_date ? new Date(m.start_date).toISOString() : undefined,
    end_date: m.end_date ? new Date(m.end_date).toISOString() : undefined,
    organization_name: m.organization_name || undefined,
    first_name: m.first_name || undefined,
    last_name: m.last_name || undefined,
    phone: m.phone ?? "",
    hide_contact: typeof m.hide_contact === "boolean" ? m.hide_contact : Boolean(m.phone),
  }
}

export async function generateMetadata({ params }: { params: { titre: string } }): Promise<Metadata> {
  const mission = await missionsService.getPublicById(params.titre)
  if (!mission) {
    return { robots: { index: false, follow: true } }
  }

  const title = mission.title ?? "Annonce de remplacement médical"
  const description = (mission.description ?? "").slice(0, 160) ||
    "Annonce de remplacement médical au Maroc sur DoctoNest."
  const url = `https://www.doctonest.com/annonces/${encodeURIComponent(params.titre)}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
    },
  }
}

export default async function AnnouncementDetailPage({ params }: { params: { titre: string } }) {
  const mission = await missionsService.getPublicById(params.titre)
  if (!mission) {
    notFound()
  }

  return <AnnouncementDetailClient announcement={toDetail(mission)} />
}
