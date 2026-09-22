# CLAUDE.md - Guide pour l'Assistant IA

Ce fichier contient les conventions, l'architecture et les bonnes pratiques à suivre lors des modifications de ce projet.

---

## 🎯 Contexte du projet

- **Type** : Portfolio de pâtisserie (site statique)
- **Pour** : Florent DABERT, pâtissier à Poitiers
- **Méthode** : Vibecoding (développement assisté par IA)

---

## 🏗️ Architecture

### Stack technique

| Couche    | Technologie    | Notes                                        |
| --------- | -------------- | -------------------------------------------- |
| Framework | Astro 7        | SSG, content collections                     |
| Styling   | Tailwind CSS 4 | Nouvelle syntaxe `@import "tailwindcss"`     |
| Icons     | `lucide-astro` | **PAS** lucide-react (sauf composants React) |
| Admin     | Studio React   | Route `/studio`, données Supabase            |
| Backend   | Supabase       | Auth, Postgres, RLS et Storage               |
| Fonts     | Google Fonts   | Playfair Display + Inter                     |

### Pattern des composants

```astro
---
// 1. Imports
import { Icon } from "lucide-astro";

// 2. Props interface
interface Props {
  title: string;
}

// 3. Destructuring des props
const { title } = Astro.props;

// 4. Logique si nécessaire
---

<!-- 5. Template HTML -->
<div class="...">
  <Icon class="w-6 h-6" />
</div>
```

---

## ✅ Conventions à respecter

### Icônes

```astro
// ✅ Correct - dans fichiers .astro
import { Mail } from "lucide-astro";
<Mail class="w-6 h-6" />

// ❌ Incorrect - mélanger les librairies
import { Mail } from "lucide-react";
<Mail className="w-6 h-6" />
```

### Tailwind CSS 4

```css
/* ✅ Correct - nouvelle syntaxe */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* ❌ Incorrect - ancienne syntaxe */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Content Collections

Les collections historiques sont définies dans `src/content.config.ts` avec Zod et un loader Astro :

```typescript
const projects = defineCollection({
    loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            publishDate: z.coerce.date(),
            mainImage: z.union([z.string(), image()]),
            // ...
        }),
});
```

---

## 📂 Structure des fichiers

| Dossier           | Contenu                               |
| ----------------- | ------------------------------------- |
| `src/pages/`      | Routes du site (file-based routing)   |
| `src/components/` | Composants réutilisables `.astro`     |
| `src/layouts/`    | Layouts avec SEO et structure commune |
| `src/content/`    | Contenu Markdown en cours de migration |
| `src/components/admin/` | Interface du Studio           |
| `supabase/`       | Migrations, règles RLS et tests        |

---

## 🔧 Modifications courantes

### Ajouter une page

1. Créer `src/pages/nom-page.astro`
2. Importer le Layout
3. Ajouter le lien dans Navbar et Footer si nécessaire

### Modifier le schéma Supabase

1. Créer une migration avec `npx supabase migration new nom`
2. Tester avec `npx supabase db reset --local` et `npx supabase test db --local`
3. Adapter le Studio et les types associés

### Ajouter une collection

1. Ajouter dans `src/content.config.ts`
2. Créer le dossier `src/content/nom-collection/`

---

## ⚠️ Points d'attention

1. **Pas de `lucide-react` dans les fichiers Astro** - utiliser `lucide-astro`
2. **Syntaxe `class` pas `className`** dans les composants Astro
3. **Les nouvelles images** sont stockées dans le bucket privé Supabase `portfolio-media`
4. **Ne jamais exposer de clé Supabase secrète** dans une variable `PUBLIC_`

---

## 🧪 Vérification

Avant de valider des changements :

```bash
# Build de vérification
npm run check
npm run build

# Test local
npm run dev
```

S'assurer que le build passe sans erreurs.
