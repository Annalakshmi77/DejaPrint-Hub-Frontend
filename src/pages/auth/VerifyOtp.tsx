import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete verification code')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Email verified successfully!')
      navigate('/login')
    } catch {
      toast.error('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('Verification code sent!')
      setResendCooldown(30)
    } catch {
      toast.error('Failed to resend code')
    }
  }

  const inputStyle = {
    background: 'var(--auth-input-bg)',
    border: '1px solid var(--auth-input-border)',
    borderRadius: '6px',
    padding: '0.8rem',
    color: 'var(--paper)',
    fontSize: '1.5rem',
    letterSpacing: '0.5em',
    textAlign: 'center' as const,
    outline: 'none',
    fontFamily: "var(--font-sans)",
    width: '100%',
    maxWidth: '280px',
    boxSizing: 'border-box' as const
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)' }}>P</span>
        </div>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: '1.5rem', color: 'var(--paper)', letterSpacing: '-0.02em' }}>
          DejaPrint<span style={{ color: 'var(--gold)' }}>Hub</span>
        </span>
      </Link>

      <div style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', borderRadius: '12px', padding: '2rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: '1.8rem', fontWeight: 700, color: 'var(--paper)', marginBottom: '0.4rem' }}>Verify Your Email</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--soft)' }}>
            We've sent a 6-digit code to{' '}
            <span style={{ fontWeight: 600, color: 'var(--paper)' }}>{email}</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <input
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            style={inputStyle}
          />

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: '6px', padding: '0.8rem', fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (isLoading || otp.length !== 6) ? 0.7 : 1, width: '100%' }}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Verify Email
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--soft)' }}>
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span style={{ color: 'var(--paper)', fontWeight: 600 }}>Resend in {resendCooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                style={{ background: 'none', border: 'none', color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.82rem', fontFamily: "var(--font-sans)" }}
              >
                Resend Code
              </button>
            )}
          </div>

          <Link
            to="/register"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--soft)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, width: '100%', transition: 'color 0.2s' }}
          >
            <ArrowLeft size={16} />
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
