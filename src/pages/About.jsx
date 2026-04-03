import React from 'react'
import { Container } from '../components'
import { Link } from 'react-router-dom'

function About() {
  const values = [
    {
      icon: '✦',
      title: 'Craft over clicks',
      body: 'We believe writing should be slow, deliberate, and considered. No engagement-bait. No hot takes for the sake of it. Just ideas worth sitting with.',
    },
    {
      icon: '◈',
      title: 'Independent voices',
      body: 'Inkwell is built for writers who own their words. No algorithm decides what gets read — only the quality of the work.',
    },
    {
      icon: '⬡',
      title: "A reader's contract",
      body: "When you open something on Inkwell you know it has been written with care. That's the promise we make to every reader.",
    },
  ]

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '100px 24px 80px',
        borderBottom: '1px solid var(--border)',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,81,42,0.07) 0%, transparent 60%)
        `,
      }}>
        <Container>
          <div style={{ maxWidth: '680px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px',
            }}>
              <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)',
              }}>Our story</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
              marginBottom: '32px',
            }}>
              Built for writers<br />
              <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>who give a damn.</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--ink-muted)',
              maxWidth: '560px',
            }}>
              Inkwell started with a simple frustration: the internet had become optimised for attention, not ideas. We wanted a place where writing could just be writing — no follower counts, no trending tabs, no infinite scroll.
            </p>
          </div>
        </Container>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2px',
          }}>
            {values.map((v) => (
              <div key={v.title} style={{
                padding: '48px 40px',
                background: 'var(--paper-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                  color: 'var(--accent)', marginBottom: '20px',
                }}>{v.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                  fontWeight: 700, color: 'var(--ink)',
                  letterSpacing: '-0.02em', marginBottom: '12px',
                }}>{v.title}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink-muted)', lineHeight: 1.7,
                }}>{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── STORY TIMELINE ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.03em', marginBottom: '48px',
            }}>How we got here</h2>
            {[
              { year: '2022', event: 'A side-project born out of frustration with existing platforms. One writer, one idea, one weekend.' },
              { year: '2023', event: 'First 50 contributors. The community started to shape the voice — slower, more thoughtful than we even imagined.' },
              { year: '2024', event: 'Rebuilt from scratch with a focus on typography and reading experience. Every pixel reconsidered.' },
              { year: '2025', event: 'Open submissions. Inkwell becomes a home for independent voices from around the world.' },
            ].map((item, i) => (
              <div key={item.year} style={{
                display: 'flex', gap: '32px', alignItems: 'flex-start',
                paddingBottom: i < 3 ? '36px' : 0,
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                marginBottom: i < 3 ? '36px' : 0,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  fontWeight: 700, color: 'var(--accent)',
                  minWidth: '48px', paddingTop: '2px',
                }}>{item.year}</div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '1rem',
                  color: 'var(--ink-muted)', lineHeight: 1.7,
                }}>{item.event}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <Container>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900, color: 'var(--ink)',
            letterSpacing: '-0.03em', marginBottom: '16px',
          }}>Want to be part of it?</h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'var(--ink-muted)', marginBottom: '36px',
          }}>Read what we're publishing, or pitch us your best work.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '13px 34px', background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
              textDecoration: 'none', borderRadius: '100px',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
            >Start writing →</Link>
            <Link to="/write-for-us" style={{
              padding: '13px 24px', color: 'var(--ink-muted)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              textDecoration: 'none', borderRadius: '100px',
              border: '1px solid var(--border)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >Submission guidelines</Link>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default About