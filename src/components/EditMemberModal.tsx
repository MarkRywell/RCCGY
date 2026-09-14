import { useEffect, useRef, useState } from 'react'
import api from '../lib/supabase'
import type { Member } from '../types/members'

type Props = {
  member: Member
  onClose: () => void
  onSaved: () => void
}

type FormState = {
  name: string
  phone: string
  address: string
  birth_date: string
  emergency_contact: string
  shoe_size: string
  shirt_size: string
  profile_picture_url: string
  profile_picture_public_id: string
}

const shirtSizeOptions = ['XS', 'Small', 'Medium', 'Large', 'XL', 'XXL', 'XXXL']

const getFormState = (member: Member): FormState => ({
  name: member.name ?? '',
  phone: member.phone ?? '',
  address: member.address ?? '',
  birth_date: member.birth_date ?? '',
  emergency_contact: member.emergency_contact ?? '',
  shoe_size: member.shoe_size?.toString() ?? '',
  shirt_size: member.shirt_size ?? '',
  profile_picture_url: member.profile_picture_url ?? '',
  profile_picture_public_id: member.profile_picture_public_id ?? '',
})

function EditMemberModal({ member, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => getFormState(member))
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Avoid cascading renders warning: only reset state when member identity changes after first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setForm(getFormState(member))
    setError(null)
    setUploading(false)
    setSubmitting(false)
  }, [member])

  const onSelectFile = async (file?: File) => {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const result = await api.uploadProfilePicture(file, member.id)
      setForm((f) => ({
        ...f,
        profile_picture_url: result.secure_url,
        profile_picture_public_id: result.public_id,
      }))
    } catch (err) {
      setError((err as Error)?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const name = form.name.trim()
    const phone = form.phone.trim()
    const address = form.address.trim()
    const emergencyContact = form.emergency_contact.trim()
    const shoeSize = form.shoe_size.trim()
    const shirtSize = form.shirt_size.trim()

    if (!name) {
      setError('Name is required')
      return
    }

    if (shoeSize && !/^\d+$/.test(shoeSize)) {
      setError('Shoe size must be a whole number')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await api.updateMember(member.id, {
      name,
      phone: phone || null,
      address: address || null,
      birth_date: form.birth_date || null,
      emergency_contact: emergencyContact || null,
      shoe_size: shoeSize ? Number(shoeSize) : null,
      shirt_size: shirtSize || null,
      profile_picture_url: form.profile_picture_url || null,
      profile_picture_public_id: form.profile_picture_public_id || null,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update member')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10"
            disabled={submitting || uploading}
          >
            ✕
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
              placeholder="Full name"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Optional"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="min-h-20 w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Optional"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Emergency Contact</label>
            <input
              type="text"
              value={form.emergency_contact}
              onChange={(e) => setForm((f) => ({ ...f, emergency_contact: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Optional"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Birth Date</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm text-white/80">Shoe Size (US)</label>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.shoe_size}
                onChange={(e) => setForm((f) => ({ ...f, shoe_size: e.target.value }))}
                className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Optional"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-white/80">Shirt Size</label>
              <select
                value={form.shirt_size}
                onChange={(e) => setForm((f) => ({ ...f, shirt_size: e.target.value }))}
                className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
                disabled={submitting}
              >
                <option value="">Select size</option>
                {shirtSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Profile Picture</label>
            <div className="flex items-center gap-3">
              {form.profile_picture_url ? (
                <img
                  src={form.profile_picture_url}
                  alt="Profile preview"
                  className="h-12 w-12 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="h-12 w-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs">
                  N/A
                </div>
              )}
              <label className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onSelectFile(e.target.files?.[0])}
                  disabled={uploading || submitting}
                />
                {uploading ? 'Uploading...' : 'Upload photo'}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-white/70">
            <div>
              <div className="text-white/50">Email</div>
              <div className="truncate" title={member.email ?? '—'}>{member.email ?? '—'}</div>
            </div>
            <div>
              <div className="text-white/50">Role</div>
              <div className="uppercase font-semibold">{member.role}</div>
            </div>
            <div>
              <div className="text-white/50">Username</div>
              <div className="truncate" title={member.slug}>{member.slug}</div>
            </div>
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
              disabled={submitting || uploading}
            >
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMemberModal
