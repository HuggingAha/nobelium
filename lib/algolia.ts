/**
 * Algolia Search Configuration and Client
 * Provides search functionality for blog posts
 */

import algoliasearch, { SearchClient } from 'algoliasearch/lite'
import { Post } from '@/types'

// Algolia configuration from environment variables
export const ALGOLIA_CONFIG = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || '',
  adminKey: process.env.ALGOLIA_ADMIN_API_KEY || '',
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'posts'
}

// Validate configuration
export function isAlgoliaConfigured(): boolean {
  return Boolean(
    ALGOLIA_CONFIG.appId &&
    ALGOLIA_CONFIG.apiKey &&
    ALGOLIA_CONFIG.indexName
  )
}

// Create Algolia client
export function getAlgoliaClient(): SearchClient | null {
  if (!isAlgoliaConfigured()) {
    console.warn('Algolia is not configured')
    return null
  }

  try {
    return algoliasearch(ALGOLIA_CONFIG.appId, ALGOLIA_CONFIG.apiKey)
  } catch (error) {
    console.error('Failed to initialize Algolia client:', error)
    return null
  }
}

// Create admin client (for indexing)
export function getAlgoliaAdminClient(): any {
  if (!ALGOLIA_CONFIG.adminKey) {
    console.warn('Algolia admin key not configured')
    return null
  }

  try {
    const client = require('algoliasearch').algoliasearch(
      ALGOLIA_CONFIG.appId,
      ALGOLIA_CONFIG.adminKey
    )
    return client
  } catch (error) {
    console.error('Failed to initialize Algolia admin client:', error)
    return null
  }
}

// Post to Algolia object converter
export interface AlgoliaPost {
  objectID: string
  title: string
  slug: string
  excerpt: string
  content?: string
  date: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  category?: string
  readTime?: number
  wordCount?: number
  headings?: Array<{
    id: string
    text: string
    level: number
  }>
}

export function convertPostToAlgoliaObject(post: Post): AlgoliaPost {
  // Extract headings from blocks
  const headings = post.blocks
    ?.filter(block => block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3')
    .map(block => ({
      id: block.id,
      text: block.content?.title?.[0]?.[0] || '',
      level: parseInt(block.type.split('_')[1])
    }))
    .filter(heading => heading.text) || []

  // Calculate word count
  const content = post.blocks
    ?.filter(block => block.type === 'paragraph' && block.content?.title?.[0]?.[0])
    .map(block => block.content.title[0][0])
    .join(' ') || ''

  const wordCount = content.split(/\s+/).filter(Boolean).length

  return {
    objectID: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content,
    date: post.date,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags.map(tag => tag.name),
    category: post.tags[0]?.name,
    readTime: post.readTime,
    wordCount,
    headings: headings.slice(0, 10) // Limit to 10 headings
  }
}

// Configure Algolia index settings
export const ALGOLIA_INDEX_SETTINGS = {
  // Searchable attributes
  searchableAttributes: [
    'title',
    'unordered(tags)',
    'excerpt',
    'content',
    'headings.text'
  ],

  // Attributes for faceting
  attributesForFaceting: [
    'tags',
    'category',
    'date'
  ],

  // Custom ranking
  customRanking: [
    'desc(date)',
    'desc(publishedAt)'
  ],

  // Ranking formula
  ranking: [
    'typo',
    'geo',
    'words',
    'filters',
    'proximity',
    'attribute',
    'exact',
    'custom'
  ],

  // Highlighting
  attributesToHighlight: [
    'title',
    'excerpt',
    'content'
  ],

  attributesToSnippet: [
    'excerpt:100',
    'content:100'
  ],

  // Pagination
  hitsPerPage: 10,

  // Typos and synonyms
  typoTolerance: true,
  ignorePlurals: true,

  // Remove stop words
  removeStopWords: true,

  // Advanced query processing
  queryType: 'prefixLast'
}

// Search parameters for optimal results
export const DEFAULT_SEARCH_PARAMS = {
  hitsPerPage: 10,
  page: 0,
  attributesToRetrieve: [
    'objectID',
    'title',
    'slug',
    'excerpt',
    'date',
    'tags',
    'category',
    'readTime'
  ],
  attributesToHighlight: ['title', 'excerpt'],
  highlightPreTag: '<mark class="highlight">',
  highlightPostTag: '</mark>',
  snippetEllipsisText: '…',
  restrictHighlightAndSnippetArrays: true
}

export default {
  ALGOLIA_CONFIG,
  isAlgoliaConfigured,
  getAlgoliaClient,
  getAlgoliaAdminClient,
  convertPostToAlgoliaObject,
  ALGOLIA_INDEX_SETTINGS,
  DEFAULT_SEARCH_PARAMS
}
