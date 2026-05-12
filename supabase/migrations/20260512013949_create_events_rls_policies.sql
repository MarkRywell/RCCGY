alter table events enable row level security;


create policy "Public can view events"
on events
for select
using (true);


create policy "Admins can insert events"
on events
for insert
with check (is_admin());


create policy "Admins can update events"
on events
for update
using (is_admin());


create policy "Admins can delete events"
on events
for delete
using (is_admin());