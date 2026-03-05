"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Crown, Shield, Star, Sprout, BookOpen, Repeat2 } from 'lucide-react'
import { MEMBERS, type GuildMember, type GuildRole } from '@/lib/guild-data'
import { cn } from '@/lib/utils'

// ─── Role config ─────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<GuildRole, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  president: { label: '会长',    icon: Crown,   color: '#f59e0b', bg: '#f59e0b10', border: '#f59e0b30' },
  admin:     { label: '管理员',  icon: Shield,  color: '#3b82f6', bg: '#3b82f610', border: '#3b82f630' },
  core:      { label: '核心贡献者', icon: Star, color: '#8b5cf6', bg: '#8b5cf610', border: '#8b5cf630' },
  newcomer:  { label: '新成员',  icon: Sprout,  color: '#22c55e', bg: '#22c55e10', border: '#22c55e30' },
}

const ROLE_TABS: { key: GuildRole | 'all'; label: string }[] = [
  { key: 'all',       label: '全部' },
  { key: 'president', label: '会长 👑' },
  { key: 'admin',     label: '管理员 🛡️' },
  { key: 'core',      label: '核心贡献者 ⭐' },
  { key: 'newcomer',  label: '新成员 🌱' },
]

// ─── Avatar ───────────────────────────────────────────────────────────────────

function MemberAvatar({ member, size = 'md' }: { member: GuildMember; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }[size]
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold text-white shrink-0', s)}
      style={{ background: member.avatarColor }}>
      {member.name[0]}
    </div>
  )
}

// ─── Level badge ─────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: number }) {
  const color = level >= 9 ? '#f59e0b' : level >= 7 ? '#8b5cf6' : level >= 5 ? '#3b82f6' : '#64748b'
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
      Lv.{level}
    </span>
  )
}

// ─── Podium Top 3 ─────────────────────────────────────────────────────────────

const PODIUM_BORDER: Record<number, string> = {
  0: '2px solid #f59e0b',
  1: '2px solid #94a3b8',
  2: '2px solid #cd7f32',
}
const PODIUM_GLOW: Record<number, string> = {
  0: '0 0 20px #f59e0b30, 0 4px 20px #f59e0b20',
  1: '0 0 14px #94a3b820',
  2: '0 0 14px #cd7f3220',
}
const PODIUM_CROWN: Record<number, string> = { 0: '🏆', 1: '🥈', 2: '🥉' }

function PodiumCard({ member, rank }: { member: GuildMember; rank: number }) {
  const cfg = ROLE_CONFIG[member.role]
  const RoleIcon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: rank === 0 ? -20 : 20, scale: rank === 0 ? 0.9 : 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: rank * 0.12, duration: 0.45, type: 'spring', stiffness: 200 }}
      className={cn(
        'relative flex flex-col items-center text-center rounded-2xl p-5 bg-card border',
        rank === 0 && 'md:col-start-2 md:-mt-4 z-10',
      )}
      style={{ border: PODIUM_BORDER[rank], boxShadow: PODIUM_GLOW[rank] }}
    >
      {/* Crown */}
      <div className="text-2xl mb-2">{PODIUM_CROWN[rank]}</div>

      {/* Avatar */}
      <div className="relative mb-3">
        <MemberAvatar member={member} size="lg" />
        {rank === 0 && (
          <span className="absolute -top-1 -right-1 text-base">👑</span>
        )}
      </div>

      <h4 className="font-bold text-foreground text-sm mb-1">{member.name}</h4>
      
      <div className="flex items-center gap-1.5 mb-2">
        <LevelBadge level={member.level} />
        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          <RoleIcon className="w-2.5 h-2.5" />
          {cfg.label}
        </span>
      </div>

      <div className="text-xs text-muted-foreground mb-1">
        本月贡献 <span className="font-semibold text-foreground">{Math.floor(member.contributedCards * 0.15)}</span> 卡
      </div>

      {member.representativeCard && (
        <p className="text-[10px] text-muted-foreground/70 line-clamp-2 leading-snug mt-1 italic">
          「{member.representativeCard}」
        </p>
      )}
    </motion.div>
  )
}

// ─── Member Row ───────────────────────────────────────────────────────────────

function MemberRow({ member, index }: { member: GuildMember; index: number }) {
  const cfg = ROLE_CONFIG[member.role]
  const RoleIcon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group cursor-pointer hover:translate-x-1"
    >
      <MemberAvatar member={member} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
          <LevelBadge level={member.level} />
          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            <RoleIcon className="w-2.5 h-2.5" />
            {cfg.label}
          </span>
        </div>
        {member.bio && (
          <p className="text-[11px] text-muted-foreground truncate">{member.bio}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {member.contributedCards}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="w-3 h-3" />
          {member.reuseCount}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Tab ─────────────────────────────────────────────────────────────────────

export function GuildMembersTab() {
  const [roleFilter, setRoleFilter] = useState<GuildRole | 'all'>('all')
  const [search, setSearch] = useState('')

  const top3 = [...MEMBERS].sort((a, b) => b.contributedCards - a.contributedCards).slice(0, 3)
  const sortedByRole: GuildRole[] = ['president', 'admin', 'core', 'newcomer']

  const filtered = useMemo(() => {
    let list = roleFilter === 'all' ? MEMBERS : MEMBERS.filter(m => m.role === roleFilter)
    if (search.trim()) {
      list = list.filter(m => m.name.includes(search.trim()))
    }
    return list.sort((a, b) => sortedByRole.indexOf(a.role) - sortedByRole.indexOf(b.role))
  }, [roleFilter, search])

  return (
    <div className="pt-4">

      {/* Podium */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-foreground">本月明星成员</h3>
          <span className="text-xs text-muted-foreground">· 按贡献卡数排名</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reorder: 2nd, 1st, 3rd for visual podium */}
          {[top3[1], top3[0], top3[2]].map((member, visualIdx) => {
            if (!member) return null
            const actualRank = visualIdx === 1 ? 0 : visualIdx === 0 ? 1 : 2
            return <PodiumCard key={member.id} member={member} rank={actualRank} />
          })}
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索成员..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
                roleFilter === tab.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-border'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 text-[11px] text-muted-foreground font-medium mb-1 border-b border-border">
        <div className="flex-1">成员</div>
        <div className="flex items-center gap-4 shrink-0">
          <span>贡献卡</span>
          <span>被复用</span>
        </div>
      </div>

      {/* Member list */}
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {filtered.map((member, i) => (
            <MemberRow key={member.id} member={member} index={i} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground">暂无匹配成员</div>
        )}
      </div>
    </div>
  )
}

// Fix missing Trophy import
function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
