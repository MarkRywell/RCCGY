## Admin authentication & routing notes

- Admin isolation: `/admin` bypasses public shell (no Header/Nav/Footer) per routing changes in [`src/App.tsx:1`].
- Guard: [`src/components/AdminGuard.tsx:1`] checks Supabase session via `api.getSession` and member role via `api.getMemberByUserId`; states: loading -> `Loader`, forbidden -> public shell + `NotFound`, authorized -> children.
- Login redirect: [`src/pages/Login.tsx:38`] sign-in then role-check; admins navigate to `/admin`.
- Admin logout: [`src/pages/Admin.tsx:23`] uses `api.signOut` then `navigate('/')` from sidebar logout action.
- Components introduced for admin shell:
  - Sidebar [`src/layout/AdminSidebar.tsx:1`]
  - Topbar [`src/components/AdminTopbar.tsx:1`]
  - Users panel [`src/components/AdminUsersPanel.tsx:1`]
  - Events panel [`src/components/AdminEventsPanel.tsx:1`]
- Types/API support:
  - Event type in [`src/types/events.ts:1`]
  - Supabase CRUD/session helpers in [`src/lib/supabase.ts:1`] (members/events get/create/update/delete; getSession; signOut; getMemberByUserId; getMembers/getEvents with search/filter)

### Flow summary
- /admin route -> AdminGuard -> if authorized render Admin page (custom sidebar/topbar, no public shell).
- Unauthorized /admin -> public Header/Nav -> NotFound -> Footer.
- Login success -> if role admin -> redirect /admin; otherwise stays on login context.
- Admin logout -> sign out -> redirect home.
