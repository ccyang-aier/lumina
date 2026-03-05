"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  expiresAt: Date
  className?: string
}

interface TimeLeft {
  text: string
  isUrgent: boolean
}

function calcTimeLeft(expiresAt: Date): TimeLeft | null {
  const diff = expiresAt.getTime() - Date.now()
  if (diff <= 0) return null

  const totalHours = Math.floor(diff / (1000 * 3600))
  const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  const isUrgent = totalHours < 24

  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24)
    const remHours = totalHours % 24
    return {
      text: `${days}天${remHours}小时`,
      isUrgent: false,
    }
  }

  return {
    text: `${String(totalHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    isUrgent,
  }
}

export function CountdownTimer({ expiresAt, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calcTimeLeft(expiresAt))
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(expiresAt))
    }, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  if (!timeLeft) {
    return <span className={cn("text-xs text-muted-foreground", className)}>已结束</span>
  }

  return (
    <span
      className={cn(
        "text-xs font-mono font-semibold",
        timeLeft.isUrgent
          ? "text-red-500"
          : "text-orange-500",
        className,
      )}
    >
      {timeLeft.text}
    </span>
  )
}
