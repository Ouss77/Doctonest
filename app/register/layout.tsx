import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte professionnel DoctoNest — médecin remplaçant ou établissement recruteur.",
  alternates: {
    canonical: "https://www.doctonest.com/register",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
