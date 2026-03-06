import { AlchemyWorkbench } from "@/components/alchemy/AlchemyWorkbench"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "炼金 · Lumina AI 工作台",
  description: "AI 驱动的知识工作台 — 问答、生成、治理、学习、考核，五种能力一体化",
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
