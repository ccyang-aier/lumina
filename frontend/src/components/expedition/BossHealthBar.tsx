"use client"

import { useEffect, useState } from 'react'
import { Skull } from 'lucide-react'
import styles from './expedition.module.css'

interface BossHealthBarProps {
  bossName: string
  hp: number
  isCompleted?: boolean
  size?: 'sm' | 'lg'
}

export function BossHealthBar({ bossName, hp, isCompleted = false, size = 'sm' }: BossHealthBarProps) {
  const [animatedHp, setAnimatedHp] = useState(100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedHp(hp), 300)
    return () => clearTimeout(timer)
  }, [hp])

  const hpColor =
    animatedHp > 60 ? '#ef4444' :
    animatedHp > 30 ? '#f97316' :
    animatedHp > 0  ? '#fbbf24' : '#34d399'

  if (size === 'lg') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-400" style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.6))' }} />
            <span className={`text-sm font-semibold text-red-400 ${styles.statNumber}`}
              style={{ textShadow: '0 0 8px rgba(248,113,113,0.5)' }}>
              {bossName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <span className="text-xs text-emerald-400 font-bold" style={{ textShadow: '0 0 6px rgba(52,211,153,0.6)' }}>
                ✓ 已击败
              </span>
            ) : (
              <span className={`text-sm font-bold ${styles.statNumber}`} style={{ color: hpColor }}>
                {animatedHp}%
              </span>
            )}
          </div>
        </div>

        {/* 大型血量条 */}
        <div className="relative">
          <div className={styles.bossHpBar} style={{ height: '18px', borderRadius: '8px' }}>
            {/* 背景分段刻度 */}
            {[25, 50, 75].map(tick => (
              <div
                key={tick}
                className="absolute top-0 bottom-0 w-px bg-black/20 z-10"
                style={{ left: `${tick}%` }}
              />
            ))}
            {isCompleted ? (
              <div
                className="h-full rounded-lg transition-all duration-1000"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #059669, #34d399)',
                  boxShadow: '0 0 12px rgba(52,211,153,0.4)',
                }}
              />
            ) : (
              <div
                className={styles.bossHpFill}
                style={{
                  width: `${animatedHp}%`,
                  background: `linear-gradient(90deg, #991b1b, ${hpColor})`,
                  boxShadow: `0 0 10px ${hpColor}60`,
                  borderRadius: '8px',
                }}
              />
            )}
          </div>
          {/* 血量刻度标签 */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[9px] text-slate-500 font-mono">0</span>
            <span className="text-[9px] text-slate-500 font-mono">BOSS HP</span>
            <span className="text-[9px] text-slate-500 font-mono">100</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skull className="w-3 h-3 text-red-400/80" />
          <span className="text-[11px] text-red-400/80 truncate max-w-[140px]">{bossName}</span>
        </div>
        {isCompleted ? (
          <span className="text-[10px] text-emerald-400 font-semibold">击败 ✓</span>
        ) : (
          <span className={`text-[11px] font-bold ${styles.statNumber}`} style={{ color: hpColor }}>
            {animatedHp}%
          </span>
        )}
      </div>
      <div className={styles.bossHpBar}>
        {isCompleted ? (
          <div className="h-full rounded-md" style={{ width: '100%', background: 'linear-gradient(90deg, #059669, #34d399)', boxShadow: '0 0 6px rgba(52,211,153,0.5)' }} />
        ) : (
          <div
            className={styles.bossHpFill}
            style={{
              width: `${animatedHp}%`,
              background: `linear-gradient(90deg, #991b1b, ${hpColor})`,
              boxShadow: `0 0 6px ${hpColor}50`,
            }}
          />
        )}
      </div>
    </div>
  )
}
