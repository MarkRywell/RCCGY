# Clickable Upcoming Event Link Plan

## Goal
Make the homepage upcoming event card in `src/pages/Home.tsx` clickable when the event has an `event_link`, opening the link in a new tab. Add a nullable `event_link` column to Supabase events so admins can store a Google Form, Facebook post, or other event URL.

## Decisions
- Use database column name `event_link` to match existing snake_case columns like `event_date` and `photo_url`.
- Keep the link optional. Events without `event_link` should render exactly like the current non-clickable card.
- Use a standard anchor with `target="_blank"` and `rel="noopener noreferrer"`; do not use JavaScript `window.open`.
- Add admin create/edit support so the link can be set from the existing admin event modal.

## Affected Files
- `supabase/migrations/<new timestamp>_add_event_link_to_events.sql`
- `src/types/events.ts`
- `src/components/AdminEventModal.tsx`
- `src/pages/Admin.tsx`
- `src/pages/Home.tsx`

## Implementation Steps
1. Create a new Supabase migration under `supabase/migrations/`, for example `20261020143300_add_event_link_to_events.sql`:
   ```sql
   alter table events
   add column event_link text;
   ```
2. Update `src/types/events.ts`:
   - Add `event_link?: string | null` to `Event`.
3. Update `src/components/AdminEventModal.tsx`:
   - Add `event_link?: string | null` to `EventFormValues`.
   - Initialize `event_link` from `initialEvent?.event_link ?? ''` in both form initializers.
   - Add a visible input labeled `Event Link` or `Registration / Post Link`.
   - Use placeholder text such as `https://facebook.com/... or https://docs.google.com/forms/...`.
   - Validate non-empty `event_link` with the same basic `https?://` URL pattern used for `photo_url`.
   - Error message can be `Event link must be a valid URL (https://...)`.
4. Update `src/pages/Admin.tsx` event save payload:
   - Add `event_link: values.event_link?.trim() || null` to the `Partial<Event>` payload.
5. Update `src/pages/Home.tsx`:
   - Derive `const eventLink = upcoming?.event_link?.trim()` near the existing `photo`, `title`, and `date` constants.
   - Build the current card content once to avoid duplicating markup.
   - If `eventLink` exists, wrap the card with an `<a>` using:
     - `href={eventLink}`
     - `target="_blank"`
     - `rel="noopener noreferrer"`
     - `aria-label={`Open event link for ${title}`}`
   - If no `eventLink`, render the current `<div>` card.
   - Preserve existing classes and visual layout.
   - Add optional hover/focus affordance only to linked cards, for example `transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary`.
6. No changes are required in `src/lib/supabase.ts` because event queries use `select('*')`, so the new column will be returned automatically after migration.

## Edge Cases
- Empty or whitespace-only `event_link` should be saved as `null` and should not make the homepage card clickable.
- Invalid admin input like `facebook.com/post` without `https://` should be rejected.
- Homepage should not show an empty link target if old rows do not have the new column populated.
- If hover scaling causes clipping in the hero layout, reduce scale to `1.01` or apply the transform only to larger breakpoints.

## Validation
1. Run `npm run build`.
2. Run `npm run lint`; note any existing unrelated lint failures separately.
3. Apply/run the Supabase migration in the local/project environment.
4. Create or edit an event in Admin with an `https://` Facebook or Google Forms URL.
5. Confirm the event row stores `event_link`.
6. Open the homepage and verify the upcoming event card opens the stored URL in a new tab.
7. Clear the event link and verify the same card is no longer clickable.
8. Confirm existing Events page weekly links still work after this change.

## Open Questions
None.
