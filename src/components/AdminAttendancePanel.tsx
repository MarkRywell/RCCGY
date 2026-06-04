import { useEffect, useRef, useState } from 'react'
import { HiOutlineDotsVertical, HiOutlineSearch } from 'react-icons/hi'
import { api } from '../lib/supabase'
import type { AttendanceRecord } from '../types/attendance'

function AdminAttendancePanel() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      const data = await api.getAttendance()
      setAttendance(data)
      setLoading(false)
    }

    void fetchAttendance()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const { error } = await api.deleteAttendance(id)
      if (!error) {
        setAttendance((records) => records.filter((record) => record.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdate = async (id: string) => {
    setUpdatingId(id)
    try {
      const updatedRecord = await api.updateAttendance(id, { checked_in_at: new Date().toISOString() })
      if (updatedRecord) {
        setAttendance((records) => records.map((record) => (record.id === id ? updatedRecord : record)))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const normalizedSearch = search.trim().toLowerCase()
  const eventOptions = Array.from(
    new Map(
      attendance
        .filter((record) => record.events?.name)
        .map((record) => [record.event_id, record.events?.name ?? record.event_id])
    ).entries()
  )
  const filteredAttendance = attendance.filter((record) => {
    const eventMatches = !eventFilter || record.event_id === eventFilter
    const searchable = [
      record.members?.name,
      record.members?.email,
      record.members?.slug,
      record.events?.name,
      record.events?.location,
      record.member_id,
      record.event_id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return eventMatches && (!normalizedSearch || searchable.includes(normalizedSearch))
  })

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-gray-950 px-3 py-2">
          <HiOutlineSearch className="h-4 w-4 text-white/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendance (member, email, event)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm"
        >
          <option value="">All events</option>
          {eventOptions.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-white/10 bg-gray-950">
        <div className="grid grid-cols-6 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
          <span className="col-span-2">Member</span>
          <span className="col-span-2">Event</span>
          <span>Checked In</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <RowLoading />
          ) : filteredAttendance.length === 0 ? (
            <EmptyState message="No attendance records found" />
          ) : (
            filteredAttendance.map((record) => (
              <div key={record.id} className="grid grid-cols-6 gap-2 px-4 py-3 text-sm items-center">
                <div className="col-span-2 min-w-0">
                  <div className="truncate font-medium">{record.members?.name ?? record.member_id}</div>
                  <div className="truncate text-xs text-white/60">{record.members?.email ?? record.members?.slug ?? 'No member details'}</div>
                </div>
                <div className="col-span-2 min-w-0">
                  <div className="truncate text-white/90">{record.events?.name ?? record.event_id}</div>
                  <div className="truncate text-xs text-white/60">{formatEventMeta(record)}</div>
                </div>
                <span className="text-white/80">{formatDateTime(record.checked_in_at)}</span>
                <RowActions
                  onUpdate={() => handleUpdate(record.id)}
                  onDelete={() => handleDelete(record.id)}
                  updating={updatingId === record.id}
                  deleting={deletingId === record.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function RowActions({
  onUpdate,
  onDelete,
  updating,
  deleting,
}: {
  onUpdate: () => void
  onDelete: () => void
  updating: boolean
  deleting: boolean
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const busy = updating || deleting

  useEffect(() => {
    if (!open) return

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="flex justify-end text-xs">
      <div className="hidden md:flex gap-2">
        <button
          type="button"
          className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10 disabled:opacity-70"
          onClick={onUpdate}
          disabled={busy}
        >
          {updating ? 'Updating...' : 'Refresh'}
        </button>
        <button
          type="button"
          className="rounded-md border border-red-500/50 text-red-300 px-2 py-1 hover:bg-red-500/10 disabled:opacity-70"
          onClick={onDelete}
          disabled={busy}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <div className="relative md:hidden" ref={menuRef}>
        <button
          type="button"
          aria-label="Open actions"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10"
          disabled={busy}
        >
          <HiOutlineDotsVertical className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 z-20 mt-2 w-32 rounded-md border border-white/10 bg-gray-950 p-1 shadow-lg">
            <button
              type="button"
              onClick={() => { close(); onUpdate() }}
              className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/10 disabled:opacity-70"
              disabled={busy}
            >
              {updating ? 'Updating...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={() => { close(); onDelete() }}
              className="w-full rounded-md px-3 py-2 text-left text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-70"
              disabled={busy}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function RowLoading() {
  return (
    <div className="px-4 py-6 text-center text-sm text-white/60">Loading...</div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-6 text-center text-sm text-white/60">{message}</div>
  )
}

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function formatEventMeta(record: AttendanceRecord) {
  const parts = [
    record.events?.event_date ? new Date(record.events.event_date).toLocaleDateString() : null,
    record.events?.location,
  ].filter(Boolean)

  return parts.length ? parts.join(' • ') : 'No event details'
}

export default AdminAttendancePanel
