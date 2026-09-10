# Fix Delete Member ID Contract

## Problem

Deleting a member can return `Member not found` from `supabase/functions/delete-member/index.ts`.

Evidence from the Supabase log:

- The function receives `028bba68-eff4-4168-9d04-a092942ecb66`.
- It queries `members.user_id = 028bba68-eff4-4168-9d04-a092942ecb66`.
- PostgREST returns `PGRST116` because no row matches that `user_id`.

Relevant code:

- `src/pages/Admin.tsx:56-59` stores `user.user_id ?? user.id` in `deleteConfirmId`.
- `src/lib/supabase.ts:214-226` sends that value as `user_id` to the edge function.
- `supabase/functions/delete-member/index.ts:128-133` looks up the target using `.eq("user_id", user_id)`.
- `supabase/functions/delete-member/index.ts:187-193` has a fallback for missing `targetMember.user_id`, but deletes `.eq("id", user_id)`, which implies the request value is sometimes actually `members.id`.

The implementation currently mixes two different IDs:

- `members.id`: the member table row UUID.
- `members.user_id`: the Supabase Auth user UUID, nullable.

## Decision

Use `members.id` as the delete request identifier.

Reasons:

- The admin user list is sourced from the `members` table, so `members.id` is always available.
- `members.user_id` is nullable, and the code already intends to support deleting member rows that do not have an auth user.
- Attendance records reference `members(id)` with `ON DELETE CASCADE`, so deleting by member row id is the correct data ownership boundary.
- The edge function can still delete the linked auth user by reading `targetMember.user_id` after finding the member row.

## Implementation Tasks

1. Update the frontend delete state naming in `src/pages/Admin.tsx`.

   - Rename `deleteConfirmId` to something unambiguous like `deleteConfirmMemberId`.
   - In `handleDelete`, always store `user.id`; do not fall back to `user.user_id`.
   - In `confirmDelete`, pass the stored member row id to `api.deleteMember`.
   - Keep existing modal behavior and refetch behavior unchanged.

2. Update the client API wrapper in `src/lib/supabase.ts`.

   - Rename the parameter from `userId` to `memberId`.
   - Invoke the edge function with body `{ member_id: memberId }` instead of `{ user_id: userId }`.
   - Remove the temporary `console.log(error)` unless local debugging is still explicitly desired.
   - Return `{ data, error }` as it does today.

3. Update the edge function request parsing in `supabase/functions/delete-member/index.ts`.

   - Parse `const { member_id } = await req.json();`.
   - Validate `member_id`; return `400` with `member_id is required` if missing.
   - Keep the authenticated caller lookup and admin authorization check.
   - Include the caller member row id in the admin check query, e.g. select `id, role`, so self-delete can compare member row ids.

4. Update self-delete protection.

   - Replace `if (user_id === user.id)` with a member-row comparison such as `if (member_id === callerMember.id)`.
   - This is safer because the request id is now `members.id`, not `auth.users.id`.

5. Update target member lookup.

   - Query the target with `.eq("id", member_id)`.
   - Select at least `id, role, user_id`.
   - If no target member exists, return `404 Member not found`.
   - Use `.maybeSingle()` instead of `.single()` if the implementation wants to avoid treating the normal not-found path as a logged query error.

6. Preserve last-admin protection.

   - Keep the existing count of `members.role = admin`.
   - If deleting an admin and admin count is `<= 1`, return `400 Cannot delete the last admin`.

7. Update deletion behavior.

   - If `targetMember.user_id` exists, call `adminSupabase.auth.admin.deleteUser(targetMember.user_id)`.
   - Rely on `ON DELETE CASCADE` from `members.user_id references auth.users(id) on delete cascade` to remove the member row.
   - If `targetMember.user_id` is null, delete directly from `members` with `.eq("id", member_id)`.
   - Check and return any direct member delete error instead of always returning success.

8. Clean up logs.

   - Remove or reduce the `console.log("Target member:", ...)` debug output after confirming the fix.
   - If retaining logs, log `member_id` and target presence only, not full error objects for expected not-found cases.

## Validation Plan

1. Type/build check.

   - Run the project’s existing frontend validation command, likely `npm run build` or `npm run lint` depending on available scripts.

2. Edge function static check.

   - Run a Deno check if available for `supabase/functions/delete-member/index.ts`.
   - If Deno is not installed locally, deploy/test through Supabase after code review.

3. Manual Supabase scenarios.

   - Delete a normal invited member with a non-null `user_id`; expected result: auth user is deleted and the member row disappears via cascade.
   - Delete a member row with `user_id = null`; expected result: member row is deleted directly.
   - Attempt to delete the currently signed-in admin; expected result: `400 You cannot delete yourself`.
   - Attempt to delete the only admin; expected result: `400 Cannot delete the last admin`.
   - Attempt to delete a fake member id; expected result: `404 Member not found`.

## Rollout Notes

- Deploy the updated `delete-member` edge function after changing the frontend request body.
- The frontend and edge function should be deployed together because the request field changes from `user_id` to `member_id`.
- No database migration is required.

## Risks

- If any other client invokes `delete-member` with `{ user_id }`, it will need to be updated to `{ member_id }`.
- If backward compatibility for existing external callers is required, add explicit support for both `member_id` and `user_id`; otherwise avoid compatibility code to keep the contract clean.
