# Hide Attendance Checked-In Column On Mobile

## Goal
Update `src/components/AdminAttendancePanel.tsx` so the `Checked In` column is hidden on mobile screens while remaining visible on medium and larger screens.

## Implementation Steps
1. Locate the attendance table header grid using `grid-cols-6`.
2. Change the grid layout to use fewer columns on mobile and restore six columns on `md` screens, for example `grid-cols-5 md:grid-cols-6`.
3. Add `hidden md:block` to the header `<span>` for `Checked In`.
4. Apply the same responsive grid class to each attendance row.
5. Add `hidden md:block` to the row cell that displays `checked_in_at` so header and rows stay aligned.
6. Verify the `Member`, `Event`, and `Actions` columns still align cleanly on mobile.

## Expected Result
- Mobile: `Member`, `Event`, and `Actions` are shown; `Checked In` is hidden.
- Desktop/tablet: all columns are shown exactly as before.
