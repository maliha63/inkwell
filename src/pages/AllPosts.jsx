// ── AllPosts.jsx ──
import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config"

function AllPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) setPosts(posts.documents)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ padding: '64px 0 100px' }}>
      <Container>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}>Archive</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: 'var(--ink)',
            letterSpacing: '-0.04em',
          }}>All posts</h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-muted)',
            marginTop: '12px',
          }}>
            {loading ? 'Loading...' : `${posts.length} article${posts.length !== 1 ? 's' : ''} published`}
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-muted)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
            Loading stories...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)' }}>No posts yet.</p>
          </div>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post.$id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PostCard {...post} />
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)' }} />
          </div>
        )}
      </Container>
    </div>
  )
}

export { AllPosts }
export default AllPosts