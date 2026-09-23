# Member Record Time Keyboard Plan

## Goal
Allow mobile users editing `src/pages/MemberProfile.tsx` personal-record fields to enter colon-delimited times such as `25:30`.

## Current Findings
- The personal-record inputs at `src/pages/MemberProfile.tsx:412-420` are `type="text"`, but `inputMode="numeric"` asks mobile browsers to show numeric keyboards that often omit `:`.
- The placeholder already advertises `N/A or e.g. 25:30`, and `handleSave` normalizes `N/A` to an empty value.
- `isValidRecordTime` accepts empty strings and colon-delimited numeric times via `^\d+(?::[0-5]\d){0,2}$`.
- Shoe size uses `type="number"` and `inputMode="numeric"`; that field should stay numeric-only because its validation requires whole numbers.

## Implementation Steps
1. In `src/pages/MemberProfile.tsx`, update only the personal-record input rendered inside `recordFields.map`.
2. Remove `inputMode="numeric"` from that input, or replace it with no explicit `inputMode`, so mobile browsers use a text keyboard where `:` is accessible.
3. Keep `type="text"`, the existing `value`, `onChange`, `placeholder`, `disabled`, and CSS classes unchanged.
4. Do not change `normalizeRecordTime`, `isValidRecordTime`, payload construction, or the shoe-size input unless a separate requirement appears.

## Validation
1. Run the project type/lint check if available, for example `npm run lint` or the repository’s existing validation command.
2. Manually verify on a mobile device or browser mobile emulation that the personal-record fields allow typing `25:30`.
3. Verify saving still accepts `25:30`, `1:55:18`, empty values, and `N/A`.
4. Verify saving still rejects invalid record formats such as `25:99`.
5. Verify the shoe-size field still presents a numeric input experience and rejects non-whole-number values.

## Risks
- Removing the numeric input hint may make numeric entry slightly less optimized on mobile, but it is required because standard numeric/decimal keyboards do not reliably include `:`.
- `type="time"` is not suitable because these records may exceed 24-hour clock values and may also be blank or entered as `N/A` before normalization.
