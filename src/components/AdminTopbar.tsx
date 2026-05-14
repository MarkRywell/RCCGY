import { HiOutlineMenu, HiOutlinePlus } from 'react-icons/hi'
import type { AdminTabKey } from '../layout/AdminSidebar'

type AdminTopbarProps = {
  activeTab: AdminTabKey
  onOpenSidebar: () => void
}

function AdminTopbar({ activeTab, onOpenSidebar }: AdminTopbarProps) {
  const tabLabel = activeTab === 'users' ? 'User Management' : 'Event Management'

  return (
    <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          className="sm:hidden rounded-md p-2 hover:bg-white/10"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <HiOutlineMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs text-white/60">Admin</p>
          <h1 className="sm:text-xl font-bold">{tabLabel}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
          <HiOutlinePlus className="h-4 w-4" />
          {activeTab === 'users' ? 'New User' : 'New Event'}
        </button>
      </div>
    </header>
  )
}

export default AdminTopbar
