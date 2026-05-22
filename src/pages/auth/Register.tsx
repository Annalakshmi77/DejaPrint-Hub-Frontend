import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import authService from '@/services/auth.service'

const passwordRequirements = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'Contains uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Contains lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'Contains a number', test: (pw: string) => /[0-9]/.test(pw) },
]

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setIsLoading(true)
    try {
      const result = await authService.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        password: formData.password
      })

      if (result.success) {
        toast.success('Account created successfully! Please log in.')
        navigate('/login')
      } else {
        toast.error(result.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--auth-input-bg)',
    border: '1px solid var(--auth-input-border)',
    borderRadius: '6px',
    padding: '0.7rem 1rem',
    color: 'var(--paper)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: "var(--font-sans)",
    width: '100%',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--soft)',
    letterSpacing: '0.04em'
  }

  return (
    <div style={{ width: '100%', maxWidth: '460px' }}>
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
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--paper)', marginBottom: '0.4rem' }}>Create Account</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--soft)' }}>Sign up to start ordering custom prints</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="fullName" style={labelStyle}>Full Name *</label>
              <input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="phone" style={labelStyle}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="email" style={labelStyle}>Email *</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="companyName" style={labelStyle}>Company Name (Optional)</label>
            <input
              id="companyName"
              placeholder="Your Company"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="password" style={labelStyle}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ ...inputStyle, paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--soft)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.password && (
              <ul style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: 0, listStyle: 'none' }}>
                {passwordRequirements.map((req) => {
                  const isMet = req.test(formData.password)
                  return (
                    <li
                      key={req.label}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: isMet ? 'var(--gold-light)' : 'rgba(183,215,220,0.5)' }}
                    >
                      <Check size={12} style={{ opacity: isMet ? 1 : 0.3 }} />
                      {req.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              style={inputStyle}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p style={{ fontSize: '0.72rem', color: '#ff6b6b', marginTop: '0.2rem', margin: 0 }}>Passwords do not match</p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input
              id="terms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              style={{ accentColor: 'var(--gold)', width: '14px', height: '14px', marginTop: '3px' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.82rem', color: 'var(--soft)', lineHeight: 1.4 }}>
              I agree to the{' '}
              <Link to="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '6px', padding: '0.8rem', fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ height: '1px', background: 'var(--auth-card-border)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--soft)', marginBottom: '0.75rem' }}>Already have an account?</p>
          <Link
            to="/login"
            style={{ display: 'block', border: '1px solid var(--auth-card-border)', borderRadius: '6px', padding: '0.7rem', textAlign: 'center', color: 'var(--gold)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
