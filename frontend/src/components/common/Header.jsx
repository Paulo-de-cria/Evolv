import React from 'react'

const Header = ({ title, subtitle, children }) => {
  return (
    <header className="bg-gradient-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl opacity-90 mb-6 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header