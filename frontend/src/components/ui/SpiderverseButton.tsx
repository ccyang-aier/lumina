
import React from 'react'
import { cn } from '@/lib/utils'
import styles from './SpiderverseButton.module.css'

interface SpiderverseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SpiderverseButton({ children, className, ...props }: SpiderverseButtonProps) {
  return (
    <div className={cn(styles.buttonWrapper, className)}>
      <button className={styles.spiderverseButton} {...props}>
        {children}
        <div className={styles.glitchLayers}>
          <div className={cn(styles.glitchLayer, styles.layer1)}>{children}</div>
          <div className={cn(styles.glitchLayer, styles.layer2)}>{children}</div>
        </div>
        <div className={styles.noise}></div>
        <div className={styles.glitchSlice}></div>
      </button>
    </div>
  )
}
