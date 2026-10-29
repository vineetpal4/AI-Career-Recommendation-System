import React, { useState, useEffect } from 'react'

const WORDS = [
  { text: 'Discover', color: 'from-primary-600 via-purple-600 to-peach-400', glow: 'rgba(112,71,235,0.35)' },
  { text: 'Explore', color: 'from-purple-600 via-pink-500 to-peach-400', glow: 'rgba(147,103,235,0.35)' },
  { text: 'Learn', color: 'from-peach-400 via-orange-500 to-primary-600', glow: 'rgba(255,179,138,0.40)' },
  { text: 'Build', color: 'from-primary-500 via-indigo-600 to-purple-700', glow: 'rgba(112,71,235,0.35)' },
  { text: 'Grow', color: 'from-emerald-500 via-teal-600 to-primary-600', glow: 'rgba(16,185,129,0.35)' },
  { text: 'Achieve', color: 'from-peach-400 via-pink-600 to-purple-600', glow: 'rgba(255,129,66,0.35)' },
  { text: 'Succeed', color: 'from-primary-600 via-violet-600 to-peach-300', glow: 'rgba(112,71,235,0.40)' },
]

export default function RotatingWords() {
  const [index, setIndex] = useState(0)
  const [displayText, setDisplayText] = useState(WORDS[0].text)
  const [isTyping, setIsTyping] = useState(false)
  const [fadeState, setFadeState] = useState('visible') // 'visible', 'exiting', 'entering'

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      // Step 1: Slide down / fade out
      setFadeState('exiting')

      setTimeout(() => {
        setIndex((prev) => {
          const nextIndex = (prev + 1) % WORDS.length
          const nextWord = WORDS[nextIndex].text

          // Subtle typing animation
          let charIndex = 0
          setDisplayText('')
          setIsTyping(true)
          setFadeState('entering')

          const typeTimer = setInterval(() => {
            charIndex++
            setDisplayText(nextWord.slice(0, charIndex))
            if (charIndex >= nextWord.length) {
              clearInterval(typeTimer)
              setIsTyping(false)
              setFadeState('visible')
            }
          }, 45)

          return nextIndex
        })
      }, 400) // Duration of exit transition
    }, 3200)

    return () => clearInterval(interval)
  }, [])

  const current = WORDS[index]

  return (
    <span className="relative inline-block min-w-[210px] sm:min-w-[290px] lg:min-w-[340px] text-left align-baseline select-none">
      <span
        style={{
          filter: `drop-shadow(0 0 16px ${current.glow})`,
        }}
        className={`inline-block font-display font-black bg-gradient-to-r ${current.color} bg-clip-text text-transparent transition-all duration-300 transform ${
          fadeState === 'exiting'
            ? 'opacity-0 translate-y-3 scale-95 blur-[2px]'
            : fadeState === 'entering'
            ? 'opacity-90 -translate-y-2 scale-100'
            : 'opacity-100 translate-y-0 scale-100 blur-0'
        }`}
      >
        {displayText}
        {isTyping && (
          <span className="inline-block w-1 h-8 sm:h-12 ml-1 bg-primary-500 rounded animate-pulse align-middle" />
        )}
      </span>
    </span>
  )
}
