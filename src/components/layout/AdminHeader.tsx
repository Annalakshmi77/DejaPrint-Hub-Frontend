import { Link } from 'react-router-dom'
import { Bell, Search, Settings, LogOut, User as UserIcon, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/utils/helpers'

function AdminHeader() {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="adm-header">
      <div className="adm-header-right">
        {/* Notifications Only */}
        <button className="adm-icon-btn">
          <Bell className="adm-nav-icon" />
          <span className="adm-notif-badge">5</span>
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
