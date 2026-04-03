import React from 'react'

function Container({ children }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      paddingLeft: '48px',
      paddingRight: '48px',
    }}>
      {children}
    </div>
  )
}

export default Container