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
import AdminAttendancePanel from '../components/AdminAttendancePanel'
import AdminEventModal, { type EventFormValues } from '../components/AdminEventModal'

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
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [eventSubmitting, setEventSubmitting] = useState(false)
  const [eventDeleteId, setEventDeleteId] = useState<string | null>(null)
  const [eventDeleting, setEventDeleting] = useState(false)

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    setDeleteConfirmId(user.user_id ?? user.id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    setDeleting(true)
    setLoadingUsers(true)
    try {
      const { error } = await api.deleteMember(deleteConfirmId)
      if (error) {
        console.error('Failed to delete member:', error.message)
      }
      setDeleteConfirmId(null)
      setSelectedMember(null)
      await refetchUsers()
    } finally {
      setDeleting(false)
    }
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

  const refetchEvents = async (searchOverride?: string) => {
    setLoadingEvents(true)
    const data = await api.getEvents({ search: searchOverride ?? eventSearch })
    setEvents(data)
    setLoadingEvents(false)
  }

  const openEditEvent = (ev: Event) => {
    setEditingEvent(ev)
    setEventModalOpen(true)
  }

  const handleSubmitEvent = async (values: EventFormValues) => {
    setEventSubmitting(true)
    try {
      const payload: Partial<Event> = {
        name: values.name.trim(),
        event_date: values.event_date,
        location: values.location?.trim() || null,
        description: values.description?.trim() || null,
        photo_url: values.photo_url?.trim() || null,
      }

      let eventId = editingEvent?.id

      if (editingEvent) {
        const { data, error } = await api.updateEvent(editingEvent.id, payload)
        if (error) throw error
        eventId = data?.id ?? editingEvent.id
      } else {
        const { data, error } = await api.createEvent(payload)
        if (error) throw error
        eventId = data?.id ?? null
      }

      // If file selected, upload and patch photo_url
      if (values.photo_file && eventId) {
        const uploadResult = await api.uploadEventPhoto(values.photo_file, eventId)
        const { secure_url } = uploadResult
        const { error: updatePhotoError } = await api.updateEvent(eventId, { photo_url: secure_url })
        if (updatePhotoError) throw updatePhotoError
      }

      await refetchEvents()
      setEventModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Failed to save event:', error)
      throw error
    } finally {
      setEventSubmitting(false)
    }
  }

  const confirmDeleteEvent = async () => {
    if (!eventDeleteId) return
    setEventDeleting(true)
    try {
      const { error } = await api.deleteEvent(eventDeleteId)
      if (error) {
        console.error('Failed to delete event:', error.message)
      }
      setEventDeleteId(null)
      await refetchEvents()
    } finally {
      setEventDeleting(false)
    }
  }

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
          onOpenCreateEvent={() => { setEditingEvent(null); setEventModalOpen(true) }}
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
          ) : activeTab === 'events' ? (
            <AdminEventsPanel
              events={events}
              search={eventSearch}
              setSearch={setEventSearch}
              loading={loadingEvents}
              onEdit={openEditEvent}
              onDelete={(ev) => setEventDeleteId(ev.id)}
              deletingId={eventDeleteId}
            />
          ) : (
            <AdminAttendancePanel />
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
                  onClick={() => { if (!deleting) { setDeleteConfirmId(null); setSelectedMember(null) } }}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {eventDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-lg border border-white/10 bg-gray-950 p-6 shadow-xl space-y-4">
              <div className="text-lg font-semibold">Delete event</div>
              <p className="text-sm text-white/70">This will remove the event. This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
                  onClick={() => setEventDeleteId(null)}
                  disabled={eventDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
                  onClick={confirmDeleteEvent}
                  disabled={eventDeleting}
                >
                  {eventDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <AdminEventModal
          open={eventModalOpen}
          initialEvent={editingEvent}
          onClose={() => { if (!eventSubmitting) { setEventModalOpen(false); setEditingEvent(null) } }}
          onSubmit={handleSubmitEvent}
          submitting={eventSubmitting}
        />
      </div>
    </div>
  )
}

export default Admin
