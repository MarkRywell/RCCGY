create or replace function public.generate_slug(input text)
returns text
language plpgsql
set search_path = public
as $$
begin
  return lower(
    regexp_replace(
      trim(input),
      '[^a-zA-Z0-9]+',
      '-',
      'g'
    )
  );
end;
$$;