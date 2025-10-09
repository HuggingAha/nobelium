/*******************************
 * 现代化按钮组件
 *******************************/

import { forwardRef } from 'react'
import cn from 'classnames'

// 按钮变体配置
const buttonVariants = {
  // 主要按钮 - 用于最重要的操作
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500',

  // 次要按钮 - 用于次要操作
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 focus:ring-gray-500',

  // 幽灵按钮 - 用于不重要的操作
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700 focus:ring-gray-500',

  // 危险按钮 - 用于破坏性操作
  danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus:ring-error-500',

  // 成功按钮 - 用于成功操作
  success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus:ring-success-500',

  // 轮廓按钮 - 用于需要边框的操作
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700 focus:ring-gray-500',

  // 链接按钮 - 看起来像链接的按钮
  link: 'bg-transparent text-primary-600 hover:text-primary-700 active:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 focus:ring-primary-500 underline-offset-4 hover:underline',
}

// 按钮尺寸配置
const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
  xl: 'px-8 py-4 text-xl rounded-xl',
}

// 按钮形状配置
const buttonShapes = {
  default: '',
  pill: 'rounded-full',
  square: 'rounded-none',
}

// 主要的按钮组件
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        // 基础样式
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        'active:scale-[0.98] hover:scale-[1.02]',

        // 变体样式
        buttonVariants[variant],

        // 尺寸样式
        buttonSizes[size],

        // 形状样式
        buttonShapes[shape],

        // 全宽样式
        fullWidth && 'w-full',

        // 加载状态
        loading && 'relative',

        // 自定义样式
        className
      )}
      {...props}
    >
      {/* 加载指示器 */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
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
      )}

      {children}
    </button>
  )
})

Button.displayName = 'Button'

// 图标按钮组件
const IconButton = forwardRef(({
  icon,
  children,
  variant = 'ghost',
  size = 'md',
  shape = 'default',
  disabled = false,
  loading = false,
  className = '',
  tooltip,
  ...props
}, ref) => {
  const sizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  }

  const shapes = {
    default: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98] hover:scale-[1.02]',
        buttonVariants[variant],
        sizes[size],
        shapes[shape],
        loading && 'relative',
        className
      )}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
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
      ) : (
        icon || children
      )}
    </button>
  )
})

IconButton.displayName = 'IconButton'

// 按钮组组件
const ButtonGroup = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  attached = false,
  ...props
}) => {
  const groupClasses = cn(
    'inline-flex items-center',
    {
      'rounded-md overflow-hidden': attached,
      'space-x-2': !attached,
    },
    className
  )

  // 为每个按钮添加相应的属性
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        variant: child.props.variant || variant,
        size: child.props.size || size,
        ...(attached && {
          shape: 'square',
          className: cn(child.props.className, 'rounded-none border-r-0 last:border-r'),
        }),
      })
    }
    return child
  })

  return (
    <div className={groupClasses} {...props}>
      {enhancedChildren}
    </div>
  )
}

// 分离按钮组件
const SplitButton = ({
  children,
  onClick,
  onDropdownClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  dropdownIcon,
  ...props
}) => {
  const sizes = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  }

  return (
    <div className={cn('inline-flex rounded-md overflow-hidden', className)} {...props}>
      {/* 主要按钮 */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={onClick}
        shape="square"
        className="rounded-r-none border-r border-white/20 dark:border-black/20"
      >
        {children}
      </Button>

      {/* 下拉按钮 */}
      <IconButton
        icon={dropdownIcon || (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={onDropdownClick}
        shape="square"
        className="rounded-l-none border-l border-white/20 dark:border-black/20"
      />
    </div>
  )
}

// 浮动操作按钮
const Fab = forwardRef(({
  children,
  icon,
  variant = 'primary',
  size = 'lg',
  position = 'bottom-right',
  className = '',
  onClick,
  ...props
}, ref) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2',
  }

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        'fixed z-50 rounded-full shadow-lg transition-all duration-200',
        'hover:shadow-xl active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        buttonVariants[variant],
        sizes[size],
        positions[position],
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  )
})

Fab.displayName = 'Fab'

// 加载按钮组件
const LoadingButton = ({
  children,
  loading,
  loadingText,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      {...props}
    >
      {loading ? (loadingText || children) : children}
    </Button>
  )
}

// 导出所有组件
export {
  Button,
  IconButton,
  ButtonGroup,
  SplitButton,
  Fab,
  LoadingButton
}

const ButtonComponents = {
  Button,
  IconButton,
  ButtonGroup,
  SplitButton,
  Fab,
  LoadingButton
}

export default ButtonComponents