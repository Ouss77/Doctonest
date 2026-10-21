export const REPLACEMENT_PROFESSIONS = ["Médecin", "Dentiste"] as const

export type ReplacementProfession = (typeof REPLACEMENT_PROFESSIONS)[number]

export const MEDICAL_SPECIALTIES = [
  "Médecine générale",
  "Allergologie",
  "Anatomie pathologique",
  "Anesthésie-réanimation",
  "Cardiologie",
  "Chirurgie cardiaque",
  "Chirurgie générale",
  "Chirurgie pédiatrique",
  "Chirurgie plastique",
  "Chirurgie thoracique",
  "Dermatologie",
  "Endocrinologie",
  "Gastro-entérologie",
  "Gériatrie",
  "Gynécologie-obstétrique",
  "Hématologie",
  "Infectiologie",
  "Médecine du travail",
  "Médecine interne",
  "Médecine nucléaire",
  "Médecine physique et réadaptation",
  "Médecine vasculaire",
  "Néphrologie",
  "Neurochirurgie",
  "Neurologie",
  "Oncologie",
  "Ophtalmologie",
  "ORL",
  "Orthopédie-traumatologie",
  "Pédiatrie",
  "Pneumologie",
  "Psychiatrie",
  "Radiologie",
  "Rhumatologie",
  "Urgences",
  "Urologie",
]

export const DENTAL_SPECIALTIES = [
  "Omnipratique",
  "Orthodontie",
  "Chirurgie orale",
  "Parodontie",
  "Endodontie",
  "Implantologie",
  "Prothèse dentaire",
  "Dentisterie pédiatrique",
  "Dentisterie esthétique",
  "Odontologie conservatrice",
  "Médecine bucco-dentaire",
]

export function specialtiesForProfession(profession: string) {
  if (profession === "Dentiste") return DENTAL_SPECIALTIES
  if (profession === "Médecin") return MEDICAL_SPECIALTIES
  return []
}

export function defaultSpecialtyForProfession(profession: string) {
  if (profession === "Médecin") return "Médecine générale"
  if (profession === "Dentiste") return "Omnipratique"
  return ""
}
