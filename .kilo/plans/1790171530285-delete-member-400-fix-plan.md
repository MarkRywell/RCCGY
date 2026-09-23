# Delete Member 400 Fix Plan

## Goal
Fix admin member deletion for members that have a Supabase Auth user, including active webapp users and invited users still waiting for verification/password setup. Also surface the real edge-function error in the UI when deletion still fails.

## Confirmed Context
- `Admin.tsx` deletes with `user.user_id ?? user.id`, and `delete-member` accepts either `members.user_id` or `members.id`, so the current client identifier flow is valid for UUID-backed rows.
- `members.user_id` is nullable and references `auth.users(id) on delete cascade`, so deleting an auth user should remove the member row when no other constraints block the auth delete.
- `events.created_by` references `auth.users(id)` without `ON DELETE SET NULL` or cascade. This can block `auth.admin.deleteUser()` for members/admins who have created events, producing a 400 from the edge function.
- The installed Supabase Functions client exposes non-2xx function response bodies through `error.context.json()` and also returns `response: error.context`.
- Pending invite users should still be deletable through `auth.admin.deleteUser(user_id)`; if they are not, the function needs better diagnostics and stale-auth cleanup handling.

## Decisions
- Keep `member_ref` as a UUID, not numeric `member_id`.
- Treat deletion as failed in the UI until the edge function returns success; do not close the confirmation modal on error.
- Preserve events when a user is deleted by clearing `events.created_by`, not deleting events.
- If a member row points to an auth user that no longer exists, delete the stale member row and return success.
- Keep self-delete and last-admin protections before any destructive cleanup.

## Implementation Tasks
1. Parse real edge-function errors in `src/lib/supabase.ts`.
   - Update `deleteMember` to mirror `inviteMember` error handling.
   - On invoke error, parse `data.response?.json()` first because this Supabase client returns the function `Response` there for `FunctionsHttpError`.
   - Fall back to `error.context.json()` only if needed and safely available.
   - Return `{ data: null, error: new Error(parsed.error ?? error.message) }`.

2. Keep failed deletes visible in `src/pages/Admin.tsx`.
   - Add a small `deleteError` state.
   - Clear `deleteError` when opening/canceling a delete confirmation.
   - In `confirmDelete`, if `api.deleteMember()` returns an error, set `deleteError`, log it, stop loading, and return before clearing `deleteConfirmId` or refetching.
   - Render `deleteError` inside the delete confirmation modal using the existing red error style pattern.

3. Harden `supabase/functions/delete-member/index.ts` response handling.
   - Add a small `json(status, body)` helper if it reduces duplicated response code.
   - Add `console.error` diagnostics for target lookup errors, member-row delete errors, event cleanup errors, auth lookup errors, and auth delete errors.
   - Return user-safe errors to the client, but include the underlying `.message` for expected Supabase operation errors.

4. Unblock auth deletion for active webapp/admin users.
   - After loading `targetMember` and passing self-delete/last-admin checks, clear event ownership for that auth user before deleting the auth user:
     `adminSupabase.from('events').update({ created_by: null }).eq('created_by', targetMember.user_id)`.
   - If event cleanup fails, return 400 before deleting anything else.
   - Then call `adminSupabase.auth.admin.deleteUser(targetMember.user_id)`.
   - This directly addresses the `events.created_by -> auth.users(id)` FK that can cause 400 on active users.

5. Handle members without auth and stale auth references.
   - Keep the existing no-`user_id` branch that deletes `members.id` directly.
   - Before `deleteUser`, call `auth.admin.getUserById(targetMember.user_id)` or handle the not-found error from `deleteUser`.
   - If the auth user is already missing, delete `members.id` directly and return success with a message indicating stale auth was cleaned up.
   - If `deleteUser` fails for any non-not-found reason after event cleanup, return 400 and leave the member row intact.

6. Add a database migration to prevent future FK blocking.
   - Add a new migration that changes `events.created_by` to `ON DELETE SET NULL`:
     `alter table public.events drop constraint if exists events_created_by_fkey;`
     `alter table public.events add constraint events_created_by_fkey foreign key (created_by) references auth.users(id) on delete set null;`
   - Keep `created_by` nullable.
   - Do not alter the existing duplicate-looking `created_by` migrations unless a reset/push validation exposes that as a separate migration problem.

## Validation Plan
1. Run `npm run lint`.
2. Run `npm run build`.
3. Run Supabase validation if local/remote credentials are available:
   - Deploy/apply the new migration.
   - Deploy the updated `delete-member` function.
   - Confirm `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` are configured for the deployed function.
4. Manual delete scenarios:
   - Delete a member with `user_id = null`; expect member row deletion.
   - Delete a pending invited member that has not completed verification/password setup; expect auth user and member row removed.
   - Delete an active member with no related `events.created_by`; expect auth user and member row removed.
   - Delete an active/admin member who created events; expect `events.created_by` set to `null`, auth user deleted, member row removed, and events preserved.
   - Delete a member whose `user_id` points to a missing auth user; expect stale member row removed.
   - Attempt deleting the logged-in admin; expect 400 `You cannot delete yourself` and no data changes.
   - Attempt deleting the last admin; expect 400 `Cannot delete the last admin` and no data changes.
5. If any 400 remains, confirm the modal displays the parsed error and Supabase invocation logs show the detailed server-side failure category.

## Risks And Notes
- The most likely concrete blocker for active users is the `events.created_by` FK without `ON DELETE SET NULL`.
- If pending invited users still fail after this change, the parsed error/logs should identify whether the deployed service-role secret is wrong, the auth user is stale, or Supabase Auth is returning a different delete constraint error.
- Service-role operations must stay inside the edge function.
- Attendance rows reference `members.id` with cascade, so member deletion will continue to remove attendance records.
