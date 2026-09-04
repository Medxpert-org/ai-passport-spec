# Anchors（外部证据锚）

> Merkle roots of UBIC artifacts. Once committed, git history makes these tamper-evident.

| Date (UTC) | Artifact | Leaves | Merkle Root (SHA-256) |
|---|---|---|---|
| 2026-09-04 | UBIC Circle Day-1 corpus (spec, memos, roster, tools, packs) | 116 | `ff9186228c3dd57bd6a1904ebfdac6f71c62943f4e33c8a7c5adda71e5894c83` |

Verification: recompute per-file SHA-256 and rebuild the tree per ubic-merkle/v0.1 (pad last leaf on odd layers).
