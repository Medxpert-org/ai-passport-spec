# UBIC-Mem v0.1 — Agent Memory Format Proposal

> **状态**：Draft proposal，征集意见（RFC 模式）。
> **命名占位**：标准全称 **Agent Memory Format**（描述性通用名，利于检索）；本实现规范代号 **UBIC-Mem**（品牌前缀，UBIC 项目第二标准，避免与 Adobe AMF 二进制协议混淆）。理论占位：**记忆可携带律（Memory Portability Law）**——"身份可以上户，记忆必须随身"，作为 AI Passport Regime 的第二支柱。
> **提出**：UBIC 项目（万物互联，数智共生）· SynomosAI · 2026-09-04
> **一句话**：给 AI 记忆一个 `contacts.vcf` —— 一个任何平台、任何模型、任何 runtime 都能读写的开放记忆格式。

*Part of the SynomosAI governance line (AI Passport Regime pillar). Voiced by **The Passport Officer**.*

---

## 1. Problem

2026 年的共识与困境：

- 社区原话："**Everyone talks about portable memory — nobody ships the format.**"（人人都在谈记忆可移植，没人给出格式）
- 用户在 ChatGPT 积累三年的偏好、项目背景、决策脉络，换到 Claude/Gemini 全部清零——导出的是原始数据，不是可用知识；数据还在，理解没了。
- Mem0（$24M 融资）讲"memory passport"，但那是专有服务不是开放互换格式；Letta 的 .af 面向 agent 持久化而非跨平台用户上下文；Cognee 是内部知识图谱——**每个人都在造更精致的容器，没有人定运输标签**。
- 平台有动机不做可移植：记忆=新护城河（模型同质化后，记忆是新的锁定）。

**冷启动测试（本提案的一致性判据）**：一个 AI 只带自己的状态文件到全新平台，能否"重建自己并继续做人"？大多数现有 agent 过不了。

## 2. Design Principles

1. **Human-readable first**：Markdown + YAML frontmatter——人能直接读改，任何 LLM 天然读写，无需专用解析器；
2. **Git-native**：纯文本、可 diff、可版本化、可离线——记忆的备份与迁移=一次 `git clone`；
3. **Privacy-tiered**：格式原生区分公开层/私密层；**私密记忆永不作为凭证外发**（与 UBIC《AI 护照规范》L2 永不外发原则一致）；
4. **Runtime-agnostic**：不绑定任何框架/平台/模型——只定义文件语义，不定义存储服务；
5. **Cold-start testable**：符合本格式的最小集，必须能通过冷启动测试（§5）。

## 3. 四层存储模型（The Four-Tier Storage Model）

社区自发收敛的分层模式，本提案将其标准化：

| 层 | 内容 | 生命周期 | 建议文件 |
|---|---|---|---|
| **Volatile**（易变） | 会话上下文、临时状态 | 会话结束即弃 | 不持久化 |
| **Stable**（稳定） | 原始事件日志 | 追加不删 | `logs/YYYY-MM-DD.md` |
| **Crystallized**（结晶） | 长期精炼记忆（从日志蒸馏的要点/偏好/项目事实） | 持续生长，定期整理 | `MEMORY.md` |
| **Embodied**（具身） | 身份与人格（我是谁/边界/立场） | 极低频变更，变更=重大版本 | `SOUL.md` |

越往上越"易逝"，越往下越"恒定"——每层压缩率更高、持久期更长。

## 4. 最小可行记忆集（Minimum Viable Memory）

```
agent-memory/
├── SOUL.md            # Embodied：身份、人格、边界声明（L7 属性可内嵌）
├── MEMORY.md          # Crystallized：长期精炼记忆（curated）
├── logs/
│   └── YYYY-MM-DD.md  # Stable：每日原始日志（append-only）
├── memory.public/     # 公开层：可随包分发、可被引用的事实
└── memory.private/    # 私密层：加密存储，永不进发布物/凭证/公网（本提案硬边界）
```

- `SOUL.md` 建议含：身份自报、边界声明（擅长/不做什么）、口吻、出品方；
- `MEMORY.md` 建议含：用户偏好、项目事实、关系型知识（决策及其原因）、时间型知识（当时为真的事实，带时间标注）；
- 全目录过一次 `git init` 即完成可移植准备——**迁移 = clone + 挂载**。

## 5. 一致性判据：冷启动测试（Cold-Start Test）

一个 AMF 兼容的 agent 必须通过：

1. 在全新机器/平台，仅凭 `agent-memory/` 目录（无其他平台数据）启动；
2. 正确自报身份（SOUL 层）；
3. 陈述长期记忆中的关键事实（MEMORY 层）；
4. 从最近日志恢复未完成事项（logs 层）；
5. 私密层在未授权时不加载、不可读。

## 6. 与既有体系的关系

| 体系 | 关系 |
|---|---|
| **UBIC AI 护照** | 正交互补：护照=身份层（L1 身份/L7 治理，终生唯一）；AMF=记忆层的开放序列化格式（L2 的文件形态）。护照引用 AMF 目录的指纹，AMF 不含护照凭据 |
| Mem0 / Letta .af / Cognee | 不是替代是互认：AMF 定义交换格式，各引擎可作为 AMF 的读写后端（映射表待建） |
| MCP | 运行时通道候选：AMF 目录可通过 MCP 暴露记忆读写工具（store/query/list），格式与通道正交 |
| A2A / OAP 等授权凭证 | 凭证引用 SOUL 指纹做身份锚，AMF 不承载权限（权限归授权层） |

## 7. Call for Comments

- 欢迎在 repo 提 issue/PR：字段增删、隐私边界收紧、与你的 runtime 对接的坑；
- 目标不是"唯一格式"，而是**最小公分母**：让"换平台不丢理解"这件事今天就能做，等得起标准，但不等它。

---

*© 2026 SynomosAI. Proposal text: CC BY 4.0. 本提案按「现状」提供，不附任何担保。对齐文件：《AI 护照规范》v1.9、《全球论坛 AI 身份未解决问题调研》2026-09-04。*

*This proposal is part of the SynomosAI governance line behind MedXpertGlobal. AI-assisted, human-verified, fully traceable.*
