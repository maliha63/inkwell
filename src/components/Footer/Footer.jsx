import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--ink)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '64px 0 40px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>

          {/* Brand + Newsletter */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--paper)',
                letterSpacing: '-0.03em',
              }}>Inkwell</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'rgba(245,242,235,0.4)',
              lineHeight: 1.6,
              maxWidth: '200px',
              marginBottom: '24px',
            }}>
              A home for words worth reading.
            </p>
          </div>

          {/* Link columns */}
          {[
            {
              title: 'Platform',
              links: [
                { name: 'Home',      to: '/' },
                { name: 'All Posts', to: '/all-posts' },
                { name: 'Add Post',  to: '/add-post' },
              ]
            },
            {
              title: 'Company',
              links: [
                { name: 'About',        to: '/about' },
                { name: 'Write for Us', to: '/write-for-us' },
                { name: 'Changelog',    to: '/changelog' },
                { name: 'Newsletter',    to: '/newsletter' },
              ]
            },
            {
              title: 'Submissions',
              links: [
                { name: 'Guidelines',  to: '/write-for-us' },
                { name: 'Login',       to: '/login' },
                { name: 'Sign Up',     to: '/signup' },
              ]
            },
            {
              title: 'Legal',
              links: [
                { name: 'Privacy', to: '/' },
                { name: 'Terms',   to: '/' },
              ]
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(245,242,235,0.3)',
                marginBottom: '20px',
              }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '10px' }}>
                    <Link to={link.to} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'rgba(245,242,235,0.55)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--paper)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,242,235,0.55)'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            color: 'rgba(245,242,235,0.25)',
          }}>
            © {year} Inkwell. All rights reserved.
          </p>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'rgba(245,242,235,0.2)',
          }}>
            Made with craft ✦
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          footer > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          footer > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer