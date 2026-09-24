import { useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

export default function HomepageSectionControls() {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  useEffect(() => {
    if (!client) return;
    client.from("site_sections").select("id,enabled,position").then(({ data }) => {
      if (!data) return;
      const sections = data.filter((section) => document.querySelector(`[data-home-section="${section.id}"]`));
      for (const section of sections) {
        const element = document.querySelector<HTMLElement>(`[data-home-section="${section.id}"]`);
        if (element) element.hidden = !section.enabled;
      }
      const parent = document.querySelector("main");
      if (parent) sections.sort((a, b) => a.position - b.position).forEach((section) => {
        const element = document.querySelector(`[data-home-section="${section.id}"]`);
        if (element) parent.appendChild(element);
      });
    });
  }, [client]);
  return null;
}
