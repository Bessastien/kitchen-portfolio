-- The original portfolio is now managed from the Studio as well as from the
-- repository. Existing pictures remain in /public/uploads, so their public URL
-- is kept separately from files uploaded later to Supabase Storage.
alter table public.projects add column main_image_url text;

alter table public.projects drop constraint published_projects_are_ready;
alter table public.projects add constraint published_projects_are_ready
  check (
    status <> 'published'
    or (
      publication_authorized = true
      and (main_image_path is not null or main_image_url is not null)
      and published_at is not null
    )
  );

update public.site_sections
set settings = jsonb_build_object(
  'eyebrow_fr', 'Pâtissier · Poitiers · France',
  'title_fr', 'Je veux faire du dessert le dernier souvenir.',
  'body_fr', 'Je travaille les desserts de restaurant, les entremets et les créations de saison. Je construis ce portfolio au fil de ma formation et de mes expériences.',
  'eyebrow_en', 'Pastry chef · Poitiers · France',
  'title_en', 'I want dessert to become the lasting memory.',
  'body_en', 'I create restaurant desserts, entremets and seasonal pastries. This portfolio grows alongside my training and professional experience.',
  'hero_image_url', '/uploads/IMG_1882.jpeg',
  'hero_image_alt_fr', 'Entremets aux agrumes de Florent Dabert',
  'hero_image_alt_en', 'Florent Dabert citrus entremets',
  'portrait_image_url', null,
  'portrait_image_alt', 'Florent Dabert'
)
where id = 'hero' and settings = '{}'::jsonb;

insert into public.projects (
  slug, title_fr, title_en, description_fr, description_en, tags, origin,
  status, publication_authorized, published_at, main_image_url
) values
  ('buche-full-chocolat', 'Bûche au chocolat noir et au chocolat au lait', 'Dark and milk chocolate yule log', 'Une bûche réalisée pour Noël autour de deux intensités de chocolat.', 'A Christmas yule log built around two intensities of chocolate.', array['Pâtisserie','Bûche','Chocolat'], 'personal', 'published', true, '2026-03-14T16:13:00Z', '/uploads/img_2033.jpeg'),
  ('choux-et-glace-vanille', 'Choux et glace à la vanille', 'Choux with vanilla ice cream', 'Choux craquelin, glace à la vanille, chantilly et caramel au beurre salé.', 'Craquelin choux, vanilla ice cream, whipped cream and salted butter caramel.', array['Pâtisserie','Choux','Glace','Vanille','Chantilly'], 'campus120', 'published', true, '2026-03-14T16:39:00Z', '/uploads/D1F4E26B-BD62-4E11-8436-33742A441E71.JPG'),
  ('choux-a-la-creme', 'Choux à la crème', 'Cream puffs', 'Choux craquelin garnis de crème pâtissière.', 'Craquelin choux filled with pastry cream.', array['Pâtisserie','Choux'], 'personal', 'published', true, '2026-03-14T16:14:00Z', '/uploads/img_1189.jpeg'),
  ('dome-caramel', 'Dômes aux fruits rouges et au spéculoos', 'Red berry and speculoos domes', 'Mousse à la vanille, insert aux fruits rouges et coulis de spéculoos.', 'Vanilla mousse, red berry insert and speculoos coulis.', array['Pâtisserie','Fruits rouges','Spéculoos','Dôme'], 'campus120', 'published', true, '2026-03-14T16:15:00Z', '/uploads/img_2233.jpg'),
  ('dome-entremet', 'Dôme entremets aux agrumes', 'Citrus entremets dome', 'Une déclinaison individuelle de l''entremets aux agrumes, réalisée en formation.', 'An individual version of the citrus entremets, created during training.', array['Pâtisserie','Agrumes'], 'campus120', 'published', true, '2026-03-14T16:31:00Z', '/uploads/IMG_2014.jpeg'),
  ('entremet-sureau-vanille-fraise', 'Entremets au sureau, à la vanille et à la fraise', 'Elderflower, vanilla and strawberry entremets', 'Mousse au sureau et à la vanille, insert fraise, biscuit citron-amande et glaçage miroir.', 'Elderflower and vanilla mousse, strawberry insert, lemon-almond sponge and mirror glaze.', array['Pâtisserie','Entremets','Sureau','Vanille','Fraise'], 'cheval-blanc', 'published', true, '2026-03-14T16:51:00Z', '/uploads/img_3425.jpeg'),
  ('entremet-vanille-fruits-rouges', 'Entremets à la vanille et aux fruits rouges', 'Vanilla and red berry entremets', 'Mousse à la vanille, insert aux fruits rouges et génoise.', 'Vanilla mousse, red berry insert and sponge.', array['Pâtisserie','Vanille','Fruits rouges','Entremets'], 'campus120', 'published', true, '2026-03-14T16:29:00Z', '/uploads/IMG_2034.jpeg'),
  ('flan-patissier', 'Flan pâtissier', 'French custard tart', 'Un flan pâtissier à la texture fondante.', 'A French custard tart with a smooth, melting texture.', array['Pâtisserie','Flan'], 'personal', 'published', true, '2026-03-14T16:47:00Z', '/uploads/img_2594.jpeg'),
  ('gateau-aux-fruits-rouges-anniversaire', 'Entremets aux fruits rouges et à la vanille', 'Red berry and vanilla entremets', 'Mousse à la vanille, insert aux fruits rouges et biscuit au spéculoos.', 'Vanilla mousse, red berry insert and speculoos sponge.', array['Pâtisserie','Fruits rouges','Vanille','Entremets','Spéculoos'], 'personal', 'published', true, '2026-03-14T16:20:00Z', '/uploads/img_2231.jpg'),
  ('gateau-colore', 'Entremets aux agrumes', 'Citrus entremets', 'Biscuit citron-amande, insert clémentine, mousse à l''orange et glaçage miroir.', 'Lemon-almond sponge, clementine insert, orange mousse and mirror glaze.', array['Pâtisserie','Entremets','Agrumes'], 'campus120', 'published', true, '2026-03-14T16:22:00Z', '/uploads/IMG_1882.jpeg'),
  ('moelleux-au-chocolat', 'Moelleux au chocolat', 'Chocolate fondant cake', 'Un moelleux au chocolat réalisé en formation.', 'A chocolate fondant cake created during training.', array['Pâtisserie','Chocolat'], 'campus120', 'published', true, '2026-01-13T23:09:00Z', '/uploads/BA2CEE01-98ED-4284-8613-2A581A5F7DBC.JPG'),
  ('tarte-citron-meringuee', 'Tarte au citron meringuée', 'Lemon meringue tart', 'Une tarte au citron garnie d''une meringue légère.', 'A lemon tart topped with a light meringue.', array['Pâtisserie','Citron','Meringue'], 'personal', 'published', true, '2026-03-14T16:41:00Z', '/uploads/IMG_2595.jpeg'),
  ('tartelettes', 'Assortiment de tartelettes', 'Assorted tartlets', 'Un assortiment de tartelettes à compléter avec les parfums et techniques utilisés.', 'An assortment of tartlets; flavours and techniques to be added.', array['Pâtisserie'], 'personal', 'published', true, '2026-03-14T16:56:00Z', '/uploads/IMG_2292.jpeg')
on conflict (slug) do nothing;

insert into public.homepage_featured (project_id, position)
select id, row_number() over ()::smallint
from public.projects
where slug in ('gateau-colore', 'choux-a-la-creme', 'entremet-sureau-vanille-fraise')
order by case slug
  when 'gateau-colore' then 1
  when 'choux-a-la-creme' then 2
  when 'entremet-sureau-vanille-fraise' then 3
end
on conflict (project_id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 12582912, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Editors can manage site assets"
on storage.objects for all
to authenticated
using (bucket_id = 'site-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'))
with check (bucket_id = 'site-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));
