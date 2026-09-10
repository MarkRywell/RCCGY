# Fix QR Scanner Camera Cleanup Plan

## Goal
Ensure the phone/browser camera turns off whenever the attendance QR scanner is no longer in use:
- Closing the scanner modal.
- Clicking the backdrop.
- Pressing Escape.
- Successful QR scan before member confirmation modal opens.
- Scanner startup failure.
- Component unmount.

## Current Problem
`QrScannerModal` currently relies on:
```ts
if (scanner.getState() === 2) await scanner.stop()
await scanner.clear()
```
Problems:
- The numeric `2` state check is fragile.
- If `scanner.stop()` or `scanner.clear()` throws, the catch swallows the error and no fallback cleanup happens.
- The browser camera indicator may remain active if underlying `MediaStreamTrack`s are not stopped.
- `onClose` only unmounts the modal; camera shutdown happens asynchronously in cleanup, but there is no explicit close handler that waits/starts cleanup before unmount.

## Files To Change
- `src/components/AdminAttendancePanel.tsx`

## Implementation Strategy
Keep using `html5-qrcode`, but make camera cleanup explicit and idempotent.

## Detailed Changes

### 1. Import Scanner State Enum
Update import from:
```ts
import { Html5Qrcode } from 'html5-qrcode'
```
to include the scanner state enum if available from the package:
```ts
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
```
Use `Html5QrcodeScannerState.SCANNING` instead of numeric `2`.

If TypeScript/package export does not support it, fallback to checking `scanner.getState()` against known active states with a small helper, but prefer enum.

### 2. Add Forced Media Track Cleanup Helper
Inside or near `QrScannerModal`, add a helper that finds videos inside the scanner root and stops their streams:
```ts
function stopScannerVideoTracks(rootId: string) {
  const root = document.getElementById(rootId)
  const videos = root?.querySelectorAll('video') ?? []

  videos.forEach((video) => {
    const stream = video.srcObject
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop())
      video.srcObject = null
    }
  })
}
```
This is the fallback that directly releases the camera if the library cleanup misses it.

### 3. Make Cleanup Idempotent
In `QrScannerModal`, add refs:
- `cleanupStartedRef = useRef(false)`
- `startedRef = useRef(false)`

Create a stable async cleanup function inside the scanner effect or via `useRef`:
```ts
const cleanupScanner = async () => {
  if (cleanupStartedRef.current) return
  cleanupStartedRef.current = true

  try {
    const scanner = scannerRef.current
    if (scanner) {
      const state = scanner.getState()
      if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
        await scanner.stop()
      }
      await scanner.clear()
    }
  } catch (error) {
    console.warn('Failed to stop QR scanner cleanly', error)
  } finally {
    stopScannerVideoTracks(scannerIdRef.current)
    scannerRef.current = null
  }
}
```
If the enum is unavailable, do not block implementation; use defensive stop attempt:
```ts
try { await scanner.stop() } catch {}
try { await scanner.clear() } catch {}
```
then always call `stopScannerVideoTracks`.

### 4. Explicit Close Handler
Instead of passing `onClose` directly to backdrop/button/Escape, create:
```ts
const handleClose = () => {
  void cleanupScannerRef.current?.()
  onClose()
}
```
Use `handleClose` for:
- Backdrop click.
- Close button.
- Escape key.
This starts camera shutdown immediately before the modal is removed.

### 5. Successful Scan Cleanup
On successful decode:
- Guard repeated scans.
- Await cleanup before `onScan(decodedText)`.
This prevents the confirmation modal from appearing while the camera is still active.

Current flow already calls `await stopScanner()`, but this should use the new robust cleanup function.

### 6. Startup Failure Cleanup
If `scanner.start(...).catch(...)` fires:
- Run cleanup helper.
- Show error.
- Close modal.

### 7. Unmount Cleanup
The effect cleanup should call the same robust cleanup function:
```ts
return () => {
  mounted = false
  void cleanupScanner()
}
```
Because cleanup is idempotent, calling it from both explicit close and unmount is safe.

### 8. Reset Cleanup Flag After Successful Start
Initialize refs per modal instance. Since the scanner modal unmounts/remounts each time, no cross-session reset is required.

## Validation
Run:
- `npm run build`

Manual browser/device test:
1. Open Attendance scanner on phone over HTTPS.
2. Confirm browser shows camera active.
3. Close scanner with `x`; camera indicator should disappear within 1-2 seconds.
4. Reopen scanner, close by tapping backdrop; indicator should disappear.
5. Reopen scanner, close with Escape on desktop; indicator should disappear.
6. Scan a QR code; camera indicator should disappear before/while confirmation modal appears.
7. Cancel confirmation modal; camera should remain off.
8. Reopen scanner multiple times; camera should still start and stop reliably.

## Notes
- This does not require a new QR scanner package.
- If `html5-qrcode` still leaves camera active after forced track cleanup, then replacing the package is justified. The next candidate would be a React wrapper around BarcodeDetector or `@yudiel/react-qr-scanner`, but the direct media track stop should normally fix this.
