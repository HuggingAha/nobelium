/**
 * Glass Card Component System
 * Glassmorphism design components with blur effects and gradients
 */

import React, { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type GlassVariant = 'default' | 'elevated' | 'flat'
export type GlassBlur = 'sm' | 'md' | 'lg' | 'xl'
export type GlassBorder = 'default' | 'accent' | 'secondary' | 'none'

export interface GlassCardProps
  extends ComponentPropsWithoutRef<'div'> {
  variant?: GlassVariant
  blur?: GlassBlur
  border?: GlassBorder
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  pulse?: boolean
  glow?: boolean
  as?: ElementType
}

const glassVariants: Record<GlassVariant, string> = {
  default:
    'bg-white/10 dark:bg-black/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/20',
  elevated:
    'bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1',
  flat:
    'bg-transparent backdrop-blur-0 hover:bg-accent/5'
}

const glassBlur: Record<GlassBlur, string> = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
}

const glassBorder: Record<GlassBorder, string> = {
  default:
    'border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20',
  accent:
    'border border-accent/30 hover:border-accent/50',
  secondary:
    'border border-secondary/30 hover:border-secondary/50',
  none: ''
}

const roundedVariants: Record<NonNullable<GlassCardProps['rounded']>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
}

/**
 * GlassCard - Main glassmorphism card component
 * @example
 * <GlassCard>
 *   <Content />
 * </GlassCard>
 *
 * <GlassCard variant="elevated" blur="lg" glow>
 *   <Content />
 * </GlassCard>
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      blur = 'md',
      border = 'default',
      rounded = '2xl',
      pulse = false,
      glow = false,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden transition-all duration-300',

          // Glass effect styles
          glassVariants[variant],
          glassBlur[blur],
          glassBorder[border],
          roundedVariants[rounded],

          // Interactive states
          'hover:-translate-y-0.5 active:scale-[0.98]',

          // Glow effect
          glow && 'shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',

          // Pulse animation
          pulse && 'animate-pulse',

          // Custom classes
          className
        )}
        {...props}
      >
        {/* Inner glow effect */}
        {glow && (
          <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-white/10 via-transparent to-white/10 blur-xl" />
          </div>
        )}

        {/* Border highlight */}
        {border !== 'none' && (
          <div className="pointer-events-none absolute inset-0 rounded-inherit bg-gradient-to-r from-accent/20 via-transparent to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Subtle inner shadow for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-inherit shadow-inner" />
      </Component>
    )
  }
)

GlassCard.displayName = 'GlassCard'

/**
 * GlassButton - Glassmorphism button component
 * @example
 * <GlassButton size="lg">Get Started</GlassButton>
 *
 * <GlassButton variant="elevated" glow>
 *   Subscribe
 * </GlassButton>
 */
export interface GlassButtonProps
  extends ComponentPropsWithoutRef<'button'> {
  variant?: GlassVariant
  blur?: GlassBlur
  border?: GlassBorder
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  as?: ElementType
}

const buttonSizes: Record<NonNullable<GlassButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'elevated',
      blur = 'md',
      border = 'accent',
      size = 'md',
      glow = false,
      icon,
      fullWidth = false,
      as: Component = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base button styles
          'relative inline-flex items-center justify-center font-semibold transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02] transform',

          // Glass card styles (inherit)
          glassVariants[variant],
          glassBlur[blur],
          glassBorder[border],
          'rounded-xl',

          // Size
          buttonSizes[size],

          // States
          !disabled && 'cursor-pointer',

          // Full width
          fullWidth && 'w-full',

          // Glow effect
          glow && 'shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',

          // Custom
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span className="mr-2 inline-flex items-center">{icon}</span>
        )}

        {/* Content */}
        <span className="inline-flex items-center">{children}</span>

        {/* Inner glow effect */}
        {!disabled && (
          <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 via-transparent to-white/20" />
          </div>
        )}
      </Component>
    )
  }
)

GlassButton.displayName = 'GlassButton'

/**
 * GlassCardHeader - Optional header for glass cards
 */
export interface GlassCardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  padded?: boolean
}

export const GlassCardHeader = forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ children, className = '', padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          padded && 'p-5 pb-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCardHeader.displayName = 'GlassCardHeader'

/**
 * GlassCardContent - Content section for glass cards
 */
export interface GlassCardContentProps extends ComponentPropsWithoutRef<'div'> {
  padded?: boolean
}

export const GlassCardContent = forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ children, className = '', padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(padded && 'p-5', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCardContent.displayName = 'GlassCardContent'

/**
 * GlassCardFooter - Optional footer for glass cards
 */
export interface GlassCardFooterProps extends ComponentPropsWithoutRef<'div'> {
  padded?: boolean
}

export const GlassCardFooter = forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ children, className = '', padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          padded && 'p-5 pt-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCardFooter.displayName = 'GlassCardFooter'

/**
 * GlassBadge - Small badge with glass effect
 */
export interface GlassBadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'accent' | 'success' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const badgeVariants: Record<NonNullable<GlassBadgeProps['variant']>, string> = {
  default: 'bg-white/10 text-foreground border-white/20',
  accent: 'bg-accent/20 text-accent border-accent/30',
  success: 'bg-success/20 text-success border-success/30',
  destructive: 'bg-destructive/20 text-destructive border-destructive/30'
}

const badgeSizes: Record<NonNullable<GlassBadgeProps['size']>, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export const GlassBadge = forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ children, className = '', variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium backdrop-blur-sm',
          'border',
          badgeVariants[variant],
          badgeSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

GlassBadge.displayName = 'GlassBadge'

// Re-export all as default
const GlassComponents = {
  GlassCard,
  GlassButton,
  GlassCardHeader,
  GlassCardContent,
  GlassCardFooter,
  GlassBadge
}

export default GlassComponents
