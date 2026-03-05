"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

type MeteorStyle = {
  ["--angle"]: string
  top: string
  left: string
  animationDelay: string
  animationDuration: string
  color: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<MeteorStyle[]>([])

  useEffect(() => {
    const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"];
    const styles = [...new Array(number)].map(() => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        "--angle": -angle + "deg",
        top: "-5%",
        left: Math.floor(Math.random() * 120) + "%",
        animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
        animationDuration: Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
        color: color
      };
    })
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        <span
          key={idx}
          style={{
            "--angle": style["--angle"],
            top: style.top,
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
            backgroundColor: style.color,
            boxShadow: `0 0 0 1px ${style.color}`
          } as React.CSSProperties}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-[var(--angle)] rounded-full",
            className
          )}
        >
          <div 
            className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2" 
            style={{ backgroundImage: `linear-gradient(to right, ${style.color}, transparent)` }}
          />
        </span>
      ))}
    </>
  )
}
