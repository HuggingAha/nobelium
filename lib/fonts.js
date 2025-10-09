/*******************************
 * 字体加载优化配置
 *******************************/

// 字体加载配置
const fontConfig = {
  // Inter 字体 - 主要字体
  inter: {
    family: 'Inter',
    weights: [300, 400, 500, 600, 700],
    display: 'optional',
    preload: true,
    subsets: ['latin', 'latin-ext'],
    fallbacks: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
  },

  // Source Serif Pro - 衬线字体
  sourceSerif: {
    family: 'Source Serif Pro',
    weights: [400, 600, 700],
    display: 'optional',
    preload: false,
    subsets: ['latin', 'latin-ext'],
    fallbacks: ['Georgia', 'Times New Roman', 'Times', 'serif']
  },

  // Fira Code - 等宽字体
  firaCode: {
    family: 'Fira Code',
    weights: [400, 500, 600],
    display: 'optional',
    preload: false,
    subsets: ['latin', 'latin-ext'],
    fallbacks: ['Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace']
  }
}

// 字体加载策略
const fontLoadingStrategy = {
  // 关键路径字体 - 立即加载
  critical: ['inter'],

  // 重要字体 - 延迟加载
  important: ['sourceSerif'],

  // 可选字体 - 按需加载
  optional: ['firaCode']
}

// 字体预加载配置
const fontPreloadConfig = {
  // 预加载的字体
  fonts: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=optional',
      as: 'style',
      type: 'text/css'
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=optional',
      as: 'style',
      type: 'text/css'
    }
  ],

  // 字体显示策略
  display: 'optional',

  // 超时时间
  timeout: 3000
}

// 字体优化工具函数
const fontUtils = {
  // 创建字体族字符串
  createFontFamily: (fontName, fallbacks = []) => {
    const font = fontConfig[fontName]
    if (!font) return fallbacks.join(', ')

    return [font.family, ...font.fallbacks, ...fallbacks].join(', ')
  },

  // 获取字体权重
  getFontWeights: (fontName) => {
    const font = fontConfig[fontName]
    return font ? font.weights : [400]
  },

  // 检查字体是否预加载
  shouldPreload: (fontName) => {
    const font = fontConfig[fontName]
    return font ? font.preload : false
  },

  // 获取字体显示策略
  getDisplayStrategy: (fontName) => {
    const font = fontConfig[fontName]
    return font ? font.display : 'optional'
  }
}

// 字体观察器 - 用于检测字体加载状态
class FontObserver {
  constructor() {
    this.loadedFonts = new Set()
    this.observers = new Map()
  }

  // 观察字体加载
  observe(fontName, callback) {
    if (this.loadedFonts.has(fontName)) {
      callback(true)
      return
    }

    if (!this.observers.has(fontName)) {
      this.observers.set(fontName, [])
    }

    this.observers.get(fontName).push(callback)

    // 使用 Font Loading API 检查字体状态
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        const font = fontConfig[fontName]
        if (font && document.fonts.check(`1em ${font.family}`)) {
          this.markLoaded(fontName)
        }
      })
    }
  }

  // 标记字体为已加载
  markLoaded(fontName) {
    this.loadedFonts.add(fontName)

    const callbacks = this.observers.get(fontName)
    if (callbacks) {
      callbacks.forEach(callback => callback(true))
      this.observers.delete(fontName)
    }
  }

  // 检查字体是否已加载
  isLoaded(fontName) {
    return this.loadedFonts.has(fontName)
  }
}

// 创建字体观察器实例
const fontObserver = new FontObserver()

// 字体加载性能监控
const fontPerformanceMonitor = {
  metrics: {},

  // 记录字体加载时间
  recordLoadTime: (fontName, loadTime) => {
    this.metrics[fontName] = {
      loadTime,
      timestamp: Date.now()
    }

    // 发送到分析服务
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'font_load', {
        font_name: fontName,
        load_time: loadTime,
        event_category: 'performance'
      })
    }
  },

  // 获取字体加载指标
  getMetrics: () => {
    return this.metrics
  }
}

// 字体加载优化器
const fontOptimizer = {
  // 优化字体加载
  optimize: () => {
    if (typeof window === 'undefined') return

    // 关键字体立即加载
    fontLoadingStrategy.critical.forEach(fontName => {
      this.loadFont(fontName, { priority: 'high' })
    })

    // 重要字体延迟加载
    setTimeout(() => {
      fontLoadingStrategy.important.forEach(fontName => {
        this.loadFont(fontName, { priority: 'medium' })
      })
    }, 1000)

    // 可选字体空闲时加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        fontLoadingStrategy.optional.forEach(fontName => {
          this.loadFont(fontName, { priority: 'low' })
        })
      })
    }
  },

  // 加载字体
  loadFont: (fontName, options = {}) => {
    const font = fontConfig[fontName]
    if (!font) return

    const startTime = performance.now()

    // 创建字体加载器
    const fontFace = new FontFace(
      font.family,
      `url(https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}:wght@${font.weights.join(';')}&display=${font.display})`,
      {
        style: 'normal',
        weight: font.weights.join(' '),
        display: font.display
      }
    )

    // 加载字体
    fontFace.load().then(() => {
      document.fonts.add(fontFace)

      const loadTime = performance.now() - startTime
      fontPerformanceMonitor.recordLoadTime(fontName, loadTime)
      fontObserver.markLoaded(fontName)

      console.log(`Font ${fontName} loaded in ${loadTime}ms`)
    }).catch((error) => {
      console.warn(`Failed to load font ${fontName}:`, error)
    })
  }
}

// 字体回退策略
const fontFallback = {
  // 系统字体栈
  system: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
    mono: ['Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace']
  },

  // 创建字体回退
  createFallback: (fontName) => {
    const font = fontConfig[fontName]
    if (!font) return fontName

    // 根据字体类型选择回退
    if (fontName.includes('mono')) {
      return [font.family, ...this.system.mono].join(', ')
    } else if (fontName.includes('serif')) {
      return [font.family, ...this.system.serif].join(', ')
    } else {
      return [font.family, ...this.system.sans].join(', ')
    }
  }
}

// 导出配置和工具
module.exports = {
  fontConfig,
  fontLoadingStrategy,
  fontPreloadConfig,
  fontUtils,
  fontObserver,
  fontPerformanceMonitor,
  fontOptimizer,
  fontFallback
}