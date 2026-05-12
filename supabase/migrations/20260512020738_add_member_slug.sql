-- =========================================
-- 1. ADD SLUG COLUMN (PUBLIC PROFILE URL)
-- =========================================

alter table members
add column slug text unique;


-- =========================================
-- 2. OPTIONAL: AUTO-GENERATE SLUG FUNCTION
-- =========================================

create or replace function generate_slug(input text)
returns text
language plpgsql
as $$
begin
  return lower(
    regexp_replace(input, '[^a-zA-Z0-9]+', '-', 'g')
  );
end;
$$;


-- =========================================
-- 3. OPTIONAL: AUTO SET SLUG ON INSERT
-- =========================================

create or replace function set_member_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null then
    new.slug := generate_slug(new.name);
  end if;

  return new;
end;
$$;

create trigger trigger_set_member_slug
before insert on members
for each row
execute function set_member_slug();


-- =========================================
-- 4. RLS ENABLE
-- =========================================

alter table members enable row level security;


-- =========================================
-- 5. ADMIN CHECK FUNCTION (SECURE)
-- =========================================

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from members
    where user_id = auth.uid()
    and role = 'admin'
  );
$$;