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
}

interface SelectionToolbarProps {
  containerSelector?: string
  onAskAI: (selection: SelectionInfo) => void
  onComment: (selection: SelectionInfo) => void
  activePopup?: 'ai' | 'comment' | null
}

// 全局样式ID
const GLOBAL_STYLE_ID = 'lumina-selection-style'

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

  // 添加全局高亮样式
  const addGlobalHighlightStyle = React.useCallback(() => {
    if (document.getElementById(GLOBAL_STYLE_ID)) return
    
    const style = document.createElement('style')
    style.id = GLOBAL_STYLE_ID
    style.textContent = `
      /* 强制高亮样式 */
      .lumina-force-highlight::selection,
      .lumina-force-highlight *::selection {
        background: hsl(160 60% 50% / 0.45) !important;
        color: inherit !important;
      }
      .lumina-force-highlight::-moz-selection,
      .lumina-force-highlight *::-moz-selection {
        background: hsl(160 60% 50% / 0.45) !important;
        color: inherit !important;
      }
    `
    document.head.appendChild(style)
  }, [])

  // 移除全局高亮样式
  const removeGlobalHighlightStyle = React.useCallback(() => {
    const style = document.getElementById(GLOBAL_STYLE_ID)
    if (style) {
      style.remove()
    }
  }, [])

  // 强制保持选区
  const forceKeepSelection = React.useCallback(() => {
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      // 给选区所在的容器添加高亮类
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      const element = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement 
        : container as Element
      
      if (element) {
        // 向上查找markdown内容容器
        let target = element
        while (target && !target.id?.includes('markdown') && target.tagName !== 'BODY') {
          target = target.parentElement!
        }
        
        if (target && target.id?.includes('markdown')) {
          target.classList.add('lumina-force-highlight')
        }
      }
    }
  }, [])

  // 清除强制高亮
  const clearForceHighlight = React.useCallback(() => {
    document.querySelectorAll('.lumina-force-highlight').forEach(el => {
      el.classList.remove('lumina-force-highlight')
    })
  }, [])

  // Expose clearSelection method
  React.useImperativeHandle(ref, () => ({
    clearSelection: () => {
      setSelection(null)
      isPopupOpenRef.current = false
      clearForceHighlight()
      removeGlobalHighlightStyle()
      window.getSelection()?.removeAllRanges()
    }
  }))

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
          const selInfo = {
            text,
            rect: rangeRect,
            range: range.cloneRange(),
          }
          setSelection(selInfo)
        } else {
          setSelection(null)
        }
      } else {
        // No container check, just use selection
        const range = activeSelection.getRangeAt(0)
        const selInfo = {
          text,
          rect: range.getBoundingClientRect(),
          range: range.cloneRange(),
        }
        setSelection(selInfo)
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
  }, [containerSelector])

  // 监听 activePopup 变化
  React.useEffect(() => {
    if (activePopup) {
      // 弹窗打开
      isPopupOpenRef.current = true
      addGlobalHighlightStyle()
      // 延迟执行以确保DOM更新
      setTimeout(() => {
        forceKeepSelection()
      }, 0)
    } else {
      // 弹窗关闭
      isPopupOpenRef.current = false
      clearForceHighlight()
      removeGlobalHighlightStyle()
    }
  }, [activePopup, addGlobalHighlightStyle, removeGlobalHighlightStyle, forceKeepSelection, clearForceHighlight])

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
    }
  }

  const handleComment = () => {
    if (selection) {
      isPopupOpenRef.current = true
      onComment(selection)
    }
  }

  const shouldShowToolbar = isMounted && selection && !activePopup

  if (!shouldShowToolbar) return null

  return createPortal(
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
})