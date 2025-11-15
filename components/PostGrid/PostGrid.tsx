/**
 * Post Grid Component
 * Responsive grid layout for article cards with animations
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Post } from '@/types'
import { ArticleCard } from '@/components/ArticleCard/ArticleCard'

interface PostGridProps {
  posts: Post[]
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  staggerDelay?: number
  className?: string
  onPostClick?: (post: Post) => void
}

/**
 * PostGrid - Responsive grid for article cards
 * @example
 * <PostGrid posts={posts} columns={3} gap="lg" />
 *
 * <PostGrid posts={posts} columns={4} variant="featured" />
 */
export function PostGrid({
  posts,
  columns = 3,
  gap = 'lg',
  staggerDelay = 100,
  className = '',
  onPostClick
}: PostGridProps) {
  // Grid layout configuration
  const gridConfig = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  // Gap configuration
  const gapConfig = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  }

  // Staggered animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  }

  // First post is featured
  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <motion.div
      className={cn('w-full', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Featured post (if available) */}
      {featuredPost && columns > 1 && (
        <div className="mb-12">
          <motion.h2
            className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            精选文章
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="transform transition-transform hover:scale-[1.02]"
          >
            <ArticleCard
              post={featuredPost}
              priority={true}
              variant="featured"
              index={0}
            />
          </motion.div>
        </div>
      )}

      {/* Regular posts grid */}
      <AnimatePresence>
        <motion.div
          className={cn('grid', gridConfig[columns], gapConfig[gap])}
          layout
        >
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: 'easeOut'
              }}
            >
              <ArticleCard
                post={post}
                priority={index < 4}
                variant={
                  index % 3 === 0 && columns === 3
                    ? 'default'
                    : 'default'
                }
                index={index + 1}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * MasonryPostGrid - Pinterest-style masonry layout
 */
interface MasonryPostGridProps extends PostGridProps {
  columnCount?: 2 | 3 | 4
}

export function MasonryPostGrid({
  posts,
  columnCount = 3,
  gap = 'lg',
  className = ''
}: MasonryPostGridProps) {
  // Create columns
  const columns = Array.from({ length: columnCount }, (_, i) =>
    posts.filter((_, index) => index % columnCount === i)
  )

  const gapConfig = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  }

  return (
    <motion.div
      className={cn('grid', gapConfig[gap], className)}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        alignItems: 'start'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {column.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: (colIndex * 2 + index) * 0.1,
                ease: 'easeOut'
              }}
            >
              <ArticleCard
                post={post}
                priority={colIndex === 0 && index < 2}
              />
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  )
}

/**
 * InfiniteScrollPostGrid - Grid with infinite scroll support
 */
interface InfiniteScrollPostGridProps extends PostGridProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
}

export function InfiniteScrollPostGrid({
  posts,
  columns = 3,
  gap = 'lg',
  hasMore,
  loading,
  onLoadMore,
  ...props
}: InfiniteScrollPostGridProps) {
  const lastElementRef = React.useRef<HTMLDivElement | null>(null)

  // IntersectionObserver for infinite scroll
  React.useEffect(() => {
    if (!lastElementRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(lastElementRef.current)

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current)
      }
    }
  }, [hasMore, loading, onLoadMore])

  return (
    <>
      <PostGrid posts={posts} columns={columns} gap={gap} {...props} />

      {/* Loading indicator */}
      <div
        ref={lastElementRef}
        className="flex justify-center mt-8"
      >
        {loading && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground">
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-muted text-muted-foreground">
            <span>No more posts</span>
          </div>
        )}
      </div>
    </>
  )
}

// Utility function
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default {
  PostGrid,
  MasonryPostGrid,
  InfiniteScrollPostGrid
}
