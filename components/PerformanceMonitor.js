/*******************************
 * 性能监控组件
 *******************************/

import { useEffect, useState } from 'react'

// Web Vitals 监控
const useWebVitals = () => {
  const [vitals, setVitals] = useState({
    CLS: null,
    FID: null,
    LCP: null,
    FCP: null,
    TTFB: null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    let clsEntries = []

    const updateCLS = (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          clsEntries.push(entry)
        }
      })
      setVitals(prev => ({ ...prev, CLS: clsValue }))
    }

    // FID (First Input Delay)
    const updateFID = (entries) => {
      const firstEntry = entries[0]
      setVitals(prev => ({ ...prev, FID: firstEntry.processingStart - firstEntry.startTime }))
    }

    // LCP (Largest Contentful Paint)
    const updateLCP = (entries) => {
      const lastEntry = entries[entries.length - 1]
      setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }))
    }

    // FCP (First Contentful Paint)
    const updateFCP = (entries) => {
      const firstEntry = entries[0]
      setVitals(prev => ({ ...prev, FCP: firstEntry.startTime }))
    }

    // TTFB (Time to First Byte)
    const updateTTFB = () => {
      const { responseStart, requestStart } = performance.timing
      setVitals(prev => ({ ...prev, TTFB: responseStart - requestStart }))
    }

    // 设置观察者
    const clsObserver = new PerformanceObserver((list) => updateCLS(list.getEntries()))
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    const fidObserver = new PerformanceObserver((list) => updateFID(list.getEntries()))
    fidObserver.observe({ entryTypes: ['first-input'] })

    const lcpObserver = new PerformanceObserver((list) => updateLCP(list.getEntries()))
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    const fcpObserver = new PerformanceObserver((list) => updateFCP(list.getEntries()))
    fcpObserver.observe({ entryTypes: ['paint'] })

    // 监听 load 事件以获取 TTFB
    window.addEventListener('load', updateTTFB)

    return () => {
      clsObserver.disconnect()
      fidObserver.disconnect()
      lcpObserver.disconnect()
      fcpObserver.disconnect()
      window.removeEventListener('load', updateTTFB)
    }
  }, [])

  return vitals
}

// 性能指标展示组件
const PerformanceMetrics = ({ showDetails = false }) => {
  const vitals = useWebVitals()
  const [isVisible, setIsVisible] = useState(false)

  const getRating = (metric, value) => {
    if (value === null) return 'unknown'

    const thresholds = {
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FID: { good: 100, needsImprovement: 300 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatValue = (metric, value) => {
    if (value === null) return '—'

    if (metric === 'CLS') return value.toFixed(3)
    if (['FID', 'LCP', 'FCP', 'TTFB'].includes(metric)) return `${Math.round(value)}ms`
    return value
  }

  if (!showDetails && !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="显示性能指标"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">性能指标</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(vitals).map(([metric, value]) => {
          const rating = getRating(metric, value)
          const colorClass = getRatingColor(rating)

          return (
            <div key={metric} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric}
                </span>
                <span className={cn('px-2 py-1 text-xs rounded-full', colorClass)}>
                  {rating === 'good' ? '良好' : rating === 'needs-improvement' ? '需改进' : rating === 'poor' ? '较差' : '未知'}
                </span>
              </div>
              <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                {formatValue(metric, value)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        * 指标基于 Web Vitals 标准
      </div>
    </div>
  )
}

// 资源加载监控
const useResourceMonitor = () => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateResources = () => {
      const resourceEntries = performance.getEntriesByType('resource')
      const resourceData = resourceEntries.map(entry => ({
        name: entry.name.split('/').pop(),
        type: entry.initiatorType,
        size: entry.transferSize,
        duration: entry.duration,
        startTime: entry.startTime
      }))

      setResources(resourceData)
    }

    // 延迟执行以确保资源加载完成
    setTimeout(updateResources, 3000)

    // 监听新的资源加载
    const observer = new PerformanceObserver((list) => {
      updateResources()
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [])

  return resources
}

// 内存使用监控
const useMemoryMonitor = () => {
  const [memory, setMemory] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !performance.memory) return

    const updateMemory = () => {
      setMemory({
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      })
    }

    updateMemory()
    const interval = setInterval(updateMemory, 5000)

    return () => clearInterval(interval)
  }, [])

  return memory
}

// 性能优化建议
const PerformanceSuggestions = ({ vitals }) => {
  const suggestions = []

  if (vitals.LCP > 2500) {
    suggestions.push({
      type: 'LCP',
      message: 'LCP 较慢，考虑优化图片加载或使用 CDN',
      priority: 'high'
    })
  }

  if (vitals.FID > 100) {
    suggestions.push({
      type: 'FID',
      message: 'FID 较慢，考虑减少主线程阻塞时间',
      priority: 'medium'
    })
  }

  if (vitals.CLS > 0.1) {
    suggestions.push({
      type: 'CLS',
      message: 'CLS 较高，考虑为图片和广告预留空间',
      priority: 'medium'
    })
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-800 dark:text-green-200">性能表现良好！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={cn(
            'border rounded-lg p-4',
            suggestion.priority === 'high'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
              suggestion.priority === 'high'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            )}>
              <span className={cn(
                'text-sm font-semibold',
                suggestion.priority === 'high'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              )}>
                {suggestion.type}
              </span>
            </div>
            <p className={cn(
              'text-sm',
              suggestion.priority === 'high'
                ? 'text-red-700 dark:text-red-300'
                : 'text-yellow-700 dark:text-yellow-300'
            )}>
              {suggestion.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 主性能监控组件
const PerformanceMonitor = ({
  showMetrics = true,
  showSuggestions = true,
  showResources = false
}) => {
  const vitals = useWebVitals()
  const resources = useResourceMonitor()
  const memory = useMemoryMonitor()

  if (process.env.NODE_ENV === 'production') {
    return null // 生产环境不显示性能监控
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-4 max-w-sm">
      {showMetrics && <PerformanceMetrics />}
      {showSuggestions && <PerformanceSuggestions vitals={vitals} />}

      {showResources && resources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">资源加载</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {resources.slice(0, 5).map((resource, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {resource.name}
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {Math.round(resource.duration)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {memory && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">内存使用</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">已使用</span>
              <span className="text-gray-900 dark:text-gray-100">{memory.used} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">总大小</span>
              <span className="text-gray-900 dark:text-gray-100">{memory.total} MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { PerformanceMonitor, useWebVitals, useResourceMonitor, useMemoryMonitor }

export default PerformanceMonitor

// 添加 cn 导入
import cn from 'classnames'
import React from 'react'