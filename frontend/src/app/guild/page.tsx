import dynamic from "next/dynamic"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Dynamic Import ───────────────────────────────────────────────────────────
const AlchemyWorkbench = dynamic(
  () => import("@/components/alchemy/AlchemyWorkbench").then(mod => mod.AlchemyWorkbench),
  { 
    loading: () => <AlchemySkeleton />
  }
)

export const metadata: Metadata = {
  title: "炼金 · Lumina AI 工作台",
  description: "AI 驱动的知识工作台 — 问答、生成、治理、学习、考核，五种能力一体化",
}

function AlchemySkeleton() {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-[280px] border-r border-border p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function AlchemyPage() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
    >
      <AlchemyWorkbench />
    </div>
  )
}
