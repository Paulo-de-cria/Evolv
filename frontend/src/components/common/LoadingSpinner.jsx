import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`loading-spinner ${sizeClasses[size]}`}
        style={{
          border: `3px solid #f3f4f6`,
          borderTop: `3px solid #2563eb`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      ></div>
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner