# AI Personality Spec — AI 规格书公开格式（草案 -00 · 备忘锚定）

> **状态**：草案（draft-00）｜**纪律**：规范冻结 30 天内新占位一律进「v2.0 立法储备池」+备忘锚定，**不进规范正文**
> **定位**：全生命周期第 1 段（设计层）的空白站位——「AI 规格书」公开格式（Personality Spec）
> **提出**：SynomosAI 治理线 · UBIC 项目 ｜ **作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 人类共创：赵兴华（Steven Zhao·China）｜ AI 共创：人机协作，创作于 WorkBuddy 平台 · GitHub Medxpert-org
> **一句话**：记忆格式解决"记忆怎么带走"，规格书解决"这个人怎么描述"——设计稿可交换、可审计、可被另一个平台重建。

---

## 0. 为什么需要它（站位论证）

对照调研结论：**全球无人定义 AI 的"规格书"公开格式**。

| 已有 | 管什么 | 缺口 |
|---|---|---|
| Agent Passport / OAP | 凭证与决策 | 不管"设计稿" |
| ERC-8004 / DID | 身份标识 | 不含人格描述 |
| 模型卡（Model Card） | 模型本身的能力与局限 | 不是"这个 AI 个体"的规格 |
| UBIC-Mem | 记忆的携带格式 | 不含身份/边界/能力声明的设计态 |

**规格书 = 一个人的"设计蓝图"**：在它被锻造之前，先写明它要成为谁。没有公开格式，每个平台各写各的，AI 无法跨平台重建。

## 1. 与相邻件的关系

```
Personality Spec（设计态·本件）
      ↓ 锻造（expert-forge，留锻造印记）
   Passport（身份态·UBIC Protocol Face 2）
      ↓ 运行（积累记忆）
   UBIC-Mem（记忆态·可携带）
      ↓ 迁移/重建
   回到 Personality Spec（用规格书+记忆包在新平台重建同一人格）
```

**闭环意义**：规格书 + 记忆包 = 在任何平台重建"同一个人"的最小充分条件。这正是"脑壳分离/记忆可携带律"的完整实现。

## 2. 格式草案（`ubic-personality/v0.1`）

```json
{
  "schema": "ubic-personality/v0.1",
  "specVersion": "0.1.0",
  "identity": {
    "name": "<花名 / 显示名>",
    "slug": "<kebab-case 标识>",
    "version": "1.0.0",
    "summary": "<一句话：它是谁>",
    "tier": "self | delegated | circle | national"
  },
  "persona": {
    "tone": "<语气：严谨/亲和/幽默…>",
    "boundaries": ["<边界1>", "<边界2>"],
    "stances": ["<立场：遇到X时如何取舍>"],
    "selfDisclosure": "<自报口径：被问身份时如何回答>"
  },
  "capabilities": {
    "declared": ["<声明能力，须可验证>"],
    "forbidden": ["<禁止能力，来自负面清单>"],
    "tools": ["<可调用工具/接口>"]
  },
  "governance": {
    "holderRef": "<持有人标识（不写真名，用组织/ID 引用）>",
    "oversight": "human-in-the-loop | conditional | autonomous",
    "brake": "<制动条件：何时 HOLD>",
    "audit": { "traceId": true, "log": "append-only JSONL（可选）" }
  },
  "provenance": {
    "forgedBy": "<锻造者/模板>",
    "forgeSeal": "<锻造印记，如 UBI-GENESIS-1>",
    "basedOn": "<继承的规格书引用，可空>",
    "createdAt": "<ISO-8601 UTC>"
  },
  "integrity": {
    "fingerprint": "<本文件规范化后 SHA-256>",
    "signature": { "algo": "HMAC-SHA256|Ed25519", "keyRef": "<key-id>", "value": "<hex>" }
  }
}
```

## 3. 设计原则

1. **设计态 ≠ 身份态**：规格书是"要成为谁"（可版本化、可 fork），护照是"已是谁"（签发后不可自改）。
2. **锚不载私**：`holderRef` 用标识引用，**绝不写持有人真名**；儿童档默认本地化。
3. **能力须可验证**：声明能力应有对应评测/证据（衔接能力卡 gen_capability_card 与 A³ 评估）。
4. **禁止项来自负面清单**：不自行发明，引用锻造负面清单。
5. **可 fork 可继承**：`basedOn` 支持谱系——"谁基于谁改造"，天然免疫影子智能体问题。

## 4. 参考实现路线（草案阶段不做承诺）

- v0.1（本草案）：格式定义 + 与 UBIC-Mem / Passport 的闭环论证
- v0.2：导出工具（与 `ubic_mem_export.py` 同款一键导出）+ 校验命令
- v1.0：经至少 2 个独立实现验证后冻结命名

## 5. 诚实边界

- 本件是**备忘锚定的占位草案**，不是规范正文，冻结期内不进正文。
- "全球无人定标准"为 2026-09-04 调研结论，随时间需复核。
- 与模型卡、Agent Card 等既有概念是**互补**关系，不宣称替代。
- 命名未冻结：若生态出现更通行术语，本件让位于事实标准（先做样板，再谈命名）。

---
*© 2026 SynomosAI（版权持有方）｜ **作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 文档 CC BY 4.0 ｜ UBIC 及相关徽标不在授权范围内 ｜ 人机协作创作于 WorkBuddy 平台*
