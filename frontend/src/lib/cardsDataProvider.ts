/**
 * Cards Data Provider
 * Provides card data with fallback to mock data when API is unavailable
 */

'use client'

import { cardsService } from '@/services/cards'
import { MOCK_CARDS, MOCK_SERIES, getCardById, getSeriesById, getAuthorCards } from '@/lib/knowledge-data'
import type { 
  KnowledgeCard, 
  KnowledgeCardBrief, 
  KnowledgeCardListResponse,
  CardListParams,
  SeriesData 
} from '@/lib/api/types/cards'

// Flag to control whether to use mock data
const USE_MOCK_FALLBACK = true

// Track API availability
let apiAvailable = true

/**
 * Convert mock card to API format
 */
function mockToBrief(card: any): KnowledgeCardBrief {
  return {
    id: String(card.id),
    title: card.title,
    description: card.description,
    image: card.image,
    tags: card.tags,
    domain: card.domain,
    author: card.author,
    type: card.type,
    stats: card.stats,
    publishDate: card.publishDate,
  }
}

function mockToCard(card: any): KnowledgeCard {
  return {
    id: String(card.id),
    title: card.title,
    description: card.description,
    image: card.image,
    tags: card.tags,
    domain: card.domain,
    author: card.author,
    type: card.type,
    content: card.content,
    stats: card.stats,
    location: card.location,
    status: card.status || 'published',
    publishDate: card.publishDate,
  }
}

export const cardsDataProvider = {
  /**
   * Get paginated list of knowledge cards
   */
  async getCards(params: CardListParams = {}): Promise<KnowledgeCardListResponse> {
    if (apiAvailable) {
      try {
        const response = await cardsService.getCards(params)
        return response
      } catch (error) {
        console.warn('API unavailable, falling back to mock data:', error)
        apiAvailable = false
      }
    }

    // Fallback to mock data
    return this.getMockCards(params)
  },

  /**
   * Get mock cards (for development/fallback)
   */
  getMockCards(params: CardListParams = {}): KnowledgeCardListResponse {
    let filteredCards = [...MOCK_CARDS]

    // Apply domain filter
    if (params.domain && params.domain !== 'all') {
      filteredCards = filteredCards.filter(c => c.domain === params.domain)
    }

    // Apply type filter
    if (params.card_type) {
      filteredCards = filteredCards.filter(c => c.type === params.card_type)
    }

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredCards = filteredCards.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      )
    }

    // Sort
    const sortBy = params.sort_by || 'publishDate'
    const sortOrder = params.sort_order || 'desc'
    filteredCards.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] || ''
      const bVal = b[sortBy as keyof typeof b] || ''
      return sortOrder === 'desc' 
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal))
    })

    // Paginate
    const page = params.page || 1
    const pageSize = params.page_size || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedCards = filteredCards.slice(start, end)

    return {
      items: paginatedCards.map(mockToBrief),
      total: filteredCards.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filteredCards.length / pageSize),
    }
  },

  /**
   * Get a single card by ID
   */
  async getCard(id: string | number): Promise<KnowledgeCard | null> {
    if (apiAvailable) {
      try {
        const response = await cardsService.getCard(String(id))
        return response
      } catch (error) {
        console.warn('API unavailable, falling back to mock data:', error)
        apiAvailable = false
      }
    }

    // Fallback to mock data
    const mockCard = getCardById(id)
    return mockCard ? mockToCard(mockCard) : null
  },

  /**
   * Get series by ID
   */
  async getSeries(seriesId: string): Promise<SeriesData | null> {
    if (apiAvailable) {
      try {
        const response = await cardsService.getSeries(seriesId)
        return response
      } catch (error) {
        console.warn('API unavailable, falling back to mock data:', error)
        apiAvailable = false
      }
    }

    // Fallback to mock data
    const mockSeries = getSeriesById(seriesId)
    if (!mockSeries) return null
    // Convert mock series to API format
    return {
      ...mockSeries,
      cards: mockSeries.cards.map(c => ({
        ...c,
        id: String(c.id),
      })),
      groups: mockSeries.groups?.map(g => ({
        ...g,
        chapters: g.chapters.map(c => ({
          ...c,
          id: String(c.id),
        })),
      })),
    } as SeriesData
  },

  /**
   * Get author's cards
   */
  async getAuthorCards(authorName: string): Promise<KnowledgeCardBrief[]> {
    if (apiAvailable) {
      try {
        // This would need to be implemented in the service
        // For now, fall back to mock
      } catch (error) {
        console.warn('API unavailable, falling back to mock data:', error)
        apiAvailable = false
      }
    }

    // Fallback to mock data
    const authorCards = getAuthorCards(authorName)
    return authorCards.map(mockToBrief)
  },

  /**
   * Create a new card
   */
  async createCard(data: Partial<KnowledgeCard>): Promise<KnowledgeCard> {
    if (apiAvailable) {
      try {
        return await cardsService.createCard(data as any)
      } catch (error) {
        console.warn('API unavailable for creating card:', error)
        throw error
      }
    }

    // Cannot create in mock mode
    throw new Error('API unavailable for creating cards')
  },

  /**
   * Check if API is available
   */
  isApiAvailable(): boolean {
    return apiAvailable
  },

  /**
   * Reset API availability (for retry)
   */
  resetApiAvailability(): void {
    apiAvailable = true
  },
}

export default cardsDataProvider
