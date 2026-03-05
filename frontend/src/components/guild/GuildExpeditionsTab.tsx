"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, Users, Target, CalendarDays } from 'lucide-react'
import { GUILD_EXPEDITIONS, getDaysUntil, type GuildExpedition } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

// ─── Animated progress bar ────────────────────────────────────────────────────

function ProgressBar({ value, max, color = '#3b82f6' }: { value: number; max: number; color?: string }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(Math.min((value / max) * 100, 100)) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, max])

  return (
    <div ref={ref} className="relative h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
      />
    </div>
  )
}

// ─── Stacked avatars ──────────────────────────────────────────────────────────

function StackedAvatars({ participants, max = 5 }: { participants: GuildExpedition['participants']; max?: number }) {
  const visible = participants.slice(0, max)
  const overflow = participants.length - max

  return (
    <div className="flex items-center">
      {visible.map((p, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          style={{ background: p.avatarColor, marginLeft: i === 0 ? 0 : '-8px', zIndex: visible.length - i }}
          title={p.name}
        >
          {p.name[0]}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold bg-muted text-muted-foreground shrink-0"
          style={{ marginLeft: '-8px' }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: GuildExpedition['status'] }) {
  const cfg = {
    active:     { label: '进行中', color: '#22c55e', bg: '#22c55e10', dot: true },
    completed:  { label: '已完成', color: '#64748b', bg: '#64748b10', dot: false },
    preparing:  { label: '筹备中', color: '#f59e0b', bg: '#f59e0b10', dot: true },
  }[status]

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />}
      {cfg.label}
    </span>
  )
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ deadline }: { deadline: string }) {
  const days = getDaysUntil(deadline)
  const isUrgent = days <= 7 && days >= 0
  const isPast = days < 0

  if (isPast) return <span className="text-xs text-muted-foreground">已截止</span>

  return (
    <span className={cn('text-xs font-medium', isUrgent ? 'text-red-500' : 'text-muted-foreground')}>
      <CalendarDays className="w-3 h-3 inline mr-1" />
      还剩 <span className={cn('font-bold', isUrgent && 'text-red-500')}>{days}</span> 天
    </span>
  )
}

// ─── Expedition Card ──────────────────────────────────────────────────────────

function ExpeditionCard({ expedition, index }: { expedition: GuildExpedition; index: number }) {
  const isCompleted = expedition.status === 'completed'
  const progressColor = isCompleted ? '#22c55e' : expedition.status === 'preparing' ? '#f59e0b' : '#3b82f6'
  const pct = Math.round((expedition.completedCards / expedition.targetCards) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border bg-card p-5 overflow-hidden relative',
        isCompleted && 'opacity-85'
      )}
    >
      {/* Completed overlay accent */}
      {isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400/60 via-emerald-500 to-emerald-400/60" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug mb-2">{expedition.name}</h3>
          <StatusBadge status={expedition.status} />
        </div>
        {!isCompleted && <Countdown deadline={expedition.deadline} />}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {expedition.description}
      </p>

      {/* Progress */}
      {!isCompleted ? (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" />
              知识卡进度
            </span>
            <span className="font-medium text-foreground">
              {expedition.completedCards} / {expedition.targetCards}
              <span className="text-muted-foreground ml-1">({pct}%)</span>
            </span>
          </div>
          <ProgressBar value={expedition.completedCards} max={expedition.targetCards} color={progressColor} />
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          共同完成了 <span className="font-bold">{expedition.completedCards}</span> 张知识卡，
          历时 <span className="font-bold">{expedition.daysElapsed}</span> 天 🎉
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <StackedAvatars participants={expedition.participants} />
          <span className="text-xs text-muted-foreground">{expedition.participants.length} 人参与</span>
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 transition-opacity">
              参与远征
            </button>
          )}
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent transition-all">
            查看详情
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Tab ─────────────────────────────────────────────────────────────────────

export function GuildExpeditionsTab() {
  const active = GUILD_EXPEDITIONS.filter(e => e.status === 'active')
  const completed = GUILD_EXPEDITIONS.filter(e => e.status === 'completed')

  return (
    <div className="pt-4">

      {/* Active */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">进行中的远征</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {active.map((exp, i) => (
            <ExpeditionCard key={exp.id} expedition={exp} index={i} />
          ))}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 已完成的远征
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map((exp, i) => (
              <ExpeditionCard key={exp.id} expedition={exp} index={active.length + i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
