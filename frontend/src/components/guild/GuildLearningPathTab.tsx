"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import { LEARNING_PATH, CARD_TYPE_MAP, type LearningPathNode } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle2, color: '#22c55e', label: '已完成', lineStyle: 'solid' as const },
  in_progress: { icon: Circle,       color: '#3b82f6', label: '进行中', lineStyle: 'solid' as const },
  pending:     { icon: Circle,       color: '#94a3b8', label: '未开始', lineStyle: 'dashed' as const },
}

// ─── Path Node ────────────────────────────────────────────────────────────────

function PathNode({ node, index, isLast }: { node: LearningPathNode; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(node.status === 'in_progress')
  const cfg = STATUS_CONFIG[node.status]
  const Icon = cfg.icon

  const completedCount = node.status === 'completed' ? node.cards.length : node.status === 'in_progress' ? Math.floor(node.cards.length * 0.4) : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: 'easeOut' }}
      className="relative flex gap-5"
    >
      {/* Spine */}
      <div className="flex flex-col items-center">
        {/* Node circle */}
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.12 + 0.1, type: 'spring', stiffness: 300 }}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background z-10 shrink-0"
          style={{ borderColor: cfg.color, boxShadow: node.status !== 'pending' ? `0 0 12px ${cfg.color}30` : 'none' }}
        >
          <Icon className="w-5 h-5" style={{ color: cfg.color, fill: node.status === 'completed' ? cfg.color : 'transparent' }} />
          {node.status === 'in_progress' && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: cfg.color }} />
          )}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div
            className="w-0.5 flex-1 min-h-[40px] mt-1"
            style={{
              background: node.status === 'pending'
                ? 'repeating-linear-gradient(to bottom, #94a3b830 0, #94a3b830 6px, transparent 6px, transparent 12px)'
                : `${cfg.color}40`,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8 min-w-0">
        <div className={cn(
          'rounded-xl border overflow-hidden transition-all duration-300',
          node.status === 'completed' && 'border-emerald-500/25 bg-emerald-500/3',
          node.status === 'in_progress' && 'border-blue-500/30 bg-blue-500/3',
          node.status === 'pending' && 'border-border bg-card opacity-70',
        )}>
          {/* Stage header */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            {/* Stage number */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: cfg.color }}
            >
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-foreground">{node.stage}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${cfg.color}15`, color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{node.stageDesc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs font-medium text-foreground">
                  {completedCount}/{node.cards.length}
                </div>
                <div className="text-[10px] text-muted-foreground">已完成</div>
              </div>
              {expanded
                ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          </button>

          {/* Progress bar */}
          <div className="mx-5 mb-3 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / node.cards.length) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.12 + 0.2, ease: 'easeOut' }}
              style={{ background: cfg.color }}
            />
          </div>

          {/* Card list */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 flex flex-col gap-2">
                  {node.cards.map((card, ci) => {
                    const typeConf = CARD_TYPE_MAP[card.type as keyof typeof CARD_TYPE_MAP]
                    const isCardDone = node.status === 'completed' || (node.status === 'in_progress' && ci < completedCount)
                    return (
                      <motion.div
                        key={ci}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ci * 0.05 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/60 border border-border/50 hover:border-border hover:bg-accent/30 transition-all cursor-pointer"
                      >
                        {isCardDone
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-500" />
                          : <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                        }
                        <span className={cn('text-sm flex-1', isCardDone ? 'text-muted-foreground line-through' : 'text-foreground')}>
                          {card.title}
                        </span>
                        {typeConf && (
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', typeConf.color)}>
                            {typeConf.label}
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Tab ─────────────────────────────────────────────────────────────────────

export function GuildLearningPathTab() {
  return (
    <div className="pt-4 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-lg">🗺️</div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">新人成长地图</h3>
          <p className="text-xs text-muted-foreground">循序渐进，从筑基到引领，一起书写公会的知识传承</p>
        </div>
      </div>

      {LEARNING_PATH.map((node, i) => (
        <PathNode key={node.id} node={node} index={i} isLast={i === LEARNING_PATH.length - 1} />
      ))}
    </div>
  )
}
