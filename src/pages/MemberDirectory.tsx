import { useEffect, useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import api from '../lib/supabase'
import type { MemberDirectoryRow } from '../types/members'

const formatMemberId = (memberId: number) => String(memberId).padStart(4, '0')

function MemberDirectory() {
  const [members, setMembers] = useState<MemberDirectoryRow[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 10
  const totalMembers = members.length
  const totalPages = Math.max(1, Math.ceil(totalMembers / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)
  const pageStart = (visiblePage - 1) * pageSize
  const pageEnd = Math.min(pageStart + pageSize, totalMembers)
  const paginatedMembers = members.slice(pageStart, pageEnd)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let active = true

    const fetchMembers = async () => {
      setLoading(true)
      const data = await api.getMemberDirectory({ search: debouncedSearch })

      if (!active) return
      setMembers(data)
      setLoading(false)
    }

    void fetchMembers()

    return () => {
      active = false
    }
  }, [debouncedSearch])

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-10 text-white sm:px-6 lg:px-20">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Member Directory</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Find a member</h1>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            Search members by name, username, or member ID. Select a member to open their public profile in a new tab.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-gray-950 p-4 shadow-xl">
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-gray-900 px-3 py-2">
            <HiOutlineSearch className="h-4 w-4 text-white/60" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search members (name, username, ID)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-white">Total Members: {totalMembers}</span>
          {totalMembers > 0 && (
            <span>Showing {pageStart + 1}-{pageEnd} of {totalMembers}</span>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-gray-950">
          <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
            <span className="col-span-2">Name</span>
            <span>Display Name</span>
            <span className="text-right">Member ID</span>
          </div>

          <div className="min-h-[440px] divide-y divide-white/5">
            {loading ? (
              <TableMessage message="Loading..." />
            ) : totalMembers === 0 ? (
              <TableMessage message="No members found" />
            ) : (
              paginatedMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-4 items-center gap-2 px-4 py-3 text-sm">
                  <div className="col-span-2 min-w-0">
                    {member.slug ? (
                      <a
                        href={`/member/${member.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded text-left font-medium focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <ProfileImage member={member} />
                        <span className="truncate group-hover:text-primary">{member.name}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-white/60">
                        <ProfileImage member={member} />
                        <span className="truncate">{member.name}</span>
                      </div>
                    )}
                  </div>
                  <span className="truncate text-white/80">{member.slug || 'N/A'}</span>
                  <span className="text-right text-xs font-semibold text-white/80">{formatMemberId(member.member_id)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {totalMembers > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/5 px-4 py-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <span>Page {visiblePage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
                disabled={loading || visiblePage === 1}
                className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, visiblePage + 1))}
                disabled={loading || visiblePage === totalPages}
                className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function ProfileImage({ member }: { member: MemberDirectoryRow }) {
  return member.profile_picture_url ? (
    <img
      src={member.profile_picture_url}
      alt=""
      className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gray-800 text-xs font-semibold text-white/60">
      {member.name.charAt(0).toUpperCase() || '?'}
    </span>
  )
}

function TableMessage({ message }: { message: string }) {
  return <div className="px-4 py-6 text-center text-sm text-white/60">{message}</div>
}

export default MemberDirectory
