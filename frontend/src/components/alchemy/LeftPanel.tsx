"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Sparkles,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  History,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Wand2,
  CheckSquare,
  Map,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AIMode, HistorySession } from "@/lib/alchemy-data"
import { HISTORY_SESSIONS } from "@/lib/alchemy-data"

interface ModeConfig {
  id: AIMode
  label: string
  shortLabel: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const MODES: ModeConfig[] = [
  {
    id: "qa",
    label: "AI 问答",
    shortLabel: "问答",
    description: "深度知识检索，引用可溯源",
    icon: <Bot className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "generate",
    label: "生成增强",
    shortLabel: "生成",
    description: "内容生成与文档智能优化",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "governance",
    label: "治理质检",
    shortLabel: "质检",
    description: "知识库健康检测与问题治理",
    icon: <ShieldCheck className="h-5 w-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "learning",
    label: "学习路径",
    shortLabel: "路径",
    description: "AI 定制个人成长地图",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "exam",
    label: "帮学考核",
    shortLabel: "考核",
    description: "知识卡自动出题与即时反馈",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
]

const MODE_ICONS_SMALL: Record<AIMode, React.ReactNode> = {
  qa: <MessageSquare className="h-4 w-4" />,
  generate: <Wand2 className="h-4 w-4" />,
  governance: <CheckSquare className="h-4 w-4" />,
  learning: <Map className="h-4 w-4" />,
  exam: <ClipboardList className="h-4 w-4" />,
}

function formatTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "今天"
  if (days === 1) return "昨天"
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

interface LeftPanelProps {
  activeMode: AIMode
  onModeChange: (mode: AIMode) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function LeftPanel({
  activeMode,
  onModeChange,
  collapsed,
  onToggleCollapse,
}: LeftPanelProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const router = useRouter()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col border-r border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border/40 min-h-[52px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <button 
                onClick={() => router.push("/")}
                className="p-1 hover:bg-accent/50 rounded-md transition-colors mr-1"
                title="返回主页"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                AI Agents
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mode List */}
      <nav className="flex-1 p-2 space-y-0.5">
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "relative w-full flex items-center gap-3 rounded-lg transition-all duration-200 group",
                collapsed ? "px-2 py-2.5 justify-center" : "px-3 py-2.5",
                isActive
                  ? "bg-foreground/8 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
              title={collapsed ? mode.label : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-mode-indicator"
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full",
                    mode.color.replace("text-", "bg-")
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <span
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? mode.color : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {mode.icon}
              </span>

              {/* Labels */}
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    key={`label-${mode.id}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <div className="text-sm font-medium leading-tight whitespace-nowrap">
                      {mode.label}
                    </div>
                    {isActive && (
                      <div className="text-[11px] text-muted-foreground leading-tight mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {mode.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* History */}
      <div className="border-t border-border/40 p-2">
        <button
          onClick={() => !collapsed && setHistoryOpen(!historyOpen)}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "历史记录" : undefined}
        >
          <History className="h-4 w-4 shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="hist-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1 flex-1"
              >
                <span className="text-xs font-medium">历史记录</span>
                <span className="ml-auto">
                  {historyOpen ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {historyOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-1 space-y-0.5">
                {HISTORY_SESSIONS.map((session) => (
                  <HistoryItem key={session.id} session={session} onModeChange={onModeChange} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

function HistoryItem({
  session,
  onModeChange,
}: {
  session: HistorySession
  onModeChange: (mode: AIMode) => void
}) {
  return (
    <button
      onClick={() => onModeChange(session.mode)}
      className="w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left hover:bg-accent/40 transition-colors group"
    >
      <span className="text-muted-foreground mt-0.5 shrink-0 group-hover:text-foreground transition-colors">
        {MODE_ICONS_SMALL[session.mode]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-foreground/80 truncate leading-tight">
          {session.title}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {formatTime(session.timestamp)}
        </div>
      </div>
    </button>
  )
}
