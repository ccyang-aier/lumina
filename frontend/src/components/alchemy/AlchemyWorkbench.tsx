"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LeftPanel } from "./LeftPanel"
import { RightPanel } from "./RightPanel"
import { QAMode } from "./modes/QAMode"
import { GenerateMode } from "./modes/GenerateMode"
import { GovernanceMode } from "./modes/GovernanceMode"
import { LearningMode } from "./modes/LearningMode"
import { ExamMode } from "./modes/ExamMode"
import type { AIMode, Confidence } from "@/lib/alchemy-data"

// ─── Workbench ────────────────────────────────────────────────────────────────

export function AlchemyWorkbench() {
  const [activeMode, setActiveMode] = useState<AIMode>("qa")
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  // Q&A mode state shared with right panel
  const [confidence, setConfidence] = useState<Confidence>("high")
  const [confidenceScore, setConfidenceScore] = useState(0.93)
  const [citationIds, setCitationIds] = useState<string[]>(["kc-001", "kc-002"])
  const [highlightedCitation, setHighlightedCitation] = useState<string | undefined>()

  // Governance data for right panel
  const [governanceData, setGovernanceData] = useState<
    { checked: number; total: number; issues: number } | undefined
  >()

  // Exam data for right panel
  const [examData, setExamData] = useState<
    | {
        currentQuestion: number
        totalQuestions: number
        score: number
        sourceCard?: string
      }
    | undefined
  >()

  const handleConfidenceChange = useCallback(
    (score: number, conf: Confidence, ids: string[]) => {
      setConfidenceScore(score)
      setConfidence(conf)
      setCitationIds(ids)
    },
    []
  )

  const handleModeChange = useCallback((mode: AIMode) => {
    setActiveMode(mode)
    // Reset mode-specific state
    setHighlightedCitation(undefined)
    if (mode !== "qa") {
      setConfidence("high")
      setConfidenceScore(0)
      setCitationIds([])
    }
    if (mode !== "governance") setGovernanceData(undefined)
    if (mode !== "exam") setExamData(undefined)
  }, [])

  const handleCitationClick = useCallback((id: string) => {
    setHighlightedCitation((prev) => (prev === id ? undefined : id))
    // Auto-open right panel if collapsed
    setRightCollapsed(false)
  }, [])

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left Panel */}
      <LeftPanel
        activeMode={activeMode}
        onModeChange={handleModeChange}
        collapsed={leftCollapsed}
        onToggleCollapse={() => setLeftCollapsed((v) => !v)}
      />

      {/* Central Work Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {activeMode === "qa" && (
              <QAMode
                onConfidenceChange={handleConfidenceChange}
                highlightedCitation={highlightedCitation}
                onCitationClick={handleCitationClick}
              />
            )}
            {activeMode === "generate" && <GenerateMode />}
            {activeMode === "governance" && <GovernanceMode />}
            {activeMode === "learning" && <LearningMode />}
            {activeMode === "exam" && (
              <ExamMode onExamDataChange={setExamData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel */}
      <RightPanel
        activeMode={activeMode}
        confidenceScore={confidenceScore}
        confidence={confidence}
        citationIds={citationIds}
        collapsed={rightCollapsed}
        onToggleCollapse={() => setRightCollapsed((v) => !v)}
        highlightedCitation={highlightedCitation}
        onCitationHighlight={setHighlightedCitation}
        examData={examData}
        governanceData={governanceData}
      />
    </div>
  )
}
