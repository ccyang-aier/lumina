"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterInfo {
  id: number | string
  title: string
  chapter: string
}

interface ChapterNavProps {
  prev?: ChapterInfo
  next?: ChapterInfo
}

function NavCard({
  item,
  direction,
}: {
  item: ChapterInfo
  direction: "prev" | "next"
}) {
  const isPrev = direction === "prev"

  return (
    <Link href={`/knowledge/${item.id}`} className="block group w-full">
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
          "bg-card hover:bg-muted/40 border-border",
          isPrev ? "flex-row" : "flex-row-reverse text-right"
        )}
      >
        {/* Arrow Circle */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
            "bg-background border-border group-hover:border-emerald-500/50 group-hover:text-emerald-600"
          )}
        >
          {isPrev ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
            {isPrev ? "上一章" : "下一章"}
          </div>
          <div className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {item.title}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ChapterNav({ prev, next }: ChapterNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-14 pt-8 border-t border-border/50">
      {/* Section label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-5">
        继续学习
      </p>

      <div
        className={cn(
          "grid gap-4",
          prev && next ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-sm"
        )}
      >
        {prev && <NavCard item={prev} direction="prev" />}
        {next && <NavCard item={next} direction="next" />}
      </div>
    </nav>
  )
}
