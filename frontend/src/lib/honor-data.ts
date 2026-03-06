// ─── Types ───────────────────────────────────────────────────────────────────

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AchievementStatus = 'unlocked' | 'in-progress' | 'locked'
export type AchievementCategory = 'creation' | 'influence' | 'persistence' | 'collaboration' | 'guild' | 'legendary-all'

export interface CurrentUser {
  name: string
  title: string
  level: number
  guild: string
  joinDays: number
  points: number
  coins: number
  cardsPublished: number
  reusedCount: number
  levelProgress: number
  levelTarget: number
  nextLevel: number
  rankPosition: number
  influence: number
  avatarBg: string
}

export interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  rarity: Rarity
  category: AchievementCategory
  condition: string
  status: AchievementStatus
  unlockedAt?: string
  progress?: number
  total?: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  title: string
  level: number
  guild: string
  influence: number
  cards: number
  reuses: number
  rankChange: number | 'new'
  avatarBg: string
}

export interface ActivityItem {
  id: string
  date: string
  type: 'reuse-milestone' | 'expedition' | 'achievement' | 'certification' | 'streak'
  icon: string
  title: string
  description: string
  points: number
}

export interface HeatmapDay {
  date: string
  score: number   // 0–4
  points: number
  details: string
}

// ─── Current User ─────────────────────────────────────────────────────────────

export const CURRENT_USER: CurrentUser = {
  name: '李明',
  title: '知识铸造师',
  level: 7,
  guild: '前端工程师公会',
  joinDays: 589,
  points: 1240,
  coins: 380,
  cardsPublished: 18,
  reusedCount: 234,
  levelProgress: 1240,
  levelTarget: 1600,
  nextLevel: 8,
  rankPosition: 23,
  influence: 2840,
  avatarBg: '#6366f1',
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Creation ──────────────────────────────────────────────────────────────
  {
    id: 'first-card',
    icon: '🌱',
    name: '初心者',
    description: '踏出了知识创作的第一步',
    rarity: 'common',
    category: 'creation',
    condition: '发布第一张知识卡',
    status: 'unlocked',
    unlockedAt: '2024-08-15',
  },
  {
    id: 'creator',
    icon: '✍️',
    name: '创作者',
    description: '十张卡片，十个沉淀的瞬间',
    rarity: 'common',
    category: 'creation',
    condition: '累计发布 10 张知识卡',
    status: 'unlocked',
    unlockedAt: '2024-11-02',
  },
  {
    id: 'prolific-writer',
    icon: '📚',
    name: '著作等身',
    description: '五十张卡，一座知识的小山丘',
    rarity: 'rare',
    category: 'creation',
    condition: '累计发布 50 张知识卡',
    status: 'in-progress',
    progress: 18,
    total: 50,
  },

  // ── Influence ─────────────────────────────────────────────────────────────
  {
    id: 'igniter',
    icon: '🔥',
    name: '引燃者',
    description: '你的一张卡，点燃了五十人的灵感',
    rarity: 'rare',
    category: 'influence',
    condition: '单张卡被复用 50 次',
    status: 'unlocked',
    unlockedAt: '2025-03-18',
  },
  {
    id: 'supernova',
    icon: '💫',
    name: '超新星',
    description: '光芒已越过地平线，正向星际扩散',
    rarity: 'epic',
    category: 'influence',
    condition: '单张卡被复用 200 次',
    status: 'in-progress',
    progress: 87,
    total: 200,
  },
  {
    id: 'knowledge-wave',
    icon: '🌊',
    name: '知识浪潮',
    description: '汇聚每一次转发，终成浪涛之势',
    rarity: 'rare',
    category: 'influence',
    condition: '总计被复用 100 次',
    status: 'in-progress',
    progress: 67,
    total: 100,
  },

  // ── Collaboration ─────────────────────────────────────────────────────────
  {
    id: 'guardian',
    icon: '🛡️',
    name: '守护者',
    description: '每一次复审，都是对知识品质的承诺',
    rarity: 'common',
    category: 'collaboration',
    condition: '完成 10 次内容复审',
    status: 'unlocked',
    unlockedAt: '2025-01-07',
  },
  {
    id: 'alchemist',
    icon: '🧙',
    name: '炼金师',
    description: '与 AI 共舞，将灵感锻造为被认可的知识',
    rarity: 'rare',
    category: 'collaboration',
    condition: '用 AI 生成并被采纳 20 张卡',
    status: 'unlocked',
    unlockedAt: '2025-06-22',
  },
  {
    id: 'precise-strike',
    icon: '🎯',
    name: '精准打击',
    description: '言简意赅，一语中的，评论五次被采纳',
    rarity: 'common',
    category: 'collaboration',
    condition: '被采纳评论/建议 5 次',
    status: 'unlocked',
    unlockedAt: '2025-02-14',
  },
  {
    id: 'companion',
    icon: '🤝',
    name: '携手同行',
    description: '知识是合作的产物，你参与了十次协作',
    rarity: 'common',
    category: 'collaboration',
    condition: '完成 10 次协作活动',
    status: 'unlocked',
    unlockedAt: '2025-04-30',
  },
  {
    id: 'book-explorer',
    icon: '📖',
    name: '博览群书',
    description: '学习不止，打卡不停',
    rarity: 'common',
    category: 'collaboration',
    condition: '完成 5 条学习路径',
    status: 'in-progress',
    progress: 3,
    total: 5,
  },

  // ── Guild ─────────────────────────────────────────────────────────────────
  {
    id: 'dragon-slayer',
    icon: '🐉',
    name: '屠龙勇士',
    description: '三场史诗远征，才能成就屠龙之名',
    rarity: 'epic',
    category: 'guild',
    condition: '参与完成 3 次史诗远征',
    status: 'in-progress',
    progress: 1,
    total: 3,
  },
  {
    id: 'cosmos-conqueror',
    icon: '🌌',
    name: '宇宙征服者',
    description: '传说远征的完成者，注定载入史册',
    rarity: 'legendary',
    category: 'guild',
    condition: '参与完成 1 次传说远征',
    status: 'locked',
  },
  {
    id: 'guild-king',
    icon: '👑',
    name: '公会之王',
    description: '你所在的公会，连续四周登顶活跃榜',
    rarity: 'epic',
    category: 'guild',
    condition: '所在公会连续 4 周登顶活跃榜',
    status: 'locked',
  },
  {
    id: 'lightning-warrior',
    icon: '⚡',
    name: '闪电战士',
    description: '48 小时内完成五次远征，速度与热情的双重证明',
    rarity: 'epic',
    category: 'guild',
    condition: '48 小时内完成 5 次远征任务',
    status: 'locked',
  },

  // ── Persistence ───────────────────────────────────────────────────────────
  {
    id: 'seven-star',
    icon: '🌟',
    name: '七连星',
    description: '七天如一，星火不息',
    rarity: 'common',
    category: 'persistence',
    condition: '连续 7 天有贡献行为',
    status: 'unlocked',
    unlockedAt: '2024-09-10',
  },
  {
    id: 'moon-never-sets',
    icon: '☀️',
    name: '月不落',
    description: '三十天的坚守，是对自己的庄严承诺',
    rarity: 'rare',
    category: 'persistence',
    condition: '连续 30 天有贡献行为',
    status: 'in-progress',
    progress: 23,
    total: 30,
  },
  {
    id: 'eternal-orbit',
    icon: '🪐',
    name: '永恒轨道',
    description: '三百六十五天，让贡献成为一种生活方式',
    rarity: 'legendary',
    category: 'persistence',
    condition: '连续 365 天有贡献行为',
    status: 'locked',
  },

  // ── Legendary ─────────────────────────────────────────────────────────────
  {
    id: 'glory-crowned',
    icon: '🏆',
    name: '荣耀加冕',
    description: '连续四周榜首，你的名字将刻入历史',
    rarity: 'legendary',
    category: 'legendary-all',
    condition: '任意榜单连续 4 周第一名',
    status: 'locked',
  },
  {
    id: 'rainbow-envoy',
    icon: '🌈',
    name: '彩虹使者',
    description: '六大类别均有所解锁，你是真正的全能者',
    rarity: 'legendary',
    category: 'legendary-all',
    condition: '六个成就类别各解锁至少 1 枚',
    status: 'locked',
  },
]

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: '张晓雯',
    title: '代码织梦师',
    level: 10,
    guild: '全栈开发公会',
    influence: 18420,
    cards: 156,
    reuses: 2847,
    rankChange: 0,
    avatarBg: '#6366f1',
  },
  {
    rank: 2,
    name: '王浩然',
    title: '架构圣人',
    level: 9,
    guild: '系统架构公会',
    influence: 15830,
    cards: 128,
    reuses: 2253,
    rankChange: 1,
    avatarBg: '#8b5cf6',
  },
  {
    rank: 3,
    name: '陈思远',
    title: '知识先锋',
    level: 9,
    guild: '产品设计公会',
    influence: 14270,
    cards: 143,
    reuses: 1981,
    rankChange: -1,
    avatarBg: '#0ea5e9',
  },
  {
    rank: 4,
    name: '刘子涵',
    title: '数据探索者',
    level: 8,
    guild: '数据科学公会',
    influence: 11560,
    cards: 94,
    reuses: 1642,
    rankChange: 2,
    avatarBg: '#10b981',
  },
  {
    rank: 5,
    name: '赵佳琪',
    title: '敏捷守护者',
    level: 8,
    guild: '工程效能公会',
    influence: 9840,
    cards: 87,
    reuses: 1328,
    rankChange: 0,
    avatarBg: '#f59e0b',
  },
  {
    rank: 6,
    name: '孙建明',
    title: '安全捍卫者',
    level: 8,
    guild: '网络安全公会',
    influence: 8930,
    cards: 72,
    reuses: 1187,
    rankChange: -2,
    avatarBg: '#ef4444',
  },
  {
    rank: 7,
    name: '周雨欣',
    title: '用户体验师',
    level: 7,
    guild: '前端工程师公会',
    influence: 7650,
    cards: 68,
    reuses: 954,
    rankChange: 3,
    avatarBg: '#ec4899',
  },
  {
    rank: 8,
    name: '吴天翔',
    title: '云端筑梦人',
    level: 7,
    guild: '云计算公会',
    influence: 6420,
    cards: 61,
    reuses: 823,
    rankChange: 'new',
    avatarBg: '#14b8a6',
  },
  {
    rank: 9,
    name: '郑雅文',
    title: '算法炼金师',
    level: 7,
    guild: '算法研究公会',
    influence: 5780,
    cards: 53,
    reuses: 742,
    rankChange: -1,
    avatarBg: '#a855f7',
  },
  {
    rank: 10,
    name: '冯子明',
    title: '开源贡献者',
    level: 7,
    guild: '开源生态公会',
    influence: 5230,
    cards: 47,
    reuses: 681,
    rankChange: -1,
    avatarBg: '#f97316',
  },
]

export const MY_RANK_ENTRY: LeaderboardEntry = {
  rank: 23,
  name: '李明',
  title: '知识铸造师',
  level: 7,
  guild: '前端工程师公会',
  influence: 2840,
  cards: 18,
  reuses: 234,
  rankChange: 5,
  avatarBg: '#6366f1',
}

export const RANK_ABOVE_ME_INFLUENCE = 3020

// ─── Recent Activities ────────────────────────────────────────────────────────

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    date: '2026-02-25',
    type: 'reuse-milestone',
    icon: '🔁',
    title: '复用里程碑',
    description: '《React Hooks 最佳实践》已被复用 200 次，成为本月前端领域最热知识卡',
    points: 30,
  },
  {
    id: '2',
    date: '2026-02-22',
    type: 'expedition',
    icon: '⚔️',
    title: '远征任务完成',
    description: '圆满完成「Next.js 性能优化指南」精英远征子任务，深度总结获队友五星评价',
    points: 320,
  },
  {
    id: '3',
    date: '2026-02-19',
    type: 'achievement',
    icon: '🧙',
    title: '成就解锁：炼金师',
    description: '第 20 张 AI 辅助知识卡被采纳入库，解锁稀有成就「炼金师」',
    points: 50,
  },
  {
    id: '4',
    date: '2026-02-16',
    type: 'certification',
    icon: '✅',
    title: '权威认证通过',
    description: '《TypeScript 泛型深度解析》通过高级工程师团队权威认证，有效期一年',
    points: 50,
  },
  {
    id: '5',
    date: '2026-02-14',
    type: 'achievement',
    icon: '🎯',
    title: '成就解锁：精准打击',
    description: '对「Zustand vs Redux」讨论的回复被原作者采纳为最佳建议，累计采纳达 5 次',
    points: 25,
  },
  {
    id: '6',
    date: '2026-02-11',
    type: 'streak',
    icon: '🌟',
    title: '连续贡献第 23 天',
    description: '已连续 23 天保持贡献记录，距「月不落」成就还差 7 天，加油',
    points: 5,
  },
  {
    id: '7',
    date: '2026-02-10',
    type: 'reuse-milestone',
    icon: '🔥',
    title: '爆款卡片诞生',
    description: '《CSS Grid 与 Flexbox 选型指南》单日被复用 12 次，创个人单日复用记录',
    points: 36,
  },
]

// ─── Heatmap Data Generator ───────────────────────────────────────────────────

function seeded(n: number): number {
  // Simple deterministic pseudo-random in [0,1)
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function generateHeatmapData(): HeatmapDay[] {
  // Today: March 2, 2026 — show ~53 weeks back (371 days) padded to week alignment
  const today = new Date(2026, 2, 2)

  // Start from the Sunday of the week that was ~52 weeks ago
  const startRaw = new Date(today)
  startRaw.setDate(startRaw.getDate() - 364)
  // Align to Sunday
  const dayOfWeek = startRaw.getDay() // 0=Sun
  startRaw.setDate(startRaw.getDate() - dayOfWeek)

  // Peak & gap date ranges (ms)
  const peaks: [number, number][] = [
    [new Date(2025, 4, 10).getTime(), new Date(2025, 5, 8).getTime()],  // May 10 – Jun 8
    [new Date(2025, 7, 1).getTime(), new Date(2025, 7, 28).getTime()],  // Aug 1–28
    [new Date(2025, 10, 8).getTime(), new Date(2025, 11, 3).getTime()], // Nov 8 – Dec 3
    [new Date(2026, 1, 3).getTime(), new Date(2026, 2, 2).getTime()],   // Feb 3 – Mar 2
  ]
  const gaps: [number, number][] = [
    [new Date(2025, 9, 1).getTime(), new Date(2025, 9, 7).getTime()],   // Oct 1–7 国庆
    [new Date(2025, 11, 24).getTime(), new Date(2026, 0, 5).getTime()], // Dec 24 – Jan 5 元旦
    [new Date(2026, 0, 27).getTime(), new Date(2026, 1, 2).getTime()],  // Jan 27 – Feb 2 春节
  ]

  const days: HeatmapDay[] = []
  const cur = new Date(startRaw)
  let idx = 0

  while (cur <= today) {
    const t = cur.getTime()
    const dateStr = fmt(cur)
    const inGap = gaps.some(([s, e]) => t >= s && t <= e)
    const inPeak = peaks.some(([s, e]) => t >= s && t <= e)

    let score = 0
    let points = 0
    let details = ''

    if (!inGap) {
      const r = seeded(idx)
      const thresholds = inPeak
        ? [0.1, 0.35, 0.65, 0.88]   // peak: fewer 0s, more high scores
        : [0.38, 0.65, 0.85, 0.95]  // normal: more 0s

      if (r < thresholds[0]) score = 0
      else if (r < thresholds[1]) score = 1
      else if (r < thresholds[2]) score = 2
      else if (r < thresholds[3]) score = 3
      else score = 4

      if (score > 0) {
        const basePoints = [0, 12, 32, 68, 115][score]
        const variance = seeded(idx + 1000)
        points = Math.round(basePoints + variance * basePoints * 0.6)

        const actions: string[] = []
        let rem = points

        const r2 = seeded(idx + 2000)
        const r3 = seeded(idx + 3000)
        const r4 = seeded(idx + 4000)

        if (rem > 55 && r2 > 0.55) {
          const p = Math.round(50 + seeded(idx + 5000) * 80)
          actions.push(`完成远征子任务 +${p}分`)
          rem = Math.max(0, rem - p)
        }

        if (rem > 20 && r3 > 0.45) {
          const cards = Math.ceil(seeded(idx + 6000) * 2)
          const p = cards * 25
          actions.push(`发布 ${cards} 张卡 +${p}分`)
          rem = Math.max(0, rem - p)
        }

        if (rem > 5 && r4 > 0.35) {
          const reuses = Math.ceil(seeded(idx + 7000) * 7)
          const p = reuses * 3
          actions.push(`被复用 ${reuses} 次 +${p}分`)
          rem = Math.max(0, rem - p)
        }

        if (rem > 0) actions.push(`其他贡献 +${rem}分`)
        details = actions.join('，') + `，共 +${points}分`
      }
    }

    days.push({ date: dateStr, score, points, details })
    cur.setDate(cur.getDate() + 1)
    idx++
  }

  return days
}

// ─── Rarity Config ────────────────────────────────────────────────────────────

export const RARITY_CONFIG = {
  common: {
    label: '普通',
    color: '#94a3b8',
    glow: 'none',
    borderClass: 'border-slate-300 dark:border-slate-600',
    textClass: 'text-slate-500 dark:text-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800',
  },
  rare: {
    label: '稀有',
    color: '#3b82f6',
    glow: '0 0 12px rgba(59,130,246,0.5)',
    borderClass: 'border-blue-400 dark:border-blue-500',
    textClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/50',
  },
  epic: {
    label: '史诗',
    color: '#a855f7',
    glow: '0 0 16px rgba(168,85,247,0.6)',
    borderClass: 'border-purple-400 dark:border-purple-500',
    textClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/50',
  },
  legendary: {
    label: '传说',
    color: '#f59e0b',
    glow: '0 0 20px rgba(245,158,11,0.7)',
    borderClass: 'border-amber-400 dark:border-amber-500',
    textClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/50',
  },
} as const
