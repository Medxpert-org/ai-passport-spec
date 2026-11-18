#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verify_passport.py —— 用 lgd-xverify 的验签与三值语义校验一份 AI 护照。

分工（本脚本存在的唯一理由）：
  ai-passport-spec 定义护照"应该包含什么"（九层字段、生成方式）；
  lgd-xverify    判定"这份记录是否完整、签名是否有效、授权是否仍有效"。
两者此前各跑各的，本脚本把护照送进 xverify 的验签路径，输出 PASS / FAIL / UNKNOWN。

边界：护照不是 xverify 支持的三种信封（1F916 / TRACE / ARIA），因此**不做信封级规范化裁决**，
只做两件事——规范形式的哈希（供对账）与 detached 签名的实际验签。

依赖：lgd-xverify 的 lgd_ed25519.py / lgd_xverify.py（纯标准库）。
未检出时**报错退出**，不降级为通过——与两仓共同的 fail-closed 约定一致。

用法：
  python verify_passport.py passport.json --xverify-dir ../lgd-xverify [--keys keys.json]
退出码：0 = PASS；1 = FAIL；3 = UNKNOWN（缺签名/无公钥/无法判定）。
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import sys


def load(mod_dir: pathlib.Path):
    if not (mod_dir / "lgd_xverify.py").exists():
        sys.exit(f"未检出 lgd-xverify（{mod_dir}）；拒绝在无验签能力时给出结论")
    sys.path.insert(0, str(mod_dir))
    import lgd_xverify  # noqa: E402
    return lgd_xverify


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("passport")
    ap.add_argument("--xverify-dir", required=True)
    ap.add_argument("--keys", help="公钥集 JSON（key_id -> 公钥）")
    args = ap.parse_args(argv)

    xv = load(pathlib.Path(args.xverify_dir).resolve())
    doc = json.loads(pathlib.Path(args.passport).read_text(encoding="utf-8"))
    if args.keys:
        kp = pathlib.Path(args.keys)
        if not kp.exists():
            sys.exit(f"公钥集不存在：{kp}；无公钥时只能给 UNKNOWN，不猜通过")
        keys = json.loads(kp.read_text(encoding="utf-8"))
    else:
        keys = {}

    # 字段级门槛：缺 agent 或签名段直接 UNKNOWN，不进验签
    missing = [f for f in ("agent", "detached_signature") if f not in doc]
    if missing:
        print(json.dumps({"verdict": "UNKNOWN", "why": f"护照缺字段：{missing}",
                          "note": "字段不全无法验签；不判通过"}, ensure_ascii=False, indent=2))
        return 3

    canon = xv.canonical(doc)
    digest = hashlib.sha256(canon).hexdigest()

    present, verified, reason = xv.check_detached_signature(doc, keys)
    if not present:
        verdict, why = "UNKNOWN", "无 detached 签名段，无法核验来源"
    elif verified:
        verdict, why = "PASS", reason
    elif reason.startswith("no public key") or reason.startswith("unsupported signature algorithm"):
        # 缺公钥/算法不支持 = 无法判定，不是签名无效——不许把它当失败，也不许当通过
        verdict, why = "UNKNOWN", reason
    elif reason.startswith("signature could not be evaluated"):
        verdict, why = "UNKNOWN", reason
    else:
        verdict, why = "FAIL", reason

    print(json.dumps({
        "verdict": verdict,
        "why": why,
        "canonical_sha256": digest,
        "scope": "仅核验记录完整性与签名有效性；不评价该护照所列能力是否被授权",
        "note": "护照非 1F916/TRACE/ARIA 信封，故不作信封级规范化裁决",
    }, ensure_ascii=False, indent=2))
    return {"PASS": 0, "FAIL": 1}.get(verdict, 3)


if __name__ == "__main__":
    sys.exit(main())
