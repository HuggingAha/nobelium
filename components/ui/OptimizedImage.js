/*******************************
 * 优化的图片组件
 *******************************/

import Image from 'next/image'
import { useState, useEffect } from 'react'
import cn from 'classnames'

// 图片加载状态枚举
const ImageLoadState = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
}

// 占位符生成器
const generatePlaceholder = (width, height) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#94a3b8" font-family="sans-serif" font-size="14">
        ${width}×${height}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// 图片加载器 Hook
const useImageLoader = (src, options = {}) => {
  const [state, setState] = useState(ImageLoadState.LOADING)
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    if (!src) {
      setState(ImageLoadState.ERROR)
      return
    }

    setState(ImageLoadState.LOADING)

    const img = new Image()

    img.onload = () => {
      setState(ImageLoadState.LOADED)
      if (options.onLoad) {
        options.onLoad(img)
      }
    }

    img.onerror = () => {
      setState(ImageLoadState.ERROR)
      if (options.onError) {
        options.onError()
      }
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, options])

  return { state, imageSrc }
}

// 主要的优化图片组件
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  decoding = 'async',
  sizes = '100vw',
  onLoad,
  onError,
  blurDataURL,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 生成占位符
  const generatedBlurDataURL = blurDataURL || generatePlaceholder(width, height)

  // 图片加载处理
  const handleImageLoad = (result) => {
    setIsLoading(false)
    if (onLoad) {
      onLoad(result)
    }
  }

  // 图片错误处理
  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    if (onError) {
      onError()
    }
  }

  // 错误状态显示
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-100 dark:bg-gray-800 flex items-center justify-center',
          className
        )}
        style={{ width, height }}
        {...props}
      >
        <svg
          className="w-8 h-8 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {/* 加载状态指示器 */}
      {isLoading && placeholder === 'blur' && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: `url(${generatedBlurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* 主图片 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        style={{
          objectFit,
          objectPosition,
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoading ? 0 : 1,
        }}
        onLoadingComplete={handleImageLoad}
        onError={handleImageError}
        blurDataURL={placeholder === 'blur' ? generatedBlurDataURL : undefined}
        placeholder={placeholder}
      />

      {/* 加载动画 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  )
}

// 响应式图片组件
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  ...props
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // 避免 SSR 不匹配
  }

  return (
    <picture className={className} {...props}>
      {/* WebP 格式 */}
      <source
        srcSet={`${src}?format=webp & w=320 320w, ${src}?format=webp & w=640 640w, ${src}?format=webp & w=768 768w, ${src}?format=webp & w=1024 1024w, ${src}?format=webp & w=1280 1280w`}
        sizes={sizes}
        type="image/webp"
      />

      {/* JPEG 格式作为回退 */}
      <source
        srcSet={`${src}?w=320 320w, ${src}?w=640 640w, ${src}?w=768 768w, ${src}?w=1024 1024w, ${src}?w=1280 1280w`}
        sizes={sizes}
        type="image/jpeg"
      />

      {/* 默认图片 */}
      <img
        src={`${src}?w=768`}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto"
      />
    </picture>
  )
}

// 头像组件
const Avatar = ({
  src,
  alt,
  size = 'md',
  className = '',
  fallback = null,
  ...props
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  }

  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
        sizes[size],
        className
      )}
      {...props}
    >
      {!hasError && src ? (
        <Image
          src={src}
          alt={alt}
          width={parseInt(sizes[size].match(/w-(\d+)/)[1]) * 4}
          height={parseInt(sizes[size].match(/h-(\d+)/)[1]) * 4}
          className="rounded-full"
          onError={handleError}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-600">
          {fallback || (
            <svg
              className="w-1/2 h-1/2 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}

// 图片懒加载 Hook
const useLazyLoad = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false)
  const [ref, setRef] = useState(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options
      }
    )

    observer.observe(ref)

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, options])

  return [setRef, isIntersecting]
}

// 图片性能监控
const useImagePerformance = () => {
  const trackLoadTime = (imageName, loadTime) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load', {
        image_name: imageName,
        load_time: loadTime,
        event_category: 'performance'
      })
    }
  }

  const trackError = (imageName, error) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_error', {
        image_name: imageName,
        error: error.toString(),
        event_category: 'error'
      })
    }
  }

  return { trackLoadTime, trackError }
}

// 导出所有组件和工具
export {
  OptimizedImage,
  ResponsiveImage,
  Avatar,
  useLazyLoad,
  useImagePerformance,
  generatePlaceholder
}

export default OptimizedImage