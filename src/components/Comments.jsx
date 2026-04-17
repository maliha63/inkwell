import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import appwriteService from "../appwrite/config";

function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Comments({ postId }) {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState(null)

    const authorName = userData?.name || userData?.userData?.name || 'Anonymous'
    const authorId = userData?.$id || userData?.userData?.$id || ''

    useEffect(() => {
        if (!postId) return
        appwriteService.getComments(postId).then((res) => {
            if (res) setComments(res.documents)
            setLoading(false)
        })
    }, [postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim()) { setError('Write something first.'); return }
        if (text.trim().length < 3) { setError('Too short — say a bit more!'); return }
        setError('')
        setSubmitting(true)
        const newComment = await appwriteService.createComment({
            postId, content: text.trim(), authorName, authorId,
        })
        if (newComment) {
            setComments(prev => [newComment, ...prev])
            setText('')
        }
        setSubmitting(false)
    }

    const handleDelete = async (commentId) => {
        setDeletingId(commentId)
        const ok = await appwriteService.deleteComment(commentId)
        if (ok) setComments(prev => prev.filter(c => c.$id !== commentId))
        setDeletingId(null)
    }

    return (
        <section style={{ marginTop: '80px', paddingTop: '56px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                    {loading ? 'Comments' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
                </h2>
            </div>

            {authStatus ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                            background: 'var(--accent)', color: '#fff', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px',
                        }}>{getInitials(authorName)}</div>
                        <div style={{ flex: 1 }}>
                            <span style={{
                                display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px',
                            }}>Commenting as <strong style={{ color: 'var(--ink)' }}>{authorName}</strong></span>
                            <textarea
                                value={text}
                                onChange={e => { setText(e.target.value); if (error) setError('') }}
                                placeholder="Share your thoughts..."
                                rows={4}
                                style={{
                                    width: '100%', padding: '13px 16px', background: 'var(--paper-card)',
                                    border: `1px solid ${error ? '#fca5a5' : 'var(--border)'}`,
                                    borderRadius: '12px', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                                    color: 'var(--ink)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease', boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,81,42,0.08)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = error ? '#fca5a5' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#dc2626', marginTop: '6px' }}>{error}</p>}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="submit" disabled={submitting || !text.trim()} style={{
                                    padding: '10px 24px', borderRadius: '100px', border: 'none',
                                    background: submitting || !text.trim() ? 'var(--ink-muted)' : 'var(--ink)',
                                    color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
                                    cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => { if (!submitting && text.trim()) e.currentTarget.style.background = 'var(--accent)' }}
                                    onMouseLeave={e => { if (!submitting && text.trim()) e.currentTarget.style.background = 'var(--ink)' }}
                                >{submitting ? 'Posting...' : 'Post comment'}</button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div style={{
                    padding: '24px 28px', background: 'var(--paper-warm)', border: '1px solid var(--border)',
                    borderRadius: '14px', marginBottom: '48px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
                }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-muted)' }}>Sign in to join the conversation.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a href="/login" style={{ padding: '9px 20px', borderRadius: '100px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink)', textDecoration: 'none' }}>Log in</a>
                        <a href="/signup" style={{ padding: '9px 20px', borderRadius: '100px', background: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Sign up</a>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-muted)' }}>Loading comments...</div>
            ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--ink-muted)' }}>No comments yet. Be the first to say something.</p>
                </div>
            ) : (
                <div>{comments.map((c, i) => <CommentItem key={c.$id} comment={c} currentUserId={authorId} onDelete={handleDelete} deletingId={deletingId} isLast={i === comments.length - 1} />)}</div>
            )}
        </section>
    )
}

function CommentItem({ comment, currentUserId, onDelete, deletingId, isLast }) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const isOwner = comment.authorId === currentUserId
    const isDeleting = deletingId === comment.$id

    return (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '24px 0', borderBottom: isLast ? 'none' : '1px solid var(--border)', opacity: isDeleting ? 0.4 : 1, transition: 'opacity 0.2s ease' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>{getInitials(comment.authorName)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{comment.authorName}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>{timeAgo(comment.createdAt)}</span>
                    </div>
                    {isOwner && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {confirmDelete ? (
                                <>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-muted)' }}>Delete?</span>
                                    <button onClick={() => onDelete(comment.$id)} disabled={isDeleting} style={{ padding: '3px 10px', borderRadius: '100px', background: '#dc2626', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#fff', cursor: 'pointer' }}>{isDeleting ? '...' : 'Yes'}</button>
                                    <button onClick={() => setConfirmDelete(false)} style={{ padding: '3px 10px', borderRadius: '100px', background: 'transparent', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-muted)', cursor: 'pointer' }}>No</button>
                                </>
                            ) : (
                                <button onClick={() => setConfirmDelete(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: '2px', display: 'flex', alignItems: 'center', transition: 'color 0.2s ease' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.7, wordBreak: 'break-word', margin: 0 }}>{comment.content}</p>
            </div>
        </div>
    )
}