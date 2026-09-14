# Add Member Birth Date

## Goal
Add an optional birth date field to `members`, expose it in shared member typing, and allow both admins and profile owners to edit it.

## Decisions
- Use database/type field name `birth_date` to match the existing snake_case schema (`emergency_contact`, `shoe_size`, etc.).
- Use PostgreSQL `date` type, nullable, because this stores a calendar birth date without timezone behavior.
- Add a new migration instead of editing `supabase/migrations/20260908111325_add_member_details_fields.sql`, since older migrations may already be applied in Supabase environments.
- Use HTML `<input type="date">` in both edit UIs, with empty string in React form state and `null` in update payloads when blank.

## Implementation Steps
1. Add a new Supabase migration, for example `supabase/migrations/<next_timestamp>_add_member_birth_date.sql`, with:
   ```sql
   alter table members
   add column birth_date date;
   ```
2. Update `src/types/members.ts`:
   - Add `birth_date?: string | null;` to `Member` near the other member detail fields.
   - No separate payload type changes should be needed because `CreateMemberPayload` and `UpdateMemberPayload` derive from `Partial<Member>`.
3. Update `src/components/EditMemberModal.tsx` for admin editing:
   - Add `birth_date: string` to `FormState`.
   - Initialize it from `member.birth_date ?? ''` in `getFormState`.
   - Include `birth_date: form.birth_date || null` in the `api.updateMember` payload.
   - Add a labeled `Birth Date` field using `<input type="date">`, disabled while submitting.
   - Place it with the existing member-detail fields, preferably in the two-column grid near shoe/shirt size.
4. Update `src/pages/MemberProfile.tsx` for owner editing:
   - Add `birth_date: string` to `EditForm`.
   - Initialize it to `''` in the default `editForm` state.
   - Populate it from `data.birth_date || ''` when the fetched member belongs to the signed-in user.
   - Include `birth_date: editForm.birth_date || null` in the save payload.
   - Add a labeled `Birth Date` `<input type="date">` inside the owner edit form grid near phone/emergency contact or shoe/shirt size.
   - Add a read-only profile detail row showing `member.birth_date || "N/A"` in the owner-only member details block.
5. Preserve existing behavior:
   - Do not require birth date.
   - Do not add custom validation unless a product requirement appears; browser date input handles date formatting for user input.
   - Do not change RLS policies because existing `updateMember` access should apply to all editable member columns.

## Validation
1. Run TypeScript/build validation, preferably `npm run build` or the repository’s existing typecheck command if present.
2. Verify admin edit flow:
   - Open a member in Admin users, set a birth date, save, reopen modal, confirm it persists.
   - Clear the birth date, save, confirm it becomes blank/`null`.
3. Verify member profile owner flow:
   - As the profile owner, set and clear birth date from the profile page.
   - Confirm the owner-only details row displays the saved date or `N/A` when blank.
4. Verify migration applies locally or in Supabase without affecting existing `members` rows.

## Risks
- If the old `20260908111325_add_member_details_fields.sql` migration has not been applied anywhere, adding a new migration still works safely; it only introduces a separate schema step.
- If generated Supabase TypeScript database types exist elsewhere in the repo, regenerate/update them too. No generated database type file was found during planning.
