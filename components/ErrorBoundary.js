/*******************************
 * 错误边界组件
 *******************************/

import React, { Component } from 'react'
import Link from 'next/link'
import cn from 'classnames'

// 错误边界类组件
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isReporting: false
    }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给错误监控服务
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // 发送到错误监控服务
    this.reportError(error, errorInfo)
  }

  reportError = async (error, errorInfo) => {
    if (this.state.isReporting) return

    this.setState({ isReporting: true })

    try {
      // 发送到 Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `${error.toString()} \n${errorInfo?.componentStack || ''}`,
          fatal: true
        })
      }

      // 发送到自定义错误监控服务
      if (process.env.NEXT_PUBLIC_ERROR_REPORTING_URL) {
        await fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: error.toString(),
            errorInfo: errorInfo?.componentStack,
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    } finally {
      this.setState({ isReporting: false })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, isReporting } = this.state
      const { fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props

      if (fallback) {
        return fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="text-center">
              {/* 错误图标 */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* 错误标题 */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                页面出现错误
              </h2>

              {/* 错误描述 */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                很抱歉，页面加载时遇到了问题。请尝试刷新页面或返回首页。
              </p>

              {/* 错误详情（开发环境） */}
              {showDetails && error && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    错误详情：
                  </h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono space-y-1">
                    <p><strong>错误类型：</strong> {error.name}</p>
                    <p><strong>错误信息：</strong> {error.message}</p>
                    {errorInfo?.componentStack && (
                      <div>
                        <p><strong>组件栈：</strong></p>
                        <pre className="mt-1 text-xs overflow-auto max-h-32">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  disabled={isReporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  刷新页面
                </button>

                <button
                  onClick={this.handleReset}
                  disabled={isReporting}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  重试
                </button>

                <Link
                  href="/"
                  className={cn(
                    'inline-flex items-center justify-center',
                    'px-4 py-2 text-sm font-medium rounded-md',
                    'text-gray-700 bg-gray-100 hover:bg-gray-200',
                    'dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
                    'transition-colors duration-200'
                  )}
                >
                  返回首页
                </Link>
              </div>

              {/* 报告状态 */}
              {isReporting && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    正在报告错误...
                  </p>
                </div>
              )}

              {/* 用户提示 */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  此错误已自动报告给我们的技术团队
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 全局错误处理器
const setupGlobalErrorHandler = () => {
  if (typeof window === 'undefined') return

  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)

    // 发送到分析服务
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `Unhandled promise rejection: ${event.reason}`,
        fatal: false
      })
    }
  })

  // 处理资源加载错误
  window.addEventListener('error', (event) => {
    if (event.filename) {
      console.error('Resource loading error:', event.message, event.filename)

      // 发送到分析服务
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `Resource error: ${event.message} at ${event.filename}:${event.lineno}`,
          fatal: false
        })
      }
    }
  }, true)
}

// 错误恢复工具
const ErrorRecovery = {
  // 清除缓存
  clearCache: () => {
    if (typeof window !== 'undefined') {
      // 清除 localStorage
      localStorage.clear()

      // 清除 sessionStorage
      sessionStorage.clear()

      // 清除 Service Worker 缓存
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name)
          })
        })
      }
    }
  },

  // 重置应用状态
  resetApp: () => {
    ErrorRecovery.clearCache()
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  },

  // 检查浏览器兼容性
  checkCompatibility: () => {
    const issues = []

    // 检查 WebP 支持
    if (!document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      issues.push('WebP images are not supported')
    }

    // 检查 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      issues.push('Intersection Observer is not supported')
    }

    // 检查 Resize Observer
    if (!('ResizeObserver' in window)) {
      issues.push('Resize Observer is not supported')
    }

    return issues
  }
}

// 错误监控 Hook
const useErrorMonitor = (componentName) => {
  const logError = (error, errorInfo = {}) => {
    console.error(`[${componentName}] Error:`, error, errorInfo)

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `[${componentName}] ${error.toString()}`,
        fatal: false
      })
    }
  }

  const logWarning = (message, data = {}) => {
    console.warn(`[${componentName}] Warning:`, message, data)
  }

  return { logError, logWarning }
}

export { ErrorBoundary, setupGlobalErrorHandler, ErrorRecovery, useErrorMonitor }

export default ErrorBoundary

// 初始化全局错误处理器
if (typeof window !== 'undefined') {
  setupGlobalErrorHandler()
}