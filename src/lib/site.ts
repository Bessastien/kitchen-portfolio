export type Locale = "fr" | "en";

export const labels = {
  fr: {
    home: "Accueil", creations: "Créations", journey: "Parcours", contact: "Contact",
    menu: "Menu", discover: "Découvrir les créations", allCreations: "Toutes les créations",
    featured: "Sélection du moment", work: "Desserts de restaurant & pâtisserie",
    origin: { campus120: "Campus 120", "cheval-blanc": "Cheval Blanc", personal: "Création personnelle", other: "Autre expérience" },
  },
  en: {
    home: "Home", creations: "Creations", journey: "Journey", contact: "Contact",
    menu: "Menu", discover: "Explore creations", allCreations: "All creations",
    featured: "Selected work", work: "Restaurant desserts & patisserie",
    origin: { campus120: "Campus 120", "cheval-blanc": "Cheval Blanc", personal: "Personal creation", other: "Other experience" },
  },
} as const;

export function href(locale: Locale, path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized === "/" ? "/" : normalized}` : normalized;
}

export function projectTitle(project: { data: { title: string; titleEn?: string } }, locale: Locale) {
  return locale === "en" ? project.data.titleEn || project.data.title : project.data.title;
}
