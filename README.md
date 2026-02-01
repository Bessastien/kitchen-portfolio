# 🧁 Portfolio Florent DABERT - Pâtissier

> **⚡ Projet Vibecoded** - Ce portfolio a été principalement créé avec l'aide d'une IA (Claude), en mode "vibe coding". Le développeur guide les choix créatifs et techniques, tandis que l'IA génère le code.

Portfolio professionnel pour **Florent DABERT**, pâtissier passionné basé à Poitiers. Ce site présente ses créations pâtissières, ses réalisations et permet aux visiteurs de le contacter.

## 🎯 À propos

Ce projet est un **portfolio pâtisserie** créé pour mon petit frère Florent. L'objectif est de mettre en valeur son travail et ses compétences en pâtisserie de manière élégante et professionnelle.

---

## 🛠️ Technologies utilisées

| Technologie                                                     | Version | Description                             |
| --------------------------------------------------------------- | ------- | --------------------------------------- |
| [Astro](https://astro.build/)                                   | 5.x     | Framework web statique moderne          |
| [Tailwind CSS](https://tailwindcss.com/)                        | 4.x     | Framework CSS utility-first             |
| [React](https://react.dev/)                                     | 19.x    | Composants interactifs (si nécessaire)  |
| [Decap CMS](https://decapcms.org/)                              | -       | CMS headless pour la gestion de contenu |
| [Lucide](https://lucide.dev/)                                   | -       | Icônes SVG élégantes                    |
| [Netlify Identity](https://docs.netlify.com/security/identity/) | -       | Authentification pour le CMS            |

---

## 📁 Structure du projet

```
kitchen-portfolio/
├── public/
│   ├── admin/              # Configuration Decap CMS
│   │   ├── config.yml      # Schéma des collections
│   │   └── index.html      # Page d'admin CMS
│   ├── uploads/            # Images uploadées via CMS
│   └── favicon.svg
├── src/
│   ├── components/         # Composants Astro réutilisables
│   │   ├── Footer.astro
│   │   ├── Navbar.astro
│   │   └── ProjectCard.astro
│   ├── content/            # Contenu géré par le CMS
│   │   ├── config.ts       # Schémas Zod des collections
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
- ✅ **CMS intégré** - Gestion des projets via Decap CMS
- ✅ **Responsive** - Design adapté mobile/tablette/desktop
- ✅ **Galerie dynamique** - Affichage des projets mis en avant ou récents
- ✅ **Sitemap automatique** - Généré pour le référencement

---

## 📝 Gestion du contenu

L'administration du contenu se fait via **Decap CMS** :

1. Accéder à `/admin` sur le site déployé
2. Se connecter avec Netlify Identity
3. Ajouter/modifier des projets avec images et descriptions

---

## 🌐 Déploiement

Ce site est conçu pour être déployé sur **Netlify** :

1. Connecter le repository à Netlify
2. Activer Netlify Identity
3. Activer Git Gateway dans les paramètres Identity
4. Le site se déploie automatiquement à chaque push

---

## 📄 Licence

Projet personnel - Tous droits réservés © Florent DABERT
