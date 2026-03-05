"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Heart, Repeat2, Star, Filter, SortAsc, Sparkles } from 'lucide-react'
import { GUILD_KNOWLEDGE_CARDS, CARD_TYPE_MAP, type GuildKnowledgeCard } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

type SortKey = 'date' | 'views' | 'likes' | 'reuse'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date',  label: '最新发布' },
  { key: 'views', label: '浏览最多' },
  { key: 'likes', label: '点赞最多' },
  { key: 'reuse', label: '复用最多' },
]

const TYPE_FILTERS: { key: GuildKnowledgeCard['type'] | 'all'; label: string }[] = [
  { key: 'all',       label: '全部' },
  { key: 'howto',     label: 'HOW-TO' },
  { key: 'pitfall',   label: '踩坑记录' },
  { key: 'principle', label: '原理解析' },
  { key: 'evaluation',label: '工具评测' },
]

function AuthorityStars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('w-3 h-3', i < n ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')} />
      ))}
    </div>
  )
}

function KnowledgeCardItem({ card, index }: { card: GuildKnowledgeCard; index: number }) {
  const typeConf = CARD_TYPE_MAP[card.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative group flex gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Featured corner badge */}
      {card.isFeatured && (
        <div className="absolute top-0 right-0 w-0 h-0"
          style={{
            borderLeft: '40px solid transparent',
            borderTop: '40px solid #f59e0b',
          }}>
          <Star className="absolute -top-9 -left-5 w-3 h-3 text-white fill-white" />
        </div>
      )}

      {/* Author avatar */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ background: card.authorAvatarColor }}>
        {card.author[0]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {card.title}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {card.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', typeConf.color)}>
            {typeConf.label}
          </span>
          {card.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{card.author}</span>
            <span>·</span>
            <span>{card.publishedAt}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <AuthorityStars n={card.authority} />
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {card.views >= 1000 ? (card.views / 1000).toFixed(1) + 'k' : card.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {card.likes}
            </span>
            <span className="flex items-center gap-1">
              <Repeat2 className="w-3 h-3" />
              {card.reuseCount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function GuildLibraryTab() {
  const [typeFilter, setTypeFilter] = useState<GuildKnowledgeCard['type'] | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('date')
  const [showAiTip, setShowAiTip] = useState(true)

  const cards = useMemo(() => {
    let list = typeFilter === 'all' ? [...GUILD_KNOWLEDGE_CARDS] : GUILD_KNOWLEDGE_CARDS.filter(c => c.type === typeFilter)
    // Featured first always
    list.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      if (sort === 'views') return b.views - a.views
      if (sort === 'likes') return b.likes - a.likes
      if (sort === 'reuse') return b.reuseCount - a.reuseCount
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    return list
  }, [typeFilter, sort])

  return (
    <div className="pt-4">

      {/* AI tip for new members */}
      <AnimatePresence>
        {showAiTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 text-sm text-emerald-700 dark:text-emerald-400"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              AI 已为你生成专属入门路径，点击「学习路径」Tab 查看 →
            </div>
            <button onClick={() => setShowAiTip(false)}
              className="text-emerald-500/60 hover:text-emerald-500 transition-colors text-lg leading-none">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured section label */}
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="text-xs font-medium text-muted-foreground">管理员精选已置顶</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {TYPE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key as GuildKnowledgeCard['type'] | 'all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border',
                typeFilter === f.key
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 sm:ml-auto">
          <SortAsc className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {SORT_OPTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                'px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors',
                sort === s.key ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {cards.map((card, i) => (
            <KnowledgeCardItem key={card.id} card={card} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
