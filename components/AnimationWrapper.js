/*******************************
 * 动画包装组件
 *******************************/

import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'

// 滚动触发动画 Hook
const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasTriggered) return

          setTimeout(() => {
            setIsVisible(true)
            setHasTriggered(true)
          }, delay)

          if (triggerOnce) {
            observer.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(ref.current)

    return () => {
      const currentRef = ref.current
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered])

  return [ref, isVisible]
}

// 动画变体配置
const animationVariants = {
  // 淡入动画
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },

  // 向上滑入
  slideUp: {
    initial: { opacity: 0, transform: 'translateY(30px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // 向下滑入
  slideDown: {
    initial: { opacity: 0, transform: 'translateY(-30px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // 向左滑入
  slideLeft: {
    initial: { opacity: 0, transform: 'translateX(30px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // 向右滑入
  slideRight: {
    initial: { opacity: 0, transform: 'translateX(-30px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // 缩放进入
  scaleIn: {
    initial: { opacity: 0, transform: 'scale(0.9)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  // 旋转进入
  rotateIn: {
    initial: { opacity: 0, transform: 'rotate(-10deg)' },
    animate: { opacity: 1, transform: 'rotate(0)' },
    transition: { duration: 0.5, ease: 'easeOut' }
  },

  // 弹跳进入
  bounceIn: {
    initial: { opacity: 0, transform: 'scale(0.3)' },
    animate: { opacity: 1, transform: 'scale(1)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // 模糊进入
  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0)' },
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

// 动画包装组件
const AnimationWrapper = ({
  children,
  variant = 'fadeIn',
  className = '',
  delay = 0,
  duration,
  triggerOnScroll = true,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  style = {},
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce: true,
    delay
  })

  const animationConfig = animationVariants[variant]
  const finalStyle = {
    ...animationConfig.initial,
    ...(isVisible ? animationConfig.animate : {}),
    ...style,
    transition: duration
      ? { ...animationConfig.transition, duration }
      : animationConfig.transition
  }

  if (!triggerOnScroll) {
    return (
      <div
        className={cn('animate-fade-in', className)}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: duration ? `${duration}s` : undefined,
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={finalStyle}
      {...props}
    >
      {children}
    </div>
  )
}

// 交错动画组件
const StaggerAnimation = ({
  children,
  staggerDelay = 100,
  variant = 'slideUp',
  className = '',
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <div ref={ref} className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child

        return (
          <AnimationWrapper
            key={index}
            variant={variant}
            delay={index * staggerDelay}
            triggerOnScroll={false}
            style={{
              display: 'inline-block',
              width: '100%'
            }}
          >
            {child}
          </AnimationWrapper>
        )
      })}
    </div>
  )
}

// 打字机动画组件
const TypewriterAnimation = ({
  text,
  speed = 50,
  className = '',
  onComplete,
  ...props
}) => {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        if (onComplete) {
          onComplete()
        }
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <span className={cn('font-mono', className)} {...props}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

// 计数器动画组件
const CounterAnimation = ({
  start = 0,
  end,
  duration = 2000,
  className = '',
  prefix = '',
  suffix = '',
  onComplete,
  ...props
}) => {
  const [count, setCount] = useState(start)

  useEffect(() => {
    const startTime = Date.now()
    const difference = end - start

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.round(start + difference * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
        if (onComplete) {
          onComplete()
        }
      }
    }

    requestAnimationFrame(updateCount)

    return () => {
      // Cleanup if needed
    }
  }, [start, end, duration, onComplete])

  return (
    <span className={className} {...props}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// 进度条动画组件
const ProgressBar = ({
  progress,
  className = '',
  height = 'h-2',
  color = 'bg-blue-500',
  backgroundColor = 'bg-gray-200 dark:bg-gray-700',
  animated = true,
  ...props
}) => {
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress)
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setCurrentProgress(progress)
    }
  }, [progress, animated])

  return (
    <div className={cn('w-full rounded-full overflow-hidden', backgroundColor, className)} {...props}>
      <div
        className={cn(
          height,
          color,
          'transition-all duration-1000 ease-out',
          'rounded-full'
        )}
        style={{ width: `${currentProgress}%` }}
      />
    </div>
  )
}

// 加载动画组件
const LoadingSpinner = ({
  size = 'md',
  color = 'text-blue-500',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <svg
        className={cn(
          'animate-spin',
          sizes[size],
          color
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// 骨架屏组件
const Skeleton = ({
  lines = 3,
  className = '',
  width = '100%',
  height = 'h-4',
  ...props
}) => {
  return (
    <div className={cn('animate-pulse', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 dark:bg-gray-700 rounded',
            height,
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          style={{ width: typeof width === 'string' ? width : width[i] }}
        />
      ))}
    </div>
  )
}

// 错误边界组件
const ErrorBoundary = ({
  children,
  fallback,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true)
      setError(error)
      if (onError) {
        onError(error, errorInfo)
      }
    }

    // 监听错误
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [onError])

  if (hasError) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[200px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-red-900 dark:text-red-100">
            组件加载失败
          </h3>
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {error?.message || '未知错误'}
          </p>
        </div>
      </div>
    )
  }

  return children
}

// 导出所有组件
export {
  AnimationWrapper,
  StaggerAnimation,
  TypewriterAnimation,
  CounterAnimation,
  ProgressBar,
  LoadingSpinner,
  Skeleton,
  ErrorBoundary,
  useScrollAnimation
}

const AnimationComponents = {
  AnimationWrapper,
  StaggerAnimation,
  TypewriterAnimation,
  CounterAnimation,
  ProgressBar,
  LoadingSpinner,
  Skeleton,
  ErrorBoundary
}

export default AnimationComponents

import React from 'react'