import type { MetadataRoute } from "next"
import { db } from "@/lib/database"

const baseUrl = "https://www.doctonest.com"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/annonces` },
  ]

  let missionRoutes: MetadataRoute.Sitemap = []
  try {
    const missions = await db.listMissions({}, { visibility: "public" })
    missionRoutes = missions
      .filter((m: any) => m.id)
      .map((m: any) => ({
        url: `${baseUrl}/annonces/${encodeURIComponent(String(m.id))}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : m.created_at ? new Date(m.created_at) : undefined,
      }))
  } catch (err) {
    console.error("sitemap: failed to fetch public missions", err)
  }

  return [...staticRoutes, ...missionRoutes]
}