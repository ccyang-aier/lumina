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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage, Confidence } from "@/lib/alchemy-data"
import { INITIAL_CHAT } from "@/lib/alchemy-data"

// ─── Suggested Questions ──────────────────────────────────────────────────────

const SUGGEST_QUESTIONS = [
  "React Server Components 和 Client Components 怎么选？",
  "useCallback 在什么情况下真正有优化效果？",
  "Kafka 消息重复消费怎么避免？",
]

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
          return (
            <button
              key={i}
              onClick={() => cardId && onCitationClick?.(cardId)}
              className={cn(
                "inline-flex items-center justify-center text-[10px] font-bold rounded px-1 py-0 mx-0.5 transition-colors",
                highlightedCitation === cardId
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60"
              )}
            >
              {part}
            </button>
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
        "border-l-2 pl-4 transition-all",
        streaming
          ? `${cfg?.pulseColor ?? "border-l-gray-300"} animate-pulse`
          : cfg?.borderColor ?? "border-l-gray-300"
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
              : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
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
        <div className="max-w-[78%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mt-0.5">
        <Sparkles className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Confidence label */}
        {cfg && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {cfg.icon}
            <span className={cn("text-[11px] font-medium", cfg.labelColor)}>
              {cfg.label}
            </span>
            {msg.confidenceScore && msg.confidenceScore > 0 && (
              <span className="text-[11px] text-muted-foreground">
                · {Math.round(msg.confidenceScore * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Message body */}
        <div className="bg-card/60 rounded-2xl rounded-tl-sm border border-border/50 px-4 py-3">
          {isStreaming ? (
            <StreamingMessage
              fullContent={msg.content}
              confidence={msg.confidence}
              onComplete={onStreamComplete ?? (() => {})}
            />
          ) : (
            <div
              className={cn(
                "border-l-2 pl-4",
                cfg?.borderColor ?? "border-l-transparent"
              )}
            >
              <MessageContent
                content={msg.content}
                onCitationClick={onCitationClick}
                highlightedCitation={highlightedCitation}
                citationIds={msg.citations}
              />
            </div>
          )}

          {/* Medium confidence warning */}
          {msg.confidence === "medium" && !isStreaming && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/8 rounded-lg px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              建议核实：部分内容基于通用知识推断，可能与贵公司内部规范有差异
            </div>
          )}

          {/* Low confidence warning */}
          {msg.confidence === "low" && !isStreaming && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/8 rounded-lg px-3 py-2">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              ⚠️ 我对此不太确定，建议参考原文或咨询领域专家
            </div>
          )}

          {/* None confidence */}
          {msg.confidence === "none" && !isStreaming && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              ⚠️ 未找到知识库支撑来源，内容来自通用知识，不建议直接用于正式文档
            </div>
          )}
        </div>

        {/* Gap result special UI */}
        {msg.isGapResult && !isStreaming && (
          <GapBanner onClaim={onGapClaim ?? (() => {})} />
        )}

        {/* Action bar */}
        {!isStreaming && (
          <div className="flex items-center gap-1 mt-1.5 px-1">
            {[
              { icon: <ThumbsUp className="h-3.5 w-3.5" />, label: "有帮助" },
              { icon: <ThumbsDown className="h-3.5 w-3.5" />, label: "不准确" },
              { icon: <ExternalLink className="h-3.5 w-3.5" />, label: "查看原文" },
              { icon: <BookmarkPlus className="h-3.5 w-3.5" />, label: "保存为卡片" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent/40 transition-colors"
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            ))}
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

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    // Mock AI response
    const mockResponses: ChatMessage[] = [
      {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: `这是一个很好的问题。根据知识库中的相关资料，${input.trim()} 涉及到以下几个核心要点：\n\n**1. 核心原理**\n在实际项目中，需要理解底层机制才能做出正确决策。相关文档[1]有详细阐述。\n\n**2. 最佳实践**\n团队已有成熟的实践积累，建议参考 \`内部规范文档\` 中的标准方案[2]。\n\n**3. 注意事项**\n需要特别关注边界情况和错误处理，避免在生产环境中出现不可预期的问题。`,
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const scopes = ["全局知识库", "我的公会", "我的卡片"]

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Lumina AI · 问答模式</span>
          <span className="text-muted-foreground/40">·</span>
          <select
            value={knowledgeScope}
            onChange={(e) => setKnowledgeScope(e.target.value)}
            className="text-xs text-muted-foreground bg-transparent border-0 outline-none cursor-pointer hover:text-foreground transition-colors"
          >
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/40 transition-colors"
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
            <h3 className="text-lg font-semibold mb-1">Lumina AI 问答</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              基于知识库的深度问答，每个回答都有可溯源的知识依据
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {SUGGEST_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-foreground/30 hover:bg-accent/40 transition-all text-muted-foreground hover:text-foreground"
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
                  className="w-full text-left text-sm px-4 py-2.5 hover:bg-accent/40 transition-colors border-b border-border/40 last:border-0"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2">
          {/* Text input */}
          <div className="relative flex rounded-xl border border-border/60 bg-card/60 focus-within:border-foreground/20 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题... (Enter 发送，Shift+Enter 换行)"
              rows={2}
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 min-h-[72px] max-h-[200px]"
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSuggest(!showSuggest)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-accent/40 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                追问建议
                <ChevronDown className="h-3 w-3" />
              </button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVoice(!isVoice)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isVoice
                    ? "bg-red-500/20 text-red-500 animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  input.trim() && !isStreaming
                    ? "bg-foreground text-background hover:opacity-90 active:scale-95"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
