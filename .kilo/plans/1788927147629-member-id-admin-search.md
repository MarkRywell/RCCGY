# Admin Member ID Display and Search Plan

## Goal
Replace the admin users table `Role` column with a formatted `Member ID` column, displaying numeric database `members.member_id` values as four-digit IDs such as `0001`, `0002`, and make the existing users search box find members by those displayed IDs.

## Current Context
- `src/types/members.ts` already defines `Member.member_id: number`.
- `src/lib/supabase.ts#getMembers` selects `*` from `members`, so `member_id` should already be present in returned rows.
- `src/components/AdminUsersPanel.tsx` currently renders table headers as `Name`, `Email`, `Role`, `Actions` and displays `user.role` in the third data column.
- `src/pages/Admin.tsx#refetchUsers` forwards the raw search string to `api.getMembers`; no changes are needed there unless the implementation wants to update placeholder copy only.

## Decisions
- Display only the formatted member ID in the replaced column; keep the role filter dropdown and role-based totals unchanged.
- Format IDs with `String(user.member_id).padStart(4, '0')` so IDs above 9999 are not truncated.
- Treat numeric search input, including leading zeroes like `0001`, as an exact `member_id` match against integer value `1`.
- Preserve the existing name/email/phone/address partial search behavior.

## Implementation Steps
1. In `src/components/AdminUsersPanel.tsx`, add a small local formatter near the component, for example `const formatMemberId = (memberId: number) => String(memberId).padStart(4, '0')`.
2. Change the search input placeholder from `Search users (name, email, phone)` to include member ID, for example `Search users (ID, name, email, phone)`.
3. Change the users table header at the current `Role` column to `Member ID`.
4. Replace the row cell currently rendering `user.role` with the formatted member ID, using a style appropriate for tabular IDs, for example `#{formatMemberId(user.member_id)}` only if the desired visual includes a prefix, otherwise `formatMemberId(user.member_id)`. The user asked for `0001`, `0002`, so prefer no `#` prefix.
5. In `src/lib/supabase.ts#getMembers`, when `search.trim()` is non-empty, build the existing text `or` filters and append `member_id.eq.<number>` only if the trimmed input is all digits.
6. Normalize numeric member ID search by parsing the digits with `Number(trimmedSearch)` so `0001` searches `member_id.eq.1`.
7. Guard against invalid numeric values before adding the numeric filter: use a digits-only check like `/^\d+$/` and `Number.isSafeInteger(parsedId)`.
8. Keep role filtering as a separate `.eq('role', role)` before search, so role filters and member ID search combine correctly.
9. Remove the stray `console.log(data)` in `getMembers` if this is considered cleanup; otherwise leave it unchanged to minimize scope.

## Supabase Query Shape
For non-empty search:
- Always include the existing partial text filters: `name.ilike`, `email.ilike`, `phone.ilike`, `address.ilike`.
- For digit-only search, include `member_id.eq.${parsedId}` in the same `.or(...)` expression.
- Example for `0001`: query searches text fields for `%0001%` OR `member_id = 1`.

## Edge Cases
- `0000` becomes `0`; it will only match if a `member_id` of `0` exists.
- `12abc` stays text-only and will not attempt a numeric member ID filter.
- Empty or whitespace-only search continues returning all users for the selected role.
- IDs larger than four digits display as their full value, not truncated.

## Validation
1. Run `npm run build` to verify TypeScript and Vite build pass.
2. Manually verify the Admin users table shows `Member ID` instead of `Role` and rows display `0001`, `0002`, etc.
3. Manually search for `0001` and confirm the member with `member_id = 1` appears.
4. Manually search by name/email/phone to confirm existing search still works.
5. Manually combine role filter plus member ID search to confirm both filters apply.

## Files To Change
- `src/components/AdminUsersPanel.tsx`
- `src/lib/supabase.ts`

## Out Of Scope
- Database schema or migration changes.
- Changing member creation/invite logic.
- Removing the role filter or role-based total labels.
