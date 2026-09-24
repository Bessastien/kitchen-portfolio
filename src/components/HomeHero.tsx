import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type Locale = "fr" | "en";
type HeroSettings = Record<string, string | null>;

export default function HomeHero({ locale, fallback }: { locale: Locale; fallback: HeroSettings }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [settings, setSettings] = useState<HeroSettings>(fallback);
  useEffect(() => {
    if (!client) return;
    client.from("site_sections").select("settings").eq("id", "hero").maybeSingle().then(({ data }) => {
      if (data?.settings) setSettings((current) => ({ ...current, ...(data.settings as HeroSettings) }));
    });
  }, [client]);
  const suffix = locale === "fr" ? "fr" : "en";
  const image = settings.hero_image_url || fallback.hero_image_url || "/uploads/IMG_1882.jpeg";
  const title = settings[`title_${suffix}`] || fallback[`title_${suffix}`];
  const labels = locale === "fr" ? ["Voir ma sélection", "Découvrir mon parcours", "/journey"] : ["Explore my selection", "Discover my journey", "/en/journey"];
  return <section data-home-section="hero" className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-22 lg:px-8">
    <div className="order-2 md:order-1"><p className="eyebrow">{settings[`eyebrow_${suffix}`] || fallback[`eyebrow_${suffix}`]}</p><h1 className="mt-5 max-w-xl font-serif text-5xl leading-[.95] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">{title}</h1><p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">{settings[`body_${suffix}`] || fallback[`body_${suffix}`]}</p><div className="mt-8 flex flex-wrap gap-3"><a className="button-primary" href="#selection">{labels[0]}</a><a className="button-secondary" href={labels[2]}>{labels[1]}</a></div></div>
    <div className="order-1 overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_24px_60px_rgb(60,42,25,0.2)] md:order-2"><img src={image} alt={settings[`hero_image_alt_${suffix}`] || fallback[`hero_image_alt_${suffix}`] || title || ""} className="aspect-[4/5] h-full w-full object-cover" fetchPriority="high" /></div>
  </section>;
}
