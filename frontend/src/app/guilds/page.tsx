"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BookOpen, Flame, Star, Plus, Compass,
  CheckCircle2, ChevronRight, Loader2, Sparkles,
  Trophy, Target, Zap, Search, ArrowRight
} from 'lucide-react'
import { MY_GUILDS, RECOMMENDED_GUILDS, GUILDS, type Guild, type ActivityLevel } from '@/lib/guild-data'
import { cn } from '@/lib/utils'
import { GridPattern } from '@/components/magicui/grid-pattern'

// ─── Utility Components ──────────────────────────────────────────────────────

function ActivityStars({ level }: { level: ActivityLevel }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('w-3 h-3', i < level ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700')}
        />
      ))}
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const totalMembers = GUILDS.reduce((acc, g) => acc + g.stats.members, 0)
  const totalCards = GUILDS.reduce((acc, g) => acc + g.stats.knowledgeCards, 0)
  
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-10 p-8 sm:p-12">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-20",
        )}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-blue-200 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              <span>知识社区全新升级</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
              连接智慧，共建未来
            </h1>
            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              加入公会，与志同道合的伙伴一起沉淀知识、分享经验。在这里，每一次交流都是成长的契机。
            </p>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/guilds/create"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer hover:scale-105 active:scale-95 duration-200"
              >
                <Plus className="w-4 h-4" /> 创建公会
              </Link>
              <Link 
                href="/guilds/explore"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95 duration-200"
              >
                <Compass className="w-4 h-4" /> 探索广场
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 w-full md:w-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
            <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
              <Users className="w-3.5 h-3.5" /> 活跃成员
            </div>
            <div className="text-2xl font-bold font-mono">{totalMembers}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
            <div className="flex items-center gap-2 text-emerald-200 text-xs mb-1">
              <BookOpen className="w-3.5 h-3.5" /> 知识卡片
            </div>
            <div className="text-2xl font-bold font-mono">{totalCards}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 col-span-2 hover:bg-white/15 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-amber-200 text-xs">
                <Trophy className="w-3.5 h-3.5" /> 本周之星
              </div>
              <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-sm font-bold truncate">前端工程师公会</div>
            <div className="text-xs text-white/50 mt-1">贡献 <span className="text-amber-300 font-mono">+128</span> 知识点</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── My Guild Card ───────────────────────────────────────────────────────────

function MyGuildCard({ guild, index }: { guild: Guild; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
    >
      <Link href={`/guilds/${guild.id}`} className="block group h-full cursor-pointer">
        <div className="relative h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-blue-400/30 overflow-hidden">
          
          {/* Decorative Gradient Background */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full -mr-8 -mt-8 pointer-events-none"
            style={{ color: guild.primaryColor }}
          />

          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                {guild.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                  Lv.{guild.stats.activityLevel}
                </span>
                <span className="text-xs text-slate-400">
                  {guild.stats.members} 成员
                </span>
              </div>
            </div>
            {guild.honorTags.length > 0 && (
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border"
                style={{
                  background: `${guild.primaryColor}08`,
                  borderColor: `${guild.primaryColor}20`,
                  color: guild.primaryColor,
                }}>
                {guild.honorTags[0]}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
            {guild.slogan}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-600 dark:text-slate-300">{guild.stats.knowledgeCards}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-medium text-slate-600 dark:text-slate-300">+{guild.stats.weeklyNew}</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Recommend Guild Card ────────────────────────────────────────────────────

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
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      className="group h-full"
    >
      <div className="relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent group-hover:via-blue-400 transition-colors" />

        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
             <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{guild.name}</h4>
             <div className="flex items-center gap-2 mt-1.5">
               <ActivityStars level={guild.stats.activityLevel} />
               <span className="text-xs text-slate-400">{guild.stats.members} 成员</span>
             </div>
          </div>
          {guild.recommendReason && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-100 dark:border-amber-500/20 shrink-0">
              <Sparkles className="w-3 h-3" /> 推荐
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
          {guild.slogan}
        </p>

        {guild.recommendReason && (
          <div className="mb-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">匹配原因：</span>
              {guild.recommendReason}
            </p>
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={status !== 'idle'}
          className={cn(
            'w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-300',
            status === 'idle' && 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 hover:shadow-lg hover:shadow-slate-500/20',
            status === 'loading' && 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed',
            status === 'applied' && 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 cursor-default',
          )}
        >
          {status === 'idle' && <>申请加入</>}
          {status === 'loading' && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 申请中...</>}
          {status === 'applied' && <><CheckCircle2 className="w-3.5 h-3.5" /> 已申请</>}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function GuildsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content: My Guilds */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">我的公会</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500">
                  {MY_GUILDS.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MY_GUILDS.map((guild, i) => (
                <MyGuildCard key={guild.id} guild={guild} index={i} />
              ))}
              
              {/* Add New Guild Placeholder */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-300 h-full min-h-[180px] cursor-pointer w-full"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-5 h-5" />
                </div>
                <span className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  发现更多公会
                </span>
              </motion.button>
            </div>
          </div>

          {/* Sidebar: Recommended */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">为你推荐</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {RECOMMENDED_GUILDS.map((guild, i) => (
                <RecommendCard key={guild.id} guild={guild} index={i} />
              ))}
            </div>

            {/* Quick Links / Footer in Sidebar */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">公会指南</h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" /> 如何创建公会？
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" /> 公会等级权益说明
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" /> 知识卡片贡献规范
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
