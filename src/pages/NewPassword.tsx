import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api, { supabase } from '../lib/supabase'
import Logo from '../assets/logos/logo-bg.png'

function getRecoveryLinkError() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const error = hashParams.get('error')
  const errorCode = hashParams.get('error_code')

  if (!error && !errorCode) return null

  const description = hashParams.get('error_description')?.replace(/[.\s]+$/, '')
  return description
    ? `${description}. Request a new code to reset your password.`
    : 'This reset link is invalid or has expired. Request a new code to reset your password.'
}

function getInitialEmail(state: unknown) {
  if (!state || typeof state !== 'object' || !('email' in state)) return ''

  const email = (state as { email?: unknown }).email
  return typeof email === 'string' ? email : ''
}

function NewPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(() => getInitialEmail(location.state))
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(() => getRecoveryLinkError())

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError(null)

    const trimmedEmail = email.trim().toLowerCase()
    const normalizedToken = token.replace(/\s/g, '')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!/^\d{6}$/.test(normalizedToken)) {
      setError('Please enter the 6-digit verification code from your email.')
      return
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error: verifyError } = await api.verifyPasswordResetOtp(trimmedEmail, normalizedToken)

    if (verifyError) {
      setError('Invalid or expired verification code. Request a new code and try again.')
      setSubmitting(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message ?? 'Failed to reset password.')
      setSubmitting(false)
      return
    }

    await api.signOut()
    setSubmitting(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4 text-white">
      <div className="flex w-full max-w-sm md:max-w-md flex-col items-center gap-6 bg-dark p-5 sm:p-6 rounded-lg shadow-xl shadow-white/15">
        <img src={Logo} alt="Logo" className="w-32 mb-2 rounded-full" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Choose New Password</h1>
          <p className="text-sm text-gray-400">Enter the code from your email and choose a new password.</p>
        </div>

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="reset-email">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="verification-code">
              Verification code
            </label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-center text-lg tracking-[0.35em] outline-none focus:border-primary disabled:opacity-70"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              autoComplete="one-time-code"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="confirm-new-password">
              Confirm new password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-70"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
          >
            {submitting ? 'Resetting password...' : 'Reset Password'}
          </button>
        </form>

        <Link to="/reset-password" className="text-sm text-secondary hover:underline">
          Request a new code
        </Link>
      </div>
    </div>
  )
}

export default NewPassword
