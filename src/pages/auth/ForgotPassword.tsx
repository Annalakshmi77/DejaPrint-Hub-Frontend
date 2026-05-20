import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast.success('Password reset instructions sent!')
    } catch {
      toast.error('Failed to send reset instructions')
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
    fontFamily: "'Outfit', sans-serif",
    width: '100%',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--soft)',
    letterSpacing: '0.04em'
  }

  if (isSubmitted) {
    return (
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)' }}>P</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.5rem', color: 'var(--paper)', letterSpacing: '-0.02em' }}>
            Print<span style={{ color: 'var(--gold)' }}>Craft</span>
          </span>
        </Link>

        <div style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', borderRadius: '12px', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1.5rem', display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(45,138,158,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={32} style={{ color: 'var(--gold)' }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--paper)', marginBottom: '0.4rem' }}>Check Your Email</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--soft)', marginBottom: '1.5rem' }}>
            We've sent password reset instructions to{' '}
            <span style={{ fontWeight: 600, color: 'var(--paper)' }}>{email}</span>
          </p>

          <p style={{ fontSize: '0.82rem', color: 'rgba(183,215,220,0.6)', marginBottom: '1.5rem' }}>
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setIsSubmitted(false)}
              style={{ background: 'none', border: '1px solid var(--auth-card-border)', borderRadius: '6px', padding: '0.75rem', color: 'var(--gold)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
            >
              Try another email
            </button>
            <Link
              to="/login"
              style={{ display: 'block', background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '6px', padding: '0.75rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', fontFamily: "'Outfit', sans-serif" }}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)' }}>P</span>
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.5rem', color: 'var(--paper)', letterSpacing: '-0.02em' }}>
          Print<span style={{ color: 'var(--gold)' }}>Craft</span>
        </span>
      </Link>

      <div style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', borderRadius: '12px', padding: '2rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--paper)', marginBottom: '0.4rem' }}>Forgot Password?</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--soft)' }}>Enter your email and we'll send reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="email" style={labelStyle}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '6px', padding: '0.8rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Send Reset Instructions
          </button>

          <Link
            to="/login"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--soft)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.5rem', transition: 'color 0.2s' }}
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
