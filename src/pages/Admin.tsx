import { useEffect, useState } from 'react'
import api from '../lib/supabase'
import type { Member } from '../types/members'
import type { Event } from '../types/events'
import AdminSidebar, { type AdminTabKey } from '../layout/AdminSidebar'
import AdminTopbar from '../components/AdminTopbar'
import AdminUsersPanel from '../components/AdminUsersPanel'
import AdminEventsPanel from '../components/AdminEventsPanel'

function Admin() {
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      const data = await api.getMembers({
        search: userSearch,
        role: userRoleFilter ? (userRoleFilter as 'admin' | 'member') : undefined,
      })
      setUsers(data)
      setLoadingUsers(false)
    }
    fetchUsers()
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
        onLogout={() => api.signOut()}
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
        <AdminTopbar activeTab={activeTab} onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6">
          {activeTab === 'users' ? (
            <AdminUsersPanel
              users={users}
              search={userSearch}
              roleFilter={userRoleFilter}
              setSearch={setUserSearch}
              setRoleFilter={setUserRoleFilter}
              loading={loadingUsers}
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
      </div>
    </div>
  )
}

export default Admin
