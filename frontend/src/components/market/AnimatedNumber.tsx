"use client"

import { useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedNumberProps {
  value: number
  className?: string
  formatter?: (v: number) => string
  initialValue?: number
}

export function AnimatedNumber({
  value,
  className,
  formatter,
  initialValue = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isFirst = useRef(true)
  const motionValue = useMotionValue(initialValue)
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 120 })

  const fmt = (v: number) =>
    formatter ? formatter(Math.round(v)) : Math.round(v).toLocaleString("zh-CN")

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = fmt(latest)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue])

  useEffect(() => {
    if (isFirst.current) {
      // CountUp on first mount
      motionValue.set(initialValue)
      const t = setTimeout(() => motionValue.set(value), 120)
      isFirst.current = false
      return () => clearTimeout(t)
    } else {
      motionValue.set(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {fmt(initialValue)}
    </span>
  )
}
