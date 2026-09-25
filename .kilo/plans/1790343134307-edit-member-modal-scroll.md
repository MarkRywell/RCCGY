# Edit Member Modal Mobile Scroll Plan

## Goal
Fix `EditMemberModal` so long modal content is scrollable on mobile screens and the user can reach the close button, Cancel, and Save changes without the underlying page becoming the primary scroll target.

## Current Issue
- `src/components/EditMemberModal.tsx` renders the modal overlay as `fixed inset-0 flex items-center justify-center ...`.
- The modal panel has no viewport height constraint and no `overflow-y-auto`.
- On short/mobile viewports, the panel can exceed the viewport and become clipped by the centered fixed overlay.
- Touch scrolling can affect the page behind the modal instead of exposing the modal's hidden top/bottom controls.

## Scope
- Primary file: `src/components/EditMemberModal.tsx`.
- Keep data handling, upload behavior, submit behavior, and form state unchanged.
- Do not refactor modal architecture unless needed for this fix.
- Related modal components (`InviteUserModal`, `AdminEventModal`, delete confirms, photo modal) share similar wrapper patterns, but updating them is out of scope for this specific request unless requested later.

## Implementation Steps
1. Update the outer overlay wrapper in `EditMemberModal` from a purely centered fixed flex container to a viewport-safe container:
   - Add vertical padding, for example `py-4 sm:py-6`, so the panel has breathing room on small screens.
   - Prefer `items-start sm:items-center` instead of always `items-center`, so an over-height mobile modal starts at the top of the scrollable area instead of being clipped from both ends.
   - Add `overflow-y-auto` to the overlay as a fallback so the fixed layer can scroll if the panel itself cannot.

2. Update the modal panel wrapper:
   - Add a viewport-based max height such as `max-h-[calc(100dvh-2rem)]`.
   - Add `overflow-y-auto` so the panel content itself scrolls.
   - Add `overscroll-contain` to reduce scroll chaining into the page behind the modal.
   - Preserve existing width, border, background, padding, rounded corners, and shadow classes.

3. Keep the existing form and buttons inside the scrollable panel.
   - This allows users to scroll to the top for the close button and to the bottom for Cancel/Save.
   - No sticky header/footer is required for the minimal fix.

4. Optional accessibility cleanup while touching the wrapper:
   - Add `role="dialog"` and `aria-modal="true"` to the outer modal container if not already present.
   - Add an `aria-label="Close"` to the close button because it currently renders only `✕`.
   - These are safe, behavior-neutral improvements.

## Suggested Class Changes
Use this shape for the outer wrapper:

```tsx
<div
  className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-4 sm:items-center sm:py-6"
  role="dialog"
  aria-modal="true"
>
```

Use this shape for the panel wrapper:

```tsx
<div className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl">
```

## Validation
1. Run the project locally with the existing dev command, likely `npm run dev` or the repository's configured equivalent.
2. Open the admin page and trigger `EditMemberModal` for a member.
3. In browser mobile emulation, test at narrow/short sizes such as iPhone SE dimensions.
4. Confirm the modal panel scrolls from the close button at the top to Cancel/Save at the bottom.
5. Confirm the underlying page does not visibly scroll while swiping inside the modal content.
6. Confirm desktop modal layout remains centered and visually consistent.
7. Run lint/build if available, likely `npm run lint` and/or `npm run build`.

## Risks
- `100dvh` requires modern browser support; it is well supported in current mobile browsers and handles dynamic mobile browser chrome better than `100vh`.
- If the app's Tailwind setup does not support arbitrary values, replace `max-h-[calc(100dvh-2rem)]` with a supported equivalent such as `max-h-[90vh]`.
