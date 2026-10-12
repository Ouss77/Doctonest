import { BadgeCheck } from "lucide-react"

export default function VerifiedProfileBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 ${className}`}
      title="Ce profil a été vérifié par l'administration DoctoNest"
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      Profil vérifié
    </span>
  )
}
