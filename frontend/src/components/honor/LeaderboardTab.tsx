"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  LEADERBOARD_DATA, MY_RANK_ENTRY, RANK_ABOVE_ME_INFLUENCE,
  type LeaderboardEntry,
} from "@/lib/honor-data"

// ─── Config ───────────────────────────────────────────────────────────────────

const TIME_TABS = ['本周榜', '本月榜', '全年榜', '历史总榜'] as const
const METRIC_OPTIONS = [
  '综合影响力', '知识贡献数', '被复用最多', '最活跃维护者', '最佳导师', '公会贡献',
]

// Simulated alternate datasets (just shuffle the order and tweak values slightly)
function getDataForTab(tab: string, metric: string): LeaderboardEntry[] {
  const base = [...LEADERBOARD_DATA]
  // Vary rankings slightly by tab
  if (tab === '本周榜') return base
  if (tab === '本月榜') {
    const copy = [...base]
    ;[copy[1], copy[2]] = [copy[2], copy[1]]
    return copy.map((e, i) => ({ ...e, rank: i + 1, rankChange: e.rankChange === 'new' ? 0 : e.rankChange }))
  }
  if (tab === '全年榜') {
    const copy = [...base]
    ;[copy[3], copy[4]] = [copy[4], copy[3]]
    return copy.map((e, i) => ({ ...e, rank: i + 1, influence: Math.round(e.influence * 1.2), rankChange: 0 }))
  }
  return base.map(e => ({ ...e, rankChange: 0 }))
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ entry, size = 'sm' }: { entry: LeaderboardEntry; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-9 h-9 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' }
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-bold text-white shrink-0', sizeMap[size])}
      style={{ background: entry.avatarBg }}
    >
      {entry.name[0]}
    </div>
  )
}

// ─── Rank Change Badge ────────────────────────────────────────────────────────

function RankChange({ change }: { change: number | 'new' }) {
  if (change === 'new') {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
        🆕 新上榜
      </span>
    )
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="w-3 h-3" />↑{change}
      </span>
    )
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-500 dark:text-red-400">
        <TrendingDown className="w-3 h-3" />↓{Math.abs(change)}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
      <Minus className="w-3 h-3" />
    </span>
  )
}

// ─── TOP 3 Podium ─────────────────────────────────────────────────────────────

const PODIUM_RING = {
  1: { color: '#f59e0b', label: '#fbbf24', height: 'h-28', glow: '0 0 24px rgba(245,158,11,0.5)' },
  2: { color: '#94a3b8', label: '#94a3b8', height: 'h-20', glow: '0 0 16px rgba(148,163,184,0.4)' },
  3: { color: '#cd7c41', label: '#d97706', height: 'h-16', glow: '0 0 14px rgba(180,100,50,0.4)' },
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const ring = PODIUM_RING[position]
  const medal = ['🥇', '🥈', '🥉'][position - 1]
  const avatarSize = position === 1 ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg'

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: position === 2 ? 0.1 : position === 3 ? 0.2 : 0,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Card */}
      <div className="flex flex-col items-center mb-2 px-3">
        <div className="text-2xl mb-2">{medal}</div>

        {/* Avatar ring */}
        <div className="relative mb-3">
          <div
            className="absolute inset-0 rounded-full blur-md -z-10"
            style={{ background: ring.color, opacity: 0.4 }}
          />
          <div
            className={cn('rounded-full flex items-center justify-center font-black text-white', avatarSize)}
            style={{
              background: entry.avatarBg,
              boxShadow: ring.glow,
              border: `3px solid ${ring.color}`,
            }}
          >
            {entry.name[0]}
          </div>
          {position === 1 && (
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-amber-400/40"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        <div className="text-sm font-bold text-foreground">{entry.name}</div>
        <div className="text-[10px] text-muted-foreground">{entry.title} · Lv.{entry.level}</div>

        <div
          className="text-sm font-black mt-1.5 tabular-nums"
          style={{ color: ring.label }}
        >
          {entry.influence.toLocaleString()}
        </div>

        {position === 1 && (
          <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
            <span>📚 {entry.cards}</span>
            <span>🔁 {entry.reuses.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Podium block */}
      <div
        className={cn('w-24 rounded-t-xl', ring.height)}
        style={{
          background: `linear-gradient(to bottom, ${ring.color}30, ${ring.color}15)`,
          borderTop: `2px solid ${ring.color}60`,
          borderLeft: `1px solid ${ring.color}30`,
          borderRight: `1px solid ${ring.color}30`,
        }}
      >
        <div
          className="text-center pt-2 font-black text-lg"
          style={{ color: ring.color }}
        >
          #{position}
        </div>
      </div>
    </motion.div>
  )
}

function PodiumSection({ entries }: { entries: LeaderboardEntry[] }) {
  const [first, second, third] = entries
  return (
    <div className="flex items-end justify-center gap-2 mb-8">
      {second && <PodiumCard entry={second} position={2} />}
      {first && <PodiumCard entry={first} position={1} />}
      {third && <PodiumCard entry={third} position={3} />}
    </div>
  )
}

// ─── Ranks 4–10 list ─────────────────────────────────────────────────────────

function RankRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-default",
        hovered ? "-translate-y-0.5 bg-accent/50 shadow-sm" : ""
      )}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-8 text-center font-bold text-muted-foreground text-sm">#{entry.rank}</div>
      <Avatar entry={entry} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">{entry.name}</span>
          <span className="text-[10px] text-muted-foreground">{entry.title} · Lv.{entry.level}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">{entry.guild}</div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="text-sm font-bold text-foreground tabular-nums">{entry.influence.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground">影响力</div>
        </div>
        <div className="w-14 text-right">
          <RankChange change={entry.rankChange} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── My Position ─────────────────────────────────────────────────────────────

function MyPosition({ open: improvOpen, setOpen: setImprovOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const me = MY_RANK_ENTRY
  const diff = RANK_ABOVE_ME_INFLUENCE - me.influence

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <div className="h-px flex-1 bg-border" />
        <span>你的位置</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/30 p-4">
        <div className="flex items-center gap-4">
          <div className="w-8 text-center font-black text-violet-600 dark:text-violet-400 text-sm">#{me.rank}</div>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
            style={{ background: me.avatarBg, border: '2px solid #a855f7' }}
          >
            {me.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-foreground">{me.name}</span>
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">（你）</span>
              <span className="text-[10px] text-muted-foreground">Lv.{me.level}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              影响力 {me.influence.toLocaleString()} · <RankChange change={me.rankChange} /> 本周上升
            </div>
          </div>
        </div>

        {/* Gap info + improve button */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            距上一名（#{me.rank - 1}）差 <span className="font-semibold text-foreground">{diff.toLocaleString()} 分</span>
          </div>
          <button
            onClick={() => setImprovOpen(!improvOpen)}
            className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
          >
            查看如何提升 →
          </button>
        </div>

        {/* Improve Suggestions */}
        <AnimatePresence>
          {improvOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-violet-200 dark:border-violet-800 space-y-2">
                <p className="text-xs font-semibold text-foreground mb-2">本周可操作的提分方向：</p>
                {[
                  { icon: '📚', tip: '本周还未发布知识卡，发布可得 +25 分' },
                  { icon: '🔁', tip: '优化《React Hooks 最佳实践》的标签，提升被复用概率' },
                  { icon: '🛡️', tip: '参与 2 次内容复审，可得 +20 分' },
                  { icon: '⚔️', tip: '接取精英远征子任务，完成可得 +200~400 分' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0">{s.icon}</span>
                    <span>{s.tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Algorithm Info ───────────────────────────────────────────────────────────

function AlgorithmInfo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-5 rounded-xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground hover:bg-accent/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <Info className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">影响力算法说明</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <p className="text-xs text-foreground font-mono leading-relaxed">
                  综合影响力 = 知识贡献分 × 35% + 被复用分 × 30% + 内容维护分 × 20% + 协作互动分 × 15%
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                我们承诺让每一分影响力都可被解释。低质量内容、连续重复发布、互刷复用行为将由 AI 检测降权。一旦发现异常，系统会先行通知本人，给出整改时间，而非直接惩罚——我们相信大多数错误源于误解，而非恶意。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Leaderboard Tab ─────────────────────────────────────────────────────

export function LeaderboardTab() {
  const [activeTab, setActiveTab] = useState<string>('本周榜')
  const [metric, setMetric] = useState(METRIC_OPTIONS[0])
  const [improvOpen, setImprovOpen] = useState(false)
  const [tabKey, setTabKey] = useState(0)

  function switchTab(t: string) {
    setActiveTab(t)
    setTabKey(k => k + 1)
    setImprovOpen(false)
  }

  const entries = getDataForTab(activeTab, metric)
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Filters */}
      <motion.div
        className="rounded-2xl border border-border bg-card p-4 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Time tabs */}
          <div className="flex gap-1 bg-muted/40 rounded-xl p-1">
            {TIME_TABS.map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={cn(
                  'flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  activeTab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Metric selector */}
          <select
            className="text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer"
            value={metric}
            onChange={e => { setMetric(e.target.value); setTabKey(k => k + 1) }}
          >
            {METRIC_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Podium */}
          <PodiumSection entries={top3} />

          {/* Ranks 4–10 */}
          <div className="rounded-2xl border border-border bg-card p-2">
            {rest.map((entry, i) => (
              <RankRow key={entry.rank} entry={entry} index={i} />
            ))}

            {/* My Position */}
            <MyPosition open={improvOpen} setOpen={setImprovOpen} />
          </div>

          {/* Algorithm info */}
          <AlgorithmInfo />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
