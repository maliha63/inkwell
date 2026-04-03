import React, { useState, useEffect, useRef } from 'react'
import { Container, Logo } from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastY, setLastY] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef(null)

  const userName = userData?.name || userData?.userData?.name || 'User'
  const userEmail = userData?.email || userData?.userData?.email || ''
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const navItems = [
    { name: 'Home',         slug: '/',            active: true },
    { name: 'About',        slug: '/about',        active: true },
    { name: 'Write for Us', slug: '/write-for-us', active: true },
    { name: 'Login',        slug: '/login',        active: !authStatus },
    { name: 'Signup',       slug: '/signup',       active: !authStatus },
  ]

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      if (y > lastY && y > 120) setHidden(true)
      else if (y < lastY) setHidden(false)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

useEffect(() => { setDropdownOpen(false) }, [location])

  const isActive = (slug) => location.pathname === slug

  const handleLogoutConfirm = async () => {
    setLoggingOut(true)
    await authService.logout()
    dispatch(logout())
    setShowLogoutModal(false)
    setLoggingOut(false)
    navigate('/')
  }

  return (
    <>
      <div style={{ height: '68px' }} />

      {/* ── Logout Modal — lean version ── */}
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease both',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--paper)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '320px',
              width: '90%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.4rem',
              fontWeight: 700, color: 'var(--ink)', marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}>Sign out?</h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.6,
            }}>
              You'll need to sign back in to write or manage posts.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Cancel */}
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1, padding: '10px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  color: 'var(--ink)', cursor: 'pointer',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--paper-warm)'
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                Cancel
              </button>
              {/* Sign out */}
              <button
                onClick={handleLogoutConfirm}
                disabled={loggingOut}
                style={{
                  flex: 1, padding: '10px',
                  background: loggingOut ? 'var(--ink-muted)' : 'var(--ink)',
                  border: 'none', borderRadius: '100px',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: 600, color: '#fff',
                  cursor: loggingOut ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s ease, opacity 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!loggingOut) e.currentTarget.style.background = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  if (!loggingOut) e.currentTarget.style.background = 'var(--ink)'
                }}
              >
                {loggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: '68px',
        background: scrolled ? 'rgba(245,242,235,0.94)' : 'var(--paper)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border-color 0.3s ease',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.04)' : 'none',
      }}>
        <Container>
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

            <Link to='/' style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Logo width='140px' />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ul style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}>
                {navItems.map((item) => item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      style={{
                        position: 'relative',
                        fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                        fontWeight: isActive(item.slug) ? 600 : 400,
                        color: isActive(item.slug) ? 'var(--ink)' : 'var(--ink-muted)',
                        background: 'none', border: 'none',
                        padding: '6px 14px',
                        letterSpacing: '0.01em', cursor: 'pointer',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                      onMouseLeave={e => e.currentTarget.style.color = isActive(item.slug) ? 'var(--ink)' : 'var(--ink-muted)'}
                    >
                      {item.name}
                      {isActive(item.slug) && (
                        <span style={{
                          position: 'absolute', bottom: 0, left: '14px', right: '14px',
                          height: '1.5px', background: 'var(--accent)', borderRadius: '2px',
                        }} />
                      )}
                    </button>
                  </li>
                ) : null)}
              </ul>

              {/* User avatar dropdown */}
              {authStatus && (
                <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '12px' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: dropdownOpen ? 'var(--paper-warm)' : 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '100px',
                      padding: '5px 12px 5px 5px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-warm)'}
                    onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700,
                      flexShrink: 0,
                    }}>{initials}</div>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                      fontWeight: 500, color: 'var(--ink)',
                      maxWidth: '120px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{userName}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                      style={{ transition: 'transform 0.2s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--ink-muted)' }}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: 'var(--paper)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      minWidth: '220px',
                      overflow: 'hidden',
                      animation: 'fadeUp 0.2s cubic-bezier(0.16,1,0.3,1) both',
                      zIndex: 100,
                    }}>
                      {/* User info */}
                      <div style={{
                        padding: '16px 16px 12px',
                        borderBottom: '1px solid var(--border)',
                        background: 'var(--paper-warm)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--accent)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700,
                            flexShrink: 0,
                          }}>{initials}</div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                              fontWeight: 600, color: 'var(--ink)',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{userName}</div>
                            {userEmail && (
                              <div style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                                color: 'var(--ink-muted)', letterSpacing: '0.02em',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>{userEmail}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Nav items */}
                      {[
                        { label: 'All Posts', icon: '◈', slug: '/all-posts' },
                        { label: 'Add Post', icon: '+', slug: '/add-post' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { navigate(item.slug); setDropdownOpen(false) }}
                          style={{
                            width: '100%', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 16px',
                            background: 'none', border: 'none',
                            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                            color: isActive(item.slug) ? 'var(--accent)' : 'var(--ink)',
                            cursor: 'pointer', transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-warm)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                          {item.label}
                          {isActive(item.slug) && (
                            <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                          )}
                        </button>
                      ))}

                      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

                      {/* Sign out */}
                      <button
                        onClick={() => { setDropdownOpen(false); setShowLogoutModal(true) }}
                        style={{
                          width: '100%', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 16px 14px',
                          background: 'none', border: 'none',
                          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                          color: 'var(--accent)', cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fdf3ef'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </Container>
      </header>
    </>
  )
}

export default Header