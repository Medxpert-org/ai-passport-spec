# Anchors（外部证据锚）

> Merkle roots of UBIC artifacts. Once committed, git history makes these tamper-evident.

| Date (UTC) | Artifact | Leaves | Merkle Root (SHA-256) |
|---|---|---|---|
| 2026-09-04 | UBIC Circle Day-1 corpus (spec, memos, roster, tools, packs) | 116 | `ff9186228c3dd57bd6a1904ebfdac6f71c62943f4e33c8a7c5adda71e5894c83` |
| 2026-09-04 | UBIC-CC operational data (audits, legacy_bindings, voting, golden_ids, registers, console) · leaves committed at `anchors/ubic-cc-ops-20260904.json` | 24 | `8cf8d8db7ac8b3d53851276b70062439b1fb5310116e920083e39000d2536b5a` |

Verification: recompute per-file SHA-256 and rebuild the tree per ubic-merkle/v0.1 (pad last leaf on odd layers).
