/**
 * Reading Progress Component
 * Tracks and displays article reading progress
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReadingProgressProps {
  className?: string
  showIndicator?: boolean
  indicatorPosition?: 'right' | 'left'
  indicatorSize?: 'sm' | 'md' | 'lg'
  onProgressChange?: (progress: number) => void
}

/**
 * ReadingProgress - Main reading progress component
 * Displays top progress bar and optional side circular indicator
 *
 * @example
 * <ReadingProgress onProgressChange={(p) => console.log(`${p}% complete`)} />
 *
 * <ReadingProgress showIndicator indicatorPosition="right" indicatorSize="lg" />
 */
export function ReadingProgress({
  className = '',
  showIndicator = true,
  indicatorPosition = 'right',
  indicatorSize = 'md',
  onProgressChange
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (scrollTop / docHeight) * 100

      const clampedProgress = Math.min(Math.max(scrolled, 0), 100)
      setProgress(clampedProgress)

      if (onProgressChange) {
        onProgressChange(clampedProgress)
      }
    }

    // Initial calculation
    updateProgress()

    // Listen to scroll events (throttled)
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onProgressChange])

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className={cn(
          'fixed top-0 left-0 right-0 h-1 z-50',
          'bg-transparent',
          className
        )}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-secondary to-accent"
          style={{ scaleX: progress / 100, transformOrigin: '0 50%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Side circular indicator */}
      <AnimatePresence>
        {showIndicator && (
          <CircularIndicator
            progress={progress}
            position={indicatorPosition}
            size={indicatorSize}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * CircularIndicator - Circular progress indicator (sticky)
 */
interface CircularIndicatorProps {
  progress: number
  position?: 'right' | 'left'
  size?: 'sm' | 'md' | 'lg'
}

function CircularIndicator({
  progress,
  position = 'right',
  size = 'md'
}: CircularIndicatorProps) {
  const sizes = {
    sm: { width: 40, stroke: 3, offset: 18 },
    md: { width: 60, stroke: 4, offset: 25 },
    lg: { width: 80, stroke: 5, offset: 35 }
  }

  const { width, stroke, offset } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = 2 * Math.PI * radius

  const positionClasses = {
    right: 'right-4',
    left: 'left-4'
  }

  return (
    <motion.div
      className={cn(
        'hidden md:block fixed top-1/2 -translate-y-1/2 z-40',
        positionClasses[position]
      )}
      initial={{ opacity: 0, x: position === 'right' ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: position === 'right' ? 30 : -30 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted"
          opacity={0.2}
        />

        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{
            strokeDashoffset: circumference * (1 - progress / 100)
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" className="text-accent" />
            <stop offset="100%" stopColor="currentColor" className="text-secondary" />
          </linearGradient>
        </defs>
      </svg>

      {/* Progress text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 90 }} // Counter-rotate to make text readable
        transition={{ duration: 0 }}
      >
        <span className={cn('font-bold text-foreground', size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base')}>
          {Math.round(progress)}%
        </span>
      </motion.div>
    </motion.div>
  )
}

/**
 * ScrollSpy integration for TOC
 */
interface UseScrollSpyParams {
  ids: string[]
  offset?: number
  threshold?: number
}

export function useScrollSpy({
  ids,
  offset = 100,
  threshold = 0.2
}: UseScrollSpyParams) {
  const [activeId, setActiveId] = useState<string>(ids[0] || '')

  useEffect(() => {
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as Element[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: [threshold]
      }
    )

    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
      observer.disconnect()
    }
  }, [ids, offset, threshold])

  return activeId
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(id: string, offset = 80) {
  const element = document.getElementById(id)
  if (!element) return

  const elementTop = element.getBoundingClientRect().top + window.pageYOffset
  const scrollTo = elementTop - offset

  window.scrollTo({
    top: scrollTo,
    behavior: 'smooth'
  })
}

// Utility for className concatenation
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default ReadingProgress
