"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { Achievement } from "@/lib/honor-data"
import { RARITY_CONFIG } from "@/lib/honor-data"

// ─── Floating Particle ────────────────────────────────────────────────────────

function Particle({ rarity, index }: { rarity: string; index: number }) {
  const cfg = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]
  const angle = (index / 24) * Math.PI * 2
  const distance = 120 + Math.sin(index * 1.7) * 80
  const size = 3 + (index % 3) * 2

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: cfg.color,
        left: '50%',
        top: '50%',
        boxShadow: `0 0 ${size * 2}px ${cfg.color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 1.2 + (index % 4) * 0.3,
        delay: index * 0.03,
        ease: "easeOut",
      }}
    />
  )
}

// ─── Common Toast (bottom-right slide) ───────────────────────────────────────

function CommonToast({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  const cfg = RARITY_CONFIG[achievement.rarity]

  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] w-72 rounded-xl border bg-background shadow-2xl overflow-hidden"
      style={{ borderColor: cfg.color + '60' }}
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ background: cfg.color }} />

      <div className="p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ background: cfg.color + '20', boxShadow: cfg.glow }}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: cfg.color }}>
              成就解锁
            </span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: cfg.color + '20', color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">{achievement.name}</p>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{achievement.description}</p>
        </div>
        <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Rare Modal (center, with particles) ─────────────────────────────────────

function RareModal({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  const cfg = RARITY_CONFIG[achievement.rarity]

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-80 rounded-2xl border-2 bg-background p-8 text-center shadow-2xl overflow-visible"
        style={{ borderColor: cfg.color, boxShadow: `${cfg.glow}, 0 25px 50px rgba(0,0,0,0.3)` }}
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Particles origin */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 24 }, (_, i) => (
            <Particle key={i} rarity={achievement.rarity} index={i} />
          ))}
        </div>

        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{ background: cfg.color + '20', boxShadow: cfg.glow }}
        >
          {achievement.icon}
        </div>

        <div
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: cfg.color }}
        >
          ✦ {cfg.label}成就解锁 ✦
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
        <p className="text-xs text-muted-foreground/60 mb-6">{achievement.condition}</p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: cfg.color, color: '#fff' }}
        >
          太棒了，继续努力 →
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Epic / Legendary Full-Screen ─────────────────────────────────────────────

function EpicEffect({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  const cfg = RARITY_CONFIG[achievement.rarity]
  const isLegendary = achievement.rarity === 'legendary'

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Full-screen bg */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${cfg.color}30 0%, ${cfg.color}08 40%, transparent 70%)` }}
        initial={{ scale: 0 }}
        animate={{ scale: 2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(transparent 0%, ${cfg.color}15 50%, transparent 100%)`,
        }}
        initial={{ y: '-100%' }}
        animate={{ y: '200%' }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Dark overlay click-to-close */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 32 }, (_, i) => {
          const x = `${(i * 3.1) % 100}%`
          const delay = (i * 0.08) % 3
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ left: x, bottom: 0, background: cfg.color, opacity: 0.7 }}
              animate={{ y: [0, -window.innerHeight - 100], opacity: [0.7, 0] }}
              transition={{ duration: 3 + (i % 3), delay, repeat: Infinity, ease: 'linear' }}
            />
          )
        })}
      </div>

      {/* Main card */}
      <motion.div
        className="relative z-10 w-96 rounded-3xl border-2 bg-background p-10 text-center shadow-2xl"
        style={{
          borderColor: cfg.color,
          boxShadow: `${cfg.glow}, 0 40px 80px rgba(0,0,0,0.5)`,
        }}
        initial={{ scale: 0.3, opacity: 0, y: 60, rotateX: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }}
      >
        {/* Particle burst from card center */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 36 }, (_, i) => (
            <Particle key={i} rarity={achievement.rarity} index={i} />
          ))}
        </div>

        {isLegendary && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <motion.div
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </div>
        )}

        <motion.div
          className="w-24 h-24 rounded-2xl mx-auto mb-5 flex items-center justify-center text-5xl"
          style={{ background: cfg.color + '20', boxShadow: cfg.glow }}
          animate={isLegendary ? { boxShadow: [`${cfg.glow}`, `0 0 40px ${cfg.color}`, cfg.glow] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {achievement.icon}
        </motion.div>

        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: cfg.color }}>
          ✦ {cfg.label} · {achievement.category === 'legendary-all' ? '传奇成就' : '成就解锁'} ✦
        </div>

        <h3 className="text-3xl font-black text-foreground mb-2">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
        <p className="text-xs text-muted-foreground/60 mb-2">{achievement.condition}</p>

        <div
          className="text-xs px-3 py-1.5 rounded-full inline-block mb-6"
          style={{ background: cfg.color + '20', color: cfg.color }}
        >
          此成就已同步至公会动态
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: cfg.color, color: '#fff' }}
        >
          荣耀加冕，继续前行 ✦
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Controller ──────────────────────────────────────────────────────────

interface UnlockEffectProps {
  achievement: Achievement | null
  onClose: () => void
}

export function UnlockEffect({ achievement, onClose }: UnlockEffectProps) {
  if (!achievement) return null

  const rarity = achievement.rarity

  return (
    <AnimatePresence>
      {rarity === 'common' && (
        <CommonToast achievement={achievement} onClose={onClose} />
      )}
      {rarity === 'rare' && (
        <RareModal achievement={achievement} onClose={onClose} />
      )}
      {(rarity === 'epic' || rarity === 'legendary') && (
        <EpicEffect achievement={achievement} onClose={onClose} />
      )}
    </AnimatePresence>
  )
}
