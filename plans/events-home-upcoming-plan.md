## Goal
Display upcoming events from Supabase on Home and Events pages. Home shows the next event with image/title/date; Events lists all upcoming events. Use fallback image when `photo_url` missing and show "Coming Soon" when none.

## Decisions
- Fallback image URL: https://res.cloudinary.com/di8bd6f96/image/upload/v1777606832/rccgy/running3_tjdlso.jpg
- Show title and date on Home hero; keep badge "NEW EVENT".

## Tasks
1) Add shared FALLBACK_EVENT_IMAGE constant for upcoming events display.
2) Home: fetch single upcoming event via api.getUpcomingEvent(false) with loading/error handling.
3) Home: render hero card with event title and formatted date, using photo_url fallback; handle empty state gracefully.
4) Events: fetch multiple upcoming events via api.getUpcomingEvent(true) with loading/error handling.
5) Events: render upcoming list with photo_url fallback; show Coming Soon when none.

## Data needs
- Use existing api.getUpcomingEvent (single/multiple) from src/lib/supabase.ts:217-248.
- Types: Event (src/types/events.ts:1-11).

## UX notes
- Loading states should avoid layout shift (simple skeleton or text).
- When no event on Home: keep card container but show placeholder text/image.
- When no upcoming events on Events: existing "Coming Soon..." remains.

## Next steps
- Implement in code mode following task list above.
