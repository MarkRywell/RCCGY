-- =========================================
-- is_admin() FIXED (secure + RLS compatible)
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

-- allow RLS to use it (IMPORTANT)
grant execute on function public.is_admin() to authenticated;

-- block public access
revoke execute on function public.is_admin() from anon;
revoke execute on function public.is_admin() from public;


-- =========================================
-- rls_auto_enable() SECURITY (locked down)
-- =========================================

revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
revoke execute on function public.rls_auto_enable() from public;