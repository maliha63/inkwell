import React from 'react'
import { Container } from '../components'

const CHANGELOG = [
  {
    version: '1.4.0',
    date: 'April 2026',
    tag: 'Feature',
    tagColor: '#16a34a',
    title: 'Quote of the Day + smarter homepage',
    changes: [
      'Quote of the Day now pulls from quotable.io — changes on every page refresh',
      'Featured post is now randomised on every visit instead of always showing the latest',
      'Newsletter band now validates your email before subscribing',
      'New Categories filter on the homepage to explore posts by topic',
    ],
  },
  {
    version: '1.3.2',
    date: 'March 2026',
    tag: 'Fix',
    tagColor: 'var(--accent)',
    title: 'Post submission & header fixes',
    changes: [
      'Fixed: file upload failing with "Missing required parameter: file" on new posts',
      'Fixed: sticky header creating excess top gap on scroll',
      'Header now uses position: fixed with a placeholder wrapper — no more layout jump',
    ],
  },
  {
    version: '1.3.0',
    date: 'February 2026',
    tag: 'Feature',
    tagColor: '#16a34a',
    title: 'New pages: About, Write for Us, Newsletter, Changelog',
    changes: [
      'Added /about — the story behind Inkwell',
      'Added /write-for-us — submission guidelines and FAQ',
      'Added /newsletter — dedicated subscribe page',
      'Added /changelog — you are here',
    ],
  },
  {
    version: '1.2.0',
    date: 'January 2026',
    tag: 'Design',
    tagColor: '#7c3aed',
    title: 'Typography and layout overhaul',
    changes: [
      'New display typeface for headings — more editorial, less generic',
      'Redesigned PostCard with reading time estimate',
      'Dark Trending News section with real NewsAPI integration',
      'Scroll-hiding header with blur backdrop',
    ],
  },
  {
    version: '1.1.0',
    date: 'December 2025',
    tag: 'Feature',
    tagColor: '#16a34a',
    title: 'Rich text editor',
    changes: [
      'Replaced plain textarea with TinyMCE rich text editor',
      'Support for images, headings, blockquotes, and code blocks in posts',
      'Auto-slug generation from post title',
    ],
  },
  {
    version: '1.0.0',
    date: 'November 2025',
    tag: 'Launch',
    tagColor: 'var(--ink)',
    title: 'Inkwell launches',
    changes: [
      'Authentication with Appwrite — sign up, log in, log out',
      'Create, edit, and delete posts with featured image upload',
      'Public home feed with latest posts',
    ],
  },
]

function Changelog() {
  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '100px 24px 64px',
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
              }}>What's new</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 900, lineHeight: 0.95,
              letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: '24px',
            }}>Changelog</h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.05rem',
              lineHeight: 1.8, color: 'var(--ink-muted)',
            }}>
              Every meaningful change to Inkwell, documented. We believe in building in public.
            </p>
          </div>
        </Container>
      </section>

      {/* ── ENTRIES ── */}
      <section style={{ padding: '64px 0 120px' }}>
        <Container>
          <div style={{ maxWidth: '720px' }}>
            {CHANGELOG.map((entry, i) => (
              <div key={entry.version} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: '40px',
                paddingBottom: i < CHANGELOG.length - 1 ? '56px' : 0,
                marginBottom: i < CHANGELOG.length - 1 ? '56px' : 0,
                borderBottom: i < CHANGELOG.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Left — version + date */}
                <div style={{ paddingTop: '4px' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    fontWeight: 700, color: 'var(--ink)', marginBottom: '6px',
                    letterSpacing: '0.04em',
                  }}>v{entry.version}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                    color: 'var(--ink-muted)', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>{entry.date}</div>
                </div>

                {/* Right — content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '3px 10px',
                      background: `${entry.tagColor}18`,
                      border: `1px solid ${entry.tagColor}40`,
                      borderRadius: '100px',
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: entry.tagColor, fontWeight: 600,
                    }}>{entry.tag}</span>
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                    fontWeight: 700, color: 'var(--ink)',
                    letterSpacing: '-0.02em', marginBottom: '16px',
                  }}>{entry.title}</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entry.changes.map((c, ci) => (
                      <li key={ci} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{
                          color: 'var(--accent)', fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem', paddingTop: '3px', flexShrink: 0,
                        }}>→</span>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                          color: 'var(--ink-muted)', lineHeight: 1.6,
                        }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Changelog