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


create policy "Public can view members"
on members
for select
using (true);


create policy "Users can update own profile or admins"
on members
for update
using (
  auth.uid() = user_id
  or is_admin()
);


create policy "Admins can insert members"
on members
for insert
with check (is_admin());


create policy "Admins can delete members"
on members
for delete
using (is_admin());