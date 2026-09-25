import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineLogout, HiOutlineMenu, HiOutlineShoppingBag, HiOutlineUser, HiOutlineX } from 'react-icons/hi'
import AdminUsersPanel from '../components/AdminUsersPanel'
import api from '../lib/supabase'
import type { Member, MemberRole } from '../types/members'

function Shop() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentMemberSlug, setCurrentMemberSlug] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadCurrentMember = async () => {
      const session = await api.getSession()
      const userId = session?.user?.id
      if (!userId) return

      const member = await api.getMemberByUserId(userId)
      if (!active) return
      setCurrentMemberSlug(member?.slug ?? null)
    }

    void loadCurrentMember()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const fetchUsers = async () => {
      setLoading(true)
      const data = await api.getMembers({
        search,
        role: roleFilter ? (roleFilter as MemberRole) : undefined,
      })

      if (!active) return
      setUsers(data)
      setLoading(false)
    }

    void fetchUsers()

    return () => {
      active = false
    }
  }, [search, roleFilter])

  const handleLogout = async () => {
    await api.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 border-r border-white/10 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 font-bold text-lg">
            <HiOutlineShoppingBag className="h-5 w-5" />
            Shop
          </div>
          <button
            type="button"
            className="sm:hidden rounded-md p-2 hover:bg-white/10"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
          >
            <HiOutlineShoppingBag className="h-5 w-5" />
            <span>Member Directory</span>
          </button>
          <div className="h-px bg-white/10 my-2" />
          {currentMemberSlug && (
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              onClick={() => navigate(`/member/${currentMemberSlug}`)}
            >
              <HiOutlineUser className="h-5 w-5" />
              <span>My Profile</span>
            </button>
          )}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            onClick={() => navigate('/')}
          >
            <HiOutlineHome className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
          <div className="h-px bg-white/10 my-2" />
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            onClick={handleLogout}
          >
            <HiOutlineLogout className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen sm:ml-64">
        <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="sm:hidden rounded-md p-2 hover:bg-white/10"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-white/60">Shop</p>
              <h1 className="sm:text-xl font-bold">Member Directory</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6">
          <AdminUsersPanel
            users={users}
            search={search}
            roleFilter={roleFilter}
            setSearch={setSearch}
            setRoleFilter={setRoleFilter}
            loading={loading}
            readOnly
          />
        </main>
      </div>
    </div>
  )
}

export default Shop
