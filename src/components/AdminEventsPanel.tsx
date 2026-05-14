import { HiOutlineSearch } from 'react-icons/hi'
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
                <div className="flex justify-end gap-2 text-xs">
                  <button className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10">Edit</button>
                  <button className="rounded-md border border-red-500/50 text-red-300 px-2 py-1 hover:bg-red-500/10">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
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
