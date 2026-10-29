import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const SETTINGS_STORAGE_KEY = 'careerai_theme_settings_v1'

export const BACKGROUND_STYLES = [
  {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    category: 'dark',
    description: 'Realistic-inspired deep cosmic galaxy with drifting & twinkling stars',
    badge: 'Dark',
    accentColor: '#7047EB',
  },
  {
    id: 'aurora',
    name: 'Liquid Aurora',
    category: 'dark',
    description: 'Vibrant purple & violet liquid aurora waves floating through space',
    badge: 'Dark',
    accentColor: '#9367EB',
  },
  {
    id: 'ai_network',
    name: 'AI Neural Network',
    category: 'dark',
    description: 'Connected neural nodes with dynamic data pulses and synaptic lines',
    badge: 'Dark',
    accentColor: '#C8B8FF',
  },
  {
    id: 'lavender_pastel',
    name: 'Lavender Pastel',
    category: 'light',
    description: 'Soft lavender, lilac, and gentle pastel gradient meshes flowing smoothly',
    badge: 'Light',
    accentColor: '#DDD4FF',
  },
  {
    id: 'peach_cream',
    name: 'Peach & Cream',
    category: 'light',
    description: 'Radiant warm peach, amber, and whipped cream gradient flows',
    badge: 'Light',
    accentColor: '#FFB38A',
  },
  {
    id: 'glassmorphism',
    name: 'Light Glassmorphism',
    category: 'light',
    description: 'Soft white-purple refractive glass orbs and luminous blur layers',
    badge: 'Light',
    accentColor: '#E4D9FA',
  },
  {
    id: 'floating_shapes',
    name: '3D Floating Shapes',
    category: 'light',
    description: 'Abstract 3D-inspired geometric cubes, prisms, and isometric floaters',
    badge: 'Light',
    accentColor: '#FFC3A0',
  },
]

const DEFAULT_SETTINGS = {
  darkMode: false,
  liveBg: true,
  autoChange: true,
  bgThemeMode: 'both', // 'dark' | 'light' | 'both'
  bgInterval: 20,      // 20 | 30 | 60 seconds
  activeBgStyle: 'galaxy',
  liveThoughts: true,
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage', e)
    }
    return DEFAULT_SETTINGS
  })

  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const lastThemeCategoryRef = useRef('dark')

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.warn('Could not save settings to localStorage', e)
    }
  }, [settings])

  // Sync Tailwind .dark class to <html> element
  useEffect(() => {
    const root = document.documentElement
    if (settings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.darkMode])

  // Select next background based on bgThemeMode ('dark', 'light', 'both')
  const cycleNextBackground = useCallback(() => {
    setSettings((prev) => {
      const { bgThemeMode, activeBgStyle } = prev
      let pool = BACKGROUND_STYLES

      if (bgThemeMode === 'dark') {
        pool = BACKGROUND_STYLES.filter((s) => s.category === 'dark')
      } else if (bgThemeMode === 'light') {
        pool = BACKGROUND_STYLES.filter((s) => s.category === 'light')
      } else {
        // 'both': alternate between dark and light
        const targetCategory = lastThemeCategoryRef.current === 'dark' ? 'light' : 'dark'
        lastThemeCategoryRef.current = targetCategory
        pool = BACKGROUND_STYLES.filter((s) => s.category === targetCategory)
      }

      if (pool.length === 0) pool = BACKGROUND_STYLES

      // Pick next style in the filtered pool
      const currentIndex = pool.findIndex((s) => s.id === activeBgStyle)
      const nextIndex = (currentIndex + 1) % pool.length
      const nextStyle = pool[nextIndex]

      return {
        ...prev,
        activeBgStyle: nextStyle.id,
      }
    })
  }, [])

  // Auto-change timer
  useEffect(() => {
    if (!settings.autoChange) return

    const intervalMs = (settings.bgInterval || 20) * 1000
    const timer = setInterval(() => {
      // Don't change if tab is hidden
      if (document.hidden) return
      cycleNextBackground()
    }, intervalMs)

    return () => clearInterval(timer)
  }, [settings.autoChange, settings.bgInterval, cycleNextBackground])

  // Context updater helpers
  const setDarkMode = (val) => setSettings((s) => ({ ...s, darkMode: typeof val === 'function' ? val(s.darkMode) : val }))
  const setLiveBg = (val) => setSettings((s) => ({ ...s, liveBg: typeof val === 'function' ? val(s.liveBg) : val }))
  const setAutoChange = (val) => setSettings((s) => ({ ...s, autoChange: typeof val === 'function' ? val(s.autoChange) : val }))
  const setBgThemeMode = (val) => {
    setSettings((s) => {
      let newStyle = s.activeBgStyle
      if (val === 'dark') {
        const darkStyles = BACKGROUND_STYLES.filter((b) => b.category === 'dark')
        if (!darkStyles.some((b) => b.id === s.activeBgStyle)) {
          newStyle = darkStyles[0].id
        }
      } else if (val === 'light') {
        const lightStyles = BACKGROUND_STYLES.filter((b) => b.category === 'light')
        if (!lightStyles.some((b) => b.id === s.activeBgStyle)) {
          newStyle = lightStyles[0].id
        }
      }
      return { ...s, bgThemeMode: val, activeBgStyle: newStyle }
    })
  }
  const setBgInterval = (val) => setSettings((s) => ({ ...s, bgInterval: Number(val) }))
  const setActiveBgStyle = (id) => setSettings((s) => ({ ...s, activeBgStyle: id }))
  const setLiveThoughts = (val) => setSettings((s) => ({ ...s, liveThoughts: typeof val === 'function' ? val(s.liveThoughts) : val }))

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    lastThemeCategoryRef.current = 'dark'
  }

  const value = {
    ...settings,
    setDarkMode,
    setLiveBg,
    setAutoChange,
    setBgThemeMode,
    setBgInterval,
    setActiveBgStyle,
    setLiveThoughts,
    resetDefaults,
    settingsModalOpen,
    setSettingsModalOpen,
    cycleNextBackground,
    allStyles: BACKGROUND_STYLES,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
