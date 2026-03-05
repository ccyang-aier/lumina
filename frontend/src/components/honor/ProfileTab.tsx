"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CURRENT_USER, ACHIEVEMENTS, RECENT_ACTIVITIES, RARITY_CONFIG,
  type Achievement, type ActivityItem,
} from "@/lib/honor-data"
import { ContributionHeatmap } from "./ContributionHeatmap"

// ─── Level Ring Config ────────────────────────────────────────────────────────

function getLevelRingStyle(level: number): { gradient: string; animate: boolean } {
  if (level <= 2) return { gradient: '#94a3b8, #7dd3fc', animate: false }
  if (level <= 4) return { gradient: '#4ade80, #86efac', animate: false }
  if (level <= 6) return { gradient: '#38bdf8, #7dd3fc', animate: false }
  if (level <= 8) return { gradient: '#a855f7, #818cf8', animate: true }
  if (level <= 10) return { gradient: '#fbbf24, #f59e0b', animate: false }
  return { gradient: '#f87171, #fb923c, #facc15, #4ade80, #60a5fa, #a855f7, #f87171', animate: true }
}

// ─── CountUp Hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

// ─── Stat Item with CountUp ───────────────────────────────────────────────────

function StatItem({ emoji, label, value, delay }: { emoji: string; label: string; value: number; delay?: number }) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      <div className="text-lg">{emoji}</div>
      <div className="text-xl font-bold text-foreground tabular-nums">
        {count.toLocaleString()}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

// ─── Level Progress Bar ───────────────────────────────────────────────────────

function LevelProgressBar({ progress, target, level, nextLevel }: {
  progress: number; target: number; level: number; nextLevel: number
}) {
  const pct = Math.min((progress / target) * 100, 100)
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setTimeout(() => setWidth(pct), 100)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [pct])

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span className="font-semibold text-foreground">Lv.{level}</span>
        <span>{progress.toLocaleString()} / {target.toLocaleString()}  ·  距 Lv.{nextLevel} 还差 {(target - progress).toLocaleString()} 分</span>
        <span className="font-semibold text-foreground">Lv.{nextLevel}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
          style={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// ─── Badge in Profile ─────────────────────────────────────────────────────────

function BadgeItem({ ach }: { ach: Achievement }) {
  const cfg = RARITY_CONFIG[ach.rarity]
  const [hovered, setHovered] = useState(false)
  const unlocked = ach.status === 'unlocked'

  return (
    <div
      className="relative flex flex-col items-center gap-1 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className={cn(
          "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl transition-all",
          unlocked ? '' : 'grayscale opacity-40 blur-[1px]',
        )}
        style={{
          borderColor: unlocked ? cfg.color : '#6b728040',
          boxShadow: unlocked && ach.rarity !== 'common' ? cfg.glow : undefined,
          background: unlocked ? cfg.color + '18' : undefined,
        }}
        whileHover={unlocked ? { scale: 1.1 } : { scale: 1.05 }}
      >
        {ach.icon}
      </motion.div>
      <span className="text-[9px] text-center text-muted-foreground leading-tight line-clamp-1 w-12">{ach.name}</span>
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 h-1.5 rounded-full w-8"
        style={{ background: cfg.color }}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 w-44 rounded-lg border border-border bg-popover shadow-xl p-2.5 text-xs pointer-events-none"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="font-semibold text-foreground mb-1">{ach.icon} {ach.name}</div>
            <div className="text-muted-foreground mb-1">{ach.condition}</div>
            {unlocked ? (
              <div className="text-green-600 dark:text-green-400">✓ 已解锁 · {ach.unlockedAt}</div>
            ) : ach.status === 'in-progress' ? (
              <div className="text-amber-600 dark:text-amber-400">进行中 {ach.progress} / {ach.total}</div>
            ) : (
              <div className="text-muted-foreground/60">尚未解锁</div>
            )}
            <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] inline-block" style={{ background: cfg.color + '20', color: cfg.color }}>
              {cfg.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Badge Wall ───────────────────────────────────────────────────────────────

function BadgeWall() {
  const unlocked = ACHIEVEMENTS.filter(a => a.status === 'unlocked').length
  const total = ACHIEVEMENTS.length
  const showcased = ACHIEVEMENTS.slice(0, 16)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">
          成就勋章
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            已解锁 {unlocked} / {total}
          </span>
        </h3>
        <Sparkles className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
        {showcased.map(ach => (
          <BadgeItem key={ach.id} ach={ach} />
        ))}
      </div>
    </div>
  )
}

// ─── Activity Timeline ────────────────────────────────────────────────────────

const TYPE_COLORS: Record<ActivityItem['type'], string> = {
  'reuse-milestone': '#f59e0b',
  expedition: '#ef4444',
  achievement: '#a855f7',
  certification: '#10b981',
  streak: '#3b82f6',
}

function ActivityTimeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-5">近期动态</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

        <div className="flex flex-col gap-5">
          {RECENT_ACTIVITIES.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex gap-4 items-start"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              {/* Icon dot */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{ background: TYPE_COLORS[item.type] + '20', border: `2px solid ${TYPE_COLORS[item.type]}40` }}
              >
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-foreground">{item.title}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: TYPE_COLORS[item.type] + '20', color: TYPE_COLORS[item.type] }}
                  >
                    +{item.points}分
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="text-[10px] text-muted-foreground/50 mt-1">{item.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Points Rules ─────────────────────────────────────────────────────────────

const EARN_RULES = [
  { action: '发布知识卡（首次）', points: '+25 分' },
  { action: '知识卡通过权威认证', points: '+50 分' },
  { action: '卡片每被复用一次', points: '+3 分' },
  { action: '每次完成内容复审', points: '+10 分' },
  { action: '被采纳评论 / 建议', points: '+5 分' },
  { action: '完成学习路径打卡', points: '+5 分/天' },
  { action: '他人标记「解决了我的问题」', points: '+5 分' },
]

const EXPEDITION_RULES = [
  { tier: '普通远征子任务', range: '+50 ~ +150 分' },
  { tier: '精英远征子任务', range: '+200 ~ +400 分' },
  { tier: '史诗 / 传说远征子任务', range: '+500 ~ +1500 分' },
]

const DEDUCT_RULES = [
  { action: '发布内容被标记低质量', points: '−10 分' },
  { action: '内容严重过期未维护（提醒后30天）', points: '−5 分/周' },
  { action: '检测到刷量行为', points: '清零当日所得积分' },
]

function PointsRules() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-sm font-semibold text-foreground hover:bg-accent/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span>✨</span>
          <span>积分规则</span>
          <span className="text-xs font-normal text-muted-foreground">· 每一分积分，都记录着真实的贡献</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5">
              {/* Earn */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">积分获取</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  {EARN_RULES.map((r, i) => (
                    <div key={i} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", i !== 0 && "border-t border-border")}>
                      <span className="text-muted-foreground">{r.action}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{r.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expedition */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">远征奖励</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  {EXPEDITION_RULES.map((r, i) => (
                    <div key={i} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", i !== 0 && "border-t border-border")}>
                      <span className="text-muted-foreground">{r.tier}</span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400 tabular-nums">{r.range}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deduct */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">积分扣减</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  {DEDUCT_RULES.map((r, i) => (
                    <div key={i} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", i !== 0 && "border-t border-border")}>
                      <span className="text-muted-foreground">{r.action}</span>
                      <span className="font-semibold text-red-500 dark:text-red-400 tabular-nums">{r.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main ProfileTab ──────────────────────────────────────────────────────────

export function ProfileTab() {
  const user = CURRENT_USER
  const { gradient, animate: doAnimate } = getLevelRingStyle(user.level)

  return (
    <div className="space-y-6">
      {/* ── Identity Card ── */}
      <motion.div
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar with level ring */}
          <div className="relative shrink-0">
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                padding: 3,
                background: `conic-gradient(${gradient})`,
              }}
              animate={doAnimate ? { rotate: 360 } : undefined}
              transition={doAnimate ? { duration: 6, repeat: Infinity, ease: 'linear' } : undefined}
            >
              <div className="w-full h-full rounded-full bg-card" />
            </motion.div>

            {/* Glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-sm -z-10"
              style={{ background: `conic-gradient(${gradient})` }}
              animate={doAnimate ? { opacity: [0.4, 0.8, 0.4] } : { opacity: 0.3 }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            {/* Avatar */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
              style={{ background: user.avatarBg, margin: 4 }}
            >
              {user.name[0]}
            </div>

            {/* Level badge */}
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-[10px] font-black text-foreground"
            >
              {user.level}
            </div>
          </div>

          {/* Identity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
                {user.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                Lv.{user.level}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
              <span>🏛️ {user.guild}</span>
              <span>📅 加入 Lumina {user.joinDays} 天</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 mb-5">
              <StatItem emoji="✨" label="积分" value={user.points} />
              <StatItem emoji="🪙" label="金币" value={user.coins} />
              <StatItem emoji="📚" label="发布卡" value={user.cardsPublished} />
              <StatItem emoji="🔁" label="被复用" value={user.reusedCount} />
            </div>

            {/* Level progress */}
            <LevelProgressBar
              progress={user.levelProgress}
              target={user.levelTarget}
              level={user.level}
              nextLevel={user.nextLevel}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Contribution Heatmap ── */}
      <motion.div
        className="rounded-2xl border border-border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <ContributionHeatmap />
      </motion.div>

      {/* ── Badge Wall + Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <BadgeWall />
          </motion.div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ActivityTimeline />
          </motion.div>
        </div>
      </div>

      {/* ── Points Rules ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <PointsRules />
      </motion.div>
    </div>
  )
}
