create type public.project_status as enum ('draft', 'published', 'archived');
create type public.project_origin as enum ('campus120', 'cheval-blanc', 'personal', 'other');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug)),
  title_fr text not null check (char_length(title_fr) between 2 and 120),
  title_en text,
  description_fr text,
  description_en text,
  content_fr text,
  content_en text,
  origin public.project_origin,
  status public.project_status not null default 'draft',
  main_image_path text,
  image_alt_fr text,
  image_alt_en text,
  tags text[] not null default '{}',
  techniques text[] not null default '{}',
  publication_authorized boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt_fr text,
  alt_en text,
  position integer not null default 0 check (position >= 0),
  focal_x numeric(5, 4) not null default 0.5 check (focal_x between 0 and 1),
  focal_y numeric(5, 4) not null default 0.5 check (focal_y between 0 and 1),
  created_at timestamptz not null default now()
);

create table public.homepage_featured (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  position smallint not null check (position between 1 and 6),
  created_at timestamptz not null default now(),
  unique (position)
);

create table public.site_sections (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  title_fr text not null,
  title_en text not null,
  enabled boolean not null default true,
  position smallint not null check (position >= 0),
  variant text not null default 'grid' check (variant in ('hero', 'editorial', 'grid', 'timeline', 'contact')),
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create index projects_status_published_at_idx on public.projects (status, published_at desc);
create index projects_origin_idx on public.projects (origin);
create index project_media_project_position_idx on public.project_media (project_id, position);
create index site_sections_position_idx on public.site_sections (position);

insert into public.site_sections (id, title_fr, title_en, position, variant) values
  ('hero', 'Introduction', 'Introduction', 0, 'hero'),
  ('featured', 'À la une', 'Featured work', 1, 'editorial'),
  ('journey', 'Mon parcours', 'My journey', 2, 'timeline'),
  ('contact', 'Contact', 'Contact', 3, 'contact');

alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.homepage_featured enable row level security;
alter table public.site_sections enable row level security;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.project_media from anon, authenticated;
revoke all on table public.homepage_featured from anon, authenticated;
revoke all on table public.site_sections from anon, authenticated;

grant select on table public.projects to anon;
grant select, insert, update, delete on table public.projects to authenticated;
grant select on table public.project_media to anon;
grant select, insert, update, delete on table public.project_media to authenticated;
grant select on table public.homepage_featured to anon;
grant select, insert, update, delete on table public.homepage_featured to authenticated;
grant select on table public.site_sections to anon;
grant select, insert, update, delete on table public.site_sections to authenticated;

create policy "Published projects are public"
on public.projects for select
to anon, authenticated
using (status = 'published' and publication_authorized = true);

create policy "Editors can read every project"
on public.projects for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can create projects"
on public.projects for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can update projects"
on public.projects for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can delete projects"
on public.projects for delete
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Published project media are public"
on public.project_media for select
to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = project_media.project_id
    and projects.status = 'published'
    and projects.publication_authorized = true
));

create policy "Editors can read all project media"
on public.project_media for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can create project media"
on public.project_media for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can update project media"
on public.project_media for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can delete project media"
on public.project_media for delete
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Published featured selection is public"
on public.homepage_featured for select
to anon, authenticated
using (exists (
  select 1 from public.projects
  where projects.id = homepage_featured.project_id
    and projects.status = 'published'
    and projects.publication_authorized = true
));

create policy "Editors can read all featured entries"
on public.homepage_featured for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can create featured entries"
on public.homepage_featured for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can update featured entries"
on public.homepage_featured for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can delete featured entries"
on public.homepage_featured for delete
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Site section layout is public"
on public.site_sections for select
to anon, authenticated
using (true);

create policy "Editors can read all site sections"
on public.site_sections for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Editors can update site sections"
on public.site_sections for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'));

create policy "Admins can insert site sections"
on public.site_sections for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete site sections"
on public.site_sections for delete
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Published portfolio media are publicly readable"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.project_media
    join public.projects on projects.id = project_media.project_id
    where project_media.storage_path = storage.objects.name
      and projects.status = 'published'
      and projects.publication_authorized = true
  )
);

create policy "Editors can read all portfolio media"
on storage.objects for select
to authenticated
using (
  bucket_id = 'portfolio-media'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor')
);

create policy "Editors can upload portfolio media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor')
);

create policy "Editors can update portfolio media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor')
)
with check (
  bucket_id = 'portfolio-media'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor')
);

create policy "Editors can delete portfolio media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor')
);
