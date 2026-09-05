# Device-MCP Bridge 接口规范 v0.2
**（站位文 draft-device-mcp-bridge-00 的接口化 · 参考实现：ubic_devbridge.py）**

**作者：赵兴华（Steven Zhao·China ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · medxpert.cn）** ｜ 版权：SynomosAI ｜ 2026-09-05

---

## 1. 定位

桥以 MCP 工具面形式暴露给 AI Agent 四个最小操作：**盘点、查权、调用、冻结**。设备侧经适配器对接既有协议（SDC/OpenICE/11073），本规范只定义 AI↔桥 的治理面。

## 2. 工具面

### tool 1: device_enumerate（盘点）
```
入参: { "scope": "ward:ICU-3 | udi:全部" }
行为: 列出桥接设备（UDI、类、在线态、归属适配器）
出参: { devices: [{ udiRef, deviceClass, status, adapter }], trace_id }
```

### tool 2: device_scope_check（查权 · 凡调必签核心）
```
入参: { "agentRef": "SP-xxx", "udiRef": "UDI-xxx", "action": "read|write" }
行为: ①AI 护照/签证有效（active+期限内）②scope 表匹配（该 AI 对该类设备该动作的授权）
      ③患者档设备额外要求 patient-tier
出参: { allowed: bool, reason, scopeId, trace_id }   // 拒绝时附 AI 友好 nextStep
```

### tool 3: device_call（调用）
```
入参: { "agentRef", "udiRef", "action", "param": {} }
行为: 内部先过 device_scope_check → 经适配器转发设备协议 → 回执
出参: { status: "ok|held|denied", deviceReply, trace_id }
出参含 udiRef×subPassportId 记录（供召回矩阵）
```

### tool 4: device_hold（冻结 · 吊销即刻生效）
```
入参: { "udiRef" | "agentRef", "reason" }
行为: 冻结设备（模型召回/事件调查时）；被冻结设备拒绝一切 AI 调用
出参: { status: "held", trace_id }
```

## 3. 状态机

```
AI 调用 → scope_check（拒绝→附 nextStep 返回）
        → device_call → 适配器 → 设备回执 → trace 落审计
任意时点：device_hold → 该 udiRef 全部调用拒绝（-32002 HELD）
```

## 4. 错误码

| 码 | 含义 |
|---|---|
| -32001 | 签证无效/过期（凡调必签，复用 governance-mcp 门禁口径） |
| -32002 | 设备被冻结（HELD） |
| -32003 | scope 不匹配（该 AI 无此设备/动作授权） |
| -32004 | 患者档违规（patient 数据未本地化路径调用） |

## 5. 审计

每次调用追加 JSONL（trace_id、agentRef、udiRef、action、verdict、ts）——召回时按 udiRef×agentRef 检索。

## 6. 路线

- v0.2（本文）：工具面 + 状态机 + 错误码（备忘锚定，非规范正文）
- v0.3：适配器概念验证（先接模拟 SDC 端点）+ 与医械 AI 子身份（subPassportId）合并字段

---
*© 2026 SynomosAI ｜ 文档 CC BY 4.0 ｜ **UBIC 及相关徽标不在 CC BY 4.0 授权范围内**。*
