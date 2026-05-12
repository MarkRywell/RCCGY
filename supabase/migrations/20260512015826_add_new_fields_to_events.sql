alter table events
add column created_by uuid references auth.users(id);

alter table events
add column updated_at timestamptz default now();