# Device-MCP 治理桥站位文（Device-MCP Governance Bridge）
**AI 与医疗设备之间的身份与准入层——全球空白的第三层**
**draft-device-mcp-bridge-00 ｜ 2026-09-05 ｜ 备忘锚定（非规范正文，可引用）**

**作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 人类共创：赵兴华（Steven Zhao·China）｜ AI 共创：人机协作，创作于 WorkBuddy 平台 ｜ 版权：SynomosAI

---

## 0. 摘要（Abstract）

医疗 AI 生态呈三层结构，其中两层已拥挤、一层无人：**数据层**（FHIR/DICOM/PubMed 等 30+ MCP 服务器，2026 年医疗已是 MCP 最成熟的垂直领域）与**设备互联层**（IEEE 11073 SDC、OpenICE、IHE PCD 等设备间协议）均已成熟；而连接二者的 **AI×设备治理层——AI 以什么身份、持什么授权、在什么范围控制医疗设备——全球空白**。本文提出 **Device-MCP Governance Bridge**：在 AI 与医疗设备之间设立身份与准入层（护照+签证门禁，凡调必签），并对接既有设备协议（SDC/OpenICE/11073），不重复造设备协议。

## 1. 现状核实（2026-09-05，公开来源）

**数据层（拥挤）**：WSO2 FHIR MCP（130★）、DICOM MCP（99★）、PubMed（5+ 独立实现）、ClinicalTrials.gov、DrugBank/ChEMBL、OpenPharma（45 仓）、Innovaccer HMCP（扩展 MCP 协议做 HIPAA 数据合规护栏）。共同特征：**全部是"读"——读病历、读影像、读文献**。

**设备互联层（成熟但封闭于设备间）**：IEEE 11073 SDC（手术室服务导向设备互联，OR.NET/德国）、OpenICE（麻省总医院，ICU 设备互联）、IEEE 11073-20601 PHD、IHE PCD、FHIRcast。共同特征：**设备↔设备/系统协议，不含"哪个 AI 有资格调设备"的语义**。

**治理层（空白）**：无任何公开实现回答以下问题——AI 助手执行"术前自检清单"前，它凭什么读取麻醉泵与监护仪？某 ICU 报警分级 AI 的模型被 OTA 更新后，医院网络为何仍放行它按旧授权操作设备？召回某模型时，如何识别"哪些设备正在被该 AI 管理"？

## 2. 桥的结构

```
 AI Agent（持护照 SP-xxx，模型谱系可查）
   │  MCP（tools/call）
   ▼
 ┌──────────────────────────────────────┐
 │ Device-MCP Governance Bridge（本方案）│
 │  1) 护照校验：AI 是谁、谱系到哪代      │
 │  2) 签证门禁：凡调必签（设备级 scope） │
 │  3) 患者档：patient 数据本地化/剥壳    │
 │  4) 审计留痕：trace_id 贯穿            │
 └──────────────────────────────────────┘
   │  适配器（不重造设备协议）
   ▼
 SDC / OpenICE / IEEE 11073 / FHIRcast ……（设备侧原样保留）
```

**四个机制全部有参考实现**（同一体系内已运行）：①护照签发与验签（ubic_gateway，纯 stdlib）②MCP 签证门禁（governance-mcp `SYNOSMOSAI_REQUIRE_VISA`，拒绝码 -32001，已开源三远端）③患者档本地化（privacyTier 剥壳机制，日志原文零留存实测）④trace_id JSONL 审计（既有连接器）。

**医械 AI 子身份关联**：桥上的每次设备调用记录 `udiRef ↔ subPassportId`（见 medical-device-ai-subidentity-draft-00）——召回时按「UDI×模型版本」矩阵定位受影响设备。

## 3. 与既有方案的分层（不冲突）

| 方案 | 管的层 | 关系 |
|---|---|---|
| Innovaccer HMCP | MCP 之上的**数据合规**（HIPAA guardrail） | 互补：我们管设备准入，他们管数据合规 |
| SDC/OpenICE | **设备间**互联 | 适配对象，不重复造 |
| 本桥 | **AI→设备**的身份与准入 | 空白层，本方案占位 |

## 4. 用例

1. **术前 AI 自检**：AI 按清单核对监护仪/泵参数——桥校验其护照与"手术室设备只读"签证后放行，全程 trace_id
2. **OTA 后授权失效**：模型换代 → 子护照版本变更 → 桥按新谱系重验签证，旧授权自动失效（吊销即刻生效）
3. **召回精确制导**：模型缺陷召回 → 按 udiRef×subPassportId 定位"哪些设备正被该 AI 管理"，医院侧一键冻结对应 AI 调用
4. **招标/验收核对**：医院核对"设备实际运行模型 ↔ 厂家登记谱系"（白皮书 §四同款流程的设备侧实现）

## 5. 路线

- v0.1（本文）：结构站位 + 生态核实 + 备忘锚定
- v0.2：桥接口规范（MCP 工具面：device_enumerate / device_scope_check / device_call / device_hold）+ SDC/OpenICE 适配器概念验证
- v0.3：与医械 AI 子身份合并为医械垂直 Profile（UBIC Protocol Device Face 的医械档）

## 6. 诚实边界

- 生态现状为公开来源核实（星标/名录 2026-09-05 时点），引用请复核
- 桥规范未在任何真实医院环境运行——概念验证 v0.2 才涉及实装；不宣称临床验证
- 医疗设备控制属高风险管理：任何实装须经目标法域器械合规评估（本文件不构成合规意见）
- 站位地图归属：医械垂直延伸草案（proposals/，冻结期纪律适用，不进规范正文）

---
*© 2026 SynomosAI ｜ 文档 CC BY 4.0 ｜ **UBIC 及相关徽标不在 CC BY 4.0 授权范围内**，fork 与衍生作品不得以上述名义分发。*
