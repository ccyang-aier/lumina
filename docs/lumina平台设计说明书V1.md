# Lumina 知识平台 v1 设计说明书
**Version:** 1.0  
**Architecture:** Modular Monolith（模块化单体）  
**Backend:** Python + Litestar  
**Date:** 2026-02-16  

---

## 1. 背景与目标

Lumina 是一个 AI 驱动的企业内部知识共创平台：把零散知识（文档、FAQ、复盘、脚本、模板等）沉淀为结构化“知识卡”，通过可追溯检索与 AI 问答提升复用效率，并用治理与激励机制推动持续维护。

### 1.1 北极星指标（North Star）
**每周“被有效复用的知识量”**：知识卡被引用、被标记“解决了我的问题”、被纳入学习路径/项目文档的总次数。

### 1.2 护栏指标（Guardrails）
- 搜索成功率：搜索后点击并停留 >30s 或标记“有用”的比例
- 过期内容比例：超过复审周期且仍高访问的卡片占比
- AI 回答可追溯率：AI 回复中携带有效引用来源的比例
- 重复提问率：同类问题在 IM/工单中重复出现频次
- 新人上手周期：从入职到独立承担任务的平均天数

### 1.3 设计原则（必须落到表与流程）
1. 可信可追溯：任何 AI 回答必须带引用；内容必须有来源、版本与审计痕迹。
2. 权限一致性：卡片、附件、索引、向量与 AI 引用都用同一权限模型过滤。
3. 结构化优先：正文可以富文本，但关键字段结构化（摘要、适用范围、步骤、风险、有效期、Owner）。
4. 生命周期治理内建：复审、过期降权、归档是系统机制，不依赖运营“喊话”。
5. 复用与维护优先：奖励“被复用/被采纳/被维护”，适当弱化“发得多”，但注意发得多本身也是正向行为。
6. 趣味与公平并重：用可解释、可防刷的机制鼓励共创、共评、共治。
7. 轻量起步，可演进：先跑通核心闭环；通过事件与边界为后续拆分铺路。

---

## 2. 核心概念与术语
- 知识卡（Card）：平台最小知识单元（doc/faq/howto/postmortem/snippet/template/policy 等统一抽象）
- 主题（Taxonomy）：知识地图树节点（受控层级）
- 标签（Tag）：自由或受控标签（可与主题并存）
- 权威层（Authority）：通过评审/指定来源形成的可信内容层
- 引用（Reference/Citation）：卡片间引用、AI 回答引用、外部文档引用
- 缺口（Gap）：零结果搜索、AI 低置信/无引用、高频未解决反馈形成的待补知识任务
- 积分（Points）/金币（Coins）：积分用于贡献与影响力；金币用于兑换（可后置）

---

## 3. 总体架构

### 3.1 架构形态：模块化单体
物理上保持一个部署单元（或少量同仓组件），逻辑上强边界分模块，模块间通过应用服务接口与领域事件通信。

```
┌─────────────────────────────────────────────────────────────┐
│                          客户端                              │
│                    Web SPA (React/Next.js)                  │
|             （后续可扩：windows桌面应用、手机端app等）           │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                 接入层（Traefik/Nginx）                       │
│        鉴权中间件 / 限流 / 审计 / 安全头                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                 应用层（Litestar Monolith）                   │
│  API 层 → Service 层 → Domain 层 → Infra 层                   │
│  模块：Auth/Org、ACL、Cards、Search、AI、Notify、Admin...      │
│  可靠事件：Outbox（DB 事务内写入）                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Worker（SAQ）                               │
│  消费 Outbox/异步任务：解析切分/向量化/索引/通知/统计/导入          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│             PostgreSQL 16 + pgvector   MeiliSearch           │
│             Redis（会话/限流/缓存/队列）  MinIO/S3             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 单体内部逻辑分层
- API 层：路由、鉴权、输入校验、限流、统一错误码与分页
- Service 层：业务用例编排（创建卡/发布/评审/问答/积分结算）
- Domain 层：实体、状态机、规则（生命周期、评审策略、积分规则）
- Infra 层：Repository、搜索/向量/对象存储/LLM 客户端、审计

### 3.3 前后端分离与仓库组织（Monorepo）
Lumina 采用前后端分离：后端只提供 API 与异步任务能力；前端独立构建与部署，通过 HTTP 调用后端。

推荐把前端与后端放在同一个主目录下统一协作（便于本地一键启动、接口联调、统一 CI），示例结构：

```
/lumina
  /backend    # 后端 API（Litestar）+ worker（SAQ）+ 数据迁移等
  /frontend   # 前端 Web SPA（独立构建与部署）
  /docs       # 设计文档
```

---

## 4. 技术选型（v1 统一决策）

### 4.1 前端

前端基于React+ Next.js相关技术栈，并选择现代、优雅、美观的UI库或者组件库等进行前端开发，我不是很倾向于使用较为成熟和较老的一些组件库，比如Material-UI、Ant Design等，我更倾向于使用一些新兴的组件库（可能需要你检索或者寻找），因为这往往意味着更美观、更现代、并且视觉设计更精致优美，不千篇一律，这也是我的前端界面设计理念。

### 4.2 后端与数据
- Web：Litestar 2.x
- ORM：SQLAlchemy 2.0（async）+ Alembic
- DTO/序列化：msgspec（API 高频路径），AI/复杂结构可选用 Pydantic v2
- 主库：PostgreSQL 16+
- 向量：pgvector（卡片分块 embedding 存储与相似度检索）
- 全文检索：MeiliSearch（轻量、typo-tolerant、运维成本低）
- 对象存储：MinIO / S3
- 缓存/会话/限流：Redis（或 Valkey）
- 异步任务：SAQ（Redis broker）

### 4.3 可观测与安全
- 结构化日志：structlog（JSON）
- Metrics：Prometheus
- Trace：OpenTelemetry（覆盖检索与 LLM 调用链路）
- 健康检查：/health、/readiness

### 4.4 AI 能力（不止 RAG）
Lumina 的 AI 不是“附加的问答入口”，而是贯穿知识生产、治理、消费与学习的基础能力层：
- LLM/Embedding：统一网关（密钥管理、审计、限流、模型切换、Prompt 版本化）
- AI 生成与增强（创作侧）：摘要/标签/主题建议、结构化字段补全、语气与模板对齐、引用自动补齐
- AI 治理与质量（治理侧）：重复检测、过期/不一致提示、敏感信息提示、事实性检查建议、知识缺口自动沉淀
- AI 检索与问答（消费侧）：混合检索 + 引用强制 + 低置信策略（追问/引导到缺口/提示人工确认）
- AI 个性化（学习侧）：岗位/主题学习路径生成与迭代、基于行为反馈优化推荐与引导
- AI 评估（工程侧）：引用覆盖率、命中率、幻觉率等指标可观测与持续回归
- AI 帮学：对于已学习的优质内容、教程或文章，利用AI能力自动生成考核题目，已校验学习成果或者短期内快速温故
- 文档解析：按格式择优（MVP 先支持 Markdown/PDF/DOCX；后续逐步扩展更多格式与解析策略）

---

## 5. 全局统一规范

### 5.1 主键与审计字段
- 主键：UUID v7（有序、利于索引与时间排序）
- 软删除：`is_deleted`、`deleted_at`
- 审计：`created_at`、`updated_at`、`created_by`、`updated_by`

日志/台账类表允许只保留 `id + created_at`（按需裁剪），其余表默认包含上述字段。

### 5.2 统一错误格式
统一响应：`{"code": "MODULE.ERROR_NAME", "message": "...", "detail": {...}}`

### 5.3 统一事件模型（可靠一致性）
采用 Outbox Pattern：业务事务与 `outbox_events` 同事务提交，worker 异步投递执行副作用（索引、向量、通知、积分等），避免“主库成功但索引失败”的不一致。

---

## 6. 权限模型（RBAC + 资源可见域 + 精细授权）

### 6.1 角色（RBAC）
建议内置角色：`super_admin`、`admin`、`reviewer`、`curator`、`member`。  
权限以字符串编码：如 `card.read`、`card.write`、`admin.user_import`、`review.approve`。

### 6.2 资源可见域（Visibility）
资源（卡片、附件、索引文档、向量 chunk、AI 引用）统一携带：
- `public`：全员可见
- `dept`：部门及子部门可见（基于 `departments.path` 前缀）
- `project`：项目/空间成员可见
- `private`：指定人/部门/角色临时授权

### 6.3 精细授权（ACL/Grants）
对 `private` 和临时授权使用授权表（也可覆盖 project 场景）：
- 支持对 user/dept/project/role 授予 read/edit
- 支持 `expires_at`（临时授权）

### 6.4 强制一致的权限检查点
- API：路由 Guard + 资源加载时二次校验
- 搜索：MeiliSearch/pgvector 用“粗过滤（可见域）+ 细过滤（DB ACL）”的双阶段策略
- AI：召回阶段必须过滤权限；引用解析阶段二次验证，禁止泄露无权内容
- 附件：下载必须通过后端签名 URL，下游对象存储不直接暴露

---

## 7. 数据模型（按模块）

> 说明：为可读性，这里列出关键字段；所有业务表默认含审计字段与软删字段（除非注明）。
>
> 重要：本节的库表设计用于统一团队认知与提前发现“缺字段/缺状态/缺约束”，并非最终版。后续会在实现与演进中持续调整字段、索引与拆表策略。

### 7.1 用户与组织（Org/User）
**`users`**
- `id`（UUIDv7）
- `employee_no`（unique）
- `name`
- `email`（unique，可选）
- `dept_id`
- `title`
- `manager_id`（PL）
- `mentor_id`
- `status`（active/inactive/left）
- `last_login_at`

**`departments`**
- `id`
- `name`
- `parent_id`
- `path`（物化路径：用于“部门及子部门”查询）
- `level`
- `leader_id`

### 7.2 认证与会话（Auth）
MVP 默认支持账号密码 + JWT（Access/Refresh），预留 OIDC。

**`auth_identities`**
- `id`
- `user_id`
- `provider`（local/oidc/saml）
- `provider_subject`（unique）
- `meta_json`

**`user_sessions`**（可选：用于主动失效/审计；会话主体可放 Redis）
- `id`
- `user_id`
- `token_hash`
- `ip_address`
- `user_agent`
- `expires_at`
- `revoked_at`

### 7.3 角色与授权（ACL）
**`roles`**
- `id`
- `code`（unique）
- `name`
- `permissions_json`（如 `["card.read", "admin.*"]`）

**`user_roles`**
- `id`
- `user_id`
- `role_id`
- `scope_type`（global/dept/project）
- `scope_id`（nullable）

**`resource_grants`**
- `id`
- `resource_type`（card/attachment）
- `resource_id`
- `grantee_type`（user/dept/project/role）
- `grantee_id`
- `permission`（read/edit）
- `expires_at`（nullable）

### 7.4 知识库（Cards）
**`cards`**
- `id`
- `type`（doc/faq/howto/postmortem/snippet/template/policy/blog）
- `title`
- `summary`（可由 AI 生成）
- `content_format`（markdown/json_blocks）
- `content`（TEXT 或 JSONB）
- `owner_id`
- `dept_id`
- `status`（draft/pending_review/published/archived）
- `visibility`（public/dept/project/private）
- `project_id`（nullable）
- `authority_level`（normal/authoritative）
- `index_status`（pending/processing/ready/failed）
- `vector_status`（pending/processing/ready/failed）
- `processing_status`（可选：统一聚合字段，如 pending/processing/ready/partial/failed）
- `last_indexed_at`、`last_vectorized_at`（nullable）
- `review_cycle_days`（default 90）
- `next_review_at`（nullable）
- `published_at`、`last_published_at`
- `source_type`（manual/import/url/meeting/repo）
- `source_url`、`source_ref`（nullable）
- `metrics_json`（冗余统计：view/solve/reference/favorite 等）
- `content_hash`（用于去重/重复检测）

#### 7.4.1 “发布即对外可见 + 后台处理”策略（关键）
对于发布后仍需要后台耗时处理的场景（全文索引、向量化、质量检测、重复检测等），采用“发布即对外可见”的一致策略：
- 卡片发布后 `status` 立即置为 `published`，详情页立刻可访问、可复制链接分享。
- 关键词搜索：在 `index_status != ready` 期间可能搜不到；作者侧 UI 展示“索引构建中/失败可重试”等状态。
- 语义检索与 AI：在 `vector_status != ready` 期间不参与语义召回；AI 不引用该卡（或权重极低且必须二次校验）。
- 失败策略：`index_status/vector_status = failed` 时不阻塞阅读与分享，但前端应提示作者修复或触发重建任务。
- 观测与治理：后台任务进度与失败原因可被查询（面向作者/管理员），用于排障与 SLA。

**`card_versions`**
- `id`
- `card_id`
- `version_no`（unique per card）
- `title_snapshot`
- `summary_snapshot`
- `content_snapshot`
- `change_log`
- `published_by`
- `published_at`
- `schema_version`

**`attachments`**
- `id`
- `card_id`
- `uploader_id`
- `file_name`
- `mime_type`
- `file_size`
- `storage_bucket`
- `storage_key`
- `checksum_sha256`
- `status`（uploaded/parsing/ready/failed）
- `text_storage_key`（nullable：解析文本大对象外置）
- `meta_json`（页数/语言等）

**`taxonomy_nodes`**
- `id`
- `name`
- `parent_id`
- `path`
- `level`
- `owner_id`（领域 Owner）
- `sort_order`

**`card_taxonomy`**
- `id`
- `card_id`
- `node_id`

**`tags`**
- `id`
- `name`（unique）
- `category`
- `is_controlled`
- `usage_count`（冗余）
- `is_active`

**`card_tags`**
- `id`
- `card_id`
- `tag_id`

**`card_relations`**
- `id`
- `from_card_id`
- `to_card_id`
- `relation_type`（reference/depends_on/related/replaces/duplicate_of）
- `note`

### 7.5 评审与权威层（Review/Authority）
**`review_policies`**
- `id`
- `match_json`（type/topic/dept 等匹配）
- `requires_review`
- `reviewer_role`

**`card_reviews`**
- `id`
- `card_id`
- `version_no`
- `reviewer_id`
- `status`（pending/approved/rejected）
- `comment`
- `reviewed_at`

### 7.6 检索（Search）
**`search_logs`**
- `id`
- `user_id`
- `query`
- `query_type`（search/ai_ask）
- `filters_json`
- `result_count`
- `is_zero_result`
- `clicked_card_ids`（nullable）
- `duration_ms`

**MeiliSearch Index：`cards`（建议字段）**
- searchable：`title`、`summary`、`content`、`tags`、`owner_name`
- filterable：`type`、`status`、`visibility`、`dept_path`、`project_id`、`taxonomy_node_ids`、`tag_ids`、`authority_level`、`published_at`、`index_status`
- sortable：`published_at`、`quality_score`（可由 metrics 计算）、`solve_count`、`reference_count`、`view_count`

### 7.7 向量与分块（Vector）
**`card_chunks`**
- `id`
- `card_id`
- `version_no`
- `chunk_index`
- `chunk_text`
- `token_count`
- `embedding`（pgvector）
- `visibility`
- `dept_path`
- `project_id`
- `authority_level`
- `status`
- `vector_status`（可选：若不想依赖 `cards.vector_status`，可在 chunk 层冗余）

### 7.8 AI 能力（Ask/Assist/Evaluate）
**`ai_conversations`**
- `id`
- `user_id`
- `title`
- `status`（active/archived）
- `message_count`

**`ai_messages`**
- `id`
- `conversation_id`
- `role`（user/assistant）
- `content`
- `model_name`
- `prompt_tokens`、`completion_tokens`
- `latency_ms`
- `created_at`

**`ai_answers`**
- `id`
- `message_id`（assistant）
- `confidence`（high/medium/low）
- `citations_json`（[{card_id, version_no, chunk_id, title, snippet, relevance_score}]）
- `retrieval_meta_json`
- `safety_flags_json`

**`ai_feedback`**
- `id`
- `answer_id`
- `user_id`
- `rating`（good/bad）
- `reasons_json`
- `comment`

#### 7.8.1 AI 的引用与可用性约束（与后台处理状态联动）
- AI 召回与引用必须与权限一致；引用落库前必须对 card/version/chunk 做二次权限校验。
- 当 `cards.vector_status != ready` 时，该卡不参与语义召回；当 `cards.index_status != ready` 时，全文召回命中概率下降是预期行为。
- AI 侧应显式输出“引用列表 + 置信度 + 更新时间提示”；低置信时优先追问补充信息或引导创建缺口。

### 7.9 缺口（Gaps）
**`knowledge_gaps`**
- `id`
- `query`
- `source_type`（zero_result_search/ai_low_confidence/user_report）
- `source_id`（nullable）
- `status`（open/assigned/filled/closed/wontfix）
- `assignee_id`（nullable）
- `taxonomy_node_id`（nullable）
- `filled_card_id`（nullable）
- `occurrence_count`
- `last_occurred_at`
- `priority`（low/normal/high/urgent）

### 7.10 激励（Points/Coins/Badges）
金币与商城可后置；积分建议先做“台账 + 可配置规则 + 去重键”。

**`points_rules`**
- `id`
- `event_type`
- `delta`
- `daily_cap`
- `enabled`
- `condition_json`

**`points_ledger`**
- `id`
- `user_id`
- `event_type`
- `delta`
- `balance_after`
- `dedupe_key`
- `ref_type`、`ref_id`
- `triggered_by`
- `remark`
- `created_at`

**`coins_ledger`**（P2）
- `id`
- `user_id`
- `event_type`
- `delta`
- `balance_after`
- `ref_type`、`ref_id`
- `created_at`

**`badge_definitions`**（P2）
- `id`
- `code`（unique）
- `name`
- `category`
- `tier`
- `criteria_json`
- `points_reward`
- `enabled`

**`badge_awards`**（P2）
- `id`
- `badge_id`
- `user_id`
- `awarded_at`
- `trigger_snapshot_json`

### 7.11 通知（Notification）
**`notifications`**
- `id`
- `user_id`
- `type`
- `title`
- `content`
- `ref_type`、`ref_id`
- `is_read`
- `read_at`
- `channels_sent`（["in_app","email"]）
- `created_at`

**`notification_templates`**
- `id`
- `type`（unique）
- `title_template`
- `content_template`
- `default_channels`
- `enabled`

### 7.12 管理后台与审计（Admin/Audit）
**`import_tasks`**
- `id`
- `type`（user_import/card_import/...）
- `file_name`
- `storage_key`
- `status`（pending/processing/completed/failed）
- `total_rows`、`success_rows`、`error_rows`
- `error_detail_key`
- `started_at`、`completed_at`

**`audit_logs`**
- `id`
- `user_id`
- `action`
- `target_type`
- `target_id`
- `detail_json`
- `ip_address`
- `user_agent`
- `created_at`

**`system_configs`**
- `id`
- `config_key`（unique）
- `config_value`（JSONB）
- `description`
- `updated_by`
- `updated_at`

---

## 8. 事件与异步任务（Outbox + Worker）

### 8.1 Outbox 表
**`outbox_events`**
- `id`
- `event_type`（如 card.published）
- `aggregate_type`（card/review/points/...）
- `aggregate_id`
- `payload_json`
- `status`（new/sent/failed）
- `retry_count`
- `next_retry_at`
- `created_at`

### 8.2 典型事件
- `card.published`、`card.updated`、`card.archived`
- `attachment.uploaded`
- `review.approved`、`review.rejected`
- `card.solved`、`card.referenced`
- `search.zero_result`
- `ai.answer.created`、`ai.feedback.created`

### 8.3 典型异步流水线（发布卡片）
1. 写 `cards`、`card_versions`、关联表
2. 同事务写 `outbox_events(card.published)`
3. Worker：推进 `index_status/vector_status` 状态机（pending→processing→ready/failed）
4. Worker：解析 content/附件 → 分块 → 写 `card_chunks`（embedding）→ 写 MeiliSearch 文档 → 刷新统计/质量评分 → 通知/积分

---

## 9. API 设计约定（v1）
- 前缀：`/api`
- 认证：JWT Access + Refresh（refresh 可配合 Redis 主动失效）
- 分页：`page`、`page_size` 或 cursor（列表型接口优先 cursor）
- 幂等：对“导入/兑换/发放”等关键写操作支持 `Idempotency-Key`（P1）

> 说明：本节 API 仅用于统一接口风格与模块边界的参考草案，并非最终版。实现过程中会基于前端交互、性能、权限与演进需要调整路径、参数与返回结构。

### 9.1 核心 API（MVP 必备）
- Auth：`POST /api/auth/login`、`POST /api/auth/logout`、`POST /api/auth/refresh`
- Me：`GET /api/users/me`
- Cards：`POST /api/cards`、`GET /api/cards`、`GET /api/cards/{id}`、`PUT /api/cards/{id}`、`POST /api/cards/{id}/publish`
- Search：`GET /api/search`、`GET /api/search/suggest`
- AI：`POST /api/ai/conversations`、`POST /api/ai/conversations/{id}/messages`、`POST /api/ai/answers/{id}/feedback`
- Admin：`POST /api/admin/users/import`、`GET /api/admin/users/import/{taskId}`

---

## 10. 非功能性设计要点

### 10.1 性能目标（MVP）
- API 普通接口 P95 < 100ms（不含外部依赖）
- 全文检索 P95 < 200ms
- 语义检索 P95 < 800ms（含权限二次校验）
- AI 首 token < 2s（流式）

### 10.2 安全与合规
- HTTPS 全站
- 密钥不入库不入代码（环境变量/密钥管理服务）
- 文件上传白名单 + 大小限制（可选：杀毒/敏感扫描）
- 管理后台与敏感操作全量审计（含导出、下载、权限变更、补发积分）

### 10.3 可观测性
- request_id 全链路贯穿（API/worker/外部依赖）
- 指标：延迟、错误率、队列堆积、索引失败率、AI 引用率

### 10.4 部署与备份（MVP）
- docker-compose：app、worker、postgres、redis、meilisearch、minio、traefik
- 备份：PG 全量 + WAL；Meili/向量可重建但建议做 dump/snapshot

---

## 11. MVP 分期（建议）

### Phase 1（P0）：核心闭环
- 用户与组织：登录、Excel 导入、部门树、RBAC
- 知识库：卡片 CRUD、版本、标签、主题树、生命周期（草稿→发布→归档）、收藏/反馈（至少 solved）
- 检索：MeiliSearch 全文 + pgvector 语义（可先只做全文，语义 P0.5）
- Admin：用户导入、主题/标签维护、过期列表
- 通知：站内信（过期提醒、被引用）
- 审计：管理操作与敏感行为

### Phase 2（P1）：权威与 AI 闭环
- 评审与权威层：评审策略、评审队列、权威加权
- AI：RAG（强制引用）+ 反馈 + 缺口自动沉淀
- 缺口池：认领/指派/关闭（与卡片关联）

### Phase 3（P2）：激励与精细治理
- 积分：规则配置、台账、去重、每日上限、防刷基础
- 徽章/等级/排行榜：快照生成
- 重复检测、低质治理、同义词库与检索调优

### Phase 4（P3）：商城与组织协作深化
- 金币与商城、审批与退款
- 学习路径与团队任务

---

## 附录 A：错误码示例
| 错误码 | HTTP | 说明 |
|---|---:|---|
| `AUTH.INVALID_CREDENTIALS` | 401 | 账号或密码错误 |
| `AUTH.PERMISSION_DENIED` | 403 | 无权限 |
| `CARD.NOT_FOUND` | 404 | 卡片不存在 |
| `CARD.ACCESS_DENIED` | 403 | 无权访问 |
| `CARD.VERSION_CONFLICT` | 409 | 版本冲突 |
| `SEARCH.QUERY_TOO_LONG` | 400 | 搜索词过长 |
| `AI.RATE_LIMITED` | 429 | AI 频控 |
| `GENERAL.VALIDATION_ERROR` | 400 | 参数校验失败 |
| `GENERAL.INTERNAL_ERROR` | 500 | 服务器内部错误 |
