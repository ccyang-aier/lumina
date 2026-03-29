"use client"

import * as React from "react"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { SelectionToolbar, SelectionInfo } from "./SelectionToolbar"
import { AIQuickPopup } from "./AIQuickPopup"
import { QuickCommentPopup } from "./QuickCommentPopup"
import { CommentSectionRef, CommentImage } from "./CommentSection"

interface KnowledgeContentProps {
  content: string
  commentSectionRef: React.RefObject<CommentSectionRef | null>
}

export function KnowledgeContent({ content, commentSectionRef }: KnowledgeContentProps) {
  const [aiPopupOpen, setAiPopupOpen] = React.useState(false)
  const [commentPopupOpen, setCommentPopupOpen] = React.useState(false)
  const [currentSelection, setCurrentSelection] = React.useState<SelectionInfo | null>(null)
  const selectionToolbarRef = React.useRef<{ clearSelection: () => void }>(null)

  // Determine which popup is active
  const activePopup = aiPopupOpen ? 'ai' : commentPopupOpen ? 'comment' : null

  const handleAskAI = (selection: SelectionInfo) => {
    setCurrentSelection(selection)
    setAiPopupOpen(true)
  }

  const handleComment = (selection: SelectionInfo) => {
    setCurrentSelection(selection)
    setCommentPopupOpen(true)
  }

  const handleCommentSubmit = (content: string, images: CommentImage[], quoteText: string) => {
    commentSectionRef.current?.addCommentWithQuote(content, images, quoteText)
  }

  const handleAIPopupClose = () => {
    setAiPopupOpen(false)
    // Clear selection when popup closes
    selectionToolbarRef.current?.clearSelection()
  }

  const handleCommentPopupClose = () => {
    setCommentPopupOpen(false)
    // Clear selection when popup closes
    selectionToolbarRef.current?.clearSelection()
  }

  return (
    <>
      <MarkdownRenderer content={content} />
      
      <SelectionToolbar
        ref={selectionToolbarRef}
        containerSelector="#markdown-content"
        onAskAI={handleAskAI}
        onComment={handleComment}
        activePopup={activePopup}
      />
      
      <AIQuickPopup
        isOpen={aiPopupOpen}
        onClose={handleAIPopupClose}
        selection={currentSelection}
      />
      
      <QuickCommentPopup
        isOpen={commentPopupOpen}
        onClose={handleCommentPopupClose}
        selection={currentSelection}
        onSubmit={handleCommentSubmit}
      />
    </>
  )
}
