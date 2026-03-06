export type RarityType = 'normal' | 'elite' | 'epic' | 'legendary';
export type ExpeditionType = 'gap' | 'governance' | 'epic' | 'guild';
export type ExpeditionStatus = 'active' | 'available' | 'completed';
export type SubtaskStatus = 'completed' | 'in_progress' | 'available';

export const RARITY_CONFIG: Record<RarityType, {
  label: string; icon: string; color: string; glow: string;
  border: string; bgDark: string; bgLight: string; gradient: string;
}> = {
  normal: {
    label: '普通', icon: '⚡',
    color: '#a8b3c8',
    glow: 'rgba(168, 179, 200, 0.55)',
    border: 'rgba(168, 179, 200, 0.35)',
    bgDark: 'rgba(168, 179, 200, 0.04)',
    bgLight: 'rgba(100, 116, 139, 0.04)',
    gradient: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
  },
  elite: {
    label: '精英', icon: '◈',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.6)',
    border: 'rgba(56, 189, 248, 0.4)',
    bgDark: 'rgba(56, 189, 248, 0.04)',
    bgLight: 'rgba(14, 165, 233, 0.04)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
  },
  epic: {
    label: '史诗', icon: '◆',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.65)',
    border: 'rgba(192, 132, 252, 0.45)',
    bgDark: 'rgba(192, 132, 252, 0.05)',
    bgLight: 'rgba(168, 85, 247, 0.04)',
    gradient: 'linear-gradient(135deg, #9333ea, #c084fc)',
  },
  legendary: {
    label: '传说', icon: '★',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.65)',
    border: 'rgba(251, 191, 36, 0.5)',
    bgDark: 'rgba(251, 191, 36, 0.05)',
    bgLight: 'rgba(245, 158, 11, 0.04)',
    gradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
  },
};

export const TYPE_CONFIG: Record<ExpeditionType, { label: string; color: string; bg: string }> = {
  gap:        { label: '缺口', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
  governance: { label: '治理', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  epic:       { label: '史诗', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
  guild:      { label: '公会', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
};

export interface Participant {
  id: string;
  name: string;
  initials: string;
  color: string;
  contribution: number;
  completedTasks: number;
  totalTasks: number;
  points: number;
}

export interface Subtask {
  id: string;
  title: string;
  status: SubtaskStatus;
  assignee?: string;
  assigneeInitials?: string;
  assigneeColor?: string;
  points: number;
  progress?: number;
}

export interface Expedition {
  id: string;
  title: string;
  description: string;
  rarity: RarityType;
  type: ExpeditionType;
  status: ExpeditionStatus;
  bossName: string;
  bossHp: number;
  progress: number;
  participants: Participant[];
  maxParticipants: number;
  deadline: string;
  pointsMin: number;
  pointsMax: number;
  medal?: string;
  subtasks: Subtask[];
  initiator: string;
  reason: string[];
  completedSubtasks: number;
  inProgressSubtasks: number;
  availableSubtasks: number;
}

export const MOCK_EXPEDITIONS: Expedition[] = [
  {
    id: 'exp-001',
    title: '完善 DevOps 知识体系',
    description: '我们的 CI/CD 流程文档严重滞后，新人频繁走弯路，是时候建立完整的 DevOps 知识防线。',
    rarity: 'epic',
    type: 'epic',
    status: 'active',
    bossName: 'DevOps 知识荒原',
    bossHp: 48,
    progress: 52,
    participants: [
      { id: 'u1', name: '李四', initials: '李', color: '#c084fc', contribution: 80, completedTasks: 1, totalTasks: 2, points: 160 },
      { id: 'u2', name: '王五', initials: '王', color: '#38bdf8', contribution: 60, completedTasks: 0, totalTasks: 1, points: 0 },
      { id: 'u3', name: '赵六', initials: '赵', color: '#34d399', contribution: 40, completedTasks: 0, totalTasks: 1, points: 0 },
      { id: 'u4', name: '孙七', initials: '孙', color: '#f87171', contribution: 25, completedTasks: 0, totalTasks: 1, points: 0 },
      { id: 'u5', name: '周八', initials: '周', color: '#fbbf24', contribution: 15, completedTasks: 0, totalTasks: 1, points: 0 },
    ],
    maxParticipants: 20,
    deadline: '2026-03-01',
    pointsMin: 500,
    pointsMax: 1000,
    medal: 'DevOps 铸造师',
    subtasks: [
      { id: 's1', title: 'CI/CD 流程总览图', status: 'completed', assignee: '李四', assigneeInitials: '李', assigneeColor: '#c084fc', points: 80, progress: 100 },
      { id: 's2', title: 'GitHub Actions 实战指南', status: 'in_progress', assignee: '王五', assigneeInitials: '王', assigneeColor: '#38bdf8', points: 100, progress: 60 },
      { id: 's3', title: 'Docker 容器化部署规范', status: 'in_progress', assignee: '赵六', assigneeInitials: '赵', assigneeColor: '#34d399', points: 100, progress: 40 },
      { id: 's4', title: 'K8s 集群管理 FAQ', status: 'available', points: 80 },
      { id: 's5', title: '监控告警配置指南', status: 'available', points: 120 },
      { id: 's6', title: 'ArgoCD GitOps 最佳实践', status: 'available', points: 100 },
      { id: 's7', title: 'Helm Chart 编写规范', status: 'available', points: 90 },
      { id: 's8', title: '流水线安全扫描配置', status: 'in_progress', assignee: '孙七', assigneeInitials: '孙', assigneeColor: '#f87171', points: 110, progress: 25 },
    ],
    initiator: '系统 AI + 管理员 @张工',
    reason: [
      '过去 60 天「CI/CD」相关搜索 147 次，成功率仅 31%',
      '新人问卷显示「DevOps 上手」是最大痛点（78% 提及）',
      '检测到 12 个重复问题集中在 K8s 部署环节',
    ],
    completedSubtasks: 1,
    inProgressSubtasks: 3,
    availableSubtasks: 4,
  },
  {
    id: 'exp-002',
    title: '补充 K8s 故障排查 FAQ',
    description: 'AI 侦测到「k8s pod crashloop」等关键词高频搜索，知识库严重缺乏实战排查内容。',
    rarity: 'normal',
    type: 'gap',
    status: 'completed',
    bossName: 'K8s 混沌之源',
    bossHp: 0,
    progress: 100,
    participants: [
      { id: 'u6', name: '陈工', initials: '陈', color: '#34d399', contribution: 100, completedTasks: 1, totalTasks: 1, points: 120 },
      { id: 'u7', name: '刘工', initials: '刘', color: '#38bdf8', contribution: 100, completedTasks: 1, totalTasks: 1, points: 120 },
    ],
    maxParticipants: 5,
    deadline: '2026-02-15',
    pointsMin: 50,
    pointsMax: 150,
    subtasks: [
      { id: 's9',  title: 'Pod CrashLoopBackOff 排查指南', status: 'completed', assignee: '陈工', assigneeInitials: '陈', assigneeColor: '#34d399', points: 120, progress: 100 },
      { id: 's10', title: 'OOMKilled 内存溢出处理手册', status: 'completed', assignee: '刘工', assigneeInitials: '刘', assigneeColor: '#38bdf8', points: 120, progress: 100 },
    ],
    initiator: '系统 AI（自动发现）',
    reason: [
      '过去 30 天内「k8s pod crashloop」搜索 23 次',
      '零结果搜索累计超过阈值触发自动发起',
    ],
    completedSubtasks: 2,
    inProgressSubtasks: 0,
    availableSubtasks: 0,
  },
  {
    id: 'exp-003',
    title: '清理冗余 React 最佳实践文档',
    description: '知识库中存在大量过时的 React Class Component 文档，与现代函数式组件最佳实践冲突，亟需统一治理。',
    rarity: 'elite',
    type: 'governance',
    status: 'available',
    bossName: '遗忘代码之灵',
    bossHp: 100,
    progress: 0,
    participants: [],
    maxParticipants: 8,
    deadline: '2026-03-15',
    pointsMin: 200,
    pointsMax: 400,
    subtasks: [
      { id: 's11', title: '梳理过时 Class Component 文档列表', status: 'available', points: 60 },
      { id: 's12', title: '重写 React Hook 最佳实践', status: 'available', points: 100 },
      { id: 's13', title: '更新 Context API 使用指南', status: 'available', points: 80 },
      { id: 's14', title: '合并重复的 useState 使用文档', status: 'available', points: 70 },
    ],
    initiator: '系统 AI（内容质量检测）',
    reason: [
      '检测到 31 篇内容主题高度重叠（相似度 > 85%）',
      '过时内容导致用户困惑，负面反馈率上升 23%',
    ],
    completedSubtasks: 0,
    inProgressSubtasks: 0,
    availableSubtasks: 4,
  },
  {
    id: 'exp-004',
    title: '构建 LLM 应用开发全景知识图谱',
    description: '跨越 Prompt Engineering、RAG 架构、Fine-tuning、Agent 设计的史诗级知识建设任务，打造公司 AI 开发的终极圣典。',
    rarity: 'legendary',
    type: 'epic',
    status: 'available',
    bossName: '混沌神经巨兽',
    bossHp: 100,
    progress: 0,
    participants: [
      { id: 'u8', name: '首席AI工程师', initials: 'AI', color: '#fbbf24', contribution: 0, completedTasks: 0, totalTasks: 5, points: 0 },
    ],
    maxParticipants: 50,
    deadline: '2026-04-30',
    pointsMin: 1500,
    pointsMax: 3000,
    medal: 'AI 缔造者',
    subtasks: [
      { id: 's15', title: 'Prompt Engineering 完全指南', status: 'available', points: 200 },
      { id: 's16', title: 'RAG 系统架构设计文档', status: 'available', points: 250 },
      { id: 's17', title: 'Fine-tuning 实战手册', status: 'available', points: 220 },
      { id: 's18', title: 'LLM Agent 设计模式', status: 'available', points: 200 },
      { id: 's19', title: '向量数据库选型与实践', status: 'available', points: 180 },
      { id: 's20', title: 'LLM 评估与 Benchmark 指南', status: 'available', points: 160 },
    ],
    initiator: '管理员 @CEO',
    reason: [
      '战略级知识储备需求，全公司 AI 能力建设基础',
      'LLM 相关搜索月均 340+ 次，成功率仅 18%',
      '新业务拓展需要完整的 AI 开发知识体系支撑',
    ],
    completedSubtasks: 0,
    inProgressSubtasks: 0,
    availableSubtasks: 6,
  },
  {
    id: 'exp-005',
    title: '前端性能优化实战手册',
    description: '系统性梳理前端性能瓶颈与优化策略，覆盖 Core Web Vitals、Bundle 优化、渲染性能等核心主题。',
    rarity: 'elite',
    type: 'gap',
    status: 'active',
    bossName: '性能瓶颈之龙',
    bossHp: 65,
    progress: 35,
    participants: [
      { id: 'u9',  name: '前端小李', initials: '李', color: '#38bdf8', contribution: 70, completedTasks: 1, totalTasks: 2, points: 90 },
      { id: 'u10', name: '性能专家', initials: '专', color: '#34d399', contribution: 30, completedTasks: 0, totalTasks: 1, points: 0 },
    ],
    maxParticipants: 10,
    deadline: '2026-03-20',
    pointsMin: 200,
    pointsMax: 400,
    subtasks: [
      { id: 's21', title: 'Core Web Vitals 优化指南', status: 'completed', assignee: '前端小李', assigneeInitials: '李', assigneeColor: '#38bdf8', points: 90, progress: 100 },
      { id: 's22', title: 'Webpack/Vite Bundle 体积优化', status: 'in_progress', assignee: '前端小李', assigneeInitials: '李', assigneeColor: '#38bdf8', points: 100, progress: 70 },
      { id: 's23', title: 'React 虚拟列表与懒加载实践', status: 'in_progress', assignee: '性能专家', assigneeInitials: '专', assigneeColor: '#34d399', points: 110, progress: 30 },
      { id: 's24', title: '图片优化与 CDN 最佳实践', status: 'available', points: 80 },
    ],
    initiator: '系统 AI（自动发现）',
    reason: [
      '过去 45 天内「前端性能」相关搜索 89 次，成功率 22%',
      '用户反馈中「性能优化」知识缺乏占比 45%',
    ],
    completedSubtasks: 1,
    inProgressSubtasks: 2,
    availableSubtasks: 1,
  },
];

export function getExpeditionById(id: string): Expedition | undefined {
  return MOCK_EXPEDITIONS.find(e => e.id === id);
}

export function getExpeditionsByStatus(status: ExpeditionStatus): Expedition[] {
  return MOCK_EXPEDITIONS.filter(e => e.status === status);
}
