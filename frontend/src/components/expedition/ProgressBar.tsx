"use client"

import { useEffect, useState } from 'react'
import { RARITY_CONFIG, type RarityType } from '@/lib/expedition-data'
import styles from './expedition.module.css'

interface ProgressBarProps {
  progress: number
  rarity: RarityType
  showLabel?: boolean
  height?: number
}

export function ProgressBar({ progress, rarity, showLabel = true, height = 8 }: ProgressBarProps) {
  const [animated, setAnimated] = useState(0)
  const cfg = RARITY_CONFIG[rarity]

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(progress), 400)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">任务进度</span>
          <span
            className={`text-[11px] font-bold ${styles.statNumber}`}
            style={{ color: cfg.color, textShadow: `0 0 6px ${cfg.color}60` }}
          >
            {animated}%
          </span>
        </div>
      )}
      <div className={styles.progressBar} style={{ height: `${height}px` }}>
        <div
          className={styles.progressFill}
          style={{
            width: `${animated}%`,
            background: cfg.gradient,
            boxShadow: `0 0 8px ${cfg.color}50`,
            height: `${height}px`,
          }}
        />
      </div>
    </div>
  )
}
