do $$
declare
  seq_name text;
  next_member_id integer;
begin
  select pg_get_serial_sequence('public.members', 'member_id') into seq_name;

  if seq_name is null then
    raise exception 'No identity sequence found for public.members.member_id';
  end if;

  select coalesce(max(member_id), 0) + 1
  into next_member_id
  from public.members;

  execute format(
    'alter sequence %s restart with %s',
    seq_name,
    next_member_id
  );
end $$;
