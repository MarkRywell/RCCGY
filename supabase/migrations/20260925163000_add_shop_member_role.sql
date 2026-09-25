alter type public.member_role add value if not exists 'shop';

create or replace function public.prevent_non_admin_member_identity_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.user_id and not public.is_admin() then
    if new.role is distinct from old.role
      or new.user_id is distinct from old.user_id
      or new.email is distinct from old.email
      or new.member_id is distinct from old.member_id
      or new.slug is distinct from old.slug then
      raise exception 'Only admins can update protected member fields';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_member_identity_changes on public.members;

create trigger prevent_non_admin_member_identity_changes
before update on public.members
for each row
execute function public.prevent_non_admin_member_identity_changes();

grant execute on function public.prevent_non_admin_member_identity_changes() to authenticated;
revoke execute on function public.prevent_non_admin_member_identity_changes() from anon;
revoke execute on function public.prevent_non_admin_member_identity_changes() from public;
