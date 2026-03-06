export interface KnowledgeCardData {
  id: number | string
  title: string
  description: string
  image?: string
  tags: string[]
  domain?: string
  author: {
    name: string
    avatar?: string
    guild?: string
    bio?: string
  }
  publishDate: string
  stats: {
    views: number
    likes: number
    comments: number
  }
  type: "document" | "tutorial" | "faq" | "talk" | "script"
  location?: {
    series: string
    seriesId: string
    chapter: string
    chapterIndex: number
  }
  status?: string
  content?: string
}

export interface SeriesChapter {
  id: number | string
  title: string
  chapterIndex: number
  chapter: string
}

export interface SeriesGroup {
  id: string
  title: string
  icon?: "book" | "cpu" | "zap" | "shield" | "layers" | "code" | "database" | "settings"
  chapters: SeriesChapter[]
}

export interface SeriesData {
  id: string
  title: string
  description: string
  totalChapters: number
  level: string
  lastUpdated?: string
  /** Flat list kept for backward compat (prev/next nav etc.) */
  cards: SeriesChapter[]
  /** Optional nested group structure for sidebar display */
  groups?: SeriesGroup[]
}

const AI_AGENT_CONTENT = `## 引言

在企业级软件的演进历程中，**AI Agent**（自主智能体）正在成为一个颠覆性的技术范式。不同于传统的基于规则的自动化，AI Agent 能够感知环境、制定计划、执行动作，并在反馈中不断调整策略。

> 本文将从技术架构、落地实践与挑战三个维度，系统梳理 AI Agent 在企业级应用中的现状与未来。

## Agent 的核心架构

一个典型的 AI Agent 系统由以下核心组件构成：

### 感知层（Perception）

感知层负责接收来自外部环境的各类信号——用户输入、API 数据、数据库查询结果、文件内容等。现代 Agent 系统通常支持**多模态输入**，包括文本、图像、音频乃至结构化数据。

### 规划与推理引擎（Planning & Reasoning）

这是 Agent 的"大脑"，通常由一个强大的 LLM（如 GPT-4、Claude）担任。它负责：

1. **任务分解**：将复杂目标拆解为可执行的子步骤
2. **工具选择**：从可用工具列表中选择最合适的执行路径
3. **上下文管理**：维护对话历史与任务状态
4. **错误恢复**：在执行失败时重新规划

### 记忆系统（Memory）

\`\`\`plaintext
短期记忆（Working Memory）
  └── 当前任务上下文、对话历史

长期记忆（Long-term Memory）
  ├── 向量数据库（语义检索）
  └── 结构化存储（精确查询）
\`\`\`

### 工具层（Tools / Actions）

工具层是 Agent 与外部世界交互的接口，常见工具包括：

\`\`\`typescript
const tools = [
  {
    name: "web_search",
    description: "Search the web for real-time information",
    parameters: {
      query: { type: "string", required: true },
      num_results: { type: "number", default: 5 }
    }
  },
  {
    name: "code_executor",
    description: "Execute Python code in a sandboxed environment",
    parameters: {
      code: { type: "string", required: true },
      timeout: { type: "number", default: 30 }
    }
  },
  {
    name: "database_query",
    description: "Query the enterprise database via natural language",
    parameters: {
      query: { type: "string", required: true },
      database: { type: "string", enum: ["sales", "inventory", "hr"] }
    }
  }
]
\`\`\`

## 企业落地实践

### 案例一：智能客服与工单处理

某大型电商平台部署了基于 Agent 的智能客服系统。系统采用**多 Agent 协作**架构：

\`\`\`python
class CustomerServiceAgent:
    def __init__(self, llm, tools, memory):
        self.llm = llm
        self.tools = tools
        self.memory = memory
        
    async def handle_ticket(self, ticket: Ticket) -> Resolution:
        # 1. 检索历史相似工单
        similar_cases = await self.memory.search(
            query=ticket.description,
            top_k=5
        )
        
        # 2. 分析问题类型
        issue_type = await self.llm.classify(
            ticket.description,
            categories=["billing", "shipping", "product", "technical"]
        )
        
        # 3. 路由到专业子 Agent
        specialist = self.get_specialist(issue_type)
        resolution = await specialist.solve(ticket, similar_cases)
        
        # 4. 更新记忆
        await self.memory.store(ticket, resolution)
        return resolution
\`\`\`

**效果数据：**

| 指标 | 人工处理 | Agent 处理 | 提升 |
|------|---------|-----------|------|
| 平均处理时间 | 8.5分钟 | 1.2分钟 | ↑86% |
| 首次解决率 | 72% | 85% | ↑13pp |
| 客户满意度 | 4.1/5 | 4.3/5 | ↑5% |
| 人力成本 | $42/工单 | $3.2/工单 | ↓92% |

### 案例二：代码审查与安全扫描

某金融科技公司将 Agent 集成到 CI/CD 流水线中：

\`\`\`yaml
# .github/workflows/ai-review.yml
name: AI Code Review
on:
  pull_request:
    branches: [main, develop]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run AI Agent Review
        uses: lumina/ai-code-reviewer@v2
        with:
          focus_areas: |
            - security_vulnerabilities
            - performance_bottlenecks
            - code_style_violations
            - test_coverage_gaps
          severity_threshold: medium
          auto_fix: true
\`\`\`

## 核心挑战与解决方案

### 挑战一：幻觉与可靠性

**问题**：LLM 可能生成看起来合理但实际错误的输出，在企业关键流程中风险极高。

**解决方案**：
- **多 Agent 验证**：引入独立的"批评者 Agent"对主 Agent 的输出进行二次验证
- **工具接地**（Tool Grounding）：强制要求 Agent 通过工具获取事实，而非凭空生成
- **置信度阈值**：设置最低置信度要求，低于阈值时自动升级至人工处理

\`\`\`python
class VerifiedAgent:
    async def execute(self, task):
        result = await self.primary_agent.run(task)
        
        # 多轮验证
        for validator in self.validators:
            confidence = await validator.check(result)
            if confidence < self.threshold:
                result = await self.primary_agent.retry(
                    task, 
                    feedback=validator.feedback
                )
        
        return result if confidence >= self.threshold else self.escalate(task)
\`\`\`

### 挑战二：成本与延迟

Agent 系统因需多次调用 LLM API，往往面临**高成本**和**高延迟**问题。

**优化策略**：

1. **缓存层**：对相似请求复用 LLM 输出
2. **模型分级**：简单任务用小模型，复杂任务用大模型
3. **并行执行**：无依赖的子任务并行处理
4. **流式响应**：使用 SSE 提升用户体验

### 挑战三：安全与权限控制

企业环境中，Agent 拥有的工具权限必须受到严格管控。

\`\`\`typescript
// 基于角色的工具访问控制
const agentPermissions = {
  "customer-service": {
    allowed: ["search_knowledge_base", "update_ticket_status"],
    denied: ["delete_records", "access_financial_data"]
  },
  "data-analyst": {
    allowed: ["read_database", "execute_python", "export_csv"],
    denied: ["write_database", "access_pii"]
  }
}
\`\`\`

## 未来展望

随着 **Agentic AI** 范式的成熟，我们预见以下趋势：

1. **Multi-Agent 协作网络**：专业化 Agent 组成类似企业组织的协作网络
2. **持续学习**：Agent 从每次任务中积累经验，持续改进
3. **边缘部署**：小型化 Agent 在本地设备运行，保护数据隐私
4. **人机协作**：Agent 作为人类的智能助理，而非替代者

## 总结

AI Agent 在企业级应用的落地是一个系统工程，需要在**技术选型**、**架构设计**、**安全治理**和**组织变革**等多个维度协同推进。成功的案例表明，从单一场景的试点做起，逐步积累经验和数据，是最稳健的路径。

> **核心要点**：不要尝试用 Agent 一次性解决所有问题，而是找到最具价值的单一场景，快速验证，快速迭代。`

const FRONTEND_ARCH_CONTENT = `## 前言

随着 Web 应用复杂度的持续提升，前端架构正经历一场深刻的变革。**React Server Components (RSC)** 与 **Islands Architecture** 代表了两种不同的思路，共同指向同一个目标：在保持优秀开发体验的同时，最大化 Web 性能。

## React Server Components 深度解析

### 什么是 Server Components？

RSC 是 React 18 引入的全新范式，允许组件在服务器上渲染并流式传输到客户端，**完全不向客户端发送 JavaScript**。

\`\`\`jsx
// ServerComponent.jsx - 运行在服务器，不发送 JS 到客户端
async function UserProfile({ userId }) {
  // 可以直接访问数据库！无需 API
  const user = await db.users.findById(userId)
  const posts = await db.posts.findByUser(userId)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <PostList posts={posts} />
      {/* 只有需要交互的部分才是 Client Component */}
      <FollowButton userId={userId} />
    </div>
  )
}
\`\`\`

### RSC 的性能优势

| 特性 | 传统 SSR | React Server Components |
|------|---------|------------------------|
| JS Bundle 大小 | 全部组件 | 仅 Client Components |
| 数据获取 | 客户端 fetch | 服务器直接访问 |
| 瀑布请求 | 常见 | 可并行消除 |
| 流式渲染 | 有限 | 原生支持 |

## Islands Architecture

Islands Architecture（孤岛架构）由 Preact 作者 Jason Miller 提出，核心思想是：**在静态 HTML 海洋中，只有需要交互的"孤岛"才被水合（Hydrate）**。

\`\`\`html
<!-- 页面大部分是静态 HTML -->
<article>
  <h1>文章标题</h1>
  <p>静态内容...</p>
  
  <!-- 仅这个评论组件需要 JS -->
  <island-component src="./CommentSection.jsx">
    <!-- 服务器渲染的 HTML 作为占位 -->
    <div class="comments-placeholder">加载中...</div>
  </island-component>
</article>
\`\`\`

## 两者的核心区别

**RSC 是 React 生态的方案**，需要 React 运行时；**Islands 是框架无关的架构理念**，Astro、Fresh 等框架都有实现。

两者可以结合使用：在 RSC 架构中，Client Components 就是"孤岛"。

## 实践建议

1. **新项目**：优先选择 Next.js App Router，默认 RSC
2. **内容为主的网站**：考虑 Astro 的 Islands 方案
3. **现有项目迁移**：渐进式引入，从叶子组件开始服务器化`

export const MOCK_SERIES: Record<string, SeriesData> = {
  "ai-frontier": {
    id: "ai-frontier",
    title: "AI 前沿探索",
    description: "深入剖析 AI 技术前沿，从理论到实践的系统性指南",
    totalChapters: 10,
    level: "Advanced",
    lastUpdated: "2024-03-20",
    cards: [
      { id: 1,  title: "AI Agent 在企业级应用中的落地实践与挑战", chapterIndex: 1,  chapter: "Agent 崛起" },
      { id: 12, title: "大语言模型的 Prompt Engineering 进阶技巧",   chapterIndex: 2,  chapter: "提示工程进阶" },
      { id: 13, title: "向量数据库选型与 RAG 架构最佳实践",           chapterIndex: 3,  chapter: "RAG 系统设计" },
      { id: 14, title: "Fine-tuning vs RAG：企业 AI 应用的战略选择",  chapterIndex: 4,  chapter: "模型优化策略" },
      { id: 15, title: "多模态 AI 在垂直行业的应用探索",               chapterIndex: 5,  chapter: "多模态实战" },
      { id: 16, title: "AI 安全与对齐：构建可信赖的 AI 系统",          chapterIndex: 6,  chapter: "AI 安全对齐" },
      { id: 17, title: "LLM 推理优化：从量化到 KV Cache",              chapterIndex: 7,  chapter: "推理加速" },
      { id: 18, title: "企业 AI 治理框架与合规实践",                   chapterIndex: 8,  chapter: "治理合规" },
      { id: 19, title: "AI 基础设施：GPU 集群与调度系统",              chapterIndex: 9,  chapter: "基础设施" },
      { id: 20, title: "下一代 AI：从 Agent 到 AGI 的路径",            chapterIndex: 10, chapter: "未来展望" },
    ],
    groups: [
      {
        id: "core-concepts",
        title: "核心概念",
        icon: "book",
        chapters: [
          { id: 1,  title: "AI Agent 在企业级应用中的落地实践与挑战", chapterIndex: 1,  chapter: "Agent 崛起" },
          { id: 12, title: "大语言模型的 Prompt Engineering 进阶技巧", chapterIndex: 2,  chapter: "提示工程进阶" },
        ],
      },
      {
        id: "rag-and-tuning",
        title: "RAG 与模型优化",
        icon: "database",
        chapters: [
          { id: 13, title: "向量数据库选型与 RAG 架构最佳实践",          chapterIndex: 3, chapter: "RAG 系统设计" },
          { id: 14, title: "Fine-tuning vs RAG：企业 AI 应用的战略选择", chapterIndex: 4, chapter: "模型优化策略" },
        ],
      },
      {
        id: "multimodal-and-safety",
        title: "多模态与安全",
        icon: "shield",
        chapters: [
          { id: 15, title: "多模态 AI 在垂直行业的应用探索",      chapterIndex: 5, chapter: "多模态实战" },
          { id: 16, title: "AI 安全与对齐：构建可信赖的 AI 系统", chapterIndex: 6, chapter: "AI 安全对齐" },
        ],
      },
      {
        id: "infrastructure",
        title: "基础设施与运营",
        icon: "settings",
        chapters: [
          { id: 17, title: "LLM 推理优化：从量化到 KV Cache",    chapterIndex: 7, chapter: "推理加速" },
          { id: 18, title: "企业 AI 治理框架与合规实践",          chapterIndex: 8, chapter: "治理合规" },
          { id: 19, title: "AI 基础设施：GPU 集群与调度系统",     chapterIndex: 9, chapter: "基础设施" },
        ],
      },
      {
        id: "future",
        title: "前沿与展望",
        icon: "zap",
        chapters: [
          { id: 20, title: "下一代 AI：从 Agent 到 AGI 的路径", chapterIndex: 10, chapter: "未来展望" },
        ],
      },
    ],
  },
  "frontend-evolution": {
    id: "frontend-evolution",
    title: "前端架构演进",
    description: "从 SPA 到 RSC，系统梳理现代前端架构的演变历程",
    totalChapters: 5,
    level: "Intermediate",
    lastUpdated: "2024-03-18",
    cards: [
      { id: 21, title: "SPA 的巅峰与困境：从 jQuery 到 React", chapterIndex: 1, chapter: "第一章：SPA 时代" },
      { id: 22, title: "SSR 的回归：Next.js Pages Router 深度解析", chapterIndex: 2, chapter: "第二章：SSR 复兴" },
      { id: 2, title: "下一代前端架构：Server Components 与 Islands Architecture", chapterIndex: 3, chapter: "第三章：服务端渲染复兴" },
      { id: 23, title: "微前端架构：大型团队的模块化之路", chapterIndex: 4, chapter: "第四章：微前端" },
      { id: 24, title: "Edge Runtime 与全栈的未来", chapterIndex: 5, chapter: "第五章：边缘计算" },
    ],
    groups: [
      {
        id: "history",
        title: "历史演进",
        icon: "layers",
        chapters: [
          { id: 21, title: "SPA 的巅峰与困境：从 jQuery 到 React", chapterIndex: 1, chapter: "第一章：SPA 时代" },
          { id: 22, title: "SSR 的回归：Next.js Pages Router 深度解析", chapterIndex: 2, chapter: "第二章：SSR 复兴" },
        ],
      },
      {
        id: "modern",
        title: "现代架构",
        icon: "code",
        chapters: [
          { id: 2, title: "下一代前端架构：Server Components 与 Islands Architecture", chapterIndex: 3, chapter: "第三章：服务端渲染复兴" },
          { id: 23, title: "微前端架构：大型团队的模块化之路", chapterIndex: 4, chapter: "第四章：微前端" },
          { id: 24, title: "Edge Runtime 与全栈的未来", chapterIndex: 5, chapter: "第五章：边缘计算" },
        ],
      },
    ],
  },
  "design-psychology": {
    id: "design-psychology",
    title: "设计心理学",
    description: "从认知科学视角理解用户行为，设计更好的产品体验",
    totalChapters: 4,
    level: "Beginner",
    lastUpdated: "2024-03-10",
    cards: [
      { id: 25, title: "认知负荷理论：设计如何减少用户的思维负担", chapterIndex: 1, chapter: "第一章：认知负荷" },
      { id: 4, title: "用户体验设计的心理学原理：从认知负荷到情感设计", chapterIndex: 2, chapter: "认知与情感" },
      { id: 26, title: "行为经济学在产品设计中的应用", chapterIndex: 3, chapter: "第三章：行为设计" },
      { id: 27, title: "情感设计：让产品有温度", chapterIndex: 4, chapter: "第四章：情感化设计" },
    ],
  },
  "data-storytelling": {
    id: "data-storytelling",
    title: "数据叙事",
    description: "用数据讲故事，让复杂数据变得清晰易懂",
    totalChapters: 4,
    level: "Intermediate",
    lastUpdated: "2024-03-05",
    cards: [
      { id: 28, title: "数据可视化基础：选择正确的图表类型", chapterIndex: 1, chapter: "第一章：图表基础" },
      { id: 29, title: "颜色理论在数据可视化中的应用", chapterIndex: 2, chapter: "第二章：颜色运用" },
      { id: 6, title: "数据可视化之美：如何用图表讲述引人入胜的故事", chapterIndex: 3, chapter: "视觉隐喻" },
      { id: 30, title: "交互式数据可视化：D3.js 进阶实战", chapterIndex: 4, chapter: "第四章：交互设计" },
    ],
  },
}

export const MOCK_CARDS: KnowledgeCardData[] = [
  {
    id: 1,
    title: "AI Agent 在企业级应用中的落地实践与挑战",
    description: "探讨自主智能体如何重塑企业工作流与决策过程，分析当前面临的主要技术瓶颈与解决方案。",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    tags: ["AI Agent", "企业应用", "自动化"],
    domain: "人工智能",
    author: { name: "Sarah Chen", guild: "技术工坊", avatar: "https://github.com/shadcn.png", bio: "AI 系统架构师，专注于企业级 LLM 应用落地，曾主导多个大型 AI 转型项目。" },
    publishDate: "2024-03-15",
    stats: { views: 1205, likes: 342, comments: 45 },
    type: "tutorial",
    status: "in_progress",
    location: { series: "AI 前沿探索", seriesId: "ai-frontier", chapter: "第一章：Agent 崛起", chapterIndex: 1 },
    content: AI_AGENT_CONTENT,
  },
  {
    id: 2,
    title: "下一代前端架构：Server Components 与 Islands Architecture",
    description: "深入解析 React Server Components (RSC) 与 Islands 架构的异同，以及它们如何提升 Web 应用性能。",
    type: "document",
    tags: ["React", "架构", "性能优化"],
    domain: "工程技术",
    author: { name: "David Lee", guild: "前端公会", bio: "前端架构师，Next.js 开源贡献者，专注于 Web 性能优化与现代前端工程化实践。" },
    publishDate: "2024-03-14",
    stats: { views: 890, likes: 210, comments: 32 },
    status: "collected",
    location: { series: "前端架构演进", seriesId: "frontend-evolution", chapter: "第三章：服务端渲染复兴", chapterIndex: 3 },
    content: FRONTEND_ARCH_CONTENT,
  },
  {
    id: 3,
    title: "Web3 去中心化身份 (DID) 技术白皮书解读",
    description: "详细解读 W3C DID 规范，探讨去中心化身份在数字主权、隐私保护等领域的应用前景。",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    tags: ["Web3", "DID", "区块链"],
    domain: "信息安全",
    author: { name: "CryptoPunk", guild: "密码学会", bio: "密码学研究员，Web3 技术布道者，长期活跃于以太坊社区。" },
    publishDate: "2024-03-12",
    stats: { views: 2300, likes: 560, comments: 89 },
    type: "document",
    status: "unstarted",
    content: `## 什么是去中心化身份？\n\n**去中心化身份（Decentralized Identifier，DID）**是一种新型的数字身份标准，由 W3C 于 2022 年正式发布。\n\n与传统身份系统依赖中心化机构不同，DID 让用户真正**掌控自己的数字身份**。\n\n## DID 的核心组成\n\n\`\`\`json\n{\n  "@context": "https://www.w3.org/ns/did/v1",\n  "id": "did:example:123456789abcdefghi",\n  "verificationMethod": [{\n    "id": "did:example:123#keys-1",\n    "type": "Ed25519VerificationKey2020",\n    "controller": "did:example:123",\n    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\n  }]\n}\n\`\`\``,
  },
  {
    id: 4,
    title: "用户体验设计的心理学原理：从认知负荷到情感设计",
    description: "结合认知心理学与行为经济学，分析如何设计出既好用又动人的产品界面。",
    tags: ["UX设计", "心理学", "产品思维"],
    domain: "产品设计",
    author: { name: "Emily Wang", guild: "设计研究院", bio: "用户体验研究员，专注于认知心理学与产品设计的交叉领域研究。" },
    publishDate: "2024-03-10",
    stats: { views: 1500, likes: 420, comments: 67 },
    type: "tutorial",
    status: "completed",
    location: { series: "设计心理学", seriesId: "design-psychology", chapter: "认知与情感", chapterIndex: 2 },
    content: `## 认知负荷理论\n\n认知负荷（Cognitive Load）是指用户在完成任务时需要投入的心理能量总量。设计的核心目标之一，就是**最小化不必要的认知负荷**。\n\n### 三种认知负荷类型\n\n| 类型 | 来源 | 设计建议 |\n|------|------|----------|\n| 内在负荷 | 任务本身的复杂性 | 分步骤引导，渐进披露 |\n| 外在负荷 | 界面设计不当 | 减少视觉噪音，清晰层级 |\n| 相关负荷 | 学习与理解过程 | 利用用户已有心智模型 |\n\n## 情感设计三层次\n\nDon Norman 在《情感化设计》中提出三个层次：\n\n1. **本能层（Visceral）**：视觉美感，第一印象\n2. **行为层（Behavioral）**：操作流畅，任务完成\n3. **反思层（Reflective）**：品牌认同，身份认同`,
  },
  {
    id: 5,
    title: "云原生架构下的微服务治理与可观测性实践",
    description: "分享基于 Istio 与 Prometheus 的微服务治理经验，构建全链路可观测性系统。",
    image: "https://images.unsplash.com/photo-1667372393119-c81c0e8303f9?auto=format&fit=crop&q=80&w=800",
    tags: ["云原生", "微服务", "DevOps"],
    domain: "工程技术",
    author: { name: "James Bond", guild: "运维指挥部", bio: "云原生架构师，CNCF 社区成员，Kubernetes 认证专家。" },
    publishDate: "2024-03-08",
    stats: { views: 1800, likes: 380, comments: 55 },
    type: "document",
    status: "in_progress",
    content: `## 微服务治理的核心挑战\n\n随着服务数量从个位数增长到数百个，**服务治理**成为云原生架构最复杂的课题之一。\n\n## 可观测性三支柱\n\n\`\`\`plaintext\n可观测性（Observability）\n├── Metrics（指标）：Prometheus + Grafana\n├── Logs（日志）：ELK Stack / Loki\n└── Traces（链路追踪）：Jaeger / Tempo\n\`\`\`\n\n## Istio 服务网格\n\n\`\`\`yaml\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: user-service\nspec:\n  hosts:\n  - user-service\n  http:\n  - match:\n    - headers:\n        canary:\n          exact: "true"\n    route:\n    - destination:\n        host: user-service\n        subset: v2\n      weight: 100\n  - route:\n    - destination:\n        host: user-service\n        subset: v1\n      weight: 100\n\`\`\``,
  },
  {
    id: 6,
    title: "数据可视化之美：如何用图表讲述引人入胜的故事",
    description: "探索数据可视化的艺术与科学，学习如何选择正确的图表类型来有效传达信息。",
    tags: ["数据可视化", "D3.js", "设计"],
    domain: "数据分析",
    author: { name: "Alice Wonderland", guild: "数据洞察组", bio: "数据科学家兼可视化设计师，曾为多家财富500强企业提供数据战略咨询。" },
    publishDate: "2024-03-05",
    stats: { views: 950, likes: 275, comments: 28 },
    type: "talk",
    status: "unstarted",
    location: { series: "数据叙事", seriesId: "data-storytelling", chapter: "视觉隐喻", chapterIndex: 3 },
    content: `## 为什么数据需要故事？\n\n人类大脑处理图像的速度比文字快 **60,000 倍**。好的数据可视化不只是呈现数据，而是帮助观众理解数据背后的**意义与行动建议**。\n\n## 视觉隐喻的力量\n\n视觉隐喻是将抽象数据映射到具体视觉形式的过程：\n\n- **高度/长度** → 数量大小（柱状图）\n- **面积** → 比例关系（气泡图、树图）\n- **颜色** → 分类或强度（热力图）\n- **位置** → 相关性与趋势（散点图、折线图）\n\n## 图表选择框架\n\n\`\`\`\n你想表达什么？\n├── 比较 → 柱状图、雷达图\n├── 构成 → 饼图、堆叠柱状图\n├── 分布 → 直方图、箱线图\n├── 关系 → 散点图、气泡图\n└── 趋势 → 折线图、面积图\n\`\`\``,
  },
  {
    id: 7,
    title: "Rust 语言在高性能计算中的应用",
    description: "分析 Rust 语言的内存安全机制与零成本抽象特性，及其在高性能计算领域的优势。",
    tags: ["Rust", "HPC", "系统编程"],
    domain: "工程技术",
    author: { name: "Rustacean", guild: "后端工坊", bio: "系统程序员，Rust 语言爱好者，专注于高性能网络服务与系统级开发。" },
    publishDate: "2024-03-04",
    stats: { views: 1100, likes: 290, comments: 40 },
    type: "tutorial",
    status: "collected",
    content: `## Rust 的核心优势\n\nRust 是一门专注于**性能、可靠性和生产效率**的系统编程语言，被 Stack Overflow 连续多年评为最受喜爱的编程语言。\n\n## 所有权系统\n\n\`\`\`rust\nfn main() {\n    let s1 = String::from("hello");\n    let s2 = s1; // s1 的所有权移动到 s2\n    \n    // println!("{}", s1); // 编译错误！s1 已失效\n    println!("{}", s2); // OK\n    \n    // 离开作用域时自动释放内存，无需 GC\n}\n\`\`\`\n\n## 零成本抽象\n\n\`\`\`rust\n// 迭代器链 - 编译后性能等同于手写 C 循环\nlet sum: u64 = (0..1_000_000)\n    .filter(|&x| x % 2 == 0)\n    .map(|x| x * x)\n    .sum();\n\`\`\``,
  },
  {
    id: 8,
    title: "AIGC 时代的版权与伦理问题探讨",
    description: "探讨生成式 AI 带来的版权争议、伦理风险以及相关的法律法规进展。",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    tags: ["AIGC", "版权", "AI伦理"],
    domain: "人工智能",
    author: { name: "Legal Eagle", guild: "法务部", bio: "科技法律研究员，专注于 AI 伦理与知识产权领域，曾参与多项国家级 AI 治理政策研究。" },
    publishDate: "2024-03-03",
    stats: { views: 3200, likes: 650, comments: 120 },
    type: "talk",
    status: "in_progress",
    content: `## AIGC 的版权困境\n\n当 Midjourney 生成一幅画作，当 ChatGPT 写出一篇文章，这些内容的**版权归属于谁**？\n\n这个问题正在引发全球性的法律与伦理讨论。\n\n## 核心争议\n\n### 训练数据的版权问题\n\n大型 AI 模型使用了海量互联网内容进行训练。这些内容包括：\n\n- 有版权的文章、图片、代码\n- 创作者的个人作品\n- 企业的专有数据\n\n**核心问题**：未经授权使用版权作品训练 AI，是否构成侵权？\n\n### 主要法律观点\n\n| 立场 | 观点 | 代表方 |\n|------|------|--------|\n| AI 公司 | 训练属于"合理使用" | OpenAI、Google |\n| 创作者 | 侵犯版权，应获赔偿 | Getty Images、艺术家联盟 |\n| 学术界 | 需要新的法律框架 | 哈佛法学院 |\n\n## 监管动向\n\n全球各主要经济体正在积极立法：\n\n- **欧盟 AI Act**：要求 AI 公司披露训练数据\n- **中国生成式 AI 服务管理办法**：明确内容生成责任\n- **美国版权局**：逐案审查 AI 生成内容的可版权性`,
  },
  {
    id: 9,
    title: "OKR 目标管理法在敏捷团队中的实践",
    description: "分享如何将 OKR 与敏捷开发流程相结合，提升团队的目标对齐度与执行力。",
    tags: ["OKR", "敏捷开发", "团队管理"],
    domain: "管理运营",
    author: { name: "Scrum Master", guild: "敏捷教练组", bio: "认证 Scrum Master，专注于敏捷转型与高绩效团队建设，服务过 30+ 企业团队。" },
    publishDate: "2024-03-02",
    stats: { views: 800, likes: 150, comments: 18 },
    type: "faq",
    status: "completed",
    content: `## OKR 与敏捷的天然契合\n\nOKR（Objectives and Key Results）与敏捷开发有着相似的核心价值观：**聚焦、透明、持续改进**。\n\n## OKR 框架解析\n\n\`\`\`\nObjective（目标）\n  └── 是什么？激励人心的方向\n  \nKey Results（关键结果）\n  ├── KR1: 可量化的成果指标\n  ├── KR2: 挑战性但可实现\n  └── KR3: 3-5个为宜\n\`\`\`\n\n## 与 Sprint 的整合\n\n| 时间维度 | OKR | Scrum |\n|---------|-----|-------|\n| 季度 | 设定季度 OKR | 规划 Sprint 目标 |\n| 每周 | OKR 进度同步 | Sprint 每日站会 |\n| 月末 | KR 检查点 | Sprint Review |\n| 季末 | OKR 复盘 | Sprint 回顾 |`,
  },
  {
    id: 10,
    title: "零信任安全架构落地指南",
    description: "详细介绍零信任安全架构的核心原则、组件构成以及企业落地的实施步骤。",
    tags: ["零信任", "网络安全", "架构"],
    domain: "信息安全",
    author: { name: "Security Guard", guild: "安全响应中心", bio: "信息安全架构师，CISSP 认证持有者，专注于企业零信任架构设计与实施。" },
    publishDate: "2024-03-01",
    stats: { views: 1400, likes: 310, comments: 45 },
    status: "unstarted",
    content: `## 为什么需要零信任？\n\n传统的"城堡-护城河"安全模型假设：**内网可信，外网不可信**。但在云计算、远程办公普及的今天，这个假设已经失效。\n\n## 零信任三原则\n\n1. **永不信任，始终验证**（Never Trust, Always Verify）\n2. **最小权限访问**（Least Privilege Access）\n3. **假设已被突破**（Assume Breach）\n\n## 实施路线图\n\n\`\`\`\n阶段一：可视化（0-3个月）\n  ├── 资产清点与分类\n  ├── 用户与设备目录\n  └── 网络流量分析\n  \n阶段二：控制（3-9个月）\n  ├── MFA 全面推行\n  ├── 微隔离实施\n  └── 特权账号管理（PAM）\n  \n阶段三： Automation（9-18个月）\n  ├── SIEM/SOAR 集成\n  ├── AI 驱动的威胁检测\n  └── 持续合规监控\n\`\`\``,
  },
  {
    id: 11,
    title: "数据湖仓一体化架构设计",
    description: "探讨数据湖与数据仓库的融合架构，实现海量数据的实时分析与处理。",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["数据湖仓", "大数据", "架构"],
    domain: "数据分析",
    author: { name: "Data Engineer", guild: "数据平台组", bio: "大数据架构师，Delta Lake 社区贡献者，专注于实时数仓与流批一体架构。" },
    publishDate: "2024-02-28",
    stats: { views: 1600, likes: 380, comments: 60 },
    type: "document",
    status: "collected",
    content: `## 湖仓一体的背景\n\n**数据湖（Data Lake）**：低成本存储，支持原始数据，缺乏结构与治理。\n\n**数据仓库（Data Warehouse）**：结构化、高性能，但昂贵且缺乏灵活性。\n\n**湖仓一体（Lakehouse）**：两者之长的融合，是当前数据架构的主流趋势。\n\n## 核心技术组件\n\n| 层次 | 技术选型 |\n|------|----------|\n| 存储层 | S3 / HDFS / OSS |\n| 表格式 | Delta Lake / Iceberg / Hudi |\n| 计算层 | Spark / Flink / Trino |\n| 元数据 | Unity Catalog / Apache Atlas |\n| BI层 | Tableau / Superset |\n\n## Delta Lake 核心特性\n\n\`\`\`python\nimport delta\nfrom pyspark.sql import SparkSession\n\nspark = SparkSession.builder \\\n    .config("spark.jars.packages", "io.delta:delta-core_2.12:2.4.0") \\\n    .getOrCreate()\n\n# ACID 事务写入\ndf.write.format("delta").mode("overwrite").save("/data/sales")\n\n# 时间旅行查询\ndf_historical = spark.read \\\n    .format("delta") \\\n    .option("timestampAsOf", "2024-01-01") \\\n    .load("/data/sales")\n\`\`\``,
  },
  {
    id: 12,
    title: "自动化部署脚本：使用 Ansible 快速搭建 K8s 集群",
    description: "提供一套完整的 Ansible Playbook，用于在裸金属服务器上快速部署生产级 Kubernetes 集群。",
    tags: ["DevOps", "Kubernetes", "Ansible"],
    domain: "运维自动化",
    author: { name: "Ops Master", guild: "运维实验室", bio: "资深运维工程师，专注于基础设施即代码 (IaC) 与自动化运维工具开发。" },
    publishDate: "2024-02-25",
    stats: { views: 2100, likes: 450, comments: 72 },
    type: "script",
    status: "completed",
    content: `## 自动化部署简介\n\n手动搭建 Kubernetes 集群不仅耗时，而且容易出错。本脚本基于 **Ansible**，实现了从 OS 初始化到集群就绪的全流程自动化。\n\n## 脚本结构\n\n\`\`\`plaintext\nk8s-deploy/\n├── inventory/\n│   └── hosts.ini\n├── roles/\n│   ├── common/         # 系统初始化\n│   ├── docker/         # 容器运行时\n│   ├── kubelet/        # K8s 组件\n│   └── master/         # 控制平面\n└── site.yml            # 入口文件\n\`\`\`\n\n## 核心 Playbook 示例\n\n\`\`\`yaml\n- name: Install Kubernetes components\n  hosts: all\n  become: yes\n  tasks:\n    - name: Add Kubernetes apt-key\n      apt_key:\n        url: https://packages.cloud.google.com/apt/doc/apt-key.gpg\n        state: present\n\n    - name: Install kubelet, kubeadm, kubectl\n      apt:\n        name: "{{ item }}"\n        state: present\n        update_cache: yes\n      loop:\n        - kubelet\n        - kubeadm\n        - kubectl\n\`\`\`\n\n## 使用说明\n\n1. 配置 \`inventory/hosts.ini\`\n2. 运行 \`ansible-playbook -i inventory/hosts.ini site.yml\`\n3. 等待部署完成 (约 10 分钟)`,
  },
]

export function getCardById(id: number | string): KnowledgeCardData | undefined {
  const numId = typeof id === "string" ? parseInt(id) : id
  return MOCK_CARDS.find((c) => c.id === numId || c.id === id)
}

export function getSeriesById(seriesId: string): SeriesData | undefined {
  return MOCK_SERIES[seriesId]
}

export function getAuthorCards(authorName: string): KnowledgeCardData[] {
  return MOCK_CARDS.filter((c) => c.author.name === authorName)
}

export function groupByMonth(cards: KnowledgeCardData[]): Record<string, KnowledgeCardData[]> {
  const groups: Record<string, KnowledgeCardData[]> = {}
  for (const card of cards) {
    const date = new Date(card.publishDate)
    const key = `${date.getFullYear()}年${date.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(card)
  }
  return groups
}
