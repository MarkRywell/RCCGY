# Add Shop Role Dashboard Plan

## Goal
Add a third member role, `shop`, that can sign in, access its own dashboard, and view/search the member list. A `shop` user must not have admin capabilities for creating, deleting, or managing other records. Per user decision, `shop` users should still be able to edit their own profile like normal members.

## Current Findings
- Roles are defined in the database enum `member_role` as `admin` and `member` in `supabase/migrations/20260512012814_create_members_table.sql`.
- Frontend role typing is `MemberRole = 'admin' | 'member'` in `src/types/members.ts`.
- Admin route access is enforced by `src/components/AdminGuard.tsx`, which only accepts `member.role === 'admin'`.
- Member route access is enforced by `src/components/MemberGuard.tsx`, which only accepts `member.role === 'member'`.
- Login and nav routing only understand `admin` and `member` in `src/pages/Login.tsx` and `src/layout/Nav.tsx`.
- `src/pages/Admin.tsx` wires more than user list viewing: invite, edit, delete, event CRUD, event photo upload, and attendance flows. A separate `/shop` page is safer than reusing `/admin` with conditionals.
- Backend admin mutations already check for `admin` only through RLS `is_admin()` or Edge Function role checks. These should remain admin-only.
- Existing `members` select RLS is public (`using (true)`). This means list data is not database-private today; this plan adds a shop-only dashboard UI but does not redesign public member-profile privacy unless explicitly requested later.

## Implementation Steps

1. Add the database role.
- Create a new Supabase migration, for example `supabase/migrations/<timestamp>_add_shop_member_role.sql`.
- Add `shop` to the enum with `alter type public.member_role add value if not exists 'shop';`.
- Do not change `public.is_admin()` to include `shop`; `shop` must not satisfy admin RLS policies.

2. Harden self-profile updates.
- Keep self-profile editing for `member` and `shop` users.
- Add a database trigger or equivalent policy hardening so non-admin users cannot update protected fields on their own `members` row, especially `role`, `user_id`, `email`, `member_id`, and `slug` unless the app intentionally supports slug/email changes.
- Recommended trigger behavior: before update on `public.members`, if `auth.uid() = old.user_id` and `public.is_admin()` is false, reject changes where protected columns differ from `old`.
- Leave admin updates/admin Edge Functions unchanged.

3. Update frontend role typing and role checks.
- Change `MemberRole` in `src/types/members.ts` to include `'shop'`.
- Update casts in `src/pages/Admin.tsx` from `'admin' | 'member'` to `MemberRole`.
- Update `src/layout/Nav.tsx` role state to include `shop` and recognize it when loading session/member data.
- Route profile/dashboard links as:
  - `admin` -> `/admin`
  - `shop` -> `/shop`
  - `member` -> existing member profile flow

4. Add a shop route and guard.
- Add a lazy-loaded `Shop` page in `src/App.tsx`.
- Add a `ShopGuard` component, or a small reusable role guard, that requires an authenticated member row with `role === 'shop'`.
- Add route: `/shop` -> `<ShopGuard><Shop /></ShopGuard>`.
- Update login redirect in `src/pages/Login.tsx` so `shop` users go to `/shop` after sign-in.
- Update nav logout visibility so `/shop` behaves like `/admin` and member profile routes.

5. Build the shop dashboard as read-only list/search.
- Create `src/pages/Shop.tsx`.
- Fetch members with `api.getMembers({ search, role })`, reusing the existing search behavior from `src/lib/supabase.ts`.
- Show a member list/search UI, preferably by refactoring `AdminUsersPanel` to support a read-only mode rather than duplicating the whole table.
- In read-only mode:
  - Show search input, role filter, pagination, member name, email, member ID, and photo preview/download if desired.
  - Include `Shop` in the role filter options and total label logic.
  - Hide all edit/delete actions.
  - Do not mount invite, edit, delete, event, attendance, or admin event modal flows.
- Keep UI labels shop-specific, for example sidebar/header text should say `Shop` or `Member Directory`, not `Admin`.

6. Update admin user management for the new role.
- Add `Shop` to `AdminUsersPanel` role filter options and count label logic.
- Update `InviteUserModal` to actually expose and submit the existing `role` form state, or remove dead role state if role assignment remains manual.
- Recommended: allow admins to invite `member`, `shop`, or `admin` only if that is acceptable for this app; otherwise allow `member` and `shop` only and keep admin promotion manual.
- Update `api.inviteMember` payload type in `src/lib/supabase.ts` to include optional `role?: MemberRole`.
- Update `supabase/functions/invite-member/index.ts` to validate the requested role against `member`, `shop`, and any allowed admin-invite policy, then insert the requested role instead of always inserting `member`.

7. Confirm backend mutation boundaries remain admin-only.
- Keep `supabase/functions/delete-member/index.ts` check as `callerMember?.role !== "admin"`.
- Keep `supabase/functions/upload-event-photo/index.ts` check as `member.role !== 'admin'`.
- Keep event/member insert/delete RLS using `public.is_admin()` only.
- Do not add `shop` to attendance/event write policies.

8. Validation plan.
- Run `npm run build`.
- Run `npm run lint` if existing lint state allows it.
- Apply/test migrations locally or in the target Supabase environment.
- Manual auth checks:
  - Admin can still access `/admin`, manage members/events/attendance, and invite users.
  - Shop can log in and lands on `/shop`.
  - Shop can search/filter/view the member list.
  - Shop cannot access `/admin`.
  - Shop dashboard has no create/edit/delete/event/attendance controls.
  - Shop can edit its own profile through the existing member profile flow if reachable by slug.
  - Shop cannot change its own `role` by direct API update.
  - Member still lands on their member profile and cannot access `/shop`.

## Risks And Notes
- The current public `members` select policy means hiding a list from normal members/public is only a UI distinction. A stricter privacy model would require a separate plan to split public profile fields from authenticated/admin/shop directory fields.
- The existing invite UI has role state but does not render a role selector and the Edge Function always inserts `member`; this must be fixed if shop users should be created from the admin UI.
- Avoid making `shop` pass `is_admin()`. Backend authorization should treat `shop` as read-only except for allowed own-profile edits.
