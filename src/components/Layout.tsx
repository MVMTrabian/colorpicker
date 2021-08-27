import React from 'react'
//do not edit, if I need to edit this I'm on the wrong track
export const Layout: React.FC = ({ children }) => {
  //Sets the layout container of the app
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#fff',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}
