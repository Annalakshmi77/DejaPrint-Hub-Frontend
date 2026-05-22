import { useEffect } from 'react'
import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/layout/ScrollToTop'
import { useAuthStore } from '@/store/auth.store'
import { preloadAdminRoutes, preloadDashboardRoutes } from '@/utils/routePreload'

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('printcraft-theme')
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }

    const user = useAuthStore.getState().user
    if (user?.role === 'admin') {
      preloadAdminRoutes()
    } else if (user) {
      preloadDashboardRoutes()
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
