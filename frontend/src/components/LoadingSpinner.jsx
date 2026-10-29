import React from 'react'

export default function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin`} />
        <div className={`absolute inset-1 rounded-full border-2 border-transparent border-t-peach-300 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
      </div>
      {text && <p className="text-sm text-text-muted font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-warm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-text-muted font-medium">Loading CareerAI...</p>
        </div>
      </div>
    )
  }

  return spinner
}
