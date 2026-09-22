alter table public.projects
  add constraint published_projects_are_ready
  check (
    status <> 'published'
    or (
      publication_authorized = true
      and main_image_path is not null
      and published_at is not null
    )
  );

comment on constraint published_projects_are_ready on public.projects is
  'A public project must have an authorized image and a publication timestamp.';

create function public.replace_homepage_featured(project_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if cardinality(project_ids) > 6 then
    raise exception 'The homepage can feature at most six projects.';
  end if;

  if (select count(*) from unnest(project_ids))
     <> (select count(distinct value) from unnest(project_ids) as ids(value)) then
    raise exception 'A project cannot appear twice in the featured selection.';
  end if;

  if exists (
    select 1
    from unnest(project_ids) as selected(project_id)
    left join public.projects on projects.id = selected.project_id
    where projects.id is null
      or projects.status <> 'published'
      or projects.publication_authorized = false
  ) then
    raise exception 'Only authorized, published projects can be featured.';
  end if;

  delete from public.homepage_featured;

  insert into public.homepage_featured (project_id, position)
  select project_id, position::smallint
  from unnest(project_ids) with ordinality as selected(project_id, position);
end;
$$;

revoke all on function public.replace_homepage_featured(uuid[]) from public, anon;
grant execute on function public.replace_homepage_featured(uuid[]) to authenticated;
