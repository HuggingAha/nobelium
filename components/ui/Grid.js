/*******************************
 * 响应式布局网格系统
 *******************************/

import cn from 'classnames'

// 基础网格容器
const Grid = ({
  children,
  className = '',
  columns = 12,
  gap = 4,
  gapX,
  gapY,
  container = false,
  ...props
}) => {
  const gridClasses = cn(
    'grid',
    {
      // 网格列数
      'grid-cols-1': columns === 1,
      'grid-cols-2': columns === 2,
      'grid-cols-3': columns === 3,
      'grid-cols-4': columns === 4,
      'grid-cols-5': columns === 5,
      'grid-cols-6': columns === 6,
      'grid-cols-7': columns === 7,
      'grid-cols-8': columns === 8,
      'grid-cols-9': columns === 9,
      'grid-cols-10': columns === 10,
      'grid-cols-11': columns === 11,
      'grid-cols-12': columns === 12,
      'grid-cols-none': columns === 'none',

      // 响应式列数
      'sm:grid-cols-1': columns.sm === 1,
      'sm:grid-cols-2': columns.sm === 2,
      'sm:grid-cols-3': columns.sm === 3,
      'sm:grid-cols-4': columns.sm === 4,
      'sm:grid-cols-5': columns.sm === 5,
      'sm:grid-cols-6': columns.sm === 6,
      'sm:grid-cols-7': columns.sm === 7,
      'sm:grid-cols-8': columns.sm === 8,
      'sm:grid-cols-9': columns.sm === 9,
      'sm:grid-cols-10': columns.sm === 10,
      'sm:grid-cols-11': columns.sm === 11,
      'sm:grid-cols-12': columns.sm === 12,

      'md:grid-cols-1': columns.md === 1,
      'md:grid-cols-2': columns.md === 2,
      'md:grid-cols-3': columns.md === 3,
      'md:grid-cols-4': columns.md === 4,
      'md:grid-cols-5': columns.md === 5,
      'md:grid-cols-6': columns.md === 6,
      'md:grid-cols-7': columns.md === 7,
      'md:grid-cols-8': columns.md === 8,
      'md:grid-cols-9': columns.md === 9,
      'md:grid-cols-10': columns.md === 10,
      'md:grid-cols-11': columns.md === 11,
      'md:grid-cols-12': columns.md === 12,

      'lg:grid-cols-1': columns.lg === 1,
      'lg:grid-cols-2': columns.lg === 2,
      'lg:grid-cols-3': columns.lg === 3,
      'lg:grid-cols-4': columns.lg === 4,
      'lg:grid-cols-5': columns.lg === 5,
      'lg:grid-cols-6': columns.lg === 6,
      'lg:grid-cols-7': columns.lg === 7,
      'lg:grid-cols-8': columns.lg === 8,
      'lg:grid-cols-9': columns.lg === 9,
      'lg:grid-cols-10': columns.lg === 10,
      'lg:grid-cols-11': columns.lg === 11,
      'lg:grid-cols-12': columns.lg === 12,

      'xl:grid-cols-1': columns.xl === 1,
      'xl:grid-cols-2': columns.xl === 2,
      'xl:grid-cols-3': columns.xl === 3,
      'xl:grid-cols-4': columns.xl === 4,
      'xl:grid-cols-5': columns.xl === 5,
      'xl:grid-cols-6': columns.xl === 6,
      'xl:grid-cols-7': columns.xl === 7,
      'xl:grid-cols-8': columns.xl === 8,
      'xl:grid-cols-9': columns.xl === 9,
      'xl:grid-cols-10': columns.xl === 10,
      'xl:grid-cols-11': columns.xl === 11,
      'xl:grid-cols-12': columns.xl === 12,

      // 间距
      'gap-0': gap === 0,
      'gap-1': gap === 1,
      'gap-2': gap === 2,
      'gap-3': gap === 3,
      'gap-4': gap === 4,
      'gap-5': gap === 5,
      'gap-6': gap === 6,
      'gap-8': gap === 8,
      'gap-10': gap === 10,
      'gap-12': gap === 12,
      'gap-16': gap === 16,
      'gap-20': gap === 20,

      // 水平间距
      'gap-x-0': gapX === 0,
      'gap-x-1': gapX === 1,
      'gap-x-2': gapX === 2,
      'gap-x-3': gapX === 3,
      'gap-x-4': gapX === 4,
      'gap-x-5': gapX === 5,
      'gap-x-6': gapX === 6,
      'gap-x-8': gapX === 8,
      'gap-x-10': gapX === 10,
      'gap-x-12': gapX === 12,

      // 垂直间距
      'gap-y-0': gapY === 0,
      'gap-y-1': gapY === 1,
      'gap-y-2': gapY === 2,
      'gap-y-3': gapY === 3,
      'gap-y-4': gapY === 4,
      'gap-y-5': gapY === 5,
      'gap-y-6': gapY === 6,
      'gap-y-8': gapY === 8,
      'gap-y-10': gapY === 10,
      'gap-y-12': gapY === 12,

      // 容器
      'container mx-auto': container,
    },
    className
  )

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  )
}

// 网格项组件
const GridItem = ({
  children,
  className = '',
  colSpan,
  colStart,
  colEnd,
  rowSpan,
  rowStart,
  rowEnd,
  ...props
}) => {
  const itemClasses = cn(
    {
      // 列跨度
      'col-span-1': colSpan === 1,
      'col-span-2': colSpan === 2,
      'col-span-3': colSpan === 3,
      'col-span-4': colSpan === 4,
      'col-span-5': colSpan === 5,
      'col-span-6': colSpan === 6,
      'col-span-7': colSpan === 7,
      'col-span-8': colSpan === 8,
      'col-span-9': colSpan === 9,
      'col-span-10': colSpan === 10,
      'col-span-11': colSpan === 11,
      'col-span-12': colSpan === 12,
      'col-span-full': colSpan === 'full',

      // 响应式列跨度
      'sm:col-span-1': colSpan?.sm === 1,
      'sm:col-span-2': colSpan?.sm === 2,
      'sm:col-span-3': colSpan?.sm === 3,
      'sm:col-span-4': colSpan?.sm === 4,
      'sm:col-span-5': colSpan?.sm === 5,
      'sm:col-span-6': colSpan?.sm === 6,

      'md:col-span-1': colSpan?.md === 1,
      'md:col-span-2': colSpan?.md === 2,
      'md:col-span-3': colSpan?.md === 3,
      'md:col-span-4': colSpan?.md === 4,
      'md:col-span-5': colSpan?.md === 5,
      'md:col-span-6': colSpan?.md === 6,
      'md:col-span-7': colSpan?.md === 7,
      'md:col-span-8': colSpan?.md === 8,

      'lg:col-span-1': colSpan?.lg === 1,
      'lg:col-span-2': colSpan?.lg === 2,
      'lg:col-span-3': colSpan?.lg === 3,
      'lg:col-span-4': colSpan?.lg === 4,
      'lg:col-span-5': colSpan?.lg === 5,
      'lg:col-span-6': colSpan?.lg === 6,
      'lg:col-span-7': colSpan?.lg === 7,
      'lg:col-span-8': colSpan?.lg === 8,
      'lg:col-span-9': colSpan?.lg === 9,

      // 列起始位置
      'col-start-1': colStart === 1,
      'col-start-2': colStart === 2,
      'col-start-3': colStart === 3,
      'col-start-4': colStart === 4,
      'col-start-5': colStart === 5,
      'col-start-6': colStart === 6,
      'col-start-7': colStart === 7,
      'col-start-8': colStart === 8,
      'col-start-9': colStart === 9,
      'col-start-10': colStart === 10,
      'col-start-11': colStart === 11,
      'col-start-12': colStart === 12,
      'col-start-auto': colStart === 'auto',

      // 列结束位置
      'col-end-1': colEnd === 1,
      'col-end-2': colEnd === 2,
      'col-end-3': colEnd === 3,
      'col-end-4': colEnd === 4,
      'col-end-5': colEnd === 5,
      'col-end-6': colEnd === 6,
      'col-end-7': colEnd === 7,
      'col-end-8': colEnd === 8,
      'col-end-9': colEnd === 9,
      'col-end-10': colEnd === 10,
      'col-end-11': colEnd === 11,
      'col-end-12': colEnd === 12,
      'col-end-13': colEnd === 13,
      'col-end-auto': colEnd === 'auto',

      // 行跨度
      'row-span-1': rowSpan === 1,
      'row-span-2': rowSpan === 2,
      'row-span-3': rowSpan === 3,
      'row-span-4': rowSpan === 4,
      'row-span-5': rowSpan === 5,
      'row-span-6': rowSpan === 6,
      'row-span-full': rowSpan === 'full',

      // 行起始位置
      'row-start-1': rowStart === 1,
      'row-start-2': rowStart === 2,
      'row-start-3': rowStart === 3,
      'row-start-4': rowStart === 4,
      'row-start-5': rowStart === 5,
      'row-start-6': rowStart === 6,
      'row-start-7': rowStart === 7,
      'row-start-auto': rowStart === 'auto',

      // 行结束位置
      'row-end-1': rowEnd === 1,
      'row-end-2': rowEnd === 2,
      'row-end-3': rowEnd === 3,
      'row-end-4': rowEnd === 4,
      'row-end-5': rowEnd === 5,
      'row-end-6': rowEnd === 6,
      'row-end-7': rowEnd === 7,
      'row-end-auto': rowEnd === 'auto',
    },
    className
  )

  return (
    <div className={itemClasses} {...props}>
      {children}
    </div>
  )
}

// 响应式容器组件
const Container = ({
  children,
  className = '',
  size = 'default',
  padding = true,
  ...props
}) => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    default: 'max-w-7xl',
    full: 'max-w-full',
  }

  const containerClasses = cn(
    'mx-auto w-full',
    sizes[size],
    {
      'px-4 sm:px-6 lg:px-8': padding,
    },
    className
  )

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  )
}

// 弹性布局组件
const Flex = ({
  children,
  className = '',
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'stretch',
  gap,
  ...props
}) => {
  const flexClasses = cn(
    'flex',
    {
      // 方向
      'flex-row': direction === 'row',
      'flex-row-reverse': direction === 'row-reverse',
      'flex-col': direction === 'column',
      'flex-col-reverse': direction === 'column-reverse',

      // 换行
      'flex-wrap': wrap === true,
      'flex-wrap-reverse': wrap === 'reverse',
      'flex-nowrap': wrap === false,

      // 主轴对齐
      'justify-start': justify === 'start',
      'justify-end': justify === 'end',
      'justify-center': justify === 'center',
      'justify-between': justify === 'between',
      'justify-around': justify === 'around',
      'justify-evenly': justify === 'evenly',

      // 交叉轴对齐
      'items-start': align === 'start',
      'items-end': align === 'end',
      'items-center': align === 'center',
      'items-baseline': align === 'baseline',
      'items-stretch': align === 'stretch',

      // 间距
      'gap-1': gap === 1,
      'gap-2': gap === 2,
      'gap-3': gap === 3,
      'gap-4': gap === 4,
      'gap-5': gap === 5,
      'gap-6': gap === 6,
      'gap-8': gap === 8,
      'gap-10': gap === 10,
      'gap-12': gap === 12,
    },
    className
  )

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  )
}

// 堆叠布局组件
const Stack = ({
  children,
  className = '',
  spacing = 4,
  align = 'stretch',
  direction = 'vertical',
  ...props
}) => {
  const stackClasses = cn(
    'flex',
    {
      'flex-col': direction === 'vertical',
      'flex-row': direction === 'horizontal',

      // 间距
      'space-y-1': spacing === 1 && direction === 'vertical',
      'space-y-2': spacing === 2 && direction === 'vertical',
      'space-y-3': spacing === 3 && direction === 'vertical',
      'space-y-4': spacing === 4 && direction === 'vertical',
      'space-y-5': spacing === 5 && direction === 'vertical',
      'space-y-6': spacing === 6 && direction === 'vertical',
      'space-y-8': spacing === 8 && direction === 'vertical',
      'space-y-10': spacing === 10 && direction === 'vertical',
      'space-y-12': spacing === 12 && direction === 'vertical',

      'space-x-1': spacing === 1 && direction === 'horizontal',
      'space-x-2': spacing === 2 && direction === 'horizontal',
      'space-x-3': spacing === 3 && direction === 'horizontal',
      'space-x-4': spacing === 4 && direction === 'horizontal',
      'space-x-5': spacing === 5 && direction === 'horizontal',
      'space-x-6': spacing === 6 && direction === 'horizontal',
      'space-x-8': spacing === 8 && direction === 'horizontal',
      'space-x-10': spacing === 10 && direction === 'horizontal',
      'space-x-12': spacing === 12 && direction === 'horizontal',

      // 对齐
      'items-start': align === 'start',
      'items-center': align === 'center',
      'items-end': align === 'end',
      'items-stretch': align === 'stretch',
    },
    className
  )

  return (
    <div className={stackClasses} {...props}>
      {children}
    </div>
  )
}

// 分隔符组件
const Spacer = ({ size = 4, horizontal = false, className = '', ...props }) => {
  const sizes = {
    1: horizontal ? 'w-1' : 'h-1',
    2: horizontal ? 'w-2' : 'h-2',
    3: horizontal ? 'w-3' : 'h-3',
    4: horizontal ? 'w-4' : 'h-4',
    5: horizontal ? 'w-5' : 'h-5',
    6: horizontal ? 'w-6' : 'h-6',
    8: horizontal ? 'w-8' : 'h-8',
    10: horizontal ? 'w-10' : 'h-10',
    12: horizontal ? 'w-12' : 'h-12',
    16: horizontal ? 'w-16' : 'h-16',
    20: horizontal ? 'w-20' : 'h-20',
    24: horizontal ? 'w-24' : 'h-24',
    32: horizontal ? 'w-32' : 'h-32',
  }

  return (
    <div
      className={cn(
        sizes[size],
        horizontal ? 'flex-shrink-0' : 'flex-grow',
        className
      )}
      {...props}
    />
  )
}

// 导出所有组件
export {
  Grid,
  GridItem,
  Container,
  Flex,
  Stack,
  Spacer
}

const GridComponents = {
  Grid,
  GridItem,
  Container,
  Flex,
  Stack,
  Spacer
}

export default GridComponents