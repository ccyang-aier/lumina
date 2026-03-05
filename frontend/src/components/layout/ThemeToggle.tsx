"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

import { Button } from "@/components/ui/button"

export function ThemeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme()
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const toggleTheme = async () => {
    if (
      !document.startViewTransition ||
      !buttonRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(theme === "light" ? "dark" : "light")
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "light" ? "dark" : "light")
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom))

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      ref={buttonRef}
      onClick={toggleTheme}
      className={className}
      {...props}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
