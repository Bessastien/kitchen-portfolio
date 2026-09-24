import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type Locale = "fr" | "en";
export type JourneyItem = { id: string; eyebrow_fr: string; eyebrow_en: string; title_fr: string; title_en: string; body_fr: string; body_en: string };

export default function JourneyTimeline({ locale, fallback }: { locale: Locale; fallback: JourneyItem[] }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [items, setItems] = useState(fallback);
  useEffect(() => { if (!client) return; client.from("site_sections").select("settings").eq("id", "journey").maybeSingle().then(({ data }) => { const loaded = (data?.settings as { items?: JourneyItem[] } | undefined)?.items; if (Array.isArray(loaded) && loaded.length) setItems(loaded); }); }, [client]);
  const french = locale === "fr";
  return <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-22 lg:px-8"><p className="eyebrow">{french ? "Parcours" : "Journey"}</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[.98] text-stone-950 md:text-6xl">{french ? "Une pâtisserie de précision, pensée pour l’assiette." : "Precise pastry, designed for the plate."}</h1><div className="mt-14 grid gap-10 md:grid-cols-[.8fr_1.2fr]"><p className="text-lg leading-relaxed text-stone-600">{french ? "Je me forme aujourd’hui aux desserts de restaurant au Campus 120. Mon parcours associe technique, organisation et expérience du service, avec l’envie de découvrir la pâtisserie au-delà des frontières." : "I am currently training in restaurant desserts at Campus 120. My work brings together technique, organisation and service experience, with the ambition to explore pastry beyond borders."}</p><ol className="space-y-8 border-l border-amber-300 pl-7">{items.map((item) => <li key={item.id}><p className="eyebrow">{french ? item.eyebrow_fr : item.eyebrow_en}</p><h2 className="mt-2 font-serif text-3xl text-stone-950">{french ? item.title_fr : item.title_en}</h2><p className="mt-2 text-stone-600">{french ? item.body_fr : item.body_en}</p></li>)}</ol></div></section>;
}
