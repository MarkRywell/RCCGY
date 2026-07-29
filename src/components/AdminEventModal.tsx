import { useEffect, useRef, useState } from 'react'
import { HiOutlineX, HiOutlinePhotograph } from 'react-icons/hi'
import type { Event } from '../types/events'

type Props = {
  open: boolean
  initialEvent: Event | null
  onClose: () => void
  onSubmit: (payload: EventFormValues) => Promise<void>
  submitting: boolean
}

export type EventFormValues = {
  name: string
  event_date: string
  location?: string | null
  description?: string | null
  photo_url?: string | null
  photo_file?: File | null
}

function AdminEventModal({ open, initialEvent, onClose, onSubmit, submitting }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<EventFormValues>(() => ({
    name: initialEvent?.name ?? '',
    event_date: initialEvent?.event_date ? initialEvent.event_date.slice(0, 16) : '',
    location: initialEvent?.location ?? '',
    description: initialEvent?.description ?? '',
    photo_url: initialEvent?.photo_url ?? '',
    photo_file: null,
  }))

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm({
      name: initialEvent?.name ?? '',
      event_date: initialEvent?.event_date ? initialEvent.event_date.slice(0, 16) : '',
      location: initialEvent?.location ?? '',
      description: initialEvent?.description ?? '',
      photo_url: initialEvent?.photo_url ?? '',
      photo_file: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [open, initialEvent])

  if (!open) return null

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (!form.event_date) {
      setError('Date is required')
      return
    }

    // Basic URL validation when no file chosen and photo_url provided
    if (!form.photo_file && form.photo_url && form.photo_url.trim()) {
      const urlPattern = /^(https?:\/\/).+/i
      if (!urlPattern.test(form.photo_url.trim())) {
        setError('Photo URL must be a valid URL (https://...)')
        return
      }
    }

    try {
      await onSubmit(form)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save event'
      setError(msg)
      return
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlinePhotograph className="h-5 w-5" />
            <h2 className="text-lg font-semibold">{initialEvent ? 'Edit Event' : 'New Event'}</h2>
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

        <form className="space-y-4" onSubmit={onSubmitForm}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm text-white/80">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Event name"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm text-white/80">Date & Time</label>
              <input
                type="datetime-local"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm text-white/80">Location</label>
              <input
                type="text"
                value={form.location ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Venue Location"
                disabled={submitting}
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="min-h-24 w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Details about the event"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Upload Event Photo</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setForm((f) => ({ ...f, photo_file: file }))
                  }}
                  className="hidden"
                  disabled={submitting}
                />
                Upload Event Photo
              </label>
              {form.photo_file && (
                <span className="text-xs text-white/70">Selected: {form.photo_file.name}</span>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-center md:justify-end gap-3 pt-2">
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
              {submitting ? 'Saving...' : initialEvent ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEventModal
