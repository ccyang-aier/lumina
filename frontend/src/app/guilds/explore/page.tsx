"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowLeft, Filter, X, 
  TrendingUp, Clock, Grid, List, 
  ChevronRight, Sparkles, Zap, Flame,
  Users, BookOpen, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GUILDS, type Guild } from '@/lib/guild-data'
import { GridPattern } from '@/components/magicui/grid-pattern'

// ─── Filter Tabs ───
const FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'trending', label: '热门趋势' },
  { id: 'new', label: '最新成立' },
  { id: 'active', label: '高活跃度' },
]

// ─── Guild Card Component ───
function ExploreGuildCard({ guild, index, viewMode }: { guild: Guild; index: number; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="group"
      >
        <Link href={`/guilds/${guild.id}`} className="block relative">
          <div className="relative flex items-center gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-lg hover:border-blue-500/30 dark:hover:border-blue-400/30 overflow-hidden cursor-pointer">
            
            {/* Decorative Gradient Background */}
            <div 
              className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-current to-transparent opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none"
              style={{ color: guild.primaryColor }}
            />

            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg truncate">
                  {guild.name}
                </h3>
                {guild.honorTags.length > 0 ? (
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      background: `${guild.primaryColor}08`,
                      borderColor: `${guild.primaryColor}20`,
                      color: guild.primaryColor,
                    }}>
                    {guild.honorTags[0]}
                  </span>
                ) : guild.recommendReason ? (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-100 dark:border-amber-500/20">
                    <Sparkles className="w-3 h-3" /> 推荐
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1">
                {guild.slogan}
              </p>
            </div>

            <div className="flex items-center gap-8 relative z-10 shrink-0">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                    Lv.{guild.stats.activityLevel}
                 </span>
               </div>
               <div className="text-right w-20">
                 <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{guild.stats.members}</div>
                 <div className="text-[10px] text-slate-400">成员</div>
               </div>
               <div className="text-right w-20 hidden sm:block">
                 <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{guild.stats.knowledgeCards}</div>
                 <div className="text-[10px] text-slate-400">知识卡片</div>
               </div>
               <div className="text-right w-20 hidden sm:block">
                 <div className="text-sm font-bold text-orange-500">+{guild.stats.weeklyNew}</div>
                 <div className="text-[10px] text-slate-400">本周新增</div>
               </div>
               
               <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
               </div>
            </div>

          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group h-full"
    >
      <Link href={`/guilds/${guild.id}`} className="block h-full relative">
        <div className="relative h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-blue-400/30 overflow-hidden cursor-pointer">
          
          {/* Decorative Gradient Background */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full -mr-8 -mt-8 pointer-events-none"
            style={{ color: guild.primaryColor }}
          />

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg line-clamp-1">
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
            
            {/* Tag Logic */}
            {guild.honorTags.length > 0 ? (
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border"
                style={{
                  background: `${guild.primaryColor}08`,
                  borderColor: `${guild.primaryColor}20`,
                  color: guild.primaryColor,
                }}>
                {guild.honorTags[0]}
              </span>
            ) : guild.recommendReason ? (
              <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium border border-amber-100 dark:border-amber-500/20">
                <Sparkles className="w-3 h-3" /> 推荐
              </span>
            ) : null}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2 flex-1 relative z-10">
            {guild.slogan}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5" title="知识卡片数量">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-600 dark:text-slate-300">{guild.stats.knowledgeCards}</span>
              </div>
              <div className="flex items-center gap-1.5" title="本周新增">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-medium text-slate-600 dark:text-slate-300">+{guild.stats.weeklyNew}</span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ExploreGuildsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter Logic
  const filteredGuilds = GUILDS.filter(guild => {
    // Search Match
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchName = guild.name.toLowerCase().includes(q)
      const matchSlogan = guild.slogan.toLowerCase().includes(q)
      if (!matchName && !matchSlogan) return false
    }

    // Tab Filter
    if (activeFilter === 'trending') return guild.stats.weeklyNew > 10
    if (activeFilter === 'new') return false // Mock: no 'created_at' in data yet
    if (activeFilter === 'active') return guild.stats.activityLevel >= 4

    return true
  })

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      
      {/* ─── Header Section ─── */}
      <div className="relative bg-slate-900 text-white pb-12 pt-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom,white,transparent)] opacity-20 pointer-events-none",
          )}
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/guilds"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回公会广场
            </Link>
          </div>

          <div className="max-w-2xl mx-auto text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              探索无限可能
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mb-8">
              发现感兴趣的知识领域，加入活跃的技术社区，与 {GUILDS.reduce((acc, g) => acc + g.stats.members, 0)} 位开发者共同成长
            </p>

            {/* Search Bar */}
            <div className={cn(
              "relative max-w-lg mx-auto transition-all duration-300",
              isSearchFocused ? "scale-105" : "scale-100"
            )}>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className={cn("w-5 h-5 transition-colors", isSearchFocused ? "text-blue-400" : "text-slate-500")} />
              </div>
              <input
                type="text"
                placeholder="搜索公会名称、关键词..."
                className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-500 backdrop-blur-md focus:outline-none focus:bg-white/15 focus:border-blue-500/50 transition-all shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters & Tools */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-white/10">
            {/* Left: Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto justify-center sm:justify-start">
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                    activeFilter === filter.id
                      ? "bg-white text-slate-900 shadow-lg scale-105"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Right: Stats & View Toggle */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400 font-medium hidden sm:block">
                共找到 <span className="text-white font-bold">{filteredGuilds.length}</span> 个公会
              </div>
              
              <div className="flex bg-white/10 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded shadow-sm transition-all cursor-pointer",
                    viewMode === 'grid' 
                      ? "bg-white text-slate-900" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded shadow-sm transition-all cursor-pointer",
                    viewMode === 'list' 
                      ? "bg-white text-slate-900" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content Section ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 pb-20">
        
        {/* Guild Grid */}
        <AnimatePresence mode="wait">
          {filteredGuilds.length > 0 ? (
            <motion.div 
              layout
              className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "flex flex-col space-y-4"
              )}
            >
              {filteredGuilds.map((guild, index) => (
                <ExploreGuildCard key={guild.id} guild={guild} index={index} viewMode={viewMode} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">未找到相关公会</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                换个关键词试试，或者创建一个新的公会？
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
