import { useEffect, useRef, useState } from 'react'
import { HiOutlineDotsVertical, HiOutlineSearch } from 'react-icons/hi'
import type { Member } from '../types/members'

type Props = {
  users: Member[]
  search: string
  roleFilter: string
  setSearch: (v: string) => void
  setRoleFilter: (v: string) => void
  loading: boolean
  onEdit: (user: Member) => void
  onDelete: (user: Member) => void
}

function AdminUsersPanel({ users, search, roleFilter, setSearch, setRoleFilter, loading, onEdit, onDelete }: Props) {
  const [photoUser, setPhotoUser] = useState<Member | null>(null)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 10
  const totalUsers = users.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const pageStart = (currentPage - 1) * pageSize
  const pageEnd = Math.min(pageStart + pageSize, totalUsers)
  const paginatedUsers = users.slice(pageStart, pageEnd)
  const totalLabel = roleFilter === 'admin'
    ? 'Total Admins'
    : roleFilter === 'member'
      ? 'Total Members'
      : 'Total Users'

  useEffect(() => {
    setCurrentPage(1)
  }, [search, roleFilter])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const openPhotoModal = (user: Member) => {
    setPhotoUser(user)
    setIsPhotoModalOpen(true)
  }

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false)
    setPhotoUser(null)
  }

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

      <div className="flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-white">{totalLabel}: {totalUsers}</span>
        {totalUsers > 0 && (
          <span>Showing {pageStart + 1}-{pageEnd} of {totalUsers}</span>
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-gray-950">
        <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
          <span className="col-span-2">Name</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="min-h-[440px] divide-y divide-white/5">
          {loading ? (
            <RowLoading />
          ) : users.length === 0 ? (
            <EmptyState message="No users found" />
          ) : (
            paginatedUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-5 gap-2 px-4 py-3 text-sm items-center">
                <button
                  type="button"
                  onClick={() => openPhotoModal(user)}
                  className="col-span-2 text-left font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded"
                >
                  {user.name}
                </button>
                <span className="truncate text-white/80">{user.email ?? '—'}</span>
                <span className="uppercase text-xs font-semibold">{user.role}</span>
                <RowActions user={user} onEdit={onEdit} onDelete={onDelete} />
              </div>
            ))
          )}
        </div>
        
        {isPhotoModalOpen && photoUser && (
          <PhotoModal user={photoUser} onClose={closePhotoModal} />
        )}
        
      </div>

      {totalUsers > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/5 px-4 py-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={loading || currentPage === 1}
                className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={loading || currentPage === totalPages}
                className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </section>
  )
}

type RowActionsProps = {
  user: Member
  onEdit: (user: Member) => void
  onDelete: (user: Member) => void
}

function RowActions({ user, onEdit, onDelete }: RowActionsProps) {
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
        <button
          type="button"
          className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-md border border-red-500/50 text-red-300 px-2 py-1 hover:bg-red-500/10"
          onClick={() => onDelete(user)}
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
              onClick={() => {
                onEdit(user)
                close()
              }}
              className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(user)
                close()
              }}
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

type PhotoModalProps = {
  user: Member
  onClose: () => void
}

function PhotoModal({ user, onClose }: PhotoModalProps) {
  const [downloading, setDownloading] = useState(false)
  const hasPhoto = Boolean(user.profile_picture_url)
  const placeholder = 'https://placehold.co/320x320?text=No+Photo'

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleDownload = async () => {
    if (!hasPhoto || !user.profile_picture_url) return
    try {
      setDownloading(true)
      const response = await fetch(user.profile_picture_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const ext = blob.type.split('/')[1] || 'jpg'
      const filename = `${user.slug || user.id}-photo.${ext}`
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.warn('Failed to download photo', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Runner's photo"
    >
      <div
        className="w-full max-w-lg rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/60">Runner's Photo</p>
            <h2 className="text-lg font-semibold">{user.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src={hasPhoto ? user.profile_picture_url ?? placeholder : placeholder}
            alt={hasPhoto ? `${user.name}'s profile` : 'No profile photo'}
            className="h-64 w-64 rounded-lg object-cover border border-white/10 bg-gray-900"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== placeholder) target.src = placeholder
            }}
          />
        </div>

        <div className="mt-6 flex justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasPhoto || downloading}
            className="rounded-md border border-white/10 px-4 py-2 hover:bg-white/10 disabled:opacity-60"
          >
            {downloading ? 'Downloading...' : 'Download photo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPanel
