"use client"

import { motion } from "framer-motion"
import { Lock, Bell, BellOff, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { Product, getProductStatus } from "@/lib/market-data"
import { CountdownTimer } from "./CountdownTimer"

// ─── Preview Effects ──────────────────────────────────────────────────────────

function HaloPreview() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 opacity-60 blur-sm animate-spin [animation-duration:3s]" />
      <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
        李
      </div>
    </div>
  )
}

function MedalPreview() {
  return (
    <div className="relative">
      <div className="text-4xl drop-shadow-lg" style={{ filter: "drop-shadow(0 0 6px #f59e0b)" }}>
        🏅
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
    </div>
  )
}

function BubblePreview() {
  return (
    <div className="relative px-3 py-1.5 rounded-2xl rounded-tl-none text-xs font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 shadow-lg animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%]">
      你好呀 👋
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product
  userLevel: number
  userCoins: number
  notified: boolean
  onRedeem: (product: Product) => void
  onNotify: (productId: string) => void
}

export function ProductCard({
  product,
  userLevel,
  userCoins,
  notified,
  onRedeem,
  onNotify,
}: ProductCardProps) {
  const status = getProductStatus(product, userLevel, userCoins)
  const isDisabled = status === "sold-out" || status === "level-locked"
  const isUnavailable = isDisabled

  const stockPct = product.totalStock > 0 ? product.stock / product.totalStock : 0
  const isLowStock = status === "low-stock"

  return (
    <motion.div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-shadow",
        isUnavailable
          ? "opacity-75 cursor-default"
          : "cursor-pointer hover:shadow-lg dark:hover:shadow-black/30",
      )}
      whileHover={
        isUnavailable
          ? {}
          : { y: -4, boxShadow: "0 16px 40px -8px rgba(0,0,0,0.15)" }
      }
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* ── Overlays ── */}
      {status === "sold-out" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-[2px] rounded-2xl">
          <span className="text-2xl">📭</span>
          <span className="text-sm font-semibold text-muted-foreground">已兑完</span>
        </div>
      )}
      {status === "level-locked" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-[2px] rounded-2xl group">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">
            需要 Lv.{product.requiredLevel}+
          </span>
          <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
            距离解锁还差 {product.requiredLevel! - userLevel} 级
          </span>
        </div>
      )}

      {/* ── Badges (top-right) ── */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
        {product.isPopular && (
          <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white leading-none">
            <Flame className="w-2.5 h-2.5" />
            热门
          </span>
        )}
        {product.expiresAt && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
              "bg-red-500/10 border border-red-500/30 text-red-500",
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            <CountdownTimer expiresAt={product.expiresAt} />
          </div>
        )}
        {product.isInstant && !product.expiresAt && (
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 leading-none">
            立即到账
          </span>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Icon / Preview */}
        <div className="flex justify-center pt-2 pb-1 min-h-[56px] items-center">
          {product.previewEffect === "halo" ? (
            <HaloPreview />
          ) : product.previewEffect === "medal" ? (
            <MedalPreview />
          ) : product.previewEffect === "bubble" ? (
            <BubblePreview />
          ) : (
            <span className="text-4xl select-none">{product.icon}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Stock */}
        <div className="flex items-center gap-2">
          {isLowStock ? (
            <span className="flex items-center gap-1 text-[11px] text-orange-500 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
              </span>
              库存紧张 · 仅剩 {product.stock} 件
            </span>
          ) : product.stock > 0 ? (
            <span className="text-[11px] text-muted-foreground/70">
              库存 {product.stock} 件
            </span>
          ) : null}
          {product.isPhysical && product.stock > 0 && (
            <span className="text-[11px] text-muted-foreground/50">· 需填收货信息</span>
          )}
        </div>

        {/* Stock bar for physical */}
        {product.isPhysical && product.totalStock > 0 && product.stock > 0 && (
          <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                stockPct > 0.3 ? "bg-emerald-500" : stockPct > 0.1 ? "bg-orange-400" : "bg-red-500",
              )}
              style={{ width: `${Math.max(stockPct * 100, 4)}%` }}
            />
          </div>
        )}

        {/* Price */}
        <div className="text-lg font-bold text-foreground flex items-center gap-1">
          🪙
          <span>{product.price.toLocaleString("zh-CN")}</span>
        </div>

        {/* Button */}
        <RedeemButton
          status={status}
          notified={notified}
          product={product}
          userCoins={userCoins}
          onRedeem={onRedeem}
          onNotify={onNotify}
        />
      </div>
    </motion.div>
  )
}

// ─── Redeem Button ────────────────────────────────────────────────────────────

interface RedeemButtonProps {
  status: ReturnType<typeof getProductStatus>
  notified: boolean
  product: Product
  userCoins: number
  onRedeem: (p: Product) => void
  onNotify: (id: string) => void
}

function RedeemButton({ status, notified, product, userCoins, onRedeem, onNotify }: RedeemButtonProps) {
  if (status === "sold-out") {
    return (
      <button
        onClick={() => onNotify(product.id)}
        disabled={notified}
        className={cn(
          "w-full mt-auto rounded-xl py-2 text-xs font-medium transition-all border",
          notified
            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 cursor-default"
            : "border-border text-muted-foreground hover:border-border hover:bg-muted/50",
        )}
      >
        {notified ? "✓ 已设置通知" : (
          <span className="flex items-center justify-center gap-1.5">
            <Bell className="w-3 h-3" /> 到货通知我
          </span>
        )}
      </button>
    )
  }

  if (status === "level-locked") {
    return (
      <button
        disabled
        className="w-full mt-auto rounded-xl py-2 text-xs font-medium bg-muted text-muted-foreground cursor-not-allowed border border-transparent"
      >
        <span className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> 等级不足
        </span>
      </button>
    )
  }

  if (status === "coin-insufficient") {
    const diff = product.price - userCoins
    return (
      <button
        disabled
        title={`还差 ${diff} 金币，去赚取 →`}
        className="w-full mt-auto rounded-xl py-2 text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20 cursor-not-allowed"
      >
        金币不足
      </button>
    )
  }

  return (
    <button
      onClick={() => onRedeem(product)}
      className="w-full mt-auto rounded-xl py-2 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 active:scale-[0.97] transition-all"
    >
      兑换
    </button>
  )
}
