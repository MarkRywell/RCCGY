import { HiOutlineUsers, HiOutlineCalendar, HiOutlineCog, HiOutlineLogout, HiOutlineX } from 'react-icons/hi'

export type AdminTabKey = 'users' | 'events'

type AdminSidebarProps = {
  activeTab: AdminTabKey
  onTabChange: (tab: AdminTabKey) => void
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

function AdminSidebar({ activeTab, onTabChange, onLogout, isOpen, onClose }: AdminSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 border-r border-white/10 transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-lg">Admin</div>
        <button
          className="sm:hidden rounded-md p-2 hover:bg-white/10"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <HiOutlineX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        <SidebarItem
          icon={<HiOutlineUsers className="h-5 w-5" />}
          label="Users"
          active={activeTab === 'users'}
          onClick={() => onTabChange('users')}
        />
        <SidebarItem
          icon={<HiOutlineCalendar className="h-5 w-5" />}
          label="Events"
          active={activeTab === 'events'}
          onClick={() => onTabChange('events')}
        />
        <div className="h-px bg-white/10 my-2" />
        <SidebarItem
          icon={<HiOutlineCog className="h-5 w-5" />}
          label="Settings"
          disabled
          onClick={() => {}}
        />
        <SidebarItem
          icon={<HiOutlineLogout className="h-5 w-5" />}
          label="Logout"
          onClick={onLogout}
        />
      </nav>
    </aside>
  )
}

type SidebarItemProps = {
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

function SidebarItem({ icon, label, active, disabled, onClick }: SidebarItemProps) {
  return (
    <button
      className={[
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
        active ? 'bg-primary text-white' : 'text-white/80 hover:bg-white/10',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default AdminSidebar
