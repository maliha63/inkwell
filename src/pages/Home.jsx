import React, { useEffect, useState, useRef } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''

// ── Hardcoded fallback quotes (used if API fails) ──────────────────────────
const FALLBACK_QUOTES = [
  { content: "A writer only begins a book. A reader finishes it.", author: "Samuel Johnson" },
  { content: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { content: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { content: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { content: "One must always be careful of books, and what is inside them.", author: "Cassandra Clare" },
  { content: "Words are, in my not so humble opinion, our most inexhaustible source of magic.", author: "J.K. Rowling" },
  { content: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { content: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" },
]

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [trendingNews, setTrendingNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [quote, setQuote] = useState(null)
  const [featuredPost, setFeaturedPost] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState('idle') // idle | success | error
  const authStatus = useSelector((state) => state.auth.status)

  // ── Fetch posts ────────────────────────────────────────────────────────────
  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res) {
        setPosts(res.documents)
        // Pick a random featured post on every page load
        if (res.documents.length > 0) {
          const idx = Math.floor(Math.random() * res.documents.length)
          setFeaturedPost(res.documents[idx])
        }
      }
      setLoading(false)
    })
  }, [])

  // ── Fetch Quote of the Day (quotable.io — free, no key needed) ────────────
  useEffect(() => {
    // Use a random seed so it changes on every page refresh
    fetch('https://api.quotable.io/random?tags=inspirational|literature|wisdom')
      .then(r => r.json())
      .then(data => {
        if (data.content) setQuote({ content: data.content, author: data.author })
        else throw new Error('no content')
      })
      .catch(() => {
        // Fallback: deterministic pick based on day, so it "changes daily"
        const dayIndex = new Date().getDay() + Math.floor(Math.random() * FALLBACK_QUOTES.length)
        setQuote(FALLBACK_QUOTES[dayIndex % FALLBACK_QUOTES.length])
      })
  }, [])

  // ── Fetch Trending News ────────────────────────────────────────────────────
  // Dev: calls NewsAPI directly. Production: calls /api/news (Vercel proxy)
  // so NewsAPI's free-plan browser block doesn't affect my deployed site.
  useEffect(() => {
    const isDev = import.meta.env.DEV
    const newsUrl = isDev
      ? `https://newsapi.org/v2/top-headlines?country=us&pageSize=3&apiKey=${NEWS_API_KEY}`
      : '/api/news'

    if (!NEWS_API_KEY && isDev) { setNewsLoading(false); return }

    fetch(newsUrl)
      .then(r => r.json())
      .then(data => {
        if (data.articles) setTrendingNews(data.articles.slice(0, 3))
        setNewsLoading(false)
      })
      .catch(() => setNewsLoading(false))
  }, [])

  // ── Categories derived from post titles (simple demo tagging) ─────────────
  const CATEGORIES = ['All', 'Technology', 'Culture', 'Science', 'Opinion', 'Fiction']

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p =>
        p.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.content?.toLowerCase().includes(activeCategory.toLowerCase())
      )

  // ── Newsletter submit ──────────────────────────────────────────────────────
  const handleSubscribe = () => {
    if (!email.trim()) {
      setSubState('error')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setSubState('error')
      return
    }
    // In a real app you'd POST to your backend/email service here
    setSubState('success')
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px 60px',
        background: 'var(--paper)',
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 50%, rgba(200,81,42,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 50%, rgba(184,149,58,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 80% 40% at 50% 0%, rgba(200,81,42,0.08) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Eyebrow */}
        <div className="animate-fade-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginBottom: '36px', position: 'relative',
        }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)',
          }}>Independent Publishing</span>
          <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
        </div>

        {/* Big headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 11vw, 9rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
          color: 'var(--ink)',
          marginBottom: '32px',
          position: 'relative',
        }}>
          <span className="animate-fade-up delay-100" style={{ display: 'block' }}>Words</span>
          <span className="animate-fade-up delay-200" style={{
            display: 'block', fontStyle: 'italic', color: 'var(--accent)',
          }}>worth</span>
          <span className="animate-fade-up delay-300" style={{ display: 'block' }}>reading.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up delay-400" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          color: 'var(--ink-muted)',
          maxWidth: '460px',
          lineHeight: 1.7,
          marginBottom: '44px',
        }}>
          A curated space for thoughtful writing. Ideas, stories, and perspectives from people who care about craft.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-500" style={{
          display: 'flex', gap: '14px', alignItems: 'center',
          flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '64px',
        }}>
          {!authStatus ? (
            <>
              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 34px',
                background: 'var(--ink)', color: 'var(--paper)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
                textDecoration: 'none', borderRadius: '100px', cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(13,13,13,0.15)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >Start writing →</Link>
              <Link to="/login" style={{
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                color: 'var(--ink-muted)', textDecoration: 'none',
                padding: '13px 24px', borderRadius: '100px',
                border: '1px solid var(--border)', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--ink)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >Sign in</Link>
            </>
          ) : (
            <Link to="/add-post" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 34px',
              background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
              textDecoration: 'none', borderRadius: '100px', cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >Write a post +</Link>
          )}
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-600" style={{
          display: 'flex', gap: '56px', justifyContent: 'center',
          paddingTop: '28px', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
        }}>
          {[
            { num: posts.length || '0', label: 'Articles published' },
            { num: '∞', label: 'Ideas to explore' },
            { num: '1', label: 'Place to read' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '2.2rem',
                fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: '6px',
              }}>{stat.num}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE OF THE DAY ── (changes on every page refresh via API) ───────── */}
      <section style={{
        padding: '72px 0',
        background: 'var(--paper)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <Container>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '28px',
          }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)',
            }}>Quote of the day</span>
            <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
          </div>
          {quote ? (
            <>
              <blockquote style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                maxWidth: '700px',
                margin: '0 auto 20px',
                fontStyle: 'italic',
              }}>
                "{quote.content}"
              </blockquote>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--ink-muted)',
              }}>— {quote.author}</p>
            </>
          ) : (
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.2rem',
              fontStyle: 'italic', color: 'var(--ink-muted)',
            }}>Loading today's quote...</div>
          )}
        </Container>
      </section>

      {/* ── FEATURED POST (random on every load) ──────────────────────────────── */}
      {featuredPost && (
        <section style={{
          padding: '80px 0',
          background: 'var(--paper-warm)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          <Container>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px',
            }}>
              <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)',
              }}>Featured</span>
            </div>

            <Link to={`/post/${featuredPost.$id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '64px',
                alignItems: 'center',
              }}
                onMouseEnter={e => e.currentTarget.querySelector('h2').style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.querySelector('h2').style.color = 'var(--ink)'}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--ink-muted)', marginBottom: '20px',
                  }}>
                    {new Date(featuredPost.$createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                    fontWeight: 900,
                    color: 'var(--ink)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    marginBottom: '20px',
                    transition: 'color 0.2s ease',
                  }}>{featuredPost.title}</h2>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    color: 'var(--accent)',
                  }}>Read full story →</span>
                </div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img
                    src={appwriteService.getFilePreview(featuredPost.featuredImage)}
                    alt={featuredPost.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ── TRENDING NEWS ── */}
      <section style={{ background: 'var(--ink)', padding: '80px 0' }}>
        <Container>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)',
              }}>Trending now</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              letterSpacing: '0.1em', color: 'rgba(245,242,235,0.25)',
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {!NEWS_API_KEY ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2px',
            }}>
              {[
                { title: 'Add VITE_NEWS_API_KEY to your .env to see real news', source: 'Setup' },
                { title: 'Get a free key at newsapi.org — takes 30 seconds', source: 'newsapi.org' },
                { title: 'Real trending headlines will appear here automatically', source: 'Preview' },
              ].map((item, i) => (
                <TrendingCard key={i} item={item} index={i} />
              ))}
            </div>
          ) : newsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'rgba(245,242,235,0.4)' }}>
              Fetching today's news...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2px',
            }}>
              {trendingNews.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <TrendingCard item={item} index={i} />
                </a>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── CATEGORIES / TAGS FILTER ──────────────────────────────────────────── */}
      <section style={{
        padding: '80px 0 120px',
        background: 'var(--paper-card)',
        borderTop: '1px solid var(--border)',
      }}>
        <Container>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', marginBottom: '32px',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em',
            }}>Latest writing</h2>
            {authStatus && posts.length > 1 && (
              <Link to="/all-posts" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--ink-muted)', textDecoration: 'none',
                borderBottom: '1px solid var(--border)', paddingBottom: '2px',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.borderBottomColor = 'var(--border)' }}
              >View all →</Link>
            )}
          </div>

          {/* Category pills */}
          <div style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '100px',
                  border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                  background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--ink-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--ink)'
                    e.currentTarget.style.color = 'var(--ink)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--ink-muted)'
                  }
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Posts list */}
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-display)', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              Loading stories...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '16px' }}>
                {activeCategory !== 'All' ? `No posts in "${activeCategory}" yet.` : authStatus ? 'No posts yet.' : 'Nothing here yet.'}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', marginBottom: '28px' }}>
                {authStatus ? 'Be the first to publish something.' : 'Sign up to start reading and writing.'}
              </p>
              {activeCategory !== 'All' ? (
                <button onClick={() => setActiveCategory('All')} style={{
                  display: 'inline-flex', padding: '11px 28px',
                  background: 'var(--ink)', color: 'var(--paper)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  border: 'none', borderRadius: '100px', cursor: 'pointer',
                }}>Show all posts</button>
              ) : (
                <Link to={authStatus ? '/add-post' : '/signup'} style={{
                  display: 'inline-flex', padding: '11px 28px',
                  background: 'var(--ink)', color: 'var(--paper)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  textDecoration: 'none', borderRadius: '100px', cursor: 'pointer',
                }}>
                  {authStatus ? 'Write first post' : 'Get started'}
                </Link>
              )}
            </div>
          ) : (
            <div>
              {filteredPosts.map((post, i) => (
                <div key={post.$id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <PostCard {...post} />
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)' }} />
            </div>
          )}
        </Container>
      </section>

      {/* ── NEWSLETTER BAND ── */}
      <section style={{
        padding: '80px 0',
        background: 'var(--accent)',
        textAlign: 'center',
      }}>
        <Container>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(245,242,235,0.7)', marginBottom: '20px',
          }}>Stay in the loop</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900,
            color: 'var(--paper)',
            letterSpacing: '-0.03em',
            marginBottom: '12px',
          }}>Never miss a story.</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'rgba(245,242,235,0.75)',
            maxWidth: '400px',
            margin: '0 auto 36px',
          }}>
            Get the best writing delivered to your inbox, weekly.
          </p>

          {/* Show form OR success/error message */}
          {subState === 'success' ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 32px',
              background: 'rgba(245,242,235,0.15)',
              border: '1px solid rgba(245,242,235,0.3)',
              borderRadius: '100px',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'rgba(245,242,235,0.2)', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="var(--paper)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                color: 'var(--paper)', fontWeight: 600,
              }}>You're in! We'll be in touch soon.</span>
            </div>
          ) : (
            <div style={{ maxWidth: '420px', margin: '0 auto' }}>
              <div style={{
                display: 'flex', gap: '0',
                borderRadius: '100px', overflow: 'hidden',
                border: `1px solid ${subState === 'error' ? 'rgba(255,200,200,0.6)' : 'rgba(245,242,235,0.3)'}`,
                transition: 'border-color 0.2s ease',
              }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (subState === 'error') setSubState('idle') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={{
                    flex: 1, padding: '13px 20px',
                    background: 'rgba(245,242,235,0.15)',
                    border: 'none', outline: 'none',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: 'var(--paper)',
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  style={{
                    padding: '13px 24px',
                    background: 'var(--paper)', color: 'var(--accent)',
                    border: 'none', fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--paper)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--accent)' }}
                >
                  Subscribe →
                </button>
              </div>
              {/* Validation message */}
              {subState === 'error' && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                  color: 'rgba(255,220,220,0.9)', marginTop: '10px',
                  textAlign: 'center',
                }}>
                  {!email.trim() ? 'Please enter your email address first.' : 'That doesn\'t look like a valid email. Try again?'}
                </p>
              )}
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}

function TrendingCard({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px',
        background: hovered ? 'rgba(200,81,42,0.12)' : index === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(200,81,42,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease', height: '100%', cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.25)', marginBottom: '16px', fontStyle: 'italic',
      }}>0{index + 1}</div>

      {item.urlToImage && (
        <div style={{ width: '100%', height: '130px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
          <img src={item.urlToImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.parentElement.style.display = 'none' }} />
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--accent)', marginBottom: '10px',
      }}>{item.source?.name || item.source || 'News'}</div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: '1rem',
        fontWeight: 700, color: 'rgba(245,242,235,0.9)',
        lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: '12px',
      }}>
        {item.title?.length > 90 ? item.title.slice(0, 90) + '…' : item.title}
      </h3>

      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: hovered ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
        transition: 'color 0.2s ease',
      }}>Read full story →</span>
    </div>
  )
}

export default Home