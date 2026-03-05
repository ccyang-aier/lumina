"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const EXCHANGE_RATE = 10 // 10 points = 1 coin

interface ExchangePanelProps {
  points: number
  coins: number
  todayExchanged: number
  dailyLimit: number
  onExchange: (pointsToSpend: number, coinsToGain: number) => void
}

export function ExchangePanel({
  points,
  coins,
  todayExchanged,
  dailyLimit,
  onExchange,
}: ExchangePanelProps) {
  const remainingToday = dailyLimit - todayExchanged
  const isAtLimit = remainingToday <= 0

  // Max coins we can exchange: limited by points and daily remaining
  const maxByPoints = Math.floor(points / EXCHANGE_RATE)
  const maxCoins = Math.min(maxByPoints, remainingToday)

  const [amount, setAmount] = useState(Math.min(5, maxCoins))
  const [showConfirm, setShowConfirm] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const pointsNeeded = amount * EXCHANGE_RATE
  const progressPct = dailyLimit > 0 ? (todayExchanged / dailyLimit) * 100 : 0

  function handleConfirm() {
    onExchange(pointsNeeded, amount)
    setShowConfirm(false)
    setAmount(Math.min(5, maxCoins - amount > 0 ? maxCoins - amount : 0))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border bg-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-sm">
            ⇄
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">积分 → 金币</h2>
            <p className="text-[11px] text-muted-foreground">10 积分 = 1 金币</p>
          </div>
        </div>

        {/* Daily progress text */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            今日已兑换{" "}
            <span className="font-semibold text-foreground">{todayExchanged}</span>
            {" "}/ {dailyLimit} 金币
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isAtLimit ? "bg-red-400" : "bg-gradient-to-r from-violet-500 to-amber-400",
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPct, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          />
        </div>
        {isAtLimit && (
          <p className="text-[11px] text-red-500 mt-1">今日兑换已达上限，明日重置</p>
        )}
      </div>

      {isAtLimit ? (
        /* Locked state */
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="text-2xl">🔒</span>
          <p className="text-sm text-muted-foreground text-center">
            今日已达每日上限 {dailyLimit} 金币<br />
            <span className="text-xs opacity-70">每天 00:00 重置，明天见</span>
          </p>
          <button
            disabled
            className="mt-2 px-6 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
          >
            今日已达上限
          </button>
        </div>
      ) : (
        <>
          {/* Slider */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-muted-foreground">兑换数量</label>
              <span className="text-xs text-muted-foreground">
                最多可兑 <span className="font-semibold text-foreground">{maxCoins}</span> 金币
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(maxCoins, 1)}
              step={1}
              value={Math.min(amount, maxCoins)}
              disabled={maxCoins <= 0}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={cn(
                "w-full h-2 rounded-full appearance-none cursor-pointer",
                "bg-muted [&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground",
                "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab",
                "[&::-webkit-slider-thumb]:active:cursor-grabbing",
                "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full",
                "[&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-grab",
                maxCoins <= 0 ? "opacity-40 cursor-not-allowed" : "",
              )}
              style={{
                background:
                  maxCoins > 0
                    ? `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${((Math.min(amount, maxCoins) - 1) / Math.max(maxCoins - 1, 1)) * 100}%, hsl(var(--muted)) ${((Math.min(amount, maxCoins) - 1) / Math.max(maxCoins - 1, 1)) * 100}%, hsl(var(--muted)) 100%)`
                    : undefined,
              }}
            />
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-muted/50 border border-border/50 mb-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">消耗积分</div>
              <div className="font-bold text-foreground">
                ✨ {(amount * EXCHANGE_RATE).toLocaleString("zh-CN")}
              </div>
            </div>
            <div className="text-lg text-muted-foreground">→</div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-0.5">获得金币</div>
              <div className="font-bold text-foreground">🪙 {amount}</div>
            </div>
          </div>

          {/* Exchange Button + Confirm popover */}
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setShowConfirm(true)}
              disabled={maxCoins <= 0 || amount <= 0}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                maxCoins <= 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]",
              )}
            >
              立即兑换
            </button>

            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute bottom-full left-0 right-0 mb-2 z-20"
                >
                  <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      确认兑换？
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      消耗{" "}
                      <span className="text-foreground font-medium">
                        ✨ {amount * EXCHANGE_RATE} 积分
                      </span>
                      ，获得{" "}
                      <span className="text-foreground font-medium">🪙 {amount} 金币</span>
                      <br />
                      兑换后余 ✨ {(points - amount * EXCHANGE_RATE).toLocaleString("zh-CN")} 积分 / 🪙{" "}
                      {(coins + amount).toLocaleString("zh-CN")} 金币
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-1 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
                      >
                        确认
                      </button>
                    </div>
                    {/* Popover arrow */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-r border-b border-border" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  )
}
