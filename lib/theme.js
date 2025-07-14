import { createContext, useContext, useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/lib/config'

const ThemeContext = createContext({ 
  dark: true, 
  toggleTheme: () => {},
  isAutoMode: false,
  manualTheme: null 
})

export function ThemeProvider ({ children }) {
  const { appearance } = useConfig()
  const isAutoMode = appearance === 'auto'
  
  // `defaultState` should normally be a boolean. But it causes initial loading flashes in slow
  // rendering. Setting it to `null` so that we can differentiate the initial loading phase
  const prefersDark = useMedia('(prefers-color-scheme: dark)', null)
  
  // State for manual theme override in auto mode
  const [manualTheme, setManualTheme] = useState(null)

  // Load saved theme preference from localStorage
  useEffect(() => {
    if (isAutoMode) {
      const savedTheme = localStorage.getItem('theme-preference')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setManualTheme(savedTheme)
      }
    }
  }, [isAutoMode])

  // Save theme preference to localStorage
  const updateManualTheme = (theme) => {
    setManualTheme(theme)
    if (theme === null) {
      localStorage.removeItem('theme-preference')
    } else {
      localStorage.setItem('theme-preference', theme)
    }
  }
  
  // Determine actual dark mode state
  let dark
  if (appearance === 'dark') {
    dark = true
  } else if (appearance === 'light') {
    dark = false
  } else {
    // auto mode
    if (manualTheme !== null) {
      dark = manualTheme === 'dark'
    } else {
      dark = prefersDark
    }
  }

  const toggleTheme = () => {
    if (isAutoMode) {
      // In auto mode, cycle through: auto -> light -> dark -> auto
      if (manualTheme === null) {
        updateManualTheme('light')
      } else if (manualTheme === 'light') {
        updateManualTheme('dark')
      } else {
        updateManualTheme(null) // back to auto
      }
    }
  }

  useEffect(() => {
    // Only decide color scheme after initial loading, i.e. when `dark` is really representing a
    // media query result
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ 
      dark, 
      toggleTheme, 
      isAutoMode, 
      manualTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme () {
  return useContext(ThemeContext)
}
