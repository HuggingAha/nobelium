/*******************************
 * 现代化排版组件
 *******************************/

import cn from 'classnames'

// 标题组件
export const Heading = ({
  level = 1,
  children,
  className = '',
  variant = 'default',
  weight = 'bold',
  ...props
}) => {
  const Tag = `h${level}`

  const variants = {
    default: 'text-gray-900 dark:text-white',
    primary: 'text-primary-600 dark:text-primary-400',
    muted: 'text-gray-600 dark:text-gray-400',
    gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent',
  }

  const weights = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  }

  const sizes = {
    1: 'text-4xl md:text-5xl lg:text-6xl',
    2: 'text-3xl md:text-4xl lg:text-5xl',
    3: 'text-2xl md:text-3xl lg:text-4xl',
    4: 'text-xl md:text-2xl lg:text-3xl',
    5: 'text-lg md:text-xl lg:text-2xl',
    6: 'text-base md:text-lg lg:text-xl',
  }

  return (
    <Tag
      className={cn(
        'font-sans leading-tight tracking-tight',
        sizes[level],
        weights[weight],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

// 文本组件
export const Text = ({
  children,
  className = '',
  variant = 'default',
  size = 'base',
  weight = 'normal',
  as = 'p',
  ...props
}) => {
  const Component = as

  const variants = {
    default: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    subtle: 'text-gray-400 dark:text-gray-500',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400',
  }

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const weights = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Component
      className={cn(
        'font-sans leading-relaxed',
        sizes[size],
        weights[weight],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// 链接组件
export const Link = ({
  children,
  href,
  className = '',
  variant = 'default',
  external = false,
  ...props
}) => {
  const variants = {
    default: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors',
    muted: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors',
    subtle: 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors',
    underline: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-4 decoration-primary-200 dark:decoration-primary-800 hover:decoration-primary-400 dark:hover:decoration-primary-600 transition-all',
  }

  return (
    <a
      href={href}
      className={cn(
        'font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm',
        variants[variant],
        className
      )}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

// 代码文本组件
export const Code = ({
  children,
  className = '',
  variant = 'inline',
  language = null,
  ...props
}) => {
  const variants = {
    inline: 'px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono',
    block: 'p-4 rounded-lg bg-gray-900 dark:bg-gray-950 text-gray-100 font-mono overflow-x-auto',
  }

  return (
    <code
      className={cn(
        variants[variant],
        className
      )}
      data-language={language}
      {...props}
    >
      {children}
    </code>
  )
}

// 引用组件
export const Blockquote = ({
  children,
  className = '',
  cite,
  ...props
}) => {
  return (
    <blockquote
      className={cn(
        'border-l-4 border-primary-500 pl-6 py-2 my-6 bg-primary-50 dark:bg-primary-950/50 rounded-r-lg',
        'text-lg italic text-gray-700 dark:text-gray-300',
        className
      )}
      cite={cite}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// 列表组件
export const List = ({
  children,
  className = '',
  ordered = false,
  ...props
}) => {
  const Component = ordered ? 'ol' : 'ul'

  return (
    <Component
      className={cn(
        'list-inside space-y-2',
        ordered ? 'list-decimal' : 'list-disc',
        'text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// 分割线组件
export const Divider = ({ className = '', ...props }) => {
  return (
    <hr
      className={cn(
        'border-t border-gray-200 dark:border-gray-700 my-8',
        className
      )}
      {...props}
    />
  )
}

// 高亮文本组件
export const Highlight = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100',
    primary: 'bg-primary-200 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100',
    success: 'bg-success-200 dark:bg-success-900/30 text-success-900 dark:text-success-100',
    error: 'bg-error-200 dark:bg-error-900/30 text-error-900 dark:text-error-100',
  }

  return (
    <mark
      className={cn(
        'px-2 py-1 rounded-md',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </mark>
  )
}

// 键盘按键组件
export const Kbd = ({ children, className = '', ...props }) => {
  return (
    <kbd
      className={cn(
        'px-2 py-1 text-xs font-mono font-medium text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

// 文本截断组件
export const TextTruncate = ({
  children,
  lines = 1,
  className = '',
  ...props
}) => {
  const lineClampClass = lines === 1
    ? 'text-truncate'
    : `line-clamp-${lines}`

  return (
    <div
      className={cn(
        lineClampClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// 响应式文本组件
export const ResponsiveText = ({
  children,
  className = '',
  mobileSize = 'base',
  tabletSize = 'lg',
  desktopSize = 'xl',
  ...props
}) => {
  const sizes = {
    xs: 'text-xs sm:text-sm md:text-base',
    sm: 'text-sm sm:text-base md:text-lg',
    base: 'text-base sm:text-lg md:text-xl',
    lg: 'text-lg sm:text-xl md:text-2xl',
    xl: 'text-xl sm:text-2xl md:text-3xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
  }

  return (
    <p
      className={cn(
        sizes[mobileSize],
        sizes[tabletSize].replace(/text-\w+/, ''),
        sizes[desktopSize].replace(/text-\w+/, ''),
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

// 导出所有组件
export default {
  Heading,
  Text,
  Link,
  Code,
  Blockquote,
  List,
  Divider,
  Highlight,
  Kbd,
  TextTruncate,
  ResponsiveText,
}