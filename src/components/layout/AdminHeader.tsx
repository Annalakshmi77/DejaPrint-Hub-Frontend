import { Link } from 'react-router-dom'
import { Search, Settings, LogOut, User as UserIcon, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/utils/helpers'

function AdminHeader() {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="adm-header">
      <div className="adm-header-right">
        {/* User profile or other header items can go here */}
      </div>
    </header>
  )
}

export default AdminHeader
