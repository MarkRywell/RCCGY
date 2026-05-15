import { useEffect, useRef, useState } from 'react'
import { HiOutlineDotsVertical, HiOutlineSearch } from 'react-icons/hi'
import type { Event } from '../types/events'

type Props = {
  events: Event[]
  search: string
  setSearch: (v: string) => void
  loading: boolean
}

function AdminEventsPanel({ events, search, setSearch, loading }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-gray-950 px-3 py-2">
        <HiOutlineSearch className="h-4 w-4 text-white/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events (name, location)"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-gray-950">
        <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
          <span className="col-span-2">Name</span>
          <span>Date</span>
          <span>Location</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <RowLoading />
          ) : events.length === 0 ? (
            <EmptyState message="No events found" />
          ) : (
            events.map((event) => (
              <div key={event.id} className="grid grid-cols-5 gap-2 px-4 py-3 text-sm items-center">
                <span className="truncate col-span-2 font-medium">{event.name}</span>
                <span className="text-white/80">{new Date(event.event_date).toLocaleDateString()}</span>
                <span className="truncate text-white/80">{event.location ?? '—'}</span>
                <RowActions />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function RowActions() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
        <button type="button" className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10">Edit</button>
        <button
          type="button"
          className="rounded-md border border-red-500/50 text-red-300 px-2 py-1 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <div className="relative md:hidden" ref={menuRef}>
        <button
          type="button"
          aria-label="Open actions"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10"
        >
          <HiOutlineDotsVertical className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 z-20 mt-2 w-28 rounded-md border border-white/10 bg-gray-950 p-1 shadow-lg">
            <button
              type="button"
              onClick={close}
              className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-md px-3 py-2 text-left text-xs text-red-300 hover:bg-red-500/10"
            >
              Delete
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

export default AdminEventsPanel
