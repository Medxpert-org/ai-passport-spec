# Passport Verification（护照验签集成）

本文说明本仓与 [`lgd-xverify`](https://github.com/zhaoxinghua09-cell/lgd-xverify) 的分工，
以及如何对一个护照文件给出 PASS / FAIL / UNKNOWN。

## 分工

| 仓 | 职责 | 不做什么 |
|---|---|---|
| `ai-passport-spec`（本仓） | 定义护照**应含什么**：九层字段、生成方式、字段语义 | 不实现密码学、不判定记录是否可信 |
| `lgd-xverify` | 判定记录**是否完整、签名是否有效**，输出三值结论 | 不定义护照结构 |

本仓**不复制** `lgd_ed25519.py` / `lgd_xverify.py`。密码学与验签只有一份实现，放在 `lgd-xverify`；
本仓通过 `XVERIFY_DIR` 引入，未检出时**报错退出**，不降级为"通过"。

## 用法

```bash
export XVERIFY_DIR=/path/to/lgd-xverify      # 或 set XVERIFY_DIR=...

python tools/make_signed_passport.py         # 生成可验签样本（写入当前目录）
python tools/verify_passport.py passport_signed.json \
    --xverify-dir "$XVERIFY_DIR" --keys keys_demo.json
```

退出码：`0 = PASS`、`1 = FAIL`、`3 = UNKNOWN`。

## 四种语义（这就是全部判据）

| 输入 | verdict | 理由 |
|---|---|---|
| 签名有效且公钥具备 | PASS | 规范化载荷与签名一致 |
| 载荷被改（如 `operator` 变更） | FAIL | signature does not verify over the canonical payload |
| 有签名但**未提供公钥** | UNKNOWN | 无法判定 ≠ 签名无效，两者不得混为一谈 |
| 无签名段 / 缺 `agent` 字段 | UNKNOWN | 字段不全不入验签 |

`tests/test_passport_verify.py` 四条用例逐一守住上表；未设置 `XVERIFY_DIR` 时整组 skip（不误报红）。

## 明确不做的事

- **不做信封级规范化裁决**：护照不是 `1F916` / `TRACE` / `ARIA` 三种信封，因此只做
  detached 签名的实际验签与规范化哈希（`canonical_sha256`，供对账），不套用信封裁决语义。
- **不评价能力是否被授权**：验签只回答"这份记录是不是它声称的那份、有没有被改"，
  不回答"该 agent 是否有权做这件事"。后者属于授权链，当前**没有实现**。
- **不提供透明日志**：无 append-only 日志、无 Merkle 证明，因此**无法证明签发时间与吊销历史**。
  这一点是对照 IETF AIP / OpenA2A AIP 时最明显的差距，不在本仓主张范围内。
