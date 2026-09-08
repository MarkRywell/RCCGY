# Add Member Details Fields And Profile Editing

## Goal
Extend member profile editing so members can maintain their own contact/details fields and ensure personal record times cannot contain free-form text such as `24minutes`.

## Current Context
- `members` is created in `supabase/migrations/20260512012814_create_members_table.sql`.
- A new uncommitted migration exists at `supabase/migrations/20260908111325_add_member_details_fields.sql`.
- Earlier implementation added `shoe_size` as `text`, but the updated requirement is `shoe_size` as an integer.
- The frontend uses a hand-written `Member` type at `src/types/members.ts`.
- `api.getMemberBySlug` selects `*`, so new fields are available to `MemberProfile.tsx` after the migration and type update.
- `src/pages/MemberProfile.tsx` currently lets only the owning member edit `phone` and race-time fields.

## Decisions
- Store `address` as nullable `text`.
- Store `emergency_contact` as nullable `text` because phone numbers may include `+`, spaces, parentheses, or local formatting.
- Store `shoe_size` as nullable `integer`.
- Store `shirt_size` as nullable `text` to allow values like `S`, `M`, `L`, `XL`, or custom sizing.
- Keep all fields optional and save empty inputs as `null`.
- Validate personal record values with a time-like format, not just a loose character whitelist.
- Allow personal record values to be empty, digits only such as `24`, or minute/second values such as `24:50`.
- Reject personal record values containing letters, multiple colons, missing minutes/seconds around a colon, or invalid seconds such as `24:99`.

## Implementation Steps
1. Fix the member-details migration.
   - If `supabase/migrations/20260908111325_add_member_details_fields.sql` has not been applied to any shared or remote database, edit it directly to:

```sql
alter table members
add column address text,
add column emergency_contact text,
add column shoe_size integer,
add column shirt_size text;
```

   - If that migration has already been applied outside this local branch, do not edit migration history. Instead, create a follow-up migration that changes `shoe_size` from `text` to `integer`, handling existing data safely with `using nullif(shoe_size, '')::integer` only if the column already exists and values are numeric.

2. Update `src/types/members.ts`.
   - Ensure `Member` has:

```ts
address?: string | null;
emergency_contact?: string | null;
shoe_size?: number | null;
shirt_size?: string | null;
```

3. Update `src/components/EditMemberModal.tsx` if it still includes the new admin-edit fields.
   - Keep form state values as strings for inputs.
   - Initialize `shoe_size` with `member?.shoe_size?.toString() ?? ''`.
   - On save, trim values and send:
     - `address: trimmedAddress || null`
     - `emergency_contact: trimmedEmergencyContact || null`
     - `shoe_size: trimmedShoeSize ? Number(trimmedShoeSize) : null`
     - `shirt_size: trimmedShirtSize || null`
   - Validate `shoe_size` before saving with an integer-only rule such as `/^\d+$/` when non-empty.
   - Show a user-facing error instead of sending invalid shoe-size values.

4. Update `src/pages/MemberProfile.tsx` edit state.
   - Extend `EditForm` with:

```ts
address: string;
emergency_contact: string;
shoe_size: string;
shirt_size: string;
```

   - Initialize empty state for the new fields.
   - When loading an owner profile, populate:
     - `address: data.address || ''`
     - `emergency_contact: data.emergency_contact || ''`
     - `shoe_size: data.shoe_size?.toString() ?? ''`
     - `shirt_size: data.shirt_size || ''`

5. Update `MemberProfile` owner display.
   - In the owner-only contact/details area, display `Phone`, `Address`, `Emergency Contact`, `Shoe Size`, and `Shirt Size`.
   - Keep these details hidden from non-owners unless product requirements change.

6. Update `MemberProfile` owner edit form.
   - Add editable inputs for `address`, `emergency_contact`, `shoe_size`, and `shirt_size`.
   - Use `textarea` for `address`.
   - Use `type="tel"` for `emergency_contact` but do not enforce strict numeric-only validation.
   - Use `type="number"`, `min="0"`, and `step="1"` for `shoe_size`, plus save-time integer validation.
   - Use a text input for `shirt_size`.

7. Add personal record validation in `MemberProfile`.
   - Define a local helper or inline function for record validation, for example:

```ts
const isValidRecordTime = (value: string) => value === '' || /^\d+(?::[0-5]\d)?$/.test(value);
```

   - Before `api.updateMember`, validate each record field after trimming.
   - If any record is invalid, set `saveError` to a clear message such as `Personal records must use numbers or mm:ss format, for example 24:50.` and stop saving.
   - Optionally set `inputMode="numeric"` or `inputMode="text"` on record inputs, but do not rely on HTML pattern validation alone.

8. Update the `MemberProfile` save payload.
   - Include the new fields:

```ts
address: editForm.address.trim() || null,
emergency_contact: editForm.emergency_contact.trim() || null,
shoe_size: trimmedShoeSize ? Number(trimmedShoeSize) : null,
shirt_size: editForm.shirt_size.trim() || null,
```

   - Keep existing time fields trimmed and saved as `null` when empty.
   - Preserve `setMember((prev) => prev ? { ...prev, ...(data ?? payload) } : prev)` behavior so UI updates immediately after save.

9. Keep `src/lib/supabase.ts` member search as currently planned.
   - Include `address` and `emergency_contact` in admin search.
   - Do not add `shoe_size` to text `ilike` search because it is now an integer column.
   - Do not add `shirt_size` search unless explicitly desired.

## Validation
1. Run `npm run build` and confirm TypeScript passes.
2. Apply or reset the local Supabase database using the project’s normal workflow and confirm `members.shoe_size` is `integer` while the other new fields are `text`.
3. As an owner, edit and save `address`, `emergency_contact`, `shoe_size`, `shirt_size`, and personal records from `MemberProfile`.
4. Confirm empty new fields save as `null` and reload as empty inputs.
5. Confirm invalid personal records such as `24minutes`, `24::50`, `:50`, `24:`, and `24:99` are rejected.
6. Confirm valid personal records such as `24`, `24:05`, and `24:50` are accepted.
7. Confirm non-owner profile view does not expose owner-only contact/details fields.

## Risks
- If the existing migration has already been applied remotely with `shoe_size text`, editing it would cause migration drift. Use a follow-up migration in that case.
- HTML `type="number"` still returns strings in React state, so implementation must parse and validate before save.
- Phone numbers should not be stored as integers because leading zeroes, country codes, and symbols are meaningful.
