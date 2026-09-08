# Attendance Check-In Event Filtering Plan

## Goal
Update the admin attendance check-in event dropdown so it only shows valid check-in events:
- Upcoming events.
- Events happening today.
- Events that are not more than 1 day past their event date.
- Sorted by latest date first.

## Interpretation
Use a rolling lower bound of yesterday at the start of the day. This allows events from today and tomorrow onward, and excludes events older than one day.

Example:
- Today is June 9.
- Include events dated June 8, June 9, June 10, etc.
- Exclude events dated June 7 or earlier.

## Files To Change
- `src/components/AdminAttendancePanel.tsx`

## Implementation Steps
1. In the `fetchEvents` effect inside `AdminAttendancePanel`, calculate a lower bound date:
   - Create `minEventDate = new Date()`.
   - Set it to local midnight.
   - Subtract one day.
   - Convert to ISO string for Supabase filtering.
2. Fetch events with `api.getEvents({ startDate: minEventDate.toISOString() })` instead of `api.getEvents()`.
3. Sort the returned events by `event_date` descending so the latest event appears first:
   - `data.toSorted((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())`
   - If project TypeScript target does not support `toSorted`, use `[...data].sort(...)`.
4. Store sorted events with `setEvents(sortedEvents)`.
5. Default `selectedEventId` to `sortedEvents[0]?.id || ''`.
6. Keep the existing attendance table view filter unchanged unless source requirements later ask for it.

## Validation
Run:
- `npm run build`

## Notes
- This only affects the check-in event dropdown used by QR scanning.
- The attendance viewing filter currently derives from attendance records and should continue showing historical attendance unless explicitly changed.
