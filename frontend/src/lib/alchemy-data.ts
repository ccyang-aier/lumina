// ─── Alchemy Module Mock Data ────────────────────────────────────────────────

export type AIMode = "qa" | "generate" | "governance" | "learning" | "exam"

export type Confidence = "high" | "medium" | "low" | "none"

// ─── Knowledge Cards ─────────────────────────────────────────────────────────

export interface KnowledgeCard {
  id: string
  title: string
  author: string
  authority: number // 1-5
  excerpt: string
  tags: string[]
  updatedAt: string
}

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: "kc-001",
    title: "React useEffect 完整指南：副作用与依赖项管理",
    author: "张晓晨",
    authority: 5,
    excerpt:
      "useEffect 是 React 处理副作用的核心 Hook，正确理解其执行时机、依赖项数组及清理函数是写出高质量组件的关键。本文深入剖析常见陷阱与最佳实践。",
    tags: ["React", "Hooks", "前端"],
    updatedAt: "2024-01-10",
  },
  {
    id: "kc-002",
    title: "React 渲染优化：memo、useMemo 与 useCallback 的使用边界",
    author: "李雨萌",
    authority: 4,
    excerpt:
      "过早优化是万恶之源，但理解 memo 和 useMemo 的适用场景可以让你在必要时有的放矢。本文详细梳理三者的区别与最佳实践，附性能测量方法。",
    tags: ["React", "性能优化", "前端"],
    updatedAt: "2024-01-08",
  },
  {
    id: "kc-003",
    title: "Kafka 消费者组与消息分区策略深度解析",
    author: "王建国",
    authority: 5,
    excerpt:
      "Kafka 的消费者组机制是其高吞吐量的核心设计，分区与消费者之间的分配策略直接影响系统的水平扩展能力。本文从原理到实战全面覆盖。",
    tags: ["Kafka", "消息队列", "后端"],
    updatedAt: "2023-12-15",
  },
  {
    id: "kc-004",
    title: "Kubernetes Pod 生命周期与 OOM 排查实战",
    author: "陈志远",
    authority: 4,
    excerpt:
      "当 K8s Pod 频繁重启时，80% 的原因是 OOM（内存溢出）。本文总结了 OOM 的常见触发场景和系统化排查流程，附 kubectl 命令速查。",
    tags: ["Kubernetes", "DevOps", "运维"],
    updatedAt: "2022-09-20",
  },
  {
    id: "kc-005",
    title: "Next.js App Router 数据获取模式：Server Components 最佳实践",
    author: "赵梦琦",
    authority: 5,
    excerpt:
      "Next.js 13+ 引入的 App Router 和 Server Components 改变了前端数据获取的思维方式，本文系统整理各种数据获取模式的适用场景与性能影响。",
    tags: ["Next.js", "React", "前端"],
    updatedAt: "2024-01-12",
  },
  {
    id: "kc-006",
    title: "TypeScript 泛型进阶：条件类型与映射类型实战",
    author: "刘思源",
    authority: 4,
    excerpt:
      "条件类型和映射类型是 TypeScript 类型系统的精髓，掌握它们可以让你编写出优雅的类型工具函数，大幅提升代码的类型安全性与可维护性。",
    tags: ["TypeScript", "前端"],
    updatedAt: "2024-01-05",
  },
]

// ─── Q&A Chat Data ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: "user" | "ai"
  content: string
  confidence?: Confidence
  confidenceScore?: number
  citations?: string[]
  timestamp: Date
  isGapResult?: boolean
}

export interface HistorySession {
  id: string
  title: string
  preview: string
  timestamp: Date
  mode: AIMode
}

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content:
      "useEffect 里发起请求，用户快速切换页面时怎么处理竞态条件？",
    timestamp: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "msg-2",
    role: "ai",
    content: `处理 useEffect 中的竞态条件，核心是利用 **AbortController** 在组件卸载时中止请求。标准写法如下：

\`\`\`tsx
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(url, { signal: controller.signal })
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });
  
  return () => controller.abort();
}, [url]);
\`\`\`

当 \`url\` 改变触发 re-run 时，React 会先执行上一次的清理函数（调用 \`abort()\`），再执行新的 effect。这样即便旧请求比新请求晚返回，它的 \`.then\` 也会收到 AbortError 而被忽略[1]。

对于 React Query 等数据请求库，竞态问题已内置处理，可直接使用 \`useQuery\` 无需手动管理[2]。`,
    confidence: "high",
    confidenceScore: 0.93,
    citations: ["kc-001", "kc-002"],
    timestamp: new Date("2024-01-15T10:00:05"),
  },
  {
    id: "msg-3",
    role: "user",
    content:
      "Kafka 消费者一直 rebalance，lag 持续增加，怎么排查？",
    timestamp: new Date("2024-01-15T10:05:00"),
  },
  {
    id: "msg-4",
    role: "ai",
    content: `Kafka 消费者频繁 rebalance 并伴随 lag 增加，通常有以下几类原因，建议按优先级排查：

**1. 消费者心跳超时**
检查 \`session.timeout.ms\` 和 \`heartbeat.interval.ms\` 配置。如果消费者处理单条消息的时间超过 \`max.poll.interval.ms\`（默认 5 分钟），会触发自动 leave group[3]。

**2. GC 停顿导致假死**
观察消费者 JVM 的 GC 日志，Full GC 停顿超过 \`session.timeout.ms\` 会让 broker 误判消费者掉线。建议升级到 G1 或 ZGC，并适当增大 \`session.timeout.ms\`。

**3. 分区分配策略不均**
检查 \`partition.assignment.strategy\`，默认的 RangeAssignor 在多 topic 场景下容易导致分配不均，考虑切换到 StickyAssignor 以减少不必要的 rebalance。

**建议核实**：以上基于通用 Kafka 排查经验，你们的 broker 版本和具体配置可能有差异，建议结合监控面板的 consumer group 指标综合判断。`,
    confidence: "medium",
    confidenceScore: 0.72,
    citations: ["kc-003"],
    timestamp: new Date("2024-01-15T10:05:08"),
  },
  {
    id: "msg-5",
    role: "user",
    content:
      "我们团队想引入 eBPF 做服务网格的 sidecar 替代方案，有成熟的实践文档吗？",
    timestamp: new Date("2024-01-15T10:10:00"),
  },
  {
    id: "msg-6",
    role: "ai",
    content: `我在知识库中没有找到关于「eBPF 服务网格 sidecar 替代方案」的充分内容。知识库中有 Kubernetes 和服务治理相关的基础文档，但关于 eBPF（如 Cilium、Tetragon）的深度实践内容目前是空白。

这是一个值得填补的知识缺口——如果你们团队已有相关实践，非常欢迎贡献！`,
    confidence: "none",
    confidenceScore: 0,
    citations: [],
    timestamp: new Date("2024-01-15T10:10:04"),
    isGapResult: true,
  },
]

export const HISTORY_SESSIONS: HistorySession[] = [
  {
    id: "sess-1",
    title: "useEffect 竞态与 AbortController",
    preview: "useEffect 里发起请求，用户快速切换页面时...",
    timestamp: new Date("2024-01-15T10:00:00"),
    mode: "qa",
  },
  {
    id: "sess-2",
    title: "Next.js 缓存策略梳理",
    preview: "App Router 里 fetch 的 cache 选项到底怎么用...",
    timestamp: new Date("2024-01-14T14:30:00"),
    mode: "qa",
  },
  {
    id: "sess-3",
    title: "登录页文档生成增强",
    preview: "对登录模块设计文档进行摘要生成和标签建议...",
    timestamp: new Date("2024-01-14T09:15:00"),
    mode: "generate",
  },
  {
    id: "sess-4",
    title: "前端知识库季度质检",
    preview: "发现重复卡片 4 组，过期内容 7 张...",
    timestamp: new Date("2024-01-13T16:00:00"),
    mode: "governance",
  },
  {
    id: "sess-5",
    title: "前端新人学习路径规划",
    preview: "为前端工程师新人生成 1 个月学习路径...",
    timestamp: new Date("2024-01-12T11:00:00"),
    mode: "learning",
  },
]

// ─── Generate Mode Data ───────────────────────────────────────────────────────

export const GENERATE_DRAFT = `## 用户认证模块设计文档

本模块负责处理系统中所有与用户身份认证相关的功能，包括登录、注册、Token刷新和权限验证。

### 技术方案

采用JWT（JSON Web Token）作为认证凭证，AccessToken有效期设为15分钟，RefreshToken有效期30天。前端在axios拦截器中统一处理401响应，自动发起Token刷新请求。

登录接口支持账号密码和OAuth2.0（微信、GitHub）两种方式。密码采用bcrypt加密存储，salt rounds设为12。

### 接口清单

- POST /api/auth/login - 账号密码登录
- POST /api/auth/refresh - 刷新Token
- POST /api/auth/logout - 登出（将RefreshToken加入黑名单）
- GET /api/auth/me - 获取当前用户信息`

export type DiffType = "add" | "delete" | "modify" | "unchanged"

export interface DiffLine {
  type: DiffType
  content: string
  originalContent?: string
}

export const GENERATE_DIFF: DiffLine[] = [
  { type: "unchanged", content: "## 用户认证模块设计文档" },
  { type: "unchanged", content: "" },
  {
    type: "modify",
    originalContent:
      "本模块负责处理系统中所有与用户身份认证相关的功能，包括登录、注册、Token刷新和权限验证。",
    content:
      "本文档描述用户认证模块的设计与实现方案，涵盖登录、注册、Token 管理及权限校验四个核心流程，适用于所有接入 Lumina 平台的服务。",
  },
  { type: "unchanged", content: "" },
  { type: "unchanged", content: "### 技术方案" },
  { type: "unchanged", content: "" },
  {
    type: "unchanged",
    content:
      "采用JWT（JSON Web Token）作为认证凭证，AccessToken有效期设为15分钟，RefreshToken有效期30天。前端在axios拦截器中统一处理401响应，自动发起Token刷新请求。",
  },
  { type: "add", content: "" },
  {
    type: "add",
    content:
      "> **安全提示**：RefreshToken 应存储在 httpOnly Cookie 中，不建议存入 localStorage，以规避 XSS 攻击风险。",
  },
  { type: "unchanged", content: "" },
  {
    type: "unchanged",
    content:
      "登录接口支持账号密码和OAuth2.0（微信、GitHub）两种方式。密码采用bcrypt加密存储，salt rounds设为12。",
  },
  { type: "unchanged", content: "" },
  { type: "delete", content: "### 接口清单" },
  { type: "add", content: "### API 接口清单" },
  { type: "unchanged", content: "" },
  { type: "unchanged", content: "- POST /api/auth/login - 账号密码登录" },
  { type: "unchanged", content: "- POST /api/auth/refresh - 刷新Token" },
  {
    type: "unchanged",
    content: "- POST /api/auth/logout - 登出（将RefreshToken加入黑名单）",
  },
  { type: "unchanged", content: "- GET /api/auth/me - 获取当前用户信息" },
  {
    type: "add",
    content: "- POST /api/auth/oauth/callback - OAuth2.0 回调处理",
  },
  { type: "add", content: "" },
  { type: "add", content: "### 错误码规范" },
  { type: "add", content: "" },
  { type: "add", content: "| 错误码 | 含义 | 处理建议 |" },
  { type: "add", content: "|--------|------|----------|" },
  {
    type: "add",
    content: "| AUTH_001 | Token 已过期 | 自动刷新，失败则跳转登录 |",
  },
  {
    type: "add",
    content: "| AUTH_002 | Token 签名无效 | 清空本地凭证，强制重新登录 |",
  },
  {
    type: "add",
    content: "| AUTH_003 | 账号已被禁用 | 展示禁用原因，引导联系管理员 |",
  },
]

// ─── Governance Data ──────────────────────────────────────────────────────────

export type IssueType = "duplicate" | "expired" | "sensitive" | "factual"

export interface GovernanceIssue {
  id: string
  type: IssueType
  description: string
  cards: { id: string; title: string }[]
  severity: "high" | "medium" | "low"
  details: string
  similarity?: number
}

export const GOVERNANCE_ISSUES: GovernanceIssue[] = [
  {
    id: "gov-1",
    type: "duplicate",
    description: "相似度 94%，核心内容高度重合，主要差异仅在代码示例版本",
    cards: [
      { id: "kc-001", title: "React useEffect 完整指南：副作用与依赖项管理" },
      { id: "kc-007", title: "useEffect 最佳实践与常见陷阱" },
    ],
    severity: "high",
    similarity: 94,
    details:
      "两篇文章均深度覆盖 useEffect 的依赖项管理、清理函数和副作用处理，主要区别仅在于代码示例使用了不同的 React 版本（16 vs 18）。建议合并保留最新版本。",
  },
  {
    id: "gov-2",
    type: "duplicate",
    description: "相似度 78%，结构相似但各有侧重，可考虑合并后互相引用",
    cards: [
      {
        id: "kc-002",
        title: "React 渲染优化：memo、useMemo 与 useCallback 的使用边界",
      },
      { id: "kc-008", title: "React 性能优化实战指南" },
    ],
    severity: "medium",
    similarity: 78,
    details:
      "两篇均涉及 React 渲染优化，但前者侧重 memoization 原理，后者更偏向实战案例。可以保留两篇但增加交叉引用，或合并为一篇更完整的综合指南。",
  },
  {
    id: "gov-3",
    type: "expired",
    description:
      "内容创建于 18 个月前，涉及的 Webpack 4 配置已与当前主流版本不兼容",
    cards: [
      { id: "kc-009", title: "Webpack 配置优化：代码分割与 Tree-shaking" },
    ],
    severity: "high",
    details:
      "该卡片详细描述了 Webpack 4 的配置方案，但当前大多数项目已迁移至 Webpack 5（甚至 Vite/Turbopack），多处配置项已废弃或语法变更，照搬会导致构建错误。",
  },
  {
    id: "gov-4",
    type: "expired",
    description:
      "内容最后更新于 2022 年，其中描述的 Kubernetes 1.22 特性有部分 API 已在 1.26 正式移除",
    cards: [
      { id: "kc-004", title: "Kubernetes Pod 生命周期与 OOM 排查实战" },
    ],
    severity: "medium",
    details:
      "涉及到的 PodDisruptionBudget 和 HPA v2beta1 API 在 Kubernetes 1.26 中已被正式移除，需要更新为 v2 版本的写法。建议联系原作者更新或由熟悉 K8s 的同学认领维护。",
  },
  {
    id: "gov-5",
    type: "sensitive",
    description: "检测到疑似真实数据库连接凭证，包含明文密码字段",
    cards: [{ id: "kc-010", title: "PostgreSQL 生产环境配置与调优" }],
    severity: "high",
    details:
      '在文档的"配置示例"章节中，发现一段包含 `password: "Prod@2023#DB"` 的连接字符串，疑似真实生产环境凭证。已自动打上敏感标记，建议立即替换为占位符并检查该凭证是否已泄露。',
  },
]

// ─── Learning Path Data ───────────────────────────────────────────────────────

export type TaskStatus = "completed" | "today" | "pending"

export interface LearningTask {
  id: string
  title: string
  cardTitle: string
  estimatedMinutes: number
  status: TaskStatus
}

export interface LearningPhase {
  id: string
  title: string
  subtitle: string
  tasks: LearningTask[]
}

export const LEARNING_PATH: LearningPhase[] = [
  {
    id: "phase-1",
    title: "第一周 · 筑基",
    subtitle: "建立前端工程化思维，掌握核心工具链",
    tasks: [
      {
        id: "t-1",
        title: "前端工程化概述",
        cardTitle: "Lumina 前端工程化体系全景图",
        estimatedMinutes: 30,
        status: "completed",
      },
      {
        id: "t-2",
        title: "TypeScript 基础类型系统",
        cardTitle: "TypeScript 从入门到实践：类型系统精要",
        estimatedMinutes: 45,
        status: "completed",
      },
      {
        id: "t-3",
        title: "React 核心概念",
        cardTitle: "React 19 核心概念与心智模型",
        estimatedMinutes: 60,
        status: "completed",
      },
      {
        id: "t-4",
        title: "Next.js 路由与布局",
        cardTitle: "Next.js App Router 完整指南",
        estimatedMinutes: 40,
        status: "completed",
      },
    ],
  },
  {
    id: "phase-2",
    title: "第二周 · 进阶实战",
    subtitle: "深入 React 生态，掌握状态管理与数据获取",
    tasks: [
      {
        id: "t-5",
        title: "useEffect 与副作用管理",
        cardTitle: "React useEffect 完整指南：副作用与依赖项管理",
        estimatedMinutes: 50,
        status: "today",
      },
      {
        id: "t-6",
        title: "渲染性能优化",
        cardTitle: "React 渲染优化：memo、useMemo 与 useCallback 的使用边界",
        estimatedMinutes: 45,
        status: "pending",
      },
      {
        id: "t-7",
        title: "Tailwind CSS 与设计系统",
        cardTitle: "Tailwind CSS 设计系统实战：从配置到组件",
        estimatedMinutes: 35,
        status: "pending",
      },
      {
        id: "t-8",
        title: "API 请求与错误处理",
        cardTitle: "前端请求封装最佳实践：axios 拦截器与错误边界",
        estimatedMinutes: 40,
        status: "pending",
      },
    ],
  },
  {
    id: "phase-3",
    title: "第三周 · 工程实践",
    subtitle: "掌握测试、CI/CD 与团队协作规范",
    tasks: [
      {
        id: "t-9",
        title: "Jest 单元测试入门",
        cardTitle: "前端单元测试实战：Jest + React Testing Library",
        estimatedMinutes: 55,
        status: "pending",
      },
      {
        id: "t-10",
        title: "Git 工作流规范",
        cardTitle: "团队 Git 工作流：分支策略与 Commit 规范",
        estimatedMinutes: 25,
        status: "pending",
      },
      {
        id: "t-11",
        title: "CI/CD 流水线配置",
        cardTitle: "GitHub Actions 前端 CI/CD 配置指南",
        estimatedMinutes: 40,
        status: "pending",
      },
      {
        id: "t-12",
        title: "前端监控与错误追踪",
        cardTitle: "Sentry 在前端项目中的接入与告警配置",
        estimatedMinutes: 30,
        status: "pending",
      },
    ],
  },
]

// ─── Exam Questions ───────────────────────────────────────────────────────────

export type QuestionType = "single" | "multi" | "judge" | "short"

export interface ExamQuestion {
  id: string
  type: QuestionType
  question: string
  options?: { id: string; text: string }[]
  answer: string | string[] | boolean
  explanation: string
  sourceCard: string
  sourceExcerpt: string
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: "q-1",
    type: "single",
    question:
      "在 React 的 useEffect 中，以下哪种方式能正确处理异步请求的竞态条件？",
    options: [
      {
        id: "a",
        text: "使用 async/await 直接在 useEffect 回调函数体中发起请求",
      },
      { id: "b", text: "使用 AbortController 并在清理函数中调用 abort()" },
      { id: "c", text: "将请求结果缓存在 useRef 中避免重复触发" },
      { id: "d", text: "使用 useLayoutEffect 替代 useEffect 发起请求" },
    ],
    answer: "b",
    explanation:
      "AbortController 允许你在 useEffect 的清理函数中中止正在进行的请求。当依赖项变化触发重新执行时，React 会先调用上一次的清理函数，从而中止旧请求，确保只有最新的请求结果会更新状态。async/await 无法阻止旧请求的回调执行，useRef 只能缓存结果并不能取消请求，useLayoutEffect 与竞态条件无关。",
    sourceCard: "React useEffect 完整指南：副作用与依赖项管理",
    sourceExcerpt:
      "竞态条件的核心解决方案是在 cleanup 函数中调用 controller.abort()，使旧请求在触发 AbortError 后被静默忽略，从而保证状态始终反映最新一次请求的结果...",
  },
  {
    id: "q-2",
    type: "multi",
    question: "以下关于 React.memo 的描述，哪些是正确的？（多选）",
    options: [
      {
        id: "a",
        text: "React.memo 对 props 进行浅比较，props 引用未变则跳过重渲染",
      },
      {
        id: "b",
        text: "包裹了 React.memo 的组件，其内部 useState 状态变化仍会触发重渲染",
      },
      {
        id: "c",
        text: "React.memo 可以接受第二个参数，自定义 props 比较逻辑",
      },
      {
        id: "d",
        text: "所有组件都应该用 React.memo 包裹以获得最佳整体性能",
      },
    ],
    answer: ["a", "b", "c"],
    explanation:
      "React.memo 只对父组件传入的 props 进行浅比较，不影响组件自身的状态更新（b 正确）。它支持第二个参数 areEqual 函数进行自定义比较（c 正确）。但并非所有组件都适合使用——比较操作本身有开销，对于简单组件或 props 频繁变化的组件，memo 反而可能引入额外消耗（d 错误）。",
    sourceCard: "React 渲染优化：memo、useMemo 与 useCallback 的使用边界",
    sourceExcerpt:
      "React.memo 的比较是浅比较（shallow comparison），这意味着对象类型的 props 需要保持引用稳定才能真正发挥优化效果，通常需要配合 useCallback 和 useMemo 一起使用...",
  },
  {
    id: "q-3",
    type: "judge",
    question:
      "Kafka 消费者组中，一个 partition 在同一时刻只能被同一消费者组内的一个消费者消费。",
    answer: true,
    explanation:
      "这是 Kafka 消费者组的核心保证——在同一个消费者组内，每个 partition 只能分配给一个消费者实例。这一设计保证了消息的有序消费，同时通过多分区实现了水平扩展。如果消费者数量超过 partition 数量，多余的消费者会处于空闲等待状态。",
    sourceCard: "Kafka 消费者组与消息分区策略深度解析",
    sourceExcerpt:
      "消费者组的分区独占原则：同一时刻，一个 partition 只会被组内唯一一个消费者实例持有，这是 Kafka 实现有序消费的基础保障。不同消费者组之间则可以独立消费同一 partition...",
  },
  {
    id: "q-4",
    type: "single",
    question:
      "Next.js App Router 中，以下哪种方式获取的数据默认会被缓存并在多个请求间共享？",
    options: [
      { id: "a", text: "在客户端组件的 useEffect 中调用 fetch" },
      {
        id: "b",
        text: "在 Server Component 中调用 fetch（不添加 cache: 'no-store'）",
      },
      { id: "c", text: "在 API Route Handler 中调用第三方 fetch 库" },
      { id: "d", text: "在客户端组件中使用 SWR 的 useSWR hook" },
    ],
    answer: "b",
    explanation:
      "Next.js 扩展了原生 fetch，在 Server Component 中调用 fetch 时，默认会启用请求级别的 Request Memoization 和 Data Cache。同一渲染周期内相同 URL 的请求会自动去重，而 useEffect 和 SWR 都运行在客户端，不受 Next.js 服务端缓存控制。Route Handler 中的 fetch 也不会被自动缓存。",
    sourceCard: "Next.js App Router 数据获取模式：Server Components 最佳实践",
    sourceExcerpt:
      "Next.js 对 fetch 进行了扩展，在 Server Components 中默认开启了 Request Memoization，同一渲染树中相同 URL 的 fetch 调用只会发起一次网络请求，结果在组件树中共享...",
  },
  {
    id: "q-5",
    type: "multi",
    question:
      "Kubernetes 中，Pod 发生 OOMKilled 时，以下哪些措施可以有效缓解问题？（多选）",
    options: [
      { id: "a", text: "增大 Pod 的 resources.limits.memory 配置值" },
      { id: "b", text: "优化应用代码，排查并修复内存泄漏问题" },
      {
        id: "c",
        text: "将 resources.requests.memory 设置为与 limits 相同的值（Guaranteed QoS）",
      },
      {
        id: "d",
        text: "删除所有资源限制，让容器自由使用节点内存",
      },
    ],
    answer: ["a", "b", "c"],
    explanation:
      "增大 limits 提供更多可用内存（a 有效）；优化代码解决根本问题（b 有效）；requests 与 limits 相同可获得 Guaranteed QoS 类别，减少被驱逐概率（c 有效）。而删除所有资源限制会导致一个容器耗尽整个节点内存，影响同节点其他服务，是危险的操作（d 错误）。",
    sourceCard: "Kubernetes Pod 生命周期与 OOM 排查实战",
    sourceExcerpt:
      "设置 requests = limits 可使 Pod 获得 Guaranteed QoS 等级，这类 Pod 是最后被驱逐的，也不会因节点内存压力被随意 OOMKill。Burstable 和 BestEffort QoS 的 Pod 在内存不足时会被优先终止...",
  },
]
