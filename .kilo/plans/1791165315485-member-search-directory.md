# Member Directory And Responsive Nav Plan

## Completed Context
The member directory feature has been implemented in this branch with:
- Protected `/members` route.
- `MemberDirectory` page.
- Public-safe `api.getMemberDirectory()` query.
- Member-only `MEMBERS` nav entry.

## Current Nav State
`src/layout/Nav.tsx` currently uses:
- Desktop links at `sm:flex`.
- Desktop auth CTA at `sm:inline-flex`.
- Burger button and drawer at `sm:hidden`.

With the project breakpoints in `src/index.css`, `sm` is `600px`, so tablet widths above 600px currently show desktop navigation too early.

## Project Breakpoints
Defined in `src/index.css`:
- `xs`: `425px`
- `sm`: `600px`
- `md`: `768px`
- `lg`: `992px`
- `xl`: `1200px`

## Goal
Use the burger menu at `768px` and below, while keeping normal desktop nav links and desktop auth/profile CTA above `768px`.

## Breakpoint Decision
- Burger/drawer visible at `<= 768px`.
- Desktop links and desktop auth/profile CTA visible at `>= 769px`.
- Do not use `md:flex` for desktop links, because `md` starts at `768px` and would show desktop nav exactly where the burger should begin.
- Use Tailwind arbitrary min-width variants such as `min-[769px]:flex`, `min-[769px]:inline-flex`, and `min-[769px]:hidden` to make the cutoff precise.

## Affected File
- `src/layout/Nav.tsx` only.

## Implementation Steps
1. Keep the existing desktop horizontal nav list, but change its responsive class from `hidden sm:flex ...` to `hidden min-[769px]:flex ...`.
2. Keep the existing desktop auth/profile CTA block, but change each desktop-only class from `hidden sm:inline-flex ...` to `hidden min-[769px]:inline-flex ...`.
3. Keep the burger button, but change its class from `sm:hidden inline-flex ...` to `inline-flex min-[769px]:hidden ...`.
4. Keep the drawer wrapper, but change `className="sm:hidden"` to `className="min-[769px]:hidden"`.
5. Keep the existing drawer contents and auth/profile actions unchanged so tablet/mobile behavior remains the same.
6. Keep `navLinks` role behavior unchanged so authenticated members still see `MEMBERS` in both desktop links and the drawer.
7. Keep `handleLogout`, `profileHref`, `showLogout`, body-scroll lock, and Escape-to-close behavior unchanged.
8. Optional comment cleanup: rename “Mobile burger” to “Tablet/mobile burger” and “Mobile slide-over drawer” to “Tablet/mobile slide-over drawer”.

## Expected Behavior
- `<= 768px`: logo plus burger only; drawer contains page links and auth/profile actions.
- `>= 769px`: logo, horizontal links, and desktop auth/profile CTA; burger and drawer wrapper hidden.
- Signed-out users see login in the appropriate desktop or drawer location.
- Signed-in members see `MEMBERS` in the appropriate desktop or drawer location.
- Signed-in admins do not see `MEMBERS`; profile CTA still routes to `/admin`.

## Validation
- Run `npm run build`.
- Run `npm run lint`; note existing unrelated lint failures may still exist in `AdminEventModal.tsx`, `AdminUsersPanel.tsx`, and `Admin.tsx` unless separately fixed.
- Manual checks:
  - At mobile widths below `768px`, burger appears and desktop links/auth are hidden.
  - At exactly `768px`, burger appears and desktop links/auth are hidden.
  - At `769px` and wider, desktop links/auth appear and burger is hidden.
  - Drawer opens/closes at `768px` and below, including backdrop click and Escape.
  - Drawer links close the drawer after navigation.
