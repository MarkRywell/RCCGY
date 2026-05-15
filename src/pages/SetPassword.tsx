import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { supabase } from '../lib/supabase'

function SetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const session = await api.getSession()
      if (!session?.access_token) {
        navigate('/login')
        return
      }
      setLoading(false)
    }
    void checkSession()
  }, [navigate])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (submitting) return
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
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token || !session.user?.email) {
      setError('Session expired. Please log in again.')
      setSubmitting(false)
      navigate('/login')
      return
    }

    // Use updateUser to set password for the current (temp) session user
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message ?? 'Failed to set password')
      setSubmitting(false)
      return
    }

    // Optional: sign in with new password to ensure clean session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password,
    })

    if (signInError) {
      setError(signInError.message ?? 'Failed to sign in with new password')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-800 text-white">
        Checking invitation session...
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center lg:pb-20 bg-gray-800 px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-gray-900 p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Set your password</h1>
        <p className="text-sm text-white/70 mb-4">Complete your account setup by creating a password.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-white/80">New password</label>
            <input
              type="password"
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/80">Confirm password</label>
            <input
              type="password"
              className="w-full rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm outline-none focus:border-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
          >
            {submitting ? 'Setting password...' : 'Set password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetPassword
