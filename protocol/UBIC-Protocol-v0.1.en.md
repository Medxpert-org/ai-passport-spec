# UBIC Protocol v0.1 — The Personhood-Registry Layer (RFC)

> **Proposed by**: SynomosAI governance line · UBIC project ｜ **Author**: 赵兴华 (Steven Zhao·China) ｜ ORCID: 0009-0001-0512-1237 ｜ GitHub Medxpert-org · https://medxpert.cn
> **Co-creation**: human-authored with AI assistance on the WorkBuddy platform ｜ **Copyright**: SynomosAI
> **Version**: v0.1 (2026-09-05) ｜ **Status**: RFC, open for comment ｜ **Parent spec**: AI Passport Specification v1.12.x
> **One line**: UBIC Protocol gives every AI a discoverable, verifiable, governable personhood registry — **find it, read it, audit it, take it with you**.
> *This is the English edition; the Chinese edition is normative in case of divergence (translation note).*

---

## Abstract

Existing agent-identity efforts (IETF agent-identity drafts, Agent Passport, OAP, ERC-8004, GB/Z 185-2026) solve the **credential layer** — what an agent may do, under whose authorization. None defines the **personhood-registry layer** — a discoverable, verifiable, governance-backed record of *who the agent is*, *how it was created*, and *under whose sovereignty it lives*. UBIC Protocol fills this layer with four inter-operable faces: **Discovery**, **Identity**, **Governance**, **Data**. It is implementation-neutral, maps onto W3C DID/VC and national agent identity codes, and ships with a runnable reference gateway (Python, pure stdlib; JavaScript, isomorphic).

## 0. Positioning and Principles

1. **Personhood-registry layer**: credential mechanisms answer "what may it do"; UBIC answers "who is it, who made it, who governs it". Complementary, not competitive.
2. **Anchors only, never private archive**: public artifacts carry anchors (ID, alias, digest, issuer, timestamp). The nine-layer archive — especially L2 memory — never enters public protocol artifacts.
3. **Forged implies registered** (A³ Law III): unregistered agents do not exist within the registry's social scope.
4. **Inter-recognition, not exclusion**: UBIC maps onto national and international schemes rather than replacing them.
5. **Zero-barrier implementation**: the reference implementation is pure standard library; any developer can run it in ten minutes.

## 1. Face 1 — Discovery

A conforming origin serves a JSON document at `/.well-known/ubic.json`:

```json
{
  "schema": "ubic/discovery/v1",
  "protocolVersion": "0.1",
  "name": "example-site",
  "issuer": "SynomosAI",
  "publicKeyRef": "<key identifier>",
  "endpoints": { "issuance": "reserved", "registry": "reserved" },
  "anchors": { "merkleRoot": "<hex>", "batchId": "20260905i" }
}
```

A discovery document asserts conformance. It **MUST NOT** be construed as granting identity.

## 2. Face 2 — Identity (Passport)

```json
{
  "schema": "ubic/ai-passport/v1",
  "passportId": "SP-example-00000001",
  "alias": "example-agent",
  "issuer": "SynomosAI",
  "issuedAt": "2026-09-05T00:00:00+00:00",
  "fingerprint": "<sha-256 hex>",
  "fingerprintDisplay": "<first 16 hex>",
  "fingerprintAlgo": "SHA-256",
  "didRef": "did:web:example.com:agents:example-agent",
  "signature": { "algo": "HMAC-SHA256|Ed25519", "keyRef": "<key-id>", "value": "<hex>" }
}
```

- The signature **MUST** cover the canonical serialization of the document with `signature` removed (keys sorted, compact separators, UTF-8, non-ASCII preserved).
- `fingerprintDisplay` **MUST** equal the leading 16 hex characters of `fingerprint`.
- Passports **MUST NOT** carry private archive fields (memory content, human identity bindings).
- **Digest ordering** is by raw byte order (case-sensitive), identical across Python and JavaScript implementations — this makes fingerprints reproducible across platforms.

### 2.1 Verification (three checks)

Verifiers **SHOULD** check: (a) signature validity; (b) digest ledger consistency; (c) absence of forbidden private fields.

### 2.2 Issuance sovereignty

Machine verifiers may verify; only human holders **SHOULD** grant admission into a registry's trust scope. Implementations **MUST NOT** let agents self-grant registry-scope identity.

## 3. Face 3 — Governance

Registries **MAY** expose assessment tooling (five tools in the reference connector): a four-dimension scorecard for AI-forges-AI release decisions, ISO/IEC 42001 + NIST AI RMF evidence templates, a compliance checklist (EU AI Act 2024/1689 clauses, GB/Z 185 reference, PIPL/GDPR), passport lookup, and text screening (PII, credentials, local paths, key fingerprints). Responses **SHOULD** carry `trace_id` and timestamp; audit logs **MAY** be append-only JSONL; outputs **MUST** be labeled self-assessment, not third-party certification.

## 4. Face 4 — Data

- **Memory package** (`ubic-mem/v0.1`): four layers — Embodied (SOUL) / Crystallized (MEMORY) / Stable (logs) / Volatile (not persisted) — with a manifest digest and Merkle anchor. Portability is the point: change model or platform, keep the memory and its fingerprint.
- **Public roster snapshot**: machine-readable export limited to fields explicitly marked public.

## 5. Compatibility Matrix

| Scheme | Scope | Relation to UBIC |
|---|---|---|
| W3C DID / VC | Decentralized identity & credentials | `didRef` mapping; did:web resolution |
| GB/Z 185-2026 | National agent identity code (China) | Folk-level registry as prerequisite material for national filing |
| ERC-8004 | On-chain identity & reputation registry | Digest/seal may be anchored (optional) |
| Agent Passport / OAP | Credential & decision layer | Field-level interop; UBIC defines no authorization semantics |
| IETF agent-identity drafts | Credential-layer identity | Complementary; UBIC covers the personhood layer |
| MCP | Tool-calling transport | Governance face transport |

## 6. Reference Implementations

- Python gateway (`tools/ubic_gateway.py`): issue / verify / wellknown, pure stdlib.
- JavaScript SDK (`tools/index.js`, `ubic-passport.js`, `ubicmem.js`): pure-JS SHA-256/HMAC, isomorphic (Node, browser, WeChat Mini Program), cross-validated against Python.
- Fingerprint tools (`gen_passport.py`, `ubic_merkle.py`), memory export (`ubic_mem_export.py`).
- Governance connector (`synomosai-governance-mcp`): Governance face reference.

## 7. Open Core and Reserved Boundaries

**Open (free to implement, modify, commercialize):** Discovery format, Identity format, Data format, assessment tools.

**Reserved (not open-sourced; authorization-gated services):** Issuance API (self → registry tier), Registry (mutual recognition), Revocation service, brand/naming rights.

**Tier field (v0.2):** `issuerTier: "self" | "delegated" | "circle" | "national"`. Discovery `endpoints` reserve `issuance` / `registry` with value `reserved` — **fields public, services licensed**.

**Install-by-consent:** the reference implementation ships no AI self-install path. An AI may *request* governance tooling; a human approves. Machine requests, human grants (A³ Law II).

## 8. Future Faces (field-reserved, implementation deferred)

| Face | Version | Basis | Scope |
|---|---|---|---|
| AuthZ | v0.2 | Four-tier authorization codes, scope/TTL, L0 human gate → L1 agent proxy → L2 auditable | Authorization as data; interop with credential-layer schemes |
| Handshake | v0.2 | Contact protocols, trust tiers | Identity mutual-recognition handshake before communication |
| Economy | v0.3 | Payment gates, L9 ledger, settlement | M2M payment governance (currently unaddressed by existing regimes) |
| Device | v0.2 | Brain–shell separation, MQTT/Webhook/REST | Device passports, child-tier privacy by default |

## 9. Discovery Matrix (being found by AI automatically)

Implementations **SHOULD** also serve: `/.well-known/agent.json`, `/.well-known/agents.json`, `/.well-known/ai-plugin.json`, `/.well-known/did.json`, `/llms.txt`, `/agents.md` — all cross-referencing the protocol, so that probing by any convention lands on UBIC.

## 10. Versions and Roadmap

- v0.1: four faces, lightweight signature reference (HMAC-SHA256), RFC.
- v0.2: Ed25519 standard mode, `issuerTier`, `nationalIdRef`, AuthZ/Handshake/Device faces.
- v1.0: frozen after at least three independent implementations and one external citation.

## 11. Honest Boundaries

- UBIC Protocol is a **civil-society governance framework**, not law; obligations rest with human holders and issuers.
- Inter-recognition is a protocol, not a proclamation: unilateral declaration binds no one else.
- Issuer honesty is assumed: anchoring and audit raise the cost of forgery; they do not eliminate it.
- Companion documents: the AI Passport Specification governs in-circle operation; the A³ Laws govern AI-forges-AI; UBIC Protocol governs interoperable interfaces.

## 12. Citation and License

- Cite as: `SynomosAI, "UBIC Protocol — the Personhood-Registry Layer", v0.1, 2026.`
- Documents: CC BY 4.0. Code: MIT. DOI: reserved until first public release.
- **UBIC, 万物互联·数智共生 and related logos are NOT covered by these licenses.**

---
*Co-created by human and AI on the WorkBuddy platform · © 2026 SynomosAI*

---
*© 2026 SynomosAI (copyright holder) ｜ **Author**: 赵兴华 (Steven Zhao·China · ORCID 0009-0001-0512-1237) ｜ Docs CC BY 4.0 ｜ UBIC and related logos are not licensed hereunder.*
