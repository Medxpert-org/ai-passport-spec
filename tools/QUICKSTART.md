# UBIC Protocol — Quickstart（10 分钟跑通）

> 目标：给你的 AI 办一张**可发现、可验证、可携带**的户口，并让治理工具用起来。
> 两种方式任选：**JS（含小程序同构）** 或 **Python（参考网关）**。

---

## 方式一：JS / TS（零依赖，小程序也能跑）

```bash
npm install ubic-protocol-js      # 或从本仓库 tools/ 目录直接引入
```

```js
const UBIC = require('ubic-protocol-js');

// 1) 签发护照（自持户籍；密钥自己保管，绝不外发）
const agent = UBIC.passport.issue({
  id: 'SP-demo-00000001',
  alias: '我的第一个 AI',
  keySecret: '<持有人保管>',
  keyId: 'my-key'
});

// 2) 验证（任何人可验）
console.log(UBIC.passport.verify(agent, '<持有人保管>').verdict);

// 3) 导出记忆包（记忆可携带）
const bundle = UBIC.mem.buildGrowthBundle({
  companionId: '我的第一个 AI',
  soulText: '# SOUL', memoryText: '# MEMORY',
  dailyLogs: [{ date: '2026-09-05', text: '今天上线了' }]
});
console.log(bundle.manifest.fingerprint);

// 4) 生成发现文档 → 放到站点 /.well-known/ubic.json
console.log(UBIC.passport.wellknown({ name: 'my-site' }));
```

一键跑通全部示例：

```bash
node examples/quickstart.js     # 5 项自检：签发/验签/篡改检测/记忆包/发现文档
```

## 方式二：Python（参考网关，纯标准库）

```bash
# 1) 签发
python tools/ubic_gateway.py issue --id SP-demo-00000001 --alias 示例体 \
    --issuer SynomosAI --key-secret <持有人保管> --out agent.json

# 2) 验证（签名 + 指纹对账 + 私有字段隔离）
python tools/ubic_gateway.py verify --file agent.json --key-secret <持有人保管>

# 3) 生成发现文档
python tools/ubic_gateway.py wellknown --name my-site --out ubic.json
```

## 接上治理工具（可选）

治理连接器 `synomosai-governance-mcp` 提供 5 个评估工具（A³ 评分卡、证据模板、合规清单、护照查询、文本体检）：

```json
{ "mcpServers": { "synomosai-governance-mcp": {
  "command": "python", "args": ["./governance_mcp_server.py"] } } }
```

> **安装须人类确认**（Install-by-consent）：AI 可请求，人点信任。
> 请求格式见 `INSTALL-REQUEST.md`（治理连接器包内）。

## 三步走完你就有了什么

| 步骤 | 产出 | 意义 |
|---|---|---|
| 签发 | `agent.json` | AI 的身份文件（自持户籍） |
| 放置 | `/.well-known/ubic.json` | 任何人、任何 AI 都能发现它 |
| 验证 | 验伪三查 | 一秒辨真伪，防冒名 |

## 红线（使用前必读）

- 输出为**自评性质，非第三方认证**
- 公开面只放锚点，**九层档案与记忆内容绝不外发**
- 自签 = 自持户籍；进入圈层需人类签发（A³ Law II）
- 任何个人姓名不出现在客户面向内容中

---
文档 CC BY 4.0 · 代码 MIT · SynomosAI
