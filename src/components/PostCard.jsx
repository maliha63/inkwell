import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, $createdAt, status }) {
  const [hovered, setHovered] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <Link to={`/post/${$id}`} style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderTop: '1px solid var(--border)',
          padding: '28px 0',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '24px',
          alignItems: 'center',
        }}>
          {/* Text */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
              }}>
                {formatDate($createdAt)}
              </span>
              {status === 'active' && (
                <>
                  <span style={{ color: 'var(--border-strong)' }}>·</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}>Published</span>
                </>
              )}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
              fontWeight: 700,
              color: hovered ? 'var(--accent)' : 'var(--ink)',
              lineHeight: 1.2,
              marginBottom: '10px',
              letterSpacing: '-0.02em',
              maxWidth: '520px',
              transition: 'color 0.2s ease',
            }}>
              {title}
            </h2>

            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              letterSpacing: '0.03em',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'all 0.25s var(--ease-out-expo)',
              display: 'inline-block',
            }}>
              Read article →
            </span>
          </div>

          {/* Image */}
          <div style={{
            width: '110px',
            height: '80px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s var(--ease-out-expo)',
          }}>
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard