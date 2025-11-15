/**
 * 工具函数库
 * 包含项目中常用的工具函数
 */

/**
 * 合并 className
 * @param inputs - 要合并的 className（字符串、对象、null、undefined）
 * @returns 合并后的 className 字符串
 *
 * @example
 * cn('btn', 'btn-primary') // 'btn btn-primary'
 * cn('btn', { 'btn-primary': true, 'btn-disabled': false }) // 'btn btn-primary'
 * cn('btn', null, undefined, 'btn-primary') // 'btn btn-primary'
 */
export function cn(
  ...inputs: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  const classes: string[] = []

  inputs.forEach(input => {
    // 处理 falsy 值
    if (!input) return

    // 处理字符串
    if (typeof input === 'string') {
      classes.push(input)
      return
    }

    // 处理对象
    if (typeof input === 'object') {
      Object.entries(input).forEach(([className, enabled]) => {
        if (enabled && className) {
          classes.push(className)
        }
      })
    }
  })

  return classes.join(' ')
}

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @param format - 格式（'relative' | 'short' | 'long'）
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  format: 'relative' | 'short' | 'long' = 'relative'
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  // 相对时间
  if (format === 'relative') {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffWeeks = Math.floor(diffMs / 604800000)
    const diffMonths = Math.floor(diffMs / 2592000000)
    const diffYears = Math.floor(diffMs / 31536000000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    if (diffDays < 7) return `${diffDays} 天前`
    if (diffWeeks < 4) return `${diffWeeks} 周前`
    if (diffMonths < 12) return `${diffMonths} 个月前`
    return `${diffYears} 年前`
  }

  // 短格式
  if (format === 'short') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // 长格式
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

/**
 * 计算阅读时间
 * @param content - 文章内容
 * @returns 阅读时间（分钟）
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 250
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * 截断文本
 * @param text - 文本
 * @param limit - 字符限制
 * @param suffix - 后缀
 * @returns 截断后的文本
 */
export function truncate(
  text: string,
  limit: number,
  suffix = '...'
): string {
  if (text.length <= limit) return text
  return text.slice(0, limit) + suffix
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param limit - 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 生成随机 ID
 * @param prefix - 前缀
 * @returns 随机 ID 字符串
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 检查是否为开发环境
 * @returns 是否为开发环境
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * 检查是否为生产环境
 * @returns 是否为生产环境
 */
export function isProd(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * 解析查询参数
 * @param query - 查询字符串或对象
 * @returns 解析后的参数对象
 */
export function parseQuery(
  query: string | Record<string, any>
): Record<string, string> {
  if (typeof query === 'string') {
    const params = new URLSearchParams(query)
    const result: Record<string, string> = {}
    params.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
  return query
}

/**
 * 检查是否是客户端
 * @returns 是否在浏览器环境中
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * 检查是否是服务端
 * @returns 是否在服务端环境中
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}
