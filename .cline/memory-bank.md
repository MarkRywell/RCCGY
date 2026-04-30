# RCCGY — Memory Bank (Project Structure + Tailwind Setup)

This document is a **quick-reference** map of the current RCCGY repo: how the app boots, where code lives, and how styling is configured (Tailwind v4 CSS-first setup).

> Source of truth for styling tokens: `src/index.css`

---

## 1) Stack / Tooling

- **Build tool**: Vite
- **UI**: React (v19)
- **Language**: TypeScript
- **Routing**: React Router (v7)
- **Styling**: Tailwind CSS (v4) + `@tailwindcss/vite` plugin

Key config files:

- `vite.config.ts` — enables React + React Compiler preset + Tailwind Vite plugin
- `package.json` — scripts and dependencies
- `index.html` — Vite entry HTML

---

## 2) App boot flow (entry points)

1. `index.html`
   - Contains `<div id="root"></div>`
   - Loads `src/main.tsx`

2. `src/main.tsx`
   - Imports global styles: `import './index.css'`
   - Renders `<App />` under:
     - `React.StrictMode`
     - `BrowserRouter` (react-router-dom)

3. `src/App.tsx`
   - Defines route table using `<Routes>` / `<Route>`
   - Lazy-loads pages with `React.lazy` + `Suspense` (fallback: `Loader`)
   - Layout structure (top -> bottom):
     - Sticky stack: `Header` (collapsible on scroll) + `Nav`
     - Route content
     - `Footer`

---

## 3) Routing map (from `src/App.tsx`)

| Path | Component |
|------|-----------|
| `/` | `src/pages/Home.tsx` |
| `/events` | `src/pages/Events.tsx` |
| `/partners` | `src/pages/Partners.tsx` |
| `/about` | `src/pages/About.tsx` |
| `/contact` | `src/pages/Contact.tsx` |
| `*` | `src/pages/NotFound.tsx` |

Loader:

- `src/pages/Loader.tsx` — used as Suspense fallback

---

## 4) `src/` directory map

Top-level files:

- `src/main.tsx` — React root + Router wrapper + global CSS import
- `src/App.tsx` — app shell + route table
- `src/index.css` — Tailwind + theme tokens

Directories:

- `src/assets/`
  - Static assets used by UI
  - Observed subfolders: `images/`, `logos/`

- `src/layout/`
  - Shared page chrome/layout components
  - Observed: `Header.tsx`, `Nav.tsx`, `Footer.tsx`

- `src/pages/`
  - Route-level pages
  - Observed: `Home`, `Events`, `Partners`, `About`, `Contact`, `NotFound`, `Loader`

- `src/components/`
  - Intended for reusable UI components (non-route, non-layout)

- `src/context/`
  - Intended for React context providers/state

- `src/redux/`
  - Intended for Redux state management

---

## 5) Tailwind CSS v4 setup (CSS-first)

### 5.1 How Tailwind is wired

- Tailwind is enabled via **Vite plugin**:
  - Dependency: `@tailwindcss/vite`
  - Config: `vite.config.ts` includes `tailwindcss()` in `plugins: []`

### 5.2 Where theme/config lives

- **No `tailwind.config.*` present** in the repo.
- Theme tokens are defined in **`src/index.css`** using Tailwind v4’s `@theme` at-rule.

### 5.3 `src/index.css` contents

#### Imports

- Imports Google Sans and Gothic A1 from Google Fonts.
- Imports Tailwind:

```css
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Gothic+A1&display=swap');

@import "tailwindcss";
```

#### Base layer tweak

```css
@layer base {
  body {
    overflow-x: hidden;
    font-family: var(--font-sans);
  }
}
```

Purpose: avoid accidental horizontal scrolling when components use transforms/100vw/etc.

#### Theme tokens (design system)

```css
@theme {
  --color-primary: #ff3600;
  --color-secondary: #fe7a0d;
  --color-dark: #0e0d0d;

  --font-sans: "Google Sans", sans-serif, ui-sans-serif, system-ui;
  --font-serif: "Gothic A1", serif, ui-serif, system-ui;

  --breakpoint-sm: 600px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

Observed usage in UI (examples):

- `bg-dark`, `text-primary`
- Responsive modifiers like `sm:`, `md:`, `lg:`

Font usage notes:

- Default site font is set globally via `body { font-family: var(--font-sans); }`.
- To render an element in **Gothic A1**, use Tailwind class `font-serif` (maps to `--font-serif`).

---

## 6) Common extension points

### Add a new route/page

1. Create a page component in `src/pages/YourPage.tsx`
2. Add a lazy import + `<Route>` in `src/App.tsx`

### Add/edit design tokens

- Edit `src/index.css` `@theme { ... }`
- Keep tokens grouped (colors, fonts, breakpoints)

### Add new shared chrome

- Prefer `src/layout/` for app-wide sections (header/nav/footer-like)
- Prefer `src/components/` for reusable UI pieces used within pages/layout

---

## 7) Snapshot of notable implementation details

- `src/App.tsx` implements a **scroll-aware Header hide/show** behavior using:
  - `requestAnimationFrame` throttling pattern
  - `passive: true` scroll listener

- `src/layout/Nav.tsx` mobile menu behavior:
  - Locks body scrolling while drawer is open
  - Closes on `Escape`
  - Backdrop click closes the menu

---

## 8) Components

### `src/components/StatsCard.tsx`

Purpose: renders a stat card with icon, a main numeric value, and a title.

Props:

```ts
type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  /** Small text beside the value (e.g. '+', 'km', '/wk') */
  unit?: string;
};
```

Formatting behavior:

- If `value` is a `number`, it is formatted with `Intl.NumberFormat()` (e.g. `1200 -> 1,200`).
- If `value` is a `string`, it is displayed as-is.
- If `unit` is provided, it is rendered beside the value as smaller text.

Example usage (from `src/pages/Home.tsx`):

```tsx
<StatsCard icon={<IoIosPeople />} title="ACTIVE RUNNERS" value={388} unit="+" />
<StatsCard icon={<LiaCalendarDaySolid />} title="RUNNING EVENTS" value={1} unit="/wk" />
<StatsCard icon={<FaPersonRunning />} title="WEEKLY KILOMETERS RUN" value={30} unit="km" />
```
