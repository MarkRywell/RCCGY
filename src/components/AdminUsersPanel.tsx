import { HiOutlineSearch } from 'react-icons/hi'
import type { Member } from '../types/members'

type Props = {
  users: Member[]
  search: string
  roleFilter: string
  setSearch: (v: string) => void
  setRoleFilter: (v: string) => void
  loading: boolean
}

function AdminUsersPanel({ users, search, roleFilter, setSearch, setRoleFilter, loading }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-gray-950 px-3 py-2">
          <HiOutlineSearch className="h-4 w-4 text-white/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users (name, email, phone)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-white/10 bg-gray-950 px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      <div className="rounded-lg border border-white/10 bg-gray-950">
        <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
          <span className="col-span-2">Name</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <RowLoading />
          ) : users.length === 0 ? (
            <EmptyState message="No users found" />
          ) : (
            users.map((user) => (
              <div key={user.id} className="grid grid-cols-5 gap-2 px-4 py-3 text-sm items-center">
                <span className="col-span-2 font-medium">{user.name}</span>
                <span className="truncate text-white/80">{user.email ?? '—'}</span>
                <span className="uppercase text-xs font-semibold">{user.role}</span>
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

export default AdminUsersPanel
