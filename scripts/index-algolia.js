#!/usr/bin/env node

/**
 * Algolia Indexing Script
 * Indexes all blog posts from Notion to Algolia for search
 *
 * Usage:
 *   node scripts/index-algolia.js
 *   ALGOLIA_ADMIN_API_KEY=xxx node scripts/index-algolia.js
 *
 * Vercel Integration:
 *   Add to build command: "npm run build && node scripts/index-algolia.js"
 */

const algoliasearch = require('algoliasearch')

// Environment variables
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'posts'

// Validate configuration
if (!ALGOLIA_APP_ID) {
  console.error('❌ NEXT_PUBLIC_ALGOLIA_APP_ID is required')
  process.exit(1)
}

if (!ALGOLIA_ADMIN_API_KEY) {
  console.error('❌ ALGOLIA_ADMIN_API_KEY is required')
  console.log('   Set it in environment variables or .env.local')
  process.exit(1)
}

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

// Index settings
const INDEX_SETTINGS = {
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

  // Custom ranking (newest first)
  customRanking: [
    'desc(date)',
    'desc(publishedAt)'
  ],

  // Highlighting
  attributesToHighlight: [
    'title',
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

/**
 * Extract headings from Notion blocks
 */
function extractHeadings(blocks) {
  if (!blocks || !Array.isArray(blocks)) return []

  const headings = blocks
    .filter(block => {
      return block &&
        (block.type === 'heading_1' ||
         block.type === 'heading_2' ||
         block.type === 'heading_3')
    })
    .map(block => {
      try {
        const level = parseInt(block.type.split('_')[1])
        const text = block.properties?.title?.[0]?.[0] || ''

        return {
          id: block.id,
          text: text.substring(0, 100), // Limit text length
          level
        }
      } catch (error) {
        console.warn('Failed to process heading block:', block.id, error)
        return null
      }
    })
    .filter(Boolean)
    .slice(0, 20) // Limit to 20 headings

  return headings
}

/**
 * Extract content from Notion blocks for indexing
 */
function extractContent(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''

  const textBlocks = blocks
    .filter(block => {
      return block &&
        block.type === 'paragraph' &&
        block.properties?.title?.[0]?.[0]
    })
    .map(block => block.properties.title[0][0])
    .join(' ')

  // Limit content length to 10,000 characters
  return textBlocks.substring(0, 10000)
}

/**
 * Convert post to Algolia object
 */
function convertPostToAlgoliaObject(post) {
  try {
    const content = extractContent(post.blocks || [])
    const headings = extractHeadings(post.blocks || [])
    const wordCount = content.split(/\s+/).filter(Boolean).length

    return {
      objectID: post.id,
      title: post.title || 'Untitled',
      slug: post.slug || '',
      excerpt: post.excerpt || post.summary || '',
      content,
      date: post.date || post.publishedAt || '',
      publishedAt: post.publishedAt || post.date || '',
      updatedAt: post.updatedAt || '',
      tags: post.tags ? post.tags.map(tag => tag.name).filter(Boolean) : [],
      category: post.tags && post.tags.length > 0 ? post.tags[0].name : 'Uncategorized',
      readTime: post.readTime || Math.ceil(wordCount / 200),
      wordCount,
      headings: headings.length > 0 ? headings : []
    }
  } catch (error) {
    console.error('Failed to convert post:', post.id, error)
    return null
  }
}

/**
 * Fetch all posts from Notion API
 */
async function fetchAllPosts() {
  try {
    // Dynamic import to avoid issues when running outside Next.js
    const { getAllPosts } = require('../lib/notion')

    console.log('📥 Fetching posts from Notion...')
    const posts = await getAllPosts()

    if (!posts || posts.length === 0) {
      console.warn('⚠️ No posts found')
      return []
    }

    console.log(`✅ Found ${posts.length} posts`)
    return posts
  } catch (error) {
    console.error('❌ Failed to fetch posts:', error)
    return []
  }
}

/**
 * Index posts to Algolia
 */
async function indexPosts(posts) {
  try {
    console.log(`🚀 Indexing ${posts.length} posts to Algolia...`)

    // Convert posts to Algolia objects
    const objects = posts
      .map(post => convertPostToAlgoliaObject(post))
      .filter(Boolean)

    if (objects.length === 0) {
      console.warn('⚠️ No valid objects to index')
      return
    }

    // Configure index settings
    console.log('⚙️ Configuring index settings...')
    await index.setSettings(INDEX_SETTINGS)

    // Save objects to Algolia
    console.log('⬆️ Uploading objects...')
    const { objectIDs } = await index.saveObjects(objects)

    console.log(`✅ Successfully indexed ${objectIDs.length} posts`)

    // Wait for indexing to complete
    console.log('⏳ Waiting for indexing to complete...')
    await index.waitTask(objectIDs.length)
    console.log('✅ Indexing complete')

    return objectIDs
  } catch (error) {
    console.error('❌ Failed to index posts:', error)

    if (error.message && error.message.includes('X-Algolia-API-Key')) {
      console.error('🔑 Invalid API key or insufficient permissions')
      console.log('   Make sure ALGOLIA_ADMIN_API_KEY is correct and has write permissions')
    }

    throw error
  }
}

/**
 * Delete all objects from the index
 */
async function clearIndex() {
  try {
    console.log('🗑️ Clearing index...')
    await index.clearObjects()
    console.log('✅ Index cleared')
  } catch (error) {
    console.error('❌ Failed to clear index:', error)
    throw error
  }
}

/**
 * Get index statistics
 */
async function getIndexStats() {
  try {
    const stats = await index.getSettings()
    const objects = await index.browseObjects()
    console.log('📊 Index stats:')
    console.log(`   - Records: ${objects.nbHits}`)
    console.log(`   - Index name: ${ALGOLIA_INDEX_NAME}`)
    console.log('   - Searchable attributes:', stats.searchableAttributes)
    return stats
  } catch (error) {
    console.error('❌ Failed to get stats:', error)
    return null
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('========================================')
  console.log('Algolia Indexing Script')
  console.log('========================================')
  console.log(`Index: ${ALGOLIA_INDEX_NAME}`)
  console.log(`App ID: ${ALGOLIA_APP_ID}`)
  console.log('')

  try {
    // Parse command line arguments
    const args = process.argv.slice(2)
    const shouldClear = args.includes('--clear') || args.includes('-c')
    const dryRun = args.includes('--dry-run') || args.includes('-d')
    const showStats = args.includes('--stats') || args.includes('-s')

    if (showStats) {
      await getIndexStats()
      return
    }

    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made')
    }

    // Fetch posts
    const posts = await fetchAllPosts()

    if (posts.length === 0) {
      console.error('❌ No posts to index')
      process.exit(1)
    }

    // Clear index if requested
    if (shouldClear && !dryRun) {
      await clearIndex()
    }

    // Index posts
    if (!dryRun) {
      await indexPosts(posts)
    } else {
      // Dry run: just show what would be indexed
      const objects = posts.map(post => convertPostToAlgoliaObject(post)).filter(Boolean)
      console.log(`\n📝 Would index ${objects.length} posts:`)
      objects.slice(0, 5).forEach(obj => {
        console.log(`   - ${obj.title} (${obj.wordCount} words, ${obj.tags.length} tags)`)
      })
      if (objects.length > 5) {
        console.log(`   ... and ${objects.length - 5} more`)
      }
    }

    console.log('\n✅ Indexing completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('\n❌ Indexing failed:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

module.exports = {
  convertPostToAlgoliaObject,
  indexPosts,
  fetchAllPosts,
  clearIndex,
  getIndexStats
}
