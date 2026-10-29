import React, { useState, useEffect } from 'react'
import { HiOutlineClock } from 'react-icons/hi2'

export default function LiveClock({ showDate = true, className = '' }) {
  const [timeState, setTimeState] = useState(() => {
    const now = new Date()
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTimeState({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-primary-100/80 dark:border-purple-900/40 shadow-sm text-xs font-semibold text-text dark:text-slate-200 transition-colors select-none ${className}`}
      title="Live Local Time"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <HiOutlineClock className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
      {showDate && (
        <>
          <span className="text-text-muted dark:text-slate-400 font-medium">{timeState.date}</span>
          <span className="text-primary-300 dark:text-purple-700">•</span>
        </>
      )}
      <span className="tabular-nums tracking-wide font-mono font-bold text-primary-700 dark:text-purple-300">
        {timeState.time}
      </span>
    </div>
  )
}
