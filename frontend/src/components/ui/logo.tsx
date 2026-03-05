"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LuminaIcon } from "@/components/ui/lumina-icon"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean
  iconSize?: number
  iconClassName?: string
  textClassName?: string
}

export function Logo({ 
  className, 
  showText = true, 
  iconSize = 26, 
  iconClassName,
  textClassName,
  ...props 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)} {...props}>
      <div 
        className={cn("relative flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]", iconClassName)} 
        style={{ width: iconSize, height: iconSize }}
      >
        <LuminaIcon className="w-full h-full relative z-10" />
      </div>
      
      {showText && (
        <span 
          className={cn(
            // Base styles
            "text-2xl font-orbitron font-bold tracking-tight mx-0 max-w-none cursor-pointer",
            
            // Text Color & Background Clip
            // We use transparent text with background clip to show the gradient
            "text-transparent bg-clip-text bg-no-repeat",
            
            // Gradient Definition
            // Light Mode: Solid Black (start) -> Highly Transparent Black (shine) -> Solid Black (end)
            // We use a 3-stop gradient where the middle is highly transparent for strong contrast
            "bg-[linear-gradient(110deg,#000000_35%,rgba(0,0,0,0.2)_50%,#000000_65%)]",
            
            // Dark Mode: Solid White (start) -> Highly Transparent White (shine) -> Solid White (end)
            "dark:bg-[linear-gradient(110deg,#ffffff_35%,rgba(255,255,255,0.2)_50%,#ffffff_65%)]",
            
            // Background Size
            // 250% width ensures the gradient has enough room to move across the text
            "[background-size:250%_100%]",
            
            // Animation
            // Custom animation defined in globals.css that moves background from right to left
            "animate-logo-shimmer",
            
            textClassName
          )}
        >
          Lumina
        </span>
      )}
    </div>
  )
}
