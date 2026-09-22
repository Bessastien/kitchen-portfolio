import { useMemo, useState, type FormEvent } from "react";
import { Archive, CheckCircle2, EyeOff, Save, ShieldCheck, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase-browser";
import { originLabels, projectSelect, type AdminProject, type ProjectOrigin, type ProjectStatus } from "./types";

type Props = {
  project: AdminProject;
  onClose: () => void;
  onSaved: (project: AdminProject, message: string) => void;
};

function listFromInput(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim().toLocaleLowerCase("fr")).filter(Boolean))];
}

export default function ProjectEditor({ project, onClose, onSaved }: Props) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [titleFr, setTitleFr] = useState(project.title_fr);
  const [titleEn, setTitleEn] = useState(project.title_en || "");
  const [descriptionFr, setDescriptionFr] = useState(project.description_fr || "");
  const [descriptionEn, setDescriptionEn] = useState(project.description_en || "");
  const [altFr, setAltFr] = useState(project.image_alt_fr || "");
  const [altEn, setAltEn] = useState(project.image_alt_en || "");
  const [tags, setTags] = useState(project.tags.join(", "));
  const [origin, setOrigin] = useState<ProjectOrigin>(project.origin || "other");
  const [authorized, setAuthorized] = useState(project.publication_authorized);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function persist(nextStatus: ProjectStatus) {
    setError("");
    if (nextStatus === "published" && !authorized) {
      setError("Je dois confirmer que j’ai le droit de publier cette création.");
      return;
    }
    if (nextStatus === "published" && !project.main_image_path && !project.main_image_url) {
      setError("Une photo principale est nécessaire avant la publication.");
      return;
    }

    setBusy(true);
    const payload = {
      title_fr: titleFr.trim(),
      title_en: titleEn.trim() || null,
      description_fr: descriptionFr.trim() || null,
      description_en: descriptionEn.trim() || null,
      image_alt_fr: altFr.trim() || null,
      image_alt_en: altEn.trim() || null,
      tags: listFromInput(tags),
      origin,
      publication_authorized: authorized,
      status: nextStatus,
      published_at: nextStatus === "published" ? project.published_at || new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (!client) {
      onSaved({ ...project, ...payload }, nextStatus === "published" ? "La création est publiée dans l’aperçu." : "Les modifications sont enregistrées dans l’aperçu.");
      return;
    }

    const result = await client.from("projects").update(payload).eq("id", project.id).select(projectSelect).single();
    if (result.error) {
      setError("L’enregistrement a échoué. Aucune modification n’a été publiée.");
      setBusy(false);
      return;
    }
    if (nextStatus !== "published") {
      await client.from("homepage_featured").delete().eq("project_id", project.id);
    }
    onSaved({ ...(result.data as AdminProject), main_image_url: project.main_image_url }, nextStatus === "published" ? "La création est maintenant publiée." : nextStatus === "archived" ? "La création est archivée." : "Le brouillon est à jour.");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void persist(project.status);
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal outline-none focus:border-amber-700";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <form onSubmit={submit} className="ml-auto min-h-full w-full max-w-2xl bg-[#fffdf9] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Modifier ma création</p><h2 id="edit-title" className="mt-1 font-serif text-3xl text-stone-950">{project.title_fr}</h2></div>
          <button type="button" onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-full border border-stone-300" aria-label="Fermer"><X className="size-5" /></button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Nom en français<input className={fieldClass} value={titleFr} onChange={(event) => setTitleFr(event.target.value)} required /></label>
          <label className="block text-sm font-bold">Nom en anglais<input className={fieldClass} value={titleEn} onChange={(event) => setTitleEn(event.target.value)} placeholder="Traduction recommandée" /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Présentation en français<textarea className={`${fieldClass} min-h-28 py-3`} value={descriptionFr} onChange={(event) => setDescriptionFr(event.target.value)} /></label>
          <label className="block text-sm font-bold">Présentation en anglais<textarea className={`${fieldClass} min-h-28 py-3`} value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Description de la photo en français<input className={fieldClass} value={altFr} onChange={(event) => setAltFr(event.target.value)} placeholder="Ce que montre précisément la photo" /></label>
          <label className="block text-sm font-bold">Description de la photo en anglais<input className={fieldClass} value={altEn} onChange={(event) => setAltEn(event.target.value)} /></label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">Contexte<select className={fieldClass} value={origin} onChange={(event) => setOrigin(event.target.value as ProjectOrigin)}>{Object.entries(originLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="block text-sm font-bold">Mots-clés<input className={fieldClass} value={tags} onChange={(event) => setTags(event.target.value)} placeholder="chocolat, agrumes, dressage" /><small className="mt-1 block font-normal text-stone-500">Séparés par des virgules</small></label>
        </div>

        <label className="mt-6 flex cursor-pointer gap-3 rounded-2xl border border-stone-200 bg-white p-4">
          <input type="checkbox" className="mt-1 size-5 accent-amber-800" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
          <span><strong className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-amber-800" />J’ai le droit de publier ces textes et ces photos</strong><small className="mt-1 block leading-relaxed text-stone-500">Je confirme notamment l’accord nécessaire si la création vient de l’école ou d’une entreprise.</small></span>
        </label>

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="submit" className="button-secondary gap-2" disabled={busy}><Save className="size-4" />{busy ? "Enregistrement…" : "Enregistrer"}</button>
          {project.status === "published" ? (
            <button type="button" className="button-primary gap-2" onClick={() => void persist("draft")} disabled={busy}><EyeOff className="size-4" />Remettre en brouillon</button>
          ) : (
            <button type="button" className="button-primary gap-2" onClick={() => void persist("published")} disabled={busy}><CheckCircle2 className="size-4" />Publier maintenant</button>
          )}
        </div>
        {project.status !== "archived" && <button type="button" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-stone-500 underline underline-offset-4" onClick={() => void persist("archived")} disabled={busy}><Archive className="size-4" />Archiver cette création</button>}
      </form>
    </div>
  );
}
