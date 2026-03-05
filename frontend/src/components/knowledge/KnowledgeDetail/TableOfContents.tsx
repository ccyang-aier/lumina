"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List } from "lucide-react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentId?: string
}

export function TableOfContents({ contentId = "markdown-content" }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const activeIdRef = useRef<string>("")

  // Extract headings from rendered markdown
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20 // Try for 2 seconds (20 * 100ms)

    const findAndParseHeadings = () => {
      const contentEl = document.getElementById(contentId)
      
      if (!contentEl) {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(findAndParseHeadings, 100)
        }
        return
      }

      const headings = Array.from(
        contentEl.querySelectorAll("h1, h2, h3, h4")
      ) as HTMLElement[]

      const tocItems: TocItem[] = headings.map((heading) => ({
        id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "",
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      }))

      // Ensure headings have IDs
      headings.forEach((heading, i) => {
        if (!heading.id && tocItems[i]?.id) {
          heading.id = tocItems[i].id
        }
      })

      setItems(tocItems.filter((item) => item.id && item.text))
      setIsVisible(tocItems.length > 0)
    }

    findAndParseHeadings()
  }, [contentId])

  // Intersection Observer for scroll spy
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const visibleEntries = entries.filter((e) => e.isIntersecting)
    if (visibleEntries.length > 0) {
      // Pick the topmost visible heading
      const sorted = visibleEntries.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      )
      const newId = sorted[0].target.id
      if (newId !== activeIdRef.current) {
        activeIdRef.current = newId
        setActiveId(newId)
      }
    }
  }, [])

  useEffect(() => {
    if (items.length === 0) return

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    })

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items, handleIntersect])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (!isVisible || items.length === 0) return null

  return (
    <div className="w-full">
      {/* TOC Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <List className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          目录
        </span>
      </div>

      {/* TOC Items */}
      <nav className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border/60" />

        <ul className="space-y-0.5 pl-0">
          <AnimatePresence>
            {items.map((item, idx) => {
              const isActive = activeId === item.id
              const indent = (item.level - 2) * 10

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={cn(
                      "cursor-pointer group relative w-full text-left flex items-start gap-2 pl-3 py-1.5 text-xs transition-all duration-200 rounded-r-sm",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-muted-foreground/70 hover:text-emerald-600 dark:hover:text-emerald-400"
                    )}
                    style={{ paddingLeft: `${12 + indent}px` }}
                  >
                    {/* Active indicator on the line */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-px bg-emerald-500"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "70%", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Dot indicator */}
                    <span className={cn(
                      "flex-shrink-0 mt-1.5 w-1 h-1 rounded-full transition-all duration-200",
                      isActive
                        ? "bg-emerald-500 scale-125"
                        : "bg-border group-hover:bg-emerald-500"
                    )} />

                    <span className={cn(
                      "leading-relaxed transition-colors",
                      item.level === 2 ? "font-medium text-[11.5px]" : "text-[11px]",
                      isActive ? "text-emerald-600 dark:text-emerald-400" : ""
                    )}>
                      {item.text}
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </nav>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="cursor-pointer mt-5 w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors border border-dashed border-border/50 rounded-lg hover:border-border/80"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        ↑ 回到顶部
      </motion.button>
    </div>
  )
}
