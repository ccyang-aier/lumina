"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, Flame, Star, Plus, Compass,
  CheckCircle2, ChevronRight, Loader2, Sparkles,
} from 'lucide-react'
import { MY_GUILDS, RECOMMENDED_GUILDS, type Guild, type ActivityLevel } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

// ─── Activity Stars ──────────────────────────────────────────────────────────

function ActivityStars({ level }: { level: ActivityLevel }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('w-3 h-3', i < level ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')}
        />
      ))}
    </div>
  )
}

// ─── My Guild Card ───────────────────────────────────────────────────────────

function MyGuildCard({ guild, index }: { guild: Guild; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={`/guilds/${guild.id}`} className="block group">
        <div className="relative flex items-stretch rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-border/80">
          
          {/* Left color bar – appears on hover */}
          <div
            className="w-1 shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: guild.primaryColor }}
          />

          {/* Icon block */}
          <div
            className="w-16 shrink-0 flex items-center justify-center text-2xl"
            style={{ background: `${guild.primaryColor}14` }}
          >
            {guild.icon}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{guild.name}</h3>
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 已加入
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5" />
            </div>

            <p className="text-xs text-muted-foreground italic mb-3 line-clamp-1">
              「{guild.slogan}」
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {guild.stats.members} 成员
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {guild.stats.knowledgeCards} 知识卡
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <ActivityStars level={guild.stats.activityLevel} />
              </span>
              {guild.honorTags.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{
                    background: `${guild.primaryColor}10`,
                    borderColor: `${guild.primaryColor}30`,
                    color: guild.primaryColor,
                  }}>
                  ⭐ {guild.honorTags[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Recommended Guild Card ──────────────────────────────────────────────────

function RecommendCard({ guild, index }: { guild: Guild; index: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'applied'>('idle')

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('loading')
    setTimeout(() => setStatus('applied'), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="group"
    >
      <div className="relative flex flex-col rounded-xl border border-border bg-card p-5 h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${guild.primaryColor}, transparent)` }} />

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ background: `${guild.primaryColor}18` }}
          >
            {guild.icon}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-foreground truncate">{guild.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <ActivityStars level={guild.stats.activityLevel} />
              <span className="text-[10px] text-muted-foreground">{guild.stats.members}人</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2 flex-1">
          「{guild.slogan}」
        </p>

        {/* Recommend reason */}
        {guild.recommendReason && (
          <div className="flex items-start gap-1.5 mb-3 px-2.5 py-1.5 rounded-md text-[11px]"
            style={{ background: `${guild.primaryColor}0c`, color: guild.primaryColor }}>
            <Sparkles className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{guild.recommendReason}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {guild.stats.knowledgeCards} 知识卡
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            周新增 {guild.stats.weeklyNew}
          </span>
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={status !== 'idle'}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all duration-300',
            status === 'idle' && 'border border-border hover:border-foreground/20 hover:bg-accent text-foreground',
            status === 'loading' && 'border border-border text-muted-foreground cursor-not-allowed',
            status === 'applied' && 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default',
          )}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> 申请加入
              </motion.span>
            )}
            {status === 'loading' && (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> 申请中…
              </motion.span>
            )}
            {status === 'applied' && (
              <motion.span key="applied" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 已申请 ✓
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GuildsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              我的公会
              <span className="ml-2 text-base font-normal text-muted-foreground">({MY_GUILDS.length})</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">你归属的知识社区，你们共同书写的集体记忆</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent transition-all duration-200">
              <Compass className="w-4 h-4" /> 探索更多
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all duration-200">
              <Plus className="w-4 h-4" /> 创建公会
            </button>
          </div>
        </motion.div>

        {/* My Guilds */}
        <section className="mb-12">
          <div className="flex flex-col gap-3">
            {MY_GUILDS.map((guild, i) => (
              <MyGuildCard key={guild.id} guild={guild} index={i} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            为你推荐的公会
          </div>
          <div className="h-px flex-1 bg-border" />
        </motion.div>

        {/* Recommended Guilds */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECOMMENDED_GUILDS.map((guild, i) => (
              <RecommendCard key={guild.id} guild={guild} index={i} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
