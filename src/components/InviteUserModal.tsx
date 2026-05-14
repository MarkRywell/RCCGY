import { useEffect, useMemo, useState } from 'react'
import { HiOutlineX, HiOutlineUserAdd } from 'react-icons/hi'
import api from '../lib/supabase'
import slugifyName from '../lib/slugify'
import type { MemberRole } from '../types/members'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

type FormState = {
  name: string
  email: string
  role: MemberRole
}

function InviteUserModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', role: 'member' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const slug = useMemo(() => slugifyName(form.name || ''), [form.name])

  useEffect(() => {
    if (!open) return
    return () => {
      setForm({ name: '', email: '', role: 'member' })
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  if (!open) return null

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Valid email is required')
      return
    }
    setSubmitting(true)
    const { error: inviteError } = await api.inviteMember({
      name: form.name.trim(),
      email: form.email.trim(),
      slug: slug || undefined,
    })

    if (inviteError) {
      setError(inviteError.message ?? 'Failed to send invite')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onClose()
    onSuccess?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineUserAdd className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Invite Member</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10"
            aria-label="Close"
            disabled={submitting}
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-white/80">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="John Doe"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="user@example.com"
              disabled={submitting}
            />
          </div>

          <div className="text-xs text-white/60">
            Username (auto): <span className="text-white/80">{slug || '—'}</span>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InviteUserModal
