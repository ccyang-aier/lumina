"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, Send, Code2, Languages, List, BookOpen, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SelectionInfo } from "./SelectionToolbar"

interface AIQuickPopupProps {
  isOpen: boolean
  onClose: () => void
  selection: SelectionInfo | null
}

const POPUP_WIDTH = 520

// Quick commands configuration
const QUICK_COMMANDS = [
  { id: "explain", label: "解释", icon: BookOpen, prompt: "请解释这段内容：" },
  { id: "summary", label: "摘要", icon: List, prompt: "请为这段内容生成摘要：" },
  { id: "code", label: "转代码", icon: Code2, prompt: "请将这段内容转换为代码：" },
  { id: "translate", label: "翻译", icon: Languages, prompt: "请翻译这段内容：" },
]

// Mock AI response simulation
const mockAIResponse = (selectedText: string, prompt: string): string => {
  if (prompt.includes("解释")) {
    return `这段内容主要讲述了：\n\n"${selectedText.substring(0, 50)}..."\n\n这是一个技术概念的核心说明，涉及到系统设计和数据流向的关键环节。在实际应用中，这种模式可以有效提升系统的可维护性和扩展性。`
  }
  if (prompt.includes("摘要")) {
    return `📝 **摘要**\n\n${selectedText.substring(0, 80)}...\n\n核心要点：\n- 内容聚焦于技术实现\n- 涉及架构设计层面\n- 强调最佳实践`
  }
  if (prompt.includes("代码")) {
    return `\`\`\`typescript
// 基于内容生成的代码示例
const implementation = {
  data: "${selectedText.substring(0, 20)}...",
  process() {
    return this.data.trim();
  }
};
\`\`\``
  }
  if (prompt.includes("翻译")) {
    return `**Translation:**\n\n${selectedText.substring(0, 100)}...\n\n（翻译结果会根据上下文进行专业术语的准确转换）`
  }
  return `针对您选中的内容：\n\n"${selectedText.substring(0, 60)}..."\n\n我已为您分析完成。这是AI模拟的回复内容，实际应用中会接入真实的AI模型进行响应。`
}

export function AIQuickPopup({ isOpen, onClose, selection }: AIQuickPopupProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiResponse, setAiResponse] = React.useState("")
  const [streamingText, setStreamingText] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const responseRef = React.useRef<HTMLDivElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  const resizeTextarea = React.useCallback(() => {
    const textarea = inputRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    textarea.style.overflowY = textarea.scrollHeight > 120 ? "auto" : "hidden"
  }, [])

  // Calculate position based on selection
  React.useEffect(() => {
    if (isOpen && selection) {
      const gap = 12

      let left = selection.rect.left + selection.rect.width / 2 - POPUP_WIDTH / 2
      let top = selection.rect.bottom + gap

      // Boundary checks
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 16) left = 16
      if (left + POPUP_WIDTH > viewportWidth - 16) {
        left = viewportWidth - POPUP_WIDTH - 16
      }

      // 如果下方空间不足，尝试计算上方位置
      if (top + 300 > viewportHeight - 16) {
        // 计算需要的总高度
        const responseHeight = (streamingText || aiResponse) ? 200 : 0
        const inputHeight = 44
        const commandsHeight = QUICK_COMMANDS.length * 40 + 12
        const totalHeight = responseHeight + inputHeight + commandsHeight + 24 // 加上间距
        
        top = selection.rect.top - totalHeight - gap
      }

      if (top < 16) top = 16

      setPosition({ top, left })
    }
  }, [isOpen, selection, streamingText, aiResponse])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen) {
      resizeTextarea()
    }
  }, [isOpen, inputValue, resizeTextarea])

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setInputValue("")
      setAiResponse("")
      setStreamingText("")
      setIsGenerating(false)
      if (inputRef.current) {
        inputRef.current.style.height = "44px"
        inputRef.current.style.overflowY = "hidden"
      }
    }
  }, [isOpen])

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // Simulate streaming response
  const simulateStreaming = (fullResponse: string) => {
    setIsGenerating(true)
    setAiResponse("")
    setStreamingText("")
    
    let currentIndex = 0
    const chars = fullResponse.split("")
    
    const interval = setInterval(() => {
      if (currentIndex < chars.length) {
        setStreamingText(prev => prev + chars[currentIndex])
        currentIndex++
        
        if (responseRef.current) {
          responseRef.current.scrollTop = responseRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setAiResponse(fullResponse)
        setStreamingText("")
        setIsGenerating(false)
      }
    }, 20)
  }

  const handleQuickCommand = (command: typeof QUICK_COMMANDS[0]) => {
    const fullPrompt = command.prompt + "\n\n" + (selection?.text || "")
    setInputValue(fullPrompt)
    
    setTimeout(() => {
      handleSubmit(fullPrompt)
    }, 100)
  }

  const handleSubmit = (text?: string) => {
    const query = text || inputValue.trim()
    if (!query) return
    
    const selectedText = selection?.text || ""
    const response = mockAIResponse(selectedText, query)
    simulateStreaming(response)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen || !selection) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 10000,
          }}
          className="select-none flex flex-col"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-[520px] max-w-[calc(100vw-32px)] flex flex-col">
            
            {/* 1. AI回复区域 - 最上方（在DOM中最先渲染） */}
            {(streamingText || aiResponse) && (
              <div className="mb-3">
                <div 
                  ref={responseRef}
                  className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 p-4 max-h-[200px] overflow-y-auto text-sm leading-relaxed"
                >
                  {isGenerating && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      AI 正在思考...
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {streamingText || aiResponse}
                    {isGenerating && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-foreground animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* 2. 输入框 - 中间 */}
            <div className="relative flex items-center bg-muted/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="向AI助手提问..."
                disabled={isGenerating}
                rows={1}
                className={cn(
                  "flex-1 min-h-[44px] max-h-[120px] text-sm resize-none",
                  "bg-transparent px-4 py-3 pr-28 overflow-y-hidden",
                  "focus:outline-none",
                  "disabled:opacity-50"
                )}
                style={{ lineHeight: '20px' }}
              />
              
              {/* Send Button */}
              <button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isGenerating}
                className={cn(
                  "absolute top-1/2 right-12 -translate-y-1/2 w-8 h-8 rounded-lg",
                  "bg-emerald-500 text-white",
                  "hover:bg-emerald-600 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                  "flex items-center justify-center"
                )}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
              
              <button
                onClick={onClose}
                className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3. 快捷指令 - 最下方 */}
            <div className="mt-3 ml-1">
              <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 py-1.5 w-auto">
                {QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleQuickCommand(cmd)}
                    disabled={isGenerating}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-4 py-2 text-sm",
                      "text-foreground/80 hover:bg-muted hover:text-foreground",
                      "transition-colors text-left",
                      "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    )}
                  >
                    <cmd.icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
