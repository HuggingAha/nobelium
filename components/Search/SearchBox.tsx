/**
 * Algolia SearchBox Component
 * Feature-rich search UI with InstantSearch 7.x hooks
 */

import React, { useState, useMemo } from 'react'
import {
  InstantSearch,
  SearchBox as AlgoliaSearchBox,
  Hits,
  Pagination,
  Configure,
  RefinementList,
} from 'react-instantsearch'
import { useHits, useSearchBox, usePagination, useRefinementList } from 'react-instantsearch'
import algoliasearch from 'algoliasearch/lite'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlassButton } from '@/components/ui/GlassCard'
import { ALGOLIA_CONFIG, DEFAULT_SEARCH_PARAMS, isAlgoliaConfigured } from '@/lib/algolia'

// Initialize Algolia client
const searchClient = isAlgoliaConfigured()
  ? algoliasearch(ALGOLIA_CONFIG.appId, ALGOLIA_CONFIG.apiKey)
  : null

/**
 * Hit - Display individual search result
 */
interface Hit {
  objectID: string
  title: string
  slug: string
  excerpt: string
  date: string
  tags: string[]
  category: string
  readTime: number
  _snippetResult?: {
    excerpt?: {
      value: string
    }
    content?: {
      value: string
    }
  }
  _highlightResult?: {
    title?: {
      value: string
    }
    excerpt?: {
      value: string
    }
  }
}

/**
 * Custom Hits component with highlighting
 */
function CustomHits({ onHitClick }: { onHitClick?: (hit: Hit) => void }) {
  const hitsState = useHits()
  const items = (hitsState as any).items as Hit[]

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p>Try different keywords or filters</p>
      </div>
    )
  }

  return (
    <div className="search-hits space-y-4">
      {items.map((hit) => (
        <motion.div
          key={hit.objectID}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="search-hit p-4 rounded-2xl border bg-card hover:border-accent transition-all cursor-pointer"
          onClick={() => onHitClick?.(hit)}
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-foreground">
              {hit._highlightResult?.title?.value ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: hit._highlightResult.title.value,
                  }}
                />
              ) : (
                hit.title
              )}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {hit._snippetResult?.excerpt?.value ||
                hit._snippetResult?.content?.value ||
                hit.excerpt ||
                'No description available'}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{new Date(hit.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{hit.readTime} min read</span>
              <span>•</span>
              <span className="capitalize">{hit.category}</span>
            </div>

            {hit.tags && hit.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {hit.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Custom SearchBox component
 */
function CustomSearchBox({
  placeholder = 'Search posts...',
  autoFocus = false,
}: {
  placeholder?: string
  autoFocus?: boolean
}) {
  const { query, refine } = useSearchBox()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full px-4 py-3 pl-12 pr-16 rounded-2xl border',
          'bg-background text-foreground',
          'border-muted focus:border-accent focus:ring-2 focus:ring-accent',
          'transition-all duration-200',
          isFocused && 'shadow-lg'
        )}
        aria-label="Search posts"
      />

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {query && (
        <button
          onClick={() => refine('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Custom RefinementList component
 */
function CustomRefinementList({ attribute, title }: { attribute: string; title: string }) {
  const { items, refine } = useRefinementList({ attribute })

  if (!items || items.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.label}
            className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-lg"
          >
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.label)}
              className="rounded border-muted text-accent focus:ring-accent"
            />
            <span className="text-sm text-foreground">{item.label}</span>
            <span className="text-xs text-muted-foreground ml-auto">({item.count})</span>
          </label>
        ))}
      </div>
    </div>
  )
}

/**
 * Custom Pagination component
 */
function CustomPagination() {
  const { currentRefinement, nbPages, refine } = usePagination()

  const pages = useMemo(() => {
    const pagesArray = []
    const maxPagesToShow = 5
    let startPage = Math.max(0, currentRefinement - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(nbPages - 1, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i)
    }
    return pagesArray
  }, [currentRefinement, nbPages])

  if (nbPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <GlassButton
        variant="flat"
        size="sm"
        onClick={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        className="min-w-10"
      >
        ←
      </GlassButton>

      {pages.map((page) => (
        <GlassButton
          key={page}
          variant={page === currentRefinement ? 'elevated' : 'flat'}
          size="sm"
          onClick={() => refine(page)}
          className="min-w-10"
        >
          {page + 1}
        </GlassButton>
      ))}

      <GlassButton
        variant="flat"
        size="sm"
        onClick={() => refine(currentRefinement + 1)}
        disabled={currentRefinement === nbPages - 1}
        className="min-w-10"
      >
        →
      </GlassButton>
    </div>
  )
}

/**
 * Main SearchBox component
 */
export function SearchBox({
  className = '',
  placeholder = 'Search posts...',
  autoFocus = false,
  onHitClick,
}: {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  onHitClick?: (hit: Hit) => void
}) {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">Search not configured</h3>
        <p className="text-muted-foreground mb-4">
          Please set up Algolia to enable search functionality
        </p>
        <a
          href="https://www.algolia.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Get started with Algolia →
        </a>
      </div>
    )
  }

  const InstantSearchComponent = InstantSearch as any
  
  return (
    <InstantSearchComponent
      searchClient={searchClient}
      indexName={ALGOLIA_CONFIG.indexName}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure {...(DEFAULT_SEARCH_PARAMS as any)} />

      <div className={cn('space-y-6', className)}>
        <div className="search-box-container relative w-full max-w-2xl mx-auto">
          <CustomSearchBox placeholder={placeholder} autoFocus={autoFocus} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 space-y-6">
            <CustomRefinementList attribute="tags" title="Tags" />
            <CustomRefinementList attribute="category" title="Category" />
          </div>

          <div className="flex-1 space-y-6">
            <CustomHits onHitClick={onHitClick} />
            <CustomPagination />
          </div>
        </div>
      </div>
    </InstantSearchComponent>
  )
}

/**
 * SearchAutocomplete - Autocomplete search with suggestions
 */
export function SearchAutocomplete({
  placeholder = 'Search...',
  onSuggestionClick,
}: {
  placeholder?: string
  onSuggestionClick?: (query: string) => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ title: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  if (!searchClient) {
    return null
  }

  const handleInputChange = async (value: string) => {
    setQuery(value)

    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const index = searchClient.initIndex(ALGOLIA_CONFIG.indexName)
      const { hits } = await index.search(value, {
        hitsPerPage: 5,
        attributesToRetrieve: ['title'],
        removeWordsIfNoResults: 'allOptional',
      })

      const suggestions = hits.map((hit: any) => ({ title: hit.title as string })).filter((s) => s.title)
      setSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 pl-12 rounded-2xl border',
            'bg-background text-foreground',
            'border-muted focus:border-accent focus:ring-2 focus:ring-accent',
            'transition-all duration-200'
          )}
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
