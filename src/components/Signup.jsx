import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const create = async (data) => {
    setError("")
    try {
      const userData = await authService.createAccount(data)
      if (userData) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) dispatch(login(currentUser))
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--paper-warm)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: '8px',
  }

  return (
    <div style={{
      minHeight: '92vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden',
    }}>
      {/* Right — form first on signup */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 64px',
        background: 'var(--paper)',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-up">
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
              marginBottom: '10px',
            }}>Join Inkwell.</h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--ink-muted)',
            }}>
              Already writing?{' '}
              <Link to="/login" style={{
                color: 'var(--accent)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent)',
                paddingBottom: '1px',
              }}>Sign in</Link>
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '24px',
              fontFamily: 'var(--font-body)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(create)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--paper-warm)' }}
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--paper-warm)' }}
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid email"
                    }
                  })}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--paper-warm)' }}
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px 24px',
                background: isSubmitting ? 'var(--ink-muted)' : 'var(--ink)',
                color: 'var(--paper)',
                border: 'none',
                borderRadius: '100px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent)' }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--ink)' }}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              {!isSubmitting && <span>→</span>}
            </button>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--ink-faint)',
              textAlign: 'center',
              marginTop: '16px',
            }}>
              By signing up you agree to our terms of service.
            </p>
          </form>
        </div>
      </div>

      {/* Left — decorative panel */}
      <div style={{
        background: 'var(--ink-soft)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 70% 30%, rgba(200,81,42,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 20% 80%, rgba(184,149,58,0.08) 0%, transparent 40%)`,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--paper)',
              letterSpacing: '-0.02em',
            }}>← Inkwell</div>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '24px',
          }}>Why Inkwell?</div>

          {[
            { icon: '✦', text: 'Write with a rich, distraction-free editor' },
            { icon: '✦', text: 'Publish instantly to your audience' },
            { icon: '✦', text: 'Beautiful typography by default' },
            { icon: '✦', text: 'Your words. Your platform.' },
          ].map((item) => (
            <div key={item.text} style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '3px' }}>{item.icon}</span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'rgba(245,242,235,0.7)',
                lineHeight: 1.5,
              }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '250px', height: '250px',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '50%',
          transform: 'translate(-40%, -40%)',
        }} />
      </div>
    </div>
  )
}

export default Signup