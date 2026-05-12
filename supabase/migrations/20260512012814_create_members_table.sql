create type member_role as enum ('admin', 'member');

create table members (
  id uuid primary key default gen_random_uuid(),

  user_id uuid unique references auth.users(id) on delete cascade,

  name text not null,
  email text,
  phone text,

  role member_role not null default 'member',

  profile_picture_url text,

  time_5k text,
  time_10k text,
  time_half_marathon text,
  time_marathon text,

  created_at timestamptz default now()
);

alter table members enable row level security;