"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { Product, ProductCategory } from "@/lib/market-data"
import { ProductCard } from "./ProductCard"

// ─── Category Tabs ─────────────────────────────────────────────────────────────

type TabKey = "all" | ProductCategory

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "virtual", label: "虚拟权益" },
  { key: "honor", label: "荣誉标识" },
  { key: "physical", label: "实物礼品" },
  { key: "limited", label: "限定活动" },
]

const SECTION_META: Record<
  ProductCategory,
  { icon: string; title: string; desc: string }
> = {
  honor: {
    icon: "🎖️",
    title: "荣誉标识",
    desc: "虚拟身份标识，兑换后立即生效，永久有效",
  },
  virtual: {
    icon: "📦",
    title: "虚拟权益",
    desc: "兑换后立即到账，可在「我的权益」查看与使用",
  },
  physical: {
    icon: "🎁",
    title: "实物礼品",
    desc: "需填写收货信息，3–5 个工作日发货",
  },
  limited: {
    icon: "⏰",
    title: "限定活动",
    desc: "限时限量发放，过期自动下架，先到先得",
  },
}

const CATEGORY_ORDER: ProductCategory[] = ["honor", "virtual", "physical", "limited"]

// ─── Stagger animation helpers ────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: Product[]
  userLevel: number
  userCoins: number
  notifiedIds: Set<string>
  onRedeem: (product: Product) => void
  onNotify: (productId: string) => void
}

export function ProductGrid({
  products,
  userLevel,
  userCoins,
  notifiedIds,
  onRedeem,
  onNotify,
}: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all")

  const popularProducts = products.filter((p) => p.isPopular)

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab)

  return (
    <div>
      {/* ── Category Tabs ── */}
      <div className="relative flex items-center gap-1 border-b border-border mb-8 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="market-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* ── Hot Products Section (only show on "all" tab) ── */}
          {activeTab === "all" && popularProducts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="text-base font-bold text-foreground">🔥 本周热门</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-5">本周兑换最多的商品</p>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {popularProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      product={product}
                      userLevel={userLevel}
                      userCoins={userCoins}
                      notified={notifiedIds.has(product.id)}
                      onRedeem={onRedeem}
                      onNotify={onNotify}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* ── Product Sections by Category ── */}
          {activeTab === "all" ? (
            CATEGORY_ORDER.map((cat) => {
              const items = filteredProducts.filter((p) => p.category === cat)
              if (items.length === 0) return null
              const meta = SECTION_META[cat]
              return (
                <SectionBlock
                  key={cat}
                  icon={meta.icon}
                  title={meta.title}
                  desc={meta.desc}
                  products={items}
                  userLevel={userLevel}
                  userCoins={userCoins}
                  notifiedIds={notifiedIds}
                  onRedeem={onRedeem}
                  onNotify={onNotify}
                />
              )
            })
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    userLevel={userLevel}
                    userCoins={userCoins}
                    notified={notifiedIds.has(product.id)}
                    onRedeem={onRedeem}
                    onNotify={onNotify}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Section Block ─────────────────────────────────────────────────────────────

interface SectionBlockProps {
  icon: string
  title: string
  desc: string
  products: Product[]
  userLevel: number
  userCoins: number
  notifiedIds: Set<string>
  onRedeem: (p: Product) => void
  onNotify: (id: string) => void
}

function SectionBlock({
  icon,
  title,
  desc,
  products,
  userLevel,
  userCoins,
  notifiedIds,
  onRedeem,
  onNotify,
}: SectionBlockProps) {
  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5 ml-6">{desc}</p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              product={product}
              userLevel={userLevel}
              userCoins={userCoins}
              notified={notifiedIds.has(product.id)}
              onRedeem={onRedeem}
              onNotify={onNotify}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
