/**
 * Web Vitals Performance Monitoring
 * Real User Monitoring (RUM) for Core Web Vitals
 */

import type { Metric } from 'web-vitals'

// Web Vitals metric types
export interface PerformanceMetrics {
  LCP: number | null
  FID: number | null
  CLS: number | null
  FCP: number | null
  TTFB: number | null
  INP: number | null
}

// Reporting configuration
export interface PerformanceConfig {
  enabled: boolean
  endpoint?: string
  analyticsId?: string
  debug?: boolean
}

// Metric thresholds (good / needs improvement / poor)
export const WEB_VITALS_THRESHOLD = {
  LCP: {
    good: 2500,     // < 2.5s
    needsImprovement: 4000,  // 2.5s - 4s
    poor: 4000      // > 4s
  },
  FID: {
    good: 100,      // < 100ms
    needsImprovement: 300,   // 100ms - 300ms
    poor: 300       // > 300ms
  },
  CLS: {
    good: 0.1,      // < 0.1
    needsImprovement: 0.25,  // 0.1 - 0.25
    poor: 0.25      // > 0.25
  },
  FCP: {
    good: 1800,     // < 1.8s
    needsImprovement: 3000,  // 1.8s - 3s
    poor: 3000      // > 3s
  },
  TTFB: {
    good: 800,      // < 800ms
    needsImprovement: 1800,  // 800ms - 1.8s
    poor: 1800      // > 1.8s
  },
  INP: {
    good: 200,      // < 200ms
    needsImprovement: 500,   // 200ms - 500ms
    poor: 500       // > 500ms
  }
}

/**
 * Get metric rating based on value
 */
export function getMetricRating(metric: keyof typeof WEB_VITALS_THRESHOLD, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = WEB_VITALS_THRESHOLD[metric]

  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Report metrics to analytics endpoint
 */
export async function reportWebVitals(metric: Metric, config: PerformanceConfig): Promise<void> {
  if (!config.enabled || !config.endpoint) return

  const metricData = {
    name: metric.name,
    value: metric.value,
    rating: getMetricRating(metric.name as keyof typeof WEB_VITALS_THRESHOLD, metric.value),
    delta: metric.delta,
    entries: metric.entries,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    analyticsId: config.analyticsId,
  }

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metricData),
    })

    if (!response.ok) {
      throw new Error(`Failed to report metric: ${response.status}`)
    }

    if (config.debug) {
      console.log(`📊 Web Vitals: ${metric.name} = ${metric.value}ms (${metricData.rating})`)
    }
  } catch (error) {
    console.warn('Failed to report Web Vitals:', error)

    // Fallback: log to console in debug mode
    if (config.debug) {
      console.log('📊 Web Vitals (local):', metricData)
    }
  }
}

/**
 * Measure custom performance events
 */
export interface CustomPerformanceEvent {
  name: string
  startTime: number
  duration: number
  metadata?: Record<string, any>
}

export function measureEvent(name: string, fn: () => void): CustomPerformanceEvent {
  const startTime = performance.now()
  fn()
  const endTime = performance.now()

  return {
    name,
    startTime,
    duration: endTime - startTime,
  }
}

/**
 * Measure async performance events
 */
export async function measureAsyncEvent<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; event: CustomPerformanceEvent }> {
  const startTime = performance.now()
  const result = await fn()
  const endTime = performance.now()

  return {
    result,
    event: {
      name,
      startTime,
      duration: endTime - startTime,
    },
  }
}

/**
 * Collect all performance metrics
 */
export async function collectPerformanceMetrics(): Promise<{
  webVitals: Partial<PerformanceMetrics>
  resources: PerformanceEntry[]
  navigation: PerformanceNavigationTiming | undefined
}> {
  const metrics: Partial<PerformanceMetrics> = {}

  // Web Vitals will be collected by the metrics collectors
  // These are placeholders populated by web-vitals library

  // Resource timing
  const resources = performance.getEntriesByType('resource')

  // Navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

  return {
    webVitals: metrics,
    resources: Array.from(resources),
    navigation,
  }
}

/**
 * Create performance budget checker
 */
export interface PerformanceBudget {
  LCP: number
  FID: number
  CLS: number
  FCP: number
  TTFB: number
  resources: {
    css: number
    js: number
    images: number
    total: number
  }
}

export function checkPerformanceBudget(
  metrics: Partial<PerformanceMetrics>,
  budget: PerformanceBudget
): { passed: boolean; violations: string[] } {
  const violations: string[] = []

  if (metrics.LCP && metrics.LCP > budget.LCP) {
    violations.push(`LCP: ${metrics.LCP}ms (budget: ${budget.LCP}ms)`)
  }
  if (metrics.FID && metrics.FID > budget.FID) {
    violations.push(`FID: ${metrics.FID}ms (budget: ${budget.FID}ms)`)
  }
  if (metrics.CLS && metrics.CLS > budget.CLS) {
    violations.push(`CLS: ${metrics.CLS} (budget: ${budget.CLS})`)
  }
  if (metrics.FCP && metrics.FCP > budget.FCP) {
    violations.push(`FCP: ${metrics.FCP}ms (budget: ${budget.FCP}ms)`)
  }
  if (metrics.TTFB && metrics.TTFB > budget.TTFB) {
    violations.push(`TTFB: ${metrics.TTFB}ms (budget: ${budget.TTFB}ms)`)
  }

  return {
    passed: violations.length === 0,
    violations,
  }
}

export default {
  WEB_VITALS_THRESHOLD,
  getMetricRating,
  reportWebVitals,
  measureEvent,
  measureAsyncEvent,
  collectPerformanceMetrics,
  checkPerformanceBudget,
}
