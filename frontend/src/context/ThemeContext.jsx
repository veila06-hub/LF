import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

// Curated premium accent palettes (gradient start -> end).
export const PRESETS = [
  { key: 'indigo', name: 'Indigo', from: '#6366f1', to: '#8b5cf6' },
  { key: 'aurora', name: 'Aurora', from: '#7c3aed', to: '#ec4899' },
  { key: 'emerald', name: 'Emerald', from: '#059669', to: '#06b6d4' },
  { key: 'sunset', name: 'Sunset', from: '#f59e0b', to: '#ef4444' },
  { key: 'ocean', name: 'Ocean', from: '#0ea5e9', to: '#6366f1' },
  { key: 'rose', name: 'Rose', from: '#f43f5e', to: '#fb7185' },
  { key: 'gold', name: 'Royal Gold', from: '#d97706', to: '#facc15' },
  { key: 'slate', name: 'Graphite', from: '#475569', to: '#0ea5e9' },
]

function hexToRgbTriplet(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(full, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `${r} ${g} ${b}`
}

function applyAccent({ from, to }) {
  const root = document.documentElement
  root.style.setProperty('--accent', from)
  root.style.setProperty('--accent-2', to)
  root.style.setProperty('--accent-rgb', hexToRgbTriplet(from))
  root.style.setProperty('--accent-2-rgb', hexToRgbTriplet(to))
}

function loadInitialAccent() {
  try {
    const saved = JSON.parse(localStorage.getItem('accent') || 'null')
    if (saved?.from && saved?.to) return saved
  } catch {
    /* ignore */
  }
  return { ...PRESETS[0] }
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true // premium-first: default dark
  })
  const [accent, setAccent] = useState(loadInitialAccent)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    applyAccent(accent)
    localStorage.setItem('accent', JSON.stringify(accent))
  }, [accent])

  const value = useMemo(
    () => ({
      dark,
      toggleTheme: () => setDark((p) => !p),
      setDark,
      accent,
      presets: PRESETS,
      // accept a preset object or a custom {from,to}
      setAccent: (next) => setAccent({ from: next.from, to: next.to, key: next.key || 'custom', name: next.name || 'Custom' }),
      setCustomAccent: (from, to) =>
        setAccent({ from, to: to || from, key: 'custom', name: 'Custom' }),
    }),
    [dark, accent]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
