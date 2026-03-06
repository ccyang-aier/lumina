"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  BookOpen,
  Gauge,
  Layers,
  Activity,
  ClipboardCheck,
  Calendar,
  Trophy,
  Pencil,
  PanelRightClose,
  PanelRightOpen,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AIMode } from "@/lib/alchemy-data"
import { KNOWLEDGE_CARDS } from "@/lib/alchemy-data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RightPanelProps {
  activeMode: AIMode
  confidenceScore?: number
  confidence?: string
  citationIds?: string[]
  collapsed: boolean
  onToggleCollapse: () => void
  highlightedCitation?: string
  onCitationHighlight?: (id: string | undefined) => void
  examData?: {
    currentQuestion: number
    totalQuestions: number
    score: number
    sourceCard?: string
  }
  governanceData?: {
    checked: number
    total: number
    issues: number
  }
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/20 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Confidence Meter ─────────────────────────────────────────────────────────

function ConfidenceMeter({ score, confidence }: { score: number; confidence: string }) {
  const percentage = Math.round(score * 100)

  const colorMap: Record<string, { stroke: string; text: string; label: string; bg: string }> = {
    high: {
      stroke: "#3b82f6",
      text: "text-blue-500",
      label: "来源完整",
      bg: "bg-blue-500/10",
    },
    medium: {
      stroke: "#f59e0b",
      text: "text-amber-500",
      label: "建议核实",
      bg: "bg-amber-500/10",
    },
    low: {
      stroke: "#ef4444",
      text: "text-red-500",
      label: "置信度低",
      bg: "bg-red-500/10",
    },
    none: {
      stroke: "#6b7280",
      text: "text-gray-500",
      label: "无知识库支撑",
      bg: "bg-gray-500/10",
    },
  }

  const cfg = colorMap[confidence] ?? colorMap.none
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - percentage / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="96" height="96" className="-rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={cfg.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("text-xl font-bold", cfg.text)}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <div
        className={cn(
          "text-xs font-medium px-2.5 py-1 rounded-full",
          cfg.bg,
          cfg.text
        )}
      >
        {cfg.label}
      </div>
    </div>
  )
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function AuthorityStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RightPanel({
  activeMode,
  confidenceScore,
  confidence,
  citationIds,
  collapsed,
  onToggleCollapse,
  highlightedCitation,
  onCitationHighlight,
  examData,
  governanceData,
}: RightPanelProps) {
  const citedCards = KNOWLEDGE_CARDS.filter((c) =>
    citationIds?.includes(c.id)
  )
  const recommendedCards = KNOWLEDGE_CARDS.filter(
    (c) => !citationIds?.includes(c.id)
  ).slice(0, 2)

  return (
    <motion.aside
      animate={{ width: collapsed ? 48 : 360 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col border-l border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shrink-0"
    >
      {/* Toggle button */}
      <div className="flex items-center justify-start px-2 py-3 border-b border-border/40 min-h-[52px]">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          {collapsed ? (
            <PanelRightOpen className="h-4 w-4" />
          ) : (
            <PanelRightClose className="h-4 w-4" />
          )}
        </button>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              key="rp-label"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="ml-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
            >
              上下文
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Panel content */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            key={activeMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            {/* ── Q&A Panel ── */}
            {activeMode === "qa" && (
              <>
                {/* Confidence */}
                {confidence && confidenceScore !== undefined && (
                  <Section
                    title="置信度"
                    icon={<Gauge className="h-3.5 w-3.5" />}
                  >
                    <ConfidenceMeter
                      score={confidenceScore}
                      confidence={confidence}
                    />
                    {confidence === "high" && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        <CheckCircle2 className="inline h-3 w-3 text-blue-500 mr-1" />
                        {citedCards.length}/{citedCards.length} 引用有效
                      </p>
                    )}
                    {confidence === "medium" && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">
                        <AlertTriangle className="inline h-3 w-3 mr-1" />
                        部分内容建议人工核实
                      </p>
                    )}
                  </Section>
                )}

                {/* Citations */}
                {citedCards.length > 0 && (
                  <Section
                    title="引用来源"
                    icon={<BookOpen className="h-3.5 w-3.5" />}
                  >
                    <div className="space-y-2">
                      {citedCards.map((card, idx) => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() =>
                            onCitationHighlight?.(
                              highlightedCitation === card.id
                                ? undefined
                                : card.id
                            )
                          }
                          className={cn(
                            "p-2.5 rounded-lg border cursor-pointer transition-all",
                            highlightedCitation === card.id
                              ? "border-blue-400 bg-blue-500/8"
                              : "border-border/50 hover:border-border hover:bg-accent/30"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 rounded px-1 py-0.5 mt-0.5 shrink-0">
                              [{idx + 1}]
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium leading-tight line-clamp-2">
                                {card.title}
                              </p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[10px] text-muted-foreground">
                                  {card.author}
                                </span>
                                <AuthorityStars count={card.authority} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Recommended */}
                <Section
                  title="相关卡片"
                  icon={<Layers className="h-3.5 w-3.5" />}
                  defaultOpen={false}
                >
                  <div className="space-y-2">
                    {recommendedCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-2.5 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 cursor-pointer transition-all"
                      >
                        <p className="text-xs font-medium leading-tight line-clamp-2">
                          {card.title}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-muted-foreground">
                            {card.author}
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ── Generate Panel ── */}
            {activeMode === "generate" && (
              <>
                <Section
                  title="修改摘要"
                  icon={<Activity className="h-3.5 w-3.5" />}
                >
                  <div className="space-y-2">
                    {[
                      { label: "新增行", count: 12, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { label: "删除行", count: 2, color: "text-red-500", bg: "bg-red-500/10" },
                      { label: "修改行", count: 1, color: "text-blue-500", bg: "bg-blue-500/10" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-muted-foreground">
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            item.bg,
                            item.color
                          )}
                        >
                          +{item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section
                  title="质量评分"
                  icon={<Gauge className="h-3.5 w-3.5" />}
                  defaultOpen={false}
                >
                  <div className="space-y-3">
                    {[
                      { label: "结构完整性", before: 62, after: 88 },
                      { label: "安全规范", before: 45, after: 92 },
                      { label: "信息密度", before: 70, after: 78 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="text-emerald-500 font-medium">
                            {item.before} → {item.after}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                          <motion.div
                            initial={{ width: `${item.before}%` }}
                            animate={{ width: `${item.after}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-full rounded-full bg-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section
                  title="来源卡片"
                  icon={<BookOpen className="h-3.5 w-3.5" />}
                  defaultOpen={false}
                >
                  <div className="p-2.5 rounded-lg border border-border/50 bg-accent/20">
                    <p className="text-xs font-medium">用户认证模块设计文档</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      作者：林嘉欣 · 更新于 2024-01-10
                    </p>
                    <div className="flex gap-1 mt-2">
                      {["认证", "JWT", "安全"].map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── Governance Panel ── */}
            {activeMode === "governance" && (
              <>
                <Section
                  title="检查进度"
                  icon={<ClipboardCheck className="h-3.5 w-3.5" />}
                >
                  {governanceData ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">已处理</span>
                        <span className="font-medium">
                          {governanceData.checked} / {governanceData.total}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                        <motion.div
                          animate={{
                            width: `${(governanceData.checked / governanceData.total) * 100}%`,
                          }}
                          transition={{ duration: 0.4 }}
                          className="h-full rounded-full bg-emerald-500"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        发现{" "}
                        <span className="text-foreground font-medium">
                          {governanceData.issues}
                        </span>{" "}
                        个问题
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      开始检查后将显示进度
                    </p>
                  )}
                </Section>

                <Section
                  title="问题分布"
                  icon={<Activity className="h-3.5 w-3.5" />}
                  defaultOpen={false}
                >
                  <div className="space-y-2">
                    {[
                      { label: "重复内容", count: 2, color: "bg-amber-500" },
                      { label: "过期内容", count: 2, color: "bg-orange-500" },
                      { label: "敏感信息", count: 1, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", item.color)} />
                        <span className="text-xs text-muted-foreground flex-1">
                          {item.label}
                        </span>
                        <span className="text-xs font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ── Learning Panel ── */}
            {activeMode === "learning" && (
              <>
                <Section
                  title="路径进度"
                  icon={<Activity className="h-3.5 w-3.5" />}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">已完成</span>
                      <span className="font-medium">4 / 12 个任务</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "33%" }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      预计还需{" "}
                      <span className="text-foreground font-medium">14 天</span>{" "}
                      完成
                    </p>
                  </div>
                </Section>

                <Section
                  title="今日推荐"
                  icon={<Calendar className="h-3.5 w-3.5" />}
                >
                  <div className="p-2.5 rounded-lg border border-amber-400/40 bg-amber-500/5">
                    <p className="text-xs font-medium leading-tight">
                      React useEffect 完整指南：副作用与依赖项管理
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      预计 50 分钟 · 今日任务
                    </p>
                  </div>
                </Section>

                <Section
                  title="同事参考"
                  icon={<Layers className="h-3.5 w-3.5" />}
                  defaultOpen={false}
                >
                  <div className="space-y-2">
                    {["前端工程师 · 周小璐", "前端工程师 · 吴天明"].map(
                      (name) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 shrink-0" />
                          <div>
                            <div className="text-foreground/80">{name}</div>
                            <div className="text-muted-foreground text-[10px]">
                              相似路径 · 3 周完成
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Section>
              </>
            )}

            {/* ── Exam Panel ── */}
            {activeMode === "exam" && (
              <>
                {examData && (
                  <>
                    <Section
                      title="答题进度"
                      icon={<ClipboardCheck className="h-3.5 w-3.5" />}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">当前</span>
                          <span className="font-medium">
                            第 {examData.currentQuestion} / {examData.totalQuestions} 题
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                          <motion.div
                            animate={{
                              width: `${(examData.currentQuestion / examData.totalQuestions) * 100}%`,
                            }}
                            transition={{ duration: 0.4 }}
                            className="h-full rounded-full bg-rose-500"
                          />
                        </div>
                      </div>
                    </Section>

                    <Section
                      title="积分预估"
                      icon={<Trophy className="h-3.5 w-3.5" />}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-amber-500">
                          +{examData.score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          当前得分预估
                          <br />
                          满分 +100 积分
                        </div>
                      </div>
                    </Section>

                    {examData.sourceCard && (
                      <Section
                        title="题目来源"
                        icon={<Pencil className="h-3.5 w-3.5" />}
                      >
                        <div className="p-2.5 rounded-lg border border-border/50 bg-accent/20">
                          <p className="text-xs font-medium leading-tight">
                            {examData.sourceCard}
                          </p>
                          <button className="mt-2 text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                            <ExternalLink className="h-2.5 w-2.5" />
                            查看原卡片
                          </button>
                        </div>
                      </Section>
                    )}
                  </>
                )}

                {!examData && (
                  <div className="p-4 text-center">
                    <GraduationCap className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      开始考核后，
                      <br />
                      这里会显示答题记录
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed icon hints */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center gap-3 py-4">
          {activeMode === "qa" && (
            <>
              <Gauge className="h-4 w-4 text-muted-foreground/40" />
              <BookOpen className="h-4 w-4 text-muted-foreground/40" />
            </>
          )}
        </div>
      )}
    </motion.aside>
  )
}
