"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  X,
  Play,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Share2,
  BookmarkPlus,
  ChevronRight,
  Timer,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EXAM_QUESTIONS } from "@/lib/alchemy-data"
import type { ExamQuestion } from "@/lib/alchemy-data"

// ─── Config Stage ─────────────────────────────────────────────────────────────

const AVAILABLE_CARDS = [
  { id: "kc-001", title: "React useEffect 完整指南" },
  { id: "kc-002", title: "React 渲染优化：memo、useMemo 与 useCallback" },
  { id: "kc-003", title: "Kafka 消费者组与消息分区策略" },
  { id: "kc-004", title: "Kubernetes Pod 生命周期与 OOM 排查" },
  { id: "kc-005", title: "Next.js App Router 数据获取模式" },
]

const DIFFICULTY_OPTIONS = ["简单", "中等", "困难"] as const
type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]

interface ExamConfig {
  selectedCards: string[]
  questionCount: number
  difficulty: Difficulty
}

function ConfigStage({ onStart }: { onStart: (cfg: ExamConfig) => void }) {
  const [selectedCards, setSelectedCards] = useState<string[]>([
    "kc-001",
    "kc-002",
    "kc-003",
  ])
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState<Difficulty>("中等")
  const [generating, setGenerating] = useState(false)

  const toggleCard = (id: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleStart = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      onStart({ selectedCards, questionCount, difficulty })
    }, 1800)
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Card selection */}
      <div>
        <h3 className="text-sm font-semibold mb-1">题目来源</h3>
        <p className="text-xs text-muted-foreground mb-3">
          手动选择知识卡，AI 将基于卡片内容出题
        </p>
        <div className="space-y-2">
          {AVAILABLE_CARDS.map((card) => {
            const selected = selectedCards.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  selected
                    ? "border-foreground/30 bg-foreground/5"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-all",
                    selected
                      ? "bg-foreground border-foreground"
                      : "border-border/60"
                  )}
                >
                  {selected && (
                    <CheckCircle2 className="h-3 w-3 text-background" />
                  )}
                </div>
                <span className="text-sm">{card.title}</span>
              </button>
            )
          })}
        </div>
        <button
          onClick={() =>
            setSelectedCards(AVAILABLE_CARDS.map((c) => c.id))
          }
          className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3 w-3" />
          从学习路径导入全部
        </button>
      </div>

      {/* Question count */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          题目数量
          <span className="ml-2 font-normal text-muted-foreground">
            {questionCount} 题
          </span>
        </h3>
        <input
          type="range"
          min={5}
          max={20}
          step={5}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          {[5, 10, 15, 20].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-sm font-semibold mb-3">难度</h3>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm border transition-all",
                difficulty === d
                  ? "bg-foreground text-background border-foreground"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={selectedCards.length === 0 || generating}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
          selectedCards.length > 0 && !generating
            ? "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {generating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            正在阅读知识卡并出题...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            开始生成题目
          </>
        )}
      </button>
    </div>
  )
}

// ─── Question Stage ───────────────────────────────────────────────────────────

interface AnswerFeedback {
  correct: boolean
  answer: string | string[] | boolean
  explanation: string
  sourceCard: string
  sourceExcerpt: string
}

function QuestionCard({
  question,
  index,
  total,
  onAnswer,
}: {
  question: ExamQuestion
  index: number
  total: number
  onAnswer: (feedback: AnswerFeedback) => void
}) {
  const [selected, setSelected] = useState<string | string[] | boolean | null>(null)
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [shortAnswer, setShortAnswer] = useState("")

  const checkAnswer = useCallback(
    (val: string | string[] | boolean) => {
      let correct = false
      if (question.type === "single") {
        correct = val === question.answer
      } else if (question.type === "multi") {
        const a = Array.isArray(question.answer) ? [...question.answer].sort() : []
        const b = Array.isArray(val) ? [...val].sort() : []
        correct = JSON.stringify(a) === JSON.stringify(b)
      } else if (question.type === "judge") {
        correct = val === question.answer
      } else {
        correct = true // short answer always counts
      }

      const fb: AnswerFeedback = {
        correct,
        answer: question.answer,
        explanation: question.explanation,
        sourceCard: question.sourceCard,
        sourceExcerpt: question.sourceExcerpt,
      }
      setFeedback(fb)
      onAnswer(fb)
    },
    [question, onAnswer]
  )

  const handleOptionClick = (optId: string) => {
    if (feedback) return
    if (question.type === "single") {
      setSelected(optId)
      checkAnswer(optId)
    } else if (question.type === "multi") {
      setSelected((prev) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.includes(optId) ? arr.filter((x) => x !== optId) : [...arr, optId]
      })
    }
  }

  const handleMultiSubmit = () => {
    if (!Array.isArray(selected) || selected.length === 0 || feedback) return
    checkAnswer(selected)
  }

  const handleJudge = (val: boolean) => {
    if (feedback) return
    setSelected(val)
    checkAnswer(val)
  }

  const handleShortSubmit = () => {
    if (!shortAnswer.trim() || feedback) return
    checkAnswer(shortAnswer)
  }

  const typeLabel: Record<string, string> = {
    single: "单选题",
    multi: "多选题",
    judge: "判断题",
    short: "简答题",
  }

  const isCorrectOption = (optId: string) => {
    if (!feedback) return null
    if (Array.isArray(question.answer)) return question.answer.includes(optId)
    return question.answer === optId
  }

  return (
    <div className="space-y-4">
      {/* Question header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
            第 {index + 1} 题
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            {typeLabel[question.type]}
          </span>
        </div>
        <p className="text-base font-medium leading-relaxed">{question.question}</p>
      </div>

      {/* Options - single/multi */}
      {(question.type === "single" || question.type === "multi") && (
        <div className="space-y-2">
          {question.options?.map((opt) => {
            const isSelected = Array.isArray(selected)
              ? selected.includes(opt.id)
              : selected === opt.id
            const correctStatus = feedback ? isCorrectOption(opt.id) : null

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt.id)}
                disabled={!!feedback}
                className={cn(
                  "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all text-sm",
                  !feedback && isSelected
                    ? "border-foreground/40 bg-foreground/5"
                    : !feedback
                    ? "border-border/50 hover:border-border hover:bg-accent/20"
                    : correctStatus === true
                    ? "border-emerald-400 bg-emerald-500/8"
                    : isSelected && correctStatus === false
                    ? "border-red-400 bg-red-500/8"
                    : "border-border/30 opacity-60"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 h-5 w-5 rounded border flex items-center justify-center text-[11px] font-bold mt-0.5",
                    !feedback && isSelected
                      ? "bg-foreground border-foreground text-background"
                      : feedback && correctStatus === true
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : feedback && isSelected && correctStatus === false
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-border/50"
                  )}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span>{opt.text}</span>
              </button>
            )
          })}
          {question.type === "multi" && !feedback && (
            <button
              onClick={handleMultiSubmit}
              disabled={!Array.isArray(selected) || selected.length === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all mt-2",
                Array.isArray(selected) && selected.length > 0
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              确认提交
            </button>
          )}
        </div>
      )}

      {/* Judge */}
      {question.type === "judge" && (
        <div className="flex gap-4">
          {[
            { val: true, label: "✅ 正确", color: "border-emerald-400/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300" },
            { val: false, label: "❌ 错误", color: "border-red-400/50 bg-red-500/5 text-red-700 dark:text-red-300" },
          ].map((opt) => (
            <button
              key={String(opt.val)}
              onClick={() => handleJudge(opt.val)}
              disabled={!!feedback}
              className={cn(
                "flex-1 py-5 rounded-2xl border-2 text-lg font-semibold transition-all",
                feedback
                  ? question.answer === opt.val
                    ? opt.color + " opacity-100"
                    : "border-border/20 opacity-30"
                  : selected === opt.val
                  ? opt.color
                  : "border-border/50 hover:border-border"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Short answer */}
      {question.type === "short" && (
        <div className="space-y-2">
          <textarea
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            disabled={!!feedback}
            rows={4}
            placeholder="请在此输入你的回答..."
            className="w-full text-sm bg-card border border-border/60 rounded-xl px-4 py-3 resize-none outline-none focus:border-foreground/30 transition-colors"
          />
          {!feedback && (
            <button
              onClick={handleShortSubmit}
              disabled={!shortAnswer.trim()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                shortAnswer.trim()
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              提交回答
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "rounded-xl p-4 border",
                feedback.correct
                  ? "bg-emerald-500/8 border-emerald-400/40"
                  : "bg-red-500/8 border-red-400/40"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {feedback.correct ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-semibold",
                    feedback.correct
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  )}
                >
                  {feedback.correct ? "回答正确！" : "回答有误"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {feedback.explanation}
              </p>
              <div className="bg-background/40 rounded-lg p-2.5 border border-border/30">
                <p className="text-[10px] text-muted-foreground mb-1">
                  📖 来自：{feedback.sourceCard}
                </p>
                <p className="text-xs italic text-foreground/70">
                  「{feedback.sourceExcerpt}」
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Result Stage ─────────────────────────────────────────────────────────────

interface ExamResult {
  total: number
  correct: number
  answers: AnswerFeedback[]
}

function CountUp({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [target, duration])
  return <>{count}</>
}

function ResultStage({
  result,
  onRetry,
}: {
  result: ExamResult
  onRetry: () => void
}) {
  const [pointsShown, setPointsShown] = useState(false)
  const percentage = Math.round((result.correct / result.total) * 100)
  const earnedPoints = Math.round(percentage * 0.8 + 20)

  const grade =
    percentage >= 90
      ? { label: "优秀", sub: "掌握良好", color: "text-amber-500" }
      : percentage >= 70
      ? { label: "良好", sub: "基本掌握", color: "text-blue-500" }
      : { label: "需加强", sub: "建议复习", color: "text-rose-500" }

  useEffect(() => {
    const t = setTimeout(() => setPointsShown(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const wrongQuestions = EXAM_QUESTIONS.filter(
    (_, i) => i < result.answers.length && !result.answers[i]?.correct
  )

  return (
    <div className="space-y-6">
      {/* Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 relative"
      >
        <div className="relative inline-block">
          <svg width="160" height="160" className="-rotate-90">
            <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
            <motion.circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke={percentage >= 70 ? "#f59e0b" : "#ef4444"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 68}
              initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">
              <CountUp target={percentage} />
            </span>
            <span className="text-sm text-muted-foreground">分</span>
          </div>
        </div>
        <div className={cn("text-xl font-bold mt-2", grade.color)}>{grade.label}</div>
        <p className="text-sm text-muted-foreground">{grade.sub}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {result.correct} / {result.total} 题正确
        </p>

        {/* Points animation */}
        <AnimatePresence>
          {pointsShown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-sm font-semibold"
            >
              <Trophy className="h-4 w-4" />
              本次考核获得 +{earnedPoints} 积分 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Weak points */}
      {wrongQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            薄弱点分析
          </h3>
          <div className="space-y-2">
            {wrongQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card/40"
              >
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2">{q.question}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    建议复习：{q.sourceCard}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-2"
      >
        <button className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity font-medium">
          <BookmarkPlus className="h-4 w-4" />
          保存至学习档案
        </button>
        <button className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-4 w-4" />
          分享结果至公会
        </button>
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          再来一次
        </button>
      </motion.div>
    </div>
  )
}

// ─── Main Exam Mode ───────────────────────────────────────────────────────────

type ExamStage = "config" | "exam" | "result"

export function ExamMode({
  onExamDataChange,
}: {
  onExamDataChange?: (data: {
    currentQuestion: number
    totalQuestions: number
    score: number
    sourceCard?: string
  }) => void
}) {
  const [stage, setStage] = useState<ExamStage>("config")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswerFeedback[]>([])
  const [waitingNext, setWaitingNext] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const questions = EXAM_QUESTIONS

  useEffect(() => {
    if (stage === "exam") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stage])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const handleAnswer = useCallback(
    (fb: AnswerFeedback) => {
      const newAnswers = [...answers, fb]
      setAnswers(newAnswers)
      setWaitingNext(true)

      const correctCount = newAnswers.filter((a) => a.correct).length
      onExamDataChange?.({
        currentQuestion: currentIdx + 1,
        totalQuestions: questions.length,
        score: Math.round((correctCount / newAnswers.length) * 100),
        sourceCard: questions[currentIdx]?.sourceCard,
      })
    },
    [answers, currentIdx, questions, onExamDataChange]
  )

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setStage("result")
    } else {
      setCurrentIdx((i) => i + 1)
      setWaitingNext(false)
    }
  }

  const handleRetry = () => {
    setStage("config")
    setCurrentIdx(0)
    setAnswers([])
    setWaitingNext(false)
    setElapsed(0)
    onExamDataChange?.(undefined as unknown as Parameters<typeof onExamDataChange>[0])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {stage === "exam" && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 shrink-0">
          {/* Progress */}
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentIdx + 1} / {questions.length}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden max-w-[160px]">
              <motion.div
                animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                className="h-full rounded-full bg-rose-500"
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Timer className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
          <button
            onClick={handleRetry}
            className="ml-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            退出
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {stage === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <ConfigStage onStart={() => setStage("exam")} />
            </motion.div>
          )}

          {stage === "exam" && (
            <motion.div
              key={`q-${currentIdx}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionCard
                question={questions[currentIdx]}
                index={currentIdx}
                total={questions.length}
                onAnswer={handleAnswer}
              />

              {/* Next button */}
              <AnimatePresence>
                {waitingNext && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 active:scale-95 transition-all text-sm font-medium"
                    >
                      {currentIdx + 1 >= questions.length ? (
                        <>查看结果 <Trophy className="h-4 w-4" /></>
                      ) : (
                        <>下一题 <ChevronRight className="h-4 w-4" /></>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultStage
                result={{
                  total: questions.length,
                  correct: answers.filter((a) => a.correct).length,
                  answers,
                }}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
