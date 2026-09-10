# Fix Member ID Identity Sequence

## Context
- `supabase/migrations/20260908111325_add_member_details_fields.sql` adds `members.member_id integer generated always as identity unique`.
- Deleting `member_id = 3` should not cause the next created member to reuse `3`; identity columns normally keep increasing and allow gaps.
- The observed `duplicate key value violates unique constraint "members_member_id_key"` means the identity sequence is returning a value that already exists in `members.member_id`, or a create path is explicitly sending `member_id`.
- `supabase/functions/invite-member/index.ts` inserts members without `member_id`, so the invite flow likely depends on the database sequence.
- `src/lib/supabase.ts` has `createMember(payload: Partial<Member>)`, which is too permissive and could allow accidental `member_id` insertion if that helper is later used.

## Decisions
- Do not reuse deleted `member_id` values. Keep `member_id` as a stable public identifier with possible gaps.
- Repair the database sequence so the next generated value is greater than the current maximum `member_id`.
- Prevent application code from inserting or updating `member_id` directly.

## Implementation Plan
1. Add a new Supabase migration after `20260908111325_add_member_details_fields.sql` to realign the identity sequence.

   ```sql
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
   ```

2. Verify the current database before/after migration with these SQL checks in Supabase SQL Editor or `supabase db` tooling:

   ```sql
   select max(member_id) as max_member_id from public.members;

   select pg_get_serial_sequence('public.members', 'member_id') as sequence_name;
   ```

3. Confirm the next generated value does not collide by inserting a test member through the same invite/create path used in the app, not by manually supplying `member_id`.

4. Harden TypeScript insert/update payloads:
- Replace `createMember(payload: Partial<Member>)` with a type that omits generated/read-only fields such as `id`, `member_id`, `created_at`, and any auth-derived fields that should not be client controlled.
- Replace `updateMember(id, payload: Partial<Member>)` with a type that omits `id`, `member_id`, `user_id`, and `created_at`.
- Keep `member_id` present on the read `Member` type.

5. Review `supabase/functions/delete-member/index.ts` separately for a related but distinct issue:
- The function receives a variable named `user_id`, but `Admin.tsx` passes `user.user_id ?? user.id`.
- The function looks up targets with `.eq("user_id", user_id)`, so members without `user_id` cannot be found even though there is later code intended to delete them by `id`.
- Rename the request field to something neutral like `member_ref` or send both `member_id`/`user_id` explicitly, then query by `user_id` when present and by `id` when deleting auth-less members.
- This delete-function cleanup is not required to fix the duplicate identity value, but it should be handled to avoid failed deletes for auth-less member rows.

## Validation
- Run the new migration against the affected database.
- Query `select member_id from public.members order by member_id;` and confirm existing values are unique.
- Create a new member and confirm it receives `max(previous member_id) + 1`, e.g. with current members `1,2,4,5,6,7`, the new member should become `8`, not `3`.
- Delete a member and create another member; confirm the new ID continues increasing and does not reuse the deleted value.
- Type-check the frontend after payload type changes.

## Immediate Production Repair
If you need to fix the current Supabase database before shipping a migration, run this one-time SQL in the Supabase SQL Editor:

```sql
select setval(
  pg_get_serial_sequence('public.members', 'member_id'),
  coalesce((select max(member_id) from public.members), 0) + 1,
  false
);
```

After this, the next generated `member_id` should be one greater than the current max.
