"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  ACHIEVEMENTS, RARITY_CONFIG,
  type Achievement, type Rarity, type AchievementCategory, type AchievementStatus,
} from "@/lib/honor-data"
import { UnlockEffect } from "./UnlockEffect"

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORIES: { key: AchievementCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'creation', label: '创作类' },
  { key: 'influence', label: '影响力类' },
  { key: 'persistence', label: '坚持类' },
  { key: 'collaboration', label: '协作类' },
  { key: 'guild', label: '公会类' },
  { key: 'legendary-all', label: '传说类' },
]

const STATUS_FILTERS: { key: AchievementStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部状态' },
  { key: 'unlocked', label: '已解锁' },
  { key: 'in-progress', label: '进行中' },
  { key: 'locked', label: '未解锁' },
]

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? value / total : 0
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  const ref = useRef<SVGCircleElement>(null)
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 300)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="7" className="stroke-muted/60" />
        {/* Progress */}
        <circle
          ref={ref}
          cx="50" cy="50" r={r}
          fill="none"
          strokeWidth="7"
          stroke="url(#prog-grad)"
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{
            strokeDashoffset: circ - animated * circ,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <defs>
          <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">/ {total}</span>
      </div>
    </div>
  )
}

// ─── Rarity Distribution Bar ──────────────────────────────────────────────────

function RarityDistBar({ unlockedAch }: { unlockedAch: Achievement[] }) {
  const counts = {
    common: unlockedAch.filter(a => a.rarity === 'common').length,
    rare: unlockedAch.filter(a => a.rarity === 'rare').length,
    epic: unlockedAch.filter(a => a.rarity === 'epic').length,
    legendary: unlockedAch.filter(a => a.rarity === 'legendary').length,
  }
  const total = unlockedAch.length || 1
  const rarities: Rarity[] = ['common', 'rare', 'epic', 'legendary']

  return (
    <div className="w-full">
      <div className="flex h-3 rounded-full overflow-hidden gap-px mb-2">
        {rarities.map(r => {
          const pct = (counts[r] / total) * 100
          if (pct === 0) return null
          return (
            <motion.div
              key={r}
              className="h-full rounded-full"
              style={{ background: RARITY_CONFIG[r].color, width: `${pct}%` }}
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        {rarities.map(r => (
          <div key={r} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: RARITY_CONFIG[r].color }} />
            <span>{RARITY_CONFIG[r].label}</span>
            <span className="font-semibold text-foreground">{counts[r]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Overview Section ─────────────────────────────────────────────────────────

function AchievementOverview() {
  const total = ACHIEVEMENTS.length
  const unlocked = ACHIEVEMENTS.filter(a => a.status === 'unlocked')
  const inProgress = ACHIEVEMENTS.filter(a => a.status === 'in-progress').length

  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-6 mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <CircularProgress value={unlocked.length} total={total} />
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3 className="text-base font-bold text-foreground mb-0.5">成就进度</h3>
            <p className="text-sm text-muted-foreground">
              已解锁 <span className="font-semibold text-foreground">{unlocked.length}</span> 枚·
              进行中 <span className="font-semibold text-amber-600 dark:text-amber-400">{inProgress}</span> 枚·
              未解锁 <span className="font-semibold text-muted-foreground">{total - unlocked.length - inProgress}</span> 枚
            </p>
          </div>
          <RarityDistBar unlockedAch={unlocked} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Achievement Card ─────────────────────────────────────────────────────────

function AchievementCard({ ach, index }: { achievement?: never; ach: Achievement; index: number }) {
  const cfg = RARITY_CONFIG[ach.rarity]
  const unlocked = ach.status === 'unlocked'
  const inProgress = ach.status === 'in-progress'
  const pct = inProgress && ach.total ? (ach.progress! / ach.total) * 100 : 0
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border-2 p-4 flex flex-col gap-3 cursor-default transition-all duration-300 overflow-hidden",
        unlocked
          ? cn(cfg.borderClass, cfg.bgClass)
          : inProgress
            ? "border-border/60 bg-card"
            : "border-border/30 bg-muted/20 grayscale-[0.6]"
      )}
      style={unlocked && ach.rarity !== 'common' ? { boxShadow: cfg.glow } : undefined}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={unlocked ? { y: -3, boxShadow: `${cfg.glow}, 0 8px 24px rgba(0,0,0,0.12)` } : { y: -1 }}
    >
      {/* Shimmer texture for unlocked */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${cfg.color}12 50%, transparent 100%)`,
          }}
          animate={hovered ? { x: ['-100%', '100%'] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}

      {/* Icon + rarity */}
      <div className="flex items-start justify-between">
        <div
          className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", unlocked ? '' : 'opacity-50 blur-[2px]')}
          style={unlocked ? { background: cfg.color + '20', boxShadow: ach.rarity !== 'common' ? cfg.glow : undefined } : { background: '#6b728020' }}
        >
          {ach.icon}
        </div>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.color + '20', color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <h4 className={cn("text-sm font-bold mb-0.5", unlocked ? 'text-foreground' : 'text-muted-foreground')}>{ach.name}</h4>
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {unlocked ? ach.description : ach.condition}
        </p>
      </div>

      {/* Status */}
      {unlocked && (
        <div className="text-[10px]" style={{ color: cfg.color }}>
          ✓ 已解锁 · {ach.unlockedAt}
        </div>
      )}

      {inProgress && ach.total && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>进度</span>
            <span className="font-semibold text-foreground tabular-nums">{ach.progress} / {ach.total}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: cfg.color, width: `${hovered ? pct : pct * 0.9}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {ach.status === 'locked' && (
        <div className="text-[10px] text-muted-foreground/50">🔒 {ach.condition}</div>
      )}
    </motion.div>
  )
}

// ─── Demo Unlock Button ───────────────────────────────────────────────────────

const DEMO_OPTIONS: { rarity: Rarity; label: string; id: string }[] = [
  { rarity: 'common', label: '普通', id: 'seven-star' },
  { rarity: 'rare', label: '稀有', id: 'igniter' },
  { rarity: 'epic', label: '史诗', id: 'dragon-slayer' },
  { rarity: 'legendary', label: 'glory-crowned', id: 'glory-crowned' },
]

// ─── Main AchievementsTab ─────────────────────────────────────────────────────

export function AchievementsTab() {
  const [category, setCategory] = useState<AchievementCategory | 'all'>('all')
  const [status, setStatus] = useState<AchievementStatus | 'all'>('all')
  const [filterKey, setFilterKey] = useState(0)
  const [unlockTarget, setUnlockTarget] = useState<Achievement | null>(null)
  const [showDemo, setShowDemo] = useState(false)

  const filtered = ACHIEVEMENTS.filter(a => {
    const matchCat = category === 'all' || a.category === category
    const matchStatus = status === 'all' || a.status === status
    return matchCat && matchStatus
  })

  function applyFilter(cat: typeof category, sta: typeof status) {
    setCategory(cat)
    setStatus(sta)
    setFilterKey(k => k + 1)
  }

  function triggerDemo(rarity: Rarity) {
    const ach = ACHIEVEMENTS.find(a => a.rarity === rarity) || ACHIEVEMENTS[0]
    const copy: Achievement = { ...ach, status: 'unlocked', unlockedAt: '2026-03-02' }
    setUnlockTarget(copy)
    setShowDemo(false)
  }

  return (
    <div>
      {/* Overview */}
      <AchievementOverview />

      {/* Filters */}
      <motion.div
        className="rounded-2xl border border-border bg-card p-4 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Category */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => applyFilter(c.key as typeof category, status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  category === c.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Status filter + demo */}
          <div className="flex items-center gap-2">
            <select
              className="text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer"
              value={status}
              onChange={e => applyFilter(category, e.target.value as typeof status)}
            >
              {STATUS_FILTERS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>

            {/* Demo button */}
            <div className="relative">
              <button
                onClick={() => setShowDemo(d => !d)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center gap-1.5"
              >
                ✨ 模拟解锁
              </button>

              <AnimatePresence>
                {showDemo && (
                  <motion.div
                    className="absolute right-0 top-full mt-1 z-30 rounded-xl border border-border bg-popover shadow-xl p-2 min-w-32"
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map(r => {
                      const cfg = RARITY_CONFIG[r]
                      return (
                        <button
                          key={r}
                          onClick={() => triggerDemo(r)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-accent transition-colors"
                        >
                          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cfg.color }} />
                          <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
                          <span className="text-muted-foreground">成就</span>
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterKey}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              当前筛选条件下暂无成就
            </div>
          ) : (
            filtered.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} index={i} />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Unlock Effect */}
      <AnimatePresence>
        {unlockTarget && (
          <UnlockEffect
            key={unlockTarget.id + Date.now()}
            achievement={unlockTarget}
            onClose={() => setUnlockTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
