# QR Attendance Scanner Implementation Plan

## Goal
Add QR scanning to the admin attendance panel so an admin can select an event, scan an existing member profile QR code, resolve the member by slug, and create an attendance record with `member_id` and `event_id`.

## Existing Context
- Member QR codes already contain URLs like `https://rannncrew.netlify.app/member/{slug}`.
- `api.getMemberBySlug(slug)` already exists in `src/lib/supabase.ts`.
- `html5-qrcode` is already installed in `package.json`.
- `attendance` has `unique (member_id, event_id)`, so duplicate scans should be handled gracefully.
- Admin attendance UI is in `src/components/AdminAttendancePanel.tsx`.
- Events can be loaded with `api.getEvents()`.

## Files To Change
- `src/lib/supabase.ts`
- `src/components/AdminAttendancePanel.tsx`

## Supabase API Changes
1. Add `createAttendance(payload: { member_id: string; event_id: string })` to `api`.
2. Insert into `attendance`, then select joined member/event fields using the same shape as `getAttendance`:
   `*, members(id, name, email, slug), events(id, name, event_date, location)`.
3. Return `{ data, error }`, with `data` typed as `AttendanceRecord | null`.
4. Keep Postgres unique constraint as duplicate protection. In the UI, interpret duplicate insert errors as an already-checked-in message.
5. Optional cleanup: remove `updateAttendance` if no longer used after the Refresh button removal.

## Attendance Panel UI Changes
1. Add state for:
   - `events: Event[]`
   - `selectedEventId: string`
   - `scannerOpen: boolean`
   - `scannerStatus: { type: 'idle' | 'success' | 'error'; message: string }`
   - `checkingIn: boolean`
   - `lastScannedValue: string | null` or a ref to prevent repeated scan spam
2. Fetch events on mount using `api.getEvents()`.
3. Default `selectedEventId` to the first upcoming/event returned if available.
4. Add a scanner control area above the attendance table, matching existing dark admin styling:
   - Event select labeled for check-in target.
   - Button to open scanner.
   - Status message for successful/failed scans.
5. Keep the existing event filter for viewing attendance separate from the scanner target event, or clearly label them to avoid confusion.

## QR Scanner Implementation
1. Import `Html5QrcodeScanner` or `Html5Qrcode` from `html5-qrcode`.
2. Create a `QrScannerModal` or inline scanner section inside `AdminAttendancePanel.tsx` to keep the feature local.
3. When opened:
   - Render a fixed modal with a scanner container div id/ref.
   - Start camera scanning.
   - Stop/clear scanner on close/unmount.
4. On successful scan:
   - Ignore if already `checkingIn` or same payload was just processed.
   - Extract slug from QR value.
   - Resolve member with `api.getMemberBySlug(slug)`.
   - Insert attendance with `api.createAttendance({ member_id: member.id, event_id: selectedEventId })`.
   - Prepend the returned attendance record to local `attendance`, or refetch with `api.getAttendance()` if duplicate/shape concerns arise.
   - Set success/error status.
   - Close scanner after successful check-in, or keep it open depending on implementation simplicity. Prefer closing after success for predictable behavior.

## Slug Extraction
Add a local helper in `AdminAttendancePanel.tsx`:
- Accept full URLs like `https://rannncrew.netlify.app/member/my-slug`.
- Accept path-only values like `/member/my-slug`.
- Optionally accept raw slug fallback only if it is a safe slug string.
- Reject invalid QR values with a clear error.

Suggested behavior:
- Try `new URL(value)` first.
- Read pathname and require `/member/:slug`.
- If URL parsing fails, try `new URL(value, window.location.origin)`.
- Return `decodeURIComponent(slug)`.

## Duplicate Scan Handling
1. Before insert, optionally check local `attendance` for an existing record with same `member_id` and selected event id after resolving the member.
2. If found, show `Member is already checked in for this event` and skip insert.
3. Still rely on database unique constraint in case another admin checks in at the same time.
4. If Supabase returns a unique violation, show the same already-checked-in message.

## Camera Permissions And Cleanup
1. Show a helpful error if browser camera access fails.
2. Ensure scanner cleanup runs on modal close and component unmount.
3. Use a stable scanner container id/ref to avoid duplicate scanner initialization.

## Validation
Run after implementation:
1. `npm run build`
2. Manual browser check:
   - Admin opens Attendance tab.
   - Selects event.
   - Opens scanner.
   - Scans a profile QR URL.
   - Attendance row appears with member/event details.
   - Re-scanning same QR for same event shows duplicate/already checked-in message.
   - Delete still works.

## Notes
- Do not create a second QR code containing `memberId`.
- Reuse the existing profile QR URL and resolve `slug -> member.id` during check-in.
