# Fix QR Attendance Scanner With Confirmation Modal

## Goal
Fix the admin attendance QR scanning flow so a successful scan does not immediately create attendance. Instead:
1. Admin selects the event.
2. Admin opens scanner.
3. Scanner reads the member profile QR URL.
4. App extracts the member slug and fetches the member.
5. Scanner closes and a confirmation modal appears with member info, including name and profile photo.
6. Admin clicks `Check In` to create the attendance record.

## Current Issues To Address
- Current code uses `Html5QrcodeScanner`, which renders its own UI and can be less predictable inside React modals.
- Current `handleScan` immediately inserts attendance after scan, without showing a member confirmation modal.
- Current duplicate/repeated scan state is embedded in scanner handling and can prevent retrying in some flows.
- Current scanner close/cleanup and check-in state are coupled.

## Package Decision
Prefer keeping the existing `html5-qrcode` dependency, but switch from `Html5QrcodeScanner` to the lower-level `Html5Qrcode` API.

Reason:
- `html5-qrcode` is already installed.
- `Html5Qrcode` gives direct camera start/stop control and avoids the package-generated scanner UI.
- It integrates better with a custom React modal.

Fallback if this still fails after implementation/manual test:
- Replace with `react-qr-scanner` or `@yudiel/react-qr-scanner` after confirming browser/camera compatibility. Do not add a new package unless the lower-level `Html5Qrcode` fix fails.

## Files To Change
- `src/components/AdminAttendancePanel.tsx`
- No Supabase schema changes needed.
- No new package initially.

## State Changes
In `AdminAttendancePanel`, add/adjust state:
- `scannedMember: Member | null`
- `scannedSlug: string | null` optional for error/status display.
- `confirmModalOpen: boolean` or infer modal from `scannedMember`.
- Keep `checkingIn` for the final insert button.
- Keep `scannerOpen` for camera modal.
- Keep `scannerStatus` for scan/check-in errors and success.

Remove direct attendance insert from scan success.

## New Flow
### Scan QR
1. `Scan QR to check in` opens `QrScannerModal`.
2. `QrScannerModal` starts camera with `Html5Qrcode.start(...)`.
3. On decode:
   - Stop scanner immediately to prevent repeated scans.
   - Call parent `handleScan(decodedText)`.
4. Parent `handleScan`:
   - Validate selected event exists.
   - Extract slug using `getSlugFromQrValue`.
   - Fetch member with `api.getMemberBySlug(slug)`.
   - If member not found, show error and keep/close scanner depending on implementation. Prefer close scanner and show status.
   - If found, set `scannedMember(member)`, close scanner, and show confirmation modal.

### Confirm Check-In
1. Confirmation modal displays:
   - Profile photo using `member.profile_picture_url` or placeholder.
   - Member name.
   - Member username/slug.
   - Optional email.
   - Selected event name/date/location.
   - Buttons: `Cancel`, `Check In`.
2. On `Check In`:
   - Verify `scannedMember` and `selectedEventId` exist.
   - Check local attendance for duplicate `(member.id, selectedEventId)`.
   - If duplicate, show `already checked in` error and close/reset confirmation modal.
   - Call `api.createAttendance({ member_id: member.id, event_id: selectedEventId })`.
   - If Supabase returns unique violation `23505`, show already checked in message.
   - If success, prepend returned attendance record to `attendance`.
   - Set success message.
   - Close confirmation modal and clear scanned member.

## QR Scanner Modal Implementation
Replace `Html5QrcodeScanner` with `Html5Qrcode`:
- Import: `import { Html5Qrcode } from 'html5-qrcode'`.
- Use a stable `readerIdRef`.
- Use `scannerRef = useRef<Html5Qrcode | null>(null)`.
- On mount:
  - Instantiate `new Html5Qrcode(readerId)`.
  - Call `start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, onSuccess, onFailure)`.
- On success:
  - Guard with `processedRef`.
  - Stop scanner with helper `stopScanner()`.
  - Then call `onScan(decodedText)`.
- On cleanup:
  - Stop scanner if scanning.
  - Clear scanner if needed.
- Provide visible modal UI:
  - Custom scanner frame div.
  - `Cancel`/close button.
  - Short text: `Point the camera at a member QR code`.

## Confirmation Modal Implementation
Add `MemberCheckInModal` component in `AdminAttendancePanel.tsx`:
Props:
- `member: Member`
- `event: Event | null`
- `checkingIn: boolean`
- `onCancel: () => void`
- `onConfirm: () => void`

UI styling should match existing admin modals:
- fixed black overlay.
- gray-950 modal panel.
- photo at top or left.
- name, username, email.
- event details.
- bottom buttons: Cancel and Check In.

## Helper Changes
Add:
- `const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null`
- `getMemberPhotoUrl(member)` helper or inline fallback placeholder.

Keep `getSlugFromQrValue`, but tighten validation:
- Accept full URLs with pathname `/member/:slug`.
- Accept path-only `/member/:slug`.
- Optionally accept raw slug if it matches safe slug pattern.

## Error Handling
- If no event selected: show `Select an event before scanning.`
- If invalid QR: show `Invalid member QR code.`
- If member not found: show `No member found for username "...".`
- If duplicate: show `Member is already checked in for this event.`
- If camera fails to start: show `Unable to start camera. Check browser camera permission and use HTTPS or localhost.`

## Browser Requirement Note
Camera access requires HTTPS or localhost in modern browsers. Since production is Netlify HTTPS, it should work there. Local LAN/IP testing may fail unless served over HTTPS.

## Validation
After implementation:
1. Run `npm run build`.
2. Manual test in browser:
   - Open Admin Attendance tab over HTTPS or localhost.
   - Select event.
   - Open scanner.
   - Scan member QR code.
   - Verify confirmation modal shows name and photo.
   - Click Check In.
   - Verify row appears in attendance list.
   - Re-scan same member/event and verify duplicate message.
   - Cancel confirmation modal and verify no row is inserted.

## Do Not Do Initially
- Do not add a second QR code containing member UUID.
- Do not add a new scanner package unless `Html5Qrcode` still fails after this refactor.
