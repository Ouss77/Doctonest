import { redirect } from "next/navigation"

export default function ReplacementLegacyPage() {
  redirect("/dashboard/replacement/feed")
}
