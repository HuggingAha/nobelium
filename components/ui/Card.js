/*******************************
 * 现代化卡片组件
 *******************************/

import { forwardRef } from 'react'
import cn from 'classnames'
import Image from 'next/image'

// 卡片变体配置
const cardVariants = {
  // 默认卡片 - 用于一般内容展示
  default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',

  // 提升卡片 - 用于重要内容
  elevated: 'bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-200',

  // 平面卡片 - 用于嵌入内容
  flat: 'bg-transparent border-none shadow-none',

  // 轮廓卡片 - 用于需要边框的内容
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700',

  // 渐变卡片 - 用于特殊内容
  gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950',

  // 玻璃态卡片 - 用于现代界面
  glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-800/20',
}

// 基础卡片组件
const Card = forwardRef(({
  children,
  variant = 'default',
  className = '',
  padding = 'md',
  radius = 'lg',
  hover = false,
  ...props
}, ref) => {
  const paddings = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }

  const radiuses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        'transition-all duration-200',
        cardVariants[variant],
        paddings[padding],
        radiuses[radius],
        hover && 'hover:scale-[1.02] hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// 卡片头部组件
const CardHeader = forwardRef(({
  children,
  className = '',
  align = 'left',
  bordered = false,
  ...props
}, ref) => {
  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'pb-4',
        bordered && 'border-b border-gray-200 dark:border-gray-700',
        aligns[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

// 卡片内容组件
const CardContent = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = 'CardContent'

// 卡片底部组件
const CardFooter = forwardRef(({
  children,
  className = '',
  align = 'left',
  bordered = false,
  ...props
}, ref) => {
  const aligns = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'pt-4 flex items-center',
        bordered && 'border-t border-gray-200 dark:border-gray-700',
        aligns[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

// 卡片标题组件
const CardTitle = forwardRef(({
  children,
  className = '',
  level = 3,
  ...props
}, ref) => {
  const Tag = `h${level}`

  return (
    <Tag
      ref={ref}
      className={cn(
        'text-lg font-semibold text-gray-900 dark:text-white',
        'leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
})

CardTitle.displayName = 'CardTitle'

// 卡片描述组件
const CardDescription = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm text-gray-600 dark:text-gray-400',
        'mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})

CardDescription.displayName = 'CardDescription'

// 卡片图片组件
const CardImage = forwardRef(({
  src,
  alt,
  className = '',
  height = '48',
  objectFit = 'cover',
  ...props
}, ref) => {
  const heights = {
    '32': 'h-32',
    '48': 'h-48',
    '64': 'h-64',
    '80': 'h-80',
    '96': 'h-96',
    'full': 'h-full',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden',
        heights[height],
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={parseInt(height) * 4}
        className={cn(
          'w-full h-full',
          `object-${objectFit}`,
        )}
        quality={85}
        loading="lazy"
      />
    </div>
  )
})

CardImage.displayName = 'CardImage'

// 卡片徽章组件
const CardBadge = forwardRef(({
  children,
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

CardBadge.displayName = 'CardBadge'

// 卡片动作组件
const CardActions = forwardRef(({
  children,
  className = '',
  align = 'right',
  ...props
}, ref) => {
  const aligns = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2',
        aligns[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardActions.displayName = 'CardActions'

// 卡片加载骨架组件
const CardSkeleton = forwardRef(({
  className = '',
  lines = 3,
  hasImage = false,
  hasActions = false,
  ...props
}, ref) => {
  return (
    <Card variant="flat" className={cn('animate-pulse', className)} {...props}>
      {hasImage && (
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      )}

      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        {lines > 3 && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />}
      </div>

      {hasActions && (
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      )}
    </Card>
  )
})

CardSkeleton.displayName = 'CardSkeleton'

// 卡片组组件
const CardGrid = ({
  children,
  className = '',
  columns = 3,
  gap = 6,
  ...props
}) => {
  const columnsConfig = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const gaps = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  }

  return (
    <div
      className={cn(
        'grid',
        columnsConfig[columns],
        gaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// 卡片轮播组件
const CardCarousel = ({
  children,
  className = '',
  autoplay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  ...props
}) => {
  // 这里可以实现轮播逻辑
  // 为简化，这里只提供基础结构
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300">
          {children}
        </div>
      </div>

      {showArrows && (
        <>
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900"
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 导出所有组件
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardImage,
  CardBadge,
  CardActions,
  CardSkeleton,
  CardGrid,
  CardCarousel
}

const CardComponents = {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardImage,
  CardBadge,
  CardActions,
  CardSkeleton,
  CardGrid,
  CardCarousel
}

export default CardComponents