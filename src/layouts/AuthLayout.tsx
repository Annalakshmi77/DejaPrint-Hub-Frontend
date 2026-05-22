import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import PageFallback from '@/components/ui/PageFallback'

/**
 * AuthLayout — minimal wrapper for login, register, forgot-password, verify-otp.
 * Uses the same dark --ink background as the Home page.
 * Centers content vertically and horizontally.
 */
function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default AuthLayout
