/**
 * Button Component (TypeScript Version)
 * A comprehensive button component with variants, sizes, and loading states
 */

import React, { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

// Type definitions
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'link'
  | 'danger'
  | 'success'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ButtonShape = 'default' | 'pill' | 'square'

// Props interface extending HTML button attributes
export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'as'> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  as?: ElementType
}

// Button variants style configuration
const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary',
  ghost:
    'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-accent',
  link: 'text-primary underline-offset-4 hover:underline focus:ring-primary',
  danger:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
  success:
    'bg-success text-success-foreground hover:bg-success/90 focus:ring-success'
}

// Button sizes style configuration
const buttonSizes: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
  xl: 'px-8 py-4 text-xl rounded-xl'
}

// Button shapes style configuration
const buttonShapes: Record<ButtonShape, string> = {
  default: '',
  pill: 'rounded-full',
  square: 'rounded-none'
}

/**
 * Main Button Component
 * @example
 * <Button>Click me</Button>
 * <Button variant="secondary" size="lg">Large Button</Button>
 * <Button loading>Loading...</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const ComponentElement = Component as ElementType

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      if (disabled || loading) {
        e.preventDefault()
        return
      }
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <ComponentElement
        ref={ref}
        type={type as 'button' | 'submit' | 'reset'}
        disabled={disabled || loading}
        onClick={
          handleClick as unknown as React.MouseEventHandler<HTMLElement>
        }
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'active:scale-[0.98] hover:scale-[1.02] transform',

          // Variant, size, and shape styles
          buttonVariants[variant],
          buttonSizes[size],
          buttonShapes[shape],

          // Full width
          fullWidth && 'w-full',

          // Loading state
          loading && 'relative cursor-not-allowed',

          // Custom classes
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

        {/* Icon if provided */}
        {!loading && props.icon && (
          <span className="mr-2 inline-flex items-center">{props.icon}</span>
        )}

        {/* Button content */}
        <span className="inline-flex items-center">{children}</span>
      </ComponentElement>
    )
  }
)

Button.displayName = 'Button'

/**
 * IconButton Component
 * A button with icon support (no text)
 * @example
 * <IconButton icon={<PlusIcon />} />
 * <IconButton icon={<HeartIcon />} variant="ghost" size="lg" />
 */
export interface IconButtonProps extends ButtonProps {
  tooltip?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      icon,
      variant = 'ghost',
      size = 'md',
      shape = 'default',
      disabled = false,
      loading = false,
      className = '',
      tooltip,
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<ButtonSize, string> = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4'
    }

    const shapeClasses: Record<ButtonShape, string> = {
      default: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none'
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        shape={shape}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center',
          sizeClasses[size],
          shapeClasses[shape],
          tooltip && 'cursor-help',
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
            aria-hidden="true"
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
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'

/**
 * ButtonGroup Component
 * Groups multiple buttons together
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  attached?: boolean
  children: React.ReactNode
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className = '', attached = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center',
          {
            'rounded-md overflow-hidden': attached,
            'space-x-2': !attached
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

// Additional button components

/**
 * LoadingButton Component
 * A button with loading state
 */
export interface LoadingButtonProps extends ButtonProps {
  loadingText?: string
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading,
  loadingText,
  ...props
}) => {
  return (
    <Button loading={loading} {...props}>
      {loading ? loadingText || children : children}
    </Button>
  )
}

LoadingButton.displayName = 'LoadingButton'

// Re-export everything
export default {
  Button,
  IconButton,
  ButtonGroup,
  LoadingButton
}
