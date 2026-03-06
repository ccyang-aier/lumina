"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  MARKET_USER,
  PRODUCTS,
  Product,
  getProductStatus,
} from "@/lib/market-data"
import { AccountOverview } from "@/components/market/AccountOverview"
import { ExchangePanel } from "@/components/market/ExchangePanel"
import { ProductGrid } from "@/components/market/ProductGrid"
import { RedeemModal } from "@/components/market/RedeemModal"
import { FairnessCard } from "@/components/market/FairnessCard"
import { MyRecords } from "@/components/market/MyRecords"

// ─── Types ─────────────────────────────────────────────────────────────────────

type MainTab = "market" | "records"
type RecordsTab = "points" | "coins" | "redemption"

interface ShippingInfo {
  name: string
  phone: string
  address: string
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  message,
  visible,
}: {
  message: string
  visible: boolean
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-[100] px-5 py-3 rounded-2xl bg-foreground text-background text-sm font-medium shadow-2xl pointer-events-none whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const [mainTab, setMainTab] = useState<MainTab>("market")
  const [recordsDefaultTab, setRecordsDefaultTab] = useState<RecordsTab>("points")

  // Mutable user state
  const [points, setPoints] = useState(MARKET_USER.points)
  const [coins, setCoins] = useState(MARKET_USER.coins)
  const [todayExchanged, setTodayExchanged] = useState(MARKET_USER.todayExchanged)

  // Notify state
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set())

  // Redeem modal
  const [redeemTarget, setRedeemTarget] = useState<Product | null>(null)

  // Toast
  const [toastMsg, setToastMsg] = useState("")
  const [toastVisible, setToastVisible] = useState(false)

  function showToast(msg: string) {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  // ── Exchange handler ──────────────────────────────────────────────────────

  function handleExchange(pointsToSpend: number, coinsToGain: number) {
    setPoints((p) => p - pointsToSpend)
    setCoins((c) => c + coinsToGain)
    setTodayExchanged((t) => t + coinsToGain)
    showToast(`🪙 成功兑换 ${coinsToGain} 金币，消耗 ✨ ${pointsToSpend} 积分`)
  }

  // ── Redeem handler ────────────────────────────────────────────────────────

  function handleRedeem(product: Product, shippingInfo?: ShippingInfo) {
    setCoins((c) => c - product.price)
    const msg = product.isPhysical
      ? `📦 「${product.name}」订单已提交，预计3-5个工作日发货`
      : `🎉 「${product.name}」已到账，可在「我的权益」查看`
    showToast(msg)
  }

  // ── Notify handler ────────────────────────────────────────────────────────

  function handleNotify(productId: string) {
    setNotifiedIds((prev) => new Set(prev).add(productId))
    showToast("✓ 到货通知已设置，到货时我们会第一时间通知你")
  }

  // ── Records navigation ────────────────────────────────────────────────────

  function handleShowRecords(tab?: RecordsTab) {
    if (tab) setRecordsDefaultTab(tab)
    setMainTab("records")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Header ── */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">集市</h1>
              </div>
              <p className="text-xs text-muted-foreground pl-11">
                努力是有重量的 · 贡献在这里兑现
              </p>
            </div>

            {/* User quick info */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">✨</span>
                <span className="font-semibold text-foreground">{points.toLocaleString("zh-CN")}</span>
                <span className="text-muted-foreground/50 text-xs">积分</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">🪙</span>
                <span className="font-semibold text-foreground">{coins.toLocaleString("zh-CN")}</span>
                <span className="text-muted-foreground/50 text-xs">金币</span>
              </div>
            </div>
          </div>

          {/* Main Tab Nav */}
          <div className="flex gap-0 -mb-px">
            {(
              [
                { key: "market", label: "集市", icon: Store },
                { key: "records", label: "我的记录", icon: ScrollText },
              ] as const
            ).map(({ key, label, icon: Icon }) => {
              const isActive = mainTab === key
              return (
                <button
                  key={key}
                  onClick={() => setMainTab(key)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2",
                    isActive
                      ? "text-foreground border-amber-500 dark:border-amber-400"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full"
                      layoutId="market-main-indicator"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {mainTab === "market" ? (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Account Overview */}
              <section>
                <AccountOverview
                  points={points}
                  coins={coins}
                  onShowRecords={handleShowRecords}
                />
              </section>

              {/* Exchange Panel */}
              <section>
                <ExchangePanel
                  points={points}
                  coins={coins}
                  todayExchanged={todayExchanged}
                  dailyLimit={MARKET_USER.dailyExchangeLimit}
                  onExchange={handleExchange}
                />
              </section>

              {/* Product Grid */}
              <section>
                <ProductGrid
                  products={PRODUCTS}
                  userLevel={MARKET_USER.level}
                  userCoins={coins}
                  notifiedIds={notifiedIds}
                  onRedeem={setRedeemTarget}
                  onNotify={handleNotify}
                />
              </section>

              {/* Fairness Card */}
              <section className="pb-8">
                <FairnessCard />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <MyRecords defaultTab={recordsDefaultTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Redeem Modal ── */}
      <RedeemModal
        product={redeemTarget}
        userCoins={coins}
        onClose={() => setRedeemTarget(null)}
        onConfirm={(product, shippingInfo) => {
          handleRedeem(product, shippingInfo)
          setTimeout(() => setRedeemTarget(null), 2000)
        }}
      />

      {/* ── Toast ── */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  )
}
