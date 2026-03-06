// ────────────────────────────────────────────────────────────────────────────
// Guild Module – Mock Data
// ────────────────────────────────────────────────────────────────────────────

export type GuildRole = 'president' | 'admin' | 'core' | 'newcomer'
export type ActivityLevel = 1 | 2 | 3 | 4 | 5

export interface GuildMember {
  id: string
  name: string
  avatar?: string
  avatarColor: string
  role: GuildRole
  level: number
  contributedCards: number
  reuseCount: number
  joinedAt: string
  bio?: string
  representativeCard?: string
}

export interface GuildStat {
  members: number
  knowledgeCards: number
  weeklyNew: number
  activityLevel: ActivityLevel
}

export interface Guild {
  id: string
  name: string
  slogan: string
  description: string
  primaryColor: string
  accentColor: string
  icon: string
  stats: GuildStat
  honorTags: string[]
  isJoined: boolean
  recommendReason?: string
  adminIds: string[]
  presidentId: string
}

export type FeedType = 'publish' | 'update' | 'gap' | 'achievement'

export interface FeedItem {
  id: string
  type: FeedType
  timestamp: string
  actor: { name: string; avatarColor: string }
  cardTitle?: string
  cardTags?: string[]
  updateNote?: string
  gapKeyword?: string
  gapSearchCount?: number
  achievementName?: string
  achievementIcon?: string
  likes: number
  comments: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  publishedAt: string
  isPinned: boolean
  isUnread: boolean
}

export interface GuildExpedition {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'preparing'
  deadline: string
  targetCards: number
  completedCards: number
  participants: Array<{ name: string; avatarColor: string }>
  daysElapsed?: number
  totalDays?: number
}

export interface GuildKnowledgeCard {
  id: string
  title: string
  description: string
  type: 'howto' | 'pitfall' | 'principle' | 'evaluation'
  tags: string[]
  author: string
  authorAvatarColor: string
  publishedAt: string
  views: number
  likes: number
  reuseCount: number
  isFeatured: boolean
  authority: number
}

export interface LearningPathNode {
  id: string
  stage: string
  stageDesc: string
  status: 'completed' | 'in_progress' | 'pending'
  cards: Array<{ title: string; type: string }>
}

// ─── Guilds List ────────────────────────────────────────────────────────────

export const GUILDS: Guild[] = [
  {
    id: 'frontend',
    name: '前端工程师公会',
    slogan: '代码是诗，交互是魔法，我们在像素之间构建世界',
    description: '由公司前端团队自发组建，涵盖 Web、移动端 H5、小程序、低代码平台等方向。这里沉淀着真正踩过的坑和打磨过的方案。',
    primaryColor: '#3b82f6',
    accentColor: '#6366f1',
    icon: '⚡',
    stats: { members: 128, knowledgeCards: 342, weeklyNew: 17, activityLevel: 5 },
    honorTags: ['本周最活跃', '知识产出 Top 1'],
    isJoined: true,
    adminIds: ['member-2', 'member-3'],
    presidentId: 'member-1',
  },
  {
    id: 'security',
    name: '安全工程公会',
    slogan: '攻防一体，以攻促防，守护每一行代码的边界',
    description: '由安全团队与关注安全的后端、运维工程师共建，覆盖渗透测试、代码审计、安全合规等方向。',
    primaryColor: '#ef4444',
    accentColor: '#f97316',
    icon: '🛡️',
    stats: { members: 43, knowledgeCards: 128, weeklyNew: 6, activityLevel: 3 },
    honorTags: ['质量卫士'],
    isJoined: true,
    adminIds: [],
    presidentId: '',
  },
  {
    id: 'data',
    name: '数据工程公会',
    slogan: '数据不撒谎，但需要有人听懂它在说什么',
    description: '汇聚数据仓库、数据平台、BI 与数据治理工程师，致力于将数据资产转化为可信赖的决策依据。',
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    icon: '📊',
    stats: { members: 67, knowledgeCards: 189, weeklyNew: 9, activityLevel: 4 },
    honorTags: ['本月增长最快'],
    isJoined: true,
    adminIds: [],
    presidentId: '',
  },
  {
    id: 'devops',
    name: 'DevOps 公会',
    slogan: '让发布像呼吸一样自然，让故障在萌芽时就被扼杀',
    description: 'CI/CD、容器化、可观测性、混沌工程——我们把工程实践沉淀成可复用的知识体系。',
    primaryColor: '#10b981',
    accentColor: '#0ea5e9',
    icon: '🚀',
    stats: { members: 95, knowledgeCards: 276, weeklyNew: 14, activityLevel: 5 },
    honorTags: ['工程实践标杆'],
    isJoined: false,
    recommendReason: '与你的 K8s 技术方向高度匹配',
    adminIds: [],
    presidentId: '',
  },
  {
    id: 'mobile',
    name: '移动端工程公会',
    slogan: '每个用户的指尖，都是我们的战场',
    description: '涵盖 iOS、Android 原生与 Flutter/RN 跨端开发，追求流畅体验与性能极致的移动工程师社区。',
    primaryColor: '#f59e0b',
    accentColor: '#ec4899',
    icon: '📱',
    stats: { members: 52, knowledgeCards: 143, weeklyNew: 7, activityLevel: 3 },
    honorTags: [],
    isJoined: false,
    recommendReason: '你关注的 Flutter 渲染优化在这里有深度沉淀',
    adminIds: [],
    presidentId: '',
  },
]

export const MY_GUILDS = GUILDS.filter(g => g.isJoined)
export const RECOMMENDED_GUILDS = GUILDS.filter(g => !g.isJoined)

// ─── Members ────────────────────────────────────────────────────────────────

export const MEMBERS: GuildMember[] = [
  {
    id: 'member-1',
    name: '陈晓峰',
    avatarColor: '#3b82f6',
    role: 'president',
    level: 10,
    contributedCards: 87,
    reuseCount: 1243,
    joinedAt: '2023-01-15',
    bio: '公会会长，专注前端工程化与 Monorepo 架构十年，相信好的工程实践是团队效率的最大杠杆。',
    representativeCard: 'Monorepo 工程化实战：从 0 到 nx + pnpm',
  },
  {
    id: 'member-2',
    name: '林雅婷',
    avatarColor: '#8b5cf6',
    role: 'admin',
    level: 9,
    contributedCards: 64,
    reuseCount: 876,
    joinedAt: '2023-03-08',
    bio: '性能优化狂热者，Core Web Vitals 布道师，把每一个 LCP 数字都当作艺术作品来打磨。',
    representativeCard: 'Web Vitals 优化实战：从 60 分到 95 分的完整路径',
  },
  {
    id: 'member-3',
    name: '赵卫国',
    avatarColor: '#10b981',
    role: 'admin',
    level: 8,
    contributedCards: 52,
    reuseCount: 634,
    joinedAt: '2023-04-20',
    bio: '全栈视角的前端工程师，擅长在 React 与 Node.js 之间无缝穿越，最爱给复杂系统画架构图。',
    representativeCard: 'BFF 层设计模式：前后端解耦的最佳实践',
  },
  {
    id: 'member-4',
    name: '张思远',
    avatarColor: '#f59e0b',
    role: 'core',
    level: 7,
    contributedCards: 38,
    reuseCount: 412,
    joinedAt: '2023-06-11',
    bio: '动效工程师，用 Framer Motion 和 GSAP 为用户体验注入灵魂，认为好的动效胜过千言万语。',
    representativeCard: 'Framer Motion 进阶：物理弹簧动画与手势交互',
  },
  {
    id: 'member-5',
    name: '王璐璐',
    avatarColor: '#ec4899',
    role: 'core',
    level: 7,
    contributedCards: 31,
    reuseCount: 389,
    joinedAt: '2023-07-03',
    bio: '设计系统建设者，将设计 Token 与工程规范融为一体，让设计与开发真正说同一种语言。',
    representativeCard: 'Design Token 工程化：从 Figma 到代码的自动化链路',
  },
  {
    id: 'member-6',
    name: '刘建军',
    avatarColor: '#06b6d4',
    role: 'core',
    level: 6,
    contributedCards: 28,
    reuseCount: 256,
    joinedAt: '2023-09-14',
    bio: '前端安全专家，XSS、CSRF、CSP 一个都不放过，认为安全是用户信任的基石。',
    representativeCard: 'CSP 内容安全策略完全指南：从原理到落地',
  },
  {
    id: 'member-7',
    name: '许梦琪',
    avatarColor: '#84cc16',
    role: 'newcomer',
    level: 3,
    contributedCards: 6,
    reuseCount: 42,
    joinedAt: '2024-08-20',
    bio: '刚转正的前端工程师，正在从 Vue 过渡到 React 生态，每天都有新发现。',
  },
  {
    id: 'member-8',
    name: '吴昊天',
    avatarColor: '#f97316',
    role: 'newcomer',
    level: 2,
    contributedCards: 3,
    reuseCount: 18,
    joinedAt: '2024-10-05',
    bio: '应届生入职两个月，正在狂啃公会图书馆里的知识卡，感谢每一位核心贡献者。',
  },
]

// ─── Knowledge Feed ──────────────────────────────────────────────────────────

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'publish',
    timestamp: '2分钟前',
    actor: { name: '张思远', avatarColor: '#f59e0b' },
    cardTitle: 'Tailwind CSS v4 迁移指南：从 JIT 到 Lightning CSS 的完整路径',
    cardTags: ['HOW-TO', '权威⭐', 'Tailwind'],
    likes: 12,
    comments: 3,
  },
  {
    id: 'feed-2',
    type: 'update',
    timestamp: '41分钟前',
    actor: { name: '林雅婷', avatarColor: '#8b5cf6' },
    cardTitle: '前端监控体系建设方案',
    cardTags: ['架构', '监控'],
    updateNote: '补充了 RUM 核心指标采集章节（FCP/LCP/CLS/INP），同时更新了 Sentry 7.x 接入示例代码，建议关注性能监控方向的同学重新阅读第三章。',
    likes: 8,
    comments: 5,
  },
  {
    id: 'feed-3',
    type: 'gap',
    timestamp: '2小时前',
    actor: { name: '系统', avatarColor: '#64748b' },
    gapKeyword: 'Vite 构建优化实践',
    gapSearchCount: 18,
    likes: 0,
    comments: 0,
  },
  {
    id: 'feed-4',
    type: 'achievement',
    timestamp: '昨天 15:32',
    actor: { name: '王璐璐', avatarColor: '#ec4899' },
    cardTitle: 'CSS Grid 完全指南：从入门到实战布局',
    achievementName: '百复用',
    achievementIcon: '🎖️',
    likes: 34,
    comments: 11,
  },
  {
    id: 'feed-5',
    type: 'publish',
    timestamp: '昨天 09:15',
    actor: { name: '刘建军', avatarColor: '#06b6d4' },
    cardTitle: 'XSS 攻防实战：现代框架的防御边界在哪里',
    cardTags: ['踩坑记录', '安全'],
    likes: 21,
    comments: 7,
  },
  {
    id: 'feed-6',
    type: 'update',
    timestamp: '昨天 11:04',
    actor: { name: '赵卫国', avatarColor: '#10b981' },
    cardTitle: 'React Server Components 深度解析',
    cardTags: ['原理解析', 'React'],
    updateNote: '根据 React 19 正式版发布，重写了 Suspense 与 RSC 协同工作的章节，并补充了 Next.js 15 中的实际使用案例。',
    likes: 19,
    comments: 8,
  },
]

// ─── Announcements ──────────────────────────────────────────────────────────

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '【重要】11月公会远征任务正式启动，请全员关注',
    content: `各位公会成员，

「11月前端性能优化知识风暴」远征已正式启动！本次远征目标是在11月30日前产出 **30 张**高质量性能优化相关知识卡，涵盖 Core Web Vitals、资源加载优化、渲染性能、内存管理等方向。

**参与激励：**
- 每完成一张知识卡：积分 +80
- 达成「精选推荐」：额外 +100 积分
- 远征完成后，贡献 Top3 成员将获得专属荣誉徽章

请大家踊跃参与，知识的力量在于共享！远征详情见「公会远征」Tab。`,
    author: '陈晓峰',
    publishedAt: '2024-11-01',
    isPinned: true,
    isUnread: true,
  },
  {
    id: 'ann-2',
    title: '新成员入会须知：公会知识卡编写规范 v2.0 已更新',
    content: `亲爱的新成员，

欢迎加入前端工程师公会！为了保证知识卡的质量，请务必阅读最新的编写规范（v2.0 版本）。

主要更新内容：
1. 新增「踩坑记录」类型卡片的结构模板
2. 补充了代码示例的格式规范（需注明语言、版本）
3. 参考资料引用格式更新为 APA 规范

规范文档可在公会图书馆中找到，标题为《前端公会知识卡编写规范 v2.0》。`,
    author: '林雅婷',
    publishedAt: '2024-10-28',
    isPinned: false,
    isUnread: false,
  },
  {
    id: 'ann-3',
    title: '10月明星成员评选结果公示',
    content: `经全体成员投票，10月明星成员评选结果如下：

🥇 第一名：王璐璐 — 贡献 12 张知识卡，被复用 234 次
🥈 第二名：张思远 — 贡献 9 张知识卡，发起 2 次主题讨论
🥉 第三名：刘建军 — 贡献 7 张知识卡，修复 15 处内容缺陷

恭喜三位！奖励积分将在本周内到账。`,
    author: '陈晓峰',
    publishedAt: '2024-11-01',
    isPinned: false,
    isUnread: false,
  },
]

// ─── Guild Expeditions ──────────────────────────────────────────────────────

export const GUILD_EXPEDITIONS: GuildExpedition[] = [
  {
    id: 'exp-1',
    name: '11月前端性能优化知识风暴',
    description: '聚焦 Core Web Vitals、资源加载优化、渲染性能三大方向，集中产出一批高质量的性能优化实战知识卡，帮助团队在年底前完成前端性能体系建设。',
    status: 'active',
    deadline: '2024-11-30',
    targetCards: 30,
    completedCards: 19,
    participants: [
      { name: '林雅婷', avatarColor: '#8b5cf6' },
      { name: '张思远', avatarColor: '#f59e0b' },
      { name: '赵卫国', avatarColor: '#10b981' },
      { name: '王璐璐', avatarColor: '#ec4899' },
      { name: '刘建军', avatarColor: '#06b6d4' },
      { name: '陈晓峰', avatarColor: '#3b82f6' },
    ],
  },
  {
    id: 'exp-2',
    name: 'React 19 生态升级知识普及计划',
    description: '伴随 React 19 正式版发布，系统梳理 Server Components、Actions、新 Hooks 等核心特性，以及周边生态（Next.js 15、React Query v5）的迁移实践。',
    status: 'active',
    deadline: '2024-11-20',
    targetCards: 15,
    completedCards: 7,
    participants: [
      { name: '赵卫国', avatarColor: '#10b981' },
      { name: '陈晓峰', avatarColor: '#3b82f6' },
      { name: '许梦琪', avatarColor: '#84cc16' },
      { name: '吴昊天', avatarColor: '#f97316' },
    ],
  },
  {
    id: 'exp-3',
    name: '前端工程化最佳实践沉淀',
    description: '围绕 Monorepo、构建工具选型、代码质量、CI/CD 前端流水线等工程化话题，将团队过去一年积累的实战经验系统化整理。',
    status: 'completed',
    deadline: '2024-10-15',
    targetCards: 25,
    completedCards: 32,
    daysElapsed: 14,
    totalDays: 21,
    participants: [
      { name: '陈晓峰', avatarColor: '#3b82f6' },
      { name: '林雅婷', avatarColor: '#8b5cf6' },
      { name: '赵卫国', avatarColor: '#10b981' },
      { name: '张思远', avatarColor: '#f59e0b' },
      { name: '王璐璐', avatarColor: '#ec4899' },
      { name: '刘建军', avatarColor: '#06b6d4' },
      { name: '许梦琪', avatarColor: '#84cc16' },
    ],
  },
]

// ─── Knowledge Cards (Library) ───────────────────────────────────────────────

export const GUILD_KNOWLEDGE_CARDS: GuildKnowledgeCard[] = [
  {
    id: 'kc-1',
    title: 'Monorepo 工程化实战：从 0 到 nx + pnpm 完整搭建',
    description: '手把手带你从零搭建企业级 Monorepo 工程，包含包管理策略、构建缓存、依赖图分析与增量构建配置。',
    type: 'howto',
    tags: ['Monorepo', 'nx', 'pnpm', '工程化'],
    author: '陈晓峰',
    authorAvatarColor: '#3b82f6',
    publishedAt: '2024-09-12',
    views: 2341,
    likes: 187,
    reuseCount: 156,
    isFeatured: true,
    authority: 5,
  },
  {
    id: 'kc-2',
    title: 'Web Vitals 优化实战：从 60 分到 95 分的完整路径',
    description: '真实业务页面的全流程优化记录，覆盖 LCP 图片优化、CLS 布局稳定性、INP 交互响应全套方案。',
    type: 'howto',
    tags: ['性能优化', 'Web Vitals', 'LCP', 'INP'],
    author: '林雅婷',
    authorAvatarColor: '#8b5cf6',
    publishedAt: '2024-10-03',
    views: 3128,
    likes: 234,
    reuseCount: 198,
    isFeatured: true,
    authority: 5,
  },
  {
    id: 'kc-3',
    title: 'CSS Grid 完全指南：从入门到实战布局',
    description: '覆盖 Grid 所有核心概念与布局技巧，配有 20+ 可运行示例，从简单排版到复杂响应式布局应有尽有。',
    type: 'principle',
    tags: ['CSS', 'Grid', '布局'],
    author: '王璐璐',
    authorAvatarColor: '#ec4899',
    publishedAt: '2024-07-18',
    views: 4512,
    likes: 312,
    reuseCount: 247,
    isFeatured: false,
    authority: 5,
  },
  {
    id: 'kc-4',
    title: '踩坑实录：React useEffect 的十大错误用法',
    description: '整理了团队内 Code Review 中最常见的 useEffect 误用模式，附详细原因分析与正确替代方案。',
    type: 'pitfall',
    tags: ['React', 'useEffect', '踩坑'],
    author: '赵卫国',
    authorAvatarColor: '#10b981',
    publishedAt: '2024-08-25',
    views: 5678,
    likes: 423,
    reuseCount: 367,
    isFeatured: false,
    authority: 4,
  },
  {
    id: 'kc-5',
    title: 'Framer Motion 进阶：物理弹簧动画与复杂手势交互',
    description: '从 spring 物理参数调校到多指手势识别，一文掌握 Framer Motion 中被大多数教程忽略的高级用法。',
    type: 'howto',
    tags: ['动效', 'Framer Motion', 'React'],
    author: '张思远',
    authorAvatarColor: '#f59e0b',
    publishedAt: '2024-09-30',
    views: 1892,
    likes: 143,
    reuseCount: 89,
    isFeatured: false,
    authority: 4,
  },
  {
    id: 'kc-6',
    title: 'CSP 内容安全策略完全指南：从原理到生产落地',
    description: '深入讲解 CSP 各指令的语义与配合策略，包含 nonce 模式在 Next.js 中的完整实现方案。',
    type: 'principle',
    tags: ['安全', 'CSP', 'Next.js'],
    author: '刘建军',
    authorAvatarColor: '#06b6d4',
    publishedAt: '2024-10-14',
    views: 1234,
    likes: 98,
    reuseCount: 67,
    isFeatured: false,
    authority: 4,
  },
  {
    id: 'kc-7',
    title: 'Vite vs Webpack vs Rspack：2024年构建工具横评',
    description: '从启动速度、热更新性能、插件生态、迁移成本四个维度，对三大构建工具进行量化对比与选型建议。',
    type: 'evaluation',
    tags: ['工具评测', 'Vite', 'Webpack', 'Rspack'],
    author: '陈晓峰',
    authorAvatarColor: '#3b82f6',
    publishedAt: '2024-10-22',
    views: 4231,
    likes: 289,
    reuseCount: 212,
    isFeatured: true,
    authority: 5,
  },
  {
    id: 'kc-8',
    title: '踩坑记录：pnpm 幽灵依赖问题完全排查手册',
    description: '在 Monorepo 迁移过程中遭遇的 pnpm 幽灵依赖问题全记录，含 5 种典型场景与对应修复方案。',
    type: 'pitfall',
    tags: ['pnpm', '幽灵依赖', 'Monorepo'],
    author: '赵卫国',
    authorAvatarColor: '#10b981',
    publishedAt: '2024-11-01',
    views: 876,
    likes: 67,
    reuseCount: 43,
    isFeatured: false,
    authority: 3,
  },
  {
    id: 'kc-9',
    title: 'Design Token 工程化：从 Figma 到代码的自动化链路',
    description: '使用 Style Dictionary 打通设计稿与代码之间的 Token 同步链路，一次定义，多端输出。',
    type: 'howto',
    tags: ['设计系统', 'Token', 'Figma', '自动化'],
    author: '王璐璐',
    authorAvatarColor: '#ec4899',
    publishedAt: '2024-10-08',
    views: 1567,
    likes: 124,
    reuseCount: 98,
    isFeatured: false,
    authority: 4,
  },
]

// ─── Learning Path ──────────────────────────────────────────────────────────

export const LEARNING_PATH: LearningPathNode[] = [
  {
    id: 'stage-1',
    stage: '筑基',
    stageDesc: '夯实前端工程核心认知，建立统一的技术语言',
    status: 'completed',
    cards: [
      { title: 'CSS Grid 完全指南', type: 'principle' },
      { title: 'React useEffect 十大错误用法', type: 'pitfall' },
      { title: '前端工程化入门：npm/yarn/pnpm 选型指南', type: 'howto' },
    ],
  },
  {
    id: 'stage-2',
    stage: '进阶',
    stageDesc: '掌握工程化与性能优化体系，成为团队可靠的技术支柱',
    status: 'in_progress',
    cards: [
      { title: 'Web Vitals 优化实战', type: 'howto' },
      { title: 'Monorepo 工程化实战', type: 'howto' },
      { title: 'pnpm 幽灵依赖问题排查手册', type: 'pitfall' },
      { title: 'Vite vs Webpack vs Rspack 横评', type: 'evaluation' },
    ],
  },
  {
    id: 'stage-3',
    stage: '实战',
    stageDesc: '在真实复杂场景中综合运用，开始产出高质量知识沉淀',
    status: 'pending',
    cards: [
      { title: 'BFF 层设计模式：前后端解耦的最佳实践', type: 'principle' },
      { title: 'CSP 内容安全策略完全指南', type: 'principle' },
      { title: 'Framer Motion 进阶：物理弹簧动画', type: 'howto' },
    ],
  },
  {
    id: 'stage-4',
    stage: '引领',
    stageDesc: '成为公会核心贡献者，发起远征，引导他人成长',
    status: 'pending',
    cards: [
      { title: 'Design Token 工程化：Figma 到代码的自动化', type: 'howto' },
      { title: '如何撰写一张「经得起推敲」的知识卡', type: 'howto' },
    ],
  },
]

// ─── Helper: get days until deadline ────────────────────────────────────────

export function getDaysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function getGuildById(id: string): Guild | undefined {
  return GUILDS.find(g => g.id === id)
}

export const CARD_TYPE_MAP: Record<GuildKnowledgeCard['type'], { label: string; color: string }> = {
  howto: { label: 'HOW-TO', color: 'bg-blue-500/80 text-white' },
  pitfall: { label: '踩坑记录', color: 'bg-orange-500/80 text-white' },
  principle: { label: '原理解析', color: 'bg-violet-500/80 text-white' },
  evaluation: { label: '工具评测', color: 'bg-emerald-500/80 text-white' },
}
