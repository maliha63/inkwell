import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config"
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
  const [post, setPost] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post)
      })
    } else {
      navigate('/')
    }
  }, [slug, navigate])

  return post ? (
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
            }}>Editing</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: 'var(--ink)',
            letterSpacing: '-0.04em',
          }}>Refine your story.</h1>
        </div>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null
}

export default EditPost