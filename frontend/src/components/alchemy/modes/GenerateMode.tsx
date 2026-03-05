"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Tag,
  Link2,
  Copy,
  AlignLeft,
  Wand2,
  Upload,
  CheckSquare,
  CheckCheck,
  RefreshCw,
  X,
  ChevronDown,
  BarChart3,
  MessageSquareDiff,
  Sliders,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GENERATE_DRAFT, GENERATE_DIFF } from "@/lib/alchemy-data"
import type { DiffLine } from "@/lib/alchemy-data"

// ─── Task Types ───────────────────────────────────────────────────────────────

type TaskId = "summary" | "tags" | "citations" | "dedup" | "structure" | "tone" | "quality"

interface TaskConfig {
  id: TaskId
  label: string
  icon: React.ReactNode
  description: string
}

const TASKS: TaskConfig[] = [
  { id: "summary", label: "生成摘要", icon: <FileText className="h-4 w-4" />, description: "为文档生成简洁的摘要段落" },
  { id: "tags", label: "标签建议", icon: <Tag className="h-4 w-4" />, description: "基于内容智能推荐分类标签" },
  { id: "citations", label: "引用补齐", icon: <Link2 className="h-4 w-4" />, description: "检索相关知识卡，补充引用来源" },
  { id: "dedup", label: "重复检测", icon: <Copy className="h-4 w-4" />, description: "检测与知识库中已有内容的重复度" },
  { id: "structure", label: "结构化补全", icon: <AlignLeft className="h-4 w-4" />, description: "补充缺失的章节和结构要素" },
  { id: "tone", label: "语气调整", icon: <MessageSquareDiff className="h-4 w-4" />, description: "将口语化表达调整为专业技术风格" },
  { id: "quality", label: "质量评估", icon: <BarChart3 className="h-4 w-4" />, description: "全面评估文档质量并给出改进建议" },
]

// ─── Diff Line Component ──────────────────────────────────────────────────────

function DiffLineRow({
  line,
  index,
  visible,
}: {
  line: DiffLine
  index: number
  visible: boolean
}) {
  if (line.type === "unchanged" && !line.content) {
    return visible ? <div className="h-3" /> : null
  }

  const config = {
    add: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/8",
      border: "border-l-2 border-emerald-500",
      prefix: "+ ",
      text: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      badgeText: "新增",
    },
    delete: {
      bg: "bg-red-500/10 dark:bg-red-500/8",
      border: "border-l-2 border-red-500",
      prefix: "- ",
      text: "text-red-700 dark:text-red-300 line-through opacity-70",
      badge: "bg-red-500/20 text-red-600 dark:text-red-400",
      badgeText: "删除",
    },
    modify: {
      bg: "bg-blue-500/10 dark:bg-blue-500/8",
      border: "border-l-2 border-blue-500",
      prefix: "~ ",
      text: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      badgeText: "修改",
    },
    unchanged: {
      bg: "",
      border: "",
      prefix: "  ",
      text: "text-foreground/70",
      badge: "",
      badgeText: "",
    },
  }

  const cfg = config[line.type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.04 }}
          className={cn(
            "relative px-3 py-1 font-mono text-xs rounded-sm",
            cfg.bg,
            cfg.border
          )}
        >
          {line.type === "modify" && line.originalContent && (
            <div className="text-red-600/70 dark:text-red-400/70 line-through mb-0.5 text-[11px]">
              {line.originalContent}
            </div>
          )}
          <span className={cfg.text}>
            <span className="opacity-40 select-none">{cfg.prefix}</span>
            {line.content}
          </span>
          {line.type !== "unchanged" && (
            <span
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium px-1.5 py-0.5 rounded",
                cfg.badge
              )}
            >
              {cfg.badgeText}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Review Item ──────────────────────────────────────────────────────────────

function ReviewItem({
  line,
  index,
  onAccept,
  onReject,
}: {
  line: DiffLine
  index: number
  onAccept: () => void
  onReject: () => void
}) {
  const [resolved, setResolved] = useState<"accepted" | "rejected" | null>(null)

  if (line.type === "unchanged") return null
  if (resolved === "rejected") return null

  const labels = {
    add: { color: "text-emerald-600 dark:text-emerald-400", label: "建议新增" },
    delete: { color: "text-red-600 dark:text-red-400", label: "建议删除" },
    modify: { color: "text-blue-600 dark:text-blue-400", label: "建议修改" },
    unchanged: { color: "", label: "" },
  }
  const cfg = labels[line.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: resolved === "accepted" ? 0.5 : 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "border rounded-lg p-3 transition-all",
        resolved === "accepted"
          ? "border-emerald-400/40 bg-emerald-500/5"
          : "border-border/60 hover:border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className={cn("text-[11px] font-medium", cfg.color)}>
            {cfg.label}
          </span>
          {line.type === "modify" && line.originalContent && (
            <p className="text-xs text-red-500/70 line-through mt-1">
              {line.originalContent}
            </p>
          )}
          <p className="text-xs text-foreground/80 mt-1">{line.content}</p>
        </div>
        {!resolved && (
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => { setResolved("accepted"); onAccept() }}
              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setResolved("rejected"); onReject() }}
              className="p-1.5 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {resolved === "accepted" && (
          <span className="text-[10px] text-emerald-500 font-medium shrink-0">已采纳</span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Generate Mode ───────────────────────────────────────────────────────

type GeneratePhase = "config" | "result"
type ReviewMode = "all" | "step"

export function GenerateMode() {
  const [activeTask, setActiveTask] = useState<TaskId>("summary")
  const [draft, setDraft] = useState(GENERATE_DRAFT)
  const [phase, setPhase] = useState<GeneratePhase>("config")
  const [isGenerating, setIsGenerating] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const [reviewMode, setReviewMode] = useState<ReviewMode>("all")
  const [selectedCard, setSelectedCard] = useState<string>("")

  const task = TASKS.find((t) => t.id === activeTask)!
  const nonTrivialLines = GENERATE_DIFF.filter((l) => l.type !== "unchanged" || l.content)
  const addCount = GENERATE_DIFF.filter((l) => l.type === "add").length
  const delCount = GENERATE_DIFF.filter((l) => l.type === "delete").length
  const modCount = GENERATE_DIFF.filter((l) => l.type === "modify").length

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setPhase("result")
    setVisibleLines(0)

    // Stagger reveal lines
    let count = 0
    const total = GENERATE_DIFF.length
    const interval = setInterval(() => {
      count++
      setVisibleLines(count)
      if (count >= total) {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 60)
  }, [])

  const handleReset = useCallback(() => {
    setPhase("config")
    setVisibleLines(0)
    setReviewMode("all")
  }, [])

  const changeTask = useCallback((id: TaskId) => {
    setActiveTask(id)
    handleReset()
  }, [handleReset])

  return (
    <div className="flex flex-col h-full">
      {/* Task type tabs */}
      <div className="px-4 pt-3 pb-0 border-b border-border/40 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
          {TASKS.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTask(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0",
                activeTask === t.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTask}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="px-5 py-2.5 bg-accent/20 border-b border-border/30 shrink-0"
        >
          <p className="text-xs text-muted-foreground">{task.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Main content: split pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Input */}
        <div className="flex flex-col border-r border-border/40 overflow-hidden"
          style={{ width: phase === "config" ? "100%" : "45%" }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card/30 shrink-0">
            <span className="text-xs font-medium text-muted-foreground">输入区</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedCard}
                onChange={(e) => {
                  setSelectedCard(e.target.value)
                  if (e.target.value) setDraft(GENERATE_DRAFT)
                }}
                className="text-xs bg-transparent border border-border/50 rounded px-2 py-1 text-muted-foreground cursor-pointer"
              >
                <option value="">选择已有卡片 ▾</option>
                <option value="auth">用户认证模块设计文档</option>
                <option value="api">API 设计规范</option>
                <option value="arch">前端架构方案</option>
              </select>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/40 hover:border-border transition-colors">
                <Upload className="h-3.5 w-3.5" />
                上传文件
              </button>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 resize-none bg-transparent px-4 py-3 text-sm font-mono leading-relaxed outline-none text-foreground/80 placeholder:text-muted-foreground/40"
            placeholder="在此粘贴或输入需要处理的文本内容..."
          />

          <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground">
              {draft.length} 字符
            </span>
            <button
              onClick={handleGenerate}
              disabled={!draft.trim() || isGenerating}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                draft.trim() && !isGenerating
                  ? "bg-violet-500 text-white hover:bg-violet-600 active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  开始生成
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Result */}
        <AnimatePresence>
          {phase === "result" && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "55%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col overflow-hidden shrink-0"
            >
              {/* Result header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card/30 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">AI 建议</span>
                  {!isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        +{addCount} 新增
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">
                        -{delCount} 删除
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        ~{modCount} 修改
                      </span>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setReviewMode(reviewMode === "all" ? "step" : "all")}
                    className={cn(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors",
                      reviewMode === "step"
                        ? "border-violet-400 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "border-border/50 text-muted-foreground hover:border-border"
                    )}
                  >
                    <Sliders className="h-3 w-3" />
                    逐条审阅
                  </button>
                  <button onClick={handleReset} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Diff view or step review */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {reviewMode === "all" ? (
                  GENERATE_DIFF.map((line, i) => (
                    <DiffLineRow
                      key={i}
                      line={line}
                      index={i}
                      visible={i < visibleLines}
                    />
                  ))
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground px-1 mb-3">
                      逐条确认每项 AI 建议
                    </p>
                    {GENERATE_DIFF.filter(
                      (l) => l.type !== "unchanged"
                    ).map((line, i) => (
                      <ReviewItem
                        key={i}
                        line={line}
                        index={i}
                        onAccept={() => {}}
                        onReject={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action bar */}
              {!isGenerating && reviewMode === "all" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="px-4 py-3 border-t border-border/30 flex items-center gap-2 shrink-0"
                >
                  <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium">
                    <CheckSquare className="h-3.5 w-3.5" />
                    全部采纳
                  </button>
                  <button
                    onClick={() => setReviewMode("step")}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    逐条审阅
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    重新生成
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <X className="h-3.5 w-3.5" />
                    放弃
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
