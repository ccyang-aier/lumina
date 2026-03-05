"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, Trophy, CheckCircle2, Loader2, Circle, Swords, ChevronRight } from 'lucide-react'
import { type Expedition, RARITY_CONFIG, TYPE_CONFIG } from '@/lib/expedition-data'
import { RarityBadge } from './RarityBadge'
import { BossHealthBar } from './BossHealthBar'
import { ProgressBar } from './ProgressBar'
import styles from './expedition.module.css'
import { cn } from '@/lib/utils'

interface ExpeditionCardProps {
  expedition: Expedition
  index?: number
}

function ParticipantAvatars({ participants, maxParticipants }: { participants: Expedition['participants'], maxParticipants: number }) {
  const shown = participants.slice(0, 5)
  const extra = participants.length - shown.length

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1.5">
        {shown.map((p) => (
          <div
            key={p.id}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-black/20 dark:border-white/10 flex-shrink-0"
            style={{ background: `${p.color}cc`, boxShadow: `0 0 6px ${p.color}60` }}
            title={p.name}
          >
            {p.initials}
          </div>
        ))}
        {extra > 0 && (
          <div className="w-6 h-6 rounded-full bg-slate-700/80 dark:bg-slate-600/80 flex items-center justify-center text-[8px] text-slate-300 border border-white/10 flex-shrink-0">
            +{extra}
          </div>
        )}
      </div>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">
        {participants.length}/{maxParticipants} 人
      </span>
    </div>
  )
}

export function ExpeditionCard({ expedition, index = 0 }: ExpeditionCardProps) {
  const cfg = RARITY_CONFIG[expedition.rarity]
  const typeCfg = TYPE_CONFIG[expedition.type]
  const isCompleted = expedition.status === 'completed'
  const isLegendary = expedition.rarity === 'legendary'
  const isEpic = expedition.rarity === 'epic'

  const daysLeft = (() => {
    const diff = new Date(expedition.deadline).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return '已截止'
    if (days === 0) return '今日截止'
    return `${days} 天后截止`
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/expedition/${expedition.id}`} className="block">
        <div
          className={cn(
            styles.expeditionCard,
            styles.glassPanel,
            isLegendary && styles.legendaryPulse,
            isEpic && styles.epicPulse,
            'group relative border'
          )}
          style={{
            background: `linear-gradient(135deg, ${cfg.bgDark} 0%, transparent 100%)`,
            borderColor: cfg.border,
          }}
        >
          {/* 稀有度顶部色条 */}
          <div
            className={styles.rarityBar}
            style={{ background: cfg.gradient, boxShadow: `0 0 10px ${cfg.color}60` }}
          />

          {/* 已完成纹理 */}
          {isCompleted && <div className={styles.completedOverlay} />}

          {/* 角落装饰 */}
          {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(pos => (
            <div
              key={pos}
              className={cn(styles.cornerAccent, styles[pos as keyof typeof styles])}
              style={{ borderColor: `${cfg.color}50` }}
            />
          ))}

          <div className="relative z-10 p-5">
            {/* 头部：稀有度 + 类型 + 状态 */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <RarityBadge rarity={expedition.rarity} />
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                  style={{ color: typeCfg.color, background: typeCfg.bg }}
                >
                  {typeCfg.label}
                </span>
                {expedition.medal && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    🏅 含专属勋章
                  </span>
                )}
              </div>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold shrink-0"
                  style={{ textShadow: '0 0 8px rgba(52,211,153,0.5)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 已验收
                </span>
              )}
              {expedition.status === 'active' && (
                <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: cfg.color }}>
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: cfg.color }} />
                  </span>
                  进行中
                </span>
              )}
              {expedition.status === 'available' && (
                <span className="text-[11px] text-slate-400 shrink-0">可接取</span>
              )}
            </div>

            {/* 标题 */}
            <h3
              className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-current transition-colors line-clamp-1"
              style={{ fontSize: '15px', letterSpacing: '0.02em' }}
            >
              {expedition.title}
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
              {expedition.description}
            </p>

            {/* Boss 血量 */}
            <div className="mb-3">
              <BossHealthBar
                bossName={expedition.bossName}
                hp={expedition.bossHp}
                isCompleted={isCompleted}
                size="sm"
              />
            </div>

            {/* 任务进度 */}
            <div className="mb-4">
              <ProgressBar progress={expedition.progress} rarity={expedition.rarity} />
            </div>

            {/* 子任务计数 */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {expedition.completedSubtasks > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">{expedition.completedSubtasks} 完成</span>
                </div>
              )}
              {expedition.inProgressSubtasks > 0 && (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />
                  <span className="text-[11px] text-sky-400">{expedition.inProgressSubtasks} 进行中</span>
                </div>
              )}
              {expedition.availableSubtasks > 0 && (
                <div className="flex items-center gap-1">
                  <Circle className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] text-slate-400">{expedition.availableSubtasks} 待认领</span>
                </div>
              )}
              <span className="text-[11px] text-slate-500 ml-auto">
                共 {expedition.subtasks.length} 个子任务
              </span>
            </div>

            {/* 底部：参与者 + 截止 + 奖励 */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-3 min-w-0">
                {expedition.participants.length > 0 ? (
                  <ParticipantAvatars participants={expedition.participants} maxParticipants={expedition.maxParticipants} />
                ) : (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3" />
                    <span className="text-[11px]">尚无参与者</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="text-[11px] truncate">{daysLeft}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" style={{ color: cfg.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>
                    {expedition.pointsMin === expedition.pointsMax
                      ? `${expedition.pointsMin}`
                      : `${expedition.pointsMin}–${expedition.pointsMax}`} 积分
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* 悬停发光叠层 */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${cfg.color}08 0%, transparent 70%)` }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
