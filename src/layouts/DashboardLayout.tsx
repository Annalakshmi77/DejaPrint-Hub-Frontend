import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import PageFallback from '@/components/ui/PageFallback'
import { preloadDashboardRoutes } from '@/utils/routePreload'
import '@/styles/admin.css'

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    preloadDashboardRoutes()
  }, [])

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
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}


export default DashboardLayout
