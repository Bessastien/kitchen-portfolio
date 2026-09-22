begin;
select plan(9);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.projects'::regclass),
  'projects has RLS enabled'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.project_media'::regclass),
  'project_media has RLS enabled'
);

select ok(
  not has_function_privilege('anon', 'public.replace_homepage_featured(uuid[])', 'execute'),
  'anonymous visitors cannot call the featured-selection function'
);

set local role anon;

select results_eq(
  $$select count(*)::bigint from public.site_sections$$,
  array[4::bigint],
  'anonymous visitors can read enabled site sections'
);

select throws_ok(
  $$insert into public.projects (slug, title_fr) values ('anonymous-write', 'Refus attendu')$$,
  '42501',
  'permission denied for table projects',
  'anonymous visitors cannot create projects'
);

reset role;
select set_config('request.jwt.claims', '{"app_metadata":{"role":"admin"}}', true);
set local role authenticated;

select lives_ok(
  $$insert into public.projects (slug, title_fr) values ('draft-test', 'Brouillon autorisé')$$,
  'an administrator can create a draft'
);

select throws_ok(
  $$insert into public.projects (slug, title_fr, status) values ('unsafe-publication', 'Publication incomplète', 'published')$$,
  '23514',
  'new row for relation "projects" violates check constraint "published_projects_are_ready"',
  'an incomplete project cannot be published'
);

select lives_ok(
  $$
    with inserted as (
      insert into public.projects (
        slug,
        title_fr,
        status,
        publication_authorized,
        main_image_path,
        published_at
      ) values (
        'ready-publication',
        'Publication complète',
        'published',
        true,
        'tests/ready.jpg',
        now()
      )
      returning id
    )
    select public.replace_homepage_featured(array_agg(id)) from inserted
  $$,
  'an authorized published project can atomically replace the featured selection'
);

select results_eq(
  $$select count(*)::bigint from public.homepage_featured$$,
  array[1::bigint],
  'the featured selection contains the published project'
);

select * from finish();
rollback;
