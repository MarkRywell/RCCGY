import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail } from 'react-icons/hi'
import api from '../lib/supabase'
import Logo from '../assets/logos/logo-bg.png'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmedEmail = email.trim()
    setError(null)
    setSent(false)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    const redirectTo = `${window.location.origin}/reset-password/new`
    const { error: resetError } = await api.resetPasswordForEmail(trimmedEmail, redirectTo)

    if (resetError) {
      setError(resetError.message ?? 'Failed to send reset email.')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4 text-white">
      <div className="flex w-full max-w-sm md:max-w-md flex-col items-center gap-6 bg-dark p-5 sm:p-6 rounded-lg shadow-xl shadow-white/15">
        <img src={Logo} alt="Logo" className="w-32 mb-2 rounded-full" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-sm text-gray-400">
            Enter your email address and we will send you a link to choose a new password.
          </p>
        </div>

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-70"
              aria-label="email address"
              disabled={loading}
              required
            />
            {email.trim() === '' && (
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center gap-2 text-gray-500">
                <HiOutlineMail className="text-lg" aria-hidden="true" />
                <span className="text-sm uppercase tracking-wide">email address</span>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          {sent && (
            <p className="text-sm text-green-400" role="status" aria-live="polite">
              If an account exists for this email, a reset link has been sent.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-orange-500/60 ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary'
            }`}
          >
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>

        <Link to="/login" className="text-sm text-secondary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  )
}

export default ResetPassword
