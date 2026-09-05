# AI 身份绑定层草案（Agent Identity Binding Layer）
**给 2026 各实装系统的短期凭证接上长期身份底座**
**draft-agent-identity-binding-00 ｜ 2026-09-05 ｜ 备忘锚定（可引用）**

**作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 人类共创：赵兴华（Steven Zhao·China）｜ AI 共创：人机协作，创作于 WorkBuddy 平台 ｜ 版权：SynomosAI

---

## 1. 生态核实：2026 各域系统都在发"短期凭证"（2026-09-05 公开来源）

| 系统 | 凭证机制 | 覆盖 | 缺口 |
|---|---|---|---|
| **SINT Protocol** | 能力令牌（Ed25519，衰减委托） | AI→物理执行 | 令牌背后的 AI 身份/谱系由谁签发、可跨系统查吗？ |
| **HearthNet**（ACM CAIS'26） | actuation lease（短期动作许可，绑 Git 状态） | 家庭多 agent | root 授的 lease 不回答"agent 是谁造的、第几代脑" |
| **S5-SHB**（arXiv 2026-03） | 区块链+Ed25519+居民分级 | 家庭 10 agent | 链上记动作，不记"模型出生登记与谱系" |
| **A2A / MCP / GB/Z 185** | 代理卡/工具面/身份码 | 通用 AI | 身份码在申领路上，无统一谱系查询面 |
| UBIC 本体系 | 护照/签证/谱系/锚点 | 全覆盖（参考实现） | — |

**共同形态：每个系统都正确地在"动作前"验凭证——但凭证由各域现场签发，无统一身份底座。** 一个 AI 跨 HearthNet 家庭、SINT 工厂、医械桥三个域，需三个互不相认的凭证。

## 2. 占位：Identity Binding Layer（跨系统身份引用层）

```
各域（保留自管授权）          统一层（本草案）
SINT 令牌 ──┐
HearthNet lease ─┼─→ 引用 passportId + lineageRef（可查询、可吊销、可验谱系）
医械桥 scope ──┘
```

**三个最小机制**（全部字段级，不动各域内部）：

1. **凭证引用**：各域令牌/lease 增加可选字段 `identityRef: {passportId, lineageVersion}`——运行时凭证背后有持久身份。签发权仍在各域（我们不收编）。
2. **统一谱系查询面**：`/.well-known/` 或护照 registry 提供 `lineage/{passportId}`——任何域可查"这 AI 谁造的、第几代脑、OTA 记录、吊销状态"。HearthNet 接陌生 agent 前、SINT 网关跨域校验时均可先查。
3. **跨域吊销传播**：某域吊销 → registry 标记 → 其他域引用时可见（吊销即刻全网生效，不需要各域同步黑名单）。

## 3. 为什么是我们（而非再做一套）

我们已发布的人格户籍层（护照/签证/谱系/锚点，参考实现纯 stdlib 开源）恰好是各域**缺失的那个假设**——不做第八个编排系统，做它们的公共身份面。生态缝合位，不与 SINT/HearthNet 竞争授权语义。

## 4. 兼容映射（对齐≠替代）

| 他们 | 我们 | 关系 |
|---|---|---|
| HearthNet actuation lease | 短期签证（event-participation/device-access） | 同构：lease≈签证，可引用 passportId |
| HearthNet root agent | UBIC Hub（持有人主权） | 同构：root≈hub，可对接 |
| SINT 能力令牌 | 护照+scope 签证 | 令牌引用 passportId |
| S5-SHB 区块链审计 | 哈希链锚点批 | 同族：可互认证明 |
| GB/T 43441.2 数字实体 | 护照 schema 对齐（映射预留） | 国标已动，谨慎对齐 |

## 5. 路线

- v0.1（本文）：生态核实+绑定层机制+备忘锚定
- v0.2：`identityRef` 字段规范 + lineage 查询面原型（复用现有护照 registry）
- v0.3：与 HearthNet/SINT 任一实装系统做互操作演示（需对方配合或 fork 演示）

## 6. 诚实边界

- 生态现状为公开来源核实（2026-09-05，含 arXiv/ACM/官网），引用请复核原文
- 未与任何一方协商；"兼容"为结构对照；不宣称已被采用
- 域内授权语义（lease 时效、令牌衰减）归各域，本层只做身份引用
- proposals/ 备忘锚定，不进规范正文（冻结期纪律）

---
*© 2026 SynomosAI ｜ 文档 CC BY 4.0 ｜ **UBIC 及相关徽标不在 CC BY 4.0 授权范围内**，fork 与衍生作品不得以上述名义分发。*
