"use client"

import { RARITY_CONFIG, type RarityType } from '@/lib/expedition-data'
import styles from './expedition.module.css'

interface RarityBadgeProps {
  rarity: RarityType
  size?: 'sm' | 'md'
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  const cfg = RARITY_CONFIG[rarity]
  const isLarge = size === 'md'

  return (
    <span
      className={styles.rarityBadge}
      style={{
        background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}15)`,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontSize: isLarge ? '10px' : '9px',
        padding: isLarge ? '2px 10px' : '1px 8px',
        textShadow: `0 0 8px ${cfg.color}80`,
      }}
    >
      <span style={{ fontSize: isLarge ? '11px' : '10px' }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
