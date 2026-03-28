import { notFound } from "next/navigation"
import Link from "next/link"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit"
import { Eye, Heart, MessageSquare, ArrowLeft, Calendar, Building2, Tag, FileText, BookOpen, Coffee, MessageCircleQuestion, Terminal } from "lucide-react"
// ArrowLeft used in breadcrumb above

import { getCardById, getSeriesById, getAuthorCards } from "@/lib/knowledge-data"
import { SeriesSidebar } from "@/components/knowledge/KnowledgeDetail/SeriesSidebar"
import { TableOfContents } from "@/components/knowledge/KnowledgeDetail/TableOfContents"
import { ChapterNav } from "@/components/knowledge/KnowledgeDetail/ChapterNav"
import { ActionButtons } from "@/components/knowledge/KnowledgeDetail/ActionButtons"
import { PageActions } from "@/components/knowledge/KnowledgeDetail/PageActions"
import { CommentSection, ClickableImage } from "@/components/knowledge/KnowledgeDetail/CommentSection"
import styles from "@/components/knowledge/KnowledgeDetail/KnowledgeDetail.module.css"
import { MarkdownRenderer } from "@/components/knowledge/KnowledgeDetail/MarkdownRenderer"

// Custom rehype plugin to attach raw code to pre elements
const attachRawCode = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "element" || node.tagName !== "pre") {
      return
    }

    const codeElement = node.children.find((child: any) => child.tagName === "code")

    if (codeElement) {
      // 1. Get raw code for Copy button
      if (codeElement.children.length > 0 && codeElement.children[0].type === "text") {
        const rawCode = codeElement.children[0].value
        node.properties["data-raw-code"] = encodeURIComponent(rawCode)
      }
      
      // 2. Enable Line Numbers (for all code blocks)
      codeElement.properties["data-line-numbers"] = ""
    }
  })
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    // Attach raw code BEFORE pretty code transforms it
    .use(attachRawCode)
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark-dimmed",
        light: "github-light",
      },
      keepBackground: true,
      defaultLang: "plaintext",
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(result)
}

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return num.toString()
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function KnowledgeDetailPage({ params }: PageProps) {
  const { id } = await params
  const card = getCardById(id)

  if (!card) notFound()

  const series = card.location?.seriesId ? getSeriesById(card.location.seriesId) : undefined
  const authorCards = !series ? getAuthorCards(card.author.name) : undefined
  const htmlContent = card.content ? await markdownToHtml(card.content) : ""

  const typeMap: Record<string, { label: string; color: string; icon: any }> = {
    document: { label: "文档", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
    tutorial: { label: "教程", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: BookOpen },
    faq: { label: "FAQ", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: MessageCircleQuestion },
    talk: { label: "杂谈", color: "bg-violet-500/10 text-violet-500 border-violet-500/20", icon: Coffee },
    script: { label: "脚本", color: "bg-slate-500/10 text-slate-500 border-slate-500/20", icon: Terminal },
  };

  const typeConfig = card.type ? typeMap[card.type] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Main 3-column layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] items-stretch">

          {/* ===== LEFT COLUMN: Series / Author Sidebar ===== */}
          <div className="hidden lg:block relative pr-0">
            <SeriesSidebar
              currentCardId={card.id}
              series={series}
              authorCards={authorCards}
              authorName={card.author.name}
              authorBio={card.author.bio}
              authorAvatar={card.author.avatar}
            />
          </div>

          {/* ===== CENTER COLUMN: Article Content ===== */}
          <main className="min-w-0 px-8 lg:px-12">
            {/* Breadcrumb + Page Actions */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                {card.location ? (
                  <>
                    <Link href={`/knowledge/series/${card.location.seriesId}`} className="hover:text-foreground transition-colors whitespace-nowrap">
                      {card.location.series}
                    </Link>
                    <span className="text-muted-foreground/40">/</span>
                  </>
                ) : (
                  <>
                    <Link href="/knowledge" className="hover:text-foreground transition-colors whitespace-nowrap">
                      知识图鉴
                    </Link>
                    <span className="text-muted-foreground/40">/</span>
                  </>
                )}
                <span className="text-foreground font-medium truncate">
                  {card.title}
                </span>
              </nav>
              {card.content && (
                <PageActions markdownContent={card.content} title={card.title} />
              )}
            </div>

            {/* Article Header */}
            <header className="mb-8 pb-8 border-b border-border/60">
              
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug mb-4">
                {card.title}
              </h1>

              {/* Description */}
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                {card.description}
              </p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                    {card.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.author.avatar} alt={card.author.name} className="w-full h-full object-cover" />
                    ) : (
                      card.author.name.slice(0, 1)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">{card.author.name}</span>
                    {card.author.guild && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5" />
                        {card.author.guild}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-4 w-px bg-border/60" />

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(card.publishDate).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
                </div>

                <div className="h-4 w-px bg-border/60" />

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(card.stats.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {formatNumber(card.stats.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {formatNumber(card.stats.comments)}
                  </span>
                </div>
              </div>

              {/* Tags & Type */}
              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                 {typeConfig && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${typeConfig.color}`}>
                       <typeConfig.icon className="w-3 h-3" />
                       {typeConfig.label}
                    </span>
                 )}
                 {card.tags.length > 0 && (
                   <>
                    <Tag className="w-3 h-3 text-muted-foreground/60 ml-1" />
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                      >
                        #{tag}
                      </span>
                    ))}
                   </>
                 )}
              </div>
            </header>

            {/* Cover Image */}
            {card.image && (
              <div className="mb-8 rounded-xl overflow-hidden border border-border aspect-[16/7]">
                <ClickableImage
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown Content */}
            {htmlContent ? (
              <MarkdownRenderer content={htmlContent} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-sm">内容暂未收录，敬请期待。</p>
              </div>
            )}

            {/* Action Buttons */}
            <ActionButtons />

            {/* Footer nav: prev / next chapter */}
            {series && card.location && (() => {
              const ci = card.location!.chapterIndex
              const prev = series.cards.find((c) => c.chapterIndex === ci - 1)
              const next = series.cards.find((c) => c.chapterIndex === ci + 1)
              return <ChapterNav prev={prev} next={next} />
            })()}

            {/* Comment Section */}
            <CommentSection articleId={card.id} />
          </main>

          {/* ===== RIGHT COLUMN: Table of Contents ===== */}
          <div className="hidden lg:block pl-8">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/60">
              <TableOfContents contentId="markdown-content" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
