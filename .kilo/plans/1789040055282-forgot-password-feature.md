# Forgot Password Feature Plan

## Goal
Add a working forgot-password flow using Supabase Auth:

- `/reset-password` lets a user enter their email and request a reset email.
- The reset email redirects to a second page where the user enters and confirms a new password.
- The Supabase reset-password email template is updated to match the new flow and copy.
- After a successful password update, the user is sent back to `/login`.

## Decisions
- Use Supabase Auth's built-in recovery flow, not a frontend-only mock or custom token backend.
- Keep `/login` as the final destination after password reset.
- Reuse the current public layout, visual style, Tailwind classes, and existing Supabase client.
- Preserve the existing invitation password setup behavior at `/set-password`; do not break admin invite links.
- Use a separate reset-password confirmation route so invitation setup and password recovery can have different copy and redirect behavior.
- Only allow `/reset-password/new` to update the password when reached through a Supabase password-recovery link/session, not merely because any user is already signed in.

## Current Context
- `src/pages/Login.tsx` currently links to `/reset-password`, but no route/page exists for it.
- `src/App.tsx` currently has `/login` and `/set-password` routes inside `PublicLayout`.
- `src/pages/SetPassword.tsx` already updates the current Supabase session user's password with `supabase.auth.updateUser({ password })` and redirects to `/login`.
- `src/lib/supabase.ts` exports both `api` and `supabase`; `api` has login/session helpers but no password reset helper yet.
- `supabase/functions/invite-member/index.ts` sends invite links to `/set-password`, so `/set-password` must remain valid.
- There is no committed recovery email template file. `supabase/config.toml` only contains commented examples for email templates, and no active `[auth.email.template.recovery]` section is configured.

## Implementation Tasks
1. Add an API helper in `src/lib/supabase.ts`:
   - `resetPasswordForEmail(email: string, redirectTo: string)` calling `supabase.auth.resetPasswordForEmail(email, { redirectTo })`.
   - Return `{ data, error }` consistently with existing auth helpers.

2. Create `src/pages/ResetPassword.tsx` for the email request page:
   - State: `email`, `loading`, `error`, `sent`.
   - Validate a non-empty, email-shaped value before submitting.
   - On submit, call the new helper with `email.trim()` and `redirectTo` set to `${window.location.origin}/reset-password/new`.
   - On success, show a neutral confirmation such as `If an account exists for this email, a reset link has been sent.` to avoid account enumeration.
   - If Supabase returns an operational error such as rate limiting or network failure, show the error inline.
   - Keep the form disabled while submitting.
   - Include a `Link` back to `/login`.
   - Match the existing login/auth card styling and responsiveness.

3. Create `src/pages/NewPassword.tsx` for the reset password page:
   - State: `password`, `confirmPassword`, `loading`, `submitting`, `error`, `canReset`.
   - On mount, use `supabase.auth.onAuthStateChange` and `supabase.auth.getSession()` to wait for Supabase to parse the recovery link.
   - Treat the page as authorized only when the recovery redirect is detected, preferably via Supabase's `PASSWORD_RECOVERY` auth event. As a fallback, allow it when the current URL contains recovery-link indicators such as `type=recovery` while a valid session/access token exists.
   - Do not enable the reset form for an arbitrary existing session if the user manually navigates to `/reset-password/new` without recovery-link evidence.
   - If there is no recovery session/access token, show a useful message with links to `/reset-password` and `/login`; do not silently redirect immediately because expired/invalid email links need explanation.
   - Validate password length at 8+ characters in the UI, even though local Supabase config minimum is currently 6.
   - Validate matching password/confirmation.
   - Call `supabase.auth.updateUser({ password })`.
   - After success, sign out with `api.signOut()` or `supabase.auth.signOut()` to clear the temporary recovery session, then `navigate('/login')`.
   - Use copy specific to resetting an existing password, not invitation setup.

4. Update routing in `src/App.tsx`:
   - Lazy import `ResetPassword` and `NewPassword`.
   - Add `<Route path="/reset-password" element={<ResetPassword />} />`.
   - Add `<Route path="/reset-password/new" element={<NewPassword />} />`.
   - Keep existing `<Route path="/set-password" element={<SetPassword />} />` unchanged.

5. Update `src/pages/Login.tsx`:
   - Replace the raw `<a href="/reset-password">` with React Router `Link` to avoid a full page reload.
   - Import `Link` from `react-router-dom` alongside `useNavigate`.

6. Update local Supabase auth configuration for reset links:
   - In `supabase/config.toml`, add the Vite dev reset URL to the Auth redirect allow-list so local reset-email testing can redirect back to the app.
   - Include `http://localhost:5173/reset-password/new` and, if the app is run on `127.0.0.1`, include `http://127.0.0.1:5173/reset-password/new`.
   - Do not remove existing redirect URLs because other auth flows may depend on them.

7. Add a repo-tracked local Supabase recovery email template:
   - Create `supabase/templates/recovery.html` with the HTML below.
   - Add an active local config section in `supabase/config.toml`:

```toml
[auth.email.template.recovery]
subject = "Reset your RCCG YAYA password"
content_path = "./templates/recovery.html"
```

8. Update the hosted Supabase reset-password email template:
   - In the hosted Supabase Dashboard, update Authentication > Emails > Reset Password to use the same template below.
   - Keep `{{ .ConfirmationURL }}` exactly as the link target because Supabase replaces it with the signed recovery link.
   - Use wording that explains the link opens the app's new-password page and that users can ignore the email if they did not request it.
   - Recommended subject: `Reset your RCCG YAYA password`.
   - Recommended HTML:

```html
<h2>Reset your password</h2>

<p>We received a request to reset the password for your RCCG YAYA account.</p>

<p>
  Click the button below to choose a new password. This link can only be used once and may expire soon.
</p>

<p>
  <a href="{{ .ConfirmationURL }}">Reset password</a>
</p>

<p>If you did not request a password reset, you can safely ignore this email.</p>
```

9. Update hosted Supabase redirect allow-list:
   - In the hosted Supabase Dashboard, add the production deployed URL for `/reset-password/new` to Auth redirect allow-list settings.
   - If the hosted project is used during local development, also add the local development URL used by Vite.
   - The local `supabase/config.toml` changes do not update the hosted Supabase project automatically.

## Failure Modes To Handle
- Empty or malformed email: show inline validation and do not submit.
- Supabase email rate limit or network error: show `error.message` in the request page.
- Expired or invalid reset link: show an explanatory message on the new-password page with a path to request another email.
- Manual navigation to `/reset-password/new` while signed in: do not show the reset form unless a recovery link/session was detected.
- Password too short: show inline error before calling Supabase.
- Password confirmation mismatch: show inline error before calling Supabase.
- Supabase update failure: show `error.message` and keep the user on the new-password page.
- Successful update but sign-out failure: still navigate to `/login`, but avoid showing the stale password form again.
- Email template accidentally removes `{{ .ConfirmationURL }}`: reset emails will not contain a valid recovery link, so keep that token unchanged.

## Validation Plan
- Run `npm run build` after implementation.
- Manually verify `/login` forgot-password link navigates client-side to `/reset-password`.
- Manually verify submitting an email calls Supabase recovery and shows the neutral sent message.
- Manually verify a valid recovery link opens `/reset-password/new`, accepts matching 8+ character passwords, updates the password, signs out, and redirects to `/login`.
- Manually verify invalid/expired recovery links show recovery guidance instead of a blank or looping page.
- Manually verify visiting `/reset-password/new` directly while already signed in does not allow changing the current user's password.
- Manually verify `/set-password` invitation flow still loads and can update invite passwords as before.
- Send or preview the Supabase reset-password email and verify the copy is correct and the reset link points to `/reset-password/new` through Supabase's recovery URL.

## Out Of Scope
- Custom Edge Function/token storage for password reset.
- Database schema changes.
- Changing the existing admin invitation flow.
