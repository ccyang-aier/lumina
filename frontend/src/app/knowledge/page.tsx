"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Check, Filter, X, ChevronRight, BookOpen, Layers } from "lucide-react"

import { FlickeringGrid } from "@/components/magicui/flickering-grid"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { KnowledgeCard, KnowledgeCardProps } from "@/components/knowledge/KnowledgeCard"
import { MOCK_CARDS } from "@/lib/knowledge-data"

const ITEMS_PER_PAGE = 5


const KNOWLEDGE_DOMAINS = [
  { id: "all", label: "全部", count: 128 },
  { id: "ai", label: "人工智能", count: 42 },
  { id: "eng", label: "工程技术", count: 35 },
  { id: "product", label: "产品设计", count: 20 },
  { id: "data", label: "数据分析", count: 15 },
  { id: "security", label: "信息安全", count: 8 },
  { id: "management", label: "管理运营", count: 8 },
]

const SOURCE_COLORS: Record<string, string> = {
  tech_dept: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  design_dept: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
  ops_dept: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  adventure_guild: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  mage_tower: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  archive: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
}

const SOURCES = [
  { id: "tech_dept", label: "技术部" },
  { id: "design_dept", label: "设计部" },
  { id: "ops_dept", label: "运营部" },
  { id: "adventure_guild", label: "冒险家公会" },
  { id: "mage_tower", label: "法师塔" },
  { id: "archive", label: "大书库" },
]


const SERIES_RECOMMENDATIONS = [
  { id: 1, title: "前端工程化进阶之路", count: 12, level: "Advanced" },
  { id: 2, title: "AI 大模型应用开发实战", count: 8, level: "Intermediate" },
  { id: 3, title: "Web3 DApp 开发从入门到精通", count: 15, level: "Beginner" },
  { id: 4, title: "系统架构设计模式精粹", count: 20, level: "Expert" },
  { id: 5, title: "产品经理必修课", count: 10, level: "Beginner" },
]

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const { theme, resolvedTheme } = useTheme()
  const [gridColor, setGridColor] = useState("#6B7280")

  // Update grid color based on theme
  useEffect(() => {
    if (resolvedTheme === "dark") {
      setGridColor("#FFFFFF") // White for dark mode
    } else {
      setGridColor("#6B7280") // Gray for light mode
    }
  }, [resolvedTheme])

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    )
  }

  const clearSources = () => setSelectedSources([])

  const filteredCards = MOCK_CARDS.filter((card) => {
    if (activeTab === "all") return true
    const domain = KNOWLEDGE_DOMAINS.find((d) => d.id === activeTab)
    return card.domain === domain?.label
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE)
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, selectedSources])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section with Flickering Grid */}
      <div className="relative w-full overflow-hidden border-b bg-background">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <FlickeringGrid
            className="w-full h-full"
            squareSize={4}
            gridGap={6}
            color={gridColor}
            maxOpacity={resolvedTheme === "dark" ? 0.25 : 0.15}
            flickerChance={0.1}
          />
          {/* Gradient overlay for better text readability and fade out at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-orbitron">
              知识图鉴
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              探索、收藏与分享，构建你的专属知识宇宙。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filters & Cards (span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Filters Section */}
            <div className="flex flex-col gap-4">
              {/* Primary Domain Filter (Tabs) */}
              <div className="flex flex-wrap gap-2">
                {KNOWLEDGE_DOMAINS.map((domain) => {
                  const isActive = activeTab === domain.id
                  const activeClass = "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white shadow-md shadow-zinc-500/20"
                  
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setActiveTab(domain.id)}
                      className={cn(
                        "group inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 border cursor-pointer",
                        isActive
                          ? activeClass
                          : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {domain.label}
                      <span className={cn(
                        "ml-1.5 opacity-60 text-[10px]",
                        isActive ? "text-white/80 dark:text-black/80" : "text-muted-foreground"
                      )}>
                        {domain.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Secondary Source Filter (Multi-select) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>来源:</span>
                  <span className="text-[10px] text-muted-foreground/60 font-normal ml-0.5">
                    ({filteredCards.length})
                  </span>
                </div>
                
                {SOURCES.map((source) => {
                  const isSelected = selectedSources.includes(source.id)
                  const activeClass = SOURCE_COLORS[source.id] || "bg-zinc-100 text-zinc-900 border-zinc-200"

                  return (
                    <button
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border transition-all duration-200 cursor-pointer",
                        isSelected
                          ? activeClass
                          : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                      {source.label}
                    </button>
                  )
                })}

                {selectedSources.length > 0 && (
                  <button
                    onClick={clearSources}
                    className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    清除
                  </button>
                )}
              </div>
            </div>

            {/* Knowledge Cards List */}
            <div className="flex flex-col gap-4">
              {paginatedCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                >
                  <KnowledgeCard {...(card as KnowledgeCardProps)} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(i + 1)
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (span 4) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Series Recommendations */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    精选系列
                 </h3>
                 <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:cursor-pointer">
                    查看全部 <ChevronRight className="w-3 h-3 ml-1" />
                 </Button>
              </div>
              
              <div className="space-y-1">
                 {SERIES_RECOMMENDATIONS.map((series, idx) => (
                    <div key={series.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                       <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground transition-colors">
                             {idx + 1}
                          </span>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-foreground transition-colors">{series.title}</span>
                             <span className="text-[10px] text-muted-foreground">{series.count} 篇文章 · {series.level}</span>
                          </div>
                       </div>
                       <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-foreground/50" />
                    </div>
                 ))}
              </div>
            </div>

            {/* Popular Tags / Topics */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                 <BookOpen className="w-4 h-4" />
                 热门话题
              </h3>
              <div className="flex flex-wrap gap-2">
                 {["React", "Next.js", "AI Agent", "Rust", "WebAssembly", "System Design", "DevOps", "Microservices"].map(tag => (
                    <motion.span
                       key={tag}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-colors"
                    >
                       #{tag}
                    </motion.span>
                 ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
