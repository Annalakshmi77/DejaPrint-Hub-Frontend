import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import PageFallback from '@/components/ui/PageFallback'

function MainLayout() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  )
}

export default MainLayout
