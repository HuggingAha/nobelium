/**
 * Reading Preferences Component
 * Personalized reading experience settings with localStorage persistence
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, GlassButton } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'auto'
type FontFamily = 'inter' | 'serif' | 'mono' | 'system'
type ContentWidth = 'narrow' | 'normal' | 'wide' | 'full'

export interface ReadingPrefs {
  fontSize: number
  lineHeight: number
  fontFamily: FontFamily
  contentWidth: ContentWidth
  theme: Theme
  showProgress: boolean
  showLineNumbers: boolean
  reduceMotion: boolean
}

export const defaultPrefs: ReadingPrefs = {
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: 'inter',
  contentWidth: 'normal',
  theme: 'auto',
  showProgress: true,
  showLineNumbers: false,
  reduceMotion: false
}

// Font family styles
const fontFamilyStyles: Record<FontFamily, string> = {
  inter: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  system: "font-system"
}

// Content width styles
const contentWidthStyles: Record<ContentWidth, string> = {
  narrow: "max-w-2xl mx-auto",
  normal: "max-w-3xl mx-auto",
  wide: "max-w-5xl mx-auto",
  full: "max-w-full"
}

/**
 * useReadingPrefs - Hook for managing reading preferences with persistence
 */
export function useReadingPrefs(
  initialPrefs: ReadingPrefs = defaultPrefs
): [ReadingPrefs, (prefs: Partial<ReadingPrefs>) => void] {
  const key = "reading-preferences-v1"

  const [prefs, setPrefs] = useState<ReadingPrefs>(() => {
    if (typeof window === "undefined") return initialPrefs

    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        return { ...initialPrefs, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.warn("Failed to load preferences:", e)
    }
    return initialPrefs
  })

  const applyPrefs = (newPrefs: Partial<ReadingPrefs>) => {
    const updated = { ...prefs, ...newPrefs }
    setPrefs(updated)

    try {
      localStorage.setItem(key, JSON.stringify(updated))
    } catch (e) {
      console.warn("Failed to save preferences:", e)
    }
  }

  // Apply preferences to document on mount and updates
  useEffect(() => {
    if (typeof document === "undefined") return

    const { fontSize, lineHeight, fontFamily, contentWidth, theme, reduceMotion } = prefs
    const root = document.documentElement

    // Font settings
    root.style.setProperty("--reading-font-size", `${fontSize}px`)
    root.style.setProperty("--reading-line-height", String(lineHeight))
    root.classList.toggle("font-sans", fontFamily === "inter")
    root.classList.toggle("font-serif", fontFamily === "serif")
    root.classList.toggle("font-mono", fontFamily === "mono")

    // Width settings
    Object.values(contentWidthStyles).forEach(cls => {
      root.classList.remove(...cls.split(' '))
    })
    root.classList.add(...contentWidthStyles[contentWidth].split(' '))

    // Theme settings
    if (theme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.setAttribute("data-theme", isDark ? "dark" : "light")
    } else {
      root.setAttribute("data-theme", theme)
    }

    // Motion settings
    if (reduceMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("reading-prefs-change", {
      detail: prefs
    }))
  }, [prefs])

  return [prefs, applyPrefs]
}

/**
 * ReadingPreferencesPanel - Main preferences UI panel
 */
export interface ReadingPreferencesPanelProps {
  defaultOpen?: boolean
  className?: string
  onClose?: () => void
}

export function ReadingPreferencesPanel({
  defaultOpen = false,
  className = "",
  onClose
}: ReadingPreferencesPanelProps) {
  const [prefs, setPrefs] = useReadingPrefs()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const resetPrefs = () => {
    if (window.confirm("Reset all reading preferences to default?")) {
      setPrefs(defaultPrefs)
    }
  }

  return (
    <>
      {/* Trigger button */}
      {!isOpen && (
        <motion.button
          className="fixed right-4 bottom-4 z-40 p-3 rounded-full bg-accent text-accent-foreground shadow-lg"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          aria-label="Open reading preferences"
        >
          ⚙️
        </motion.button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed right-0 top-0 h-full z-50 md:w-96 w-full",
              "bg-card/95 backdrop-blur-xl border-l border-border",
              className
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between px-6 py-4 border-b border-muted"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold">Reading Preferences</h2>
              <div className="flex gap-2">
                <button
                  onClick={resetPrefs}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                  aria-label="Reset to defaults"
                >
                  ↺
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onClose?.()
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
                  aria-label="Close preferences"
                >
                  ✕
                </button>
              </div>
            </motion.div>

            {/* Content */}
            <div className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-6 space-y-8">
              {/* Typography Section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Typography
                </h3>

                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>Font Size</span>
                    <span className="text-accent font-medium">{prefs.fontSize}px</span>
                  </label>
                  <ProgressSlider
                    value={prefs.fontSize}
                    min={12}
                    max={24}
                    step={1}
                    onChange={val => setPrefs({ fontSize: val })}
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm mb-2">
                    <span>Line Height</span>
                    <span className="text-accent font-medium">{prefs.lineHeight.toFixed(1)}</span>
                  </label>
                  <ProgressSlider
                    value={prefs.lineHeight}
                    min={1.2}
                    max={2.5}
                    step={0.1}
                    formatLabel={val => `${val.toFixed(1)}`}
                    onChange={val => setPrefs({ lineHeight: val })}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-3">Font Family</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: "inter", label: "Inter (Sans)" },
                      { value: "serif", label: "Georgia (Serif)" },
                      { value: "mono", label: "Mono (Code)" },
                      { value: "system", label: "System" }
                    ] as { value: FontFamily; label: string }[]).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPrefs({ fontFamily: value })}
                        className={cn(
                          " px-3 py-2 text-sm rounded-lg text-left border border-muted",
                          "transition-colors",
                          prefs.fontFamily === value
                            ? "bg-accent text-accent-foreground border-accent"
                            : "hover:bg-accent/10"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Layout Section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Layout
                </h3>

                <div>
                  <label className="block text-sm mb-3">Content Width</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: "narrow", label: "Narrow", desc: "~600px" },
                      { value: "normal", label: "Normal", desc: "~700px" },
                      { value: "wide", label: "Wide", desc: "~900px" },
                      { value: "full", label: "Full", desc: "100%" }
                    ] as { value: ContentWidth; label: string; desc: string }[]).map(
                      ({ value, label, desc }) => (
                        <div key={value} className="flex flex-col">
                          <button
                            onClick={() => setPrefs({ contentWidth: value })}
                            className={cn(
                              "px-3 py-2 text-sm rounded-lg border border-muted",
                              "transition-colors text-left",
                              prefs.contentWidth === value
                                ? "bg-accent text-accent-foreground border-accent"
                                : "hover:bg-accent/10"
                            )}
                          >
                            {label}
                          </button>
                          <span className="text-xs text-muted-foreground text-center mt-1">{desc}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Appearance Section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Appearance
                </h3>

                <div>
                  <label className="block text-sm mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "light", label: "☀️ Light" },
                      { value: "dark", label: "🌙 Dark" },
                      { value: "auto", label: "🔄 Auto" }
                    ] as { value: Theme; label: string }[]).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPrefs({ theme: value })}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg border border-muted",
                          "transition-colors",
                          prefs.theme === value
                            ? "bg-accent text-accent-foreground border-accent"
                            : "hover:bg-accent/10"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Features Section */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Features
                </h3>

                <div className="space-y-3">
                  <Toggle
                    checked={prefs.showProgress}
                    onChange={val => setPrefs({ showProgress: val })}
                    label="Show reading progress"
                  />
                  <Toggle
                    checked={prefs.showLineNumbers}
                    onChange={val => setPrefs({ showLineNumbers: val })}
                    label="Show code line numbers"
                  />
                  <Toggle
                    checked={prefs.reduceMotion}
                    onChange={val => setPrefs({ reduceMotion: val })}
                    label="Reduce motion"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * ProgressSlider - Custom slider for numeric values
 */
interface ProgressSliderProps<T extends number> {
  value: T
  min: T
  max: T
  step?: number
  onChange: (value: T) => void
  formatLabel?: (value: T) => string
  displayValue?: (value: T) => string
}

function ProgressSlider<T extends number>({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatLabel,
  displayValue
}: ProgressSliderProps<T>) {
  const percentage = ((value - min) / (max - min)) * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value) as T
    onChange(newValue)
  }

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`
        }}
        aria-label={formatLabel ? formatLabel(value) : String(value)}
      />
    </div>
  )
}

/**
 * Toggle - Toggle switch component
 */
interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-colors",
            checked ? "bg-accent" : "bg-muted"
          )}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </label>
  )
}

/**
 * ReadingPrefsContext - Provider for global preference management
 */
export const ReadingPrefsContext = React.createContext<
  [ReadingPrefs, (prefs: Partial<ReadingPrefs>) => void] | undefined
>(undefined)

export const ReadingPrefsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const value = useReadingPrefs(defaultPrefs)

  // Log changes in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const [prefs, _] = value
    console.log("[Reading Prefs] Current:", prefs)
  }

  return (
    <ReadingPrefsContext.Provider value={value}>
      {children}
    </ReadingPrefsContext.Provider>
  )
}

/**
 * useReadingPrefsContext - Hook to access reading preferences in child components
 */
export function useReadingPrefsContext() {
  const context = React.useContext(ReadingPrefsContext)

  if (!context) {
    throw new Error("useReadingPrefsContext must be used within a ReadingPrefsProvider")
  }

  return context
}

export default {
  ReadingPreferencesPanel,
  useReadingPrefs,
  defaultPrefs,
  ReadingPrefsProvider,
  useReadingPrefsContext
}
