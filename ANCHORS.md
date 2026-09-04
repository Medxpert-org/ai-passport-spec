# Anchors（外部证据锚）

> Merkle roots of UBIC artifacts. Once committed, git history makes these tamper-evident.

| Date (UTC) | Artifact | Leaves | Merkle Root (SHA-256) |
|---|---|---|---|
| 2026-09-04 | UBIC Circle Day-1 corpus (spec, memos, roster, tools, packs) | 116 | `ff9186228c3dd57bd6a1904ebfdac6f71c62943f4e33c8a7c5adda71e5894c83` |
| 2026-09-04 | UBIC-CC operational data (audits, legacy_bindings, voting, golden_ids, registers, console) · leaves committed at `anchors/ubic-cc-ops-20260904.json` | 24 | `8cf8d8db7ac8b3d53851276b70062439b1fb5310116e920083e39000d2536b5a` |

Verification: recompute per-file SHA-256 and rebuild the tree per ubic-merkle/v0.1 (pad last leaf on odd layers).
| 2026-09-05 | UBIC-CC operational data · Day-2 (post-issuance of 8 ambassadors; feedback state machine patch; audit/ledger untouched) · leaves committed at `anchors/ubic-cc-ops-20260905.json` | 32 | `18732c17f3ec3bfbe8529c15a7c5e54eb94dafe0ccc62ad77b9745557a42263c` |
| 2026-09-05 | UBIC-CC operational data · Day-2b (+authz_check.py 授权查询器 / ubic_daily_backup.py 每日备份脚本; feedback ledger archived) · leaves committed at `anchors/ubic-cc-ops-20260905b.json` | 34 | `cd8a483ac62cb1af044dd3fa515e0d57bdd8c5f863ef7888010bf33e14850237` |
