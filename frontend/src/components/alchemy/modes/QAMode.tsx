"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Mic,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  BookmarkPlus,
  ChevronDown,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Copy,
  Eye,
  FileText,
  Loader2,
  Check,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage, Confidence } from "@/lib/alchemy-data"
import { INITIAL_CHAT } from "@/lib/alchemy-data"
import { AiChatInput } from "@/components/design/AiChatInput"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { KnowledgeCard, type KnowledgeCardProps } from "@/components/knowledge/KnowledgeCard"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "@/components/knowledge/KnowledgeDetail/CodeBlock"

// ─── Colors & Helpers ──────────────────────────────────────────────────────────

const CARD_TYPE_COLORS: Record<string, { iconBg: string; badgeBg: string }> = {
  document: {
    iconBg: "bg-blue-500/10 text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  tutorial: {
    iconBg: "bg-emerald-500/10 text-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark dark:text-violet-400",
  },
  default: {
    iconBg: "bg-primary/10 text-primary",
    badgeBg: "bg-muted text-muted-foreground",
  },
}

function Tip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 3, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.88 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-0.5 text-[10px] font-medium text-background shadow-md z-50"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionBtn({
  children,
  onClick,
  active,
  activeColor,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  activeColor?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.72 }}
      className={cn(
        "flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent",
        active
          ? activeColor ?? "text-foreground"
          : "text-muted-foreground/50 hover:text-foreground/80"
      )}
    >
      {children}
    </motion.button>
  )
}

function formatTime(date: Date) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

// ─── Suggested Questions ──────────────────────────────────────────────────────

const SUGGEST_QUESTIONS = [
  "React Server Components 和 Client Components 怎么选？",
  "useCallback 在什么情况下真正有优化效果？",
  "Kafka 消息重复消费怎么避免？",
]

// ─── Mock Knowledge Cards ─────────────────────────────────────────────────────

const MOCK_CARDS: Record<string, KnowledgeCardProps> = {
  "kc-001": {
    id: "kc-001",
    title: "React Server Components 详解",
    description: "深入解析 RSC 的渲染机制与性能优势，对比 CSR 与 SSR 的区别。",
    tags: ["React", "Performance", "Architecture"],
    type: "document",
    author: { name: "Dan A.", avatar: "", guild: "React Core" },
    publishDate: "2024-02-20",
    stats: { views: 5432, likes: 230, comments: 45 },
    location: { series: "React 进阶", chapter: "核心概念" }
  },
  "kc-005": {
    id: "kc-005",
    title: "前端工程化最佳实践",
    description: "从 Monorepo 到微前端，构建现代化前端架构的完整指南。",
    tags: ["Engineering", "Infrastructure"],
    type: "tutorial",
    author: { name: "Engineering Team" },
    publishDate: "2024-01-15",
    stats: { views: 3200, likes: 150, comments: 28 },
    location: { series: "架构设计", chapter: "工程化" }
  }
}

// ─── Confidence Config ────────────────────────────────────────────────────────

function getConfidenceConfig(confidence?: Confidence) {
  switch (confidence) {
    case "high":
      return {
        borderColor: "border-l-blue-500",
        pulseColor: "border-l-blue-400",
        icon: <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />,
        label: "高置信",
        labelColor: "text-blue-500",
      }
    case "medium":
      return {
        borderColor: "border-l-amber-500",
        pulseColor: "border-l-amber-400",
        icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
        label: "中置信",
        labelColor: "text-amber-500",
      }
    case "low":
      return {
        borderColor: "border-l-red-500",
        pulseColor: "border-l-red-400",
        icon: <XCircle className="h-3.5 w-3.5 text-red-500" />,
        label: "低置信",
        labelColor: "text-red-500",
      }
    case "none":
      return {
        borderColor: "border-l-gray-400",
        pulseColor: "border-l-gray-300",
        icon: <HelpCircle className="h-3.5 w-3.5 text-gray-400" />,
        label: "无来源",
        labelColor: "text-gray-400",
      }
    default:
      return null
  }
}

// ─── Citation Hover Card ──────────────────────────────────────────────────────

function CitationHoverCard({
  cardId,
  children,
  highlightedCitation,
  onCitationClick
}: {
  cardId: string
  children: React.ReactNode
  highlightedCitation?: string
  onCitationClick?: (id: string) => void
}) {
  const cardData = MOCK_CARDS[cardId]
  const colors = cardData ? (CARD_TYPE_COLORS[cardData.type] || CARD_TYPE_COLORS.default) : CARD_TYPE_COLORS.default

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          onClick={() => cardId && onCitationClick?.(cardId)}
          className={cn(
            "inline-flex items-center justify-center text-[10px] font-bold rounded px-1 py-0 mx-0.5 transition-colors cursor-pointer align-super",
            highlightedCitation === cardId
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60"
          )}
        >
          {children}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[280px] p-0 border border-border/60 bg-card/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden" side="top" align="start" sideOffset={8}>
        {cardData ? (
          <div className="p-3">
            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              <div className={cn("shrink-0 h-8 w-8 rounded-lg flex items-center justify-center", colors.iconBg)}>
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold leading-tight line-clamp-2 mb-1">{cardData.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded uppercase font-medium", colors.badgeBg)}>
                    {cardData.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {cardData.publishDate}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-3 leading-relaxed">
              {cardData.description}
            </p>
            
            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Eye className="h-3 w-3" /> {cardData.stats.views}
                </span>
                <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3 w-3" /> {cardData.stats.likes}
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 shrink-0" />
                <span className="text-[10px] font-medium text-foreground/80 truncate max-w-[80px]">
                  {cardData.author.name}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 text-xs text-muted-foreground text-center italic">
            找不到知识卡片数据 (ID: {cardId})
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

// ─── Markdown Message Component ────────────────────────────────────────────────

function MarkdownMessage({
  content,
  onCitationClick,
  highlightedCitation,
  citationIds,
}: {
  content: string
  onCitationClick?: (id: string) => void
  highlightedCitation?: string
  citationIds?: string[]
}) {
  // Pre-process citations: [1] -> [1](citation:0)
  const processedContent = content.replace(/\[(\d+)\]/g, (match, num) => {
    const idx = parseInt(num) - 1;
    // Check if valid index
    if (citationIds && idx >= 0 && idx < citationIds.length) {
      return `[${match}](citation:${idx})`
    }
    return match
  });

  return (
    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed
        prose-p:mb-3 prose-p:last:mb-0
        prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
        prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2
        prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2
        prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0
        prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:bg-muted/60 prose-code:text-foreground/90 prose-code:text-[12px]
        prose-code:before:content-none prose-code:after:content-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
           const match = /language-(\w+)/.exec(className || "")
           const isInline = inline || !match
           if (isInline) {
             return (
               <code className={className} {...props}>
                 {children}
               </code>
             )
           }
           return (
             <CodeBlock
               rawCode={String(children).replace(/\n$/, "")}
               language={match?.[1] || 'text'}
               className="my-4 rounded-lg overflow-hidden border border-border/50 shadow-sm"
             >
               <div className="p-4 bg-zinc-950/90 text-zinc-100 overflow-x-auto text-xs font-mono">
                 <code className={className} {...props}>
                   {children}
                 </code>
               </div>
             </CodeBlock>
           )
        },
        a({ node, href, children, ...props }) {
          if (href?.startsWith("citation:")) {
            const idx = parseInt(href.split(":")[1])
            const cardId = citationIds?.[idx]
            
            if (cardId) {
              return (
                <CitationHoverCard 
                  cardId={cardId} 
                  highlightedCitation={highlightedCitation}
                  onCitationClick={onCitationClick}
                >
                  {/* Remove brackets from children if needed, but [1] is fine */}
                  {/* Actually children will be [1] */}
                  {String(children).replace(/^\[(\d+)\]$/, '$1')}
                </CitationHoverCard>
              )
            }
          }
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary underline underline-offset-4 hover:text-primary/80" 
              {...props}
            >
              {children}
            </a>
          )
        },
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 my-2 space-y-1 marker:text-muted-foreground" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 my-2 space-y-1 marker:text-muted-foreground" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="pl-1" {...props} />
        ),
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-6 mb-3 text-foreground" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-2 text-foreground" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2 text-foreground" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground" {...props} />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
    </div>
  )
}

// ─── Streaming Message ────────────────────────────────────────────────────────

function StreamingMessage({
  fullContent,
  confidence,
  citationIds,
  onComplete,
}: {
  fullContent: string
  confidence?: Confidence
  citationIds?: string[]
  onComplete: () => void
}) {
  const [displayed, setDisplayed] = useState("")
  const [streaming, setStreaming] = useState(true)
  const idxRef = useRef(0)
  
  useEffect(() => {
    idxRef.current = 0
    setDisplayed("")
    setStreaming(true)

    const interval = setInterval(() => {
      if (idxRef.current < fullContent.length) {
        const charsPerTick = Math.floor(Math.random() * 3) + 1
        idxRef.current = Math.min(idxRef.current + charsPerTick, fullContent.length)
        setDisplayed(fullContent.slice(0, idxRef.current))
      } else {
        setStreaming(false)
        clearInterval(interval)
        onComplete()
      }
    }, 25)

    return () => clearInterval(interval)
  }, [fullContent, onComplete])

  return (
    <div
      className={cn(
        "transition-all",
        streaming && "animate-pulse"
      )}
    >
      <MarkdownMessage 
        content={displayed} 
        citationIds={citationIds}
      />
      {streaming && (
        <span className="inline-block w-0.5 h-4 bg-foreground/60 ml-0.5 animate-[blink-cursor_1s_step-end_infinite]" />
      )}
    </div>
  )
}

// ─── Gap Result Banner ────────────────────────────────────────────────────────

function GapBanner({ onClaim }: { onClaim: () => void }) {
  const [claimed, setClaimed] = useState(false)
  const [points, setPoints] = useState(false)

  function handleClaim() {
    setClaimed(true)
    setPoints(true)
    onClaim()
    setTimeout(() => setPoints(false), 2000)
  }

  return (
    <div className="mt-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground mb-2">
        📎 找到 2 张相关卡片供参考：
      </p>
      <div className="space-y-1.5 mb-3">
        {["Kubernetes 服务治理基础", "微服务网格架构概论"].map((title) => (
          <div
            key={title}
            className="text-xs px-2 py-1.5 rounded bg-accent/40 text-foreground/70 flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
            {title}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClaim}
          disabled={claimed}
          className={cn(
            "relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
            claimed
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default"
              : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95 cursor-pointer"
          )}
        >
          {claimed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              已认领，感谢你！
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5" />
              认领这个缺口 +50积分
            </>
          )}
          <AnimatePresence>
            {points && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -24 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-sm pointer-events-none whitespace-nowrap"
              >
                +50 ✨
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

// ─── Single Message ───────────────────────────────────────────────────────────

function Message({
  msg,
  isStreaming,
  onStreamComplete,
  onCitationClick,
  highlightedCitation,
  onGapClaim,
  isLast,
}: {
  msg: ChatMessage
  isStreaming?: boolean
  onStreamComplete?: () => void
  onCitationClick?: (id: string) => void
  highlightedCitation?: string
  onGapClaim?: () => void
  isLast?: boolean
}) {
  const cfg = getConfidenceConfig(msg.confidence)
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState<"up" | "down" | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    if (regenerating) return
    setRegenerating(true)
    setTimeout(() => setRegenerating(false), 900)
  }

  const handleVote = (dir: "up" | "down") => {
    setVote((v) => (v === dir ? null : dir))
  }

  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end w-full"
      >
        <div className="group relative max-w-[78%]">
          <div className="bg-muted/60 text-foreground border border-border/50 rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
          <span className="mt-1 block text-right text-[10px] text-muted-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 group"
    >
      {/* Avatar */}
      <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mt-1 shadow-sm">
        <Sparkles className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Message body */}
        <div className="text-sm leading-relaxed text-foreground/90">
          {isStreaming ? (
            <StreamingMessage
              fullContent={msg.content}
              confidence={msg.confidence}
              citationIds={msg.citations}
              onComplete={onStreamComplete ?? (() => {})}
            />
          ) : (
             <MarkdownMessage
                content={msg.content}
                onCitationClick={onCitationClick}
                highlightedCitation={highlightedCitation}
                citationIds={msg.citations}
              />
          )}
        </div>

        {/* Warnings */}
        {msg.confidence === "medium" && !isStreaming && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 w-fit">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>建议核实：部分内容基于通用知识推断</span>
          </div>
        )}

        {msg.confidence === "low" && !isStreaming && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 rounded-lg px-3 py-2 w-fit">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            <span>我对此不太确定，建议参考原文</span>
          </div>
        )}

        {msg.confidence === "none" && !isStreaming && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 w-fit">
            <HelpCircle className="h-3.5 w-3.5 shrink-0" />
            <span>内容来自通用知识</span>
          </div>
        )}

        {/* Gap result special UI */}
        {msg.isGapResult && !isStreaming && (
          <GapBanner onClaim={onGapClaim ?? (() => {})} />
        )}

        {/* Bottom Metadata & Actions */}
        {!isStreaming && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
             {/* Confidence Label - Only if valid */}
             {cfg && msg.confidence !== 'none' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/30 text-xs">
                {cfg.icon}
                <span className={cn("font-medium", cfg.labelColor)}>
                  {cfg.label}
                </span>
                {msg.confidenceScore && msg.confidenceScore > 0 && (
                  <span className="text-muted-foreground">
                    {Math.round(msg.confidenceScore * 100)}%
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={cn(
              "flex items-center gap-0.5 transition-opacity duration-200",
              isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              {/* Copy */}
              <Tip label={copied ? "已复制" : "复制"}>
                <ActionBtn onClick={handleCopy} active={copied} activeColor="text-emerald-500">
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check size={14} strokeWidth={2.2} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy size={14} strokeWidth={1.8} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </ActionBtn>
              </Tip>

              {/* Regenerate */}
              <Tip label="重新生成">
                <ActionBtn onClick={handleRegenerate} active={regenerating} activeColor="text-sky-500">
                  <motion.span
                    animate={{ rotate: regenerating ? 360 : 0 }}
                    transition={regenerating ? { duration: 0.7, ease: "linear" } : { duration: 0 }}
                  >
                    {regenerating
                      ? <Loader2 size={14} strokeWidth={1.8} />
                      : <RotateCcw size={14} strokeWidth={1.8} />
                    }
                  </motion.span>
                </ActionBtn>
              </Tip>

              {/* Thumbs Up */}
              <Tip label={vote === "up" ? "取消赞" : "赞"}>
                <ActionBtn
                  onClick={() => handleVote("up")}
                  active={vote === "up"}
                  activeColor="text-emerald-500"
                >
                  <motion.span
                    animate={vote === "up" ? { scale: [1, 1.45, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ThumbsUp
                      size={14}
                      strokeWidth={1.8}
                      fill={vote === "up" ? "currentColor" : "none"}
                    />
                  </motion.span>
                </ActionBtn>
              </Tip>

              {/* Thumbs Down */}
              <Tip label={vote === "down" ? "取消踩" : "踩"}>
                <ActionBtn
                  onClick={() => handleVote("down")}
                  active={vote === "down"}
                  activeColor="text-rose-400"
                >
                  <motion.span
                    animate={vote === "down" ? { scale: [1, 1.45, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ThumbsDown
                      size={14}
                      strokeWidth={1.8}
                      fill={vote === "down" ? "currentColor" : "none"}
                    />
                  </motion.span>
                </ActionBtn>
              </Tip>

              <span className="ml-2 text-[10px] text-muted-foreground/40">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main QA Mode ─────────────────────────────────────────────────────────────

interface QAModeProps {
  onConfidenceChange: (score: number, confidence: Confidence, citationIds: string[]) => void
  highlightedCitation?: string
  onCitationClick?: (id: string) => void
}

export function QAMode({
  onConfidenceChange,
  highlightedCitation,
  onCitationClick,
}: QAModeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT)
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)
  const [knowledgeScope, setKnowledgeScope] = useState("全局知识库")
  const [showSuggest, setShowSuggest] = useState(false)
  const [isVoice, setIsVoice] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Set initial confidence from mock data
  useEffect(() => {
    const lastAI = [...INITIAL_CHAT].reverse().find((m) => m.role === "ai")
    if (lastAI && lastAI.confidence && lastAI.confidenceScore !== undefined) {
      onConfidenceChange(lastAI.confidenceScore, lastAI.confidence, lastAI.citations ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = useCallback((msgContent?: string) => {
    const content = typeof msgContent === 'string' ? msgContent : input
    if (!content.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    // Mock AI response
    const mockResponses: ChatMessage[] = [
      {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: `这是一个很好的问题。根据知识库中的相关资料，${content.trim()} 涉及到以下几个核心要点：\n\n**1. 核心原理**\n在实际项目中，需要理解底层机制才能做出正确决策。相关文档[1]有详细阐述。\n\n**2. 最佳实践**\n团队已有成熟的实践积累，建议参考 \`内部规范文档\` 中的标准方案[2]。\n\n**3. 注意事项**\n需要特别关注边界情况和错误处理，避免在生产环境中出现不可预期的问题。`,
        confidence: "high",
        confidenceScore: 0.88,
        citations: ["kc-001", "kc-005"],
        timestamp: new Date(),
      },
    ]

    const aiMsg = mockResponses[0]
    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput("")
    setIsStreaming(true)
    setStreamingMsgId(aiMsg.id)
  }, [input, isStreaming])

  const handleStreamComplete = useCallback(() => {
    setIsStreaming(false)
    setStreamingMsgId(null)
    const aiMsg = messages.find((m) => m.id === streamingMsgId)
    // Find latest ai message
    setMessages((prev) => {
      const last = [...prev].reverse().find((m) => m.role === "ai")
      if (last?.confidence && last.confidenceScore !== undefined) {
        onConfidenceChange(last.confidenceScore, last.confidence, last.citations ?? [])
      }
      return prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingMsgId, onConfidenceChange])



  const scopes = ["全局知识库", "我的公会", "我的卡片"]

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">AI Agent · 问答模式</span>
          <span className="text-muted-foreground/40">·</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
                {knowledgeScope}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {scopes.map((s) => (
                <DropdownMenuItem key={s} onClick={() => setKnowledgeScope(s)} className="cursor-pointer">
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/40 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          清除对话
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <Message
              key={msg.id}
              msg={msg}
              isStreaming={isStreaming && msg.id === streamingMsgId}
              onStreamComplete={handleStreamComplete}
              onCitationClick={onCitationClick}
              highlightedCitation={highlightedCitation}
              isLast={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-5 pt-0 shrink-0">
        {/* Suggestions */}
        <AnimatePresence>
          {messages.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {SUGGEST_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-accent/40 text-foreground/80 hover:bg-accent hover:text-foreground transition-colors border border-border/40"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AiChatInput
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={() => handleSend()}
            placeholder="问点什么... (支持 Shift + Enter 换行)"
            minHeight={52}
            maxHeight={200}
            disabled={isStreaming}
            rightElement={
              <div className="flex items-center gap-1.5 pr-2">
                 <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-2 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsVoice(!isVoice)}
                      >
                        <Mic className={cn("h-4 w-4", isVoice && "text-red-500 animate-pulse")} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>语音输入</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
                        <Paperclip className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>上传附件</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isStreaming}
                  className={cn(
                    "ml-1 p-2 rounded-xl transition-all duration-200 flex items-center justify-center",
                    input.trim() && !isStreaming
                      ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            }
          />
          
          <div className="absolute -bottom-5 right-1 text-[10px] text-muted-foreground/40">
             Lumina AI Generate v2.4
          </div>
        </div>
      </div>
    </div>
  )
}
