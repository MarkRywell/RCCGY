alter table public.events
drop constraint if exists events_created_by_fkey;

alter table public.events
add constraint events_created_by_fkey
foreign key (created_by)
references auth.users(id)
on delete set null;
