"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { generateHeatmapData } from "@/lib/honor-data"

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHOW_LABELS = [false, true, false, true, false, true, false] // Mon, Wed, Fri

const SCORE_COLORS_LIGHT = [
  'transparent',
  '#ddd6fe',
  '#a78bfa',
  '#7c3aed',
  '#5b21b6',
]
const SCORE_COLORS_DARK = [
  'transparent',
  '#1e1b4b',
  '#312e81',
  '#4c1d95',
  '#6d28d9',
]

interface TooltipState {
  visible: boolean
  x: number
  y: number
  date: string
  points: number
  details: string
}

export function ContributionHeatmap() {
  const data = useMemo(() => generateHeatmapData(), [])
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, date: '', points: 0, details: '',
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Group flat data into weeks (columns of 7)
  const weeks = useMemo(() => {
    const result: typeof data[number][][] = []
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7))
    }
    return result
  }, [data])

  // Month labels: find the first week where each month appears
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, col) => {
      const firstDayOfWeek = week[0]
      if (!firstDayOfWeek) return
      const month = new Date(firstDayOfWeek.date).getMonth()
      if (month !== lastMonth) {
        const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        labels.push({ label: MONTHS[month], col })
        lastMonth = month
      }
    })
    return labels
  }, [weeks])

  const CELL = 11
  const GAP = 2

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>, day: typeof data[number]) {
    if (!containerRef.current || day.score === 0) return
    const rect = containerRef.current.getBoundingClientRect()
    const cellRect = (e.currentTarget as HTMLElement).getBoundingClientRect()

    let x = cellRect.left - rect.left + CELL / 2
    let y = cellRect.top - rect.top - 8

    // Clamp tooltip within container
    const tooltipW = 240
    if (x + tooltipW / 2 > rect.width) x = rect.width - tooltipW / 2
    if (x - tooltipW / 2 < 0) x = tooltipW / 2

    setTooltip({
      visible: true,
      x,
      y,
      date: day.date,
      points: day.points,
      details: day.details,
    })
  }

  function handleMouseLeave() {
    setTooltip(t => ({ ...t, visible: false }))
  }

  const colors = isDark ? SCORE_COLORS_DARK : SCORE_COLORS_LIGHT

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">贡献热力图</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>少</span>
          {[0, 1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="rounded-sm border border-border/30"
              style={{
                width: 9,
                height: 9,
                background: s === 0 ? 'transparent' : colors[s],
                borderColor: s === 0 ? undefined : colors[s] + '80',
              }}
            />
          ))}
          <span>多</span>
        </div>
      </div>

      <div className="relative overflow-x-auto" ref={containerRef}>
        {/* Month labels */}
        <div className="flex mb-1 pl-8">
          {weeks.map((_, col) => {
            const label = monthLabels.find(m => m.col === col)
            return (
              <div
                key={col}
                style={{ width: CELL + GAP, flexShrink: 0 }}
                className="text-[9px] text-muted-foreground"
              >
                {label?.label}
              </div>
            )
          })}
        </div>

        {/* Grid with day labels */}
        <div className="flex gap-0">
          {/* Day labels column */}
          <div className="flex flex-col pr-2" style={{ gap: GAP }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[9px] text-muted-foreground flex items-center"
                style={{ height: CELL, lineHeight: `${CELL}px` }}
              >
                {SHOW_LABELS[i] ? label : ''}
              </div>
            ))}
          </div>

          {/* Heatmap weeks */}
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, col) => (
              <motion.div
                key={col}
                className="flex flex-col"
                style={{ gap: GAP }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: col * 0.004, duration: 0.3 }}
              >
                {week.map((day, row) => (
                  <div
                    key={day.date}
                    className="rounded-sm cursor-default transition-transform hover:scale-125"
                    style={{
                      width: CELL,
                      height: CELL,
                      background: day.score === 0
                        ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'
                        : colors[day.score],
                      border: day.score > 0 ? `1px solid ${colors[day.score]}80` : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-3 text-xs w-56">
              <div className="font-semibold mb-1 text-foreground">{tooltip.date}</div>
              <div className="text-muted-foreground leading-relaxed">{tooltip.details}</div>
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1" />
          </div>
        )}
      </div>
    </div>
  )
}
