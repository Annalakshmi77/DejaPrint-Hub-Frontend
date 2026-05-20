import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import '@/styles/admin.css'

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`adm-layout-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="adm-main-content">
        <main className="adm-main-scroll relative">
          <div className="absolute top-8 right-8 z-50">
            <button className="adm-icon-btn">
              <Bell className="adm-nav-icon" />
              <span className="adm-notif-badge">3</span>
            </button>
          </div>
          <div className="adm-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


export default DashboardLayout
