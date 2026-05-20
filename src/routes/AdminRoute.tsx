import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

function AdminRoute() {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
