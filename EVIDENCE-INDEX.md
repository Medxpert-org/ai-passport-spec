# EVIDENCE-INDEX — ai-passport-spec

口径：等级由**谁能复现**决定，不由作者自评。没有的写 `0`，并写明升级条件。

## 现状

| 级 | 结果 | 证据位置 | 说明 |
|---|---|---|---|
| L1 自我复现 | **有** | `tools/gen_passport.py`、`tools/ubic_gateway.py`、`tools/ubic-passport.js`、`tools/ubicmem.js`、`tools/test_ubicmem_crosscheck.{js,py}`、`tools/examples/{01-passport,02-memory,quickstart}.js`、`.github/workflows/lgd-ci-gate.yml` | 生成护照与网关可跑；`tools/test_ubicmem_crosscheck.py` 与 `.js` 是跨语言对账（Python ↔ JS 结果须一致） |
| L2 异体审查 | **有限** | `.github/workflows/lgd-ai-review.yml`、`lgd-itu-review.yml`、`itu-review-rules.md`、`anchors/ubic-cc-ops-*.json`（7 份带时间戳的锚） | 有自动评审流水线与锚记录，但**评审者标识与结论是否落成回执需在 workflow run 内核对**；本表不据此升为"有" |
| L3 第二实现 | **0** | — | `protocol/UBIC-Protocol-v0.1.md` 与 `.en.md` 是中英双版**同一份规范**，不是两份实现 |
| L3.5 外部语料 | **0** | — | 无本仓之外的真实数据跑通记录 |
| L4 外部节点 | **0** | — | 无第三方组织实际采用并可指认 |

## 已知不硬的地方

1. **规范已定版，实现未对齐验证。** 规范 v1.12.8 描述九层记录，`tools/` 是参考工具，**没有"规范条款 ↔ 工具行为"逐条对账表**。规范与实现之间的缝隙目前靠人读，不靠机器判。
2. **`contracts/UBICPassport.sol` 未列入 CI。** 合约未在 `lgd-ci-gate.yml` 里被编译/测试，链上部分属"有文件、无验证"。
3. **中文原版与英文版进度不同步。** README 自述"EN translation in progress"，引用英文条款时应以中文原版为准。
4. **"护照"的效力边界未在规范内明文限制。** 对外必须同时说：这是身份记录的规范与参考实现，不是注册机构，不产生法律效力。

## 维护约定

- 规范条款变更 → 同步 `tools/` 对账用例 → 更新本表 L1 行。
- 等级只降不升，除非新证据落盘。
- 引用时标注仓库名、版本号（v1.12.8）与权利人。
