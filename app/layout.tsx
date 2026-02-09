import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

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
  
  title: "Doctonest - Plateforme de mise en relation entre établissements de santé et médecins remplaçants",
  description:
    "Connectez établissements de santé et médecins remplaçants grâce à notre système de matching intelligent.",
  generator: "v0.dev",
}

import Head from "next/head"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${merriweather.variable} antialiased`}>
      <Head>
        <title>Doctonest - Plateforme de mise en relation entre établissements de santé et médecins remplaçants</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="logo.png" type="image/png" />
      </Head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
