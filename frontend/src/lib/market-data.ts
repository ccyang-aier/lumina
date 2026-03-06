// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductCategory = 'virtual' | 'honor' | 'physical' | 'limited'
export type RecordType = 'earned' | 'spent'
export type RedemptionStatus = 'delivered' | 'shipping' | 'processing' | 'cancelled'
export type PreviewEffect = 'halo' | 'medal' | 'bubble'

export interface Product {
  id: string
  name: string
  description: string
  icon: string
  category: ProductCategory
  price: number
  stock: number
  totalStock: number
  isPopular?: boolean
  requiredLevel?: number
  expiresAt?: Date
  isInstant?: boolean
  isPhysical?: boolean
  previewEffect?: PreviewEffect
}

export interface PointRecord {
  id: string
  timestamp: Date
  description: string
  change: number
  cumulative: number
  icon: string
  type: RecordType
}

export interface CoinRecord {
  id: string
  timestamp: Date
  description: string
  change: number
  cumulative: number
  icon: string
  type: RecordType
}

export interface RedemptionRecord {
  id: string
  timestamp: Date
  productName: string
  productIcon: string
  coinsSpent: number
  status: RedemptionStatus
  isPhysical?: boolean
  estimatedDelivery?: string
  shippingInfo?: {
    name: string
    phone: string
    address: string
  }
  logisticsNote?: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export const MARKET_USER = {
  name: '李明',
  level: 7,
  points: 1240,
  coins: 380,
  todayExchanged: 20,
  dailyExchangeLimit: 50,
}

// ─── Products ─────────────────────────────────────────────────────────────────

const _36h = new Date(Date.now() + 36 * 3600 * 1000)
const _62h = new Date(Date.now() + 62 * 3600 * 1000)

export const PRODUCTS: Product[] = [
  // ── 虚拟权益 ──────────────────────────────────────────────────────────────
  {
    id: 'v1',
    name: '月度专属功能体验券',
    description: '解锁高级 AI 辅助写作、批量卡片导出、专属统计面板等月度专属功能，让知识管理效率翻倍',
    icon: '🎫',
    category: 'virtual',
    price: 120,
    stock: 88,
    totalStock: 100,
    isPopular: true,
    isInstant: true,
  },
  {
    id: 'v2',
    name: '《深入理解 TypeScript》电子书',
    description: '300+ 页深度内容，覆盖类型体操、泛型编程与工程实践，含配套练习题与案例代码',
    icon: '📚',
    category: 'virtual',
    price: 80,
    stock: 99,
    totalStock: 100,
    isInstant: true,
  },
  {
    id: 'v3',
    name: 'AI 写作加速额度包（500次）',
    description: '额外补充 500 次 AI 辅助写作调用额度，有效期 90 天，支持摘要生成、内容扩写、结构梳理等场景',
    icon: '⚡',
    category: 'virtual',
    price: 200,
    stock: 43,
    totalStock: 50,
    isPopular: true,
    isInstant: true,
  },

  // ── 荣誉标识 ──────────────────────────────────────────────────────────────
  {
    id: 'h1',
    name: '星图探索者 · 个人主页光环',
    description: '为你的个人主页解锁专属光晕动效，在团队中独树一帜，彰显你的知识积累与影响力',
    icon: '✨',
    category: 'honor',
    price: 300,
    stock: 99,
    totalStock: 100,
    isPopular: true,
    previewEffect: 'halo',
    isInstant: true,
  },
  {
    id: 'h2',
    name: '赤金传承者 · 名片专属勋章',
    description: '镶嵌于知识名片底部的稀有勋章，代表着在 Lumina 社区中长期深耕、持续贡献的荣誉认证',
    icon: '🏅',
    category: 'honor',
    price: 500,
    stock: 6,
    totalStock: 50,
    isInstant: true,
    requiredLevel: 8,
    previewEffect: 'medal',
  },
  {
    id: 'h3',
    name: '流光信使 · 聊天消息特效气泡',
    description: '每当你在频道中发送消息，气泡将呈现流光渐变特效，让你的发言在讨论中更加显眼',
    icon: '💬',
    category: 'honor',
    price: 180,
    stock: 8,
    totalStock: 50,
    isInstant: true,
    requiredLevel: 5,
    previewEffect: 'bubble',
  },

  // ── 实物礼品 ──────────────────────────────────────────────────────────────
  {
    id: 'p1',
    name: 'Lumina 定制机械键盘 · 极光版',
    description: 'RGB 背光 87 键布局，PBT 热升华键帽，Lumina Logo 印刻，Cherry MX 红轴，附赠专属腕托',
    icon: '⌨️',
    category: 'physical',
    price: 2000,
    stock: 3,
    totalStock: 20,
    isPhysical: true,
  },
  {
    id: 'p2',
    name: 'Lumina 限定帆布周边礼盒',
    description: '帆布托特包 + A5 手账本 + 马克杯 + 限定徽章套装，全部印有 Lumina 独家视觉设计',
    icon: '🎁',
    category: 'physical',
    price: 450,
    stock: 15,
    totalStock: 50,
    isPhysical: true,
    isPopular: true,
  },
  {
    id: 'p3',
    name: 'Lumina 定制主动降噪耳机',
    description: '头戴式主动降噪，40小时超长续航，Lumina 联名配色，适配远程工作与专注学习场景',
    icon: '🎧',
    category: 'physical',
    price: 1500,
    stock: 0,
    totalStock: 10,
    isPhysical: true,
  },

  // ── 限定活动 ──────────────────────────────────────────────────────────────
  {
    id: 'l1',
    name: '季度感恩节限定礼盒 · 知识守护者版',
    description: '仅限量发放，包含限定周边、手写感谢卡及 Lumina 核心团队签名版实体书《知识的力量》',
    icon: '🎊',
    category: 'limited',
    price: 600,
    stock: 5,
    totalStock: 20,
    isPhysical: true,
    expiresAt: _36h,
  },
  {
    id: 'l2',
    name: '团队下午茶券 · 周五限定（4人份）',
    description: '每周五兑换一次团队下午茶，咖啡+甜点各4份，送达至你填写的办公室地址',
    icon: '☕',
    category: 'limited',
    price: 160,
    stock: 12,
    totalStock: 30,
    isPhysical: true,
    expiresAt: _62h,
    isPopular: true,
  },
]

// ─── Records ──────────────────────────────────────────────────────────────────

export const POINT_RECORDS: PointRecord[] = [
  {
    id: 'pr1',
    timestamp: new Date('2026-02-28T14:32:00'),
    description: '你的《Vue3 响应式原理深解》帮助了一位同事，知识复用 +1',
    change: 15,
    cumulative: 1240,
    icon: '🔄',
    type: 'earned',
  },
  {
    id: 'pr2',
    timestamp: new Date('2026-02-28T09:15:00'),
    description: '完成「微服务架构实战」远征任务，获得任务奖励',
    change: 80,
    cumulative: 1225,
    icon: '⚔️',
    type: 'earned',
  },
  {
    id: 'pr3',
    timestamp: new Date('2026-02-27T16:48:00'),
    description: '积分兑换金币，消耗 200 积分',
    change: -200,
    cumulative: 1145,
    icon: '🪙',
    type: 'spent',
  },
  {
    id: 'pr4',
    timestamp: new Date('2026-02-26T11:20:00'),
    description: '《K8s 网络模型完全指南》通过内容复审，质量标准已达 A 级',
    change: 30,
    cumulative: 1345,
    icon: '✅',
    type: 'earned',
  },
  {
    id: 'pr5',
    timestamp: new Date('2026-02-25T15:06:00'),
    description: '你解决了陈雪提出的 React Hooks 闭包陷阱问题，被标记为「最佳解答」',
    change: 25,
    cumulative: 1315,
    icon: '💡',
    type: 'earned',
  },
  {
    id: 'pr6',
    timestamp: new Date('2026-02-24T10:33:00'),
    description: '发布知识卡片《前端性能优化：从 LCP 到 FID》',
    change: 20,
    cumulative: 1290,
    icon: '📝',
    type: 'earned',
  },
  {
    id: 'pr7',
    timestamp: new Date('2026-02-22T09:47:00'),
    description: '你的《Rust 所有权机制》被 5 位成员收藏并复用，影响力持续扩展',
    change: 50,
    cumulative: 1270,
    icon: '⭐',
    type: 'earned',
  },
  {
    id: 'pr8',
    timestamp: new Date('2026-02-19T14:20:00'),
    description: '参与「AI 工具链整合」远征支线任务，贡献内容已验收',
    change: 45,
    cumulative: 1220,
    icon: '🚀',
    type: 'earned',
  },
]

export const COIN_RECORDS: CoinRecord[] = [
  {
    id: 'cr1',
    timestamp: new Date('2026-02-28T09:20:00'),
    description: '积分兑换：消耗 200 积分兑换 20 金币',
    change: 20,
    cumulative: 380,
    icon: '✨',
    type: 'earned',
  },
  {
    id: 'cr2',
    timestamp: new Date('2026-02-20T11:00:00'),
    description: '兑换「月度专属功能体验券」',
    change: -120,
    cumulative: 360,
    icon: '🎫',
    type: 'spent',
  },
  {
    id: 'cr3',
    timestamp: new Date('2026-02-18T16:30:00'),
    description: '积分兑换：消耗 500 积分兑换 50 金币',
    change: 50,
    cumulative: 480,
    icon: '✨',
    type: 'earned',
  },
  {
    id: 'cr4',
    timestamp: new Date('2026-02-10T10:15:00'),
    description: '积分兑换：消耗 500 积分兑换 50 金币',
    change: 50,
    cumulative: 430,
    icon: '✨',
    type: 'earned',
  },
]

export const REDEMPTION_RECORDS: RedemptionRecord[] = [
  {
    id: 'rr1',
    timestamp: new Date('2026-02-20T11:05:00'),
    productName: '月度专属功能体验券',
    productIcon: '🎫',
    coinsSpent: 120,
    status: 'delivered',
    isPhysical: false,
  },
  {
    id: 'rr2',
    timestamp: new Date('2026-01-28T14:20:00'),
    productName: 'Lumina 限定帆布周边礼盒',
    productIcon: '🎁',
    coinsSpent: 450,
    status: 'shipping',
    isPhysical: true,
    estimatedDelivery: '2026-03-05',
    shippingInfo: {
      name: '李明',
      phone: '138****8888',
      address: '北京市朝阳区望京SOHO T3 1801',
    },
    logisticsNote: '顺丰速运，预计3-5个工作日送达',
  },
  {
    id: 'rr3',
    timestamp: new Date('2026-01-15T09:30:00'),
    productName: 'AI 写作加速额度包（500次）',
    productIcon: '⚡',
    coinsSpent: 200,
    status: 'delivered',
    isPhysical: false,
  },
  {
    id: 'rr4',
    timestamp: new Date('2025-12-24T17:45:00'),
    productName: '圣诞节限定周边礼盒',
    productIcon: '🎄',
    coinsSpent: 500,
    status: 'cancelled',
    isPhysical: true,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProductStatus(
  product: Product,
  userLevel: number,
  userCoins: number,
): 'available' | 'low-stock' | 'sold-out' | 'level-locked' | 'coin-insufficient' {
  if (product.stock === 0) return 'sold-out'
  if (product.requiredLevel && userLevel < product.requiredLevel) return 'level-locked'
  if (userCoins < product.price) return 'coin-insufficient'
  if (product.stock <= 10) return 'low-stock'
  return 'available'
}
