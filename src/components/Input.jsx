import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
  label,
  type = "text",
  className = "",
  ...props
}, ref) {
  const id = useId()

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        style={{
          width: '100%',
          padding: '11px 16px',
          background: 'var(--paper-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.925rem',
          color: 'var(--ink)',
          outline: 'none',
          transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.background = '#fff'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,81,42,0.08)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--paper-card)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        className={className}
        {...props}
      />
    </div>
  )
})

export default Input