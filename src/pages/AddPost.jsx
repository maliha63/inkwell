// ── AddPost.jsx ──
import React from 'react'
import { Container, PostForm } from '../components'

function AddPost() {
  return (
    <div style={{ padding: '64px 0 100px', background: 'var(--paper)' }}>
      <Container>
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
            }}>New story</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: 'var(--ink)',
            letterSpacing: '-0.04em',
          }}>Write something.</h1>
        </div>
        <PostForm />
      </Container>
    </div>
  )
}

export default AddPost