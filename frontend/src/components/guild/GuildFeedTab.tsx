"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, RefreshCw, AlertTriangle, Trophy,
  Heart, MessageCircle, ThumbsUp, Lock,
} from 'lucide-react'
import { FEED_ITEMS, type FeedItem, type FeedType } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

// ─── Type config ─────────────────────────────────────────────────────────────

const FEED_TYPE_CONFIG: Record<FeedType, {
  dotColor: string
  icon: React.ElementType
  iconBg: string
  label: string
}> = {
  publish:     { dotColor: '#22c55e', icon: FileText,     iconBg: '#22c55e1a', label: '新发布' },
  update:      { dotColor: '#3b82f6', icon: RefreshCw,    iconBg: '#3b82f61a', label: '版本更新' },
  gap:         { dotColor: '#f59e0b', icon: AlertTriangle, iconBg: '#f59e0b1a', label: 'AI 预警' },
  achievement: { dotColor: '#a855f7', icon: Trophy,       iconBg: '#a855f71a', label: '成就解锁' },
}

// ─── Floating score animation ────────────────────────────────────────────────

function FloatingScore({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -40, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-sm pointer-events-none z-50 select-none"
        >
          +50 ✨
        </motion.span>
      )}
    </AnimatePresence>
  )
}

// ─── Avatar dot ──────────────────────────────────────────────────────────────

function AvatarDot({ name, color, size = 'md' }: { name: string; color: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs'
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold text-white shrink-0', s)}
      style={{ background: color }}>
      {name[0]}
    </div>
  )
}

// ─── Feed Item ───────────────────────────────────────────────────────────────

function FeedCard({ item, index }: { item: FeedItem; index: number }) {
  const [liked, setLiked] = useState(false)
  const [gapStatus, setGapStatus] = useState<'idle' | 'confirming' | 'claimed' | 'locked'>('idle')
  const [showScore, setShowScore] = useState(false)
  const cfg = FEED_TYPE_CONFIG[item.type]
  const Icon = cfg.icon

  const handleGapClaim = () => {
    if (gapStatus !== 'idle') return
    setGapStatus('confirming')
  }

  const handleConfirm = () => {
    setGapStatus('claimed')
    setShowScore(true)
    setTimeout(() => setShowScore(false), 1200)
    setTimeout(() => setGapStatus('locked'), 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      className="relative flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-background shadow-sm"
          style={{ background: cfg.iconBg, borderColor: cfg.dotColor + '40' }}>
          <Icon className="w-3.5 h-3.5" style={{ color: cfg.dotColor }} />
          {/* Pulse for achievement */}
          {item.type === 'achievement' && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: cfg.dotColor }} />
          )}
        </div>
        {/* Spine line */}
        <div className="w-px flex-1 min-h-[24px] mt-1" style={{ background: `${cfg.dotColor}20` }} />
      </div>

      {/* Card body */}
      <div className="flex-1 pb-6 min-w-0">
        <div className={cn(
          'rounded-xl border border-border bg-card p-4',
          item.type === 'achievement' && 'border-purple-500/30 bg-purple-500/5',
          item.type === 'gap' && 'border-amber-500/20 bg-amber-500/5',
        )}>
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <AvatarDot name={item.actor.name} color={item.actor.avatarColor} size="sm" />
              <span className="text-sm font-medium text-foreground">{item.actor.name}</span>
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: cfg.iconBg, color: cfg.dotColor }}>
              {cfg.label}
            </span>
          </div>

          {/* Content by type */}
          {item.type === 'publish' && (
            <div>
              <p className="text-sm text-foreground mb-2">
                发布了《<span className="font-semibold">{item.cardTitle}</span>》
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.cardTags?.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                    style={{
                      background: tag === 'HOW-TO' ? '#3b82f610' : tag.includes('⭐') ? '#f59e0b10' : '#64748b10',
                      color: tag === 'HOW-TO' ? '#3b82f6' : tag.includes('⭐') ? '#f59e0b' : '#64748b',
                      borderColor: tag === 'HOW-TO' ? '#3b82f620' : tag.includes('⭐') ? '#f59e0b20' : '#64748b20',
                    }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.type === 'update' && (
            <div>
              <p className="text-sm text-foreground mb-2">
                将《<span className="font-semibold">{item.cardTitle}</span>》更新至新版本
              </p>
              {item.updateNote && (
                <blockquote className="text-xs text-muted-foreground leading-relaxed border-l-2 border-blue-400/50 pl-3 italic">
                  {item.updateNote}
                </blockquote>
              )}
            </div>
          )}

          {item.type === 'gap' && (
            <div>
              <p className="text-sm text-foreground mb-2">
                AI 发现知识缺口：
                <span className="font-semibold text-amber-600 dark:text-amber-400">「{item.gapKeyword}」</span>
                <span className="text-muted-foreground"> · 过去7天被搜索 </span>
                <span className="font-medium">{item.gapSearchCount} 次</span>
                <span className="text-muted-foreground">，尚无权威内容</span>
              </p>
              <div className="relative inline-block mt-1">
                <FloatingScore show={showScore} />
                <AnimatePresence mode="wait">
                  {gapStatus === 'idle' && (
                    <motion.button
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={handleGapClaim}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                    >
                      接取缺口 +50积分
                    </motion.button>
                  )}
                  {gapStatus === 'confirming' && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300/50 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <span className="text-amber-700 dark:text-amber-300">确认接取？将消耗专注时间</span>
                      <button onClick={handleConfirm}
                        className="px-2 py-0.5 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors">
                        确认
                      </button>
                      <button onClick={() => setGapStatus('idle')}
                        className="px-2 py-0.5 border border-amber-300/50 rounded text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                        取消
                      </button>
                    </motion.div>
                  )}
                  {(gapStatus === 'claimed' || gapStatus === 'locked') && (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border cursor-default"
                    >
                      <Lock className="w-3 h-3" /> 任务进行中 🔒
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {item.type === 'achievement' && (
            <div>
              <p className="text-sm text-foreground mb-2">
                <span className="font-semibold text-purple-600 dark:text-purple-400">《{item.cardTitle}》</span>
                {' '}被复用 100 次！🎉 恭喜
                <span className="font-semibold"> {item.actor.name} </span>
                获得「{item.achievementName}」成就
              </p>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border"
                style={{
                  background: 'linear-gradient(135deg, #a855f710, #c084fc10)',
                  borderColor: '#a855f730',
                  color: '#a855f7',
                  boxShadow: '0 0 12px #a855f720',
                }}
              >
                {item.achievementIcon} {item.achievementName} 成就
              </motion.div>
            </div>
          )}

          {/* Footer interactions */}
          {item.type !== 'gap' && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
              <button
                onClick={() => setLiked(v => !v)}
                className={cn('flex items-center gap-1 text-xs transition-colors',
                  liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500')}
              >
                <Heart className={cn('w-3.5 h-3.5', liked && 'fill-rose-500')} />
                {item.likes + (liked ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                {item.comments}
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <ThumbsUp className="w-3.5 h-3.5" /> 有用
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Tab Component ────────────────────────────────────────────────────────────

export function GuildFeedTab() {
  return (
    <div className="pt-4">
      <div className="max-w-[1440px] mx-auto">
        {FEED_ITEMS.map((item, i) => (
          <FeedCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
