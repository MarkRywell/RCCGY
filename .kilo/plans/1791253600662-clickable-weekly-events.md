# Clickable Weekly Events Plan

## Goal
Make the three weekly `EventCard` items on `src/pages/Events.tsx` clickable links that open their assigned Google Forms in a new browser tab, and add a subtle size increase on hover.

## Current Context
- `src/pages/Events.tsx` renders upcoming events from Supabase and static weekly events.
- `src/components/EventCard.tsx` currently renders a non-clickable visual card with props: `image`, `title`, `location`, and optional `date`.
- Upcoming event cards should keep their current behavior unless a link is explicitly supplied.

## Implementation Steps
1. Update `src/components/EventCard.tsx` props to accept an optional `href?: string`.
2. Refactor the component so the card content is built once and wrapped conditionally:
   - If `href` is provided, render an `<a>` wrapper.
   - If `href` is not provided, render the existing non-link container behavior.
3. For linked cards, set:
   - `href={href}`
   - `target="_blank"`
   - `rel="noopener noreferrer"`
   - an accessible label such as `aria-label={`Register for ${title}`}`
4. Add the hover growth animation to the card root/wrapper classes:
   - `transition-transform duration-200 ease-out`
   - `hover:scale-[1.02]`
   - optionally `focus-visible:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary` for keyboard users.
5. Ensure the card remains full-width by applying existing sizing/layout classes to the clickable element when linked.
6. Update only the weekly cards in `src/pages/Events.tsx` with the supplied URLs:
   - Monday Strides: `https://docs.google.com/forms/d/e/1FAIpQLSfAuJVMtkBzQgCODZAU5jHXyQazO1MhUqX2BO7J7MeSK-dWww/viewform`
   - Speed Wednesday: `https://docs.google.com/forms/d/e/1FAIpQLSclglg-DkdfW8GRt_5r2RCqvrtCi3ghK-6_PACk-W-kIPM9lw/viewform`
   - Friday Community Run: `https://docs.google.com/forms/d/e/1FAIpQLSebdPJEENf3nihceNhyFJWHIaEYJXpmIOlj-rWvRFoFKDVFSQ/viewform`

## Constraints And Decisions
- Do not wrap the cards directly in `Events.tsx`; adding an optional `href` prop keeps link behavior reusable and avoids duplicating card layout classes.
- Do not change dynamic upcoming events unless future data includes registration URLs.
- Preserve the current visual design, image behavior, and responsive layout.
- Use standard anchors instead of JavaScript `window.open` so browser behavior, accessibility, and security attributes are correct.

## Risks And Edge Cases
- Scaling a full-width card could clip slightly if a parent has restrictive overflow; current weekly section containers do not appear to enforce clipping, so `scale-[1.02]` should be safe.
- If hover scale causes horizontal overflow on small screens, reduce to `hover:scale-[1.01]` or add a containing wrapper with `overflow-visible`.
- Ensure `target="_blank"` always includes `rel="noopener noreferrer"`.

## Validation
1. Run the project type/lint check available in `package.json` if present, or at minimum run the normal build command.
2. Open the Events page locally.
3. Verify each weekly card grows subtly on hover.
4. Verify keyboard focus is visible on linked cards.
5. Click each weekly card and confirm the matching Google Form opens in a new tab.
6. Confirm upcoming event cards remain non-clickable unless given an `href`.

## Open Questions
None. The requested behavior and target URLs are fully specified.
