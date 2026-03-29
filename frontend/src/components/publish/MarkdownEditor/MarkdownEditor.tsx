"use client"

import * as React from "react"
import { useCallback, useMemo, useRef, useState, useEffect, useLayoutEffect, useDeferredValue } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit"
import type { Root } from "hast"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/knowledge/KnowledgeDetail/MarkdownRenderer"
import { 
  Eye, 
  Code2, 
  Columns, 
  Maximize2, 
  Minimize2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  ImageIcon,
  Table,
  Minus,
  CheckSquare,
  ChevronDown,
  Upload,
  X,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  previewClassName?: string
  height?: string | number
}

// Custom rehype plugin
const attachRawCode = () => (tree: Root) => {
  visit(tree, (node) => {
    if (node.type !== "element" || node.tagName !== "pre") return
    const codeEl = node.children[0]
    if (codeEl?.type === "element" && codeEl.tagName === "code" && codeEl.data) {
      const rawCode = codeEl.data.meta
      if (rawCode && typeof rawCode === "string") {
        node.properties = node.properties || {}
        node.properties["data-raw-code"] = encodeURIComponent(rawCode)
      }
    }
  })
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark-dimmed" },
      defaultLang: "plaintext",
    })
    .use(attachRawCode)
    .use(rehypeStringify, { allowDangerousHtml: true })

  const file = await processor.process(markdown)
  return String(file)
}

type EditorMode = "edit" | "preview" | "split"

// Content block types
interface TextBlock {
  type: 'text'
  content: string
  lineStart: number
  lineEnd: number
}

interface ImageBlock {
  type: 'image'
  alt: string
  url: string
  lineStart: number
  lineEnd: number
}

interface TableBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
  lineStart: number
  lineEnd: number
}

type ContentBlock = TextBlock | ImageBlock | TableBlock

interface PendingCursor {
  absoluteIndex: number
  absoluteEnd?: number
  prefer?: "nearest" | "previous"
  preserveScrollTop?: number
  reveal?: boolean
}

interface ActiveSelection {
  lineStart: number
  selectionStart: number
  selectionEnd: number
}

interface TableEditorState {
  block?: TableBlock
  initialData?: { headers: string[]; rows: string[][] }
}

interface ImageEditorState {
  block?: ImageBlock
  alt: string
  url: string
}

// Parse content into blocks
function parseContent(markdown: string): ContentBlock[] {
  if (markdown.length === 0) {
    return [
      {
        type: 'text',
        content: '',
        lineStart: 0,
        lineEnd: 0,
      },
    ]
  }

  const lines = markdown.split('\n')
  const blocks: ContentBlock[] = []
  let currentTextLines: string[] = []
  let currentTextStart = 0

  const flushText = () => {
    if (currentTextLines.length > 0) {
      blocks.push({
        type: 'text',
        content: currentTextLines.join('\n'),
        lineStart: currentTextStart,
        lineEnd: currentTextStart + currentTextLines.length - 1,
      })
      currentTextLines = []
    }
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Check for standalone image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      flushText()
      blocks.push({
        type: 'image',
        alt: imgMatch[1],
        url: imgMatch[2],
        lineStart: i,
        lineEnd: i,
      })
      i++
      currentTextStart = i
      continue
    }

    // Check for table
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())) {
      flushText()
      const startLine = i
      const headerLine = line.trim()
      const headers = headerLine.split('|').filter(c => c.trim()).map(c => c.trim())
      const rows: string[][] = []

      i += 2
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim().split('|').filter(c => c.trim()).map(c => c.trim()))
        i++
      }

      blocks.push({
        type: 'table',
        headers,
        rows,
        lineStart: startLine,
        lineEnd: i - 1,
      })
      currentTextStart = i
      continue
    }

    currentTextLines.push(line)
    i++
  }

  flushText()
  return blocks
}

function createStandaloneInsertion(text: string, selectionStart: number, selectionEnd: number, markdown: string) {
  const beforeText = text.slice(0, selectionStart)
  const afterText = text.slice(selectionEnd)
  const prefix = beforeText.length > 0 && !beforeText.endsWith('\n') ? '\n' : ''
  const suffix = afterText.startsWith('\n') ? '' : '\n'
  const inserted = `${prefix}${markdown}${suffix}`
  const nextText = `${beforeText}${inserted}${afterText}`
  const caretIndex = beforeText.length + inserted.length
  const lineOffset = nextText.slice(0, caretIndex).split('\n').length - 1
  const focusPreference: PendingCursor["prefer"] = afterText.length > 0 ? "nearest" : "previous"

  return {
    nextText,
    caretIndex,
    focusLineOffset: lineOffset,
    focusPreference,
  }
}

// Table Editor Modal
function TableEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (markdown: string) => void
  initialData?: { headers: string[]; rows: string[][] }
}) {
  const [headers, setHeaders] = useState<string[]>(['列1', '列2', '列3'])
  const [rows, setRows] = useState<string[][]>([['', '', '']])

  useEffect(() => {
    if (initialData) {
      setHeaders(initialData.headers.length > 0 ? initialData.headers : ['列1', '列2', '列3'])
      setRows(initialData.rows.length > 0 ? initialData.rows : [['', '', '']])
    } else {
      setHeaders(['列1', '列2', '列3'])
      setRows([['', '', '']])
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const addColumn = () => {
    setHeaders([...headers, `列${headers.length + 1}`])
    setRows(rows.map(row => [...row, '']))
  }

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill('')])
  }

  const updateHeader = (i: number, value: string) => {
    const newHeaders = [...headers]
    newHeaders[i] = value
    setHeaders(newHeaders)
  }

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = [...rows]
    newRows[rowIdx][colIdx] = value
    setRows(newRows)
  }

  const removeColumn = (i: number) => {
    if (headers.length <= 1) return
    setHeaders(headers.filter((_, idx) => idx !== i))
    setRows(rows.map(row => row.filter((_, idx) => idx !== i)))
  }

  const removeRow = (i: number) => {
    if (rows.length <= 1) return
    setRows(rows.filter((_, idx) => idx !== i))
  }

  const handleSave = () => {
    const headerLine = `| ${headers.join(' | ')} |`
    const separator = `| ${headers.map(() => '---').join(' | ')} |`
    const rowLines = rows.map(row => `| ${row.join(' | ')} |`)
    const markdown = [headerLine, separator, ...rowLines].join('\n')
    onSave(markdown)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold">编辑表格</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="border border-border p-1 relative">
                      <Input
                        value={h}
                        onChange={(e) => updateHeader(i, e.target.value)}
                        className="border-none bg-transparent h-8 text-center"
                      />
                      <button
                        onClick={() => removeColumn(i)}
                        className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:bg-destructive/80 cursor-pointer"
                      >
                        ×
                      </button>
                    </th>
                  ))}
                  <th className="w-10 p-1">
                    <Button variant="ghost" size="sm" onClick={addColumn} className="cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td key={colIdx} className="border border-border p-1">
                        <Input
                          value={cell}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          className="border-none bg-transparent h-8"
                          placeholder="..."
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(rowIdx)}
                        className="text-destructive hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button variant="outline" size="sm" onClick={addRow} className="mt-2 cursor-pointer">
            <Plus className="w-4 h-4 mr-1" />
            添加行
          </Button>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">取消</Button>
          <Button onClick={handleSave} className="cursor-pointer">确定</Button>
        </div>
      </div>
    </div>
  )
}

function ImageEditorModal({
  state,
  isOpen,
  onClose,
  onSave,
}: {
  state: ImageEditorState | null
  isOpen: boolean
  onClose: () => void
  onSave: (alt: string, url: string) => void
}) {
  const [alt, setAlt] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (!state) return
    setAlt(state.alt)
    setUrl(state.url)
  }, [state])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{state?.block ? "编辑图片" : "插入图片"}</DialogTitle>
          <DialogDescription>
            设置图片地址和描述，保存后将直接更新当前编辑内容。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">图片描述</div>
            <Input
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              placeholder="例如：系统架构图"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">图片地址</div>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/image.png"
            />
          </div>
          {url ? (
            <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
              <div className="aspect-video bg-muted/40">
                <img
                  src={url}
                  alt={alt || "图片预览"}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">取消</Button>
          <Button
            onClick={() => onSave(alt, url)}
            disabled={!url.trim()}
            className="cursor-pointer"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Image Block Component
function ImageBlockComponent({
  block,
  onEdit,
  onRemove,
}: {
  block: ImageBlock
  onEdit: () => void
  onRemove: () => void
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-muted/20 overflow-hidden group shadow-sm">
      <div className="flex items-start gap-3 p-3">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-2">
              加载失败
            </div>
          ) : (
            <>
              {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
              <img
                src={block.url}
                alt={block.alt}
                className={cn(
                  "w-full h-full object-cover transition-opacity",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
              />
            </>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-sm font-medium truncate">{block.alt || '图片'}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {block.url.startsWith('data:') ? '本地图片 (Base64)' : block.url}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Table Block Component
function TableBlockComponent({
  block,
  onEdit,
  onRemove,
}: {
  block: TableBlock
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-muted/20 overflow-hidden group shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
        <span className="text-xs text-muted-foreground font-medium">
          表格 · {block.headers.length}列 × {block.rows.length}行
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-6 w-6 p-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto p-3">
        <table className="w-max min-w-full text-sm">
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} className="border border-border px-2 py-1 bg-muted/50 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.slice(0, 5).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border border-border px-2 py-1">
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
            {block.rows.length > 5 && (
              <tr>
                <td colSpan={block.headers.length} className="text-center text-muted-foreground text-xs py-2">
                  还有 {block.rows.length - 5} 行...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Text Block Component with editable textarea
function TextBlockComponent({
  content,
  lineStart,
  placeholder,
  isFirstBlock,
  onChange,
  onFocus,
  onSelectionChange,
  onAfterInput,
  onCompositionStart,
  onCompositionEnd,
  onKeyDown,
  registerTextarea,
}: {
  content: string
  lineStart: number
  placeholder: string
  isFirstBlock: boolean
  onChange: (newContent: string) => void
  onFocus: (selectionStart: number, selectionEnd: number) => void
  onSelectionChange: (selectionStart: number, selectionEnd: number) => void
  onAfterInput: (node: HTMLTextAreaElement) => void
  onCompositionStart: () => void
  onCompositionEnd: (selectionStart: number, selectionEnd: number) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  registerTextarea: (lineStart: number, node: HTMLTextAreaElement | null) => void
}) {
  const localTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const resizeTextarea = useCallback((node: HTMLTextAreaElement | null) => {
    if (!node) return
    node.style.height = "0px"
    node.style.height = `${Math.max(node.scrollHeight, 36)}px`
  }, [])

  useLayoutEffect(() => {
    resizeTextarea(localTextareaRef.current)
  }, [content, resizeTextarea])

  const handleRef = useCallback((node: HTMLTextAreaElement | null) => {
    localTextareaRef.current = node
    registerTextarea(lineStart, node)
    resizeTextarea(node)
  }, [lineStart, registerTextarea, resizeTextarea])

  const syncSelection = useCallback((event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    onSelectionChange(target.selectionStart, target.selectionEnd)
  }, [onSelectionChange])

  return (
    <textarea
      ref={handleRef}
      data-block-line-start={lineStart}
      value={content}
      rows={1}
      onChange={(e) => {
        onChange(e.target.value)
        onSelectionChange(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
        resizeTextarea(e.currentTarget)
        requestAnimationFrame(() => {
          onAfterInput(e.currentTarget)
        })
      }}
      onFocus={(event) => onFocus(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={(event) => {
        onCompositionEnd(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
        requestAnimationFrame(() => {
          onAfterInput(event.currentTarget)
        })
      }}
      onClick={syncSelection}
      onSelect={syncSelection}
      onKeyUp={syncSelection}
      onKeyDown={onKeyDown}
      placeholder={isFirstBlock && !content ? placeholder : ""}
      className={cn(
        "w-full min-h-[36px] resize-none overflow-hidden bg-transparent outline-none",
        "px-0 py-1 font-mono text-sm leading-7",
        "placeholder:text-muted-foreground/50",
      )}
    />
  )
}

export function MarkdownEditor({
  value = "",
  onChange,
  placeholder = "开始编写你的知识卡内容...",
  className,
  previewClassName,
  height = "calc(100vh - 400px)",
}: MarkdownEditorProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [renderedHtml, setRenderedHtml] = useState("")
  const [mode, setMode] = useState<EditorMode>("split")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorScrollRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map())
  const activeTextBlockLineRef = useRef<number | null>(0)
  const activeSelectionRef = useRef<ActiveSelection | null>(null)
  const pendingCursorRef = useRef<PendingCursor | null>(null)
  const isComposingRef = useRef(false)
  const syncingScrollRef = useRef<"editor" | "preview" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tableEditorState, setTableEditorState] = useState<TableEditorState | null>(null)
  const [imageEditorState, setImageEditorState] = useState<ImageEditorState | null>(null)

  const currentValue = onChange ? value : internalValue
  const deferredValue = useDeferredValue(currentValue)

  const blocks = useMemo(() => parseContent(currentValue), [currentValue])
  const textBlocks = useMemo(() => blocks.filter((block): block is TextBlock => block.type === 'text'), [blocks])
  const textBlockMap = useMemo(() => new Map(textBlocks.map((block) => [block.lineStart, block])), [textBlocks])
  const lineStartOffsets = useMemo(() => {
    const lines = currentValue.length === 0 ? [''] : currentValue.split('\n')
    const offsets: number[] = []
    let offset = 0

    lines.forEach((line) => {
      offsets.push(offset)
      offset += line.length + 1
    })

    return offsets
  }, [currentValue])

  useEffect(() => {
    if (mode === "edit") {
      setIsProcessing(false)
      return
    }

    const valueToRender = deferredValue

    const renderMarkdown = async () => {
      if (!valueToRender) {
        setRenderedHtml("")
        return
      }
      setIsProcessing(true)
      try {
        const html = await markdownToHtml(valueToRender)
        setRenderedHtml(html)
      } catch (error) {
        console.error("Error rendering markdown:", error)
        setRenderedHtml("<p>Error rendering markdown</p>")
      } finally {
        setIsProcessing(false)
      }
    }

    const debounceMs = valueToRender.length > 12000 ? 520 : valueToRender.length > 6000 ? 360 : valueToRender.length > 2500 ? 220 : 120
    let isCancelled = false
    let idleHandle: number | null = null

    const debounceTimer = window.setTimeout(() => {
      const schedule = () => {
        if (isCancelled) return
        void renderMarkdown()
      }

      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(schedule, { timeout: debounceMs })
      } else {
        idleHandle = window.setTimeout(schedule, 0)
      }
    }, debounceMs)

    return () => {
      isCancelled = true
      window.clearTimeout(debounceTimer)
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === "function" && typeof window.requestIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle)
        } else {
          window.clearTimeout(idleHandle)
        }
      }
    }
  }, [deferredValue, mode])

  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }, [onChange])

  const updateBlockContent = useCallback((block: ContentBlock, newContent: string) => {
    const lines = currentValue.length === 0 ? [''] : currentValue.split('\n')
    const newLines = newContent.split('\n')
    lines.splice(block.lineStart, block.lineEnd - block.lineStart + 1, ...newLines)
    handleChange(lines.join('\n'))
  }, [currentValue, handleChange])

  const scheduleCursor = useCallback((cursor: PendingCursor) => {
    pendingCursorRef.current = {
      preserveScrollTop: editorScrollRef.current?.scrollTop,
      reveal: false,
      ...cursor,
    }
  }, [])

  const clearPendingCursor = useCallback(() => {
    pendingCursorRef.current = null
  }, [])

  const setActiveSelection = useCallback((lineStart: number, selectionStart: number, selectionEnd: number) => {
    activeTextBlockLineRef.current = lineStart
    activeSelectionRef.current = {
      lineStart,
      selectionStart,
      selectionEnd,
    }
  }, [])

  const getBlockAbsoluteStart = useCallback((lineStart: number) => {
    return lineStartOffsets[lineStart] ?? currentValue.length
  }, [currentValue.length, lineStartOffsets])

  const resolveAbsoluteSelection = useCallback((absoluteIndex: number, prefer: PendingCursor["prefer"] = "nearest") => {
    if (textBlocks.length === 0) {
      return null
    }

    const mappedBlocks = textBlocks.map((block) => {
      const start = getBlockAbsoluteStart(block.lineStart)
      return {
        block,
        start,
        end: start + block.content.length,
      }
    })

    const containing = mappedBlocks.find(({ start, end }) => absoluteIndex >= start && absoluteIndex <= end)
    if (containing) {
      return {
        lineStart: containing.block.lineStart,
        localIndex: absoluteIndex - containing.start,
      }
    }

    const nextBlock = mappedBlocks.find(({ start }) => start > absoluteIndex)
    const previousBlock = [...mappedBlocks].reverse().find(({ end }) => end < absoluteIndex)

    if (prefer === "previous" && previousBlock) {
      return {
        lineStart: previousBlock.block.lineStart,
        localIndex: previousBlock.block.content.length,
      }
    }

    if (nextBlock) {
      return {
        lineStart: nextBlock.block.lineStart,
        localIndex: 0,
      }
    }

    if (previousBlock) {
      return {
        lineStart: previousBlock.block.lineStart,
        localIndex: previousBlock.block.content.length,
      }
    }

    return null
  }, [getBlockAbsoluteStart, textBlocks])

  const registerTextarea = useCallback((lineStart: number, node: HTMLTextAreaElement | null) => {
    if (node) {
      textareaRefs.current.set(lineStart, node)
      return
    }

    textareaRefs.current.delete(lineStart)
  }, [])

  const ensureTextareaVisible = useCallback((textarea: HTMLTextAreaElement) => {
    const editor = editorScrollRef.current
    if (!editor) return

    const editorRect = editor.getBoundingClientRect()
    const textareaRect = textarea.getBoundingClientRect()
    const lineHeight = Number.parseFloat(window.getComputedStyle(textarea).lineHeight) || 28
    const topPadding = lineHeight * 1.25
    const bottomPadding = lineHeight * 1.75

    if (textareaRect.bottom > editorRect.bottom - bottomPadding) {
      editor.scrollTop += textareaRect.bottom - (editorRect.bottom - bottomPadding)
      return
    }

    if (textareaRect.top < editorRect.top + topPadding) {
      editor.scrollTop -= (editorRect.top + topPadding) - textareaRect.top
    }
  }, [])

  const restoreTextareaSelection = useCallback((
    textarea: HTMLTextAreaElement,
    lineStart: number,
    selectionStart: number,
    selectionEnd: number = selectionStart
  ) => {
    requestAnimationFrame(() => {
      try {
        textarea.focus({ preventScroll: true })
      } catch {
        textarea.focus()
      }
      textarea.setSelectionRange(selectionStart, selectionEnd)
      setActiveSelection(lineStart, selectionStart, selectionEnd)
      ensureTextareaVisible(textarea)
    })
  }, [ensureTextareaVisible, setActiveSelection])

  useLayoutEffect(() => {
    const pendingCursor = pendingCursorRef.current
    if (!pendingCursor) return
    pendingCursorRef.current = null

    let cancelled = false

    const attemptFocusRestore = (remainingAttempts: number) => {
      if (cancelled) return

      const resolvedSelection = resolveAbsoluteSelection(pendingCursor.absoluteIndex, pendingCursor.prefer)
      if (!resolvedSelection) {
        return
      }

      const targetTextarea = textareaRefs.current.get(resolvedSelection.lineStart)
      if (!targetTextarea) {
        if (remainingAttempts > 0) {
          requestAnimationFrame(() => attemptFocusRestore(remainingAttempts - 1))
        }
        return
      }

      const selectionEnd = pendingCursor.absoluteEnd ?? pendingCursor.absoluteIndex
      const resolvedEnd = resolveAbsoluteSelection(selectionEnd, pendingCursor.prefer) ?? resolvedSelection
      const clampedStart = Math.min(resolvedSelection.localIndex, targetTextarea.value.length)
      const clampedEnd = Math.min(
        resolvedEnd.lineStart === resolvedSelection.lineStart ? resolvedEnd.localIndex : targetTextarea.value.length,
        targetTextarea.value.length
      )

      requestAnimationFrame(() => {
        if (cancelled) return

        try {
          targetTextarea.focus({ preventScroll: true })
        } catch {
          targetTextarea.focus()
        }
        targetTextarea.setSelectionRange(clampedStart, clampedEnd)
        activeSelectionRef.current = {
          lineStart: resolvedSelection.lineStart,
          selectionStart: clampedStart,
          selectionEnd: clampedEnd,
        }

        if (pendingCursor.reveal) {
          targetTextarea.scrollIntoView({ block: "nearest" })
        } else if (typeof pendingCursor.preserveScrollTop === "number" && editorScrollRef.current) {
          editorScrollRef.current.scrollTop = pendingCursor.preserveScrollTop
        }

        ensureTextareaVisible(targetTextarea)
      })
    }

    attemptFocusRestore(3)

    return () => {
      cancelled = true
    }
  }, [blocks, ensureTextareaVisible, resolveAbsoluteSelection])

  const getActiveTextBlock = useCallback(() => {
    const selection = activeSelectionRef.current
    const activeLineStart = selection?.lineStart ?? activeTextBlockLineRef.current
    if (activeLineStart === null) return null

    const block = textBlockMap.get(activeLineStart)
    const textarea = textareaRefs.current.get(activeLineStart)
    if (!block || !textarea) return null

    const isFocusedTextarea = document.activeElement === textarea

    return {
      block,
      textarea,
      selectionStart: isFocusedTextarea ? textarea.selectionStart : (selection?.selectionStart ?? textarea.selectionStart),
      selectionEnd: isFocusedTextarea ? textarea.selectionEnd : (selection?.selectionEnd ?? textarea.selectionEnd),
    }
  }, [textBlockMap])

  const insertAtDocumentEnd = useCallback((markdown: string) => {
    const prefix = currentValue.length > 0 && !currentValue.endsWith('\n') ? '\n' : ''
    const nextValue = `${currentValue}${prefix}${markdown}\n`
    handleChange(nextValue)
    scheduleCursor({
      absoluteIndex: nextValue.length,
      prefer: "previous",
    })
  }, [currentValue, handleChange, scheduleCursor])

  const removeBlock = useCallback((block: ContentBlock) => {
    const lines = currentValue.length === 0 ? [''] : currentValue.split('\n')
    lines.splice(block.lineStart, block.lineEnd - block.lineStart + 1)
    const nextValue = lines.length > 0 ? lines.join('\n') : ''
    handleChange(nextValue)
    scheduleCursor({
      absoluteIndex: getBlockAbsoluteStart(block.lineStart),
      prefer: "nearest",
    })
  }, [currentValue, getBlockAbsoluteStart, handleChange, scheduleCursor])

  const replaceTextSelection = useCallback((before: string, after: string = "", placeholderText: string = "") => {
    const activeTarget = getActiveTextBlock()

    if (!activeTarget) {
      const fallbackValue = `${currentValue}${before}${placeholderText}${after}`
      handleChange(fallbackValue)
      return
    }

    const { block, textarea } = activeTarget
    const start = activeTarget.selectionStart
    const end = activeTarget.selectionEnd
    const selectedText = textarea.value.slice(start, end) || placeholderText
    const nextText = `${textarea.value.slice(0, start)}${before}${selectedText}${after}${textarea.value.slice(end)}`
    const nextCursor = start + before.length + selectedText.length

    updateBlockContent(block, nextText)
    restoreTextareaSelection(textarea, block.lineStart, nextCursor)
  }, [currentValue, getActiveTextBlock, handleChange, restoreTextareaSelection, updateBlockContent])

  const insertStandaloneMarkdown = useCallback((markdown: string) => {
    const activeTarget = getActiveTextBlock()

    if (!activeTarget) {
      insertAtDocumentEnd(markdown)
      return
    }

    const { block, textarea, selectionStart, selectionEnd } = activeTarget
    const insertion = createStandaloneInsertion(
      textarea.value,
      selectionStart,
      selectionEnd,
      markdown
    )

    updateBlockContent(block, insertion.nextText)
    scheduleCursor({
      absoluteIndex: getBlockAbsoluteStart(block.lineStart) + insertion.caretIndex,
      prefer: insertion.focusPreference,
    })
  }, [getActiveTextBlock, getBlockAbsoluteStart, insertAtDocumentEnd, scheduleCursor, updateBlockContent])

  const replaceBlockWithMarkdown = useCallback((block: ContentBlock, markdown: string) => {
    updateBlockContent(block, markdown)
    scheduleCursor({
      absoluteIndex: getBlockAbsoluteStart(block.lineStart) + markdown.length,
      prefer: "nearest",
    })
  }, [getBlockAbsoluteStart, scheduleCursor, updateBlockContent])

  const openImageEditor = useCallback((block?: ImageBlock) => {
    setImageEditorState({
      block,
      alt: block?.alt ?? "",
      url: block?.url ?? "",
    })
  }, [])

  const saveImage = useCallback((alt: string, url: string) => {
    const normalizedAlt = alt.trim()
    const normalizedUrl = url.trim()
    if (!normalizedUrl) {
      return
    }

    if (imageEditorState?.block) {
      replaceBlockWithMarkdown(imageEditorState.block, `![${normalizedAlt}](${normalizedUrl})`)
      return
    }

    insertStandaloneMarkdown(`![${normalizedAlt}](${normalizedUrl})`)
  }, [imageEditorState, insertStandaloneMarkdown, replaceBlockWithMarkdown])

  const openTableEditor = useCallback((block?: TableBlock) => {
    setTableEditorState(
      block
        ? {
            block,
            initialData: {
              headers: block.headers,
              rows: block.rows,
            },
          }
        : {}
    )
  }, [])

  const saveTable = useCallback((markdown: string) => {
    if (tableEditorState?.block) {
      replaceBlockWithMarkdown(tableEditorState.block, markdown)
    } else {
      insertStandaloneMarkdown(markdown)
    }
  }, [insertStandaloneMarkdown, replaceBlockWithMarkdown, tableEditorState])

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const altText = file.name.replace(/\.[^/.]+$/, '')
      insertStandaloneMarkdown(`![${altText}](${base64})`)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [insertStandaloneMarkdown])

  const toolbarActions = useMemo(() => [
    { icon: Bold, label: "粗体", action: () => replaceTextSelection("**", "**", "粗体文本") },
    { icon: Italic, label: "斜体", action: () => replaceTextSelection("*", "*", "斜体文本") },
    { icon: Heading1, label: "一级标题", action: () => replaceTextSelection("# ", "", "标题") },
    { icon: Heading2, label: "二级标题", action: () => replaceTextSelection("## ", "", "标题") },
    { icon: Heading3, label: "三级标题", action: () => replaceTextSelection("### ", "", "标题") },
    { icon: List, label: "无序列表", action: () => replaceTextSelection("- ", "", "列表项") },
    { icon: ListOrdered, label: "有序列表", action: () => replaceTextSelection("1. ", "", "列表项") },
    { icon: Quote, label: "引用", action: () => replaceTextSelection("> ", "", "引用文本") },
    { icon: Code, label: "行内代码", action: () => replaceTextSelection("`", "`", "code") },
    { icon: Link2, label: "链接", action: () => replaceTextSelection("[", "](url)", "链接文本") },
    { icon: ImageIcon, label: "图片链接", action: () => openImageEditor() },
    { icon: Upload, label: "上传图片", action: handleImageUpload },
    { icon: Table, label: "插入表格", action: () => openTableEditor() },
    { icon: Minus, label: "分割线", action: () => insertStandaloneMarkdown("---") },
    { icon: CheckSquare, label: "任务列表", action: () => replaceTextSelection("- [ ] ", "", "任务项") },
  ], [handleImageUpload, insertStandaloneMarkdown, openImageEditor, openTableEditor, replaceTextSelection])

  const insertCodeBlock = useCallback((language: string) => {
    insertStandaloneMarkdown(`\`\`\`${language}\n// 代码内容\n\`\`\``)
  }, [insertStandaloneMarkdown])

  const keepEditorSelection = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }, [])

  const updateTextBlockWithSelection = useCallback((
    block: TextBlock,
    textarea: HTMLTextAreaElement,
    nextText: string,
    selectionStart: number,
    selectionEnd: number = selectionStart
  ) => {
    updateBlockContent(block, nextText)
    restoreTextareaSelection(textarea, block.lineStart, selectionStart, selectionEnd)
  }, [restoreTextareaSelection, updateBlockContent])

  const syncScrollPosition = useCallback((source: HTMLDivElement, target: HTMLDivElement, origin: "editor" | "preview") => {
    if (syncingScrollRef.current && syncingScrollRef.current !== origin) {
      return
    }

    const sourceScrollableHeight = source.scrollHeight - source.clientHeight
    const targetScrollableHeight = target.scrollHeight - target.clientHeight
    const scrollRatio = sourceScrollableHeight <= 0 ? 0 : source.scrollTop / sourceScrollableHeight

    syncingScrollRef.current = origin
    target.scrollTop = targetScrollableHeight <= 0 ? 0 : scrollRatio * targetScrollableHeight

    requestAnimationFrame(() => {
      syncingScrollRef.current = null
    })
  }, [])

  useEffect(() => {
    if (mode !== "split") return

    const editor = editorScrollRef.current
    const preview = previewRef.current
    if (!editor || !preview) return

    syncScrollPosition(editor, preview, "editor")
  }, [mode, renderedHtml, syncScrollPosition])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, block: TextBlock) => {
    const textarea = e.currentTarget
    const text = textarea.value
    const isImeConfirming = isComposingRef.current || e.nativeEvent.isComposing || e.keyCode === 229

    clearPendingCursor()

    if (isImeConfirming) {
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (e.shiftKey) {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1
        const lineText = text.substring(lineStart, start)
        if (lineText.startsWith('  ')) {
          const nextText = `${text.substring(0, lineStart)}${text.substring(lineStart + 2)}`
          updateTextBlockWithSelection(block, textarea, nextText, start - 2, end - 2)
        }
      } else {
        const nextText = `${text.substring(0, start)}  ${text.substring(end)}`
        updateTextBlockWithSelection(block, textarea, nextText, start + 2, end + 2)
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const start = textarea.selectionStart
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const currentLine = text.substring(lineStart, start)
      const quoteMatch = currentLine.match(/^(\s*(?:>\s?)+)/)

      const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s/)
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/)
      const taskMatch = currentLine.match(/^(\s*)([-*+])\s\[\s\]\s/)

      if (quoteMatch) {
        e.preventDefault()

        const quotePrefix = quoteMatch[1].replace(/\s+$/, ' ')
        const quoteContent = currentLine.slice(quoteMatch[1].length).trim()
        const nextQuoteLine = quoteContent.length === 0 ? "\n" : `\n${quotePrefix}`
        const nextText = `${text.substring(0, start)}${nextQuoteLine}${text.substring(start)}`
        const nextCursor = start + nextQuoteLine.length

        updateTextBlockWithSelection(block, textarea, nextText, nextCursor)
        return
      }

      if (unorderedMatch || orderedMatch || taskMatch) {
        e.preventDefault()

        const isEmptyItem = taskMatch
          ? currentLine.trim() === '- [ ]' || currentLine.trim() === '* [ ]' || currentLine.trim() === '+ [ ]'
          : (unorderedMatch && currentLine.trim() === unorderedMatch[2])
            || (orderedMatch && currentLine.trim() === `${orderedMatch[2]}.`)

        if (isEmptyItem) {
          const nextText = `${text.substring(0, lineStart)}${text.substring(start)}`
          updateTextBlockWithSelection(block, textarea, nextText, lineStart)
        } else {
          let newListItem = ''

          if (taskMatch) {
            newListItem = `\n${taskMatch[1]}${taskMatch[2]} [ ] `
          } else if (unorderedMatch) {
            newListItem = `\n${unorderedMatch[1]}${unorderedMatch[2]} `
          } else if (orderedMatch) {
            const number = parseInt(orderedMatch[2], 10)
            newListItem = `\n${orderedMatch[1]}${number + 1}. `
          }

          const nextText = `${text.substring(0, start)}${newListItem}${text.substring(start)}`
          updateTextBlockWithSelection(block, textarea, nextText, start + newListItem.length)
        }

        return
      }
    }

    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
    if (pairs[e.key]) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      if (start !== end) {
        e.preventDefault()
        const selectedText = text.substring(start, end)
        const nextText = `${text.substring(0, start)}${e.key}${selectedText}${pairs[e.key]}${text.substring(end)}`
        updateTextBlockWithSelection(block, textarea, nextText, start + 1, end + 1)
      }
    }
  }, [clearPendingCursor, updateTextBlockWithSelection])

  return (
    <div 
      className={cn(
        "flex flex-col border border-border rounded-xl overflow-hidden bg-background",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          <TooltipProvider delayDuration={300}>
            {toolbarActions.slice(0, 9).map((tool, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <button
                    onMouseDown={keepEditorSelection}
                    onClick={tool.action}
                    className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <tool.icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{tool.label}</TooltipContent>
              </Tooltip>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onMouseDown={keepEditorSelection}
                  className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {toolbarActions.slice(9).map((tool, i) => (
                  <DropdownMenuItem
                    key={i}
                    onMouseDown={keepEditorSelection}
                    onClick={tool.action}
                    className="cursor-pointer gap-2"
                  >
                    <tool.icon className="w-4 h-4" />
                    {tool.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onMouseDown={keepEditorSelection} onClick={() => insertCodeBlock("javascript")} className="cursor-pointer">
                  JavaScript 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={keepEditorSelection} onClick={() => insertCodeBlock("typescript")} className="cursor-pointer">
                  TypeScript 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={keepEditorSelection} onClick={() => insertCodeBlock("python")} className="cursor-pointer">
                  Python 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={keepEditorSelection} onClick={() => insertCodeBlock("bash")} className="cursor-pointer">
                  Bash 代码块
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5 mr-2">
            {[
              { m: "edit", icon: Code2, label: "编辑" },
              { m: "split", icon: Columns, label: "双屏" },
              { m: "preview", icon: Eye, label: "预览" },
            ].map(({ m, icon: Icon, label }) => (
              <button
                key={m}
                onClick={() => setMode(m as EditorMode)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                  mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Editor */}
        {(mode === "edit" || mode === "split") && (
          <div
            ref={editorScrollRef}
            onScroll={(event) => {
              if (mode !== "split" || !previewRef.current) return
              syncScrollPosition(event.currentTarget, previewRef.current, "editor")
            }}
            className={cn("flex-1 flex flex-col min-h-0 overflow-y-auto", mode === "split" && "border-r border-border")}
          >
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4">
              {blocks.map((block) => {
                if (block.type === 'image') {
                  return (
                    <ImageBlockComponent
                      key={`img-${block.lineStart}`}
                      block={block}
                      onEdit={() => openImageEditor(block)}
                      onRemove={() => removeBlock(block)}
                    />
                  )
                }

                if (block.type === 'table') {
                  return (
                    <TableBlockComponent
                      key={`table-${block.lineStart}`}
                      block={block}
                      onEdit={() => openTableEditor(block)}
                      onRemove={() => removeBlock(block)}
                    />
                  )
                }

                return (
                  <TextBlockComponent
                    key={`text-${block.lineStart}`}
                    content={block.content}
                    lineStart={block.lineStart}
                    placeholder={placeholder}
                    isFirstBlock={block.lineStart === 0}
                    onChange={(newContent) => updateBlockContent(block, newContent)}
                    onFocus={(selectionStart, selectionEnd) => {
                      clearPendingCursor()
                      setActiveSelection(block.lineStart, selectionStart, selectionEnd)
                    }}
                    onSelectionChange={(selectionStart, selectionEnd) => {
                      clearPendingCursor()
                      setActiveSelection(block.lineStart, selectionStart, selectionEnd)
                    }}
                    onAfterInput={ensureTextareaVisible}
                    onCompositionStart={() => {
                      clearPendingCursor()
                      isComposingRef.current = true
                    }}
                    onCompositionEnd={(selectionStart, selectionEnd) => {
                      isComposingRef.current = false
                      clearPendingCursor()
                      setActiveSelection(block.lineStart, selectionStart, selectionEnd)
                    }}
                    onKeyDown={(e) => handleKeyDown(e, block)}
                    registerTextarea={registerTextarea}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Preview */}
        {(mode === "preview" || mode === "split") && (
          <div 
            ref={previewRef}
            onScroll={(event) => {
              if (mode !== "split" || !editorScrollRef.current) return
              syncScrollPosition(event.currentTarget, editorScrollRef.current, "preview")
            }}
            className={cn(
              "flex-1 overflow-y-auto p-4 bg-muted/10",
              "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full",
              previewClassName
            )}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            ) : renderedHtml ? (
              <MarkdownRenderer content={renderedHtml} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
                <Eye className="w-8 h-8 mb-2" />
                <p className="text-sm">预览区域</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        <span>Markdown · Tab缩进 · Enter智能列表</span>
        <span>{currentValue.length} 字符 · {currentValue.split(/\s+/).filter(Boolean).length} 词</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />

      {/* Table Editor Modal */}
      <TableEditorModal
        isOpen={tableEditorState !== null}
        onClose={() => {
          setTableEditorState(null)
        }}
        onSave={(markdown) => {
          saveTable(markdown)
          setTableEditorState(null)
        }}
        initialData={tableEditorState?.initialData}
      />
      <ImageEditorModal
        state={imageEditorState}
        isOpen={imageEditorState !== null}
        onClose={() => {
          setImageEditorState(null)
        }}
        onSave={(alt, url) => {
          saveImage(alt, url)
          setImageEditorState(null)
        }}
      />
    </div>
  )
}
