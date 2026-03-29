/**
 * useKnowledgeCards Hook
 * Custom hook for fetching and managing knowledge cards
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { cardsService } from '@/services/cards'
import type { 
  KnowledgeCard, 
  KnowledgeCardBrief, 
  KnowledgeCardListResponse,
  CardListParams 
} from '@/lib/api/types/cards'

interface UseKnowledgeCardsOptions {
  initialPage?: number
  pageSize?: number
  domain?: string
  cardType?: string
  search?: string
}

interface UseKnowledgeCardsReturn {
  cards: KnowledgeCardBrief[]
  totalCards: number
  totalPages: number
  currentPage: number
  isLoading: boolean
  error: string | null
  fetchCards: (params?: CardListParams) => Promise<void>
  setPage: (page: number) => void
  setDomain: (domain: string) => void
  setSearch: (search: string) => void
  refetch: () => Promise<void>
}

export function useKnowledgeCards(options: UseKnowledgeCardsOptions = {}): UseKnowledgeCardsReturn {
  const {
    initialPage = 1,
    pageSize = 10,
    domain,
    cardType,
    search,
  } = options

  const [cards, setCards] = useState<KnowledgeCardBrief[]>([])
  const [totalCards, setTotalCards] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CardListParams>({
    page: initialPage,
    page_size: pageSize,
    domain,
    card_type: cardType as any,
    search,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const fetchCards = useCallback(async (params?: CardListParams) => {
    const mergedParams = { ...filters, ...params }
    setIsLoading(true)
    setError(null)

    try {
      const response: KnowledgeCardListResponse = await cardsService.getCards(mergedParams)
      setCards(response.items)
      setTotalCards(response.total)
      setTotalPages(response.total_pages)
      setCurrentPage(response.page)
      setFilters(mergedParams)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cards'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const setPage = useCallback((page: number) => {
    fetchCards({ page })
  }, [fetchCards])

  const setDomain = useCallback((domain: string) => {
    fetchCards({ domain: domain || undefined, page: 1 })
  }, [fetchCards])

  const setSearch = useCallback((search: string) => {
    fetchCards({ search: search || undefined, page: 1 })
  }, [fetchCards])

  const refetch = useCallback(async () => {
    await fetchCards()
  }, [fetchCards])

  // Initial fetch
  useEffect(() => {
    fetchCards()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    cards,
    totalCards,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchCards,
    setPage,
    setDomain,
    setSearch,
    refetch,
  }
}

/**
 * useKnowledgeCard Hook
 * Custom hook for fetching a single knowledge card
 */
interface UseKnowledgeCardReturn {
  card: KnowledgeCard | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useKnowledgeCard(id: string | number): UseKnowledgeCardReturn {
  const [card, setCard] = useState<KnowledgeCard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCard = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const cardData = await cardsService.getCard(String(id))
      setCard(cardData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch card'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCard()
  }, [fetchCard])

  return {
    card,
    isLoading,
    error,
    refetch: fetchCard,
  }
}

export default useKnowledgeCards
