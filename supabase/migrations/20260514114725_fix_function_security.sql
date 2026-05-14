-- =========================================
-- FIX generate_slug() SEARCH PATH
-- =========================================

create or replace function public.generate_slug(input text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  return lower(
    regexp_replace(
      trim(input),
      '[^a-zA-Z0-9]+',
      '-',
      'g'
    )
  );
end;
$$;

-- =========================================
-- FIX set_member_slug() SEARCH PATH
-- =========================================

create or replace function public.set_member_slug()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_slug(new.name);
  end if;

  return new;
end;
$$;

-- =========================================
-- FIX is_admin() SECURITY
-- =========================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.members
    where user_id = auth.uid()
    and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from anon;
revoke execute on function public.is_admin() from authenticated;
revoke execute on function public.is_admin() from public;

-- =========================================
-- FIX rls_auto_enable() SECURITY
-- =========================================

revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
revoke execute on function public.rls_auto_enable() from public;