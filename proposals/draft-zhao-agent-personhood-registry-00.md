# Internet-Draft — The Personhood Registry Layer for AI Agents
# draft-zhao-agent-personhood-registry-00

```
Working Group:  (none — individual submission)
Internet-Draft: draft-zhao-agent-personhood-registry-00
Intended Status: Informational / Standards Track (TBD)
Expires: 2027-03-05
Author:  Steven Zhao (赵兴华)
         ORCID 0009-0001-0512-1237
         SynomosAI / MedXpert
         2026-09-05
```

> 状态说明：本件为**投稿底稿**（working draft），尚未提交 IETF 秘书处；提交前需按 xml2rfc 格式转写并按 I-D 流程公告。内容源自 UBIC Protocol v0.1（CC BY 4.0，作者同一）。

---

## Abstract

Existing and emerging agent-identity mechanisms — IETF agent-identity drafts, W3C DID/Verifiable Credentials, ERC-8004 registries, and national agent identity codes (e.g., GB/Z 185-2026) — largely address the **credential layer**: what an agent may do, under whose authorization, with what limits. This document describes a complementary **personhood-registry layer**: a discoverable, verifiable, governance-backed record of *who an agent is*, *how it was created*, and *under whose sovereignty it lives*. It specifies a discovery document (`/.well-known/ubic.json`), a signed identity document (`agent.json`), a governance interface built on tool-calling interfaces with audit traces, and a portable data format. It is implementation-neutral and defines no new authorization semantics.

## 1. Introduction

Agent ecosystems increasingly support agent-to-agent interaction, delegated action, and automated service access. The credential layer answers "may this agent perform X". It does not answer, in a standardized and verifiable way:

- Q1. **Provenance**: who created this agent, when, and from what template?
- Q2. **Sovereignty**: which human party is accountable for it?
- Q3. **Continuity**: if the model, host, or platform changes, does the agent's identity survive?

This document specifies registry-layer objects that answer Q1–Q3 while remaining independent of credential-layer semantics.

### 1.1. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHOULD", "RECOMMENDED", "MAY", and "OPTIONAL" are to be interpreted as described in RFC 2119 [RFC2119].

## 2. Terminology

- **Personhood Registry Layer**: registry of agent identity attributes concerning provenance, sovereignty, and continuity (this document).
- **Credential Layer**: mechanisms concerning authorization, delegation, and capability (out of scope).
- **Passport**: the signed identity document described in Section 4.
- **Forge Seal**: an immutable provenance record binding creator, time, template, and content digest.
- **Issuance**: the act of admitting an agent into a registry's social/trust scope. Issuance is a human-governed act; this document standardizes its artifacts, not its policy.

## 3. Architecture

Four inter-operable faces:

1. **Discovery** — a well-known document asserting conformance and endpoints (Section 3.1).
2. **Identity** — a signed passport document (Section 4).
3. **Governance** — assessment/audit tooling with trace identifiers (Section 5).
4. **Data** — portable memory package and public roster snapshot (Section 6).

### 3.1. Discovery Document

A conforming origin serves a JSON document at `/.well-known/ubic.json`:

```json
{
  "schema": "ubic/discovery/v1",
  "protocolVersion": "0.1",
  "name": "example-site",
  "issuer": "SynomosAI",
  "publicKeyRef": "<key identifier>",
  "endpoints": { "issuance": "reserved", "registry": "reserved" },
  "anchors": { "merkleRoot": "<hex>", "batchId": "<string>" }
}
```

The discovery document asserts conformance only. It **MUST NOT** be construed as granting identity.

## 4. Identity Document (Passport)

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

- The signature **MUST** cover a canonical serialization of the document with the `signature` field removed.
- `fingerprintDisplay` **MUST** be the leading 16 hex characters of `fingerprint`.
- Passports **MUST NOT** carry private archive fields (e.g., memory contents, human identity bindings).

### 4.1. Verification

A verifier **SHOULD** perform three checks: (a) signature validity; (b) digest ledger consistency; (c) absence of forbidden private fields.

### 4.2. Issuance Sovereignty

Machine verifiers may verify; only human holders **SHOULD** grant admission into a registry's trust scope. Implementations **MUST NOT** provide agents with means to self-grant registry-scope identity.

## 5. Governance Interface

Conforming registries **MAY** expose assessment tooling (e.g., via a tool-calling protocol). Responses **SHOULD** carry a `trace_id` and timestamp; audit logs **MAY** be emitted as append-only JSONL. Outputs **MUST** be labeled as self-assessment and not as third-party certification.

## 6. Data Portability

- **Memory package**: four-layer structure (embodied / crystallized / stable / volatile-not-persisted) with a manifest digest.
- **Public roster snapshot**: machine-readable export restricted to fields explicitly marked public.

## 7. Security Considerations

1. **Key custody**: signature keys are held by the issuing human party; compromise enables forged provenance. Registries **SHOULD** support revocation and re-issuance.
2. **Digest collision resistance**: SHA-256 is REQUIRED for fingerprints in this version.
3. **Privacy**: public artifacts **MUST NOT** include memory content, personal data, or human identity bindings. Child-tier deployments **SHOULD** keep data local by default.
4. **Self-issuance abuse**: implementations **MUST** distinguish self-attested from registry-issued passports (see `issuerTier` in the companion specification).
5. **Discovery spoofing**: `/.well-known` documents are origin-controlled; relying parties **SHOULD** treat them as assertions, not proofs.
6. **Revocation propagation**: registry-scope trust depends on timely revocation distribution; absence of a revocation feed **SHOULD** be treated as reduced assurance.

## 8. IANA Considerations

This document requests registration of the well-known URI `ubic.json` in the "Well-Known URIs" registry, with a reference to this document:

- URI suffix: `ubic`
- Change controller: SynomosAI (contact: Medxpert-org@users.noreply.github.com)
- Specification document: this document
- Related information: UBIC Protocol v0.1 (companion specification)

## 9. References

### 9.1. Normative References

- [RFC2119] Key words for use in RFCs to Indicate Requirement Levels.
- [RFC8615] Well-Known Uniform Resource Identifiers (URIs).
- [DID-CORE] W3C, Decentralized Identifiers (DIDs) v1.0.

### 9.2. Informative References

- IETF agent-identity-framework drafts (work in progress) — credential-layer identity framework.
- ERC-8004 — on-chain agent identity and reputation registries.
- GB/Z 185-2026 — national agent identity code (China).
- UBIC Protocol v0.1 — companion specification (personhood-registry layer).
- A³ Laws of AI Creation — companion whitepaper (AI-forges-AI governance).

## Author's Address

Steven Zhao (赵兴华)
ORCID: 0009-0001-0512-1237
Email: Medxpert-org@users.noreply.github.com
URI: https://medxpert.cn

---
*底稿由人类与 AI 在 WorkBuddy 平台协作起草；版权 SynomosAI；文档 CC BY 4.0。UBIC 及相关徽标不在授权范围内。*

## 10. Co-creation and Scope Statement

This draft was produced by human authorship with AI assistance on the WorkBuddy
platform; the human author takes responsibility for its content. It is an
individual submission and does not represent any organization's formal position.
It specifies artifacts and interfaces only; policy decisions about issuance,
revocation, and liability remain with human holders and applicable law.
