import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/layout/AdminSidebar'
import PageFallback from '@/components/ui/PageFallback'
import { preloadAdminRoutes } from '@/utils/routePreload'
import '@/styles/admin.css'

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    preloadAdminRoutes()
  }, [])

  return (
    <div className={`adm-layout-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="adm-main-content">
        <main className="adm-main-scroll relative">
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

export default AdminLayout
