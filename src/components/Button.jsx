// ── Button.jsx ──
import React from "react"

export default function Button({
  children,
  type = "button",
  bgColor,
  textColor,
  className = "",
  variant = "primary",
  ...props
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 24px',
    borderRadius: '100px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    border: 'none',
    transition: 'all 0.25s ease',
    lineHeight: 1,
  }

  const styles = bgColor
    ? { ...base, background: bgColor, color: textColor || '#fff' }
    : { ...base, background: 'var(--ink)', color: 'var(--paper)' }

  return (
    <button
      type={type}
      style={styles}
      className={className}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.opacity = '0.88'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.opacity = '1'
      }}
      {...props}
    >
      {children}
    </button>
  )
}