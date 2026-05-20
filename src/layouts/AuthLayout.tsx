import { Outlet } from 'react-router-dom'

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
      <Outlet />
    </div>
  )
}

export default AuthLayout
