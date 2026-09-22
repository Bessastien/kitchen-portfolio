# 🧁 Portfolio Florent DABERT - Pâtissier

> **⚡ Projet Vibecoded** - Ce portfolio a été principalement créé avec l'aide d'une IA (Claude), en mode "vibe coding". Le développeur guide les choix créatifs et techniques, tandis que l'IA génère le code.

Portfolio professionnel pour **Florent DABERT**, pâtissier passionné basé à Poitiers. Ce site présente ses créations pâtissières, ses réalisations et permet aux visiteurs de le contacter.

## 🎯 À propos

Ce projet est un **portfolio pâtisserie** créé pour mon petit frère Florent. L'objectif est de mettre en valeur son travail et ses compétences en pâtisserie de manière élégante et professionnelle.

---

## 🛠️ Technologies utilisées

| Technologie                                                     | Version | Description                             |
| --------------------------------------------------------------- | ------- | --------------------------------------- |
| [Astro](https://astro.build/)                                   | 7.x     | Framework web statique moderne          |
| [Tailwind CSS](https://tailwindcss.com/)                        | 4.x     | Framework CSS utility-first             |
| [React](https://react.dev/)                                     | 19.x    | Composants interactifs (si nécessaire)  |
| [Lucide](https://lucide.dev/)                                   | -       | Icônes SVG élégantes                    |
| [Supabase](https://supabase.com/)                               | -       | Authentification, données et médias     |
| [Netlify](https://www.netlify.com/)                             | -       | Build et hébergement du site            |

---

## 📁 Structure du projet

```
kitchen-portfolio/
├── public/
│   ├── admin/              # Redirection historique vers /studio
│   ├── uploads/            # Images historiques du portfolio
│   └── favicon.svg
├── src/
│   ├── components/         # Composants Astro réutilisables
│   │   ├── Footer.astro
│   │   ├── Navbar.astro
│   │   └── ProjectCard.astro
│   ├── content/            # Contenu historique en cours de migration
│   │   ├── projects/       # Projets pâtisserie (Markdown)
│   │   └── settings/       # Paramètres (JSON)
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal avec SEO
│   ├── pages/              # Routes du site
│   │   ├── index.astro     # Page d'accueil
│   │   ├── projects.astro  # Galerie des projets
│   │   ├── projects/[slug].astro  # Détail projet
│   │   ├── contact.astro   # Page contact
│   │   └── success.astro   # Confirmation message
│   └── styles/
│       └── global.css      # Styles Tailwind
├── supabase/               # Migrations, politiques RLS et tests
├── netlify.toml            # Build, redirections et en-têtes
├── astro.config.mjs        # Configuration Astro
├── package.json
└── tsconfig.json
```

---

## 🚀 Commandes

| Commande          | Action                                               |
| ----------------- | ---------------------------------------------------- |
| `npm install`     | Installe les dépendances                             |
| `npm run dev`     | Lance le serveur de développement (`localhost:4321`) |
| `npm run build`   | Génère le site statique dans `./dist/`               |
| `npm run preview` | Prévisualise le build localement                     |

---

## 🎨 Fonctionnalités

- ✅ **SEO optimisé** - Meta tags, Open Graph, Schema.org
- ✅ **Studio intégré** - Administration mobile avec Supabase
- ✅ **Responsive** - Design adapté mobile/tablette/desktop
- ✅ **Galerie dynamique** - Affichage des projets mis en avant ou récents
- ✅ **Sitemap automatique** - Généré pour le référencement

---

## 📝 Gestion du contenu

L'administration du contenu se fait via le **Studio** :

1. Accéder à `/studio` sur le site déployé (`/admin` y redirige également)
2. Se connecter avec le compte Supabase de Florent
3. Ajouter, modifier et publier les créations, puis organiser la une

Le Studio fonctionne en aperçu sans configuration. Une fois le projet distant connecté, il utilise Supabase Auth, Database et Storage. Le site public continue temporairement de lire les fichiers Markdown jusqu’à la migration complète des créations. Les instructions se trouvent dans `supabase/README.md`.

---

## 🌐 Déploiement

Ce site est conçu pour être déployé sur **Netlify** :

1. Connecter le repository à Netlify
2. Définir `PUBLIC_SUPABASE_URL` et `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Appliquer les migrations Supabase
4. Déployer le site avec les paramètres de `netlify.toml`

---

## 📄 Licence

Projet personnel - Tous droits réservés © Florent DABERT
