"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check, ChevronRight, BookOpen, User, Calendar, Lock,
  Cpu, Zap, ShieldCheck, Layers, Code2, Database, Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SeriesData, SeriesGroup, KnowledgeCardData } from "@/lib/knowledge-data"

// ---------- Icon map ----------
const GROUP_ICONS: Record<string, React.ElementType> = {
  book: BookOpen,
  cpu: Cpu,
  zap: Zap,
  shield: ShieldCheck,
  layers: Layers,
  code: Code2,
  database: Database,
  settings: Settings,
}

// ---------- Helper ----------
function findActiveGroupId(series: SeriesData, currentCardId: number | string): string | null {
  if (!series.groups) return null
  for (const group of series.groups) {
    if (group.chapters.some((c) => String(c.id) === String(currentCardId))) {
      return group.id
    }
  }
  return null
}

// ============================================================
// GroupItem — one accordion section
// ============================================================
function GroupItem({
  group,
  currentCardId,
  completedIds,
  isOpen,
  onToggle,
}: {
  group: SeriesGroup
  currentCardId: number | string
  completedIds: Set<string>
  isOpen: boolean
  onToggle: () => void
}) {
  const hasActive = group.chapters.some((c) => String(c.id) === String(currentCardId))

  return (
    <div>
      {/* Group header / trigger */}
      <button
        onClick={onToggle}
        className={cn(
          "group w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors duration-150 cursor-pointer",
          "hover:bg-muted/40",
          hasActive && !isOpen && "bg-emerald-500/5"
        )}
      >
        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronRight className={cn(
            "w-3.5 h-3.5 transition-colors",
            isOpen ? "text-foreground" : "text-muted-foreground/60 group-hover:text-foreground"
          )} />
        </motion.span>

        {/* Title */}
        <span className={cn(
          "flex-1 text-[13px] font-medium leading-snug transition-colors",
          isOpen || hasActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {group.title}
        </span>

        {/* Badge: chapter count */}
        <span className="flex-shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">
          {group.chapters.length}
        </span>
      </button>

      {/* Chapter list */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            {/* Left connector line */}
            <div className="relative ml-[21px]">
              <div className="absolute left-[0px] top-0 bottom-1 w-px bg-border/40" />

              {group.chapters.map((chapter, idx) => {
                const isCurrent = String(chapter.id) === String(currentCardId)
                const isDone = completedIds.has(String(chapter.id))

                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.04 }}
                  >
                    <Link
                      href={`/knowledge/${chapter.id}`}
                      className={cn(
                        "group relative flex items-start gap-2.5 pr-4 py-2 pl-4 transition-all duration-150",
                        isCurrent
                          ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                          : "hover:bg-muted/40"
                      )}
                    >
                      {/* Status dot / check */}
                      <span className={cn(
                        "relative z-10 flex-shrink-0 mt-[3px] w-[16px] h-[16px] rounded-full border flex items-center justify-center text-[8px] font-bold transition-all duration-150",
                        isCurrent
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                          : isDone
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-background border-border/70 text-muted-foreground group-hover:border-emerald-500/40"
                      )}>
                        {isDone && !isCurrent ? (
                          <Check className="w-2.5 h-2.5" />
                        ) : (
                          chapter.chapterIndex
                        )}
                      </span>

                      {/* Chapter text */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs leading-relaxed line-clamp-2 transition-colors",
                          isCurrent
                            ? "text-foreground font-medium"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {chapter.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// FlatChapterList — fallback when no groups defined
// ============================================================
function FlatChapterList({
  series,
  currentCardId,
  currentIndex,
}: {
  series: SeriesData
  currentCardId: number | string
  currentIndex: number
}) {
  return (
    <nav className="py-1.5">
      {series.cards.map((card, idx) => {
        const isCurrent = String(card.id) === String(currentCardId)
        const isCompleted = idx < currentIndex
        const isLocked = idx > currentIndex + 2

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.04 }}
          >
            <Link
              href={`/knowledge/${card.id}`}
              className={cn(
                "group relative flex items-start gap-3 px-4 py-2.5 transition-all duration-150",
                isCurrent ? "bg-emerald-500/10 dark:bg-emerald-500/20" : isLocked ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-muted/40"
              )}
            >
              {isCurrent && (
                <motion.div
                  layoutId="activeChapterBar"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <span className={cn(
                "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all",
                isCurrent ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                  : isCompleted ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500"
                  : isLocked ? "bg-muted border-border text-muted-foreground"
                  : "bg-muted/50 border-border/60 text-muted-foreground group-hover:border-emerald-500/40"
              )}>
                {isCompleted ? <Check className="w-2.5 h-2.5" /> : isLocked ? <Lock className="w-2.5 h-2.5" /> : idx + 1}
              </span>
              <span className={cn(
                "text-xs leading-snug line-clamp-2 transition-colors",
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {card.title}
              </span>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

// ============================================================
// SeriesView — full series sidebar
// ============================================================
function SeriesView({ series, currentCardId }: { series: SeriesData; currentCardId: number | string }) {
  const currentIndex = series.cards.findIndex((c) => String(c.id) === String(currentCardId))
  const completedIds = new Set(
    series.cards.slice(0, Math.max(0, currentIndex)).map((c) => String(c.id))
  )

  // Default open: group containing current card
  const defaultOpenId = findActiveGroupId(series, currentCardId)
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set()
  )

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-4 border-b border-border/60">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
              教程系列
            </span>
            <h2 className="text-sm font-bold text-foreground leading-snug">{series.title}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              {series.lastUpdated && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{series.lastUpdated}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Layers className="w-3 h-3" />
                <span>{series.totalChapters} 章节</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">学习进度</span>
          <span className="text-[10px] font-semibold text-foreground tabular-nums">
            {currentIndex + 1} / {series.totalChapters}
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / series.totalChapters) * 100}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          />
        </div>
      </div>

      {/* ── Chapter nav ── */}
      {series.groups ? (
        <div className="py-1.5 divide-y divide-border/30">
          {series.groups.map((group) => (
            <GroupItem
              key={group.id}
              group={group}
              currentCardId={currentCardId}
              completedIds={completedIds}
              isOpen={openGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
        </div>
      ) : (
        <FlatChapterList series={series} currentCardId={currentCardId} currentIndex={currentIndex} />
      )}
    </div>
  )
}

// ============================================================
// AuthorArchiveView
// ============================================================
function AuthorArchiveView({
  authorCards, currentCardId, authorName, authorBio, authorAvatar,
}: {
  authorCards: KnowledgeCardData[]
  currentCardId: number | string
  authorName: string
  authorBio?: string
  authorAvatar?: string
}) {
  const groups: Record<string, KnowledgeCardData[]> = {}
  for (const card of authorCards) {
    const d = new Date(card.publishDate)
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(card)
  }

  // Find which month is active
  const activeMonth = Object.entries(groups).find(([, cards]) =>
    cards.some((c) => String(c.id) === String(currentCardId))
  )?.[0]

  const [openMonths, setOpenMonths] = useState<Set<string>>(
    activeMonth ? new Set([activeMonth]) : new Set()
  )

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev)
      if (next.has(month)) next.delete(month)
      else next.add(month)
      return next
    })
  }

  return (
    <div className="flex flex-col">
      {/* ── Author header ── */}
      <div className="px-4 pt-4 pb-4 border-b border-border/60">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-sm font-semibold text-foreground">
            {authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">作者</span>
            <h2 className="text-sm font-bold text-foreground">{authorName}</h2>
            {authorBio && (
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">{authorBio}</p>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <BookOpen className="w-3 h-3" />
          {authorCards.length} 篇知识卡
        </div>
      </div>

      {/* ── Monthly archive ── */}
      <nav className="py-1.5 divide-y divide-border/30">
        {Object.entries(groups).map(([month, cards], groupIdx) => {
          const isOpen = openMonths.has(month)
          const hasActive = cards.some((c) => String(c.id) === String(currentCardId))

          return (
            <div key={month}>
              <button
                onClick={() => toggleMonth(month)}
                className={cn(
                  "group w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors duration-150 cursor-pointer",
                  "hover:bg-muted/40",
                  hasActive && !isOpen && "bg-emerald-500/5"
                )}
              >
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    isOpen ? "text-foreground" : "text-muted-foreground/60 group-hover:text-foreground"
                  )} />
                </motion.span>
                <span className={cn(
                  "flex-1 text-[13px] font-medium leading-snug transition-colors",
                  isOpen || hasActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {month}
                </span>
                <span className="flex-shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">
                  {cards.length}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="relative ml-[21px]">
                      <div className="absolute left-[0px] top-0 bottom-1 w-px bg-border/40" />
                      {cards.map((card, cardIdx) => {
                        const isCurrent = String(card.id) === String(currentCardId)
                        return (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, delay: cardIdx * 0.04 }}
                          >
                            <Link
                              href={`/knowledge/${card.id}`}
                              className={cn(
                                "group relative flex items-start gap-2.5 pr-4 py-2 pl-4 transition-all duration-150",
                                isCurrent ? "bg-emerald-500/10 dark:bg-emerald-500/20" : "hover:bg-muted/40"
                              )}
                            >
                              <span className={cn(
                                "relative z-10 flex-shrink-0 mt-[6px] w-1.5 h-1.5 rounded-full transition-colors",
                                isCurrent ? "bg-emerald-500" : "bg-border group-hover:bg-muted-foreground/50"
                              )} />
                              <span className={cn(
                                "text-xs leading-relaxed line-clamp-2 transition-colors",
                                isCurrent ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                              )}>
                                {card.title}
                              </span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

// ============================================================
// Export
// ============================================================
interface SeriesSidebarProps {
  currentCardId: number | string
  series?: SeriesData
  authorCards?: KnowledgeCardData[]
  authorName?: string
  authorBio?: string
  authorAvatar?: string
}

export function SeriesSidebar({
  currentCardId, series, authorCards, authorName, authorBio, authorAvatar,
}: SeriesSidebarProps) {
  return (
    <aside className="w-full rounded-xl border border-border bg-card overflow-hidden">
      {series ? (
        <SeriesView series={series} currentCardId={currentCardId} />
      ) : authorCards && authorCards.length > 0 ? (
        <AuthorArchiveView
          authorCards={authorCards}
          currentCardId={currentCardId}
          authorName={authorName || ""}
          authorBio={authorBio}
          authorAvatar={authorAvatar}
        />
      ) : null}
    </aside>
  )
}
