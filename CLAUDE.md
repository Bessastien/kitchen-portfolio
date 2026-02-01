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
| Framework | Astro 5        | SSG, content collections                     |
| Styling   | Tailwind CSS 4 | Nouvelle syntaxe `@import "tailwindcss"`     |
| Icons     | `lucide-astro` | **PAS** lucide-react (sauf composants React) |
| CMS       | Decap CMS      | Git-based, config dans `public/admin/`       |
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

Les schémas sont définis dans `src/content/config.ts` avec Zod :

```typescript
const projects = defineCollection({
    type: "content",
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
| `src/content/`    | Contenu Markdown géré par CMS         |
| `public/admin/`   | Configuration Decap CMS               |

---

## 🔧 Modifications courantes

### Ajouter une page

1. Créer `src/pages/nom-page.astro`
2. Importer le Layout
3. Ajouter le lien dans Navbar et Footer si nécessaire

### Modifier le schéma CMS

1. Modifier `public/admin/config.yml`
2. Mettre à jour `src/content/config.ts` en parallèle
3. Adapter les composants qui utilisent ces données

### Ajouter une collection

1. Ajouter dans `src/content/config.ts`
2. Créer le dossier `src/content/nom-collection/`
3. Ajouter dans `public/admin/config.yml`

---

## ⚠️ Points d'attention

1. **Pas de `lucide-react` dans les fichiers Astro** - utiliser `lucide-astro`
2. **Syntaxe `class` pas `className`** dans les composants Astro
3. **Les images CMS** sont uploadées dans `public/uploads/`
4. **Git Gateway** requis pour le CMS en production

---

## 🧪 Vérification

Avant de valider des changements :

```bash
# Build de vérification
bun run build

# Test local
bun run dev
```

S'assurer que le build passe sans erreurs.
