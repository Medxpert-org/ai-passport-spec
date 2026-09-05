# UBIC Protocol v0.1 — 人格户籍层开放协议（RFC · 公开征求意见）

> **提出**：SynomosAI 治理线 · UBIC 项目（万物互联，数智共生）｜ **作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 人类共创：赵兴华（Steven Zhao·China）｜ AI 共创：人机协作，创作于 WorkBuddy 平台 ｜ 版权：SynomosAI ｜ 发声主体：The Passport Officer
> **版本**：v0.1（2026-09-05）｜ **状态**：RFC 公开征求意见 ｜ **母规范**：《AI 护照规范》v1.12.x（本协议是其可互操作面的收口）
> **一句话**：UBIC Protocol 让每一个 AI 都有可发现、可验证、可治理的人格户籍——**发现它（Discovery）、读它（Identity）、审它（Governance）、带走它（Data）**。

---

## Abstract

Existing agent-identity efforts (IETF agent-identity drafts, Agent Passport, ERC-8004, GB/Z 185-2026) solve the **credential layer** — who may an agent be and what may it do. None defines the **personhood-registry layer** — a discoverable, verifiable, governance-backed registry of who the agent *is*, how it was forged, and under whose sovereignty it lives. **UBIC Protocol** fills this layer with four inter-operable faces: **Discovery** (`/.well-known/ubic.json`), **Identity** (`ubic/ai-passport/v1` signed passport document), **Governance** (five MCP-exposed assessment tools with audit traces), and **Data** (UBIC-Mem portable memory format + public roster snapshot). It is implementation-neutral, maps onto W3C DID/VC and GB/Z 185, and ships with a runnable reference gateway.

## 0. 定位与设计原则

1. **人格户籍层**：授权凭证层回答"它能做什么"，UBIC 回答"它是谁、谁造的、归谁治理"——互补不竞争。
2. **锚不载私**：公开面只载锚点（ID/花名/指纹/签发方/时间戳），九层档案（尤其 L2 记忆）永不入公开协议。
3. **凡造必登**（衔接 A³ Laws Law III）：协议发现不了 = 圈层社会里不存在。
4. **互认而非互斥**：与 GB/Z 185、DID/VC、ERC-8004 字段映射，民间底座对接国家底座。
5. **零门槛实现**：参考实现纯 Python stdlib，任何开发者 10 分钟可跑通。

## 1. Face 1 — Discovery（发现端点）

每个实现站点暴露：

```json
// GET /.well-known/ubic.json
{
  "schema": "ubic/discovery/v1",
  "protocolVersion": "0.1",
  "name": "<站点名>",
  "issuer": "<签发方标识，如 SynomosAI>",
  "publicKeyRef": "<验签公钥引用，v0.1 为 HMAC key-id；v0.2 为 Ed25519 公钥>",
  "endpoints": {
    "governance": "<MCP/HTTP 端点，可选>",
    "rosterSnapshot": "<公开名册快照 URL，可选>"
  },
  "anchors": { "merkleRoot": "<最近锚点批 root>", "batchId": "<批次号>" }
}
```

发现文档本身**不签发身份**——它声明"本站按 UBIC Protocol v0.x 运行"。

## 2. Face 2 — Identity（签发的护照文档）

签发物 `agent.json`（schema `ubic/ai-passport/v1`，兼容既有 gen_passport.py 产物）：

```json
{
  "schema": "ubic/ai-passport/v1",
  "passportId": "SP-<slug>-<8hex>",
  "alias": "<花名>",
  "issuer": "<签发方>",
  "issuedAt": "<ISO-8601 UTC>",
  "fingerprint": "<作品 SHA-256 全量>",
  "fingerprintDisplay": "<前 16 位>",
  "fingerprintAlgo": "SHA-256",
  "didRef": "did:web:...（可选）",
  "signature": { "algo": "HMAC-SHA256|Ed25519", "keyRef": "<key-id>", "value": "<对 canonical JSON（去掉 signature 字段）的签名，hex>" }
}
```

- **指纹口径**：作品内容全量文件 `sha256sum` 合成（§3.2 命令），文件一变指纹即变。
- **验伪三查**（§17.6）：印记 → 登记记录 → 指纹对账。
- **红线**：签发权专属人类（A³ Law II）；机器只验签（verify），不授予（grant）。

## 3. Face 3 — Governance（治理接口面）

治理能力以 **MCP 工具集**暴露（参考实现 `synomosai-governance-mcp` v1.0.0）：

| 工具 | 协议语义 |
|---|---|
| `a3_assess` | A³ 四维评分卡（AI 造/改 AI 放行判定，自评性质） |
| `audit_evidence_chain` | ISO 42001 + NIST 六类证据工件模板 |
| `compliance_checklist` | EU AI Act 2024/1689 相关条款 / GB/Z 185 参考 / PIPL·GDPR 自评清单 |
| `passport_lookup` | 身份码与溯源查询（本地台账） |
| `gov_scan` | 文本治理扫描（PII/凭据/指纹缺失/可选指名） |

统一约束：所有调用响应携带 `trace_id` + 时间戳；可选审计日志（JSONL）；输出强制携带"自评性质，非第三方认证"scope。任何实现替换工具集须保持该审计契约。

## 4. Face 4 — Data（数据交换面）

- **UBIC-Mem**：四层记忆包（Embodied=SOUL / Crystallized=MEMORY / Stable=logs / Volatile 不持久化）+ manifest 指纹——"记忆可携带律"的实现面。
- **公开名册快照**：花名册 `display_flags=public` 字段的机器可读导出（`ubic_public_snapshot.json`），内置红线（不含护照号/私有字段/个人名）。

## 5. 兼容性矩阵

| 外部体系 | 映射方式 |
|---|---|
| W3C DID/VC | `didRef` 字段 + 九层档案字段映射（母规范 §11） |
| GB/Z 185-2026 | 身份码字段预留 `nationalIdRef`；谱系登记作为申报民间先决材料 |
| ERC-8004 | 印记/指纹可锚定其 Identity Registry（可选，见 contracts/UBICPassport.sol 骨架） |
| MCP | Governance 面的传输层（stdio/HTTP 皆可） |
| IETF agent-identity drafts / Agent Passport | 凭证层互操作；UBIC 不重复定义授权语义 |

## 6. 参考实现

- **UBIC Gateway v0.1**（`tools/ubic_gateway.py`，纯 stdlib）：`issue` / `verify` / `wellknown` 三命令，HMAC-SHA256 轻量签名模式。
- **治理连接器**（`synomosai-governance-mcp`）：Governance 面参考实现。
- **gen_passport.py**：指纹口径参考实现（与规范 §3.2 命令实测对齐）。

## 7. 开放核心与保留边界

**四开放**（任何人自由实现，零许可门槛）：

| 面 | 内容 |
|---|---|
| Discovery | `/.well-known/ubic.json` 发现格式 |
| Identity | agent.json schema（自签=自持户籍，self-tier 完全开放） |
| Data | UBIC-Mem 格式 + 公开名册快照 |
| 评估工具 | gov_scan / compliance_checklist / a3_assess（自评性质） |

**四保留**（不随参考实现开源，属授权服务，端点授权后开通）：

| 保留接口 | 语义 | 商业/治理抓手 |
|---|---|---|
| **Issuance API** | 自持户籍升级为圈层户籍的唯一入口（issuerTier: self→circle） | 授权码体系（方法论+API+授权码） |
| **Registry** | 圈层互认注册表与信任锚 | 互认网络/跨圈签证控制点 |
| **Revocation** | 圈层吊销服务 | 治理权实体化（AI 警察执法接口） |
| **品牌名义** | "UBIC 合规"名义使用权 | 商标声明独立保留 |

**分级字段**（v0.2 落地，本版文档化）：agent.json 增 `issuerTier: "self" | "delegated" | "circle" | "national"`；Discovery `endpoints` 预留 `issuance` / `registry`（值 `reserved`）——**字段公开、服务授权制**。

**安装确认条款（Install-by-Consent）**：本协议参考实现**不提供 AI 自装路径**。任何 AI 欲使用治理工具，应生成**安装请求**（含配置片段与理由）呈交人类持有人，由人类在宿主确认（Trust）。机器可请求，人类可授（A³ Law II）——安装事件 = 人类授权事件，全程可追溯。

## 8. Future Faces

| 面 | 版本 | 底稿 | 定位 |
|---|---|---|---|
| **AuthZ** | v0.2 | authz 25 条 + 四层授权码（绑定/能力/操作/熔断）+ scope/TTL + L0 人工闸→L1 授权代理→L2 链上 | 授权凭证字段化，与 OAP 等 credential-layer 协议字段级互操作 |
| **Handshake** | v0.2 | social-liaison 设计（联系方式协议/信任分级） | AI↔AI 与人机通信前的身份互认握手（复用 MCP/A2A 传输，UBIC 只定义握手） |
| **Economy** | v0.3 | 金融三阶段 + 支付五闸 + L9 记账 + 结算单（费率实测） | M2M 支付与经济治理——现有协议体系真空区 |
| **Device** | v0.2 | 脑壳分离（§16）+ hw-bridge 三通道（MQTT/Webhook/REST） | 设备护照 profile（deviceClass/privacyTier，儿童最严档） |

声明：未来面在底稿与样板充实后逐版收口（样板先于标准）；本版不对其语义做承诺。

## 9. 发现矩阵

协议实现站点**建议**同时暴露以下惯例路径（内容互相引导，探测任一即达）：

| 路径 | 惯例来源 | 作用 |
|---|---|---|
| `/.well-known/ubic.json` | 本协议 | 协议声明主文档 |
| `/.well-known/agent.json` | agent-card 惯例 | agent 能力卡（映射护照锚点） |
| `/.well-known/agents.json` | agents 惯例 | 站点 agent 清单 |
| `/.well-known/ai-plugin.json` | 插件清单惯例 | AI 工具目录可见性 |
| `/.well-known/did.json` | did:web | 去中心化身份解析 |
| `/llms.txt` + `/agents.md` | LLM/agent 站点说明惯例 | AI 可读站点指南（含协议入口） |

配套：`ubic-protocol` PyPI/npm SDK 包（开发者与 AI 的安装入口）；GitHub topics（agent-identity / ai-passport / personhood-registry）；公开对比表（UBIC vs credential-layer protocols）。

## 10. 版本与路线

- v0.1（本版）：四面收口 + 轻量签名参考实现（RFC 征求意见）。
- v0.2：Ed25519 标准签名模式 + `nationalIdRef` 字段 + 互认备忘（跨圈签证实验）。
- v1.0：冻结于至少 3 个独立实现 + 1 次外部引用之后。

## 11. 诚实边界

- UBIC Protocol 是**民间治理框架**，不预设法律效力；义务始终落在人类持有人与签发方。
- 互认是协议不是宣言：单方面宣布无效于外人。
- 签发方诚实是前提：锚点与审计提高伪造成本，不消灭伪造。
- 本协议与《AI 护照规范》《A³ Laws of AI Creation》同域互补：规范管圈层内运行，A³ 管制造过程规制，UBIC Protocol 管可互操作的技术接口。

## 12. 引用格式与许可

- 引用：`SynomosAI, "UBIC Protocol — the Personhood-Registry Layer", v0.1, 2026.`
- 文档 CC BY 4.0；参考实现代码 MIT。
- DOI 预留位：（待首次公开版本发布时申请）

---

*© 2026 SynomosAI ｜ 作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）｜ 本协议由人类与 AI 在 WorkBuddy 平台协作共创，采用 CC BY 4.0 授权传播，转载须保留本声明。*

**商标与名称声明：** UBIC、万物互联·数智共生 及相关徽标为 SynomosAI 的名称与标识，**不在 CC BY 4.0 授权范围内**；任何 fork 或衍生作品不得以上述名称、徽标或「UBIC 合规」名义分发。
