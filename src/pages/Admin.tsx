import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/supabase'
import type { Member } from '../types/members'
import type { Event } from '../types/events'
import AdminSidebar, { type AdminTabKey } from '../layout/AdminSidebar'
import AdminTopbar from '../components/AdminTopbar'
import InviteUserModal from '../components/InviteUserModal'
import AdminUsersPanel from '../components/AdminUsersPanel'
import EditMemberModal from '../components/EditMemberModal'
import AdminEventsPanel from '../components/AdminEventsPanel'

function Admin() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTabKey>('users')

  // Users
  const [users, setUsers] = useState<Member[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<string>('')
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Events
  const [events, setEvents] = useState<Event[]>([])
  const [eventSearch, setEventSearch] = useState('')
  const [loadingEvents, setLoadingEvents] = useState(false)

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const refetchUsers = async (opts?: { search?: string; role?: 'admin' | 'member' }) => {
    setLoadingUsers(true)
    const data = await api.getMembers({
      search: opts?.search ?? userSearch,
      role: opts?.role ?? (userRoleFilter ? (userRoleFilter as 'admin' | 'member') : undefined),
    })
    setUsers(data)
    setLoadingUsers(false)
  }

  const handleEdit = (user: Member) => {
    setSelectedMember(user)
    setDeleteConfirmId(null)
  }

  const handleDelete = (user: Member) => {
    setSelectedMember(null)
    setDeleteConfirmId(user.id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    setLoadingUsers(true)
    const { error } = await api.deleteMember(deleteConfirmId)
    if (error) {
      console.error('Failed to delete member:', error.message)
    }
    setDeleteConfirmId(null)
    setSelectedMember(null)
    await refetchUsers()
  }

  // Fetch users
  useEffect(() => {
    const run = async () => {
      await refetchUsers()
    }
    void run()
  }, [userSearch, userRoleFilter])

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true)
      const data = await api.getEvents({ search: eventSearch })
      setEvents(data)
      setLoadingEvents(false)
    }
    fetchEvents()
  }, [eventSearch])

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false) }}
        onLogout={async () => {
          await api.signOut()
          navigate('/')
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen sm:ml-64">
        <AdminTopbar
          activeTab={activeTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenInviteUser={() => setInviteModalOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6">
          {activeTab === 'users' ? (
            <AdminUsersPanel
              users={users}
              search={userSearch}
              roleFilter={userRoleFilter}
              setSearch={setUserSearch}
              setRoleFilter={setUserRoleFilter}
              loading={loadingUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <AdminEventsPanel
              events={events}
              search={eventSearch}
              setSearch={setEventSearch}
              loading={loadingEvents}
            />
          )}
        </main>

        <InviteUserModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onSuccess={() => refetchUsers()}
        />
        {selectedMember && (
          <EditMemberModal
            key={selectedMember.id} // Reset form when changing member
            member={selectedMember}
            onClose={() => { setSelectedMember(null) }}
            onSaved={() => refetchUsers()}
          />
        )}

        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl space-y-4">
              <div className="text-lg font-semibold">Delete member</div>
              <p className="text-sm text-white/70">This will remove the member record. This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
                  onClick={() => { setDeleteConfirmId(null); setSelectedMember(null) }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
