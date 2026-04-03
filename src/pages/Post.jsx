import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import appwriteService from "../appwrite/config"
import { Container } from "../components"
import parse from "html-react-parser"
import { useSelector } from "react-redux"

export default function Post() {
  const [post, setPost] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { slug } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = post && userData ? post.userId === userData.$id : false

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post)
        else navigate("/")
      })
    } else navigate("/")
  }, [slug, navigate])

  const confirmDelete = async () => {
    setDeleting(true)
    setShowDeleteModal(false)
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage)
        navigate("/")
      }
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  if (!post) return null

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── Custom Delete Modal ── */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}>Delete this post?</h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--ink-muted)',
              marginBottom: '28px',
              lineHeight: 1.6,
            }}>
              This will permanently delete <strong>"{post.title}"</strong> and its image. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-warm)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero image ── */}
      <div style={{ width: '100%', maxHeight: '520px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={appwriteService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="animate-scale-in"
          style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, var(--paper))',
        }} />

        {/* Author actions */}
        {isAuthor && (
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            display: 'flex', gap: '8px', zIndex: 10,
          }}>
            <Link
              to={`/edit-post/${post.$id}`}
              style={{
                padding: '8px 20px',
                background: 'rgba(245,242,235,0.95)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 500,
                textDecoration: 'none',
                borderRadius: '100px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,242,235,0.95)'}
            >
              Edit post
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              style={{
                padding: '8px 20px',
                background: deleting ? 'rgba(200,81,42,0.5)' : 'var(--accent)',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 500,
                border: 'none',
                borderRadius: '100px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!deleting) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* ── Article ── */}
      <Container>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 0 100px' }}>

          {/* Meta */}
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            }}>
              {formatDate(post.$createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: 'var(--ink)',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '40px',
          }}>
            {post.title}
          </h1>

          {/* Divider */}
          <div className="animate-fade-in delay-200" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <svg width="16" height="16" viewBox="0 0 64 64" style={{ opacity: 0.3 }}>
              <path fill="var(--ink)" d="M 13.222656 6 L 12.853516 8.5742188 C 12.610516 10.274219 11.274219 11.610516 9.5742188 11.853516 L 7 12.222656 L 7 13.777344 L 9.5742188 14.146484 C 11.274219 14.389484 12.610516 15.725781 12.853516 17.425781 L 13.222656 20 L 14.777344 20 L 15.146484 17.425781 C 15.389484 15.725781 16.725781 14.389484 18.425781 14.146484 L 21 13.777344 L 21 12.222656 L 18.425781 11.853516 C 16.725781 11.610516 15.389484 10.274219 15.146484 8.5742188 L 14.777344 6 L 13.222656 6 z" />
            </svg>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Content */}
          <div className="browser-css animate-fade-up delay-300">
            {parse(post.content)}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '80px', paddingTop: '40px',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '16px',
          }}>
            <Link to="/" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--ink-muted)', textDecoration: 'none',
              transition: 'color 0.2s ease', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
            >
              ← Back to all stories
            </Link>

            {isAuthor && (
              <Link to={`/edit-post/${post.$id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px',
                background: 'var(--paper-warm)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                textDecoration: 'none', borderRadius: '100px',
                transition: 'all 0.2s ease', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--paper)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-warm)'; e.currentTarget.style.color = 'var(--ink)' }}
              >
                Edit this post →
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}