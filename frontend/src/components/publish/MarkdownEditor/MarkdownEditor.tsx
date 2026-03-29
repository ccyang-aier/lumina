"use client"

import * as React from "react"
import { useCallback, useMemo, useRef, useState, useEffect, useLayoutEffect } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit"
import type { Root } from "hast"
import { cn } from "@/lib/utils"
import styles from "./MarkdownEditor.module.css"
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
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark" },
      defaultLang: "plaintext",
    })
    .use(attachRawCode)
    .use(rehypeStringify)

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
  lineStart: number
  selectionStart: number
  selectionEnd?: number
  prefer?: "nearest" | "previous"
}

interface TableEditorState {
  block?: TableBlock
  initialData?: { headers: string[]; rows: string[][] }
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
  onKeyDown,
  registerTextarea,
}: {
  content: string
  lineStart: number
  placeholder: string
  isFirstBlock: boolean
  onChange: (newContent: string) => void
  onFocus: () => void
  onSelectionChange: (selectionStart: number, selectionEnd: number) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  registerTextarea: (node: HTMLTextAreaElement | null) => void
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
    registerTextarea(node)
    resizeTextarea(node)
  }, [registerTextarea, resizeTextarea])

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
        resizeTextarea(e.currentTarget)
      }}
      onFocus={onFocus}
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
  const pendingCursorRef = useRef<PendingCursor | null>(null)
  const syncingScrollRef = useRef<"editor" | "preview" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tableEditorState, setTableEditorState] = useState<TableEditorState | null>(null)

  const currentValue = onChange ? value : internalValue

  const blocks = useMemo(() => parseContent(currentValue), [currentValue])
  const textBlocks = useMemo(() => blocks.filter((block): block is TextBlock => block.type === 'text'), [blocks])
  const textBlockMap = useMemo(() => new Map(textBlocks.map((block) => [block.lineStart, block])), [textBlocks])

  useEffect(() => {
    const renderMarkdown = async () => {
      if (!currentValue) {
        setRenderedHtml("")
        return
      }
      setIsProcessing(true)
      try {
        const html = await markdownToHtml(currentValue)
        setRenderedHtml(html)
      } catch (error) {
        console.error("Error rendering markdown:", error)
        setRenderedHtml("<p>Error rendering markdown</p>")
      } finally {
        setIsProcessing(false)
      }
    }
    
    const debounceTimer = setTimeout(renderMarkdown, 150)
    return () => clearTimeout(debounceTimer)
  }, [currentValue])

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
    pendingCursorRef.current = cursor
  }, [])

  useEffect(() => {
    const pendingCursor = pendingCursorRef.current
    if (!pendingCursor) return

    const availableLineStarts = Array.from(textareaRefs.current.keys()).sort((a, b) => a - b)
    if (availableLineStarts.length === 0) {
      return
    }

    const targetLineStart = pendingCursor.prefer === "previous"
      ? [...availableLineStarts].reverse().find((lineStart) => lineStart <= pendingCursor.lineStart)
        ?? availableLineStarts[0]
      : availableLineStarts.find((lineStart) => lineStart >= pendingCursor.lineStart)
        ?? availableLineStarts[availableLineStarts.length - 1]

    const targetTextarea = textareaRefs.current.get(targetLineStart)
    if (!targetTextarea) {
      return
    }

    const selectionEnd = pendingCursor.selectionEnd ?? pendingCursor.selectionStart
    const clampedStart = Math.min(pendingCursor.selectionStart, targetTextarea.value.length)
    const clampedEnd = Math.min(selectionEnd, targetTextarea.value.length)

    requestAnimationFrame(() => {
      targetTextarea.scrollIntoView({ block: "nearest" })
      targetTextarea.focus()
      targetTextarea.setSelectionRange(clampedStart, clampedEnd)
    })

    pendingCursorRef.current = null
  }, [blocks])

  const registerTextarea = useCallback((lineStart: number, node: HTMLTextAreaElement | null) => {
    if (node) {
      textareaRefs.current.set(lineStart, node)
      return
    }

    textareaRefs.current.delete(lineStart)
  }, [])

  const getActiveTextBlock = useCallback(() => {
    const activeLineStart = activeTextBlockLineRef.current
    if (activeLineStart === null) return null

    const block = textBlockMap.get(activeLineStart)
    const textarea = textareaRefs.current.get(activeLineStart)
    if (!block || !textarea) return null

    return { block, textarea }
  }, [textBlockMap])

  const insertAtDocumentEnd = useCallback((markdown: string) => {
    const prefix = currentValue.length > 0 && !currentValue.endsWith('\n') ? '\n' : ''
    const nextValue = `${currentValue}${prefix}${markdown}\n`
    handleChange(nextValue)
    const nextLineStart = nextValue.split('\n').length - 1
    scheduleCursor({
      lineStart: nextLineStart,
      selectionStart: 0,
      prefer: "previous",
    })
  }, [currentValue, handleChange, scheduleCursor])

  const removeBlock = useCallback((block: ContentBlock) => {
    const lines = currentValue.length === 0 ? [''] : currentValue.split('\n')
    lines.splice(block.lineStart, block.lineEnd - block.lineStart + 1)
    const nextValue = lines.length > 0 ? lines.join('\n') : ''
    handleChange(nextValue)
    scheduleCursor({
      lineStart: block.lineStart,
      selectionStart: 0,
      prefer: "nearest",
    })
  }, [currentValue, handleChange, scheduleCursor])

  const replaceTextSelection = useCallback((before: string, after: string = "", placeholderText: string = "") => {
    const activeTarget = getActiveTextBlock()

    if (!activeTarget) {
      const fallbackValue = `${currentValue}${before}${placeholderText}${after}`
      handleChange(fallbackValue)
      return
    }

    const { block, textarea } = activeTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.slice(start, end) || placeholderText
    const nextText = `${textarea.value.slice(0, start)}${before}${selectedText}${after}${textarea.value.slice(end)}`
    const nextCursor = start + before.length + selectedText.length

    updateBlockContent(block, nextText)
    scheduleCursor({
      lineStart: block.lineStart,
      selectionStart: nextCursor,
      prefer: "nearest",
    })
  }, [currentValue, getActiveTextBlock, handleChange, scheduleCursor, updateBlockContent])

  const insertStandaloneMarkdown = useCallback((markdown: string) => {
    const activeTarget = getActiveTextBlock()

    if (!activeTarget) {
      insertAtDocumentEnd(markdown)
      return
    }

    const { block, textarea } = activeTarget
    const insertion = createStandaloneInsertion(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd,
      markdown
    )

    updateBlockContent(block, insertion.nextText)
    scheduleCursor({
      lineStart: block.lineStart + insertion.focusLineOffset,
      selectionStart: 0,
      prefer: insertion.focusPreference,
    })
  }, [getActiveTextBlock, insertAtDocumentEnd, scheduleCursor, updateBlockContent])

  const replaceBlockWithMarkdown = useCallback((block: ContentBlock, markdown: string) => {
    updateBlockContent(block, markdown)
    scheduleCursor({
      lineStart: block.lineStart + markdown.split('\n').length,
      selectionStart: 0,
      prefer: "nearest",
    })
  }, [scheduleCursor, updateBlockContent])

  const editImage = useCallback((block: ImageBlock) => {
    const newAlt = prompt('图片描述:', block.alt)
    if (newAlt === null) return
    const newUrl = prompt('图片链接:', block.url)
    if (newUrl === null) return

    replaceBlockWithMarkdown(block, `![${newAlt}](${newUrl})`)
  }, [replaceBlockWithMarkdown])

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
    { icon: ImageIcon, label: "图片链接", action: () => insertStandaloneMarkdown("![图片描述](url)") },
    { icon: Upload, label: "上传图片", action: handleImageUpload },
    { icon: Table, label: "插入表格", action: () => openTableEditor() },
    { icon: Minus, label: "分割线", action: () => insertStandaloneMarkdown("---") },
    { icon: CheckSquare, label: "任务列表", action: () => replaceTextSelection("- [ ] ", "", "任务项") },
  ], [handleImageUpload, insertStandaloneMarkdown, openTableEditor, replaceTextSelection])

  const insertCodeBlock = useCallback((language: string) => {
    insertStandaloneMarkdown(`\`\`\`${language}\n// 代码内容\n\`\`\``)
  }, [insertStandaloneMarkdown])

  const updateTextBlockWithSelection = useCallback((block: TextBlock, nextText: string, selectionStart: number, selectionEnd: number = selectionStart) => {
    updateBlockContent(block, nextText)
    scheduleCursor({
      lineStart: block.lineStart,
      selectionStart,
      selectionEnd,
      prefer: "nearest",
    })
  }, [scheduleCursor, updateBlockContent])

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

    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (e.shiftKey) {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1
        const lineText = text.substring(lineStart, start)
        if (lineText.startsWith('  ')) {
          const nextText = `${text.substring(0, lineStart)}${text.substring(lineStart + 2)}`
          updateTextBlockWithSelection(block, nextText, start - 2, end - 2)
        }
      } else {
        const nextText = `${text.substring(0, start)}  ${text.substring(end)}`
        updateTextBlockWithSelection(block, nextText, start + 2, end + 2)
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const start = textarea.selectionStart
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const currentLine = text.substring(lineStart, start)

      const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s/)
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/)
      const taskMatch = currentLine.match(/^(\s*)([-*+])\s\[\s\]\s/)

      if (unorderedMatch || orderedMatch || taskMatch) {
        e.preventDefault()

        const isEmptyItem = taskMatch
          ? currentLine.trim() === '- [ ]' || currentLine.trim() === '* [ ]' || currentLine.trim() === '+ [ ]'
          : (unorderedMatch && currentLine.trim() === unorderedMatch[2])
            || (orderedMatch && currentLine.trim() === `${orderedMatch[2]}.`)

        if (isEmptyItem) {
          const nextText = `${text.substring(0, lineStart)}${text.substring(start)}`
          updateTextBlockWithSelection(block, nextText, lineStart)
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
          updateTextBlockWithSelection(block, nextText, start + newListItem.length)
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
        updateTextBlockWithSelection(block, nextText, start + 1, end + 1)
      }
    }
  }, [updateTextBlockWithSelection])

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
                <button className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {toolbarActions.slice(9).map((tool, i) => (
                  <DropdownMenuItem key={i} onClick={tool.action} className="cursor-pointer gap-2">
                    <tool.icon className="w-4 h-4" />
                    {tool.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => insertCodeBlock("javascript")} className="cursor-pointer">
                  JavaScript 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertCodeBlock("typescript")} className="cursor-pointer">
                  TypeScript 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertCodeBlock("python")} className="cursor-pointer">
                  Python 代码块
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertCodeBlock("bash")} className="cursor-pointer">
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
                      onEdit={() => editImage(block)}
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
                    onFocus={() => {
                      activeTextBlockLineRef.current = block.lineStart
                    }}
                    onSelectionChange={() => {
                      activeTextBlockLineRef.current = block.lineStart
                    }}
                    onKeyDown={(e) => handleKeyDown(e, block)}
                    registerTextarea={(node) => registerTextarea(block.lineStart, node)}
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
              <div 
                className={`prose dark:prose-invert max-w-none ${styles["markdown-editor-preview"]}`}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
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
    </div>
  )
}
