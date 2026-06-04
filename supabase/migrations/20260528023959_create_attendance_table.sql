create table attendance (
  id uuid primary key default gen_random_uuid(),

  member_id uuid not null
    references members(id)
    on delete cascade,

  event_id uuid not null
    references events(id)
    on delete cascade,

  checked_in_at timestamptz not null default now(),

  created_at timestamptz not null default now(),

  unique (member_id, event_id)
);

alter table attendance enable row level security;

create policy "Members can view own attendance"
on attendance
for select
using (
  exists (
    select 1
    from members
    where members.id = attendance.member_id
      and members.user_id = auth.uid()
  )
);

create policy "Admins can view all attendance"
on attendance
for select
using (
  public.is_admin()
);

create policy "Admins can insert attendance"
on attendance
for insert
with check (
  public.is_admin()
);