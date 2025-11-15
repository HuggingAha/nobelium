/**
 * ArticleCard v2 - Modern Blog Post Card
 * Featuring glassmorphism, hover effects, and rich metadata
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import NextImage from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GlassBadge } from '@/components/ui/GlassCard'
import { Post } from '@/types'

// React component for arrow icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

interface ArticleCardProps {
  post: Post
  priority?: boolean
  variant?: 'default' | 'featured' | 'compact'
  className?: string
  index?: number
}

export function ArticleCard({
  post,
  priority = false,
  variant = 'default',
  className,
  index = 0
}: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Calculate reading time if not provided
  const readingTime =
    post.readTime ||
    (post.excerpt ? Math.ceil((post.excerpt.split(' ').filter(Boolean).length || 0) / 200) : 5)

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: (index || 0) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: 'beforeChildren',
        staggerChildren: 0.2
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  const imageVariants = {
    hidden: { scale: 1.1 },
    visible: {
      scale: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: (index || 0) * 0.1 + 0.2
      }
    }
  }

  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden',
        'rounded-3xl border bg-card text-card-foreground',
        'shadow-lg transition-all duration-300',
        'hover:shadow-2xl',
        variant === 'featured'
          ? 'md:col-span-2 md:row-span-2'
          : '',
        variant === 'compact'
          ? 'rounded-2xl'
          : '',
        className
      )}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      {post.coverImage ? (
        <div className="relative overflow-hidden">
          <motion.div
            className="relative h-48 md:h-64 overflow-hidden"
            variants={imageVariants}
            animate={{ filter: isHovered ? 'brightness(0.85)' : 'brightness(1)' }}
            transition={{ duration: 0.4 }}
          >
            <NextImage
              src={post.coverImage}
              alt={post.title || 'Article cover'}
              fill
              priority={priority || index < 4}
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onLoadingComplete={() => setImageLoaded(true)}
            />

            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top badges */}
            <motion.div
              className="absolute top-4 left-4 flex flex-wrap gap-2"
              variants={badgeVariants}
            >
              {post.tags?.slice(0, 3).map(tag => (
                <GlassBadge key={tag.id} variant="accent" size="sm">
                  {tag.name}
                </GlassBadge>
              ))}
            </motion.div>

            {/* Reading time badge (appears on hover) */}
            <motion.div
              className="absolute top-4 right-4"
              variants={badgeVariants}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <ReadingTimeBadge minutes={readingTime} />
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="h-48 md:h-64 bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <p>{post.title || 'Article'}</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <motion.div
        className={cn(
          'flex flex-col h-full',
          variant === 'compact' ? 'p-4' : 'p-6'
        )}
        variants={contentVariants}
      >
        {/* Meta Information */}
        <motion.div
          className={cn(
            'flex items-center justify-between',
            variant === 'compact' ? 'text-xs mb-2' : 'text-sm mb-3'
          )}
          variants={contentVariants}
        >
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(post.date, 'relative')}</span>
            </div>

            {post.viewCount && (
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>{post.viewCount}</span>
              </div>
            )}

            {post.tags?.length > 0 && variant === 'compact' && (
              <div className="flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                <span>{post.tags.length}</span>
              </div>
            )}
          </div>

          {/* Like/Bookmark actions */}
          {isHovered && (
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Save article"
              >
                <BookmarkIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Like article"
              >
                <HeartIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h2
          className={cn(
            'font-bold mb-3 line-clamp-2 transition-colors',
            variant === 'featured' ? 'text-3xl' : 'text-2xl',
            variant === 'compact' ? 'text-lg mb-2' : '',
            'group-hover:text-accent'
          )}
          variants={contentVariants}
        >
          <Link
            href={`/${post.slug}`}
            className="hover:underline underline-offset-4"
          >
            {post.title}
          </Link>
        </motion.h2>

        {/* Excerpt */}
        {post.excerpt && (
          <motion.p
            className={cn(
              'text-muted-foreground mb-4',
              variant === 'compact'
                ? 'text-sm line-clamp-2'
                : 'line-clamp-3'
            )}
            variants={contentVariants}
          >
            {post.excerpt}
          </motion.p>
        )}

        {/* Author Info */}
        <motion.div
          className="flex items-center gap-3 mt-auto pt-4 border-t border-muted"
          variants={contentVariants}
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold">
              {(() => {
                const authorName = typeof post.author === 'string' 
                  ? post.author 
                  : post.author?.name || 'Anonymous'
                return authorName.charAt(0).toUpperCase()
              })()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {typeof post.author === 'string' ? post.author : post.author?.name || 'Anonymous'}
            </p>
            <p className="text-xs text-muted-foreground">
              {post.authorRole || 'Writer'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <ArrowRight
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                'group-hover:translate-x-1 group-hover:text-accent'
              )}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom progress indicator (slides up on hover) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-muted"
        initial={{ height: 4 }}
        animate={{ height: isHovered ? 8 : 4 }}
        transition={{ duration: 0.2 }}
        style={{ originY: 1 }}
      >
        <div className="h-full w-full bg-gradient-to-r from-accent to-secondary opacity-70" />
      </motion.div>

      {/* Glow border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-accent via-transparent to-secondary opacity-30 blur-lg" />
      </div>
    </motion.article>
  )
}

/**
 * ReadingTimeBadge - Shows reading time in minutes
 */
interface ReadingTimeBadgeProps {
  minutes: number
}

function ReadingTimeBadge({ minutes }: ReadingTimeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/20 text-xs font-semibold">
      <ClockIcon className="w-3 h-3" />
      <span>{minutes} min{minutes > 1 ? 's' : ''}</span>
    </div>
  )
}

/*
 * Icons
 */
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 17V2h15l5.59 5.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BookmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

/*
 * Utilities
 */
function formatDate(date: string | Date, format: 'relative' | 'short' | 'long' = 'relative'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    if (diffDays < 30) return `${diffDays} 天前`
    return diffDays < 365 ? `${Math.floor(diffDays / 30)} 个月前` : `${Math.floor(diffDays / 365)} 年前`
  }

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export default ArticleCard
