"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface SelectionInfo {
  text: string
  rect: DOMRect
  range: Range | null
  clientRects: Array<{
    top: number
    left: number
    width: number
    height: number
  }>
}

interface SelectionToolbarProps {
  containerSelector?: string
  onAskAI: (selection: SelectionInfo) => void
  onComment: (selection: SelectionInfo) => void
  activePopup?: 'ai' | 'comment' | null
}

const LIGHT_SELECTION_HIGHLIGHT = "hsl(160 60% 50% / 0.3)"
const DARK_SELECTION_HIGHLIGHT = "hsl(160 70% 55% / 0.4)"
const GLOBAL_STYLE_ID = "lumina-selection-style"
const PERSISTENT_HIGHLIGHT_NAME = "lumina-persistent-selection"

interface CSSHighlightsRegistry {
  set: (name: string, highlight: unknown) => void
  delete: (name: string) => void
}

type WindowWithHighlight = Window & {
  Highlight?: new (...ranges: Range[]) => unknown
}

type CSSWithHighlights = typeof CSS & {
  highlights?: CSSHighlightsRegistry
}

export const SelectionToolbar = React.forwardRef<
  { clearSelection: () => void },
  SelectionToolbarProps
>(function SelectionToolbar(
  { containerSelector = "#markdown-content", onAskAI, onComment, activePopup },
  ref
) {
  const [selection, setSelection] = React.useState<SelectionInfo | null>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const [isMounted, setIsMounted] = React.useState(false)
  const isPopupOpenRef = React.useRef(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const createSelectionInfo = React.useCallback((range: Range, text: string): SelectionInfo => ({
    text,
    rect: range.getBoundingClientRect(),
    range: range.cloneRange(),
    clientRects: Array.from(range.getClientRects())
      .filter((rect) => rect.width > 0 && rect.height > 0)
      .map((rect) => ({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })),
  }), [])

  const getHighlightRegistry = React.useCallback(() => {
    if (typeof CSS === "undefined") return null
    return (CSS as CSSWithHighlights).highlights ?? null
  }, [])

  const supportsPersistentHighlight = React.useCallback(() => {
    return Boolean(getHighlightRegistry() && (window as WindowWithHighlight).Highlight)
  }, [getHighlightRegistry])

  const addGlobalHighlightStyle = React.useCallback(() => {
    if (document.getElementById(GLOBAL_STYLE_ID)) return

    const style = document.createElement("style")
    style.id = GLOBAL_STYLE_ID
    style.textContent = `
      #markdown-content::highlight(${PERSISTENT_HIGHLIGHT_NAME}) {
        background: ${LIGHT_SELECTION_HIGHLIGHT};
        color: inherit;
      }

      html.dark #markdown-content::highlight(${PERSISTENT_HIGHLIGHT_NAME}) {
        background: ${DARK_SELECTION_HIGHLIGHT};
        color: inherit;
      }
    `
    document.head.appendChild(style)
  }, [])

  const clearPersistentHighlight = React.useCallback(() => {
    getHighlightRegistry()?.delete(PERSISTENT_HIGHLIGHT_NAME)
  }, [getHighlightRegistry])

  const syncPersistentHighlight = React.useCallback((nextSelection: SelectionInfo | null) => {
    if (!activePopup || !nextSelection?.range || !supportsPersistentHighlight()) {
      clearPersistentHighlight()
      return
    }

    const HighlightConstructor = (window as WindowWithHighlight).Highlight
    if (!HighlightConstructor) {
      clearPersistentHighlight()
      return
    }

    const highlightRegistry = getHighlightRegistry()
    if (!highlightRegistry) return

    highlightRegistry.set(
      PERSISTENT_HIGHLIGHT_NAME,
      new HighlightConstructor(nextSelection.range.cloneRange())
    )
  }, [activePopup, clearPersistentHighlight, getHighlightRegistry, supportsPersistentHighlight])

  const refreshSelectionLayout = React.useCallback(() => {
    setSelection((currentSelection) => {
      if (!currentSelection?.range) return currentSelection

      const startContainer = currentSelection.range.startContainer
      const endContainer = currentSelection.range.endContainer
      const startConnected = startContainer.isConnected ?? false
      const endConnected = endContainer.isConnected ?? false

      if (!startConnected || !endConnected) {
        clearPersistentHighlight()
        return null
      }

      const nextSelection = createSelectionInfo(currentSelection.range, currentSelection.text)
      syncPersistentHighlight(nextSelection)
      return nextSelection
    })
  }, [clearPersistentHighlight, createSelectionInfo, syncPersistentHighlight])

  // Expose clearSelection method
  React.useImperativeHandle(ref, () => ({
    clearSelection: () => {
      setSelection(null)
      isPopupOpenRef.current = false
      clearPersistentHighlight()
      window.getSelection()?.removeAllRanges()
    }
  }), [clearPersistentHighlight])

  React.useEffect(() => {
    const handleSelectionChange = () => {
      // 弹窗打开时不处理selection变化 - 保持当前状态
      if (isPopupOpenRef.current) return

      const activeSelection = window.getSelection()
      
      if (!activeSelection || activeSelection.isCollapsed) {
        setSelection(null)
        return
      }

      const text = activeSelection.toString().trim()
      if (!text) {
        setSelection(null)
        return
      }

      // Check if selection is within the container
      const container = document.querySelector(containerSelector)
      if (container) {
        const range = activeSelection.getRangeAt(0)
        const containerRect = container.getBoundingClientRect()
        const rangeRect = range.getBoundingClientRect()

        // Check if selection is within container bounds
        if (
          rangeRect.left >= containerRect.left &&
          rangeRect.right <= containerRect.right &&
          rangeRect.top >= containerRect.top &&
          rangeRect.bottom <= containerRect.bottom
        ) {
          setSelection(createSelectionInfo(range, text))
        } else {
          setSelection(null)
        }
      } else {
        const range = activeSelection.getRangeAt(0)
        setSelection(createSelectionInfo(range, text))
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Don't hide if clicking on toolbar
      const target = e.target as HTMLElement
      if (target.closest("[data-selection-toolbar]")) {
        return
      }
      // Don't hide if a popup is open
      if (isPopupOpenRef.current) return
      
      setSelection(null)
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [containerSelector, createSelectionInfo])

  React.useEffect(() => {
    isPopupOpenRef.current = Boolean(activePopup)
  }, [activePopup])

  React.useEffect(() => {
    addGlobalHighlightStyle()

    return () => {
      clearPersistentHighlight()
      document.getElementById(GLOBAL_STYLE_ID)?.remove()
    }
  }, [addGlobalHighlightStyle, clearPersistentHighlight])

  React.useEffect(() => {
    syncPersistentHighlight(selection)
  }, [selection, syncPersistentHighlight])

  React.useEffect(() => {
    if (!selection) return

    const handleViewportChange = () => {
      refreshSelectionLayout()
    }

    window.addEventListener("resize", handleViewportChange)
    window.addEventListener("scroll", handleViewportChange, true)

    return () => {
      window.removeEventListener("resize", handleViewportChange)
      window.removeEventListener("scroll", handleViewportChange, true)
    }
  }, [selection, refreshSelectionLayout])

  const persistentHighlightColor = !isMounted
    ? LIGHT_SELECTION_HIGHLIGHT
    : document.documentElement.classList.contains("dark")
      ? DARK_SELECTION_HIGHLIGHT
      : LIGHT_SELECTION_HIGHLIGHT

  // Update position when selection changes
  React.useEffect(() => {
    if (selection) {
      const toolbarWidth = 72
      const toolbarHeight = 36
      const gap = 8

      let left = selection.rect.left + selection.rect.width / 2 - toolbarWidth / 2
      let top = selection.rect.top - toolbarHeight - gap

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 10) left = 10
      if (left + toolbarWidth > viewportWidth - 10) {
        left = viewportWidth - toolbarWidth - 10
      }

      if (top < 10) {
        top = selection.rect.bottom + gap
      }

      if (top + toolbarHeight > viewportHeight - 10) {
        top = viewportHeight - toolbarHeight - 10
      }

      setPosition({ top, left })
    }
  }, [selection])

  const handleAskAI = () => {
    if (selection) {
      isPopupOpenRef.current = true
      onAskAI(selection)
      window.getSelection()?.removeAllRanges()
    }
  }

  const handleComment = () => {
    if (selection) {
      isPopupOpenRef.current = true
      onComment(selection)
      window.getSelection()?.removeAllRanges()
    }
  }

  const shouldShowToolbar = isMounted && selection && !activePopup

  const persistentHighlight = selection && activePopup && !supportsPersistentHighlight()
    ? createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9998]">
          {selection.clientRects.map((rect, index) => (
            <div
              key={`${rect.top}-${rect.left}-${index}`}
              className="absolute rounded-[3px]"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                backgroundColor: persistentHighlightColor,
              }}
            />
          ))}
        </div>,
        document.body
      )
    : null

  const toolbar = shouldShowToolbar
    ? createPortal(
        <AnimatePresence>
          {selection && !activePopup && (
            <TooltipProvider delayDuration={300}>
              <motion.div
                data-selection-toolbar
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: position.top,
                  left: position.left,
                  zIndex: 9999,
                }}
                className={cn(
                  "flex items-center gap-1 p-1.5 rounded-lg",
                  "bg-background/95 backdrop-blur-sm",
                  "border border-border shadow-lg",
                  "select-none"
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleAskAI}
                      className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-md",
                        "text-emerald-500 hover:bg-emerald-500/10",
                        "transition-colors cursor-pointer"
                      )}
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    问AI
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleComment}
                      className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-md",
                        "text-emerald-500 hover:bg-emerald-500/10",
                        "transition-colors cursor-pointer"
                      )}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    评论
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </TooltipProvider>
          )}
        </AnimatePresence>,
        document.body
      )
    : null

  return (
    <>
      {persistentHighlight}
      {toolbar}
    </>
  )
})
