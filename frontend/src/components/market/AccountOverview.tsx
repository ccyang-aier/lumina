"use client"

import { motion } from "framer-motion"
import { ChevronRight, History } from "lucide-react"
import { AnimatedNumber } from "./AnimatedNumber"

interface AccountOverviewProps {
  points: number
  coins: number
  onShowRecords: (tab?: "points" | "coins" | "redemption") => void
}

export function AccountOverview({ points, coins, onShowRecords }: AccountOverviewProps) {
  return (
    <div className="relative">
      {/* Exchange Records Entry */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => onShowRecords("redemption")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <History className="w-3.5 h-3.5" />
          兑换记录
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border bg-card p-6 flex flex-col gap-2"
        >
          {/* Decorative bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent dark:from-violet-950/20 pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <span className="text-base">✨</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">当前积分</span>
            </div>
            <button
              onClick={() => onShowRecords("points")}
              className="text-xs text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              积分记录 →
            </button>
          </div>

          <div className="relative mt-1">
            <AnimatedNumber
              value={points}
              className="text-4xl font-bold tracking-tight text-foreground"
            />
          </div>

          <div className="relative text-xs text-muted-foreground/60">
            10 积分 = 1 金币，可在下方兑换
          </div>
        </motion.div>

        {/* Coins Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border bg-card p-6 flex flex-col gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-950/20 pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <span className="text-base">🪙</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">当前金币</span>
            </div>
            <button
              onClick={() => onShowRecords("coins")}
              className="text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              金币记录 →
            </button>
          </div>

          <div className="relative mt-1 flex items-baseline gap-2">
            <AnimatedNumber
              value={coins}
              className="text-4xl font-bold tracking-tight text-foreground"
            />
          </div>

          <div className="relative text-xs text-muted-foreground/60">
            可用于兑换商城内所有商品
          </div>
        </motion.div>
      </div>
    </div>
  )
}
