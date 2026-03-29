"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Smile, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { SelectionInfo } from "./SelectionToolbar"
import { CommentImage, EmojiPicker } from "./CommentSection"

interface QuickCommentPopupProps {
  isOpen: boolean
  onClose: () => void
  selection: SelectionInfo | null
  onSubmit: (content: string, images: CommentImage[], quoteText: string) => void
}

const POPUP_WIDTH = 520

export function QuickCommentPopup({ 
  isOpen, 
  onClose, 
  selection,
  onSubmit 
}: QuickCommentPopupProps) {
  const [content, setContent] = React.useState("")
  const [images, setImages] = React.useState<CommentImage[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const emojiButtonRef = React.useRef<HTMLButtonElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  // Calculate position based on selection
  React.useEffect(() => {
    if (isOpen && selection) {
      const popupHeight = 120
      const gap = 12

      let left = selection.rect.left + selection.rect.width / 2 - POPUP_WIDTH / 2
      let top = selection.rect.bottom + gap

      // Boundary checks
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 16) left = 16
      if (left + POPUP_WIDTH > viewportWidth - 16) {
        left = viewportWidth - POPUP_WIDTH - 16
      }

      // If not enough space below, show above
      if (top + popupHeight > viewportHeight - 16) {
        top = selection.rect.top - popupHeight - gap
      }

      if (top < 16) top = 16

      setPosition({ top, left })
    }
  }, [isOpen, selection])

  // Focus textarea when opened
  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setContent("")
      setImages([])
      setShowEmojiPicker(false)
    }
  }, [isOpen])

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          setImages((prev) => [...prev, { id: Date.now().toString() + Math.random(), url, file }])
        }
        reader.readAsDataURL(file)
      }
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return
    onSubmit(content, images, selection?.text || "")
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen || !selection) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 10000,
          }}
          className="select-none"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* 无边框容器 - 只有输入框 */}
          <div className="w-[520px] max-w-[calc(100vw-32px)]">
            <div className="relative flex items-start bg-muted/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="发表评论..."
                maxLength={1000}
                rows={2}
                className={cn(
                  "flex-1 min-h-[80px] max-h-[200px] text-sm resize-none",
                  "bg-transparent px-4 py-3 pr-28 pb-10",
                  "focus:outline-none"
                )}
              />
              
              {/* 右上角关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* 左下角：表情和图片按钮 */}
              <div className="absolute bottom-2 left-2 flex items-center gap-0.5">
                <EmojiPicker
                  onSelect={insertEmoji}
                  open={showEmojiPicker}
                  onOpenChange={setShowEmojiPicker}
                  triggerRef={emojiButtonRef}
                />
                <button
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer",
                    showEmojiPicker ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Smile className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <ImagePlus className="w-4 h-4" />
                </button>
              </div>
              
              {/* 右下角：字数统计和发送按钮 */}
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className={cn(
                  "text-xs text-muted-foreground",
                  content.length > 900 && "text-orange-500",
                  content.length >= 1000 && "text-destructive"
                )}>
                  {content.length}/1000
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() && images.length === 0}
                  className={cn(
                    "w-8 h-8 rounded-lg",
                    "bg-foreground text-background",
                    "hover:bg-foreground/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                    "flex items-center justify-center"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* 图片预览 - 在输入框下方 */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 bg-background/80 rounded-lg p-2 border border-border/50">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt="预览"
                      className="w-14 h-14 object-cover rounded-md border border-border"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
