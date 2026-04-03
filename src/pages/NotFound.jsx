import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../components'

export default function NotFound() {
  const navigate = useNavigate()
  const [count, setCount] = useState(10)

  // Auto-redirect after 10 seconds
  useEffect(() => {
    if (count === 0) { navigate('/'); return }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, navigate])

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--paper)',
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,81,42,0.06) 0%, transparent 60%)',
      padding: '60px 24px',
      textAlign: 'center',
    }}>
      <Container>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {/* Big 404 */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            color: 'transparent',
            WebkitTextStroke: '2px var(--border-strong)',
            marginBottom: '32px',
            userSelect: 'none',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            404
          </div>

          {/* Divider with icon */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '16px', marginBottom: '28px',
            justifyContent: 'center',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both',
          }}>
            <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'var(--border)' }} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style={{ width: '24px', height: '24px', opacity: 0.4 }}>
              <path fill="var(--ink)" d="M 13.222656 6 L 12.853516 8.5742188 C 12.610516 10.274219 11.274219 11.610516 9.5742188 11.853516 L 7 12.222656 L 7 13.777344 L 9.5742188 14.146484 C 11.274219 14.389484 12.610516 15.725781 12.853516 17.425781 L 13.222656 20 L 14.777344 20 L 15.146484 17.425781 C 15.389484 15.725781 16.725781 14.389484 18.425781 14.146484 L 21 13.777344 L 21 12.222656 L 18.425781 11.853516 C 16.725781 11.610516 15.389484 10.274219 15.146484 8.5742188 L 14.777344 6 L 13.222656 6 z" />
            </svg>
            <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.03em',
            marginBottom: '14px',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both',
          }}>
            This page doesn't exist.
          </h1>

          {/* Subtext */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--ink-muted)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '380px',
            margin: '0 auto 40px',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            The story you're looking for may have been moved, deleted, or never existed. Let's get you back to something worth reading.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '48px',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both',
          }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', borderRadius: '100px', cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              ← Back to home
            </Link>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px',
                background: 'transparent', color: 'var(--ink-muted)',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                border: '1px solid var(--border)', borderRadius: '100px', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              Go back
            </button>
          </div>

          {/* Auto-redirect timer */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'var(--ink-faint)',
            animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both',
          }}>
            Redirecting to home in <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{count}s</span>
          </p>
        </div>
      </Container>
    </div>
  )
}