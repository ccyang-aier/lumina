"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, BarChart2, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProfileTab } from "@/components/honor/ProfileTab"
import { LeaderboardTab } from "@/components/honor/LeaderboardTab"
import { AchievementsTab } from "@/components/honor/AchievementsTab"
import { CURRENT_USER } from "@/lib/honor-data"

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'profile',       label: '荣耀档案', icon: Trophy,   desc: '你在 Lumina 的知识成长履历' },
  { key: 'leaderboard',  label: '排行榜',   icon: BarChart2, desc: '让贡献被看见，让努力有回响' },
  { key: 'achievements', label: '成就殿堂', icon: Award,     desc: '每一枚勋章背后都有一个真实的故事' },
] as const

type TabKey = typeof TABS[number]['key']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExchangePage() {
  const [active, setActive] = useState<TabKey>('profile')

  const activeTab = TABS.find(t => t.key === active)!

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Header ── */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero row */}
          <div className="flex items-center justify-between py-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">荣誉殿堂</h1>
              </div>
              <p className="text-xs text-muted-foreground pl-11">
                贡献可见 · 成长可见 · 荣誉可见
              </p>
            </div>

            {/* User quick info */}
            <div className="hidden sm:flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: CURRENT_USER.avatarBg }}
              >
                {CURRENT_USER.name[0]}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{CURRENT_USER.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {CURRENT_USER.title} · Lv.{CURRENT_USER.level}
                </div>
              </div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-0 -mb-px">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = active === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2",
                    isActive
                      ? "text-foreground border-violet-500"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-500 rounded-full"
                      layoutId="tab-indicator"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab description */}
        <motion.p
          key={active}
          className="text-xs text-muted-foreground mb-6"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab.desc}
        </motion.p>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {active === 'profile' && <ProfileTab />}
            {active === 'leaderboard' && <LeaderboardTab />}
            {active === 'achievements' && <AchievementsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
