import { useEffect, useMemo, useRef, useState } from 'react'
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
  slug: string
}

function InviteUserModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', role: 'member', slug: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const slugInputRef = useRef<HTMLInputElement | null>(null)

  const autoSlug = useMemo(() => slugifyName(form.name || ''), [form.name])

  useEffect(() => {
    if (!open) return
    return () => {
      setForm({ name: '', email: '', role: 'member', slug: '' })
      setError(null)
      setSlugError(null)
      setSlugEdited(false)
      setSubmitting(false)
    }
  }, [open])

  const handleSlugChange = (value: string) => {
    const sanitized = slugifyName(value)
    setForm((f) => ({ ...f, slug: sanitized }))
    setSlugEdited(true)
    setSlugError(null)
  }

  const validateSlug = (value: string) => {
    if (!value || value.length < 3) return 'Username must be at least 3 characters'
    if (value.length > 30) return 'Username must be at most 30 characters'
    if (!/^[a-z0-9-]+$/.test(value)) return 'Only lowercase letters, numbers, and hyphens are allowed'
    return null
  }

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
    const slugToUse = form.slug || autoSlug
    const slugValidationError = validateSlug(slugToUse)
    if (slugValidationError) {
      setSlugError(slugValidationError)
      slugInputRef.current?.focus()
      return
    }
    setSubmitting(true)
    const { error: inviteError } = await api.inviteMember({
      name: form.name.trim(),
      email: form.email.trim(),
      slug: slugToUse || undefined,
    })

    if (inviteError) {
      const msg = inviteError.message ?? 'Failed to send invite'
      setError(msg)
      if (msg.toLowerCase().includes('username is already taken') || msg.toLowerCase().includes('slug')) {
        slugInputRef.current?.focus()
      }
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
              onChange={(e) =>
                setForm((f) => {
                  const nextName = e.target.value
                  const nextSlug = !slugEdited ? slugifyName(nextName) : f.slug
                  return { ...f, name: nextName, slug: nextSlug }
                })
              }
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

        <div className="space-y-1">
          <label className="text-sm text-white/80">Username</label>
          <input
            ref={slugInputRef}
            type="text"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="auto-generated from name"
            disabled={submitting}
          />
          <div className="flex items-start justify-between text-xs text-white/60">
            <span>Lowercase letters, numbers, and hyphens; 3-30 characters.</span>
            <span className="text-white/50">{form.slug || '—'}</span>
          </div>
          {slugError && <p className="text-xs text-red-400">{slugError}</p>}
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
