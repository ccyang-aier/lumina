/**
 * Knowledge Card Types
 * Type definitions for the knowledge card module
 */

// Card types enum
export type CardType = 'document' | 'tutorial' | 'faq' | 'talk' | 'script'

// Card status enum
export type CardStatus = 'draft' | 'published' | 'archived'

// Author information
export interface Author {
  name: string
  avatar?: string
  guild?: string
  bio?: string
}

// Card statistics
export interface CardStats {
  views: number
  likes: number
  comments: number
  collects?: number
  shares?: number
}

// Card location within a series
export interface CardLocation {
  series: string
  seriesId: string
  chapter: string
  chapterIndex: number
}

// Full knowledge card data
export interface KnowledgeCard {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  domain?: string
  author: Author
  type: CardType
  content?: string
  stats: CardStats
  location?: CardLocation
  status: CardStatus
  publishDate: string
}

// Brief card info for list display
export interface KnowledgeCardBrief {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  domain?: string
  author: Author
  type: CardType
  stats: CardStats
  publishDate: string
}

// Paginated list response
export interface KnowledgeCardListResponse {
  items: KnowledgeCardBrief[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Card creation payload
export interface KnowledgeCardCreate {
  title: string
  description: string
  image?: string
  type: CardType
  domain?: string
  tags: string[]
  content?: string
  series_id?: string
  chapter_title?: string
  chapter_index?: number
}

// Card update payload
export interface KnowledgeCardUpdate {
  title?: string
  description?: string
  image?: string
  content?: string
  type?: CardType
  domain?: string
  tags?: string[]
  series_id?: string
  chapter_title?: string
  chapter_index?: number
  status?: CardStatus
}

// Series chapter reference
export interface SeriesChapter {
  id: string
  title: string
  chapterIndex: number
  chapter: string
}

// Series group
export interface SeriesGroup {
  id: string
  title: string
  icon?: string
  chapters: SeriesChapter[]
}

// Series data
export interface SeriesData {
  id: string
  title: string
  description?: string
  totalChapters: number
  level?: string
  cards: SeriesChapter[]
  groups?: SeriesGroup[]
  lastUpdated?: string
}

// API Response wrappers
export interface CardListApiResponse {
  success: boolean
  data: KnowledgeCardListResponse
}

export interface CardDetailApiResponse {
  success: boolean
  data: KnowledgeCard
}

export interface SeriesApiResponse {
  success: boolean
  data: SeriesData
}

// Query parameters for card list
export interface CardListParams {
  page?: number
  page_size?: number
  author_id?: string
  series_id?: string
  card_type?: CardType
  domain?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  tags?: string[]
  is_featured?: boolean
  status?: CardStatus
}

// Card interaction response
export interface CardInteractionResponse {
  success: boolean
  interaction_type: 'like' | 'collect' | 'share'
  is_active: boolean
  count: number
}

// User interaction info
export interface UserInteractionInfo {
  is_liked: boolean
  is_collected: boolean
  is_shared: boolean
}

// Comment types
export interface CommentImage {
  id: string
  url: string
}

export interface CommentAuthor {
  name: string
  avatar?: string
  role?: string
}

export interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: string
  likes: number
  isLiked: boolean
  replies: Comment[]
  images?: CommentImage[]
  isHot: boolean
  hotScore: number
  quoteText?: string
  parentId?: string
}

export interface CommentListResponse {
  items: Comment[]
  total: number
  hot_comments: Comment[]
}

export interface CommentCreate {
  content: string
  parent_id?: string
  images?: CommentImage[]
  quote_text?: string
}
