"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ChevronRight, Users, BookOpen, Flame, Star,
  Bell, Settings, Zap, TrendingUp,
} from 'lucide-react'
import { getGuildById, type Guild } from '@/lib/guild-data'
import { GuildFeedTab } from '@/components/guild/GuildFeedTab'
import { GuildAnnouncementsTab } from '@/components/guild/GuildAnnouncementsTab'
import { GuildMembersTab } from '@/components/guild/GuildMembersTab'
import { GuildExpeditionsTab } from '@/components/guild/GuildExpeditionsTab'
import { GuildLibraryTab } from '@/components/guild/GuildLibraryTab'
import { GuildLearningPathTab } from '@/components/guild/GuildLearningPathTab'
import { cn } from '@/lib/utils'

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS = [
  { key: 'feed',        label: '知识动态' },
  { key: 'announce',    label: '公告栏' },
  { key: 'members',     label: '成员' },
  { key: 'expeditions', label: '公会远征' },
  { key: 'library',     label: '图书馆' },
  { key: 'path',        label: '学习路径' },
] as const

type TabKey = typeof TABS[number]['key']

// ─── Activity stars ───────────────────────────────────────────────────────────

function ActivityStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('w-3.5 h-3.5', i < level ? 'fill-amber-400 text-amber-400' : 'text-white/20')} />
      ))}
    </div>
  )
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function GuildHero({ guild }: { guild: Guild }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 60])
  const opacity = useTransform(scrollY, [0, 200], [1, 0.7])

  return (
    <div ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 280 }}>
      {/* Background: geometric texture */}
      <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-950">
        {/* Geometric pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
        {/* Color accent glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${guild.primaryColor}60 0%, transparent 60%)` }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(ellipse at 70% 20%, ${guild.accentColor}60 0%, transparent 50%)` }}
        />
        {/* Light mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/40 dark:hidden hidden" />
      </div>

      {/* Parallax content */}
      <motion.div style={{ y, opacity }} className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 mx-auto max-w-[1440px]">
        
        {/* Top row: admin buttons */}
        <div className="flex items-center justify-end gap-2 mb-8">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-xs font-medium transition-all backdrop-blur-sm border border-white/10">
            <Bell className="w-3.5 h-3.5" /> 公告
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-xs font-medium transition-all backdrop-blur-sm border border-white/10">
            <Settings className="w-3.5 h-3.5" /> 管理
          </button>
        </div>

        {/* Guild identity */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
            style={{ background: `${guild.primaryColor}30`, border: `1.5px solid ${guild.primaryColor}50` }}>
            {guild.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight">{guild.name}</h1>
            <p className="text-white/60 text-sm italic">「{guild.slogan}」</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
          {[
            { icon: Users,     value: guild.stats.members,     label: '成员' },
            { icon: BookOpen,  value: guild.stats.knowledgeCards, label: '知识卡' },
            { icon: TrendingUp,value: `+${guild.stats.weeklyNew}`, label: '本周新增' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-white/50" />
              <span className="text-white font-bold">{value}</span>
              <span className="text-white/50 text-sm">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400/80" />
            <ActivityStars level={guild.stats.activityLevel} />
          </div>
        </div>

        {/* Active expeditions pulse bar */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          当前进行中的公会远征：2 个
        </div>
      </motion.div>
    </div>
  )
}

// ─── Sticky Tab nav ───────────────────────────────────────────────────────────

function TabNav({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const [tabWidths, setTabWidths] = useState<number[]>([])
  const [tabLefts, setTabLefts] = useState<number[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const update = () => {
      const widths: number[] = []
      const lefts: number[] = []
      buttonRefs.current.forEach(btn => {
        if (btn && navRef.current) {
          const btnRect = btn.getBoundingClientRect()
          const navRect = navRef.current.getBoundingClientRect()
          widths.push(btnRect.width)
          lefts.push(btnRect.left - navRect.left)
        }
      })
      setTabWidths(widths)
      setTabLefts(lefts)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const activeIdx = TABS.findIndex(t => t.key === active)

  return (
    <div className="sticky top-[65px] z-30 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={navRef} className="relative flex gap-0 overflow-x-auto scrollbar-none">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              ref={el => { buttonRefs.current[i] = el }}
              onClick={() => onChange(tab.key)}
              className={cn(
                'relative px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 shrink-0',
                active === tab.key
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}

          {/* Sliding underline */}
          {tabWidths[activeIdx] > 0 && (
            <motion.div
              className="absolute bottom-0 h-0.5 bg-foreground rounded-full"
              animate={{ left: tabLefts[activeIdx] ?? 0, width: tabWidths[activeIdx] ?? 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GuildDetailPage() {
  const params = useParams()
  const guildId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? 'frontend'
  const guild = getGuildById(guildId) ?? getGuildById('frontend')!

  const [activeTab, setActiveTab] = useState<TabKey>('feed')

  const TAB_CONTENT: Record<TabKey, React.ReactNode> = {
    feed:        <GuildFeedTab />,
    announce:    <GuildAnnouncementsTab />,
    members:     <GuildMembersTab />,
    expeditions: <GuildExpeditionsTab />,
    library:     <GuildLibraryTab />,
    path:        <GuildLearningPathTab />,
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link href="/guilds" className="hover:text-foreground transition-colors">公会列表</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{guild.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <GuildHero guild={guild} />

      {/* Tab nav */}
      <TabNav active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {TAB_CONTENT[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
