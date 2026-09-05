#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ubic_gateway.py — UBIC Protocol v0.1 参考网关（纯 stdlib，零依赖）
====================================================================
三个子命令（UBIC Protocol 四面中的 Identity + Discovery 面）：

  issue      生成 agent.json（ubic/ai-passport/v1）+ HMAC-SHA256 轻量签名
  verify     验签 + 指纹对账（验伪三查的机器面：签名→登记字段→指纹）
  wellknown  生成 /.well-known/ubic.json 发现文档

签名模式：v0.1 参考实现 = HMAC-SHA256（key 由持有人保管，绝不入公开文档）；
         v0.2 计划 = Ed25519 标准模式（需 cryptography 库）。
红线：本工具只做机器校验（verify）；签发授权（grant）永远属于人类持有人（A³ Law II）。

用法：
  python ubic_gateway.py issue --id SP-demo-00000001 --alias 示例体 --issuer SynomosAI \
      --fingerprint-display 09cb41a3419f2b0a --key-secret <secret> [--out agent.json]
  python ubic_gateway.py verify --file agent.json --key-secret <secret>
  pythonubic_gateway.py wellknown --name 站点名 --key-id demo-key [--out ubic.json]
"""
import argparse, hashlib, hmac, json, sys, datetime

SCHEMA = "ubic/ai-passport/v1"
PROTOCOL_VERSION = "0.1"

def now_iso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")

def canonical(doc: dict) -> bytes:
    """签名覆盖的规范字节：去 signature 字段后 sort-keys 紧凑 JSON。"""
    d = {k: v for k, v in doc.items() if k != "signature"}
    return json.dumps(d, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")

def sign(doc: dict, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), canonical(doc), hashlib.sha256).hexdigest()

def cmd_issue(a):
    fp_display = a.fingerprint_display or hashlib.sha256(a.id.encode()).hexdigest()[:16]
    if a.fingerprint and not a.fingerprint.startswith(fp_display):
        print("❌ fingerprint_display 必须是 fingerprint 的前 16 位（对账不一致，拒绝签发）"); return 1
    doc = {
        "schema": SCHEMA,
        "passportId": a.id,
        "alias": a.alias,
        "issuer": a.issuer,
        "issuedAt": now_iso(),
        "fingerprint": a.fingerprint or (fp_display + "0" * 48),
        "fingerprintDisplay": fp_display,
        "fingerprintAlgo": "SHA-256",
        "didRef": a.did_ref,
        "signature": None,
    }
    doc["signature"] = {"algo": "HMAC-SHA256", "keyRef": a.key_id or "default", "value": sign(doc, a.key_secret)}
    out = json.dumps(doc, ensure_ascii=False, indent=2) + "\n"
    if a.out:
        open(a.out, "w", encoding="utf-8").write(out)
        print(f"✅ agent.json -> {a.out}")
    else:
        print(out, end="")
    return 0

def cmd_verify(a):
    doc = json.load(open(a.file, encoding="utf-8"))
    sig = doc.get("signature") or {}
    if sig.get("algo") != "HMAC-SHA256":
        print("❌ 不支持的签名算法:", sig.get("algo")); return 1
    expect = hmac.new(a.key_secret.encode("utf-8"), canonical(doc), hashlib.sha256).hexdigest()
    ok_sig = hmac.compare_digest(expect, sig.get("value", ""))
    # 指纹对账：display 必须是 fingerprint 前 16 位
    ok_fp = doc.get("fingerprint", "").startswith(doc.get("fingerprintDisplay", "!"))
    # 字段完整性（锚不载私）：公开文档不得含九层档案明细
    forbidden = {"memory", "L2", "private", "human_binding"}
    ok_priv = not (forbidden & set(doc.keys()))
    print(f"签名: {'✅' if ok_sig else '❌'}  指纹对账: {'✅' if ok_fp else '❌'}  私有字段隔离: {'✅' if ok_priv else '❌'}")
    print("验伪三查（机器面）:", "通过" if (ok_sig and ok_fp and ok_priv) else "未通过")
    return 0 if (ok_sig and ok_fp and ok_priv) else 1

def cmd_wellknown(a):
    doc = {
        "schema": "ubic/discovery/v1",
        "protocolVersion": PROTOCOL_VERSION,
        "name": a.name,
        "issuer": a.issuer,
        "publicKeyRef": a.key_id,
        "endpoints": {},
        "anchors": {"merkleRoot": a.merkle_root or "", "batchId": a.batch or ""},
        "note": "Discovery document declares UBIC Protocol conformance; it does not grant identity.",
    }
    out = json.dumps(doc, ensure_ascii=False, indent=2) + "\n"
    if a.out:
        open(a.out, "w", encoding="utf-8").write(out)
        print(f"✅ ubic.json -> {a.out}")
    else:
        print(out, end="")
    return 0

def main():
    p = argparse.ArgumentParser(description="UBIC Protocol v0.1 reference gateway")
    sub = p.add_subparsers(dest="cmd", required=True)

    i = sub.add_parser("issue", help="签发 agent.json（HMAC-SHA256 轻量模式）")
    i.add_argument("--id", required=True, help="Passport ID，如 SP-demo-00000001")
    i.add_argument("--alias", required=True)
    i.add_argument("--issuer", default="SynomosAI")
    i.add_argument("--fingerprint", help="作品 SHA-256 全量（可选）")
    i.add_argument("--fingerprint-display", help="指纹前 16 位（可选，默认由 ID 派生演示值）")
    i.add_argument("--did-ref", default=None)
    i.add_argument("--key-secret", required=True, help="HMAC 密钥（持有人保管，勿入公开文档）")
    i.add_argument("--key-id", default="default")
    i.add_argument("--out", default=None)
    i.set_defaults(fn=cmd_issue)

    v = sub.add_parser("verify", help="验签 + 指纹对账")
    v.add_argument("--file", required=True)
    v.add_argument("--key-secret", required=True)
    v.set_defaults(fn=cmd_verify)

    w = sub.add_parser("wellknown", help="生成 /.well-known/ubic.json")
    w.add_argument("--name", required=True)
    w.add_argument("--issuer", default="SynomosAI")
    w.add_argument("--key-id", default="default")
    w.add_argument("--merkle-root", default="")
    w.add_argument("--batch", default="")
    w.add_argument("--out", default=None)
    w.set_defaults(fn=cmd_wellknown)

    a = p.parse_args()
    sys.exit(a.fn(a))

if __name__ == "__main__":
    main()
