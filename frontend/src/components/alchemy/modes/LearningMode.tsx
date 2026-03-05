"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  RefreshCw,
  Share2,
  BookOpen,
  Zap,
  Sliders,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LEARNING_PATH } from "@/lib/alchemy-data"
import type { LearningPhase, LearningTask, TaskStatus } from "@/lib/alchemy-data"

// ─── Config Panel ─────────────────────────────────────────────────────────────

const ROLES = [
  "前端工程师",
  "后端工程师",
  "数据工程师",
  "DevOps",
  "产品经理",
  "全栈工程师",
  "其他",
]

const TIME_OPTIONS = [
  { label: "1 周", value: 1 },
  { label: "2 周", value: 2 },
  { label: "1 个月", value: 4 },
  { label: "自定义", value: 0 },
]

// ─── Task Node ────────────────────────────────────────────────────────────────

function TaskNode({
  task,
  isLast,
  phaseCompleted,
}: {
  task: LearningTask
  isLast: boolean
  phaseCompleted: boolean
}) {
  const statusConfig: Record<
    TaskStatus,
    { icon: React.ReactNode; labelColor: string; cardBg: string; lineColor: string }
  > = {
    completed: {
      icon: (
        <CheckCircle2 className="h-5 w-5 text-white" />
      ),
      labelColor: "text-foreground/60",
      cardBg: "bg-card/40 border-border/30",
      lineColor: "bg-foreground/20",
    },
    today: {
      icon: (
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-3 w-3 rounded-full bg-white"
        />
      ),
      labelColor: "text-foreground font-medium",
      cardBg:
        "bg-card border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      lineColor: "bg-muted/30",
    },
    pending: {
      icon: <Circle className="h-4 w-4 text-muted-foreground/40" />,
      labelColor: "text-muted-foreground",
      cardBg: "bg-card/30 border-border/30",
      lineColor: "bg-muted/30",
    },
  }

  const cfg = statusConfig[task.status]

  const nodeColors: Record<TaskStatus, string> = {
    completed: "bg-foreground/60",
    today: "bg-amber-500",
    pending: "bg-muted/40 border-2 border-border/40",
  }

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={task.status === "today" ? { scale: 0.8 } : { scale: 1 }}
          animate={{ scale: 1 }}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10",
            nodeColors[task.status]
          )}
        >
          {cfg.icon}
        </motion.div>
        {!isLast && (
          <div className={cn("w-0.5 flex-1 mt-1 min-h-[20px]", cfg.lineColor)} />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "flex-1 mb-3 p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-sm",
          cfg.cardBg
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {task.status === "today" && (
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full mb-1.5 inline-block">
                今日任务
              </span>
            )}
            <p className={cn("text-sm leading-snug", cfg.labelColor)}>
              {task.title}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
              {task.cardTitle}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            <span className="text-[11px]">{task.estimatedMinutes}min</span>
          </div>
        </div>

        {task.status === "today" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            开始学习
            <ChevronRight className="h-3 w-3" />
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

// ─── Phase Block ──────────────────────────────────────────────────────────────

function PhaseBlock({ phase }: { phase: LearningPhase }) {
  const completedCount = phase.tasks.filter((t) => t.status === "completed").length
  const phaseCompleted = completedCount === phase.tasks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Phase header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "text-sm font-bold",
            phaseCompleted ? "text-foreground/50" : "text-foreground"
          )}
        >
          {phase.title}
        </div>
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {completedCount}/{phase.tasks.length}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4 -mt-2">{phase.subtitle}</p>

      {/* Tasks */}
      <div>
        {phase.tasks.map((task, i) => (
          <TaskNode
            key={task.id}
            task={task}
            isLast={i === phase.tasks.length - 1}
            phaseCompleted={phaseCompleted}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Learning Mode ───────────────────────────────────────────────────────

type LearningPhaseState = "config" | "generating" | "result"

export function LearningMode() {
  const [stage, setStage] = useState<LearningPhaseState>("result") // default show result for demo
  const [role, setRole] = useState("前端工程师")
  const [goal, setGoal] = useState(
    "独立负责一个功能模块的前端开发，从需求理解到代码上线"
  )
  const [timeOption, setTimeOption] = useState(4)
  const [generatingText, setGeneratingText] = useState("")

  const totalTasks = LEARNING_PATH.reduce((s, p) => s + p.tasks.length, 0)
  const completedTasks = LEARNING_PATH.reduce(
    (s, p) => s + p.tasks.filter((t) => t.status === "completed").length,
    0
  )
  const todayTask = LEARNING_PATH.flatMap((p) => p.tasks).find(
    (t) => t.status === "today"
  )
  const remainingDays = 14

  const handleGenerate = useCallback(() => {
    setStage("generating")
    const texts = [
      "正在分析知识库...",
      "匹配学习目标...",
      "为你量身定制路径...",
      "优化任务顺序...",
    ]
    let idx = 0
    const interval = setInterval(() => {
      setGeneratingText(texts[idx % texts.length])
      idx++
    }, 700)
    setTimeout(() => {
      clearInterval(interval)
      setStage("result")
    }, 3000)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 shrink-0">
        <span className="text-sm font-semibold">学习路径规划</span>
        <div className="flex gap-2">
          {stage === "result" && (
            <>
              <button
                onClick={() => setStage("config")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <Sliders className="h-3.5 w-3.5" />
                调整路径
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/50 hover:border-border transition-colors">
                <Share2 className="h-3.5 w-3.5" />
                分享给公会
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Config */}
        <AnimatePresence mode="wait">
          {stage === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6 max-w-xl"
            >
              {/* Role */}
              <div>
                <label className="text-sm font-medium mb-2 block">我的角色</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-sm bg-card border border-border/60 rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="text-sm font-medium mb-2 block">学习目标</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  placeholder="描述你希望达到的能力目标..."
                  className="w-full text-sm bg-card border border-border/60 rounded-lg px-3 py-2.5 resize-none outline-none focus:border-foreground/30 transition-colors"
                />
              </div>

              {/* Time budget */}
              <div>
                <label className="text-sm font-medium mb-2 block">时间预算</label>
                <div className="flex gap-2">
                  {TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTimeOption(opt.value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm border transition-all",
                        timeOption === opt.value
                          ? "bg-foreground text-background border-foreground"
                          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all text-sm font-medium"
              >
                <Sparkles className="h-4 w-4" />
                AI 生成路径
              </button>
            </motion.div>
          )}

          {/* Generating */}
          {stage === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
              >
                <Sparkles className="h-7 w-7 text-white" />
              </motion.div>
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={generatingText}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm font-medium"
                  >
                    {generatingText}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground mt-1">
                  正在分析知识库，为你量身定制...
                </p>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Summary bar */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-400/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">
                    {role} · 新人成长路径
                  </span>
                  <span className="text-xs text-muted-foreground">
                    已完成 {completedTasks} / {totalTasks} 个任务
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(completedTasks / totalTasks) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-amber-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  预计还需{" "}
                  <span className="text-foreground font-medium">
                    {remainingDays} 天
                  </span>{" "}
                  完成全部任务
                </p>
              </div>

              {/* Today highlight */}
              {todayTask && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 p-4 rounded-xl border-2 border-amber-400/40 bg-amber-500/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      今日任务
                    </span>
                  </div>
                  <p className="text-sm font-medium">{todayTask.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {todayTask.cardTitle}
                  </p>
                  <button className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:opacity-80 transition-opacity">
                    <BookOpen className="h-4 w-4" />
                    继续学习
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}

              {/* Path */}
              {LEARNING_PATH.map((phase) => (
                <PhaseBlock key={phase.id} phase={phase} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
