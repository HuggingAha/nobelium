/*
 * 核心类型定义
 * 所有数据结构和接口在此定义
 */

// 博客配置接口
export interface BlogConfig {
  title: string
  author: string
  description: string
  email: string
  link: string
  timeZone: string
  appearance: 'light' | 'dark' | 'auto'
  font: 'sans-serif' | 'serif'
  lightBackground: string
  darkBackground: string
  path: string
  since: number
  postsPerPage: number
  sortByDate: boolean
  showAbout: boolean
  showArchive: boolean
  showTitleBarText: boolean
  autoCollapsedNavBar: boolean
  previewImagesEnabled: boolean
  show: {
    newsletter: boolean
    comments: boolean
    cusdis: {
      id: string
      url: string
    }
    gitalk: {
      clientId: string
      clientSecret: string
      repo: string
      owner: string
      admin: string[]
      id: string
    }
  }
}

// 文章接口
export interface Post {
  id: string
  title: string
  slug: string
  summary: string | null
  date: string
  publishedAt: string
  updatedAt?: string
  tags: Tag[]
  category?: string | null
  excerpt: string | null
  coverImage?: string | null
  coverImageBlurhash?: string | null
  readTime?: number
  viewCount?: number
  author?: Author | null
  authorRole?: string | null
  blocks?: Block[]
  type: 'Post'
  status: 'Published' | 'Draft'
}

// 标签接口
export interface Tag {
  id: string
  name: string
  color?: string
}

// Notion 块类型
export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'code'
  | 'image'
  | 'quote'
  | 'divider'
  | 'bookmark'
  | 'table_of_contents'
  | 'table'
  | 'video'
  | 'callout'
  | 'toggle'
  | 'unsupported'
  | 'collection_view'
  | 'collection_view_page'

// 文章块接口
export interface Block {
  id: string
  type: BlockType
  content: any
  properties?: any
  format?: any
}

// 分页接口
export interface Pagination {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// 作者接口
export interface Author {
  name: string
  email: string
  avatar?: string
  bio?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

// 评论接口
export interface Comment {
  id: string
  author: string
  content: string
  date: string
  postId: string
}

// 搜索结果接口
export interface SearchResult {
  id: string
  title: string
  content: string
  slug: string
  date: string
  excerpt?: string
  tags: string[]
  score?: number
}

// 响应类型
export type ApiResponse<T> = {
  data: T
  error?: never
} | {
  data?: never
  error: {
    message: string
    code: string
  }
}

// 通用 props 类型
export interface WithChildren {
  children: React.ReactNode
}

export interface WithClassName {
  className?: string
}

export interface WithChildrenAndClassName extends WithChildren, WithClassName {}

// 组件变体类型
export type Variant<T extends string> = {
  variant?: T
}

export type Size<T extends string> = {
  size?: T
}
