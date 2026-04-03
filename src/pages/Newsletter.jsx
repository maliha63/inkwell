import React, { useState } from 'react'
import { Container } from '../components'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState('idle') // idle | success | error

  const handleSubscribe = () => {
    if (!email.trim()) {
      setSubState('error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setSubState('error')
      return
    }
    // In production: POST to your mailing list API (Mailchimp, ConvertKit, etc.)
    setSubState('success')
  }

  const perks = [
    { icon: '✦', label: 'Weekly digest', body: 'The best three pieces from Inkwell — curated, not algorithmic.' },
    { icon: '◈', label: 'First look', body: 'Subscriber-only previews of long reads before they go public.' },
    { icon: '⬡', label: 'No noise', body: 'One email a week, every Friday morning. Nothing else.' },
  ]

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '120px 24px 80px',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,81,42,0.07) 0%, transparent 60%)`,
      }}>
        <Container>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)',
            }}>The Inkwell letter</span>
            <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 900, lineHeight: 0.95,
            letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: '28px',
          }}>
            Good writing,<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>your inbox.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            lineHeight: 1.8, color: 'var(--ink-muted)',
            maxWidth: '480px', margin: '0 auto 48px',
          }}>
            Every Friday we send one email with the three pieces you shouldn't miss. No hustle culture. No productivity tips. Just writing.
          </p>

          {/* Subscribe form or success */}
          {subState === 'success' ? (
            <div style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              padding: '40px 48px',
              background: 'var(--paper-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(200,81,42,0.1)', border: '1px solid rgba(200,81,42,0.2)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em',
              }}>You're on the list.</h2>
              <p style={{
                fontFamily: 'var(--font-body)', color: 'var(--ink-muted)',
                fontSize: '0.95rem', maxWidth: '320px', textAlign: 'center',
              }}>
                Check your inbox for a welcome email. First Friday edition lands soon.
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: '460px', margin: '0 auto' }}>
              <div style={{
                display: 'flex', gap: '0',
                borderRadius: '100px', overflow: 'hidden',
                border: `1px solid ${subState === 'error' ? 'rgba(200,81,42,0.5)' : 'var(--border)'}`,
                boxShadow: subState === 'error' ? '0 0 0 3px rgba(200,81,42,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (subState === 'error') setSubState('idle') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={{
                    flex: 1, padding: '15px 22px',
                    background: 'var(--paper-card)',
                    border: 'none', outline: 'none',
                    fontFamily: 'var(--font-body)', fontSize: '1rem',
                    color: 'var(--ink)',
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  style={{
                    padding: '15px 28px',
                    background: 'var(--ink)', color: 'var(--paper)',
                    border: 'none', fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                >
                  Subscribe →
                </button>
              </div>
              {subState === 'error' && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                  color: 'var(--accent)', marginTop: '10px', textAlign: 'center',
                }}>
                  {!email.trim()
                    ? 'Please enter your email address first.'
                    : 'That doesn\'t look like a valid email. Try again?'}
                </p>
              )}
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                letterSpacing: '0.1em', color: 'var(--ink-muted)',
                marginTop: '16px', textTransform: 'uppercase',
              }}>
                No spam. Unsubscribe at any time.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.02em', marginBottom: '40px', textAlign: 'center',
          }}>What you get</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2px',
          }}>
            {perks.map(p => (
              <div key={p.label} style={{
                padding: '40px 36px',
                background: 'var(--paper-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                  color: 'var(--accent)', marginBottom: '16px',
                }}>{p.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                  fontWeight: 700, color: 'var(--ink)', marginBottom: '10px',
                }}>{p.label}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink-muted)', lineHeight: 1.7,
                }}>{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Newsletter