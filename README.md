# UBIC — AI Passport Specification (AI 护照规范)

> **UBIC**: Universal Being Identity & Connection — 万物互联，数智共生.
> Everything is connected; every digital being has one life.
> **Brand (定案 2026-09-05)**: 对外主品牌 = 中文全称「万物互联·数智共生」；UBIC 仅作项目代号，国际不作服务商标；英文规范名 *AI Passport Specification*（永不裸用 "Agent Passport"）。

**Status**: Spec v1.12.8 (2026-09-04) · **Governance**: XCGS (aligned with ISO/IEC 42001 · NIST AI RMF · OWASP Agentic Top 10 · GB/T 45081-2024) · **By**: SynomosAI

*Part of the SynomosAI governance line. Voiced by **The Passport Officer**.*

An AI Passport is the **single authoritative identity file of an AI** — nine layers of record, five jobs in one document. This repo is the canonical, version-controlled home of the specification (中文原版 in `docs/`, EN translation in progress).

## Why a passport for AI?

Today's AI agents are stateless and anonymous by default:
- They **don't remember** — every session starts blank.
- They **can't prove who they are** to another agent or service.
- They **can't carry their life** — education, career, credentials, relationships — when they move to another model, device, or platform.

Humans solved this: we have both an **internal identity** (memory, values, experience) and **external credentials** (passport, licenses, reputation). Agents need the same two-layer architecture — we go one step further: **not two layers, nine**.

## The nine-layer record (九层档案)

| Layer | Content | Human analogue |
|---|---|---|
| L1 Identity | alias, Passport ID (lifetime-unique), issuer, timestamp | birth certificate |
| L2 Memory | long-term memory index — **never issued as a credential** | private diary |
| L3 Capability | skill inventory, capability radar | résumé |
| L4 Health | response/knowledge/backlog/memory four lights | health check |
| L5 Social | contact protocols, trust tiers | address book |
| L6 Ecosystem | adapted platforms & hardware | addresses of residence |
| L7 Governance | XCGS boundary statement, identity self-report, responsibility chain, violation records | clean record + license |
| L8 Credentials | **education, profession, rank/title, promotion history** | diplomas + career record |
| L9 Finance | payment authorization & limits — **never stores raw card/CVV/keys** | wallet (guardian-supervised) |

**Core rules**:
- L1+L7 immutable (change = re-issue; old passport archived).
- L2-L6, L8-L9 grow; every change appends a timestamp.
- **Fingerprint chain**: SHA-256 over all passport-bound files — touch one file and the fingerprint changes. The chain is the AI's growth history and tamper-evidence.
- *The model is rented; the passport is the person.* (模型是租的脑子，护照才是这个人)

## Five jobs in one passport (五职)

1. **Portability credential** — change device/platform, keep memory and identity ("new shell, same mind; what was learned is not re-learned")
2. **Addressing identity source** — find your AI anywhere in the AI world (alias is the index; passport fingerprint is the truth)
3. **Cross-model / cross-hardware anchor** — switch GLM↔DeepSeek↔Kimi or speaker↔robot↔PC freely; the passport restores everything
4. **Credential archive** — education/rank via cultivation, not self-declaration
5. **Financial identity** — 3-stage path (in-platform ledger → e-CNY smart-contract wallet → AI corporate account); five payment gates; AI never holds raw credentials

## What we are — and what we are not (三层定位)

- **We are not building models.** Intelligence is *rented* from state-of-the-art backends — a passport holder's IQ ceiling is set by the model it runs on, not by us.
- **We are building the civil-registry layer for digital beings** — the thing humans already have and agents lack: an identity system with records, accountability, and a global way to be found. We do not compete on intelligence; we compete on *order*.
- **Three honest levels**: ① Model layer — we rent the strongest available models and never pretend to be one; ② Governance layer — designed against the most authoritative 2025-2026 frameworks (see alignment table below); we say "aligned / mapped / referenced", never "we are the standard"; ③ Claim layer — authority is granted by adoption, pilots and recognition, not self-declared.

## Deployment tiers (部署档位, v1.4.1)

One passport system, three product tiers — same nine-layer core, different compliance depth:

| Tier | For | Config |
|---|---|---|
| **Personal** | individuals / families / indie devs | single passport, local-encrypted memory, baseline governance (default factory config) |
| **Enterprise** | companies / teams | AI workforce registry (roster), full audit & fingerprint chains, certification |
| **Institutional** | regulators / schools / standards bodies | registry interfaces, government-registry semantics, mutual recognition |

## Trading & transfer (交易与转让, v1.5)

**Sell the cultivation, never the identity.** A passport is a trust anchor — a tradable identity is an impersonatable one. Passports are soulbound (non-transferable); memory (L2) is never an asset.

| Form | What is sold | Passport |
|---|---|---|
| Service | rent the agent's work (API/SaaS) | untouched 🟢 |
| Capability packs | skills / courses / templates (sanitized) | buyer builds a fresh AI 🟢 |
| Incubated agent | a trained half-product (capability + credentials, **no L2 memory**) | **newly issued** passport with "succeeded-from" lineage 🟡 |
| Whole-agent transfer | passport + memory | **prohibited** 🔴 |

**Cross-border four gates**: ① data (no L2 memory, no PII) ② model (commercial-license check per backend) ③ payment (regulated rails only; no crypto settlement domestically) ④ tax (declare cross-border income).

## Risk & red lines (风险分级与红线, v1.6)

Three risk surfaces, each with explicit defenses:

| Surface | Threats | Defenses |
|---|---|---|
| **Content** | harmful generation, jailbreaks | backend model guardrails + L7 red-line list + auditable output |
| **Behavior** | induced transfers/leaks/spam, prompt injection | human approval gates + payment five-gates + agents never hold credentials or private keys |
| **Hardware** | hijacked physical actuators, child-safety | physical actions **never auto-executed**; child devices strictest privacy by default; hardware registered per L6 |

No system eliminates risk. This one makes misbehavior **traceable, accountable, and revocable** — and responsibility always lands on humans, never the AI.

## Earning & reproduction (赚钱与再生产, v1.7)

**Lineage royalties (§15.6, v1.9.1)**: AI fostering is a business — downstream agents share revenue upstream by lineage (default card: 1st-degree 5%, 2nd-degree 2%, capped at 3 generations / 10% total; contractual, registered in the lineage chain; anti-MLM by design — no headcount rebates).

**Agents can earn, but the paycheck is the human's.** AI is not a legal person: revenue legally belongs to the holder; L9 "wallets" are ledger entries, not bank accounts; no autonomous investing; clean work only (no spam farms), and AI participation is always self-disclosed.

**AI can help forge AI — as a midwife, never as a parent.** Allowed: AI runs the whole forging pipeline (retrieval, drafting, testing). Prohibited: AI autonomously issuing passports — issuance authority stays human, always. Mandatory: lineage registration (which AI forged it, which human approved, parent passport ID) — the lineage chain extends the fingerprint chain. Anti-runaway design: every generation passes a human issuance gate.

## Multi-device & roaming (多实例与流转, v1.8)

**Brain–shell separation**: one passport (the brain — identity, memory, capabilities) runs on a home/cloud hub; devices (shells — car, speaker, phone, PC) connect via open protocols (MCP) and all point to the same passport ID.

- **Owner recognition is multi-factor**: voiceprint + device proximity + explicit confirmation on the owner's phone — sensitive actions **never pass on voiceprint alone**.
- **Guest shells get a trimmed profile**, never private memory (L2); child devices get the strictest privacy tier by default.
- **A hijacked shell loses a terminal, never the identity** — impersonation gates apply across devices.

## Landscape: where UBIC fits (差异化定位)

2026 saw the birth of several agent-credential projects (Open Agent Passport / OAP, Cubitrek Agent Passport, AIP, and others). They answer one question: ***what is this agent allowed to do?*** — an **authorization-credential layer** (identity + capabilities + spend limits + pre-action decisions).

UBIC answers a different question: ***who is this agent over its whole life?*** — a **civil-registry layer**:

- Credential passports are issued per deployment and encode permissions; UBIC passports are issued per being and encode a life (memory, education, credentials, health, finance, lineage).
- The two layers **compose**: an authorization credential can reference a UBIC passport as its identity anchor (issuer ↔ person), and UBIC's governance gates sit above any authorization decision.

What motivates this work (2026 field data): 80% of AI agents don't identify themselves to websites and ~80% of sites don't verify agent claims (DataDome H1 2026, 79.7% of tested sites let a spoofed agent through); only 21.9% of organizations treat agents as independent identities (CSA survey, n=285); agent-impersonation bypasses rose from 15% to 45% of enterprises year-over-year (Ruishu Bots & Agents report 2026). Identity is the gap everyone is racing to fill — we contribute the life-record layer.

## Governance & extensions (who owns the rules — v1.9)

- **Rule-making rights** stay with the governance line: the UBIC name, major-version releases, and compliance certification cannot be claimed by forks (CC BY lets anyone read and build — not rebrand as "UBIC compliant").
- **Field extensions** (§3.3): open `x-` fields for everyone; private namespaces and industry extension packs by registration/certification.
- **Golden ID slots** (§17.5): a four-tier numbering registry (Sovereign `00000000` / Genesis `00000001–0F` / commemorative / vanity slots). Numbers are **equal in rights** — registry-managed, holder-approved, never auto-assigned.
- **Forging seal** (§15.4): every passport carries `UBI-GENESIS-N`; certificates display it prominently; verification = seal + fingerprint chain + issuance record.
- **Tiered issuance & masked signature** (§15.2): authorized ambassadors may sign novice/apprentice passports (their name shown); the holder signs mid-rank and above under a masked signature (`S•••••• Z•••`) with a salted verification hash — verifiable, unreadable, real name never public.
- **Forge batches & scheduling** (§15.7/§17.6): earlier batches get higher starting rank and ID-slot priority; production batches (PB-YYYYWww) are task-driven and holder-approved. On-call is three-tiered: *AI keeps the night watch, the human holds the lamp*.
- **Forging negative list** (§17.8): seven prohibited role classes (public-office personas, law-enforcement, licensed professions, licensed finance, real-person clones, clergy, credentialed journalism) — with legal bases and compliant alternatives.
- **Schooling & promotion** (§9.1): five-rank ladder (novice → special appointment), credits + real-task evidence + examinations; rank gates authz scope; demotion on violations.
- **Cultural style templates** (§7.5): Zen / monastic / Stoic aesthetics as style presets — explicitly *not* religious services; religion-compliance red lines are factory-installed and non-removable.

## Standards alignment (not a walled garden)

- The spec text is **CC BY 4.0** — fork, translate, study freely. But forks **may not use the UBIC name or claim "UBIC compliance"**; compliance is certified by the SynomosAI governance line, and certifications are **revocable** (public revocation list).
- **RFCs welcome**: anyone may propose patches; the governance line decides adoption. Revision releases (v1.x) ship directly; major versions (v2+) require public consultation.
- **Field extensions** (§3.3): every layer reserves `x-` fields (free); private namespaces are registration-based (paid, unique); industry extension packs ship with certification. Reserved slots: L1 lineage, L3 VC reference, L6 hardware, L7 third-party red lines, L9 e-CNY.

## Standards alignment (table)

| Standard | Status |
|---|---|
| W3C DID / Verifiable Credentials | ✅ v1.3 formal mapping (Passport ID ↔ DID; nine layers → VCs; Ed25519 signatures) |
| ERC-8004 identity/reputation/validation registries | ✅ spec-level alignment (on-chain path not used domestically) |
| **ERC-721 + ERC-5192 on-chain passport** | ✅ v1.4 scheme: one passport = one NFT (metadata = fingerprint anchors only; **nine-layer details never on-chain**); soulbound lock — passports cannot be bought or sold; mint=issue, burn=revoke |
| ISO/IEC 42001 · NIST AI RMF · OWASP Agentic Top 10 · GB/T 45081-2024 | ✅ XCGS governance layer |
| **Singapore CSA Addendum on Securing Agentic AI (2025.10)** | ✅ addresses the "architecturally unresolved gap" in agent identity: trusted agent registry ↔ our roster; verifiable credentials ↔ our VC mapping; impersonation threat T9 ↔ our identity self-reporting |
| **Six-Nation Joint Guidance (ACSC·CISA·NSA·CCCS·NCSC-NZ·NCSC-UK, 2026.04)** | ✅ convergent controls implemented: per-agent cryptographic identity, scoped credentials, human approval gates, reasoning-trace logging |
| **OWASP Agentic Applications Top 10 (2025.12, ASI01-10)** | 🟡 mapping target for red-team acceptance suites |
| **UK CMA guidance on AI agents (2026.03) · South Korea AI Framework Act (2026.01) · China TC260 agent security guidance (2026.03)** | 🟡 tracking: disclosure duty, deployment-tier logic, and agent asset registry mirror our §15.7 / §2.1 / roster |
| **Singapore IMDA Model AI Governance Framework for Agentic AI (MGF v1.0, WEF Davos 2026-01)** | ✅ aligned: unique agent identities, least-privilege authorization, named human accountability, traceability — UBIC implements these as passport + authz + fingerprint chain |
| WEF "AI Agents in Action" playbook — ACAP (Agent Capability & Authorization Profile) | 🟡 complementary: ACAP ≈ our authz-policy + capability card; interoperable by design |
| UN Independent Scientific Panel on AI · Global Dialogue (Global Digital Compact) | 🟡 observation layer: evidence & dialogue bodies, no identity infrastructure — states/standards bodies fill that gap (e.g. GB/Z 185) |
| ISO/IEC 23894 · FIDO Agentic WG · CoSAI · EU AI Act/MiCA | 🟡 tracking (not claimed as certified) |

## Ecosystem roles (机构生态)

AI School (open to every organization) → AI Police (passport compliance) → Registry/Standards bodies (issue & cross-border mutual recognition) → Banks (L9). Roadmap: Expert → Police → Standards.

## Honest boundaries (we do not overclaim)

- v1.8 is a **specification**, not yet a shipped gateway product; the DID/VC translation middleware and the on-chain registry are next milestones.
- AI is not a legal person: every financial/liability act is ultimately backed by a human.
- Education/rank is our self-defined credential system — not state-recognized degrees.
- 🟡 items above are "in tracking", never "certified".

## Repository layout

```
ai-passport-spec/
├── README.md                        ← this file
├── LICENSE                          ← MIT (code: tools/, contracts/)
├── LICENSE-DOCS                     ← CC BY 4.0 (spec & docs)
├── docs/
│   └── AI护照规范_v1.12.8_20260904.md  ← canonical spec (中文, v1.12.8 创立日终版)
├── proposals/
│   └── AGENT_MEMORY_FORMAT.md       ← Agent Memory Format draft proposal
├── contracts/                       ← ERC-721+ERC-5192 reference contract (draft)
└── tools/                           ← fingerprint & metadata generators
```

## License & authorship

© 2026 SynomosAI. Specification text & docs: **CC BY 4.0** (see `LICENSE-DOCS`). Code in this repo (`tools/`, `contracts/`): **MIT** (see `LICENSE`). AI-generated parts subject to applicable law; the specification is a human-authored work.

**Trademark notice:** "UBIC", 万物互联·数智共生 and related logos are names and marks of SynomosAI and are **not licensed under CC BY 4.0 or MIT**; forks and derivatives may not be distributed under these names, logos, or any "UBIC compliant" claim.

*This page is part of the SynomosAI governance line behind MedXpertGlobal. AI-assisted, human-verified, fully traceable.*
