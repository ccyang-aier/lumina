"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, CheckCircle2, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/market-data"

interface ShippingInfo {
  name: string
  phone: string
  address: string
}

interface RedeemModalProps {
  product: Product | null
  userCoins: number
  onClose: () => void
  onConfirm: (product: Product, shippingInfo?: ShippingInfo) => void
}

type ModalState = "confirm" | "loading" | "success"

export function RedeemModal({ product, userCoins, onClose, onConfirm }: RedeemModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm")
  const [shipping, setShipping] = useState<ShippingInfo>({ name: "", phone: "", address: "" })
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})

  if (!product) return null

  const afterCoins = userCoins - product.price
  const successMessages: Record<string, string> = {
    halo: `🎉 星图探索者光环已激活，快去个人主页看看吧！`,
    medal: `🏅 赤金传承者勋章已添加到你的名片，彰显你的荣誉！`,
    bubble: `💬 流光信使气泡特效已启用，下次发言时会闪亮登场！`,
  }

  function validate(): boolean {
    if (!product?.isPhysical) return true
    const e: Partial<ShippingInfo> = {}
    if (!shipping.name.trim()) e.name = "请填写收货人姓名"
    if (!shipping.phone.trim()) e.phone = "请填写联系方式"
    if (!shipping.address.trim()) e.address = "请填写收货地址"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleConfirm() {
    if (!validate()) return
    setModalState("loading")
    await new Promise((r) => setTimeout(r, 1000))
    setModalState("success")
    onConfirm(product!, product?.isPhysical ? shipping : undefined)
  }

  function handleClose() {
    setModalState("confirm")
    setShipping({ name: "", phone: "", address: "" })
    setErrors({})
    onClose()
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={modalState === "success" ? handleClose : () => {}}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="bg-card rounded-2xl border shadow-2xl overflow-hidden">
              {/* Close */}
              {modalState !== "loading" && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <AnimatePresence mode="wait">
                {/* ── Confirm State ── */}
                {modalState === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="flex flex-col items-center text-center mb-6">
                      <span className="text-5xl mb-3">{product.icon}</span>
                      <h2 className="text-lg font-bold text-foreground leading-snug mb-1">
                        {product.name}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                        {product.description}
                      </p>
                    </div>

                    {/* Cost */}
                    <div className="rounded-xl bg-muted/50 border border-border/50 p-4 mb-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">消耗金币</span>
                        <span className="font-bold text-foreground">🪙 {product.price}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border/50 pt-2">
                        <span className="text-xs text-muted-foreground">兑换后余额</span>
                        <span className="text-xs text-muted-foreground">
                          🪙 {afterCoins.toLocaleString("zh-CN")} 金币
                        </span>
                      </div>
                    </div>

                    {/* Virtual tip */}
                    {!product.isPhysical && (
                      <div className="flex items-start gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 mb-4">
                        <span className="text-emerald-500 text-sm mt-0.5">✓</span>
                        <p className="text-xs text-muted-foreground">
                          兑换后立即生效，可在「我的权益」查看使用情况
                        </p>
                      </div>
                    )}

                    {/* Physical form */}
                    {product.isPhysical && (
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Package className="w-3.5 h-3.5" />
                          请填写收货信息（必填）
                        </div>
                        <FormField
                          label="收货人"
                          placeholder="请输入收货人姓名"
                          value={shipping.name}
                          error={errors.name}
                          onChange={(v) => {
                            setShipping((s) => ({ ...s, name: v }))
                            setErrors((e) => ({ ...e, name: undefined }))
                          }}
                        />
                        <FormField
                          label="联系方式"
                          placeholder="手机号码"
                          value={shipping.phone}
                          error={errors.phone}
                          onChange={(v) => {
                            setShipping((s) => ({ ...s, phone: v }))
                            setErrors((e) => ({ ...e, phone: undefined }))
                          }}
                        />
                        <FormField
                          label="收货地址"
                          placeholder="省/市/区/详细地址"
                          value={shipping.address}
                          error={errors.address}
                          onChange={(v) => {
                            setShipping((s) => ({ ...s, address: v }))
                            setErrors((e) => ({ ...e, address: undefined }))
                          }}
                        />
                        <p className="text-[11px] text-muted-foreground/70 text-center">
                          预计 3–5 个工作日发货，物流信息将发送至企业邮箱
                        </p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                      >
                        确认兑换
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Loading State ── */}
                {modalState === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center gap-4"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">正在处理兑换…</p>
                  </motion.div>
                )}

                {/* ── Success State ── */}
                {modalState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 flex flex-col items-center gap-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">兑换成功！</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.previewEffect
                          ? successMessages[product.previewEffect]
                          : product.isPhysical
                          ? `📦 「${product.name}」订单已提交，预计 3–5 个工作日发货，物流信息将发送至你的企业邮箱`
                          : `🎉 「${product.name}」已到账，可在「我的权益」查看`}
                      </p>
                    </div>
                    {!product.isPhysical && (
                      <p className="text-xs text-muted-foreground/60">
                        🪙 剩余金币 {afterCoins.toLocaleString("zh-CN")}
                      </p>
                    )}
                    <button
                      onClick={handleClose}
                      className="mt-2 px-8 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                    >
                      好的
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Form Field ────────────────────────────────────────────────────────────────

function FormField({
  label,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  error?: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
          error ? "border-red-500/60 focus:ring-red-500/30" : "border-border",
        )}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}
