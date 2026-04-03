import React, { useState } from 'react'
import { Container } from '../components'
import { Link } from 'react-router-dom'

function WriteForUs() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('submissions@inkwell.pub')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const guidelines = [
    {
      label: 'Length',
      detail: '800 – 3,000 words. Long enough to say something real. Short enough to respect the reader.',
    },
    {
      label: 'Voice',
      detail: 'Write in first person or with clear perspective. We publish arguments, narratives, essays — not press releases.',
    },
    {
      label: 'Originality',
      detail: "Must be original and unpublished. If it's been on your blog, Medium, or Substack, it doesn't qualify.",
    },
    {
      label: 'Topics',
      detail: 'Culture, technology, science, fiction, philosophy, craft. No crypto-shilling, no listicles, no SEO content.',
    },
    {
      label: 'Format',
      detail: 'Send as a Google Doc (view access) or plain Markdown. Include a 2–3 sentence bio.',
    },
    {
      label: 'Response time',
      detail: "We read every submission. Expect a response within 3–4 weeks. If it's a no, we'll say why.",
    },
  ]

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '100px 24px 80px',
        borderBottom: '1px solid var(--border)',
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,81,42,0.07) 0%, transparent 60%)`,
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
              }}>Submissions</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 900, lineHeight: 0.95,
              letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: '32px',
            }}>
              Write for<br />
              <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Inkwell.</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.1rem',
              lineHeight: 1.8, color: 'var(--ink-muted)', maxWidth: '560px',
            }}>
              We're always looking for writers with something genuine to say. If you've been sitting on an idea — something you can't stop thinking about — this is where it belongs.
            </p>
          </div>
        </Container>
      </section>

      {/* ── WHAT WE LOOK FOR ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.02em', marginBottom: '40px',
          }}>What we're looking for</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '0',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {guidelines.map((g, i) => (
              <div key={g.label} style={{
                padding: '32px',
                borderRight: (i % 2 === 0) ? '1px solid var(--border)' : 'none',
                borderBottom: i < guidelines.length - 2 ? '1px solid var(--border)' : 'none',
                background: i % 3 === 0 ? 'var(--paper-card)' : 'var(--paper)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--accent)', marginBottom: '10px',
                }}>{g.label}</div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink-muted)', lineHeight: 1.7,
                }}>{g.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW TO SUBMIT ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.02em', marginBottom: '24px',
            }}>How to submit</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              lineHeight: 1.8, color: 'var(--ink-muted)', marginBottom: '32px',
            }}>
              Send your pitch (2–3 sentences) or full draft to our submissions inbox. Put the title in the subject line. We'll take it from there.
            </p>

            {/* Email copy button */}
            <button
              onClick={handleCopy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 28px',
                background: copied ? 'var(--ink)' : 'var(--paper-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                color: copied ? 'var(--paper)' : 'var(--ink)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {copied ? 'Copied!' : 'submissions@inkwell.pub'}
            </button>
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.02em', marginBottom: '40px',
            }}>Common questions</h2>
            {[
              { q: 'Do you pay contributors?', a: "Not yet — Inkwell is a passion project. We're transparent about that. We offer editing, a good readership, and a permanent home for your work." },
              { q: 'Can I republish elsewhere after?', a: 'Yes, with a canonical link back to Inkwell. We ask for a 4-week exclusivity window.' },
              { q: 'Can I submit fiction?', a: "Absolutely. Short fiction under 3,000 words is welcome. We lean toward literary over genre, but pitch us anything." },
              { q: "What if I'm not a \"professional\" writer?", a: "Good. We're more interested in people who think clearly than people with bylines. Send us your best." },
            ].map((faq, i) => (
              <div key={i} style={{
                paddingBottom: '28px',
                marginBottom: '28px',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  fontWeight: 700, color: 'var(--ink)', marginBottom: '8px',
                }}>{faq.q}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--ink-muted)', lineHeight: 1.7,
                }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default WriteForUs