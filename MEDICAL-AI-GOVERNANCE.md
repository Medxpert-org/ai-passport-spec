# Medical AI Governance Line（医械 AI 治理线 · 总纲入口）

> AI×医疗设备的身份、谱系与准入——医械 AI 子身份层与 Device-MCP 治理桥。
> 版权：SynomosAI ｜ 文档 CC BY 4.0 ｜ 2026-09-05

## 叙事链（四件套互锁）

```
是谁（子身份层）→ 凭什么（治理桥：签证+scope）→ 怎么落地（白皮书）→ 官方通道（FDA 评论）
```

| # | 件 | 位置 | 状态 |
|---|---|---|---|
| 1 | **医械 AI 子身份层草案**（UDI/SBOM/PCCP 空隙 → 第四件：模型户口簿） | `proposals/medical-device-ai-subidentity-draft-00.md` | 🟢 已发布（锚点批 p） |
| 2 | **Device-MCP 治理桥站位文**（AI→设备 治理层全球空白） | `proposals/device-mcp-bridge-draft-00.md` | 🟢 已发布（锚点批 q） |
| 3 | **Device-MCP Bridge 接口规范 v0.2**（四工具面+状态机+错误码） | `proposals/device-mcp-bridge-spec-v0.2.md` | 🟢 本批 |
| 4 | **参考实现** `ubic_devbridge.py`（enumerate/scope_check/call/hold，纯 stdlib，四错误码实测） | ubic-cc 工具链（本地；随协议仓版本化路线） | 🟢 本批 |

> 商用文档《医械AI谱系登记白皮书 v1.0》与 FDA DHCoE 评论稿位于业务侧（不随仓公开），需要时向持有方索取。

## 一句话定位

**UDI 管壳、SBOM 管清单、PCCP 管计划、我们管"此刻是谁在动设备"。**

## 生态现状（2026-09-05 核实，防重复造轮子）

- 数据层 MCP 已拥挤（FHIR/DICOM/PubMed 30+ 实现）——不占
- 设备互联协议已成熟（IEEE 11073 SDC / OpenICE / IHE PCD）——适配不重造
- **AI×设备治理层：全球空白——本线占位**
- 与 Innovaccer HMCP（数据合规护栏）分层互补，不冲突

## 验证

任何声称可复验：指纹登记册（v29-v32）＋ Merkle 锚点批（p/q/r）＋ 三远端同内容（GitHub/Gitee/GitCode）。
