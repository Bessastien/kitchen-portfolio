# Configuration Supabase du portfolio

Cette intégration alimente la future administration accessible sur `/studio`. Tant que les variables Supabase ne sont pas présentes, l'écran fonctionne en mode aperçu local et n'écrit aucune donnée distante.

## Mise en service

1. Créer un projet Supabase dans une région européenne adaptée.
2. Copier `.env.example` vers `.env` et renseigner uniquement l'URL du projet et la clé **publishable**. Ne jamais placer la clé `service_role` dans une variable `PUBLIC_`.
3. Lier le projet avec `npx supabase link`, puis appliquer les migrations avec le workflow Supabase retenu pour l'environnement.
4. Le bucket privé `portfolio-media` est créé automatiquement par les migrations, avec une limite de 12 Mio et uniquement les formats JPEG, PNG, WebP et AVIF.
5. Créer le compte de Florent dans Auth, en inscription sur invitation uniquement.
6. Attribuer le rôle dans `app_metadata` : `{ "role": "admin" }`. Les rôles acceptés par les politiques RLS sont `admin` et `editor`.
7. Ajouter les URL locales et Netlify autorisées dans la configuration Auth.

## Sécurité

- Toutes les tables exposées ont RLS activé et des `GRANT` explicites.
- Le public ne voit que les créations `published` dont `publication_authorized` est vrai.
- Les fichiers restent privés tant qu’ils ne sont pas reliés à une création publiée et autorisée. Le Studio utilise des liens temporaires signés pour ses aperçus.
- Les décisions d'autorisation utilisent `app_metadata`, jamais `user_metadata`.
- La clé privilégiée `service_role` ne doit jamais être utilisée dans le navigateur.
- Après application sur un projet réel, exécuter les Database Advisors et tester chaque opération en tant que visiteur, éditeur et administrateur.

## Vérifications locales

Une fois la pile locale démarrée, les commandes suivantes vérifient la migration, les politiques RLS et les règles de publication :

```bash
npx supabase db reset --local
npx supabase db lint --local --schema public --level warning --fail-on warning
npx supabase test db --local
npx supabase db advisors --local --type security --level warn --fail-on warn
```

La sélection à la une est remplacée dans une transaction unique par `replace_homepage_featured`. La fonction n’est accessible qu’aux comptes authentifiés et les politiques RLS continuent de contrôler ses écritures.
