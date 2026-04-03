import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm()
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const login = async (data) => {
    setError("")
    try {
      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData))
        navigate("/")
      }
    } catch (err) {
      // Make Appwrite error messages more human-friendly
      const msg = err.message || ''
      if (msg.toLowerCase().includes('invalid credentials') || msg.toLowerCase().includes('invalid email or password')) {
        setError('Incorrect email or password. Please try again.')
      } else if (msg.toLowerCase().includes('too many')) {
        setError('Too many attempts. Please wait a moment and try again.')
      } else {
        setError(msg)
      }
    }
  }

  const inputBase = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--paper-warm)',
    borderRadius: '8px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    boxSizing: 'border-box',
  }

  const inputStyle = (hasError) => ({
    ...inputBase,
    border: `1px solid ${hasError ? '#fca5a5' : 'var(--border)'}`,
    background: hasError ? '#fff5f5' : 'var(--paper-warm)',
  })

  const fieldError = (msg) => (
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
      color: '#dc2626', marginTop: '6px',
      display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      <span>⚠</span> {msg}
    </p>
  )

  return (
    <div style={{ minHeight: '92vh', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

      {/* Left — decorative */}
      <div style={{
        background: 'var(--ink)', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '60px 64px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 30% 70%, rgba(200,81,42,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(184,149,58,0.08) 0%, transparent 40%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--paper)', letterSpacing: '-0.02em' }}>← Inkwell</div>
          </Link>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <blockquote style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 700, color: 'var(--paper)', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '24px',
          }}>
            "Writing is the<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>painting</em><br />
            of the voice."
          </blockquote>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,242,235,0.4)' }}>— Voltaire</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '300px', height: '300px', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '50%', transform: 'translate(30%, 30%)' }} />
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 64px', background: 'var(--paper)' }}>
        <div style={{ width: '100%', maxWidth: '380px' }} className="animate-fade-up">

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: '10px' }}>Welcome back.</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
              No account?{' '}
              <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: '1px' }}>Sign up free</Link>
            </p>
          </div>

          {/* Server error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '12px 16px', borderRadius: '8px', fontSize: '0.875rem',
              marginBottom: '24px', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}>
              <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(login)}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: errors.email ? '#dc2626' : 'var(--ink-muted)', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                style={inputStyle(errors.email)}
                onFocus={e => { if (!errors.email) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fff' } }}
                onBlur={e => { if (!errors.email) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--paper-warm)' } }}
                {...register("email", {
                  required: "Email is required",
                  validate: { matchPattern: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Please enter a valid email address" }
                })}
              />
              {errors.email && fieldError(errors.email.message)}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: errors.password ? '#dc2626' : 'var(--ink-muted)', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ ...inputStyle(errors.password), paddingRight: '44px' }}
                  onFocus={e => { if (!errors.password) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fff' } }}
                  onBlur={e => { if (!errors.password) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--paper-warm)' } }}
                  {...register("password", { required: "Password is required" })}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && fieldError(errors.password.message)}
            </div>

            <button type="submit" disabled={isSubmitting} style={{
              width: '100%', padding: '13px 24px',
              background: isSubmitting ? 'var(--ink-muted)' : 'var(--ink)',
              color: 'var(--paper)', border: 'none', borderRadius: '100px',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500,
              letterSpacing: '0.02em', transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent)' }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--ink)' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              {!isSubmitting && <span>→</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login