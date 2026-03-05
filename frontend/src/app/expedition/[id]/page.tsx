"use client"

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Skull, Trophy, Clock, Users, CheckCircle2,
  Loader2, Circle, Swords, Zap, Star, AlertCircle, Shield,
  ChevronRight, Sparkles, Target, Activity, BookOpen,
  TrendingUp, Hash, Award,
} from 'lucide-react'
import {
  getExpeditionById,
  RARITY_CONFIG, TYPE_CONFIG,
  type Subtask, type Participant,
} from '@/lib/expedition-data'
import { RarityBadge } from '@/components/expedition/RarityBadge'
import { BossHealthBar } from '@/components/expedition/BossHealthBar'
import { ProgressBar } from '@/components/expedition/ProgressBar'
import styles from '@/components/expedition/expedition.module.css'
import { cn } from '@/lib/utils'

// ── Mock 活动动态 ──
const MOCK_ACTIVITY = [
  { id: 1, user: '李四', action: '完成了子任务', target: 'CI/CD 流程总览图', time: '2小时前', color: '#c084fc', type: 'complete' },
  { id: 2, user: '王五', action: '认领了子任务', target: 'GitHub Actions 实战指南', time: '5小时前', color: '#38bdf8', type: 'claim' },
  { id: 3, user: '赵六', action: '认领了子任务', target: 'Docker 容器化部署规范', time: '1天前', color: '#34d399', type: 'claim' },
  { id: 4, user: '孙七', action: '认领了子任务', target: '流水线安全扫描配置', time: '1天前', color: '#f87171', type: 'claim' },
  { id: 5, user: '系统 AI', action: '自动发起了本次远征', target: '', time: '3天前', color: '#94a3b8', type: 'system' },
]

// ── 胜利粒子 ──
function VictoryParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 50 + Math.random() * 70,
    color: ['#fbbf24', '#f87171', '#34d399', '#38bdf8', '#e2e8f0'][i % 5],
    delay: Math.random() * 0.3,
  }))
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ background: p.color }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: 0, opacity: 0,
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ── 子任务状态图标 ──
function SubtaskStatusIcon({ status }: { status: Subtask['status'] }) {
  if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(52,211,153,0.5))' }} />
  if (status === 'in_progress') return <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
  return <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
}

// ── 分区标题 ──
function SectionHeading({ icon, title, extra }: { icon: React.ReactNode; title: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-slate-500 dark:text-slate-400">{icon}</div>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">{title}</h3>
      </div>
      {extra}
    </div>
  )
}

// ── 信息行 ──
function InfoRow({ icon: Icon, label, value, valueColor }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string, valueColor?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[12px]">{label}</span>
      </div>
      <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </span>
    </div>
  )
}

// ── 子任务列表项 ──
function SubtaskItem({ subtask, index, rarityColor }: { subtask: Subtask; index: number; rarityColor: string }) {
  const borderColor = subtask.status === 'completed' ? 'rgba(52,211,153,0.25)' :
                      subtask.status === 'in_progress' ? 'rgba(56,189,248,0.25)' :
                      'rgba(148,163,184,0.12)'
  const bgColor = subtask.status === 'completed' ? 'rgba(52,211,153,0.03)' :
                  subtask.status === 'in_progress' ? 'rgba(56,189,248,0.03)' :
                  'transparent'

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(styles.glassPanel, 'rounded-xl border p-3.5 relative overflow-hidden group')}
      style={{ borderColor, background: bgColor }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <SubtaskStatusIcon status={subtask.status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className={cn('text-[13px] font-medium leading-snug',
              subtask.status === 'completed'
                ? 'text-slate-400 dark:text-slate-500 line-through'
                : 'text-slate-800 dark:text-slate-200'
            )}>
              {subtask.title}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {subtask.assignee && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                  style={{ background: `${subtask.assigneeColor}cc`, boxShadow: `0 0 5px ${subtask.assigneeColor}50` }}
                  title={subtask.assignee}
                >
                  {subtask.assigneeInitials}
                </div>
              )}
              <span className="text-[11px] font-bold" style={{ color: rarityColor }}>+{subtask.points}pt</span>
            </div>
          </div>

          {subtask.status === 'in_progress' && subtask.progress !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-slate-400">{subtask.assignee} 进行中</span>
                <span className="text-[10px] text-sky-400 font-mono">{subtask.progress}%</span>
              </div>
              <div className={styles.progressBar} style={{ height: '4px' }}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${subtask.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                  style={{ background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', height: '4px' }}
                />
              </div>
            </div>
          )}

          {subtask.status === 'available' && (
            <button className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Target className="w-3 h-3" />
              <span>认领此任务</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── 贡献者卡片 ──
function ContributorCard({ participant, index, rarityColor }: { participant: Participant; index: number; rarityColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20"
    >
      <div className="relative shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs"
          style={{ background: `${participant.color}cc`, boxShadow: `0 0 8px ${participant.color}40` }}
        >
          {participant.initials}
        </div>
        {index === 0 && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[7px]">👑</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">{participant.name}</span>
          <span className={cn(styles.statNumber, 'text-[11px] font-bold shrink-0 ml-2')}
            style={{ color: participant.points > 0 ? rarityColor : 'rgb(100 116 139)' }}>
            {participant.points > 0 ? `+${participant.points}pt` : '进行中'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={styles.contributorBar}>
            <motion.div
              className={styles.contributorBarFill}
              initial={{ width: 0 }}
              animate={{ width: `${participant.contribution}%` }}
              transition={{ duration: 0.9, delay: 0.4 + index * 0.08 }}
              style={{ background: `linear-gradient(90deg, ${participant.color}60, ${participant.color})` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono w-8 text-right">{participant.contribution}%</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">{participant.completedTasks}/{participant.totalTasks} 任务完成</span>
      </div>
    </motion.div>
  )
}

// ── 活动时间轴条目 ──
function ActivityItem({ item, index, isLast }: { item: typeof MOCK_ACTIVITY[0]; index: number; isLast: boolean }) {
  const iconMap = {
    complete: <CheckCircle2 className="w-3 h-3" />,
    claim: <Target className="w-3 h-3" />,
    system: <Activity className="w-3 h-3" />,
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex gap-3 relative"
    >
      {!isLast && <div className={styles.timelineLine} />}
      <div
        className={cn(styles.timelineDot, 'shrink-0 mt-0.5 flex items-center justify-center')}
        style={{ borderColor: item.color, color: item.color, width: '22px', height: '22px' }}
      >
        {iconMap[item.type as keyof typeof iconMap]}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold" style={{ color: item.color }}>{item.user}</span>
          {' '}{item.action}
          {item.target && <span className="text-slate-500 dark:text-slate-400">「{item.target}」</span>}
        </p>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
      </div>
    </motion.div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ExpeditionDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const expedition = getExpeditionById(id)
  const [showVictory, setShowVictory] = useState(false)

  useEffect(() => {
    if (expedition?.status === 'completed') {
      const t = setTimeout(() => setShowVictory(true), 500)
      return () => clearTimeout(t)
    }
  }, [expedition?.status])

  if (!expedition) {
    return (
      <div className={cn(styles.battlefieldBg, 'min-h-screen flex items-center justify-center')}>
        <div className="text-center">
          <Skull className="w-14 h-14 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">远征不存在</h2>
          <p className="text-slate-400 mb-6">该远征已消失在历史长河中</p>
          <Link href="/expedition" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 justify-center text-sm">
            <ArrowLeft className="w-4 h-4" /> 返回战场
          </Link>
        </div>
      </div>
    )
  }

  const cfg = RARITY_CONFIG[expedition.rarity]
  const typeCfg = TYPE_CONFIG[expedition.type]
  const isCompleted = expedition.status === 'completed'
  const isActive = expedition.status === 'active'

  const daysLeft = (() => {
    const diff = new Date(expedition.deadline).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return '已截止'
    if (days === 0) return '今日截止'
    return `${days} 天后截止`
  })()

  // 统一卡片样式
  const cardClass = cn(
    styles.glassPanel,
    'rounded-2xl border border-slate-200/70 dark:border-slate-700/40',
    'bg-white/80 dark:bg-slate-900/70 overflow-hidden'
  )

  return (
    <div className={cn(styles.battlefieldBg, 'min-h-screen')}>
      <div className={styles.scanlines} />

      {/* 胜利粒子 */}
      <AnimatePresence>
        {showVictory && isCompleted && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VictoryParticles />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 稀有度顶部渐变光晕 */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-30 pointer-events-none"
        style={{ background: cfg.gradient, boxShadow: `0 0 20px ${cfg.color}60` }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 返回按钮 */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/expedition"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            返回战场
          </Link>
        </motion.div>

        <div className="space-y-4">

          {/* ══ 1. 远征标头 ══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(cardClass, 'relative')}
          >
            {/* 稀有度顶条 */}
            <div className="h-1" style={{ background: cfg.gradient, boxShadow: `0 0 10px ${cfg.color}50` }} />

            {/* 角落装饰 */}
            {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(pos => (
              <div key={pos} className={cn(styles.cornerAccent, styles[pos])} style={{ borderColor: `${cfg.color}35` }} />
            ))}
            <div className={styles.dataLine} style={{ top: '45%', width: '35%' }} />

            <div className="p-6">
              {/* 徽章行 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <RarityBadge rarity={expedition.rarity} />
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ color: typeCfg.color, background: typeCfg.bg }}>
                  {typeCfg.label}
                </span>
                {expedition.medal && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    🏅 含专属勋章
                  </span>
                )}
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 ml-auto">
                    <CheckCircle2 className="w-3 h-3" /> Boss 已击败
                  </span>
                )}
                {isActive && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ml-auto"
                    style={{ color: cfg.color, borderColor: `${cfg.color}30`, background: `${cfg.color}08` }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: cfg.color }} />
                    </span>
                    战斗进行中
                  </span>
                )}
              </div>

              {/* 标题 */}
              <h1 className={cn(styles.heroTitle, 'text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2')}>
                {expedition.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                {expedition.description}
              </p>

              {/* 情报分析 */}
              <div className="rounded-xl border border-amber-200/50 dark:border-amber-500/15 bg-amber-50/50 dark:bg-amber-500/5 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">情报分析</span>
                  </div>
                  <span className="text-[10px] text-slate-400">由 {expedition.initiator}</span>
                </div>
                <ul className="space-y-1.5">
                  {expedition.reason.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600 dark:text-slate-400">
                      <span className="text-amber-500 mt-0.5 shrink-0">·</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* ══ 2. Boss 战区 ══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className={cn(cardClass)}
          >
            <div className="p-6">
              <SectionHeading
                icon={<Skull className="w-4 h-4 text-red-400" />}
                title="Boss 战区"
                extra={
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    每完成一个子任务削减血量
                  </span>
                }
              />
              <div className={cn(styles.bossArena, 'border border-red-200/40 dark:border-red-500/10 bg-red-50/30 dark:bg-red-500/3 p-4 rounded-xl')}>
                <BossHealthBar bossName={expedition.bossName} hp={expedition.bossHp} isCompleted={isCompleted} size="lg" />
              </div>
              <div className="mt-4">
                <ProgressBar progress={expedition.progress} rarity={expedition.rarity} height={10} />
              </div>
              {/* 子任务进度摘要 */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">{expedition.completedSubtasks} 已完成</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  <span className="text-[12px] text-sky-600 dark:text-sky-400 font-medium">{expedition.inProgressSubtasks} 进行中</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                  <span className="text-[12px] text-slate-500 font-medium">{expedition.availableSubtasks} 待认领</span>
                </div>
                <span className="ml-auto text-[11px] text-slate-400 font-mono">共 {expedition.subtasks.length} 个子任务</span>
              </div>
            </div>
          </motion.div>

          {/* ══ 3. 奖励 + 战役信息 (两等列) ══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* 奖励面板 */}
            <div className={cn(cardClass)}>
              <div className="h-0.5" style={{ background: cfg.gradient }} />
              <div className="p-5">
                <SectionHeading
                  icon={<Trophy className="w-4 h-4" style={{ color: cfg.color }} />}
                  title="战役奖励"
                />
                <div className="space-y-3">
                  {/* 积分奖励 */}
                  <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-800/30" style={{ borderColor: `${cfg.color}20` }}>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">积分奖励池</div>
                    <div className={cn(styles.statNumber, 'text-3xl font-black leading-none')} style={{ color: cfg.color }}>
                      {expedition.pointsMin === expedition.pointsMax ? expedition.pointsMin : `${expedition.pointsMin}–${expedition.pointsMax}`}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">积分 · 按贡献比例分配</div>
                  </div>
                  {/* 勋章 */}
                  {expedition.medal && (
                    <div className="rounded-xl border border-amber-300/30 dark:border-amber-500/20 p-3.5 bg-amber-50/50 dark:bg-amber-500/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-base">🏅</div>
                      <div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">专属勋章</div>
                        <div className="text-[12px] font-bold text-amber-700 dark:text-amber-300">{expedition.medal}</div>
                      </div>
                    </div>
                  )}
                  {/* 排行榜加权说明 */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 px-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    史诗及以上远征额外获得排行榜加权分数
                  </div>
                </div>
              </div>
            </div>

            {/* 战役信息 */}
            <div className={cn(cardClass)}>
              <div className="p-5">
                <SectionHeading icon={<BookOpen className="w-4 h-4" />} title="战役信息" />
                <div className="space-y-0.5">
                  <InfoRow icon={Clock} label="截止时间" value={`${expedition.deadline}`} />
                  <InfoRow icon={Activity} label="剩余时间" value={daysLeft} />
                  <InfoRow icon={Users} label="参与人数" value={`${expedition.participants.length} / ${expedition.maxParticipants}`} valueColor="#38bdf8" />
                  <InfoRow icon={Hash} label="子任务数" value={`${expedition.subtasks.length} 个`} />
                  <InfoRow icon={Award} label="难度" value={RARITY_CONFIG[expedition.rarity].label} valueColor={cfg.color} />
                </div>

                {/* 行动按钮 */}
                {!isCompleted && (
                  <div className="mt-5 relative">
                    <button className={styles.btnAction}>
                      {isActive ? '⚡ 参与贡献' : '⚔ 加入远征'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ══ 4. 子任务清单 ══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className={cardClass}
          >
            <div className="p-6">
              <SectionHeading
                icon={<Swords className="w-4 h-4" style={{ color: cfg.color }} />}
                title="子任务清单"
                extra={
                  <div className="flex gap-3 text-[11px]">
                    <span className="text-emerald-500">{expedition.completedSubtasks} 完成</span>
                    <span className="text-sky-400">{expedition.inProgressSubtasks} 进行中</span>
                    <span className="text-slate-400">{expedition.availableSubtasks} 待认领</span>
                  </div>
                }
              />
              <div className="space-y-2.5">
                {expedition.subtasks.map((st, i) => (
                  <SubtaskItem key={st.id} subtask={st} index={i} rarityColor={cfg.color} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ══ 5. 贡献者看板 + 活动动态 (两等列) ══ */}
          {(expedition.participants.length > 0 || true) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* 贡献者看板 */}
              <div className={cardClass}>
                <div className="p-5">
                  <SectionHeading icon={<Star className="w-4 h-4 text-amber-400" />} title="贡献者看板" />
                  {expedition.participants.length > 0 ? (
                    <div className="space-y-2.5">
                      {expedition.participants.map((p, i) => (
                        <ContributorCard key={p.id} participant={p} index={i} rarityColor={cfg.color} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-[12px]">尚无勇士加入</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 活动动态 */}
              <div className={cardClass}>
                <div className="p-5">
                  <SectionHeading icon={<Activity className="w-4 h-4 text-sky-400" />} title="活动动态" />
                  <div className="relative pl-1">
                    {MOCK_ACTIVITY.map((item, i) => (
                      <ActivityItem key={item.id} item={item} index={i} isLast={i === MOCK_ACTIVITY.length - 1} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ 6. 已完成庆典 ══ */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className={cn(cardClass, 'border-emerald-200/50 dark:border-emerald-500/20 text-center relative overflow-hidden')}
            >
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <div className="p-8 relative">
                <VictoryParticles />
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-400" style={{ filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' }} />
                <div className="text-xl font-black text-emerald-500 dark:text-emerald-400 mb-1">远征胜利！</div>
                <div className="text-[13px] text-slate-400">Boss 已击败 · 所有参与者已获得奖励积分</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
