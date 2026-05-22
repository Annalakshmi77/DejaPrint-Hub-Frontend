import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import authService from '@/services/auth.service'
import { preloadAdminRoutes, preloadDashboardRoutes } from '@/utils/routePreload'
import { redirectAfterLogin } from '@/utils/postLoginRedirect'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        login(result.user, authService.getToken() || '')
        toast.success('Welcome back!')
        // Intelligent redirect based on role
        if (result.user?.role === 'admin') {
          preloadAdminRoutes()
          redirectAfterLogin('/admin')
        } else {
          preloadDashboardRoutes()
          const target = from.startsWith('/admin') ? '/dashboard' : from
          redirectAfterLogin(target)
        }
      } else {
        toast.error(result.error || 'Invalid email or password')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)' }}>P</span>
        </div>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: '1.5rem', color: 'var(--paper)', letterSpacing: '-0.02em' }}>
          Print<span style={{ color: 'var(--gold)' }}>Craft</span>
        </span>
      </Link>

      <div style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', borderRadius: '12px', padding: '2rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--paper)', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--soft)' }}>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--soft)', letterSpacing: '0.04em' }}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              style={{ background: 'var(--auth-input-bg)', border: '1px solid var(--auth-input-border)', borderRadius: '6px', padding: '0.7rem 1rem', color: 'var(--paper)', fontSize: '0.9rem', outline: 'none', fontFamily: "var(--font-sans)", width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--soft)', letterSpacing: '0.04em' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
                style={{ background: 'var(--auth-input-bg)', border: '1px solid var(--auth-input-border)', borderRadius: '6px', padding: '0.7rem 2.8rem 0.7rem 1rem', color: 'var(--paper)', fontSize: '0.9rem', outline: 'none', fontFamily: "var(--font-sans)", width: '100%', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--soft)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.82rem', color: 'var(--soft)' }}>Remember me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '6px', padding: '0.8rem', fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ height: '1px', background: 'var(--auth-card-border)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--soft)', marginBottom: '0.75rem' }}>New to PrintCraft?</p>
          <Link
            to="/register"
            style={{ display: 'block', border: '1px solid var(--auth-card-border)', borderRadius: '6px', padding: '0.7rem', textAlign: 'center', color: 'var(--gold)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'background 0.2s' }}
          >
            Create an Account
          </Link>
        </div>
      </div>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'rgba(183,215,220,0.45)' }}>
        By signing in, you agree to our{' '}
        <Link to="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms of Service</Link>
        {' '}and{' '}
        <Link to="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</Link>
      </p>
    </div>
  )
}

export default Login
