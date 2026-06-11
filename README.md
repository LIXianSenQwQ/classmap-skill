# Classmap Skill

中文 | [English](README.en.md)

## 一句话介绍

Classmap Skill 是一套让 AI 编程助手先定位代码职责、再精准修改代码的轻量级 skill 工作流。

它用一个 `CLASSMAP.md` 把“功能、代码单元、职责、依赖、调用关系、改动触发条件”连起来，让 AI 编程助手在用户只描述需求、不知道具体文件的情况下，也能先定位目标，再进入修改。

## 解决问题

每次 AI 开始全项目搜索，定位修改文件都很麻烦。AI coding 最常见的问题不是不会写代码，而是用户只知道要改什么，却不知道具体该改哪个文件：

- 用户只说“改登录逻辑”“加支付回调”“修订单状态 bug”，AI 却不知道应该先看哪个类。
- AI 如果只靠关键词搜索，很容易命中一堆名字相似但职责不同的文件。
- 类名相似、职责混杂时，AI 容易把 controller、service、repository、component 的边界搞错。
- 改动完成后，文档没有同步更新，下一次 AI 又从过期上下文开始猜。
- 大项目里全项目搜索太散，知识图谱又太重，落地成本高。

Classmap Skill 的目标很克制：

> 用 Markdown 做一张 AI 可读的轻量代码职责地图，让每次改动都先路由，再编码。

## 功能特点

### 两个 skill，一张地图

- `classmap-maintain`
  - 创建、修复、维护 `CLASSMAP.md`。
  - 适合首次接手项目、重大重构后、新增重要模块后、地图缺失或过期时使用。
  - 只负责代码职责地图，不直接实现业务功能。

- `classmap-target`
  - 根据用户需求读取 `CLASSMAP.md`，命中最可能需要修改的代码单元。
  - 适合日常改功能、修 bug、做重构前先定位文件。
  - 允许在本次改动范围内增量修正 `CLASSMAP.md`，但不会重建整张地图。

### 先路由，再编码

`classmap-target` 会先输出类似这样的改动路由：

```md
## Target recommendation

### Primary targets

1. `src/auth/LoginService.ts`
   - Reason: owns login business flow.
   - Change here if: login rules or failed-login policy changes.

### Secondary targets

1. `src/auth/AuthController.ts`
   - Reason: HTTP entrypoint for login.
   - Touch only if: request or response contract changes.

### Probably not targets

- `src/auth/JwtProvider.ts`
  - Avoid unless: token claims or signing behavior changes.
```

这让 AI 在真正修改代码前，先明确“优先改谁、可能看谁、哪些文件不该碰”。

### 文档边界清晰

`CLASSMAP.md` 只写代码职责和改动定位信息：

- 代码职责、依赖、调用关系 -> `CLASSMAP.md`
- 业务术语 -> `CONTEXT.md`
- 架构决策 -> `docs/adr/`
- 具体任务计划 -> issue / PRD / task doc

这样可以避免 `CLASSMAP.md` 变成杂乱的 README、术语表或临时 TODO。

## 对比同类方案

| 方案 | 优点 | 缺点 | Classmap Skill 的定位 |
|---|---|---|---|
| 普通 README | 人类容易读，适合介绍项目 | 通常太粗，不能告诉 AI 具体该改哪个类 | README 介绍项目，`CLASSMAP.md` 负责代码命中 |
| CODEMAP / 目录地图 | 能说明目录结构和关键文件 | 经常停留在“模块级”，不够细到职责边界 | 进一步记录每个重要代码单元的 owns / does not own / change when |
| 关键词搜索 / 全项目搜索 | 快速、无需维护文档 | 只匹配文本，不理解职责；上下文噪声大，容易误命中 | 先读地图，把自然语言需求映射到职责明确的代码单元 |
| 知识图谱 | 关系严格，可查询，可视化潜力强 | 需要 schema、抽取 pipeline、存储和维护成本 | 用 Markdown 承载轻量图谱，以更低维护成本解决日常代码定位问题 |

Classmap Skill 面向日常 AI coding 场景，提供低成本、可人工维护、对 AI 友好的代码导航层。

## 快速使用

### 安装

推荐通过 npm 使用 `npx` 一键安装：

```bash
npx @qingyuwanan/classmap-skill install
```

默认会把两个 skill 安装到 `~/.agents/skills`：

- `~/.agents/skills/classmap-maintain`
- `~/.agents/skills/classmap-target`

如果这两个目录已经存在，安装器会直接覆盖同名目录。它只会处理这两个固定目录，不会删除或改动 `~/.agents/skills` 下的其他 skill。

如果需要安装到其他 skills 目录，可以指定 `--target`：

```bash
npx @qingyuwanan/classmap-skill install --target ~/.codex/skills
```

### 使用

#### 1. 首次生成代码职责地图

在一个已有项目里运行：

```txt
/classmap-maintain
```

它会读取项目结构和关键代码，创建或刷新 `CLASSMAP.md`。

#### 2. 日常改代码前先定位

例如：

```txt
/classmap-target 我要给登录增加邮箱验证码，先帮我定位应该改哪些类
```

预期流程：

```txt
读取 CLASSMAP.md
-> 输出 Primary / Secondary / Probably not targets
-> 小范围读取候选文件验证
-> 再进入具体实现
-> 如本次改动影响职责，增量更新 CLASSMAP.md
```

#### 3. 地图过期时刷新

当你发现 `CLASSMAP.md` 和代码不一致，或者项目经历了较大重构：

```txt
/classmap-maintain 重新检查这个项目的 CLASSMAP.md 是否过期
```

## 适合谁

这个项目适合：

- 经常用 AI 改旧项目的人。
- 希望 AI 少乱搜、少误改的人。
- 维护任意编程语言项目的人；项目越大、模块越多、职责越复杂，收益越明显。
- 想要轻量代码知识图谱，并希望避免图数据库或 AST pipeline 维护成本的团队。

不适合：

- 只有几个文件的小 demo。
- 已经有成熟自动化依赖图谱和影响分析系统的团队。
- 希望完全自动、零维护生成精准代码知识图谱的场景。

## Star

如果这个项目帮你减少了一次“只描述需求但不知道该改哪个文件”的痛苦，欢迎给一个 Star。

Star 越多，我会越有动力继续补充真实项目示例、`CLASSMAP.md` 模板和更多 agent 的使用方式。
