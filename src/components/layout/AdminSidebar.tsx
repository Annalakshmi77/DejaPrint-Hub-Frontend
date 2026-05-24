import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Box,
  Users,
  LogOut,
  ChevronLeft,
  User,
  Sun,
  Moon,
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/utils/helpers'
import { prefetchRoute } from '@/utils/routePreload'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/products', label: 'Products', icon: Box },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/account', label: 'Account', icon: User },
]

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

function AdminSidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuthStore()


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
          <Link to="/admin" className="adm-brand">
            DejaPrint<span>Hub</span>
            <span className="adm-brand-badge">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="adm-collapse-btn"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          const isActive = location.pathname === item.href
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
            {getInitials(user?.full_name || 'Admin')}
          </div>
          {!collapsed && (
            <div className="adm-profile-info">
              <p className="adm-profile-name">{user?.full_name || 'System Admin'}</p>
              <p className="adm-profile-role">Administrator</p>
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


export default AdminSidebar
