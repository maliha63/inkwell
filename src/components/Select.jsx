import React, { useId } from 'react'

function Select({ options, label, className = "", ...props }, ref) {
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
      <select
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
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b6b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        className={className}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default React.forwardRef(Select)