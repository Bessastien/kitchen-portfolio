import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

export default function ProfileMark() {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [portrait, setPortrait] = useState<string | null>(null);
  const [position, setPosition] = useState("50% 50%");
  useEffect(() => {
    if (!client) return;
    client.from("site_sections").select("settings").eq("id", "hero").maybeSingle().then(({ data }) => {
      const url = (data?.settings as Record<string, string | null> | undefined)?.portrait_image_url;
      if (url) setPortrait(url);
      const settings = data?.settings as Record<string, string | null> | undefined;
      setPosition(`${settings?.portrait_x || "50"}% ${settings?.portrait_y || "50"}%`);
    });
  }, [client]);
  return portrait ? <img src={portrait} alt="Florent Dabert" style={{ objectPosition: position }} className="h-10 w-10 rounded-full object-cover ring-2 ring-stone-900" /> : <span className="grid h-10 w-10 place-items-center rounded-full bg-stone-900 font-serif text-lg text-[#f9e5c5] transition-transform group-hover:rotate-6">FD</span>;
}
