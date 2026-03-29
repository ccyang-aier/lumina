/**
 * Knowledge Card Service
 * API service for knowledge card operations
 */

import { apiClient } from '@/lib/api/client'
import type {
  KnowledgeCard,
  KnowledgeCardBrief,
  KnowledgeCardListResponse,
  KnowledgeCardCreate,
  KnowledgeCardUpdate,
  CardListParams,
  SeriesData,
  CardListApiResponse,
  CardDetailApiResponse,
  CardInteractionResponse,
} from '@/lib/api/types/cards'

const CARDS_BASE_PATH = '/cards'

export const cardsService = {
  /**
   * Get paginated list of knowledge cards
   */
  async getCards(params: CardListParams = {}): Promise<KnowledgeCardListResponse> {
    const response = await apiClient.get<CardListApiResponse>(CARDS_BASE_PATH, {
      page: params.page,
      page_size: params.page_size,
      author_id: params.author_id,
      series_id: params.series_id,
      card_type: params.card_type,
      domain: params.domain,
      search: params.search,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      tags: params.tags?.join(','),
      is_featured: params.is_featured,
    })
    return response.data
  },

  /**
   * Get a single knowledge card by ID
   */
  async getCard(id: string): Promise<KnowledgeCard> {
    const response = await apiClient.get<CardDetailApiResponse>(`${CARDS_BASE_PATH}/${id}`)
    return response.data
  },

  /**
   * Create a new knowledge card
   */
  async createCard(data: KnowledgeCardCreate): Promise<KnowledgeCard> {
    const response = await apiClient.post<CardDetailApiResponse>(CARDS_BASE_PATH, data)
    return response.data
  },

  /**
   * Update an existing knowledge card
   */
  async updateCard(id: string, data: KnowledgeCardUpdate): Promise<KnowledgeCard> {
    const response = await apiClient.put<CardDetailApiResponse>(`${CARDS_BASE_PATH}/${id}`, data)
    return response.data
  },

  /**
   * Delete a knowledge card
   */
  async deleteCard(id: string): Promise<void> {
    await apiClient.delete(`${CARDS_BASE_PATH}/${id}`)
  },

  /**
   * Publish a draft card
   */
  async publishCard(id: string): Promise<KnowledgeCard> {
    const response = await apiClient.post<CardDetailApiResponse>(`${CARDS_BASE_PATH}/${id}/publish`, {})
    return response.data
  },

  /**
   * Feature/unfeature a card (admin only)
   */
  async featureCard(id: string, featured: boolean = true): Promise<KnowledgeCard> {
    const response = await apiClient.post<CardDetailApiResponse>(
      `${CARDS_BASE_PATH}/${id}/feature?featured=${featured}`, 
      {}
    )
    return response.data
  },

  /**
   * Toggle interaction (like/collect/share)
   */
  async toggleInteraction(
    cardId: string, 
    interactionType: 'like' | 'collect' | 'share'
  ): Promise<CardInteractionResponse> {
    return await apiClient.post<CardInteractionResponse>(
      `${CARDS_BASE_PATH}/${cardId}/interactions`,
      { interaction_type: interactionType }
    )
  },

  /**
   * Get featured cards
   */
  async getFeaturedCards(limit: number = 5): Promise<KnowledgeCardBrief[]> {
    const response = await apiClient.get<CardListApiResponse>(`${CARDS_BASE_PATH}/featured`, {
      limit
    })
    return response.data.items
  },

  /**
   * Get series by ID
   */
  async getSeries(seriesId: string): Promise<SeriesData> {
    const response = await apiClient.get<SeriesData>(`${CARDS_BASE_PATH}/series/${seriesId}`)
    return response
  },

  /**
   * Get list of series
   */
  async getSeriesList(params: { page?: number; page_size?: number; author_id?: string } = {}): Promise<{
    items: SeriesData[]
    total: number
  }> {
    const response = await apiClient.get<{ items: SeriesData[]; total: number }>(
      `${CARDS_BASE_PATH}/series/`,
      params
    )
    return response
  },

  /**
   * Create a new series
   */
  async createSeries(data: { 
    title: string
    description?: string
    level?: string
    groups?: Record<string, unknown>[]
  }): Promise<SeriesData> {
    const response = await apiClient.post<SeriesData>(`${CARDS_BASE_PATH}/series/`, data)
    return response
  },

  /**
   * Get list of popular tags
   */
  async getTags(limit: number = 50, minUsage: number = 0): Promise<{
    items: Array<{ id: string; name: string; slug?: string; usage_count: number }>
    total: number
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: {
        items: Array<{ id: string; name: string; slug?: string; usage_count: number }>
        total: number
      }
    }>(`${CARDS_BASE_PATH}/tags/`, { limit, min_usage: minUsage })
    return response.data
  },
}

export default cardsService
