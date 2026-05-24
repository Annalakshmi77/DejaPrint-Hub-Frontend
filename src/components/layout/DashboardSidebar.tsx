import { Link, useLocation } from 'react-router-dom'
import {
  Layout,
  Package,
  User,
  LogOut,
  ChevronLeft,
  Box,
  Palette,
  ShoppingBag,
  Sun,
  Moon
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { prefetchRoute } from '@/utils/routePreload'


const navItems = [
  { href: '/dashboard/designs', label: 'Designs', icon: Palette },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/account', label: 'Profile Settings', icon: User },
]

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

function DashboardSidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  const getInitials = (name: string) => {
    if (!name) return '??'
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const [isLight, setIsLight] = useState(document.body.classList.contains('light-mode'))

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode')
    setIsLight(!isLight)
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark')
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode')
      setIsLight(true)
    }
  }, [])


  return (
    <aside
      className="adm-sidebar"
      style={{ width: collapsed ? '64px' : '260px' }}
    >
      {/* Logo */}
      <div className="adm-sidebar-logo">
        {!collapsed && (
          <Link to="/" className="adm-brand">
            DejaPrint<span>Hub</span>
            <span className="adm-brand-badge">Studio</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="adm-collapse-btn"
        >
          <ChevronLeft
            className="adm-nav-icon"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="adm-nav" style={{ alignItems: collapsed ? 'center' : 'stretch' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || (item.href === '/dashboard/designs' && location.pathname === '/dashboard')
          return (
            <Link
              key={item.href}
              to={item.href}
              onMouseEnter={() => prefetchRoute(item.href)}
              onFocus={() => prefetchRoute(item.href)}
              className={`adm-nav-item ${isActive ? 'active' : ''}`}
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                textAlign: 'left'
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="adm-nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className={`adm-sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
        <div className="adm-footer-profile">
          <div className="adm-avatar">
            {getInitials(user?.full_name || 'User')}
          </div>
          {!collapsed && (
            <div className="adm-profile-info">
              <p className="adm-profile-name">{user?.full_name || 'Guest User'}</p>
              <p className="adm-profile-role">Customer Account</p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="adm-footer-actions">
            <button
              onClick={toggleTheme}
              className="adm-action-icon-btn"
              title={isLight ? 'Dark Mode' : 'Light Mode'}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={logout}
              className="adm-action-icon-btn danger"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {collapsed && (
          <div className="adm-footer-actions-collapsed">
             <button onClick={toggleTheme} className="adm-action-icon-btn">{isLight ? <Moon size={14} /> : <Sun size={14} />}</button>
             <button onClick={logout} className="adm-action-icon-btn danger"><LogOut size={14} /></button>
          </div>
        )}
      </div>

    </aside>
  )
}

export default DashboardSidebar
