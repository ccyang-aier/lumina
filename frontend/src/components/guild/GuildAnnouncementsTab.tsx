"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pin, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { ANNOUNCEMENTS, type Announcement } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

function AnnouncementCard({ item, index }: { item: Announcement; index: number }) {
  const [expanded, setExpanded] = useState(item.isPinned)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className={cn(
        'rounded-xl border overflow-hidden',
        item.isPinned
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      )}
    >
      {/* Pinned bar */}
      {item.isPinned && (
        <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      )}

      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Status icons */}
          <div className="flex flex-col gap-1.5 mt-0.5 shrink-0">
            {item.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <Pin className="w-2.5 h-2.5" /> 置顶
              </span>
            )}
            {item.isUnread && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Bell className="w-2.5 h-2.5" /> 未读
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-sm text-foreground leading-snug mb-1.5 flex-1">
                {item.title}
              </h3>
              <button
                onClick={() => setExpanded(v => !v)}
                className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{item.author}</span>
              <span>·</span>
              <span>{item.publishedAt}</span>
            </div>

            {!expanded && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {item.content.split('\n')[2] || item.content.slice(0, 80)}...
              </p>
            )}

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line"
              >
                {item.content}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function GuildAnnouncementsTab() {
  return (
    <div className="pt-4 max-w-2xl flex flex-col gap-3">
      {ANNOUNCEMENTS.map((ann, i) => (
        <AnnouncementCard key={ann.id} item={ann} index={i} />
      ))}
    </div>
  )
}
