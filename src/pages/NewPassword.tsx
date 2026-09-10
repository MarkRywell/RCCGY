import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { supabase } from '../lib/supabase'
import Logo from '../assets/logos/logo-bg.png'

function hasRecoveryLinkIndicator() {
  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))

  return (
    searchParams.get('type') === 'recovery' ||
    hashParams.get('type') === 'recovery'
  )
}

function NewPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canReset, setCanReset] = useState(false)

  useEffect(() => {
    let settled = false
    const recoveryLinkPresent = hasRecoveryLinkIndicator()

    const allowReset = () => {
      settled = true
      setCanReset(true)
      setLoading(false)
    }

    const denyReset = () => {
      if (settled) return
      settled = true
      setCanReset(false)
      setLoading(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session?.access_token) {
        allowReset()
      }
    })

    const checkSession = async () => {
      const session = await api.getSession()
      if (recoveryLinkPresent && session?.access_token) {
        allowReset()
        return
      }

      window.setTimeout(denyReset, recoveryLinkPresent ? 1500 : 0)
    }

    void checkSession()

    return () => {
      settled = true
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (submitting || !canReset) return
    setError(null)

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-800 px-4 text-center text-white">
        Checking password reset link...
      </div>
    )
  }

  if (!canReset) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4 text-white">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-gray-900 p-6 text-center shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Reset link expired</h1>
          <p className="text-sm text-white/70 mb-5">
            This password reset link is missing, expired, or has already been used. Request a new link to reset your password.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/reset-password"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Request new link
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-secondary hover:text-secondary"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4 text-white">
      <div className="flex w-full max-w-sm md:max-w-md flex-col items-center gap-6 bg-dark p-5 sm:p-6 rounded-lg shadow-xl shadow-white/15">
        <img src={Logo} alt="Logo" className="w-32 mb-2 rounded-full" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Choose New Password</h1>
          <p className="text-sm text-gray-400">Enter and confirm your new password to finish resetting your account.</p>
        </div>

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
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
      </div>
    </div>
  )
}

export default NewPassword
