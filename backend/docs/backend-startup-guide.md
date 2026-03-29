# Lumina 后端服务启动指南

## 概述

Lumina 后端基于 **Litestar** 框架构建，使用以下核心组件：

| 组件 | 技术 | 用途 |
|------|------|------|
| Web框架 | Litestar | ASGI 应用框架 |
| ORM | SQLAlchemy 2.0 (async) | 数据库操作 |
| 数据库 | PostgreSQL | 数据存储 |
| 缓存 | Redis | 缓存/会话存储 |
| 数据库迁移 | Alembic | 数据库版本管理 |
| 运行时 | Uvicorn | ASGI 服务器 |

## 架构设计说明

### 服务依赖关系

**重要**：后端应用启动时**不会**自动拉起数据库和 Redis 服务。这些服务需要单独启动和管理。

```
┌─────────────────────────────────────────────────────────┐
│                    Lumina Backend                        │
│                   (Litestar App)                         │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │PostgreSQL│ │  Redis   │ │  其他服务 │
   │  :5432   │ │  :6379   │ │   ...    │
   └──────────┘ └──────────┘ └──────────┘
```

### 应用启动流程

1. **启动时** (`on_startup`):
   - 初始化日志系统
   - 创建数据库引擎和连接池
   - **不**自动创建数据表（由 Alembic 迁移管理）

2. **关闭时** (`on_shutdown`):
   - 关闭数据库连接池
   - 清理资源

## 环境准备

### 1. 安装依赖

后端运行在 WSL 环境中，使用 conda 管理依赖：

```bash
# 进入 WSL
wsl

# 激活 conda 环境
conda activate box

# 进入后端目录
cd /mnt/c/AIWorks/Lumina/lumina/backend

# 安装依赖（首次运行）
pip install -r requirements.txt
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库和 Redis 连接信息：

```ini
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=lumina

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. 启动依赖服务

在启动后端之前，确保以下服务已运行：

#### PostgreSQL

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 启动 PostgreSQL
sudo systemctl start postgresql

# 创建数据库（首次）
sudo -u postgres createdb lumina
```

#### Redis

```bash
# 检查 Redis 状态
sudo systemctl status redis

# 启动 Redis
sudo systemctl start redis
```

## 启动后端服务

### 方式一：使用快捷脚本（推荐）

从 Windows PowerShell 执行：

```powershell
# 在 backend 目录下执行
.\scripts\start-backend-command.ps1 "python app.py"
```

该脚本会：
1. 启动 WSL
2. 激活 conda 环境 `box`
3. 切换到后端目录
4. 执行指定命令

### 方式二：手动启动

```bash
# 进入 WSL
wsl

# 激活 conda 环境
conda activate box

# 进入后端目录
cd /mnt/c/AIWorks/Lumina/lumina/backend

# 启动服务
python app.py
```

### 启动参数

服务默认配置：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| Host | 0.0.0.0 | 监听地址 |
| Port | 8000 | 监听端口 |
| Reload | True | 开发模式热重载 |

服务启动后可访问：

- **API**: http://localhost:8000/api
- **健康检查**: http://localhost:8000/api/health
- **API 文档**: http://localhost:8000/docs

## 数据库迁移

### 初始化数据库

使用 Alembic 管理数据库迁移：

```powershell
# 生成初始迁移
.\scripts\start-backend-command.ps1 "alembic revision --autogenerate -m 'initial'"

# 执行迁移
.\scripts\start-backend-command.ps1 "alembic upgrade head"
```

### 常用迁移命令

```bash
# 查看迁移历史
alembic history

# 查看当前版本
alembic current

# 升级到最新版本
alembic upgrade head

# 回退一个版本
alembic downgrade -1

# 生成新的迁移
alembic revision --autogenerate -m "description"
```

## 常见问题

### 1. 数据库连接失败

**错误**: `Connection refused` 或 `could not connect to server`

**解决**:
- 确认 PostgreSQL 服务已启动
- 检查 `.env` 中的数据库配置
- 确认数据库 `lumina` 已创建

### 2. Redis 连接失败

**错误**: `Connection refused` (Redis)

**解决**:
- 确认 Redis 服务已启动
- 检查 `.env` 中的 Redis 配置

### 3. 端口被占用

**错误**: `Address already in use: 8000`

**解决**:
```bash
# 查找占用进程
lsof -i :8000

# 终止进程
kill -9 <PID>
```

### 4. conda 环境问题

**错误**: `conda: command not found`

**解决**:
- 确保 WSL 中已安装 Miniforge/Anaconda
- 检查脚本中的 conda 初始化路径是否正确

## 开发调试

### 启用调试模式

在 `.env` 中设置：

```ini
APP_DEBUG=true
APP_ENVIRONMENT=development
```

### 查看日志

日志文件位置：

```
backend/logs/
├── lumina.log      # 应用日志
└── error.log       # 错误日志
```

实时查看日志：

```bash
tail -f logs/lumina.log
```

### API 测试

使用内置的 Swagger UI 进行 API 测试：

1. 启动服务后访问 http://localhost:8000/docs
2. 点击任意 API 端点
3. 点击 "Try it out" 进行测试
