# Member Search Directory Plan

## Goal
Add a member-only directory page where signed-in members can search other members, view results in a table similar to `AdminUsersPanel`, and open a clicked member's existing public profile in a new browser tab.

## Decisions
- Directory access: member-only, protected with the existing `MemberGuard`.
- Profile destination: reuse existing public route `/member/:slug` and `MemberProfile` public visibility behavior.
- Display name: use the existing `slug` as the display name/username because the schema and `Member` type do not have a separate `display_name` column.
- Results should include only role `member`; admins should continue using the admin users panel.
- Opening a member should use a real new tab, via an anchor with `target="_blank"` and `rel="noopener noreferrer"`, or equivalent `window.open` with noopener handling.

## Affected Files
- `src/App.tsx`: add lazy import and protected route.
- `src/pages/MemberDirectory.tsx`: new page for search, loading, table, empty state, and pagination if desired.
- `src/lib/supabase.ts`: add a directory-specific API method that fetches only public fields.
- `src/types/members.ts`: optionally add a narrow exported type for directory rows.
- `src/layout/Nav.tsx`: add a `MEMBERS` navigation entry for authenticated member-role users on desktop and mobile.

## Implementation Steps
1. Add a public-safe directory row type, for example `MemberDirectoryRow`, containing `id`, `member_id`, `slug`, `name`, optional `profile_picture_url`, and optional `created_at`.
2. Add `api.getMemberDirectory(opts?: { search?: string })` in `src/lib/supabase.ts`.
3. In that API method, query `members` with an explicit select list, filter `role.eq.member`, and order by `name` or `created_at` consistently.
4. Search should match `name.ilike`, `slug.ilike`, and exact numeric `member_id`; do not search or return `email`, `address`, phone, emergency contact, or other private fields.
5. Create `src/pages/MemberDirectory.tsx` with local state for `search`, `loading`, `members`, and current page.
6. Render a responsive table styled similarly to `AdminUsersPanel`, but with no actions column. Suggested columns: `Name`, `Display Name`, and `Member ID`.
7. Make each row/name a clickable link to `/member/${member.slug}` that opens in a new tab. Disable or omit navigation if `slug` is missing, though current invites should create slugs.
8. Add loading and empty states: `Loading...` and `No members found`.
9. Add route under `PublicLayout`: `/members` rendered as `<MemberGuard><MemberDirectory /></MemberGuard>`.
10. Add a member-only nav link to `/members` in `Nav.tsx` once `authReady` is true and `memberRole === 'member'`; include it in both desktop and mobile menus.
11. Keep `/member/:slug` unchanged unless testing reveals a regression; it already hides owner-only private details for non-owners.

## Edge Cases
- Empty search should show all member-role records, paginated if pagination is included.
- Numeric search such as `12` should match member ID `12`, not only text fields.
- A row with a missing slug should not create a broken new tab; render disabled text or skip the row link.
- If Supabase returns an error, log it and show an empty state or a concise error message.
- Admin users are outside this directory's primary path because `MemberGuard` currently accepts only role `member`.

## Validation
- Run `npm run build`.
- Run `npm run lint` if the current project lint setup is expected to pass.
- Manual checks:
  - Signed-out visitor opening `/members` is redirected by `MemberGuard`.
  - Signed-in member sees the `MEMBERS` nav link on desktop and mobile.
  - Searching by name, slug/username, and numeric member ID filters results correctly.
  - Clicking a member opens `/member/<slug>` in a new tab.
  - The opened profile shows only public profile visibility for other members.

## Risks
- Current database RLS allows public select on all `members` rows, so client-side privacy depends partly on careful select lists. This plan avoids exposing extra fields in the new directory API but does not change existing RLS or `MemberProfile` behavior.
- If product requirements later need a separate display name from username, a schema migration and invite/edit form changes will be needed; that is intentionally out of scope for this feature.
