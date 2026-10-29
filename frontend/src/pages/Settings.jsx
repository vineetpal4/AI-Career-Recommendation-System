import React from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineSwatch,
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineArrowPathRoundedSquare,
} from 'react-icons/hi2'

export default function Settings() {
  const {
    darkMode,
    setDarkMode,
    liveBg,
    setLiveBg,
    autoChange,
    setAutoChange,
    bgThemeMode,
    setBgThemeMode,
    bgInterval,
    setBgInterval,
    activeBgStyle,
    setActiveBgStyle,
    liveThoughts,
    setLiveThoughts,
    resetDefaults,
    allStyles,
  } = useTheme()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 dark:bg-purple-950/80 text-primary-700 dark:text-purple-300 text-xs font-semibold mb-3">
          <HiOutlineSwatch className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-text dark:text-white">
          Appearance & Settings
        </h1>
        <p className="text-sm text-text-muted dark:text-slate-400 mt-1">
          Configure interface dark mode, live animated canvas backgrounds, and motivational thoughts.
        </p>
      </div>

      <div className="card-glass p-6 sm:p-8 space-y-6">
        {/* 1. Interface Theme (Dark Mode) */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-primary-600 dark:text-purple-300 shadow-sm">
              {darkMode ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-text dark:text-white">Interface Dark Mode</h4>
              <p className="text-xs text-text-muted dark:text-slate-400">
                Consistent dark or light interface across all pages, forms, and roadmaps
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              darkMode ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                darkMode ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 2. Live Background ON / OFF */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-primary-600 dark:text-purple-300 shadow-sm">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-text dark:text-white">Live Animated Background</h4>
              <p className="text-xs text-text-muted dark:text-slate-400">
                Continuous particle animations, starry galaxy, liquid aurora, and neural nets
              </p>
            </div>
          </div>
          <button
            onClick={() => setLiveBg(!liveBg)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              liveBg ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                liveBg ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 3. Auto Change ON / OFF */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-primary-600 dark:text-purple-300 shadow-sm">
              <HiOutlineArrowPath className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-text dark:text-white">Auto Change Backgrounds</h4>
              <p className="text-xs text-text-muted dark:text-slate-400">
                Cycle through background styles automatically without page reload
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoChange(!autoChange)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              autoChange ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                autoChange ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 4. Background Theme Filter */}
        <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between mb-3">
            <label className="font-bold text-sm text-text dark:text-white">
              Background Theme Mode
            </label>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-purple-950 text-primary-700 dark:text-purple-300 capitalize">
              {bgThemeMode}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'dark', label: 'Dark Backgrounds' },
              { key: 'light', label: 'Light Backgrounds' },
              { key: 'both', label: 'Both (Alternating)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBgThemeMode(key)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  bgThemeMode === key
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-white dark:bg-slate-700 text-text dark:text-slate-200 hover:bg-primary-100 dark:hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Background Interval */}
        <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HiOutlineClock className="w-4 h-4 text-primary-600 dark:text-purple-400" />
              <label className="font-bold text-sm text-text dark:text-white">
                Transition Interval
              </label>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-purple-950 text-primary-700 dark:text-purple-300">
              {bgInterval} Seconds
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[20, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => setBgInterval(sec)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  bgInterval === sec
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-white dark:bg-slate-700 text-text dark:text-slate-200 hover:bg-primary-100 dark:hover:bg-slate-600'
                }`}
              >
                {sec} Seconds
              </button>
            ))}
          </div>
        </div>

        {/* 6. Live Thoughts ON / OFF */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-text dark:text-white">Live Motivational Thoughts</h4>
            <p className="text-xs text-text-muted dark:text-slate-400">
              Smooth rotation of career & coding quotes every 12 seconds
            </p>
          </div>
          <button
            onClick={() => setLiveThoughts(!liveThoughts)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              liveThoughts ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                liveThoughts ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Manual Style Picker */}
        <div>
          <h4 className="font-bold text-sm text-text dark:text-white mb-3">
            Choose Background Style (Instant Preview)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allStyles.map((style) => {
              const isSelected = activeBgStyle === style.id
              return (
                <button
                  key={style.id}
                  onClick={() => setActiveBgStyle(style.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-500/30 bg-primary-50/80 dark:bg-purple-950/60 shadow-md'
                      : 'border-primary-100 dark:border-slate-800 bg-white/70 dark:bg-slate-800/50 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        style.category === 'dark'
                          ? 'bg-slate-900 text-purple-200'
                          : 'bg-peach-100 text-orange-700'
                      }`}
                    >
                      {style.badge}
                    </span>
                    {isSelected && <HiOutlineCheck className="w-4 h-4 text-primary-600 dark:text-purple-400" />}
                  </div>
                  <p className="text-xs font-bold text-text dark:text-white truncate">{style.name}</p>
                  <p className="text-[10px] text-text-muted dark:text-slate-400 line-clamp-2 mt-0.5">
                    {style.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* 7. Reset Defaults */}
        <div className="pt-4 border-t border-primary-100 dark:border-purple-900/40">
          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <HiOutlineArrowPathRoundedSquare className="w-4 h-4" />
            Reset to Default Settings
          </button>
        </div>
      </div>
    </div>
  )
}
