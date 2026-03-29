/**
 * Cards Store
 * Zustand store for knowledge cards state management
 */

import { create } from 'zustand'
import type { 
  KnowledgeCard, 
  KnowledgeCardBrief, 
  KnowledgeCardListResponse,
  CardListParams 
} from '@/lib/api/types/cards'
import { cardsService } from '@/services/cards'

interface CardsState {
  // List state
  cards: KnowledgeCardBrief[]
  totalCards: number
  currentPage: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null
  
  // Current card detail
  currentCard: KnowledgeCard | null
  isLoadingCard: boolean
  
  // Filters
  filters: CardListParams
  
  // Actions
  fetchCards: (params?: CardListParams) => Promise<void>
  fetchCard: (id: string) => Promise<void>
  createCard: (data: Partial<KnowledgeCard>) => Promise<KnowledgeCard>
  updateCard: (id: string, data: Partial<KnowledgeCard>) => Promise<KnowledgeCard>
  deleteCard: (id: string) => Promise<void>
  setCurrentPage: (page: number) => void
  setFilters: (filters: Partial<CardListParams>) => void
  clearFilters: () => void
  clearCurrentCard: () => void
  clearError: () => void
}

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_FILTERS: CardListParams = {
  page: 1,
  page_size: DEFAULT_PAGE_SIZE,
  sort_by: 'created_at',
  sort_order: 'desc',
}

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  totalCards: 0,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  isLoading: false,
  error: null,
  
  currentCard: null,
  isLoadingCard: false,
  
  filters: DEFAULT_FILTERS,

  fetchCards: async (params?: CardListParams) => {
    const { filters } = get()
    const mergedParams = { ...filters, ...params }
    
    set({ isLoading: true, error: null })
    
    try {
      const response: KnowledgeCardListResponse = await cardsService.getCards(mergedParams)
      set({
        cards: response.items,
        totalCards: response.total,
        currentPage: response.page,
        pageSize: response.page_size,
        totalPages: response.total_pages,
        filters: mergedParams,
        isLoading: false,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cards'
      set({ error: message, isLoading: false })
    }
  },

  fetchCard: async (id: string) => {
    set({ isLoadingCard: true, error: null })
    
    try {
      const card = await cardsService.getCard(id)
      set({ currentCard: card, isLoadingCard: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch card'
      set({ error: message, isLoadingCard: false })
    }
  },

  createCard: async (data) => {
    set({ isLoading: true, error: null })
    
    try {
      const card = await cardsService.createCard(data as any)
      // Refresh the list after creation
      await get().fetchCards()
      return card
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create card'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  updateCard: async (id, data) => {
    set({ isLoading: true, error: null })
    
    try {
      const card = await cardsService.updateCard(id, data as any)
      set({ currentCard: card, isLoading: false })
      // Refresh the list
      await get().fetchCards()
      return card
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update card'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  deleteCard: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await cardsService.deleteCard(id)
      set({ currentCard: null, isLoading: false })
      // Refresh the list
      await get().fetchCards()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete card'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  setCurrentPage: (page: number) => {
    const { filters, fetchCards } = get()
    fetchCards({ ...filters, page })
  },

  setFilters: (newFilters: Partial<CardListParams>) => {
    const { filters, fetchCards } = get()
    fetchCards({ ...filters, ...newFilters, page: 1 }) // Reset to first page when filters change
  },

  clearFilters: () => {
    set({ filters: DEFAULT_FILTERS })
    get().fetchCards(DEFAULT_FILTERS)
  },

  clearCurrentCard: () => {
    set({ currentCard: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))

export default useCardsStore
