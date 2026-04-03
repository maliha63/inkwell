import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './index.css'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData: userData }))
        else dispatch(logout())
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-dot" style={{ animationDelay: '0s' }}>I</span>
        <span className="loading-dot" style={{ animationDelay: '0.05s' }}>n</span>
        <span className="loading-dot" style={{ animationDelay: '0.1s' }}>k</span>
        <span className="loading-dot" style={{ animationDelay: '0.15s' }}>w</span>
        <span className="loading-dot" style={{ animationDelay: '0.2s' }}>e</span>
        <span className="loading-dot" style={{ animationDelay: '0.25s' }}>l</span>
        <span className="loading-dot" style={{ animationDelay: '0.3s' }}>l</span>
      </div>
    )
  }

  return (
    <div className="grain" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <ScrollToTop />
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App