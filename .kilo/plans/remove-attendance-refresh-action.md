# Remove Attendance Refresh Action

## Goal
Update `src/components/AdminAttendancePanel.tsx` so attendance row actions only expose `Delete`; remove the `Refresh`/update action from both desktop and mobile action menus.

## Implementation Steps
1. Remove the `onUpdate` and `updating` props from the `RowActions` usage in attendance rows.
2. Remove the `handleUpdate` function and `updatingId` state if they are no longer used.
3. Update the `RowActions` props type to only accept `onDelete` and `deleting`.
4. Change `busy` to depend only on `deleting`.
5. Remove the desktop `Refresh` button.
6. Remove the mobile menu `Refresh` button.
7. Keep the `Delete` button and its loading text/disabled state unchanged.
8. Verify there are no unused variables/imports after removing update logic.

## Expected Result
- Desktop actions show only `Delete`.
- Mobile actions menu shows only `Delete`.
- No attendance update/refresh logic remains in the panel.
