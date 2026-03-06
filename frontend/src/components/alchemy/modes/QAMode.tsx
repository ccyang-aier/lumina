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
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Copy,
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

// ─── Message Content (with inline citations) ──────────────────────────────────

function MessageContent({
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
  // Replace [1], [2] with clickable spans
  const parts = content.split(/(\[\d+\])/g)
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/)
        if (match && citationIds) {
          const idx = parseInt(match[1]) - 1
          const cardId = citationIds[idx]
          const cardData = MOCK_CARDS[cardId]

          return (
            <HoverCard key={i} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button
                  onClick={() => cardId && onCitationClick?.(cardId)}
                  className={cn(
                    "inline-flex items-center justify-center text-[10px] font-bold rounded px-1 py-0 mx-0.5 transition-colors cursor-pointer",
                    highlightedCitation === cardId
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60"
                  )}
                >
                  {part}
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-[320px] p-0 border-none bg-transparent shadow-none" side="top" align="start">
                {cardData ? (
                  <div className="bg-background rounded-xl shadow-xl border border-border overflow-hidden">
                    <KnowledgeCard {...cardData} className="h-auto scale-90 origin-top-left w-[110%]" />
                  </div>
                ) : (
                  <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs shadow-md border border-border">
                    知识卡片 ID: {cardId} (暂无预览)
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          )
        }
        // Handle bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
        return (
          <span key={i}>
            {boldParts.map((bp, j) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return <strong key={j}>{bp.slice(2, -2)}</strong>
              }
              // Handle code
              const codeParts = bp.split(/(`[^`]+`)/g)
              return (
                <span key={j}>
                  {codeParts.map((cp, k) => {
                    if (cp.startsWith("`") && cp.endsWith("`")) {
                      return (
                        <code
                          key={k}
                          className="px-1 py-0.5 rounded text-[12px] font-mono bg-muted/60 text-foreground/90"
                        >
                          {cp.slice(1, -1)}
                        </code>
                      )
                    }
                    return <span key={k}>{cp}</span>
                  })}
                </span>
              )
            })}
          </span>
        )
      })}
    </div>
  )
}

// ─── Streaming Message ────────────────────────────────────────────────────────

function StreamingMessage({
  fullContent,
  confidence,
  onComplete,
}: {
  fullContent: string
  confidence?: Confidence
  onComplete: () => void
}) {
  const [displayed, setDisplayed] = useState("")
  const [streaming, setStreaming] = useState(true)
  const idxRef = useRef(0)
  const cfg = getConfidenceConfig(confidence)

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
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {displayed}
        {streaming && (
          <span className="inline-block w-0.5 h-4 bg-foreground/60 ml-0.5 animate-[blink-cursor_1s_step-end_infinite]" />
        )}
      </div>
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
}: {
  msg: ChatMessage
  isStreaming?: boolean
  onStreamComplete?: () => void
  onCitationClick?: (id: string) => void
  highlightedCitation?: string
  onGapClaim?: () => void
}) {
  const cfg = getConfidenceConfig(msg.confidence)

  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[78%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
              onComplete={onStreamComplete ?? (() => {})}
            />
          ) : (
             <MessageContent
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
            <TooltipProvider>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {[
                  { icon: Copy, label: "复制" },
                  { icon: RefreshCw, label: "重新生成" },
                  { icon: ThumbsUp, label: "有帮助" },
                  { icon: ThumbsDown, label: "不准确" },
                ].map((action, idx) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
                      >
                        <action.icon className="h-3.5 w-3.5" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
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
          <RotateCcw className="h-3.5 w-3.5" />
          新对话
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-16"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-4">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">AI Agent · 问答</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              基于知识库的深度问答，每个回答都有可溯源的知识依据
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {SUGGEST_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-foreground/30 hover:bg-accent/40 transition-all text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map((msg) => (
          <Message
            key={msg.id}
            msg={msg}
            isStreaming={msg.id === streamingMsgId}
            onStreamComplete={msg.id === streamingMsgId ? handleStreamComplete : undefined}
            onCitationClick={onCitationClick}
            highlightedCitation={highlightedCitation}
            onGapClaim={() => {}}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-5 py-4 border-t border-border/40 shrink-0">
        <div className="w-full mx-auto">
          {/* Suggestion Toggle - Moved to top left */}
          <div className="flex items-center justify-between mb-2 px-1">
             <button
               onClick={() => setShowSuggest(!showSuggest)}
               className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer"
             >
               <Sparkles className="h-3.5 w-3.5" />
               追问建议
               <ChevronDown className={cn("h-3 w-3 transition-transform", showSuggest ? "rotate-180" : "")} />
             </button>
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggest && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mb-2 bg-card border border-border rounded-xl overflow-hidden shadow-lg"
              >
                {SUGGEST_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      setShowSuggest(false)
                    }}
                    className="w-full text-left text-sm px-4 py-2.5 hover:bg-accent/40 transition-colors border-b border-border/40 last:border-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AiChatInput
            value={input}
            onChange={setInput}
            onSend={(msg) => handleSend(msg)}
            placeholder="输入你的问题... (Enter 发送)"
            className="w-full"
          />
          
        </div>
      </div>
    </div>
  )
}
