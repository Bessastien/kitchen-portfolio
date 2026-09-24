import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type Locale = "fr" | "en";
type FeaturedProject = { id: string; title_fr: string; title_en: string | null; description_fr: string | null; description_en: string | null; main_image_url: string | null; origin: string | null };

const originLabels: Record<Locale, Record<string, string>> = {
  fr: { campus120: "Campus 120", "cheval-blanc": "Cheval Blanc", personal: "Création personnelle", other: "Autre" },
  en: { campus120: "Campus 120", "cheval-blanc": "Cheval Blanc", personal: "Personal creation", other: "Other" },
};

export default function FeaturedShowcase({ locale, fallback }: { locale: Locale; fallback: FeaturedProject[] }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [projects, setProjects] = useState(fallback);
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    if (!client) return;
    Promise.all([
      client.from("homepage_featured").select("position,projects(id,title_fr,title_en,description_fr,description_en,main_image_url,origin)").order("position"),
      client.from("site_sections").select("enabled").eq("id", "featured").maybeSingle(),
    ]).then(([featured, section]) => {
      if (section.data) setEnabled(section.data.enabled);
      if (!featured.error && featured.data?.length) {
        setProjects(featured.data.flatMap((item) => item.projects as FeaturedProject[]).filter(Boolean));
      }
    });
  }, [client]);
  if (!enabled) return null;
  return <section data-home-section="featured" id="selection" className="border-y border-stone-200 bg-[#f4ede2]"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">{locale === "fr" ? "À la une" : "Selected work"}</p><h2 className="mt-2 font-serif text-4xl text-stone-950">{locale === "fr" ? "Mes créations choisies" : "My featured creations"}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">{locale === "fr" ? "Faites glisser la sélection sur téléphone pour découvrir les créations mises en avant." : "Swipe the selection on mobile to discover the work I have chosen to feature."}</p></div><a href={locale === "fr" ? "/projects" : "/en/projects"} className="hidden text-sm font-bold text-amber-900 underline underline-offset-4 sm:block">{locale === "fr" ? "Tout voir" : "View all"}</a></div><div className="featured-rail">{projects.map((project, index) => { const title = locale === "fr" ? project.title_fr : project.title_en || project.title_fr; const description = locale === "fr" ? project.description_fr : project.description_en || project.description_fr; return <a key={project.id} href={locale === "fr" ? "/projects" : "/en/projects"} className={`featured-piece ${index === 0 ? "featured-piece--lead" : ""}`}>{project.main_image_url && <img src={project.main_image_url} alt={title} loading={index === 0 ? "eager" : "lazy"} />}<span className="featured-shade" /><span className="featured-index">{String(index + 1).padStart(2, "0")}</span><span className="featured-content"><span className="featured-meta">{project.origin ? originLabels[locale][project.origin] || project.origin : locale === "fr" ? "Création sélectionnée" : "Selected creation"}</span><strong>{title}</strong>{description && <small>{description}</small>}</span><span className="featured-arrow"><ArrowUpRight className="size-5" /></span></a>; })}</div><div className="mt-6 sm:hidden"><a href={locale === "fr" ? "/projects" : "/en/projects"} className="button-secondary w-full">{locale === "fr" ? "Voir toutes mes créations" : "View all creations"}</a></div></div></section>;
}
