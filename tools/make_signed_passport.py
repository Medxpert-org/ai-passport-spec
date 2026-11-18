#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""make_signed_passport.py —— 生成一份带 Ed25519 detached 签名的最小护照，用于演示验签。

它不是护照生成器（那是 ai-passport-spec 的职责），只产出"能被验签通过"的样本：
  passport_signed.json   +  keys_demo.json（kid -> 公钥 hex）
"""
import hashlib
import json
import os
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
DEPS = pathlib.Path(os.environ.get("XVERIFY_DIR") or HERE)
if not (DEPS / "lgd_ed25519.py").exists():
    raise SystemExit(f"未检出 lgd-xverify（{DEPS}）：签名能力来自该仓，本仓不重复实现密码学")
sys.path.insert(0, str(DEPS))
import lgd_ed25519 as ed        # noqa: E402
import lgd_xverify as xv       # noqa: E402

kid = "demo-key-1"
secret = hashlib.sha256(b"ubic-demo-seed").digest()
pub = ed.public_key(secret)

doc = {
    "spec": "ubic-passport/0.1",
    "agent": {"id": "AGNT-demo-0001", "name": "Demo Agent", "operator": "MedXpert-org"},
    "capabilities": [{"id": "regdoc.read", "scope": "read-only"}],
    "issued_at": "2026-11-18T00:00:00Z",
    "expires_at": "2027-11-18T00:00:00Z",
}

msg = xv.canonical(doc)
doc["detached_signature"] = {
    "kid": kid,
    "alg": "Ed25519",
    "value_hex": ed.sign(secret, msg).hex(),
}

OUT = pathlib.Path.cwd()
(OUT / "passport_signed.json").write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
(OUT / "keys_demo.json").write_text(json.dumps({kid: pub.hex()}, indent=2), encoding="utf-8")
print("wrote passport_signed.json / keys_demo.json; pub=" + pub.hex()[:16] + "…")
