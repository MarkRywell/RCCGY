# Admin Users Pagination Plan

## Goal
Add client-side pagination to `src/components/AdminUsersPanel.tsx`, show the total number of currently displayed users based on the active search and role filter, and keep the pagination controls visually stable when the last page has fewer rows.

## Current Context
- `src/pages/Admin.tsx` owns `users`, `userSearch`, and `userRoleFilter`.
- `refetchUsers()` calls `api.getMembers({ search, role })`, so the `users` prop passed to `AdminUsersPanel` is already filtered by search and role.
- `AdminUsersPanel` now paginates locally with `pageSize = 10`, renders `paginatedUsers`, and displays pagination outside the table card after the rows.
- Because the rows container height is based only on rendered rows, the external pagination block moves upward on pages with fewer than 10 users.

## Decisions
- Keep pagination local to `AdminUsersPanel`; do not change the Supabase/API fetching flow.
- Keep the pagination controls outside the rows/table card, as currently moved by the user.
- Use client-side pagination by slicing the already-filtered `users` array.
- Use a fixed page size of 10 users per page.
- Display totals from `users.length`, which is the filtered result count.
- Stabilize pagination position by reserving vertical space for a full page of rows in the table body.
- Do not add placeholder fake user rows because they can confuse screen readers and make the table appear to contain more records than it does.
- Keep the zero-result state compact enough to show `No users found`; layout stability mainly applies when paginating real results.

## Implementation Tasks
1. In `src/components/AdminUsersPanel.tsx`, keep existing pagination state and derived values:
   - `pageSize = 10`
   - `currentPage`
   - `totalUsers`
   - `totalPages`
   - `pageStart`
   - `pageEnd`
   - `paginatedUsers`
2. Ensure `paginatedUsers.map(...)` remains the render source for user rows.
3. Add a stable minimum height to the rows container at line around the current `<div className="divide-y divide-white/5">`.
4. Recommended minimal class update:
   - Change it to `className="min-h-[440px] divide-y divide-white/5"`.
   - Rationale: each row uses `py-3` plus text height, roughly `44px`; `10 * 44px = 440px` reserves one full page.
5. If visual testing shows rows are slightly taller or shorter, adjust the min-height only, not the pagination logic.
6. Keep `RowLoading` and `EmptyState` inside the same rows container.
7. Keep pagination controls outside the card as currently structured:
   - Render only when `totalUsers > 0`.
   - `Previous` disabled when `loading || currentPage === 1`.
   - `Next` disabled when `loading || currentPage === totalPages`.
8. Optional polish if desired during implementation:
   - Add `items-stretch` only if needed for layout consistency.
   - Fix indentation around the pagination JSX, but do not change behavior.

## Edge Cases
- Last page with 1-9 users should keep pagination in the same vertical position as a full 10-user page.
- First page with fewer than 10 total users will reserve the same row area; this intentionally avoids page jump and keeps controls stable.
- Zero users should still show the filtered total and `No users found`; pagination remains hidden.
- Loading state may appear inside the reserved rows area. This is acceptable and avoids jumping while results reload.
- Search or role changes still reset page to 1.
- Deletion/refetch still clamps current page if the current page becomes invalid.

## Validation
1. Run `npm run build` to verify TypeScript and Vite build.
2. Manually verify in the admin users tab:
   - Go to a full page and then a short last page; pagination should no longer move upward.
   - All roles shows total count and paginates after 10 users.
   - Admin filter shows only admin total and admin rows.
   - Member filter shows only member total and member rows.
   - Search changes reset pagination to page 1.
   - Previous/Next disabled states are correct.
   - Empty results show `No users found` and no pagination controls.
   - Clicking a name still opens the photo modal.
   - Edit/Delete actions still work from paginated rows.

## Out Of Scope
- Server-side pagination or database count queries.
- A reusable pagination component shared with events.
- User-configurable page size.
- Virtualized rows.
