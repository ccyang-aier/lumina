import React from 'react'
import styles from './DinoRun.module.css'
import { cn } from '@/lib/utils'

interface DinoRunProps {
  className?: string
}

export function DinoRun({ className }: DinoRunProps) {
  return (
    <div className={cn(styles.dinoLoader, className)}>
      <div className={styles.dinoRunner}></div>
      <div className={styles.dinoObstacle}></div>
      <div className={styles.dinoGround}></div>
    </div>
  )
}
