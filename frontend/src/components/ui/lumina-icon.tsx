import * as React from "react"
import { cn } from "@/lib/utils"

export interface LuminaIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function LuminaIcon({ className, ...props }: LuminaIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground dark:text-white", className)}
      {...props}
    >
      {/* Left Shape: The Chevron < */}
      <path 
        d="M16 6L6 16L16 26" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="butt" 
        strokeLinejoin="miter"
      />
      
      {/* Right Top Shape: The Hook ^ */}
      <path 
        d="M21 16L26 11L31 16" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="butt" 
        strokeLinejoin="miter"
      />
      
      {/* Right Bottom Shape: The Dot */}
      <rect 
        x="20.5" 
        y="20.5" 
        width="5" 
        height="5" 
        transform="rotate(45 23 23)"
        fill="#9C2856"
      />
    </svg>
  )
}
