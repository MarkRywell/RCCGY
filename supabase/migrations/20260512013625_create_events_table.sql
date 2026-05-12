create table events (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  description text,
  location text,
  event_date timestamptz not null,

  photo_url text,

  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);