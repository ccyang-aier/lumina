"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Shield, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const RULES = [
  {
    icon: "🤖",
    title: "AI 持续监控贡献质量",
    desc: "系统自动识别低质量、重复性内容，并对相关贡献进行降权处理。",
  },
  {
    icon: "🔍",
    title: "异常互刷行为自动识别",
    desc: "互刷复用（成员间异常互换复用）行为将被系统检测并清零相关积分。",
  },
  {
    icon: "📊",
    title: "每日积分获取上限 500 分",
    desc: "单日通过知识贡献获取的积分上限为 500 分，远征奖励不受此限。",
  },
  {
    icon: "💱",
    title: "积分 → 金币每日兑换上限 50 金币",
    desc: "每自然日最多将积分兑换为 50 枚金币，次日 00:00 重置。",
  },
  {
    icon: "⚠️",
    title: "异常行为警告机制",
    desc: "异常行为将触发系统警告通知，严重者将被暂停兑换权限 7 天。",
  },
]

export function FairnessCard() {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-dashed border-border bg-muted/30 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">公平积分守则</div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              每一分积分都来自真实的贡献
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-6">
              {/* Intro */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-5 p-3 rounded-xl bg-muted/50 border border-border/50">
                Lumina 相信每一分积分都来自真实的贡献，以下规则确保每位成员的付出被公平对待。
                这不是警告，而是一份承诺。
              </p>

              {/* Rules list */}
              <div className="space-y-4">
                {RULES.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
                    className="flex gap-3"
                  >
                    <span className="text-base shrink-0 mt-0.5">{rule.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{rule.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {rule.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Appeal */}
              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  如果你认为处置存在误差，可以申诉
                </p>
                <button className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  <MessageSquare className="w-3 h-3" />
                  联系管理员
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
