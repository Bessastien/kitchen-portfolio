export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectOrigin = "campus120" | "cheval-blanc" | "personal" | "other";

export type AdminProject = {
  id: string;
  title_fr: string;
  title_en: string | null;
  description_fr: string | null;
  description_en: string | null;
  image_alt_fr: string | null;
  image_alt_en: string | null;
  tags: string[];
  main_image_path: string | null;
  main_image_url?: string | null;
  origin: ProjectOrigin | null;
  status: ProjectStatus;
  publication_authorized: boolean;
  published_at: string | null;
};

export const projectSelect = "id,title_fr,title_en,description_fr,description_en,image_alt_fr,image_alt_en,tags,main_image_path,origin,status,publication_authorized,published_at";

export const originLabels: Record<ProjectOrigin, string> = {
  campus120: "Campus 120",
  "cheval-blanc": "Cheval Blanc",
  personal: "Création personnelle",
  other: "Autre",
};

export const demoProjects: AdminProject[] = [
  {
    id: "demo-agrumes",
    title_fr: "Entremets aux agrumes",
    title_en: "Citrus entremets",
    description_fr: "Je travaille ici l’équilibre entre fraîcheur, acidité et douceur.",
    description_en: "I explore the balance between freshness, acidity and sweetness.",
    image_alt_fr: "Entremets aux agrumes dressé sur une assiette",
    image_alt_en: "Citrus entremets plated for service",
    tags: ["agrumes", "entremets"],
    main_image_path: null,
    main_image_url: "/uploads/IMG_1882.jpeg",
    origin: "campus120",
    status: "published",
    publication_authorized: true,
    published_at: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "demo-choux",
    title_fr: "Choux à la crème",
    title_en: "Cream puffs",
    description_fr: "Je recherche une pâte légère et une garniture généreuse.",
    description_en: "I aim for a light choux pastry and a generous filling.",
    image_alt_fr: "Choux à la crème alignés sur un plateau",
    image_alt_en: "Cream puffs arranged on a tray",
    tags: ["choux", "crème"],
    main_image_path: null,
    main_image_url: "/uploads/img_1189.jpeg",
    origin: "personal",
    status: "published",
    publication_authorized: true,
    published_at: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "demo-sureau",
    title_fr: "Entremets au sureau, à la vanille et à la fraise",
    title_en: "Elderflower, vanilla and strawberry entremets",
    description_fr: "Je développe cette création autour de parfums floraux et fruités.",
    description_en: "I am developing this creation around floral and fruity notes.",
    image_alt_fr: "Entremets au sureau, à la vanille et à la fraise",
    image_alt_en: "Elderflower, vanilla and strawberry entremets",
    tags: ["sureau", "vanille", "fraise"],
    main_image_path: null,
    main_image_url: "/uploads/img_3425.jpeg",
    origin: "cheval-blanc",
    status: "draft",
    publication_authorized: false,
    published_at: null,
  },
];
