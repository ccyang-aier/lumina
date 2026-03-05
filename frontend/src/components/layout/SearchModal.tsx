"use client"

import * as React from "react"
import {
  Search,
  Clock,
  Flame,
  Star,
  CircleDashed,
  FileText,
  Users,
  User,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Upload,
  BookOpen,
  Hash,
  ChevronRight,
  ShieldCheck,
  UserCircle2,
  Heart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface KnowledgeDomain {
  id: string
  label: string
  color: string
}

interface SearchResultItem {
  id: string
  title: string
  type: string
  matchScore: number
  tags?: string[]
}

interface SearchResultGroup {
  key: string
  label: string
  icon: React.ReactNode
  itemIcon: React.ReactNode
  count: number
  items: SearchResultItem[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const KNOWLEDGE_DOMAINS: KnowledgeDomain[] = [
  { id: "ai", label: "人工智能", color: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20" },
  { id: "eng", label: "工程技术", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { id: "product", label: "产品设计", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { id: "data", label: "数据分析", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { id: "security", label: "信息安全", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  { id: "management", label: "管理运营", color: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20" },
]

const QUICK_ENTRIES = [
  { id: "recent", label: "最近浏览", icon: Clock },
  { id: "hot", label: "本周热门", icon: Flame },
  { id: "starred", label: "我的收藏", icon: Star },
  { id: "follows", label: "我的关注", icon: Heart },
]

const RECENT_SEARCHES = ["Lumina 设计系统", "微服务架构指南", "React 性能优化"]

function getMockResults(query: string): SearchResultGroup[] {
  if (!query.trim()) return []
  return [
    {
      key: "cards",
      label: "知识卡片",
      icon: <FileText className="h-3.5 w-3.5" />,
      itemIcon: <FileText className="h-3.5 w-3.5" />,
      count: 12,
      items: [
        { id: "1", title: `${query}：核心概念与实践指南`, type: "文档", matchScore: 98, tags: ["入门", "实践"] },
        { id: "2", title: `深入理解${query}的底层原理`, type: "研究", matchScore: 91, tags: ["进阶"] },
        { id: "3", title: `${query}在实际项目中的应用案例`, type: "案例", matchScore: 84 },
      ],
    },
    {
      key: "guilds",
      label: "公会",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      itemIcon: <ShieldCheck className="h-3.5 w-3.5" />,
      count: 3,
      items: [
        { id: "g1", title: `${query}爱好者公会`, type: "公会", matchScore: 95 },
        { id: "g2", title: `技术探索者联盟`, type: "公会", matchScore: 72 },
      ],
    },
    {
      key: "users",
      label: "用户",
      icon: <UserCircle2 className="h-3.5 w-3.5" />,
      itemIcon: <UserCircle2 className="h-3.5 w-3.5" />,
      count: 5,
      items: [
        { id: "u1", title: `${query}领域专家 · TechMaster`, type: "专家", matchScore: 88 },
        { id: "u2", title: `${query}研究者 · DataNinja`, type: "研究者", matchScore: 76 },
      ],
    },
  ]
}

// ─── Highlight keyword ─────────────────────────────────────────────────────────

function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 dark:bg-primary/30 text-primary rounded-[3px] px-0.5 font-semibold not-italic">
        {text.slice(idx, idx + keyword.length)}
      </mark>
      {text.slice(idx + keyword.length)}
    </span>
  )
}

// ─── Match score dots ─────────────────────────────────────────────────────────

function MatchDots({ score }: { score: number }) {
  const filled = score >= 90 ? 3 : score >= 75 ? 2 : 1
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            i < filled
              ? "bg-primary/70 dark:bg-primary/80"
              : "bg-foreground/10 dark:bg-white/10"
          )}
        />
      ))}
    </div>
  )
}

// ─── 9-Grid Loading Animation ─────────────────────────────────────────────────

const GRID_DELAYS = [0, 0.075, 0.15, 0.225, 0.3, 0.375, 0.45, 0.525, 0.6]

function SearchLoader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center justify-center gap-5 py-16"
    >
      <div className="relative h-[34px] w-[34px]">
        {GRID_DELAYS.map((delay, i) => {
          const row = Math.floor(i / 3)
          const col = i % 3
          return (
            <motion.div
              key={i}
              className="absolute h-[9px] w-[9px] rounded-[2px] bg-foreground/30 dark:bg-white/30"
              style={{ top: row * 12.5, left: col * 12.5 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.675, delay, repeat: Infinity, ease: "easeInOut" }}
            />
          )
        })}
      </div>
      <span className="text-xs text-muted-foreground/60 dark:text-white/40 tracking-wide">搜索中…</span>
    </motion.div>
  )
}

// ─── Domain Multi-Select Dropdown ────────────────────────────────────────────

function DomainSelector({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const label =
    selected.length === 0
      ? "所有知识域"
      : selected.length === 1
        ? KNOWLEDGE_DOMAINS.find((d) => d.id === selected[0])?.label ?? "1个域"
        : `${selected.length} 个域`

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium transition-all border cursor-pointer select-none",
          "bg-transparent hover:bg-muted/60 border-border/40 hover:border-border/60",
          "text-foreground/60 hover:text-foreground dark:text-white/50 dark:hover:text-white/80 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5",
          open && "bg-muted/60 border-border/60 text-foreground dark:bg-white/5 dark:border-white/20 dark:text-white/80"
        )}
      >
        <BookOpen className="h-3 w-3 opacity-60" />
        <span className="max-w-[80px] truncate">{label}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-1.5 z-50 w-44 rounded-xl border border-border/50 dark:border-white/10 bg-popover/98 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-1"
          >
            <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-medium text-muted-foreground/60 dark:text-white/40 tracking-wider uppercase">
              筛选知识域
            </p>
            {KNOWLEDGE_DOMAINS.map((domain) => {
              const isSelected = selected.includes(domain.id)
              return (
                <button
                  key={domain.id}
                  onClick={() => onToggle(domain.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
                    isSelected
                      ? "text-foreground dark:text-white bg-muted/60 dark:bg-white/8"
                      : "text-foreground/70 dark:text-white/60 hover:text-foreground dark:hover:text-white hover:bg-muted/40 dark:hover:bg-white/5"
                  )}
                >
                  <span>{domain.label}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Check className="h-3 w-3 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
            {selected.length > 0 && (
              <>
                <div className="my-1 mx-1 border-t border-border/30 dark:border-white/8" />
                <button
                  onClick={() => selected.forEach((id) => onToggle(id))}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground/70 dark:text-white/40 hover:text-foreground dark:hover:text-white hover:bg-muted/40 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  清除筛选
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Quick Entry Card — compact horizontal chip ───────────────────────────────

function QuickEntryCard({ entry, index }: { entry: (typeof QUICK_ENTRIES)[number]; index: number }) {
  const Icon = entry.icon
  return (
    <motion.button
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2, ease: "easeOut" }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex flex-1 items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group",
        "border border-border/35 dark:border-white/8",
        "bg-muted/25 dark:bg-white/4",
        "hover:bg-muted/50 dark:hover:bg-white/8 hover:border-border/55 dark:hover:border-white/15",
      )}
    >
      <Icon className="h-3.5 w-3.5 text-foreground/45 dark:text-white/40 group-hover:text-foreground/75 dark:group-hover:text-white/70 transition-colors duration-200 shrink-0" />
      <span className="text-[11.5px] font-medium text-foreground/55 dark:text-white/45 group-hover:text-foreground/80 dark:group-hover:text-white/75 transition-colors duration-200 truncate leading-none">
        {entry.label}
      </span>
    </motion.button>
  )
}

// ─── Result Group ─────────────────────────────────────────────────────────────

function ResultGroup({ group, query, defaultOpen = true }: { group: SearchResultGroup; query: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full px-1.5 py-1 mb-0.5 cursor-pointer group/head"
      >
        <div className="flex items-center gap-1.5 text-muted-foreground/60 dark:text-white/40 group-hover/head:text-foreground/80 dark:group-hover/head:text-white/70 transition-colors">
          {group.icon}
          <span className="text-[10px] font-semibold tracking-widest uppercase">{group.label}</span>
          <span className="text-[9px] tabular-nums text-muted-foreground/50 dark:text-white/30 font-medium bg-muted/60 dark:bg-white/8 px-1.5 py-0.5 rounded-full">
            {group.count}
          </span>
        </div>
        <div className="flex-1 h-px bg-border/30 dark:bg-white/8" />
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground/35 dark:text-white/25 transition-transform duration-200",
            !open && "-rotate-90"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-px mb-2">
              {group.items.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                  whileHover={{ x: 2 }}
                  className="relative flex items-center gap-3 w-full px-2.5 py-2.5 rounded-lg cursor-pointer text-left group/item overflow-hidden transition-colors duration-150 hover:bg-accent/60 dark:hover:bg-white/6 focus:outline-none focus:bg-accent/60 dark:focus:bg-white/6"
                >
                  {/* Item icon */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/50 dark:bg-white/6 transition-colors duration-200 border border-border/25 dark:border-white/8">
                    <span className="text-muted-foreground/50 dark:text-white/40 group-hover/item:text-foreground dark:group-hover/item:text-white transition-colors duration-200">
                      {group.itemIcon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground/80 dark:text-white/75 truncate leading-snug group-hover/item:text-foreground dark:group-hover/item:text-white transition-colors duration-150">
                      <HighlightText text={item.title} keyword={query} />
                    </p>
                    {item.tags && (
                      <div className="flex items-center gap-1 mt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-muted/60 dark:bg-white/8 text-muted-foreground/70 dark:text-white/50 border border-border/30 dark:border-white/10 font-medium"
                          >
                            <Hash className="h-1.5 w-1.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground/50 dark:text-white/35 font-medium">
                      {item.type}
                    </span>
                    <MatchDots score={item.matchScore} />
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/25 dark:text-white/20 group-hover/item:text-primary/60 dark:group-hover/item:text-primary/70 transition-colors duration-150" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── AI Answer Entry ──────────────────────────────────────────────────────────

function AiAnswerEntry({ query }: { query: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.06 }}
      whileHover={{ scale: 1.008, y: -1 }}
      whileTap={{ scale: 0.996 }}
      className="relative flex items-center gap-3 w-full px-3 py-3 rounded-xl cursor-pointer group transition-colors duration-200 hover:bg-accent/40 dark:hover:bg-white/5 border border-transparent hover:border-border/40 focus:outline-none"
    >
      <Sparkles className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors shrink-0" />
      
      <div className="relative flex-1 min-w-0 text-left">
        <p className="text-[13.5px] font-medium text-foreground/85 dark:text-white/85 group-hover:text-foreground dark:group-hover:text-white transition-colors duration-150">
          使用 AI 回答这个问题
        </p>
        <p className="text-[11px] text-muted-foreground/55 dark:text-white/40 truncate mt-0.5">
          &ldquo;{query}&rdquo;
        </p>
      </div>

      <motion.div
        className="relative"
        animate={{ x: 0 }}
        whileHover={{ x: 3 }}
      >
        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/80 transition-colors duration-150" />
      </motion.div>
    </motion.button>
  )
}

// ─── Knowledge Gap Section ────────────────────────────────────────────────────

function KnowledgeGapFooter({ query: _query }: { query: string }) {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.2 }}
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/40 bg-muted/20"
    >
      <div className="flex items-center gap-2.5">
        <CircleDashed className="h-4 w-4 text-muted-foreground/60 shrink-0" />
        <p className="text-[12px] text-muted-foreground/70 leading-snug">
          没找到想要的内容？
        </p>
      </div>
      <button
        onClick={handleSubmit}
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0",
          submitted
            ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : "bg-background dark:bg-white/5 text-foreground/80 dark:text-white/80 border-border/50 dark:border-white/10 hover:bg-muted/50 dark:hover:bg-white/10 hover:border-border/80"
        )}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.span key="done" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" />
              已提交缺口
            </motion.span>
          ) : (
            <motion.span key="submit" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} className="flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              提交知识缺口
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-12 px-4"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 dark:bg-white/6 border border-border/30 dark:border-white/10">
        <Search className="h-6 w-6 text-muted-foreground/40 dark:text-white/30" />
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background dark:bg-background border border-border/40 dark:border-white/15">
          <X className="h-2.5 w-2.5 text-muted-foreground/60 dark:text-white/40" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[13px] font-semibold text-foreground/70 dark:text-white/65">
          未找到相关结果
        </p>
        <p className="text-[11px] text-muted-foreground/55 dark:text-white/35">
          尝试更换关键词，或将其提交为知识缺口
        </p>
      </div>
      <div className="w-full max-w-xs">
        <KnowledgeGapFooter query={query} />
      </div>
    </motion.div>
  )
}

// ─── Main Search Modal ────────────────────────────────────────────────────────

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 320)
    return () => clearTimeout(timer)
  }, [query])

  const isLoading = query.trim() !== "" && query !== debouncedQuery
  const results = getMockResults(debouncedQuery)
  const hasQuery = debouncedQuery.trim().length > 0

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onOpenChange, open])

  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    } else {
      setQuery("")
      setDebouncedQuery("")
      setSelectedDomains([])
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-[600px] sm:rounded-2xl border-border/40 dark:border-white/10 max-h-[78vh] flex flex-col gap-0 [&>button]:hidden bg-background/98 dark:bg-background/98 backdrop-blur-2xl">

        {/* Ambient decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-16 right-8 h-36 w-56 bg-primary/[0.04] dark:bg-primary/[0.07] blur-3xl rounded-full" />
          <div className="absolute bottom-0 -left-8 h-28 w-40 bg-violet-500/[0.04] dark:bg-violet-500/[0.07] blur-3xl rounded-full" />
        </div>

        {/* ─── Header ─── */}
        <div className="relative flex items-center gap-2 px-3 h-[52px] border-b border-border/35 dark:border-white/10 bg-background/60 shrink-0">
          <DomainSelector selected={selectedDomains} onToggle={toggleDomain} />
          <div className="h-4 w-px bg-border/40 dark:bg-white/10 shrink-0" />
          <div className="flex flex-1 items-center gap-2.5 px-1">
            <Search className="h-[15px] w-[15px] shrink-0 text-muted-foreground/45 dark:text-white/35" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入命令或搜索..."
              className="flex-1 h-full bg-transparent text-sm text-foreground dark:text-white placeholder:text-muted-foreground/45 dark:placeholder:text-white/30 outline-none border-none focus:ring-0"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => { setQuery(""); setDebouncedQuery("") }}
                  className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-muted-foreground/20 dark:bg-white/15 hover:bg-muted-foreground/30 dark:hover:bg-white/25 transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-2.5 w-2.5 text-muted-foreground/70 dark:text-white/60" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Selected domain tags ─── */}
        <AnimatePresence>
          {selectedDomains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-1.5 px-4 py-1.5 border-b border-border/25 dark:border-white/8 bg-muted/15 dark:bg-white/3 shrink-0 overflow-hidden flex-wrap"
            >
              <span className="text-[10px] text-muted-foreground/50 dark:text-white/35 shrink-0">筛选</span>
              {selectedDomains.map((id) => {
                const domain = KNOWLEDGE_DOMAINS.find((d) => d.id === id)
                if (!domain) return null
                return (
                  <span key={id} className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", domain.color)}>
                    {domain.label}
                    <button onClick={() => toggleDomain(id)} className="cursor-pointer hover:opacity-60 transition-opacity ml-0.5">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Body ─── */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <AnimatePresence mode="wait">

            {isLoading && <SearchLoader key="loader" />}

            {!isLoading && !hasQuery && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="px-4 pt-4 pb-3 space-y-4"
              >
                {/* Quick entries — compact horizontal */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground/50 dark:text-white/35 tracking-widest uppercase px-0.5">
                    快捷入口
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_ENTRIES.map((entry, i) => (
                      <QuickEntryCard key={entry.id} entry={entry} index={i} />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/25 dark:bg-white/8" />

                {/* Recent searches */}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-muted-foreground/50 dark:text-white/35 tracking-widest uppercase px-0.5 mb-2">
                    最近搜索
                  </p>
                  {RECENT_SEARCHES.map((item, i) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.04, duration: 0.18 }}
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg hover:bg-accent/50 dark:hover:bg-white/5 transition-colors cursor-pointer text-left group"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/35 dark:text-white/30 shrink-0 group-hover:text-muted-foreground/60 dark:group-hover:text-white/55 transition-colors" />
                      <span className="text-[13px] text-foreground/65 dark:text-white/60 group-hover:text-foreground/90 dark:group-hover:text-white/85 transition-colors flex-1">
                        {item}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/20 dark:text-white/20 group-hover:text-muted-foreground/50 dark:group-hover:text-white/45 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {!isLoading && hasQuery && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="px-3 pt-3 pb-3 space-y-1"
              >
                {results.length > 0 ? (
                  <>
                    {results.map((group, i) => (
                      <ResultGroup key={group.key} group={group} query={debouncedQuery} defaultOpen={i === 0} />
                    ))}

                    <div className="pt-1 pb-1">
                      <div className="h-px bg-border/25 dark:bg-white/8 mb-3" />
                      <AiAnswerEntry query={debouncedQuery} />
                    </div>

                    <KnowledgeGapFooter query={debouncedQuery} />
                  </>
                ) : (
                  <EmptyState query={debouncedQuery} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer — only ESC ─── */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/25 dark:border-white/8 bg-muted/15 dark:bg-white/3 shrink-0">
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-[18px] select-none items-center rounded border border-border/40 dark:border-white/15 bg-muted/60 dark:bg-white/8 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/60 dark:text-white/40">
              ESC
            </kbd>
            <span className="text-[10px] text-muted-foreground/45 dark:text-white/30 ml-1">关闭</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 dark:text-white/30">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 dark:bg-emerald-400/50 animate-pulse" />
            Lumina 知识库
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
