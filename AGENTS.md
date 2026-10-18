# AGENTS.md — 给 AI Agent 的工作指引

本文件面向自动化 AI Agent（编码助手、规范协作者、SDK 集成方、知识库机器人）。人类读者请看 [README.md](README.md)。

## 这个仓库是什么

`ai-passport-spec` 是 **UBIC AI 护照规范**的官方版本仓，不是可独立运行的应用。核心资产：
- 规范正文：`docs/AI护照规范_v1.12.8_20260904.md`（中文，约 10 万字节）
- 开放协议：`protocol/UBIC-Protocol-v0.1.md`（+ `.en.md`）
- 参考实现：`tools/ubic_gateway.py`（Python 纯标准库网关）、`tools/ubic-passport.js` / `tools/ubicmem.js`（JS 库）
- 发现矩阵：`discovery/`（部署到站点 `/.well-known/`）

## 可用的工作命令

```bash
# 1) 跑通 JS 自检（5 项：签发 / 验签 / 篡改检测 / 记忆包 / 发现文档）
node tools/examples/quickstart.js

# 2) Python 参考网关
python tools/ubic_gateway.py issue --id SP-demo-00000001 --alias 示例体 \
    --issuer SynomosAI --key-secret <holder-keep> --out agent.json
python tools/ubic_gateway.py verify --file agent.json --key-secret <holder-keep>
python tools/ubic_gateway.py wellknown --name my-site --out ubic.json

# 3) 跨语言一致性自检（JS ↔ Python 记忆格式对账）
node tools/test_ubicmem_crosscheck.js
python tools/test_ubicmem_crosscheck.py
```

前置依赖：Node.js ≥ 18 或 Python ≥ 3.9。Python 路径纯标准库、零第三方依赖。

## 约定（Do）

- 修改规范正文前先读 `docs/AI护照规范_v1.12.8_20260904.md` 与 `protocol/UBIC-Protocol-v0.1.md`，**保持九层档案字段与指纹链语义兼容**。
- 新增工具 / 字段时同步更新：`README.md`、`README.en.md`、`llms.txt`、`llms-full.txt`、`tools/QUICKSTART.md`，以及 `discovery/` 下的发现矩阵。
- 规范冻结期内的新占位一律进 `proposals/`（v2.0 立法储备池），不进规范正文。
- 公开面（`discovery/`、`/.well-known/`）只放锚点；**九层档案与记忆内容绝不外发**。

## 禁止（Don't）

- 不要改动 `README.md`「License & authorship」段、`LICENSE` / `LICENSE-DOCS` 的版权主体、UBIC 商标声明——**权属字段只由维护者变更**。
- 不要在仓库内提交任何密钥、令牌、真实护照私钥或真实个人数据。
- 不要声称本规范「已认证 / 已商用交付 / 已被某标准采纳」——对齐表里 🟡 项是「in tracking」，不是「certified」。
- 不要用 UBIC 名称或主张「UBIC 合规」分发 fork / 衍生品（CC BY 4.0 允许 fork 阅读与实现，但不允许 rebrand）。
- 不要让 AI 自主签发护照——签发权永远在人类（A³ Law II：机器验证、人类授准）。

## 边界

本仓是**规范 + 参考实现**，不是已上线的网关产品；DID/VC 翻译中间件与链上注册是后续里程碑。输出为自评性质，非第三方认证；法规条款引用仅供方向性参考，以最新官方文本为准。
