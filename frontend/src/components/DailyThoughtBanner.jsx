import React, { useState, useEffect } from 'react'
import { getDailyThought, getRandomThought, MOTIVATIONAL_THOUGHTS } from '../data/motivationalThoughts'
import { useTheme } from '../context/ThemeContext'
import { HiOutlineSparkles, HiOutlineArrowPath, HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2'

export default function DailyThoughtBanner() {
  const { liveThoughts } = useTheme()
  const [dailyThought] = useState(() => getDailyThought())
  const [currentThought, setCurrentThought] = useState(() => getDailyThought())
  const [isDaily, setIsDaily] = useState(true)
  const [fade, setFade] = useState(true)

  // Rotate thoughts every 12 seconds if liveThoughts is enabled
  useEffect(() => {
    if (!liveThoughts) {
      setCurrentThought(dailyThought)
      setIsDaily(true)
      return
    }

    const interval = setInterval(() => {
      // Don't rotate if tab is hidden
      if (document.hidden) return

      setFade(false)
      setTimeout(() => {
        setCurrentThought((prev) => getRandomThought(prev?.id))
        setIsDaily(false)
        setFade(true)
      }, 350)
    }, 12000)

    return () => clearInterval(interval)
  }, [liveThoughts, dailyThought])

  const handleNextThought = () => {
    setFade(false)
    setTimeout(() => {
      setCurrentThought((prev) => getRandomThought(prev?.id))
      setIsDaily(false)
      setFade(true)
    }, 250)
  }

  const handleShowDaily = () => {
    setFade(false)
    setTimeout(() => {
      setCurrentThought(dailyThought)
      setIsDaily(true)
      setFade(true)
    }, 250)
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-primary-100/90 dark:border-purple-900/40 shadow-[0_10px_35px_rgba(112,71,235,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-400/10 via-peach-300/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-primary-50 dark:border-purple-900/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-peach-400 flex items-center justify-center text-white shadow-sm">
              <HiOutlineSparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-purple-300">
                {isDaily ? 'Thought of the Day' : 'Live Inspiration'}
              </span>
              <span className="text-[11px] text-text-muted dark:text-slate-400 ml-2">
                • {currentThought.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {!isDaily && (
              <button
                onClick={handleShowDaily}
                className="px-2.5 py-1 rounded-full text-text-muted dark:text-slate-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-purple-950/60 transition-colors"
                title="Return to today's anchor thought"
              >
                Today's Thought
              </button>
            )}
            <button
              onClick={handleNextThought}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-purple-950/70 border border-primary-100 dark:border-purple-800 text-primary-700 dark:text-purple-300 hover:bg-primary-100 dark:hover:bg-purple-900 transition-all font-semibold"
              title="View next inspirational thought"
            >
              <HiOutlineArrowPath className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>
        </div>

        {/* Quote body with smooth opacity & transform fade */}
        <div
          className={`transition-all duration-300 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          <blockquote className="text-sm sm:text-base font-medium text-text dark:text-slate-100 leading-relaxed italic mb-2">
            "{currentThought.quote}"
          </blockquote>
          <div className="flex items-center justify-between text-xs text-text-muted dark:text-slate-400">
            <span className="font-semibold text-primary-600 dark:text-purple-400">— {currentThought.author}</span>
            <span className="text-[11px] opacity-75">Curated Career Guidance</span>
          </div>
        </div>

      </div>
    </div>
  )
}
