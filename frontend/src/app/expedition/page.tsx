"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Flame, BookOpen, CheckSquare, Star, Filter, Zap, Shield, Crown, Users } from 'lucide-react'
import { MOCK_EXPEDITIONS, type ExpeditionStatus, type ExpeditionType, RARITY_CONFIG } from '@/lib/expedition-data'
import { ExpeditionCard } from '@/components/expedition/ExpeditionCard'
import styles from '@/components/expedition/expedition.module.css'
import { cn } from '@/lib/utils'

const STATUS_TABS: { key: ExpeditionStatus | 'all'; label: string; icon: React.ReactNode; count?: boolean }[] = [
  { key: 'active',    label: '进行中', icon: <Flame className="w-3.5 h-3.5" />, count: true },
  { key: 'available', label: '可接取', icon: <BookOpen className="w-3.5 h-3.5" />, count: true },
  { key: 'completed', label: '已完成', icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { key: 'all',       label: '全部',   icon: <Star className="w-3.5 h-3.5" /> },
]

const TYPE_FILTERS: { key: ExpeditionType | 'all'; label: string }[] = [
  { key: 'all',        label: '全部' },
  { key: 'gap',        label: '缺口' },
  { key: 'governance', label: '治理' },
  { key: 'epic',       label: '史诗' },
  { key: 'guild',      label: '公会' },
]

const BATTLE_STATS = [
  { label: '活跃远征', value: 2,      icon: Flame,  color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  { label: '战士人数', value: 8,      icon: Users,  color: '#38bdf8', border: 'rgba(56,189,248,0.2)' },
  { label: '积分池',   value: '5000+',icon: Crown,  color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  { label: '已完成',   value: 1,      icon: Shield, color: '#34d399', border: 'rgba(52,211,153,0.2)' },
]

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 7.5) % 84}%`,
  delay: `${(i * 0.8) % 5}s`,
  duration: `${5 + (i * 0.6) % 4}s`,
  color: ['#94a3b8', '#64748b', '#fbbf24', '#34d399', '#38bdf8'][i % 5],
}))

export default function ExpeditionPage() {
  const [activeStatus, setActiveStatus] = useState<ExpeditionStatus | 'all'>('active')
  const [activeType, setActiveType] = useState<ExpeditionType | 'all'>('all')

  const filtered = useMemo(() => {
    return MOCK_EXPEDITIONS.filter(e => {
      const matchStatus = activeStatus === 'all' || e.status === activeStatus
      const matchType = activeType === 'all' || e.type === activeType
      return matchStatus && matchType
    })
  }, [activeStatus, activeType])

  const counts = useMemo(() => ({
    active:    MOCK_EXPEDITIONS.filter(e => e.status === 'active').length,
    available: MOCK_EXPEDITIONS.filter(e => e.status === 'available').length,
  }), [])

  return (
    <div className={cn(styles.battlefieldBg, 'min-h-screen')}>
      <div className={styles.scanlines} />

      {/* 浮动粒子 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className={styles.floatingDot}
            style={{ left: p.left, bottom: '-10px', background: p.color, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero 标题区 ── */}
        <div className="pt-10 pb-8 text-center relative">
          {/* 装饰性六边形 */}
          <div className={styles.hexDecor} style={{ top: '-20px', left: '4%', transform: 'rotate(-15deg)' }}>⬡</div>
          <div className={styles.hexDecor} style={{ top: '-10px', right: '7%', transform: 'rotate(20deg)', fontSize: '80px' }}>⬡</div>

          {/* Badge */}
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-400/40 dark:to-slate-500/40" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-300/40 dark:border-slate-600/40 bg-slate-100/60 dark:bg-slate-800/60">
              <Swords className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.25em] uppercase font-mono">Battle Arena</span>
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-400/40 dark:to-slate-500/40" />
          </div>

          {/* 主标题 */}
          <div className="relative inline-block mb-3">
            <h1
              className={cn(styles.heroTitle, styles.glitchText, 'text-4xl sm:text-5xl lg:text-6xl font-black')}
              data-text="⚔️ 远征战场"
            >
              ⚔️{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #94a3b8, #e2e8f0, #f1f5f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                className="dark:[background:linear-gradient(135deg,#64748b,#94a3b8,#e2e8f0)] dark:[-webkit-text-fill-color:transparent] dark:[-webkit-background-clip:text]"
              >
                远征战场
              </span>
            </h1>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            将知识缺口化为可战之役 · 集结战士，共同消灭「知识荒原 Boss」 · 赢取传说级奖励与专属荣耀
          </p>

          {/* 战场数据面板 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {BATTLE_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={cn(styles.glassPanel, 'relative rounded-xl border p-3 text-center overflow-hidden bg-white/60 dark:bg-slate-900/60')}
                style={{ borderColor: stat.border }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
                />
                <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                <div className={cn(styles.statNumber, 'text-xl font-black')} style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 筛选控制栏 ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className={cn(
            styles.glassPanel,
            'sticky top-[65px] z-20 rounded-2xl border border-slate-200/70 dark:border-slate-700/50',
            'bg-white/85 dark:bg-slate-900/85 px-4 py-3 mb-6'
          )}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* 状态 Tab */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {STATUS_TABS.map(tab => {
                const isActive = activeStatus === tab.key
                const count = tab.key === 'active' ? counts.active : tab.key === 'available' ? counts.available : undefined
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveStatus(tab.key as ExpeditionStatus | 'all')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200',
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                    {count !== undefined && (
                      <span className={cn(
                        'inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold',
                        isActive
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 类型筛选 */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <Filter className="w-3 h-3 text-slate-400 shrink-0" />
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveType(f.key as ExpeditionType | 'all')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all duration-200 border',
                    activeType === f.key
                      ? 'bg-slate-800/90 text-white border-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-300'
                      : 'text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 卡片列表 ── */}
        <div className="pb-16">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <Swords className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-400 dark:text-slate-500">当前筛选条件下暂无远征</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeStatus}-${activeType}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeStatus === 'all' ? (
                  <>
                    {filtered.filter(e => e.status === 'active').length > 0 && (
                      <div className="mb-8">
                        <SectionDivider icon={<Flame className="w-3.5 h-3.5 text-orange-400" />} label="战火燃烧中" color="orange" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {filtered.filter(e => e.status === 'active').map((exp, i) => (
                            <ExpeditionCard key={exp.id} expedition={exp} index={i} />
                          ))}
                        </div>
                      </div>
                    )}
                    {filtered.filter(e => e.status === 'available').length > 0 && (
                      <div className="mb-8">
                        <SectionDivider icon={<Zap className="w-3.5 h-3.5 text-sky-400" />} label="召集远征者" color="sky" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {filtered.filter(e => e.status === 'available').map((exp, i) => (
                            <ExpeditionCard key={exp.id} expedition={exp} index={i} />
                          ))}
                        </div>
                      </div>
                    )}
                    {filtered.filter(e => e.status === 'completed').length > 0 && (
                      <div>
                        <SectionDivider icon={<Shield className="w-3.5 h-3.5 text-emerald-400" />} label="战役纪念碑" color="emerald" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {filtered.filter(e => e.status === 'completed').map((exp, i) => (
                            <ExpeditionCard key={exp.id} expedition={exp} index={i} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map((exp, i) => (
                      <ExpeditionCard key={exp.id} expedition={exp} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function SectionDivider({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const lineColor = `${color === 'orange' ? 'from-orange-500/30' : color === 'sky' ? 'from-sky-500/30' : 'from-emerald-500/30'}`
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {icon}
        {label}
      </div>
      <div className={cn('h-px flex-1 bg-gradient-to-r to-transparent', lineColor)} />
    </div>
  )
}
