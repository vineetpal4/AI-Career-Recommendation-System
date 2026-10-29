import React from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  HiXMark,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineSwatch,
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineArrowPathRoundedSquare,
} from 'react-icons/hi2'

export default function SettingsModal() {
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
    settingsModalOpen,
    setSettingsModalOpen,
    allStyles,
  } = useTheme()

  if (!settingsModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary-100 dark:border-purple-900/50 p-6 sm:p-8 my-8 text-text dark:text-slate-100 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-primary-100 dark:border-purple-900/40 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-peach-400 flex items-center justify-center text-white shadow-glow">
              <HiOutlineSwatch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-text dark:text-white">
                Personalize & Settings
              </h2>
              <p className="text-xs text-text-muted dark:text-slate-400">
                Customize appearance, live animated canvas backgrounds, and motivational thoughts
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-2 rounded-xl text-text-muted hover:text-text dark:text-slate-400 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors"
            title="Close Settings"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Interface Theme (Dark Mode ON / OFF) */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-primary-600 dark:text-purple-300 shadow-sm">
                {darkMode ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-text dark:text-white">Interface Dark Mode</h4>
                <p className="text-xs text-text-muted dark:text-slate-400">
                  Toggle consistent dark or light appearance for cards, forms, and navigation
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                darkMode ? 'bg-primary-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={darkMode}
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
              role="switch"
              aria-checked={liveBg}
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
                  Automatically cycle through background styles seamlessly without reloading
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoChange(!autoChange)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                autoChange ? 'bg-primary-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={autoChange}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  autoChange ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 4. Background Theme Filter: Dark / Light / Both */}
          <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-sm text-text dark:text-white">
                Background Theme Preference
              </label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-purple-950 text-primary-700 dark:text-purple-300 capitalize">
                {bgThemeMode}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'dark', label: 'Dark Only' },
                { key: 'light', label: 'Light Only' },
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

          {/* 5. Background Interval: 20s / 30s / 60s */}
          <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/60 border border-primary-100 dark:border-purple-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HiOutlineClock className="w-4 h-4 text-primary-600 dark:text-purple-400" />
                <label className="font-bold text-sm text-text dark:text-white">
                  Auto Transition Interval
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
                Rotate career, coding, and discipline quotes every 12 seconds with smooth fade
              </p>
            </div>
            <button
              onClick={() => setLiveThoughts(!liveThoughts)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                liveThoughts ? 'bg-primary-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={liveThoughts}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  liveThoughts ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Manual Background Style Picker */}
          <div>
            <h4 className="font-bold text-sm text-text dark:text-white mb-2.5">
              Current Background Style (Click to Preview)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {allStyles.map((style) => {
                const isSelected = activeBgStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => setActiveBgStyle(style.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-200 ${
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
                    <p className="text-[10px] text-text-muted dark:text-slate-400 line-clamp-1 mt-0.5">
                      {style.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 7. Reset to Default Settings */}
          <div className="pt-4 border-t border-primary-100 dark:border-purple-900/40 flex items-center justify-between">
            <button
              onClick={resetDefaults}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <HiOutlineArrowPathRoundedSquare className="w-4 h-4" />
              Reset to Default Settings
            </button>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="btn-primary text-xs sm:text-sm px-6 py-2.5"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
