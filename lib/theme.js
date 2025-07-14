import { createContext, useContext, useEffect, useState } from 'react'
import { useConfig } from '@/lib/config'

const ThemeContext = createContext({ 
  dark: true, 
  toggleTheme: () => {}
})

export function ThemeProvider ({ children }) {
  const { appearance } = useConfig()
  
  // Determine initial theme based on config
  const [dark, setDark] = useState(() => {
    if (appearance === 'dark') return true
    if (appearance === 'light') return false
    // Default to dark if config is auto
    return true
  })

  // Load saved theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setDark(savedTheme === 'dark')
    } else if (appearance === 'light' || appearance === 'dark') {
      // Use config if no saved preference
      setDark(appearance === 'dark')
    }
  }, [appearance])

  const toggleTheme = () => {
    const newDark = !dark
    setDark(newDark)
    localStorage.setItem('theme-preference', newDark ? 'dark' : 'light')
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.remove('color-scheme-unset')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ 
      dark, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme () {
  return useContext(ThemeContext)
}
