"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  Send,
  Smile,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
  Flag,
  Sparkles,
  Flame,
  MoreHorizontal,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
export interface CommentAuthor {
  name: string
  avatar?: string
  role?: "admin" | "author" | "user"
}

export interface CommentImage {
  id: string
  url: string
  file?: File
}

export interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: Date
  likes: number
  isLiked: boolean
  replies: Comment[]
  parentId?: string
  images?: CommentImage[]
  isHot?: boolean
  hotScore?: number
  quoteText?: string // 引用的文档文本
}

// Image Lightbox Component
interface ImageLightboxProps {
  src: string
  alt?: string
  isOpen: boolean
  onClose: () => void
}

function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      <img 
        src={src} 
        alt={alt || "放大图片"} 
        className="max-w-[90vw] max-h-[90vh] object-contain animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  )
}

// Clickable Image Component
interface ClickableImageProps {
  src: string
  alt?: string
  className?: string
}

function ClickableImage({ src, alt, className }: ClickableImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)

  return (
    <>
      <img 
        src={src} 
        alt={alt || "图片"} 
        className={cn("cursor-zoom-in transition-all hover:opacity-90", className)}
        onClick={() => setIsLightboxOpen(true)}
      />
      <ImageLightbox 
        src={src} 
        alt={alt}
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </>
  )
}

// Emoji data
const EMOJI_CATEGORIES = {
  default: [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫",
    "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬",
    "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
    "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸",
  ],
 常用: [
    "👍", "👎", "👏", "🙏", "💪", "❤️", "💔", "💕", "💖", "💗",
    "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "💯", "💢",
    "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "🗯️", "💭", "💤",
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
    "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
  ],
}

// Emoji Picker Component - Uses Portal to avoid z-index issues
export interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function EmojiPicker({ onSelect, open, onOpenChange, triggerRef }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = React.useState<keyof typeof EMOJI_CATEGORIES>("default")
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const pickerRef = React.useRef<HTMLDivElement>(null)

  // Calculate position when opening
  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const pickerHeight = 250 // approximate height
      const pickerWidth = 288 // w-72 = 18rem = 288px
      
      // Position below the trigger by default
      let top = rect.bottom + 8
      let left = rect.left
      
      // If not enough space below, position above
      if (top + pickerHeight > window.innerHeight) {
        top = rect.top - pickerHeight - 8
      }
      
      // Ensure picker doesn't go off-screen on the right
      if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 16
      }
      
      setPosition({ top, left })
    }
  }, [open, triggerRef])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          onOpenChange(false)
        }
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, onOpenChange, triggerRef])

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div 
      ref={pickerRef}
      className="fixed bg-popover border border-border rounded-lg shadow-xl z-[10001] animate-in fade-in-0 zoom-in-95 w-72"
      style={{ top: position.top, left: position.left }}
    >
      {/* Category Tabs */}
      <div className="flex border-b border-border">
        {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
              activeCategory === cat 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {cat === "default" ? "默认" : cat}
          </button>
        ))}
      </div>
      
      {/* Emoji Grid */}
      <div className="p-2 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-10 gap-1">
          {EMOJI_CATEGORIES[activeCategory].map((emoji, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(emoji)
                onOpenChange(false)
              }}
              className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded cursor-pointer text-base transition-transform hover:scale-125 active:scale-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

// Image Preview Component
interface ImagePreviewProps {
  images: CommentImage[]
  onRemove: (id: string) => void
}

function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      {images.map((img) => (
        <div key={img.id} className="relative group">
          <ClickableImage 
            src={img.url} 
            alt="预览图片" 
            className="w-16 h-16 object-cover rounded-md border border-border"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(img.id)
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive/80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

// Hot Comment Badge Component
function HotBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Flame className="w-3.5 h-3.5 text-orange-500" />
      </motion.div>
      <span className="text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
        热评
      </span>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Sparkles className="w-3 h-3 text-amber-400" />
      </motion.div>
    </div>
  )
}

// Send Button with shine effect
interface SendButtonProps {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}

function SendButton({ onClick, disabled, children }: SendButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden px-5 py-2 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
        style={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: isHovered ? 'transform 700ms ease-in-out' : 'transform 0ms'
        }}
      />
    </motion.button>
  )
}

// Comment Item Component
interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, content: string, images?: CommentImage[]) => void
  onLike: (commentId: string) => void
  depth?: number
}

function CommentItem({ comment, onReply, onLike, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyContent, setReplyContent] = React.useState("")
  const [replyImages, setReplyImages] = React.useState<CommentImage[]>([])
  const [showReplies, setShowReplies] = React.useState(true)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const emojiButtonRef = React.useRef<HTMLButtonElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  // Reply folding threshold
  const REPLY_FOLD_THRESHOLD = 3
  const shouldFoldReplies = comment.replies.length > REPLY_FOLD_THRESHOLD && depth === 0
  const visibleReplies = showReplies ? comment.replies : comment.replies.slice(0, REPLY_FOLD_THRESHOLD)

  const handleSubmitReply = () => {
    if (!replyContent.trim() && replyImages.length === 0) return
    onReply(comment.id, replyContent, replyImages)
    setIsReplying(false)
    setReplyContent("")
    setReplyImages([])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          setReplyImages((prev) => [...prev, { id: Date.now().toString() + Math.random(), url, file }])
        }
        reader.readAsDataURL(file)
      }
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeReplyImage = (id: string) => {
    setReplyImages((prev) => prev.filter((img) => img.id !== id))
  }

  const insertEmoji = (emoji: string) => {
    setReplyContent((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  React.useEffect(() => {
    if (isReplying && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isReplying])

  return (
    <div className={cn("group animate-in fade-in slide-in-from-top-2 duration-300", depth > 0 && "mt-4")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border cursor-pointer flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground cursor-pointer">
                {comment.author.name}
              </span>
              {comment.author.role === "author" && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium cursor-default">
                  作者
                </span>
              )}
              {comment.isHot && <HotBadge />}
              <span className="text-xs text-muted-foreground cursor-default">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer focus:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">更多操作</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Flag className="w-3.5 h-3.5" />
                  举报
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quote Reference */}
          {comment.quoteText && (
            <div className="mb-2 text-xs text-muted-foreground border-l-2 border-blue-400/60 pl-3 py-1 bg-blue-400/5 rounded-r italic line-clamp-3">
              &ldquo;{comment.quoteText}&rdquo;
            </div>
          )}

          <div className="text-sm text-foreground/90 leading-relaxed break-words">
            {comment.content}
          </div>

          {/* Comment Images */}
          {comment.images && comment.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.images.map((img) => (
                <ClickableImage
                  key={img.id}
                  src={img.url}
                  alt="评论图片"
                  className="w-20 h-20 object-cover rounded-md border border-border"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onLike(comment.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer",
                comment.isLiked 
                  ? "text-rose-500 hover:text-rose-600" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                 <Heart 
                    className={cn(
                      "w-3.5 h-3.5 transition-all", 
                      comment.isLiked && "fill-current scale-110"
                    )} 
                 />
                 {comment.isLiked && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-full bg-rose-500/20"
                    />
                 )}
              </div>
              <span>{comment.likes || "点赞"}</span>
            </motion.button>
            
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="w-3.5 h-3.5" />
              <span>回复</span>
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        placeholder={`回复 @${comment.author.name}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        maxLength={1000}
                        className="min-h-[80px] text-sm resize-none bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-foreground/10 focus-visible:border-foreground/20 transition-colors pr-12 pb-8"
                      />
                      {/* Emoji picker for reply */}
                      <div className="absolute bottom-2 left-2 z-10">
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
                      </div>
                      {/* Character count and send button */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <span className={cn(
                          "text-xs text-muted-foreground",
                          replyContent.length > 900 && "text-orange-500",
                          replyContent.length >= 1000 && "text-destructive"
                        )}>
                          {replyContent.length}/1000
                        </span>
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
                        <SendButton 
                          onClick={handleSubmitReply}
                          disabled={!replyContent.trim() && replyImages.length === 0}
                        >
                          <Send className="w-3.5 h-3.5" />
                          发送
                        </SendButton>
                      </div>
                    </div>
                    <ImagePreview images={replyImages} onRemove={removeReplyImage} />
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setIsReplying(false)
                          setReplyContent("")
                          setReplyImages([])
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {comment.replies.length > 0 && (
            <div className="pl-3 sm:pl-4 mt-3 ml-4 sm:ml-5 border-l-2 border-border/40">
              {visibleReplies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  depth={depth + 1}
                />
              ))}
              
              {/* Fold/Unfold Replies Button */}
              {shouldFoldReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-2 cursor-pointer py-1"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      收起回复
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      查看全部 {comment.replies.length} 条回复
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Props for CommentSection
interface CommentSectionProps {
  articleId?: string | number
}

// Exported methods for CommentSection
export interface CommentSectionRef {
  addCommentWithQuote: (content: string, images: CommentImage[], quoteText: string) => void
}

// Tab type for sorting
type SortTab = "hot" | "latest"

export const CommentSection = React.forwardRef<CommentSectionRef, CommentSectionProps>(
  function CommentSection({ articleId }, ref) {
  // Generate mock comments based on articleId for AI Agent article (id: 1)
  const getInitialComments = (): Comment[] => {
    if (articleId === 1) {
      return generateAIComments()
    }
    return MOCK_COMMENTS
  }

  const [allComments, setAllComments] = React.useState<Comment[]>(getInitialComments)
  const [newComment, setNewComment] = React.useState("")
  const [newImages, setNewImages] = React.useState<CommentImage[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [showAllComments, setShowAllComments] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<SortTab>("hot")
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const emojiButtonRef = React.useRef<HTMLButtonElement>(null)

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    addCommentWithQuote: (content: string, images: CommentImage[], quoteText: string) => {
      const comment: Comment = {
        id: Date.now().toString(),
        content,
        author: {
          name: "我",
          avatar: "https://github.com/shadcn.png",
          role: "user"
        },
        createdAt: new Date(),
        likes: 0,
        isLiked: false,
        replies: [],
        images: images.length > 0 ? images : undefined,
        quoteText
      }
      setAllComments((prev) => [comment, ...prev])
    }
  }))

  // Comment fold threshold
  const COMMENT_FOLD_THRESHOLD = 5

  // Calculate hot score for a comment (likes + replies * 3)
  const calculateHotScore = (comment: Comment): number => {
    const countReplies = (replies: Comment[]): number => {
      return replies.reduce((acc, r) => acc + 1 + countReplies(r.replies), 0)
    }
    return comment.likes + countReplies(comment.replies) * 3
  }

  // Minimum hot score threshold to be considered as hot comment
  const HOT_COMMENT_THRESHOLD = 10

  // Sort comments based on active tab
  const sortedComments = React.useMemo(() => {
    const commentsWithScore = allComments.map(c => ({
      ...c,
      hotScore: calculateHotScore(c)
    }))

    if (activeTab === "hot") {
      // Sort by hot score descending
      const sorted = [...commentsWithScore].sort((a, b) => b.hotScore - a.hotScore)
      // Mark top 3 as hot only if they meet the threshold
      return sorted.map((c, i) => ({
        ...c,
        isHot: i < 3 && c.hotScore >= HOT_COMMENT_THRESHOLD
      }))
    } else {
      // Sort by time descending
      return [...commentsWithScore].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).map(c => ({ ...c, isHot: false }))
    }
  }, [allComments, activeTab])

  // Helper to update nested comments
  const updateComment = (
    list: Comment[], 
    id: string, 
    updater: (c: Comment) => Comment
  ): Comment[] => {
    return list.map((c) => {
      if (c.id === id) return updater(c)
      if (c.replies.length > 0) {
        return { ...c, replies: updateComment(c.replies, id, updater) }
      }
      return c
    })
  }
  
  // Helper to add reply
  const addReply = (list: Comment[], parentId: string, reply: Comment): Comment[] => {
    return list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, reply] }
      }
      if (c.replies.length > 0) {
        return { ...c, replies: addReply(c.replies, parentId, reply) }
      }
      return c
    })
  }

  const handleLike = (commentId: string) => {
    setAllComments((prev) => 
      updateComment(prev, commentId, (c) => ({
        ...c,
        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
        isLiked: !c.isLiked
      }))
    )
  }

  const handleReply = (parentId: string, content: string, images?: CommentImage[]) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        name: "我",
        avatar: "https://github.com/shadcn.png",
        role: "user"
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
      parentId,
      images
    }
    
    setAllComments((prev) => addReply(prev, parentId, newReply))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          setNewImages((prev) => [...prev, { id: Date.now().toString() + Math.random(), url, file }])
        }
        reader.readAsDataURL(file)
      }
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeNewImage = (id: string) => {
    setNewImages((prev) => prev.filter((img) => img.id !== id))
  }

  const insertEmoji = (emoji: string) => {
    setNewComment((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  const handlePostComment = () => {
    if (!newComment.trim() && newImages.length === 0) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: "我",
        avatar: "https://github.com/shadcn.png",
        role: "user"
      },
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
      images: newImages.length > 0 ? newImages : undefined
    }

    setAllComments((prev) => [comment, ...prev])
    setNewComment("")
    setNewImages([])
  }

  const totalComments = React.useMemo(() => {
    const count = (list: Comment[]): number => {
      return list.reduce((acc, curr) => acc + 1 + count(curr.replies), 0)
    }
    return count(allComments)
  }, [allComments])

  const visibleComments = showAllComments ? sortedComments : sortedComments.slice(0, COMMENT_FOLD_THRESHOLD)
  const hasMoreComments = sortedComments.length > COMMENT_FOLD_THRESHOLD

  return (
    <div className="mt-12 pt-8 border-t border-border/60" id="comments">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          评论 
          <span className="text-sm font-normal text-muted-foreground">
            ({totalComments})
          </span>
        </h2>
      </div>

      {/* Main Comment Input */}
      <div className="flex gap-4 mb-6">
        <Avatar className="h-10 w-10 border border-border hidden sm:block cursor-pointer flex-shrink-0">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="relative">
            <Textarea 
              ref={textareaRef}
              placeholder="平等表达，友善交流..." 
              maxLength={1000}
              className="min-h-[100px] bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-foreground/10 focus-visible:border-foreground/20 transition-colors resize-y pr-12 pb-8"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {/* Emoji Picker */}
            <div className="absolute bottom-2 left-2 z-10">
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
            </div>
            {/* Character count, image upload and send button */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className={cn(
                "text-xs text-muted-foreground",
                newComment.length > 900 && "text-orange-500",
                newComment.length >= 1000 && "text-destructive"
              )}>
                {newComment.length}/1000
              </span>
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
                title="上传图片"
              >
                <ImagePlus className="w-4 h-4" />
              </button>
              <SendButton 
                onClick={handlePostComment}
                disabled={!newComment.trim() && newImages.length === 0}
              >
                <Send className="w-3.5 h-3.5" />
                发送
              </SendButton>
            </div>
          </div>
          <ImagePreview images={newImages} onRemove={removeNewImage} />
        </div>
      </div>

      {/* Tab Switcher - Below Input */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab("hot")}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
            activeTab === "hot"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          最热
        </button>
        <button
          onClick={() => setActiveTab("latest")}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
            activeTab === "latest"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          最新
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-8">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* Load More Comments Button */}
      {hasMoreComments && !showAllComments && (
        <button
          onClick={() => setShowAllComments(true)}
          className="w-full mt-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-border/40 hover:bg-muted/40"
        >
          <ChevronDown className="w-4 h-4" />
          查看全部 {totalComments} 条评论
        </button>
      )}

      {showAllComments && hasMoreComments && (
        <button
          onClick={() => setShowAllComments(false)}
          className="w-full mt-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-border/40 hover:bg-muted/40"
        >
          <ChevronUp className="w-4 h-4" />
          收起评论
        </button>
      )}
      
      {allComments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-border/40 border-dashed">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>暂无评论，快来抢沙发吧！</p>
        </div>
      )}
    </div>
  )
})

// Generate rich mock comments for AI Agent article
function generateAIComments(): Comment[] {
  const now = Date.now()
  const hour = 60 * 60 * 1000
  const day = 24 * hour

  return [
    {
      id: "1",
      content: "这篇文章写得非常详细！Agent 架构部分让我对多 Agent 协作有了全新的认识，已经在我们的客服系统中实践了，效果显著！👍",
      author: {
        name: "架构师老王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=architect",
        role: "user"
      },
      createdAt: new Date(now - 2 * hour),
      likes: 156,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          content: "同感！多 Agent 协作那块讲得很透彻，我们团队正在研究怎么落地 😄",
          author: {
            name: "开发者小李",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer1",
            role: "user"
          },
          createdAt: new Date(now - 1.5 * hour),
          likes: 23,
          isLiked: false,
          replies: [],
          parentId: "1"
        },
        {
          id: "1-2",
          content: "请问你们客服系统用的什么技术栈？我们也在评估方案 🙏",
          author: {
            name: "产品经理张三",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pm",
            role: "user"
          },
          createdAt: new Date(now - 1 * hour),
          likes: 8,
          isLiked: false,
          replies: [
            {
              id: "1-2-1",
              content: "我们用的是 LangChain + GPT-4，搭配 FastAPI 后端。效果还不错，但成本有点高 😅",
              author: {
                name: "架构师老王",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=architect",
                role: "user"
              },
              createdAt: new Date(now - 45 * 60 * 1000),
              likes: 15,
              isLiked: false,
              replies: [],
              parentId: "1-2"
            }
          ],
          parentId: "1"
        },
        {
          id: "1-3",
          content: "这个架构图用什么工具画的？挺清晰的",
          author: {
            name: "设计师小美",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=designer",
            role: "user"
          },
          createdAt: new Date(now - 30 * 60 * 1000),
          likes: 5,
          isLiked: false,
          replies: [],
          parentId: "1"
        },
        {
          id: "1-4",
          content: "Mark 一下，回头细看 📌",
          author: {
            name: "程序员小赵",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=programmer",
            role: "user"
          },
          createdAt: new Date(now - 25 * 60 * 1000),
          likes: 3,
          isLiked: false,
          replies: [],
          parentId: "1"
        },
        {
          id: "1-5",
          content: "hallucination 那块讲得很好，多 Agent 验证确实是目前比较靠谱的方案",
          author: {
            name: "研究员Alan",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=researcher",
            role: "user"
          },
          createdAt: new Date(now - 20 * 60 * 1000),
          likes: 12,
          isLiked: false,
          replies: [],
          parentId: "1"
        }
      ]
    },
    {
      id: "2",
      content: "关于成本优化那块，补充一点：我们团队发现使用 prompt caching 可以降低 30-50% 的 API 成本，值得尝试！",
      author: {
        name: "技术达人Kevin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin",
        role: "user"
      },
      createdAt: new Date(now - 5 * hour),
      likes: 89,
      isLiked: false,
      replies: [
        {
          id: "2-1",
          content: "这个建议太棒了！请问 prompt caching 具体怎么实现？有相关文档吗？",
          author: {
            name: "小白学习者",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=learner",
            role: "user"
          },
          createdAt: new Date(now - 4 * hour),
          likes: 6,
          isLiked: false,
          replies: [
            {
              id: "2-1-1",
              content: "可以看看 Anthropic 的官方文档，他们最近推出了 prompt caching 功能，对长上下文特别有效 📚",
              author: {
                name: "技术达人Kevin",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin",
                role: "user"
              },
              createdAt: new Date(now - 3.5 * hour),
              likes: 18,
              isLiked: false,
              replies: [],
              parentId: "2-1"
            }
          ],
          parentId: "2"
        }
      ]
    },
    {
      id: "3",
      content: "企业落地确实不容易，我们团队花了半年才把 Agent 系统稳定下来。最大的坑是工具调用的稳定性，建议做好充分的 fallback 机制。",
      author: {
        name: "工程总监Lisa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
        role: "user"
      },
      createdAt: new Date(now - 1 * day),
      likes: 67,
      isLiked: false,
      replies: []
    },
    {
      id: "4",
      content: "文章中提到的安全权限控制那块写得很好！很多人忽略了 Agent 的工具权限问题，这确实是企业场景的关键 🔐",
      author: {
        name: "安全专家小陈",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=security",
        role: "user"
      },
      createdAt: new Date(now - 1.5 * day),
      likes: 45,
      isLiked: false,
      replies: [
        {
          id: "4-1",
          content: "确实，我们公司就踩过坑，Agent 把测试数据库删了 😱 幸好有备份",
          author: {
            name: "运维小哥",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ops",
            role: "user"
          },
          createdAt: new Date(now - 1.2 * day),
          likes: 34,
          isLiked: false,
          replies: [],
          parentId: "4"
        }
      ]
    },
    {
      id: "5",
      content: "RAG + Agent 的组合拳是目前最实用的方案，我们做智能问答效果提升了很多 ✨",
      author: {
        name: "算法工程师Mike",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        role: "user"
      },
      createdAt: new Date(now - 2 * day),
      likes: 38,
      isLiked: false,
      replies: []
    },
    {
      id: "6",
      content: "请问多模态 Agent 这块有没有推荐的开源项目？想学习一下 🙏",
      author: {
        name: "学生小王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
        role: "user"
      },
      createdAt: new Date(now - 2.5 * day),
      likes: 22,
      isLiked: false,
      replies: [
        {
          id: "6-1",
          content: "可以看看 LLaVA、MiniGPT-4 这类项目，社区很活跃 🔥",
          author: {
            name: "开源爱好者",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=opensource",
            role: "user"
          },
          createdAt: new Date(now - 2.3 * day),
          likes: 15,
          isLiked: false,
          replies: [],
          parentId: "6"
        }
      ]
    },
    {
      id: "7",
      content: "很好的总结！不过感觉对未来展望那块可以再深入一点，比如 Agent 自动化程度的天花板在哪里？",
      author: {
        name: "哲学思考者",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=philosopher",
        role: "user"
      },
      createdAt: new Date(now - 3 * day),
      likes: 19,
      isLiked: false,
      replies: []
    },
    {
      id: "8",
      content: "我们团队最近也在探索 Agent 在财务场景的应用，审批流程自动化效果不错，但准确性还需要打磨 💼",
      author: {
        name: "财务科技从业者",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=finance",
        role: "user"
      },
      createdAt: new Date(now - 3.5 * day),
      likes: 28,
      isLiked: false,
      replies: []
    }
  ]
}

// Default mock comments for other articles
const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    content: "这篇文章写得非常详细，对我帮助很大！特别是关于架构设计的部分，解决了我一直以来的困惑。",
    author: {
      name: "张三",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      role: "user"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        content: "同感，架构图画得很清晰。",
        author: {
          name: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
          role: "user"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        likes: 3,
        isLiked: true,
        replies: [],
        parentId: "1"
      }
    ]
  },
  {
    id: "2",
    content: "建议补充一下具体落地的案例，理论部分已经很完美了。",
    author: {
      name: "王五",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jude",
      role: "user"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 5,
    isLiked: false,
    replies: []
  }
]

// Export ClickableImage and ImageLightbox for use in other components
export { ClickableImage, ImageLightbox }
