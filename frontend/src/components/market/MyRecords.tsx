"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  POINT_RECORDS,
  COIN_RECORDS,
  REDEMPTION_RECORDS,
  PointRecord,
  CoinRecord,
  RedemptionRecord,
} from "@/lib/market-data"

// ─── Types & Tabs ─────────────────────────────────────────────────────────────

type RecordTab = "points" | "coins" | "redemption"
type TimeFilter = "7d" | "30d" | "all"
type TypeFilter = "all" | "earned" | "spent"

const TABS: { key: RecordTab; label: string }[] = [
  { key: "points", label: "积分记录" },
  { key: "coins", label: "金币记录" },
  { key: "redemption", label: "兑换记录" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function groupByDate<T extends { timestamp: Date }>(records: T[]) {
  const map = new Map<string, T[]>()
  records.forEach((r) => {
    const key = formatDate(r.timestamp)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  })
  return Array.from(map.entries())
}

const STATUS_CONFIG: Record<
  RedemptionRecord["status"],
  { icon: string; label: string; color: string }
> = {
  delivered: { icon: "✅", label: "已到账", color: "text-emerald-600 dark:text-emerald-400" },
  shipping: { icon: "📦", label: "配送中", color: "text-blue-600 dark:text-blue-400" },
  processing: { icon: "⏳", label: "处理中", color: "text-amber-600 dark:text-amber-400" },
  cancelled: { icon: "❌", label: "已取消", color: "text-red-500" },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MyRecordsProps {
  defaultTab?: RecordTab
}

export function MyRecords({ defaultTab = "points" }: MyRecordsProps) {
  const [activeTab, setActiveTab] = useState<RecordTab>(defaultTab)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30d")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [visibleCount, setVisibleCount] = useState(10)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function filterByTime<T extends { timestamp: Date }>(records: T[]) {
    const now = Date.now()
    if (timeFilter === "7d") return records.filter((r) => now - r.timestamp.getTime() < 7 * 86400000)
    if (timeFilter === "30d") return records.filter((r) => now - r.timestamp.getTime() < 30 * 86400000)
    return records
  }

  function filterByType<T extends { type: "earned" | "spent" }>(records: T[]) {
    if (typeFilter === "all") return records
    return records.filter((r) => r.type === typeFilter)
  }

  const pointRecords = filterByType(filterByTime(POINT_RECORDS))
  const coinRecords = filterByType(filterByTime(COIN_RECORDS))
  const redemptionRecords = filterByTime(REDEMPTION_RECORDS)

  const handleTabChange = (tab: RecordTab) => {
    setActiveTab(tab)
    setVisibleCount(10)
    setTypeFilter("all")
  }

  return (
    <div className="space-y-6">
      {/* ── Tab Nav ── */}
      <div className="relative flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="records-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2">
        {(["7d", "30d", "all"] as TimeFilter[]).map((t) => (
          <FilterChip
            key={t}
            active={timeFilter === t}
            onClick={() => setTimeFilter(t)}
            label={t === "7d" ? "最近7天" : t === "30d" ? "最近30天" : "全部"}
          />
        ))}
        {activeTab !== "redemption" && (
          <>
            <div className="w-px h-6 bg-border self-center mx-1" />
            {(["all", "earned", "spent"] as TypeFilter[]).map((t) => (
              <FilterChip
                key={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)}
                label={t === "all" ? "全部" : t === "earned" ? "获得" : "消耗"}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Lists ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "points" && (
            <PointCoinList
              records={pointRecords}
              visibleCount={visibleCount}
              unit="积分"
              onLoadMore={() => setVisibleCount((n) => n + 10)}
            />
          )}
          {activeTab === "coins" && (
            <PointCoinList
              records={coinRecords}
              visibleCount={visibleCount}
              unit="金币"
              onLoadMore={() => setVisibleCount((n) => n + 10)}
            />
          )}
          {activeTab === "redemption" && (
            <RedemptionList
              records={redemptionRecords}
              visibleCount={visibleCount}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onLoadMore={() => setVisibleCount((n) => n + 10)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Filter Chip ────────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
    >
      {label}
    </button>
  )
}

// ─── Point/Coin List ──────────────────────────────────────────────────────────

function PointCoinList({
  records,
  visibleCount,
  unit,
  onLoadMore,
}: {
  records: (PointRecord | CoinRecord)[]
  visibleCount: number
  unit: string
  onLoadMore: () => void
}) {
  const visible = records.slice(0, visibleCount)
  const groups = groupByDate(visible)

  if (records.length === 0) {
    return <EmptyState message={`暂无${unit}记录`} />
  }

  return (
    <div className="space-y-6">
      {groups.map(([date, items]) => {
        const dayTotal = items.reduce((sum, r) => sum + r.change, 0)
        return (
          <div key={date}>
            {/* Day header */}
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">{date}</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  dayTotal > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500",
                )}
              >
                {dayTotal > 0 ? "+" : ""}
                {dayTotal.toLocaleString("zh-CN")} {unit}
              </span>
            </div>

            {/* Records */}
            <div className="space-y-2">
              {items.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3"
                >
                  <span className="text-xl shrink-0">{record.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug line-clamp-1">
                      {record.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {formatTs(record.timestamp)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={cn(
                        "text-sm font-bold",
                        record.change > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500",
                      )}
                    >
                      {record.change > 0 ? "+" : ""}
                      {record.change.toLocaleString("zh-CN")}
                    </div>
                    <div className="text-[11px] text-muted-foreground/50">
                      累计{" "}
                      {(record as PointRecord | CoinRecord).cumulative.toLocaleString("zh-CN")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}

      {visibleCount < records.length && (
        <LoadMoreButton onClick={onLoadMore} />
      )}
    </div>
  )
}

// ─── Redemption List ──────────────────────────────────────────────────────────

function RedemptionList({
  records,
  visibleCount,
  expandedIds,
  onToggleExpand,
  onLoadMore,
}: {
  records: RedemptionRecord[]
  visibleCount: number
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onLoadMore: () => void
}) {
  const visible = records.slice(0, visibleCount)

  if (records.length === 0) {
    return <EmptyState message="暂无兑换记录" />
  }

  return (
    <div className="space-y-3">
      {visible.map((record) => {
        const cfg = STATUS_CONFIG[record.status]
        const isExpanded = expandedIds.has(record.id)
        const canExpand = record.isPhysical && record.shippingInfo

        return (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border/50 bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl shrink-0">{record.productIcon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">
                  {record.productName}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                  {formatTs(record.timestamp)}
                </p>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <div className="text-sm font-bold text-foreground">
                  🪙 {record.coinsSpent}
                </div>
                <div className={cn("text-xs font-medium", cfg.color)}>
                  {cfg.icon} {cfg.label}
                </div>
              </div>
              {canExpand && (
                <button
                  onClick={() => onToggleExpand(record.id)}
                  className="ml-1 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
              )}
            </div>

            {/* Expanded shipping info */}
            <AnimatePresence initial={false}>
              {isExpanded && canExpand && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
                    <div className="pt-3 space-y-1.5 text-xs text-muted-foreground">
                      <InfoRow label="收货人" value={record.shippingInfo!.name} />
                      <InfoRow label="联系方式" value={record.shippingInfo!.phone} />
                      <InfoRow label="收货地址" value={record.shippingInfo!.address} />
                      {record.estimatedDelivery && (
                        <InfoRow label="预计到达" value={record.estimatedDelivery} />
                      )}
                      {record.logisticsNote && (
                        <InfoRow label="物流备注" value={record.logisticsNote} />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {visibleCount < records.length && (
        <LoadMoreButton onClick={onLoadMore} />
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 w-16 text-muted-foreground/50">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <span className="text-4xl">📭</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center pt-2">
      <button
        onClick={onClick}
        className="px-6 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        加载更多
      </button>
    </div>
  )
}
