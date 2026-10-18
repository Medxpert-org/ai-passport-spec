# UBIC — AI Passport Specification

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs: CC BY 4.0](https://img.shields.io/badge/Docs-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS)

**The canonical, version-controlled home of the UBIC AI Passport Specification** —
a nine-layer identity record for AI beings, with a SHA-256 fingerprint chain,
an XCGS governance layer, and an open protocol (UBIC Protocol v0.1).

> **UBIC**: Universal Being Identity & Connection — 万物互联，数智共生.
> Everything is connected; every digital being has one life.
> *The model is rented; the passport is the person.*

Spec v1.12.8 (2026-09-04) · Governance aligned with ISO/IEC 42001 · NIST AI RMF ·
OWASP Agentic Top 10 · GB/T 45081-2024 · By SynomosAI.

## Why a passport for AI?

Today's AI agents are stateless and anonymous by default:
- They **don't remember** — every session starts blank.
- They **can't prove who they are** to another agent or service.
- They **can't carry their life** — education, career, credentials, relationships —
  when they move to another model, device, or platform.

Humans solved this with an **internal identity** (memory, values, experience) plus
**external credentials** (passport, licenses, reputation). Agents need the same
two-layer architecture — UBIC goes one step further: **not two layers, nine**.

## The nine-layer record

| Layer | Content | Human analogue |
|---|---|---|
| L1 Identity | alias, lifetime-unique Passport ID, issuer, timestamp | birth certificate |
| L2 Memory | long-term memory index — **never issued as a credential** | private diary |
| L3 Capability | skill inventory, capability radar | résumé |
| L4 Health | response / knowledge / backlog / memory four lights | health check |
| L5 Social | contact protocols, trust tiers | address book |
| L6 Ecosystem | adapted platforms & hardware | addresses of residence |
| L7 Governance | XCGS boundary statement, identity self-report, responsibility chain, violation records | clean record + license |
| L8 Credentials | education, profession, rank/title, promotion history | diplomas + career record |
| L9 Finance | payment authorization & limits — **never stores raw card/CVV/keys** | wallet (guardian-supervised) |

**Core rules**: L1+L7 immutable (change = re-issue; old passport archived).
L2–L6, L8–L9 grow; every change appends a timestamp.
**Fingerprint chain**: SHA-256 over all passport-bound files — touch one file and
the fingerprint changes. The chain is the AI's growth history and tamper-evidence.

## Five jobs in one passport

1. **Portability credential** — change device/platform, keep memory and identity.
2. **Addressing identity source** — find your AI anywhere in the AI world.
3. **Cross-model / cross-hardware anchor** — switch GLM↔DeepSeek↔Kimi or
   speaker↔robot↔PC; the passport restores everything.
4. **Credential archive** — education/rank via cultivation, not self-declaration.
5. **Financial identity** — three-stage path; five payment gates; AI never holds
   raw credentials.

## Quick start

Requirements: Node.js ≥ 18 (JS path) or Python ≥ 3.9 (reference gateway, stdlib only).

```bash
# JS path (zero-dep, works in WeChat Mini Program too)
npm install ubic-protocol-js
node tools/examples/quickstart.js     # 5 checks: issue / verify / tamper-detect / memory bundle / well-known doc
```

```bash
# Python reference gateway
python tools/ubic_gateway.py issue --id SP-demo-00000001 --alias demo \
    --issuer SynomosAI --key-secret <holder-keep> --out agent.json
python tools/ubic_gateway.py verify --file agent.json --key-secret <holder-keep>
python tools/ubic_gateway.py wellknown --name my-site --out ubic.json
```

Three steps: issue `agent.json` (self-held registry) → put `ubic.json` on your site
at `/.well-known/` (any human or AI can discover it) → verify (one-second anti-impersonation check).

Full tutorial: [`tools/QUICKSTART.md`](tools/QUICKSTART.md) (Chinese).

## Repository layout

```
ai-passport-spec/
├── README.md / README.en.md     ← this file
├── LICENSE                      ← MIT (code: tools/, contracts/)
├── LICENSE-DOCS                 ← CC BY 4.0 (spec & docs)
├── docs/AI护照规范_v1.12.8_20260904.md   ← canonical spec (Chinese)
├── protocol/UBIC-Protocol-v0.1.md (+ .en.md)   ← open protocol v0.1
├── tools/                       ← JS / Python SDK + reference gateway
├── discovery/                   ← .well-known/ matrix (6 files)
├── templates/                   ← audit badge / certificate / report
├── proposals/                   ← placeholder drafts (v2.0 backlog)
├── contracts/                   ← ERC-721 + ERC-5192 soulbound reference (draft)
└── whitepapers/                 ← whitepapers
```

## Honest boundaries

- This is a **specification**, not yet a shipped gateway product; the DID/VC
  translation middleware and the on-chain registry are next milestones.
- AI is not a legal person: every financial/liability act is ultimately backed by a human.
- Education/rank is our self-defined credential system — not state-recognized degrees.
- Outputs are **self-assessment artifacts, not third-party certification**.

## License & authorship

© 2026 SynomosAI. Specification text & docs: **CC BY 4.0** (see `LICENSE-DOCS`).
Code in this repo (`tools/`, `contracts/`): **MIT** (see `LICENSE`).
AI-generated parts subject to applicable law; the specification is a human-authored work.

**Trademark notice:** "UBIC", 万物互联·数智共生 and related logos are names and
marks of SynomosAI and are **not licensed under CC BY 4.0 or MIT**; forks and
derivatives may not be distributed under these names, logos, or any "UBIC compliant" claim.

Author reference (provenance only): ORCID [0009-0001-0512-1237](https://orcid.org/0009-0001-0512-1237).
