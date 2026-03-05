# Lumina 知识共享、共创平台

Lumina 是一个基于现代化技术栈构建的知识共享与共创平台，旨在提供高效、优雅的知识管理与协作体验。

## 📁 目录结构

项目采用前后端分离的架构：

*   **frontend/**: 前端项目核心代码
    *   框架：Next.js 15 (App Router)
    *   UI库：React 19 + Tailwind CSS 4 + Shadcn/UI
    *   语言：TypeScript
*   **backend/**: 后端项目核心代码
    *   语言：Python
    *   (目前主要关注前端部分，后端服务正在开发中)

## 🚀 快速开始 (前端)

以下指南将帮助你在本地环境中快速启动前端项目。

### 1. 环境要求

在开始之前，请确保你的开发环境满足以下要求：

*   **Node.js**: v18.17.0 或更高版本 (Next.js 15 的最低要求)
*   **包管理器**: 推荐使用 `npm` (项目包含 `package-lock.json`) 或 `pnpm`

### 2. 安装与运行

#### 第一步：获取代码

如果你已经下载了代码，请直接进入项目根目录。

```bash
cd lumina
```

#### 第二步：安装前端依赖

1.  进入前端目录：
    ```bash
    cd frontend
    ```

2.  安装依赖包：
    ```bash
    npm install
    # 如果你使用 pnpm:
    # pnpm install
    ```

#### 第三步：启动开发服务器

在 `frontend` 目录下运行以下命令：

```bash
npm run dev
# 或者使用 pnpm:
# pnpm dev
```

#### 第四步：访问应用

启动成功后，控制台将显示访问地址。请在浏览器中打开：

[http://localhost:3000](http://localhost:3000)

## 🛠️ 常用命令

在 `frontend` 目录下：

*   `npm run dev`: 启动开发服务器
*   `npm run build`: 构建生产版本
*   `npm run start`: 运行构建后的生产版本
*   `npm run lint`: 运行代码检查

## 📝 开发规范

*   本项目严格遵循 TypeScript 类型规范。
*   代码风格统一使用 ESLint 和 Prettier 进行管理。
*   推荐使用 VS Code 编辑器，并安装 ESLint、Prettier 和 Tailwind CSS 插件以获得最佳开发体验。
