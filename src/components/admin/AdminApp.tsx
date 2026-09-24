import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Camera, Eye, GripVertical, ImagePlus, LogOut, Pencil, Plus, Save, Sparkles, UserRound, X } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../lib/supabase-browser";
import ProjectEditor from "./ProjectEditor";
import { demoProjects, originLabels, projectSelect, type AdminProject, type ProjectOrigin } from "./types";

type SiteSection = {
  id: string;
  title_fr: string;
  title_en: string;
  enabled: boolean;
  position: number;
  variant: "hero" | "editorial" | "grid" | "timeline" | "contact";
  settings: Record<string, string | null>;
};

type HeroSettings = Record<"eyebrow_fr" | "title_fr" | "body_fr" | "eyebrow_en" | "title_en" | "body_en" | "hero_image_url" | "hero_image_alt_fr" | "hero_image_alt_en" | "portrait_image_url" | "portrait_image_alt", string | null>;

const defaultHeroSettings: HeroSettings = {
  eyebrow_fr: "Pâtissier · Poitiers · France", title_fr: "Je veux faire du dessert le dernier souvenir.", body_fr: "Je travaille les desserts de restaurant, les entremets et les créations de saison. Je construis ce portfolio au fil de ma formation et de mes expériences.",
  eyebrow_en: "Pastry chef · Poitiers · France", title_en: "I want dessert to become the lasting memory.", body_en: "I create restaurant desserts, entremets and seasonal pastries. This portfolio grows alongside my training and professional experience.",
  hero_image_url: "/uploads/IMG_1882.jpeg", hero_image_alt_fr: "Entremets aux agrumes de Florent Dabert", hero_image_alt_en: "Florent Dabert citrus entremets", portrait_image_url: null, portrait_image_alt: "Florent Dabert",
};

const demoSections: SiteSection[] = [
  { id: "hero", title_fr: "Introduction", title_en: "Introduction", enabled: true, position: 0, variant: "hero", settings: defaultHeroSettings },
  { id: "featured", title_fr: "À la une", title_en: "Featured work", enabled: true, position: 1, variant: "editorial", settings: {} },
  { id: "journey", title_fr: "Mon parcours", title_en: "My journey", enabled: true, position: 2, variant: "timeline", settings: {} },
  { id: "contact", title_fr: "Contact", title_en: "Contact", enabled: true, position: 3, variant: "contact", settings: {} },
];

function HomeContentEditor({ section, onSaved }: { section: SiteSection; onSaved: (settings: HeroSettings) => void }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [settings, setSettings] = useState<HeroSettings>({ ...defaultHeroSettings, ...(section.settings as HeroSettings) });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function change(key: keyof HeroSettings, value: string) { setSettings((current) => ({ ...current, [key]: value || null })); }

  async function upload(kind: "hero" | "portrait", file: File | undefined) {
    if (!file || !client) return;
    setBusy(true); setMessage("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `home/${kind}-${crypto.randomUUID()}.${extension}`;
    const result = await client.storage.from("site-assets").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (result.error) { setMessage("La photo n’a pas pu être envoyée."); setBusy(false); return; }
    const { data } = client.storage.from("site-assets").getPublicUrl(path);
    change(kind === "hero" ? "hero_image_url" : "portrait_image_url", data.publicUrl);
    setBusy(false); setMessage("Photo ajoutée. Enregistre l’accueil pour la publier.");
  }

  async function save() {
    if (!client) { setMessage("Connecte Supabase pour enregistrer ces changements."); return; }
    setBusy(true); setMessage("");
    const { error } = await client.from("site_sections").update({ settings }).eq("id", "hero");
    setBusy(false);
    if (error) { setMessage("Les textes n’ont pas pu être enregistrés."); return; }
    onSaved(settings); setMessage("L’accueil est enregistré. Il se met à jour sur le site.");
  }

  const input = "mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal outline-none focus:border-amber-700";
  return <section className="mt-6 rounded-[2rem] border border-stone-200 bg-[#fffdf9] p-4 sm:p-6">
    <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Identité et accueil</p><h2 className="mt-1 font-serif text-3xl">Mon introduction</h2><p className="mt-2 text-sm leading-relaxed text-stone-600">Je modifie les textes français/anglais, la grande image d’accueil et ma photo ronde dans la barre du site.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-bold">Accroche FR<input className={input} value={settings.eyebrow_fr || ""} onChange={(event) => change("eyebrow_fr", event.target.value)} /></label>
      <label className="block text-sm font-bold">Accroche EN<input className={input} value={settings.eyebrow_en || ""} onChange={(event) => change("eyebrow_en", event.target.value)} /></label>
      <label className="block text-sm font-bold">Grand titre FR<textarea className={`${input} min-h-24 py-3`} value={settings.title_fr || ""} onChange={(event) => change("title_fr", event.target.value)} /></label>
      <label className="block text-sm font-bold">Grand titre EN<textarea className={`${input} min-h-24 py-3`} value={settings.title_en || ""} onChange={(event) => change("title_en", event.target.value)} /></label>
      <label className="block text-sm font-bold">Texte FR<textarea className={`${input} min-h-28 py-3`} value={settings.body_fr || ""} onChange={(event) => change("body_fr", event.target.value)} /></label>
      <label className="block text-sm font-bold">Texte EN<textarea className={`${input} min-h-28 py-3`} value={settings.body_en || ""} onChange={(event) => change("body_en", event.target.value)} /></label>
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-bold">Grande image d’accueil<span className="mt-2 flex min-h-28 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-stone-300 bg-white px-4 text-stone-600">{settings.hero_image_url ? <img src={settings.hero_image_url} alt="" className="h-24 w-24 rounded-xl object-cover" /> : <Camera className="size-5" />}<span>Prendre ou choisir une photo<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" capture="environment" onChange={(event) => void upload("hero", event.target.files?.[0])} /></span></span></label>
      <label className="block text-sm font-bold">Ma photo ronde (remplace FD)<span className="mt-2 flex min-h-28 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-stone-300 bg-white px-4 text-stone-600">{settings.portrait_image_url ? <img src={settings.portrait_image_url} alt="" className="size-20 rounded-full object-cover" /> : <UserRound className="size-5" />}<span>Prendre ou choisir une photo<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" capture="user" onChange={(event) => void upload("portrait", event.target.files?.[0])} /></span></span></label>
    </div>
    {message && <p className="mt-4 text-sm text-stone-600" role="status">{message}</p>}
    <button type="button" className="button-primary mt-5 w-full gap-2" onClick={() => void save()} disabled={busy}><Save className="size-4" />{busy ? "Enregistrement…" : "Enregistrer l’accueil"}</button>
  </section>;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CreateProjectSheet({ onClose, onCreated }: { onClose: () => void; onCreated: (project: AdminProject) => void }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [origin, setOrigin] = useState<ProjectOrigin>("campus120");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    if (!client) {
      onCreated({ id: crypto.randomUUID(), title_fr: titleFr, title_en: titleEn || null, description_fr: null, description_en: null, image_alt_fr: null, image_alt_en: null, tags: [], main_image_path: null, main_image_url: file ? URL.createObjectURL(file) : null, origin, status: "draft", publication_authorized: false, published_at: null });
      onClose();
      return;
    }

    let imagePath: string | null = null;
    let imageUrl: string | null = null;
    if (file) {
      const { data: userData } = await client.auth.getUser();
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      imagePath = `${userData.user?.id || "editor"}/${crypto.randomUUID()}.${extension}`;
      const upload = await client.storage.from("portfolio-media").upload(imagePath, file, { cacheControl: "31536000", upsert: false });
      if (upload.error) {
        setError("La photo n’a pas pu être envoyée. Vérifiez le stockage Supabase.");
        setBusy(false);
        return;
      }
      const signed = await client.storage.from("portfolio-media").createSignedUrl(upload.data.path, 3600);
      imageUrl = signed.data?.signedUrl || null;
    }

    const slug = `${slugify(titleFr)}-${crypto.randomUUID().slice(0, 6)}`;
    const result = await client.from("projects").insert({ slug, title_fr: titleFr, title_en: titleEn || null, origin, status: "draft", main_image_path: imagePath }).select(projectSelect).single();
    if (result.error) {
      setError("La création n’a pas pu être enregistrée. Elle reste à compléter.");
      setBusy(false);
      return;
    }
    if (imagePath) {
      const mediaResult = await client.from("project_media").insert({ project_id: result.data.id, storage_path: imagePath, position: 0 });
      if (mediaResult.error) {
        await Promise.all([
          client.storage.from("portfolio-media").remove([imagePath]),
          client.from("projects").delete().eq("id", result.data.id),
        ]);
        setError("La photo n’a pas pu être rattachée au brouillon. Rien n’a été publié.");
        setBusy(false);
        return;
      }
    }
    onCreated({ ...(result.data as AdminProject), main_image_url: imageUrl });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/45 p-0 backdrop-blur-sm sm:grid sm:place-items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="create-title">
      <form onSubmit={submit} className="ml-auto flex min-h-full w-full max-w-xl flex-col bg-[#fffdf9] p-5 shadow-2xl sm:min-h-0 sm:rounded-[2rem] sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Nouvelle création</p><h2 id="create-title" className="mt-1 font-serif text-3xl text-stone-950">J’ajoute un dessert</h2></div><button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-stone-300" aria-label="Fermer"><X className="size-5" /></button></div>
        <label className="mt-7 block text-sm font-bold">Photo principale<span className="mt-2 flex min-h-28 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-4 text-stone-600"><Camera className="size-5" />{file ? file.name : "Prendre ou choisir une photo"}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" capture="environment" onChange={(event) => setFile(event.target.files?.[0] || null)} /></span></label>
        <label className="mt-5 block text-sm font-bold">Nom du dessert en français<input className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal outline-none focus:border-amber-700" value={titleFr} onChange={(event) => setTitleFr(event.target.value)} required /></label>
        <label className="mt-4 block text-sm font-bold">Nom en anglais <span className="font-normal text-stone-400">(optionnel)</span><input className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal outline-none focus:border-amber-700" value={titleEn} onChange={(event) => setTitleEn(event.target.value)} /></label>
        <label className="mt-4 block text-sm font-bold">Contexte<select className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal outline-none focus:border-amber-700" value={origin} onChange={(event) => setOrigin(event.target.value as ProjectOrigin)}>{Object.entries(originLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <p className="mt-4 rounded-xl bg-stone-100 p-3 text-xs leading-relaxed text-stone-600">La création sera enregistrée en brouillon. Je pourrai compléter sa description et vérifier l’autorisation de publication avant de la rendre publique.</p>
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" className="button-primary mt-auto w-full gap-2 sm:mt-7" disabled={busy}><Save className="size-4" />{busy ? "Enregistrement…" : "Enregistrer le brouillon"}</button>
      </form>
    </div>
  );
}

function SortableProject({ project, position, onRemove }: { project: AdminProject; position: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`grid grid-cols-[4.5rem_1fr_3rem_3rem] items-center gap-2 rounded-2xl border bg-white p-2 shadow-sm ${isDragging ? "z-20 border-amber-500 opacity-90 shadow-xl" : "border-stone-200"}`}
    >
      <div className="relative h-18 overflow-hidden rounded-xl bg-stone-100">
        {project.main_image_url && <img src={project.main_image_url} alt="" className="h-full w-full object-cover" />}
        <span className="absolute left-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-stone-950 text-[10px] font-bold text-white">{position}</span>
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-serif text-lg font-semibold text-stone-950">{project.title_fr}</h3>
        <p className="mt-1 truncate text-xs text-stone-500">{project.origin ? originLabels[project.origin] : "Contexte à renseigner"}</p>
      </div>
      <button type="button" className="grid size-11 touch-none place-items-center rounded-xl text-stone-500 hover:bg-stone-100" aria-label={`Déplacer ${project.title_fr}`} {...attributes} {...listeners}>
        <GripVertical className="size-5" />
      </button>
      <button type="button" className="grid size-11 place-items-center rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-700" onClick={onRemove} aria-label={`Retirer ${project.title_fr} de la une`}><X className="size-4" /></button>
    </article>
  );
}

function ProjectListCard({ project, featured, onEdit, onFeature }: { project: AdminProject; featured: boolean; onEdit: () => void; onFeature: () => void }) {
  const statusLabel = project.status === "published" ? "Publié" : project.status === "archived" ? "Archivé" : "Brouillon";
  return (
    <article className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-2xl border border-stone-200 bg-white p-2.5">
      <div className="h-18 overflow-hidden rounded-xl bg-stone-100">{project.main_image_url && <img src={project.main_image_url} alt="" className="h-full w-full object-cover" />}</div>
      <button type="button" className="min-w-0 text-left" onClick={onEdit}>
        <h3 className="truncate font-serif text-lg font-semibold text-stone-950">{project.title_fr}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500"><span className={project.status === "published" ? "font-bold text-emerald-700" : ""}>{statusLabel}</span><span>·</span><span>{project.origin ? originLabels[project.origin] : "Contexte à renseigner"}</span></p>
      </button>
      <div className="flex gap-1">
        {project.status === "published" && project.publication_authorized && <button type="button" className={`grid size-10 place-items-center rounded-xl ${featured ? "bg-amber-100 text-amber-900" : "text-stone-500 hover:bg-stone-100"}`} onClick={onFeature} aria-label={featured ? `Retirer ${project.title_fr} de la une` : `Ajouter ${project.title_fr} à la une`}><Sparkles className="size-4" /></button>}
        <button type="button" className="grid size-10 place-items-center rounded-xl text-stone-500 hover:bg-stone-100" onClick={onEdit} aria-label={`Modifier ${project.title_fr}`}><Pencil className="size-4" /></button>
      </div>
    </article>
  );
}

function SortableSection({ section, onToggle }: { section: SiteSection; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  return (
    <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl border bg-white p-2.5 ${isDragging ? "z-20 border-amber-500 shadow-xl" : "border-stone-200"}`}>
      <button type="button" className="grid size-11 touch-none place-items-center rounded-xl text-stone-500 hover:bg-stone-100" aria-label={`Déplacer ${section.title_fr}`} {...attributes} {...listeners}><GripVertical className="size-5" /></button>
      <div><h3 className="font-semibold text-stone-950">{section.title_fr}</h3><p className="text-xs text-stone-500">{section.title_en}</p></div>
      <button type="button" onClick={onToggle} className={`relative h-7 w-12 rounded-full transition ${section.enabled ? "bg-amber-700" : "bg-stone-300"}`} aria-pressed={section.enabled} aria-label={`${section.enabled ? "Masquer" : "Afficher"} ${section.title_fr}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${section.enabled ? "left-6" : "left-1"}`}></span></button>
    </article>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setBusy(true);
    setMessage("");
    const { error } = await client.auth.signInWithPassword({ email, password });
    setMessage(error ? "Connexion impossible. Vérifiez l’adresse et le mot de passe." : "Connexion réussie.");
    setBusy(false);
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-stone-950 font-serif text-lg text-amber-200">FD</span>
        <h1 className="mt-6 font-serif text-3xl text-stone-950">Mon portfolio</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">Je me connecte pour ajouter mes créations et organiser ma page d’accueil.</p>
        <label className="mt-7 block text-sm font-bold text-stone-800">Adresse email<input className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 px-4 font-normal outline-none focus:border-amber-700" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="mt-4 block text-sm font-bold text-stone-800">Mot de passe<input className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 px-4 font-normal outline-none focus:border-amber-700" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {message && <p className="mt-4 text-sm text-stone-600" role="status">{message}</p>}
        <button className="button-primary mt-6 w-full" type="submit" disabled={busy}>{busy ? "Connexion…" : "Me connecter"}</button>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [authenticated, setAuthenticated] = useState(!isSupabaseConfigured);
  const [projects, setProjects] = useState<AdminProject[]>(demoProjects);
  const [featuredIds, setFeaturedIds] = useState(demoProjects.filter((project) => project.status === "published" && project.publication_authorized).map((project) => project.id));
  const [sections, setSections] = useState<SiteSection[]>(demoSections);
  const [notice, setNotice] = useState(isSupabaseConfigured ? "" : "Mode aperçu : connectez Supabase pour enregistrer les changements.");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!client) return;
    client.auth.getUser().then(({ data }) => setAuthenticated(Boolean(data.user)));
    const { data } = client.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session?.user)));
    return () => data.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (!client || !authenticated) return;
    const activeClient = client;
    async function loadContent() {
      const initialProjectResult = await activeClient.from("projects").select(projectSelect).order("updated_at", { ascending: false });
      let projectData: Array<Omit<AdminProject, "main_image_url"> & { main_image_url?: string | null }> | null = initialProjectResult.data;
      // The published site remains usable while the database migration is being
      // rolled out: the only missing field on the former schema is the public
      // URL used for the portfolio imported from /public/uploads.
      if (initialProjectResult.error?.message.includes("main_image_url")) {
        const legacyProjectResult = await activeClient.from("projects").select("id,title_fr,title_en,description_fr,description_en,image_alt_fr,image_alt_en,tags,main_image_path,origin,status,publication_authorized,published_at").order("updated_at", { ascending: false });
        if (legacyProjectResult.error) {
          setNotice("Impossible de charger le contenu. Vérifiez les droits du compte.");
          return;
        }
        projectData = legacyProjectResult.data;
      } else if (initialProjectResult.error) {
        setNotice("Impossible de charger le contenu. Vérifiez les droits du compte.");
        return;
      }
      const [featuredResult, sectionResult] = await Promise.all([
        activeClient.from("homepage_featured").select("project_id,position").order("position"),
        activeClient.from("site_sections").select("id,title_fr,title_en,enabled,position,variant,settings").order("position"),
      ]);
      if (!projectData || featuredResult.error || sectionResult.error) {
        setNotice("Impossible de charger le contenu. Vérifiez les droits du compte.");
        return;
      }
      Promise.all(projectData.map(async (project) => {
        if (!project.main_image_path) return project;
        const signed = await activeClient.storage.from("portfolio-media").createSignedUrl(project.main_image_path, 3600);
        return { ...project, main_image_url: signed.data?.signedUrl || project.main_image_url || null };
      })).then((loadedProjects) => setProjects(loadedProjects.map((project) => ({ ...project, main_image_url: project.main_image_url || null }))));
      setFeaturedIds(featuredResult.data.map((item) => item.project_id));
      setSections(sectionResult.data as SiteSection[]);
    }
    void loadContent();
  }, [client, authenticated]);

  const featuredProjects = featuredIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is AdminProject => Boolean(project));

  function toggleFeatured(project: AdminProject) {
    if (featuredIds.includes(project.id)) {
      setFeaturedIds((current) => current.filter((id) => id !== project.id));
      setNotice("Création retirée de la sélection. Je peux maintenant enregistrer la une.");
      return;
    }
    if (featuredIds.length >= 6) {
      setNotice("La une peut contenir au maximum six créations.");
      return;
    }
    if (project.status !== "published" || !project.publication_authorized) {
      setNotice("Je dois d’abord publier et autoriser cette création.");
      return;
    }
    setFeaturedIds((current) => [...current, project.id]);
    setNotice("Sélection modifiée. Je peux maintenant enregistrer la une.");
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFeaturedIds((current) => {
      const from = current.indexOf(String(active.id));
      const to = current.indexOf(String(over.id));
      return arrayMove(current, from, to);
    });
    setNotice("Nouvel ordre prêt à être enregistré.");
  }

  function onSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((current) => {
      const reordered = arrayMove(current, current.findIndex((section) => section.id === active.id), current.findIndex((section) => section.id === over.id));
      return reordered.map((section, position) => ({ ...section, position }));
    });
    setNotice("Nouvel ordre des sections prêt à être enregistré.");
  }

  async function saveFeatured() {
    if (!client) {
      setNotice("Ordre modifié dans l’aperçu. La connexion Supabase permettra de l’enregistrer.");
      return;
    }
    setSaving(true);
    const { error } = await client.rpc("replace_homepage_featured", { project_ids: featuredIds });
    setNotice(error ? "L’ordre n’a pas pu être enregistré." : "La une est à jour.");
    setSaving(false);
  }

  async function saveSections() {
    if (!client) {
      setNotice("Organisation modifiée dans l’aperçu. La connexion Supabase permettra de l’enregistrer.");
      return;
    }
    setSaving(true);
    const results = await Promise.all(sections.map((section, position) => client.from("site_sections").update({ position, enabled: section.enabled }).eq("id", section.id)));
    setNotice(results.some((result) => result.error) ? "L’organisation n’a pas pu être entièrement enregistrée." : "L’organisation de l’accueil est à jour.");
    setSaving(false);
  }

  if (!authenticated) return <LoginForm />;

  return (
    <main className="min-h-screen bg-[#f6f1e8] pb-28 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbf8f3]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Administration</p><h1 className="font-serif text-xl">Mon portfolio</h1></div>
          <div className="flex gap-2"><a className="grid size-11 place-items-center rounded-full border border-stone-300 bg-white" href="/" aria-label="Voir le site"><Eye className="size-5" /></a>{client && <button className="grid size-11 place-items-center rounded-full border border-stone-300 bg-white" type="button" onClick={() => client.auth.signOut()} aria-label="Me déconnecter"><LogOut className="size-5" /></button>}</div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {notice && <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950" role="status">{notice}</p>}
        <section className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setCreating(true)} className="flex min-h-24 items-center gap-4 rounded-3xl bg-stone-950 p-5 text-left text-white"><span className="grid size-12 place-items-center rounded-full bg-white/10"><ImagePlus className="size-6" /></span><span><strong className="block text-lg">Ajouter une création</strong><small className="text-stone-300">Photo, titre et contexte</small></span></button>
          <div className="flex min-h-24 items-center gap-4 rounded-3xl border border-stone-200 bg-white p-5"><span className="grid size-12 place-items-center rounded-full bg-amber-100 text-amber-900"><Sparkles className="size-6" /></span><span><strong className="block text-lg">{projects.length} créations</strong><small className="text-stone-500">{projects.filter((project) => project.status === "published").length} publiées</small></span></div>
        </section>

        <HomeContentEditor section={sections.find((section) => section.id === "hero") || demoSections[0]} onSaved={(settings) => setSections((current) => current.map((section) => section.id === "hero" ? { ...section, settings } : section))} />

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-[#fffdf9] p-4 sm:p-6">
          <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Page d’accueil · {featuredIds.length}/6</p><h2 className="mt-1 font-serif text-3xl">Ma sélection à la une</h2><p className="mt-2 text-sm leading-relaxed text-stone-600">Je maintiens la poignée pour changer l’ordre. Je peux retirer une création avec la croix et en ajouter depuis « Mes créations ».</p></div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={featuredIds} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3">{featuredProjects.map((project, index) => <SortableProject key={project.id} project={project} position={index + 1} onRemove={() => toggleFeatured(project)} />)}</div>
            </SortableContext>
          </DndContext>
          {featuredProjects.length === 0 && <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-center text-sm text-stone-500">Aucune création à la une pour le moment.</p>}
          <button type="button" className="button-primary mt-5 w-full gap-2" onClick={saveFeatured} disabled={saving}><Save className="size-4" />{saving ? "Enregistrement…" : "Enregistrer l’ordre"}</button>
        </section>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-[#fffdf9] p-4 sm:p-6">
          <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Contenu</p><h2 className="mt-1 font-serif text-3xl">Mes créations</h2><p className="mt-2 text-sm leading-relaxed text-stone-600">Je touche une création pour compléter ses textes, confirmer les droits ou la publier. L’étoile l’ajoute à la une.</p></div>
          <div className="grid gap-3">{projects.map((project) => <ProjectListCard key={project.id} project={project} featured={featuredIds.includes(project.id)} onEdit={() => setEditing(project)} onFeature={() => toggleFeatured(project)} />)}</div>
          <button type="button" className="button-secondary mt-5 w-full gap-2" onClick={() => setCreating(true)}><Plus className="size-4" />Ajouter une création</button>
        </section>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-[#fffdf9] p-4 sm:p-6">
          <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-800">Structure du site</p><h2 className="mt-1 font-serif text-3xl">Mes sections</h2><p className="mt-2 text-sm leading-relaxed text-stone-600">Je réorganise la page d’accueil et je masque les sections dont je n’ai pas besoin.</p></div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSectionDragEnd}>
            <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3">{sections.map((section) => <SortableSection key={section.id} section={section} onToggle={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, enabled: !item.enabled } : item))} />)}</div>
            </SortableContext>
          </DndContext>
          <button type="button" className="button-secondary mt-5 w-full gap-2" onClick={saveSections} disabled={saving}><Save className="size-4" />Enregistrer les sections</button>
        </section>
      </div>
      {creating && <CreateProjectSheet onClose={() => setCreating(false)} onCreated={(project) => { setProjects((current) => [project, ...current]); setNotice("Le brouillon a été ajouté."); }} />}
      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} onSaved={(project, message) => { setProjects((current) => current.map((item) => item.id === project.id ? project : item)); if (project.status !== "published") setFeaturedIds((current) => current.filter((id) => id !== project.id)); setEditing(null); setNotice(message); }} />}
    </main>
  );
}
