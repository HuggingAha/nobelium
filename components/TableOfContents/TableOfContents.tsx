/**
 * Table of Contents Component
 * Enhanced TOC with ScrollSpy, animations, and mobile support
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollSpy, scrollToElement } from '@/components/ReadingProgress/ReadingProgress'

export interface Heading {
  id: string
  text: string
  level: number
  children?: Heading[]
}

export interface TableOfContentsProps {
  headings: Heading[]
  className?: string
  position?: 'sticky' | 'fixed'
  maxDepth?: number
  collapsible?: boolean
  initiallyCollapsed?: boolean
  mobile?: boolean
  offset?: number
}

/**
 * TableOfContents - Enhanced TOC with ScrollSpy
 * Automatically highlights active section and supports smooth scrolling
 *
 * @example
 * <TableOfContents headings={headings} />
 *
 * <TableOfContents
 *   headings={headings}
 *   maxDepth={3}
 *   collapsible
 *   position="sticky"
 * />
 */
export function TableOfContents({
  headings,
  className = '',
  position = 'sticky',
  maxDepth = 3,
  collapsible = true,
  initiallyCollapsed = false,
  mobile = false,
  offset = 80
}: TableOfContentsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  )
  const [isOpen, setIsOpen] = useState(!mobile)

  // Extract all IDs for ScrollSpy
  const allIds = React.useMemo(() => {
    const ids: string[] = []
    const collectIds = (items: Heading[]) => {
      items.forEach(item => {
        ids.push(item.id)
        if (item.children?.length) {
          collectIds(item.children)
        }
      })
    }
    collectIds(headings)
    return ids
  }, [headings])

  const activeId = useScrollSpy({
    ids: allIds,
    offset: offset,
    threshold: 0.2
  })

  // Handle expansion/collapse for deep headings
  useEffect(() => {
    if (initiallyCollapsed) {
      const toCollapse = new Set<string>()
      headings.forEach(heading => {
        if (heading.children?.length) {
          toCollapse.add(heading.id)
        }
      })
      setCollapsedSections(toCollapse)
    }
  }, [headings, initiallyCollapsed])

  const toggleSection = (id: string) => {
    if (!collapsible) return

    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id)
    } else {
      newCollapsed.add(id)
    }
    setCollapsedSections(newCollapsed)
  }

  const TOCItem = ({
    heading,
    depth = 0
  }: {
    heading: Heading
    depth?: number
  }) => {
    const hasChildren = heading.children && heading.children.length > 0
    const isActive = activeId === heading.id
    const isCollapsed = collapsedSections.has(heading.id)

    const levelStyles = {
      0: 'text-base font-bold',
      1: 'text-sm font-semibold pl-0',
      2: 'text-sm pl-4 border-l-2 border-muted',
      3: 'text-xs pl-6 border-l-2 border-muted',
      4: 'text-xs pl-8 border-l-2 border-muted'
    }

    const activeStyles = isActive
      ? 'text-accent border-accent bg-accent/5'
      : 'text-muted-foreground hover:text-foreground'

    return (
      <div key={heading.id}>
        <a
          href={`#${heading.id}`}
          onClick={e => {
            e.preventDefault()
            scrollToElement(heading.id, offset)
          }}
          className={cn(
            'block py-2 transition-all duration-200 rounded-md',
            'hover:bg-accent hover:text-accent-foreground',
            levelStyles[Math.min(depth, 4) as keyof typeof levelStyles],
            hasChildren ? 'pr-10' : '',
            isActive ? 'font-bold' : '',
            activeStyles
          )}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{heading.text}</span>

            {hasChildren && collapsible && (
              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleSection(heading.id)
                }}
                className={cn(
                  'p-1 rounded-md transition-transform duration-200',
                  isCollapsed ? '-rotate-90' : ''
                )}
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >
                <ChevronDown size={14} />
              </button>
            )}
          </div>
        </a>

        {/* Children */}
        {hasChildren && (
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="ml-2">
                  {heading.children
                    ?.filter(child => child.level <= maxDepth)
                    .map(child => (
                      <TOCItem key={child.id} heading={child} depth={depth + 1} />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  const HeadingLink = ({ heading }: { heading: Heading }) => {
    const isActive = activeId === heading.id
    return (
      <a
        href={`#${heading.id}`}
        onClick={e => {
          e.preventDefault()
          scrollToElement(heading.id, offset)
        }}
        className={cn(
          'block py-2 text-sm transition-all duration-200 rounded-md',
          'hover:bg-accent hover:text-accent-foreground',
          isActive ? 'text-accent bg-accent/5 border-l-2 border-accent' : 'text-muted-foreground hover:text-foreground',
          heading.level === 2 ? 'pl-0' : 'pl-4'
        )}
      >
        <span className="truncate">{heading.text}</span>
      </a>
    )
  }

  if (mobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn('fixed inset-x-0 top-16 bottom-0 z-50 md:hidden', className)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-lg">
              <div className="h-full p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">目录</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md hover:bg-accent"
                  >
                    ✕
                  </button>
                </div>

                <nav className="space-y-1">
                  {headings.map(heading => (
                    <HeadingLink key={heading.id} heading={heading} />
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}

        {/* TOC Toggle Button */}
        {!isOpen && (
          <motion.button
            className="fixed right-4 bottom-4 md:hidden z-40 p-3 rounded-full bg-accent text-accent-foreground shadow-lg"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          >
            <MenuIcon size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    )
  }

  return (
    <nav
      className={cn(
        'toc-container',
        position === 'sticky' && 'sticky top-8',
        'w-full md:w-64 lg:w-72',
        'max-h-[80vh] overflow-y-auto',
        'p-4 rounded-2xl border bg-card',
        'backdrop-blur-md',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-muted">
          <h3 className="text-base font-semibold trackiنگ-wide uppercase text-muted-foreground">
            目录
          </h3>
          {collapsible && (
            <button
              onClick={() => {
                const newCollapsed = new Set<string>()
                if (collapsedSections.size === 0) {
                  headings.forEach(h => {
                    if (h.children?.length) newCollapsed.add(h.id)
                  })
                }
                setCollapsedSections(newCollapsed)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {collapsedSections.size > 0 ? '全部展开' : '全部收起'}
            </button>
          )}
        </div>

        {/* TOC Items */}
        <div className="space-y-1">
          {headings.map(heading => (
            <TOCItem
              key={heading.id}
              heading={heading}
              depth={heading.level}
            />
          ))}
        </div>
      </motion.div>
    </nav>
  )
}

/**
 * MinimalTOC - Simplified version for mobile or minimal footer
 */
export interface MinimalTOCProps {
  headings: Heading[]
  activeId?: string
  onItemClick?: (id: string) => void
}

export function MinimalTOC({
  headings,
  activeId,
  onItemClick
}: MinimalTOCProps) {
  return (
    <div className="space-y-1">
      {headings.map(heading => {
        const isActive = activeId === heading.id
        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={e => {
              e.preventDefault()
              if (onItemClick) {
                onItemClick(heading.id)
              } else {
                scrollToElement(heading.id)
              }
            }}
            className={cn(
              'block py-2 text-sm transition-colors',
              isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="truncate">{heading.text}</span>
          </a>
        )
      })}
    </div>
  )
}

/**
 * useTOC - Hook to extract headings from content
 */
export function useTOC(selector = 'h2, h3') {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const elements = document.querySelectorAll(selector)
    const extractedHeadings: Heading[] = Array.from(elements).map(el => ({
      id: el.id,
      text: el.textContent || '',
      level: parseInt(el.tagName[1])
    }))

    setHeadings(extractedHeadings)
  }, [selector])

  return headings
}

/*
 * Icons
 */
function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Utility
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default TableOfContents
