import React, { useState, useEffect, useMemo } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config"

const CATEGORIES = ['All', 'Technology', 'Culture', 'Science', 'Opinion', 'Fiction', 'Travel', 'Food']
const POSTS_PER_PAGE = 8

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [page, setPage] = useState(1)
    const [searchFocused, setSearchFocused] = useState(false)

    useEffect(() => {
        appwriteService.getPosts([]).then((res) => {
            if (res) setPosts(res.documents)
            setLoading(false)
        })
    }, [])

    // Reset to page 1 on filter/search change
    useEffect(() => { setPage(1) }, [search, activeCategory])

    const filtered = useMemo(() => {
        let result = posts
        if (activeCategory !== 'All') {
            result = result.filter(p =>
                p.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
                p.content?.toLowerCase().includes(activeCategory.toLowerCase())
            )
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            result = result.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.content?.toLowerCase().includes(q)
            )
        }
        return result
    }, [posts, search, activeCategory])

    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

    const pillStyle = (active) => ({
        padding: '7px 18px', borderRadius: '100px', border: 'none',
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink-muted)',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.2s ease',
        outline: active ? 'none' : '1px solid var(--border)',
    })

    const pageBtn = (active) => ({
        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink-muted)',
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
        cursor: 'pointer', transition: 'all 0.2s ease',
        outline: active ? 'none' : '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    })

    return (
        <div style={{ padding: '64px 0 100px' }}>
            <Container>
                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)' }}>Archive</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.04em' }}>All posts</h1>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', marginTop: '12px' }}>
                        {loading ? 'Loading...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}${search || activeCategory !== 'All' ? ' found' : ' published'}`}
                    </p>
                </div>

                {/* Search bar */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 18px',
                        background: 'var(--paper-card)',
                        border: `1px solid ${searchFocused ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: searchFocused ? '0 0 0 3px rgba(200,81,42,0.08)' : 'none',
                        maxWidth: '480px',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            style={{
                                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink)',
                            }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--ink-muted)', display: 'flex', padding: '2px',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Category filter pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={pillStyle(activeCategory === cat)}
                            onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.outlineColor = 'var(--ink)' } }}
                            onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.outlineColor = 'var(--border)' } }}
                        >{cat}</button>
                    ))}
                </div>

                {/* Posts list */}
                {loading ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-muted)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>Loading stories...</div>
                ) : paginated.length === 0 ? (
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '12px' }}>No posts found.</p>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', marginBottom: '24px' }}>Try a different search or category.</p>
                        <button onClick={() => { setSearch(''); setActiveCategory('All') }} style={{
                            padding: '10px 24px', borderRadius: '100px', border: '1px solid var(--border)',
                            background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                            color: 'var(--ink)', cursor: 'pointer',
                        }}>Clear filters</button>
                    </div>
                ) : (
                    <>
                        <div>
                            {paginated.map((post, i) => (
                                <div key={post.$id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <PostCard {...post} />
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--border)' }} />
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', marginTop: '56px', flexWrap: 'wrap',
                            }}>
                                {/* Prev */}
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ ...pageBtn(false), opacity: page === 1 ? 0.35 : 1, width: 'auto', padding: '0 14px', borderRadius: '100px' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)} style={pageBtn(p === page)}
                                        onMouseEnter={e => { if (p !== page) e.currentTarget.style.background = 'var(--paper-warm)' }}
                                        onMouseLeave={e => { if (p !== page) e.currentTarget.style.background = 'transparent' }}
                                    >{p}</button>
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ ...pageBtn(false), opacity: page === totalPages ? 0.35 : 1, width: 'auto', padding: '0 14px', borderRadius: '100px' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>

                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-muted)', letterSpacing: '0.08em', marginLeft: '8px' }}>
                                    Page {page} of {totalPages}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    )
}

export { AllPosts }
export default AllPosts