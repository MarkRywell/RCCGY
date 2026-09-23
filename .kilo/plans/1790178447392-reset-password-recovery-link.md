# Password Reset OTP Plan

## Decision
- Use Supabase's built-in recovery OTP flow, not a custom OTP table or Edge Function.
- Reason: Brevo wraps and can prefetch tracking links, which can consume Supabase one-time confirmation URLs. A displayed OTP code (`{{ .Token }}`) avoids clickable reset links and lets Supabase Auth keep ownership of expiry, throttling, verification, and recovery session creation.

## Target Flow
1. User opens `/reset-password` and enters their email.
2. App calls Supabase `resetPasswordForEmail(email)` to trigger the recovery email.
3. Supabase email template displays a 6-digit code instead of linking to `{{ .ConfirmationURL }}`.
4. App sends user to `/reset-password/new` with the email prefilled when possible.
5. User enters email, OTP code, new password, and confirm password.
6. App calls `supabase.auth.verifyOtp({ email, token, type: 'recovery' })`.
7. If verification succeeds, Supabase creates a recovery session.
8. App calls `supabase.auth.updateUser({ password })`.
9. App signs out and redirects to `/login`.

## Supabase Email Template Change
- In Supabase Dashboard, edit the Auth password recovery email template.
- Replace `{{ .ConfirmationURL }}` with `{{ .Token }}`.
- Remove the one-time reset-link button entirely, or change it to a normal public app link such as `https://rannncrewcgy.com/reset-password/new`.
- Do not include `{{ .ConfirmationURL }}` anywhere in the email body, including fallback text, hidden links, copied plain text, or button hrefs.
- Do not use `{{ .TokenHash }}` for this flow. The app implementation verifies the human-entered 6-digit `{{ .Token }}` with `verifyOtp({ email, token, type: 'recovery' })`.
- `{{ .Token }}` is the key placeholder for the built-in Supabase recovery OTP.

## Recommended Recovery Email Template
Use this as the Supabase password recovery template, adjusted only for branding/copy if needed:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 20px 0 30px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="400" style="border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td align="center" bgcolor="#0e0d0d" style="padding: 40px 0 30px 0;">
              <img
                src="https://res.cloudinary.com/di8bd6f96/image/upload/v1778771647/rccgy/logo-bg_gag3lx.png"
                alt="RCCGY Logo"
                width="120"
                style="display: block; border-radius: 4px;"
              />
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #0e0d0d; font-size: 24px; font-weight: bold; text-align: center;">
                    Reset Your Password
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 0 20px 0; color: #444444; font-size: 16px; line-height: 24px; text-align: center;">
                    We received a request to reset the password for your <strong>RCCGY Official</strong> account.
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 0 20px 0; color: #444444; font-size: 16px; line-height: 24px; text-align: center;">
                    Enter this verification code on the RCCGY password reset page:
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 0 0 25px 0;">
                    <div style="display: inline-block; letter-spacing: 8px; font-size: 32px; line-height: 40px; font-weight: bold; color: #0e0d0d; background-color: #f7f7f7; border: 1px solid #dddddd; border-radius: 8px; padding: 14px 18px;">
                      {{ .Token }}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 0 30px 0; color: #444444; font-size: 15px; line-height: 22px; text-align: center;">
                    This code can only be used once and may expire soon. Return to the website, enter your email, this code, and your new password.
                  </td>
                </tr>

                <tr>
                  <td style="padding: 30px 0 0 0; color: #888888; font-size: 13px; line-height: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    If you did not request a password reset, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td bgcolor="#0e0d0d" style="padding: 20px 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 12px; text-align: center;">
                    &copy; 2026 RCCGY Official. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Optional Public Page Link
- A normal link to `/reset-password/new` is safe because it is not the one-time Supabase recovery link.
- If added, use a hardcoded public URL such as `https://rannncrewcgy.com/reset-password/new`, not `{{ .ConfirmationURL }}`.
- Even if Brevo wraps/prefetches this normal page link, it will not consume the OTP. The user still must manually enter the code.
- The most conservative option is no link at all, only instructions to return to the website.

## Source Changes Already Planned/Implemented
1. Update `src/lib/supabase.ts`.
   - `resetPasswordForEmail(email)` calls `supabase.auth.resetPasswordForEmail(email)` without `redirectTo`.
   - `verifyPasswordResetOtp(email, token)` calls `supabase.auth.verifyOtp({ email, token, type: 'recovery' })`.

2. Update `src/pages/ResetPassword.tsx`.
   - Request a verification code instead of a reset link.
   - Navigate to `/reset-password/new` and pass the submitted email in router state.
   - Keep generic success messaging so account existence is not revealed.

3. Update `src/pages/NewPassword.tsx`.
   - Render email, 6-digit verification code, new password, and confirm password fields.
   - Validate email, 6-digit token, password length, and password confirmation.
   - Verify OTP first, then update the password.
   - Sign out and redirect to `/login` on success.
   - Keep graceful handling for old hash-error link callbacks.

## Security And Behavior Notes
- Do not log OTP codes, recovery links, tokens, or full reset URLs.
- Do not reveal whether an email exists on the request page.
- Supabase controls OTP expiry and retry/rate-limit behavior; the app should surface errors generically.
- If a user requests multiple codes, only the newest valid Supabase code should be expected to work.
- Brevo link tracking can remain enabled for non-auth marketing links, but the password recovery email must not contain a clickable Supabase confirmation URL.

## Validation Plan
1. Save the updated Supabase password recovery template in the production Supabase project.
2. Request password reset from `/reset-password`.
3. Confirm the received email shows a 6-digit code from `{{ .Token }}`.
4. Confirm the email source/body contains no `{{ .ConfirmationURL }}`-based reset link.
5. Open `/reset-password/new`.
6. Enter the email, latest code, valid new password, and matching confirmation.
7. Confirm successful redirect to `/login`.
8. Confirm login works with the new password.
9. Test invalid/expired codes and confirm the app shows a generic invalid/expired code message.

## Risks
- The Supabase email template change is required; frontend changes alone will not stop Brevo from rewriting/prefetching `{{ .ConfirmationURL }}` if the link remains in the template.
- Supabase may not send a visible 6-digit token if the wrong template variable is used. Use `{{ .Token }}` in the password recovery template, not `{{ .ConfirmationURL }}` or `{{ .TokenHash }}`.
- If production uses a different Supabase project than development, the template must be changed in the production project.
