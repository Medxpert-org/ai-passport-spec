# STRUCTURE — 分层与改动代价

## 五层

| 层 | 目录/文件 | 内容 |
|---|---|---|
| L1 规范 | `docs/AI护照规范_v1.12.8_20260904.md`、`protocol/UBIC-Protocol-v0.1.md`（+.en） | 九层记录的定义；中文原版为准 |
| L2 合约 | `contracts/UBICPassport.sol`、`discovery/{did.json,ubic.json,agent.json}` | 链上身份形状与发现入口 |
| L3 实现 | `tools/gen_passport.py`、`ubic_gateway.py`、`ubic-passport.js`、`ubicmem.js` | 生成护照、网关、记忆接口 |
| L4 检验 | `tools/test_ubicmem_crosscheck.{py,js}`、`tools/examples/`、`.github/workflows/{lgd-ci-gate,governance-check,scorecard}.yml` | 跨语言对账、示例、CI |
| L5 治理 | `ANCHORS.md`、`anchors/ubic-cc-ops-*.json`、`proposals/`、`EVIDENCE-INDEX.md` | 锚记录、提案队列、证据分级 |

## 改动代价

| 你想做 | 改哪里 | 必须重跑 | 必须同步 |
|---|---|---|---|
| 改一层记录的字段 | 规范 → `tools/` | `test_ubicmem_crosscheck.py`（Python 与 JS 两侧） | 版本号、英文版、`discovery/*.json` |
| 改发现入口 | `discovery/` | `lgd-ci-gate.yml` | `README` 的 quickstart |
| 改合约 | `contracts/` | 目前**无 CI**（先补测试再改） | 规范中链上条款 |
| 新增提案 | `proposals/` | — | `proposals/README` 索引（若存在） |

## 与同门仓的边界

- 本仓：**身份与记忆记录**的规范与参考实现。
- `uibc-core`：证据链与封印（证明"这份记录没被换过"）。
- `lcas`：变更是否越界（证明"这次改动还能不能用"）。
- `skillgate`：技能与产物的门禁（证明"这个交付能不能发"）。
四者共用"证据分级"口径，但**证据不互借**，引用须写"见对方仓"。
