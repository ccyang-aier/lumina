"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Copy,
  Clock,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GitMerge,
  RefreshCw,
  Eye,
  Flag,
  Check,
  Search,
  Layers,
  FileSearch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GOVERNANCE_ISSUES } from "@/lib/alchemy-data"
import type { GovernanceIssue, IssueType } from "@/lib/alchemy-data"

// ─── Issue Type Config ────────────────────────────────────────────────────────

const ISSUE_CONFIG: Record<
  IssueType,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  duplicate: {
    icon: <Copy className="h-4 w-4" />,
    label: "重复内容",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  expired: {
    icon: <Clock className="h-4 w-4" />,
    label: "过期内容",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
  },
  sensitive: {
    icon: <Shield className="h-4 w-4" />,
    label: "敏感信息",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  factual: {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "事实性问题",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
}

const SEVERITY_CONFIG = {
  high: { label: "高危", color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  medium: { label: "中危", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  low: { label: "低危", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
}

// ─── Issue Card ───────────────────────────────────────────────────────────────

function IssueCard({ issue }: { issue: GovernanceIssue }) {
  const [expanded, setExpanded] = useState(false)
  const [resolvedAction, setResolvedAction] = useState<string | null>(null)
  const cfg = ISSUE_CONFIG[issue.type]
  const sev = SEVERITY_CONFIG[issue.severity]

  const actions =
    issue.type === "duplicate"
      ? [
          { id: "diff", label: "查看对比 diff", icon: <FileSearch className="h-3.5 w-3.5" /> },
          { id: "notdup", label: "标记为不重复", icon: <Flag className="h-3.5 w-3.5" /> },
          { id: "merge", label: "发起合并流程", icon: <GitMerge className="h-3.5 w-3.5" /> },
        ]
      : issue.type === "expired"
      ? [
          { id: "updated", label: "标记已更新", icon: <Check className="h-3.5 w-3.5" /> },
          { id: "view", label: "查看过期段落", icon: <Eye className="h-3.5 w-3.5" /> },
          { id: "request", label: "请求原作者更新", icon: <RefreshCw className="h-3.5 w-3.5" /> },
        ]
      : [
          { id: "highlight", label: "查看高亮位置", icon: <Eye className="h-3.5 w-3.5" /> },
          { id: "desensitize", label: "申请脱敏处理", icon: <Shield className="h-3.5 w-3.5" /> },
          { id: "false-positive", label: "标记误报", icon: <Flag className="h-3.5 w-3.5" /> },
        ]

  return (
    <motion.div
      layout
      className={cn(
        "border rounded-xl overflow-hidden transition-colors",
        resolvedAction
          ? "border-emerald-400/30 bg-emerald-500/5"
          : "border-border/60 bg-card/40 hover:border-border/80"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        {/* Type icon */}
        <div className={cn("p-2 rounded-lg shrink-0 mt-0.5", cfg.bg)}>
          <span className={cfg.color}>{cfg.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
              {sev.label}
            </span>
            {issue.similarity && (
              <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                相似度 {issue.similarity}%
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-snug">{issue.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {issue.cards.map((card) => (
              <span
                key={card.id}
                className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground"
              >
                {card.title}
              </span>
            ))}
          </div>
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed py-3">
                {issue.details}
              </p>
              {resolvedAction ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  已执行：{actions.find((a) => a.id === resolvedAction)?.label}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => setResolvedAction(action.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/50 hover:border-foreground/30 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-all"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Check Config Panel ───────────────────────────────────────────────────────

type CheckScope =
  | "all"
  | "tagged"
  | "guild"
  | "mine"
  | "expiring"

const SCOPES: { id: CheckScope; label: string }[] = [
  { id: "all", label: "全部知识库" },
  { id: "tagged", label: "指定主题标签" },
  { id: "guild", label: "指定公会" },
  { id: "mine", label: "我的卡片" },
  { id: "expiring", label: "即将过期内容" },
]

const CHECK_ITEMS = [
  { id: "dedup", label: "重复检测", defaultChecked: true },
  { id: "expiry", label: "过期检测", defaultChecked: true },
  { id: "sensitive", label: "敏感信息检测", defaultChecked: true },
  { id: "factual", label: "事实性交叉验证", defaultChecked: false },
]

// ─── Quick Check Panel ────────────────────────────────────────────────────────

function QuickCheckPanel() {
  const [selectedCard, setSelectedCard] = useState("")
  const [results, setResults] = useState<null | typeof GOVERNANCE_ISSUES>(null)
  const [checking, setChecking] = useState(false)

  function handleQuickCheck() {
    setChecking(true)
    setTimeout(() => {
      setChecking(false)
      setResults(GOVERNANCE_ISSUES.slice(0, 2))
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
          className="flex-1 text-sm bg-card border border-border/60 rounded-lg px-3 py-2 text-foreground outline-none focus:border-foreground/30 transition-colors"
        >
          <option value="">选择要检查的知识卡...</option>
          <option value="kc-001">React useEffect 完整指南</option>
          <option value="kc-003">Kafka 消费者组与消息分区策略深度解析</option>
          <option value="kc-004">Kubernetes Pod 生命周期与 OOM 排查实战</option>
        </select>
        <button
          onClick={handleQuickCheck}
          disabled={!selectedCard || checking}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0",
            selectedCard && !checking
              ? "bg-foreground text-background hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {checking ? (
            <><RefreshCw className="h-4 w-4 animate-spin" />检查中</>
          ) : (
            <><Search className="h-4 w-4" />即时检查</>
          )}
        </button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground">
            检查完成 · 发现 {results.length} 个问题
          </p>
          {results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ─── Main Governance Mode ─────────────────────────────────────────────────────

type SubTab = "batch" | "quick"
type CheckPhase = "config" | "running" | "result"

export function GovernanceMode() {
  const [subTab, setSubTab] = useState<SubTab>("batch")
  const [phase, setPhase] = useState<CheckPhase>("config")
  const [scope, setScope] = useState<CheckScope>("all")
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(CHECK_ITEMS.filter((i) => i.defaultChecked).map((i) => i.id))
  )
  const [progress, setProgress] = useState({ checked: 0, total: 247 })
  const [filterType, setFilterType] = useState<IssueType | "all">("all")

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleStartBatch = useCallback(() => {
    setPhase("running")
    let count = 0
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 5
      if (count >= 247) {
        count = 247
        clearInterval(interval)
        setTimeout(() => setPhase("result"), 400)
      }
      setProgress({ checked: count, total: 247 })
    }, 200)
  }, [])

  const filteredIssues =
    filterType === "all"
      ? GOVERNANCE_ISSUES
      : GOVERNANCE_ISSUES.filter((i) => i.type === filterType)

  const issuesByType = {
    duplicate: GOVERNANCE_ISSUES.filter((i) => i.type === "duplicate").length,
    expired: GOVERNANCE_ISSUES.filter((i) => i.type === "expired").length,
    sensitive: GOVERNANCE_ISSUES.filter((i) => i.type === "sensitive").length,
    factual: GOVERNANCE_ISSUES.filter((i) => i.type === "factual").length,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub tab */}
      <div className="flex items-center gap-1 px-5 py-3 border-b border-border/40 shrink-0">
        {[
          { id: "batch" as SubTab, label: "批量检查", icon: <Layers className="h-4 w-4" /> },
          { id: "quick" as SubTab, label: "单卡快检", icon: <Search className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              subTab === tab.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {subTab === "quick" && <QuickCheckPanel />}

        {subTab === "batch" && (
          <>
            {/* Config phase */}
            {phase === "config" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Scope */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">检查范围</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SCOPES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setScope(s.id)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm border text-left transition-all",
                          scope === s.id
                            ? "border-foreground/40 bg-foreground/5 text-foreground font-medium"
                            : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Check items */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">检查项目</h3>
                  <div className="space-y-2">
                    {CHECK_ITEMS.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          onClick={() => toggleCheck(item.id)}
                          className={cn(
                            "h-4 w-4 rounded border transition-all shrink-0 flex items-center justify-center",
                            checkedItems.has(item.id)
                              ? "bg-foreground border-foreground"
                              : "border-border/60 group-hover:border-foreground/40"
                          )}
                        >
                          {checkedItems.has(item.id) && (
                            <Check className="h-3 w-3 text-background" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-colors",
                            checkedItems.has(item.id)
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartBatch}
                  disabled={checkedItems.size === 0}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                    checkedItems.size > 0
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Play className="h-4 w-4" />
                  开始检查
                </button>
              </motion.div>
            )}

            {/* Running phase */}
            {phase === "running" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-6"
              >
                <div className="relative h-16 w-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500"
                  />
                  <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium mb-1">知识库体检中...</p>
                  <p className="text-xs text-muted-foreground">
                    检查中 · 已处理{" "}
                    <motion.span
                      key={progress.checked}
                      className="text-foreground font-mono font-medium"
                    >
                      {progress.checked}
                    </motion.span>{" "}
                    / {progress.total} 张卡
                  </p>
                </div>

                <div className="w-64 h-2 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    animate={{
                      width: `${(progress.checked / progress.total) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Result phase */}
            {phase === "result" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="p-3 rounded-xl bg-card/60 border border-border/50">
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-xs text-muted-foreground mt-0.5">总检查数</div>
                  </div>
                  {[
                    { label: "重复", count: issuesByType.duplicate, color: "text-amber-500" },
                    { label: "过期", count: issuesByType.expired, color: "text-orange-500" },
                    { label: "敏感", count: issuesByType.sensitive, color: "text-red-500" },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-card/60 border border-border/50">
                      <div className={cn("text-2xl font-bold", s.color)}>{s.count}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "all" as const, label: "全部" },
                    { id: "duplicate" as const, label: "重复" },
                    { id: "expired" as const, label: "过期" },
                    { id: "sensitive" as const, label: "敏感" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-lg transition-all",
                        filterType === f.id
                          ? "bg-foreground text-background font-medium"
                          : "border border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {f.label}
                      {f.id !== "all" && (
                        <span className="ml-1 opacity-60">
                          ({issuesByType[f.id as keyof typeof issuesByType] ?? 0})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Issues list */}
                <div className="space-y-3">
                  {filteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setPhase("config")
                    setProgress({ checked: 0, total: 247 })
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mt-2 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新配置检查
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
