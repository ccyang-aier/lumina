# Lumina前端项目

## 项目组织结构

```txt
frontend/
├─ src/                          前端源码（TypeScript + React）
│  ├─ app/                       Next.js App Router（路由、页面、全局样式与布局）
│  ├─ components/                可复用组件集合
│  │  ├─ ui/                     默认存放引入/适配的自shadcn/ui等的基础组件；
│  │  ├─ layout/                 存放布局相关的组件，如导航栏、侧边栏、页脚等；
│  │  ├─ home/                   业务/页面分区组件（首页分区、模块化区块）
│  │  ├─ magicui/                存放引入/适配自magicui的组件；
│  │  ├─ aceternityui/           存放引入/适配自aceternityui的组件；
│  │  ├─ design/                 存放非引入的、自定义组件（推荐按“组件目录 + 私有样式”组织）
│  │  └─ component-use-examples/ 组件用法示例与演示材料（文档/样例）
│  ├─ lib/                       通用工具与可复用逻辑（utils、hooks、第三方封装等）
│  └─ config/                    项目配置与常量（站点信息、运行时配置等）
├─ docs/                         项目文档与设计资料（规范、配色方案等）
├─ scripts/                      本地脚本与一次性工具（开发辅助）
├─ .eslintrc.json                ESLint 配置（next lint）
├─ components.json               shadcn/ui 配置（组件生成与路径约定）
├─ next.config.mjs               Next.js 配置
├─ postcss.config.mjs            PostCSS 配置（Tailwind 相关）
├─ next-env.d.ts                 Next.js TypeScript 环境声明
├─ tsconfig.json                 TypeScript 配置（路径别名、严格性等）
├─ package.json                  依赖与脚本入口（dev/build/lint/typecheck）
├─ package-lock.json             依赖锁定文件（npm）
├─ .next/                        Next.js 构建/运行产物（自动生成，不应手改）
└─ dist/                         额外构建产物目录（若无使用场景建议清理/忽略）
```

目录结构划分约定：
- 路由入口统一放在 src/app：每个页面对应一个路由段目录（如 src/app/xxx/page.tsx），布局与边界文件（layout/loading/error/not-found/route）按路由段就近放置，保持最佳实践；
- 可复用 UI 组件放在 src/components；若仅服务某一个路由且不考虑复用，可选择放在对应路由段下的私有目录（例如 src/app/(group)/_components）；
