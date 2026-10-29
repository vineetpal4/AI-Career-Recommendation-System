import React from 'react'
import { Link } from 'react-router-dom'

/**
 * CareerAI Logo Component
 * A stylised "C" + upward arrow mark with geometric typography
 */
export default function Logo({ size = 'md', linkTo = '/', showText = true, className = '' }) {
  const sizes = {
    sm: { mark: 28, text: 'text-lg', gap: 'gap-1.5' },
    md: { mark: 36, text: 'text-xl', gap: 'gap-2' },
    lg: { mark: 48, text: 'text-2xl', gap: 'gap-3' },
    xl: { mark: 64, text: 'text-3xl', gap: 'gap-3' },
  }
  const s = sizes[size] || sizes.md
  const wh = s.mark

  const mark = (
    <div style={{ width: wh, height: wh }} className="relative flex-shrink-0">
      <svg
        width={wh}
        height={wh}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7047EB" />
            <stop offset="100%" stopColor="#4D2CB5" />
          </linearGradient>
          <linearGradient id="arrowGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFB38A" />
            <stop offset="100%" stopColor="#FF8142" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7047EB" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" filter="url(#shadow)" />

        {/* V shape */}
        <polyline
          points="10,12 20,28 30,12"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />

        {/* Upward arrow inside V (growth symbol) */}
        <line
          x1="20" y1="26"
          x2="20" y2="14"
          stroke="url(#arrowGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polyline
          points="16,18 20,13 24,18"
          stroke="url(#arrowGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )

  const text = showText ? (
    <div className={`flex flex-col leading-none`}>
      <span
        className={`font-display font-bold tracking-tight text-gradient ${s.text}`}
        style={{ letterSpacing: '-0.02em' }}
      >
        CareerAI
      </span>
      <span className="text-[9px] font-medium text-text-light tracking-widest uppercase mt-0.5 hidden sm:block">
        Turn Potential Into Possibility
      </span>
    </div>
  ) : null

  const content = (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {mark}
      {text}
    </div>
  )

  if (!linkTo) return content

  return (
    <Link to={linkTo} className="flex items-center hover:opacity-90 transition-opacity duration-200">
      {content}
    </Link>
  )
}
