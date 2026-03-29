"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Eye,
  Send,
  ImagePlus,
  X,
  FileText,
  BookOpen,
  MessageCircleQuestion,
  Coffee,
  Terminal,
  Sparkles,
  Plus,
  Loader2,
  Settings2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MarkdownEditor } from "@/components/publish/MarkdownEditor"

// Knowledge card types
const CARD_TYPES = [
  { id: "document", label: "文档", icon: FileText },
  { id: "tutorial", label: "教程", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { id: "talk", label: "杂谈", icon: Coffee },
  { id: "script", label: "脚本", icon: Terminal },
]

// Knowledge domains
const DOMAINS = [
  "人工智能", "工程技术", "产品设计", "数据分析", "信息安全", "管理运营", "前端开发", "后端开发", "其他"
]

// Popular tags
const SUGGESTED_TAGS = [
  "React", "TypeScript", "Python", "AI", "架构设计", "最佳实践", "入门教程", "进阶指南", "性能优化"
]

interface FormData {
  title: string
  coverImage: string | null
  type: string
  domain: string
  tags: string[]
  content: string
}

const initialFormData: FormData = {
  title: "",
  coverImage: null,
  type: "document",
  domain: "",
  tags: [],
  content: "",
}

// Success Toast Component
function SuccessToast({ show, onClose }: { show: boolean; onClose: () => void }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
    >
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">发布成功！正在跳转...</span>
    </motion.div>
  )
}

export default function PublishPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [showSettings, setShowSettings] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle cover image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        coverImage: event.target?.result as string,
      }))
    }
    reader.readAsDataURL(file)
  }, [])

  // Handle tag management
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim()
    if (!trimmedTag || formData.tags.includes(trimmedTag)) return
    if (formData.tags.length >= 5) return
    
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }))
    setTagInput("")
  }, [formData.tags])

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim()) {
      alert("请输入知识卡标题")
      return
    }
    if (!formData.content.trim()) {
      alert("请输入知识卡内容")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    // Show success message
    setShowSuccess(true)
    
    // Wait a moment then navigate
    setTimeout(() => {
      router.push("/knowledge/1000")
    }, 1500)
  }, [formData, router])

  // Handle preview
  const handlePreview = useCallback(() => {
    sessionStorage.setItem("lumina_preview", JSON.stringify(formData))
    window.open("/knowledge/1000", "_blank")
  }, [formData])

  return (
    <div className="min-h-screen bg-background">
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Back button & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">返回</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold">发布知识卡</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">预览</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer shadow-md shadow-emerald-500/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">发布</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          {/* Title Input */}
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="输入知识卡标题..."
            className={cn(
              "w-full text-xl sm:text-2xl font-bold bg-transparent border-none outline-none",
              "placeholder:text-muted-foreground/40",
              "focus:ring-0"
            )}
          />

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer w-fit",
              "border border-border",
              showSettings 
                ? "bg-muted/50 text-foreground" 
                : "hover:bg-muted/50 text-muted-foreground"
            )}
          >
            <Settings2 className="w-4 h-4" />
            <span>设置</span>
            {showSettings ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Collapsible Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 rounded-xl border border-border bg-muted/20">
                  {/* Left Column: Cover Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">封面图</label>
                    <div className="relative group">
                      {formData.coverImage ? (
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border">
                          <img
                            src={formData.coverImage}
                            alt="封面图"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setFormData((prev) => ({ ...prev, coverImage: null }))}
                              className="gap-2 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              移除封面
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "w-full aspect-[16/9] rounded-xl border-2 border-dashed border-border",
                            "flex flex-col items-center justify-center gap-2",
                            "text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/30",
                            "transition-all cursor-pointer"
                          )}
                        >
                          <ImagePlus className="w-8 h-8" />
                          <span className="text-sm font-medium">添加封面图</span>
                          <span className="text-xs text-muted-foreground">建议比例 16:9</span>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Right Column: Type, Domain, Tags */}
                  <div className="flex flex-col gap-5">
                    {/* Type Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">类型</label>
                      <div className="flex flex-wrap gap-2">
                        {CARD_TYPES.map((type) => {
                          const Icon = type.icon
                          const isSelected = formData.type === type.id
                          return (
                            <button
                              key={type.id}
                              onClick={() => setFormData((prev) => ({ ...prev, type: type.id }))}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                                isSelected
                                  ? "bg-foreground text-background border-foreground"
                                  : "border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Domain Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">领域</label>
                      <div className="flex flex-wrap gap-2">
                        {DOMAINS.map((domain) => {
                          const isSelected = formData.domain === domain
                          return (
                            <button
                              key={domain}
                              onClick={() => setFormData((prev) => ({ 
                                ...prev, 
                                domain: isSelected ? "" : domain 
                              }))}
                              className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer border",
                                isSelected
                                  ? "bg-foreground text-background border-foreground"
                                  : "border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              {domain}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        标签
                        <span className="text-xs text-muted-foreground font-normal ml-2">最多5个</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-muted text-foreground border border-border"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-destructive transition-colors cursor-pointer ml-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                        {formData.tags.length < 5 && (
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addTag(tagInput)
                              }
                            }}
                            placeholder="输入标签后回车"
                            className="h-8 px-3 rounded-lg text-sm bg-background border border-border outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 transition-colors w-32"
                          />
                        )}
                      </div>
                      {/* Suggested Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs text-muted-foreground">推荐：</span>
                        {SUGGESTED_TAGS.filter((t) => !formData.tags.includes(t)).slice(0, 5).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          >
                            +{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Markdown Editor - Main Focus */}
          <MarkdownEditor
            value={formData.content}
            onChange={(value: string) => setFormData((prev) => ({ ...prev, content: value }))}
            placeholder="开始编写你的知识卡内容...&#10;&#10;支持 Markdown 语法：标题、粗体、斜体、代码块、引用、表格、列表、图片、链接等"
            height="calc(100vh - 300px)"
          />
        </div>
      </main>
    </div>
  )
}
