/**
 * Web Vitals Provider
 * Real User Monitoring component for tracking Core Web Vitals
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Metric } from 'web-vitals'
import {
  onCLS,
  onFCP,
  onFID,
  onINP,
  onLCP,
  onTTFB,
} from 'web-vitals'
import { reportWebVitals, PerformanceMetrics, getMetricRating } from '@/lib/performance'

// Configuration
export interface WebVitalsConfig {
  enabled: boolean
  analyticsEndpoint?: string
  analyticsId?: string
  debug?: boolean
  onMetric?: (metric: Metric) => void
}

// Context state
interface WebVitalsContextState {
  metrics: Partial<PerformanceMetrics>
  isMonitoring: boolean
  config: WebVitalsConfig
}

const WebVitalsContext = createContext<WebVitalsContextState | null>(null)

interface WebVitalsProviderProps {
  children: React.ReactNode
  config?: Partial<WebVitalsConfig>
}

/**
 * Web Vitals Provider - Tracks and reports Core Web Vitals
 */
export function WebVitalsProvider({ children, config = {} }: WebVitalsProviderProps) {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isMonitoring, setIsMonitoring] = useState(false)

  const finalConfig: WebVitalsConfig = {
    enabled: true,
    debug: false,
    ...config,
  }

  useEffect(() => {
    if (!finalConfig.enabled || typeof window === 'undefined') return

    // Check if in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      console.log('📊 Web Vitals: Monitoring enabled in development mode')
    }

    // Handler for all metrics
    const handleMetric = (metric: Metric) => {
      // Update state
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value,
      }))

      // Log to console in debug mode
      if (finalConfig.debug) {
        const rating = getMetricRating(
          metric.name as keyof typeof metrics,
          metric.value
        )
        console.log(
          `📊 Web Vitals: ${metric.name} = ${
            metric.value
          }ms (${rating})`
        )
      }

      // Report to analytics
      if (finalConfig.analyticsEndpoint) {
        reportWebVitals(metric, {
          enabled: finalConfig.enabled,
          endpoint: finalConfig.analyticsEndpoint,
          debug: finalConfig.debug,
        })
      }

      // Call custom handler
      if (finalConfig.onMetric) {
        finalConfig.onMetric(metric)
      }
    }

    // Start monitoring
    setIsMonitoring(true)

    // Subscribe to all Core Web Vitals
    const listeners: Array<(() => void) | void> = [
      onCLS(handleMetric),
      onFCP(handleMetric),
      onFID(handleMetric),
      onINP(handleMetric),
      onLCP(handleMetric),
      onTTFB(handleMetric),
    ]

    // Also log Page Load Time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      if (finalConfig.debug) {
        console.log(`📊 Web Vitals: Page Load = ${loadTime}ms`)
      }
    })

    return () => {
      // Cleanup listeners
      listeners.forEach(listener => {
        if (typeof listener === 'function') {
          listener()
        }
      })
      setIsMonitoring(false)
    }
  }, [finalConfig])

  const value: WebVitalsContextState = {
    metrics,
    isMonitoring,
    config: finalConfig,
  }

  return (
    <WebVitalsContext.Provider value={value}>
      {children}
    </WebVitalsContext.Provider>
  )
}

/**
 * Hook to access Web Vitals metrics
 */
export function useWebVitals() {
  const context = useContext(WebVitalsContext)

  if (!context) {
    throw new Error('useWebVitals must be used within a WebVitalsProvider')
  }

  return context
}

/**
 * Performance Monitor - Shows current Web Vitals (dev only)
 */
export function PerformanceMonitor() {
  const { metrics, isMonitoring, config } = useWebVitals()

  // Only show in development and debug mode
  if (process.env.NODE_ENV !== 'development' || !config.debug) {
    return null
  }

  return (
    <div className="performance-monitor fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border bg-card p-4 shadow-lg">
      <h3 className="mb-2 text-sm font-semibold">Web Vitals</h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getMetricClass(metrics.LCP, 'LCP')}>
            {metrics.LCP ? `${metrics.LCP}ms` : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getMetricClass(metrics.FID, 'FID')}>
            {metrics.FID ? `${metrics.FID}ms` : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getMetricClass(metrics.CLS, 'CLS')}>
            {metrics.CLS ? metrics.CLS.toFixed(4) : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getMetricClass(metrics.FCP, 'FCP')}>
            {metrics.FCP ? `${metrics.FCP}ms` : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getMetricClass(metrics.TTFB, 'TTFB')}>
            {metrics.TTFB ? `${metrics.TTFB}ms` : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>INP:</span>
          <span className={getMetricClass(metrics.INP, 'INP')}>
            {metrics.INP ? `${metrics.INP}ms` : '-'}
          </span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Monitoring: {isMonitoring ? '✅ Active' : '❌ Inactive'}
      </div>
    </div>
  )
}

function getMetricClass(value: number | null | undefined, metric: keyof PerformanceMetrics): string {
  if (value === null || value === undefined) {
    return 'text-gray-500'
  }

  const rating = getMetricRating(metric, value)

  if (rating === 'good') return 'text-green-600'
  if (rating === 'needs-improvement') return 'text-yellow-600'
  return 'text-red-600'
}

export default {
  WebVitalsProvider,
  useWebVitals,
  PerformanceMonitor,
}
