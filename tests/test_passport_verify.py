#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""test_passport_verify.py —— 验签集成的四条语义。

依赖 lgd-xverify 的两个模块：从环境变量 XVERIFY_DIR 指向的目录导入；
未设置或不存在时**整组跳过**（skip 而不是 fail），避免在无该仓的环境里误报红。
"""
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
XV = os.environ.get("XVERIFY_DIR")
HAVE_XV = bool(XV) and (pathlib.Path(XV) / "lgd_xverify.py").exists()


def run(passport, keys=None):
    cmd = [sys.executable, str(TOOLS / "verify_passport.py"), str(passport), "--xverify-dir", XV]
    if keys:
        cmd += ["--keys", str(keys)]
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode, json.loads(p.stdout) if p.stdout.strip() else {}


@unittest.skipUnless(HAVE_XV, "未设置 XVERIFY_DIR，无法导入 lgd-xverify")
class PassportVerify(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.mkdtemp()
        subprocess.run([sys.executable, str(TOOLS / "make_signed_passport.py")],
                       cwd=cls.tmp, check=True, capture_output=True, text=True)
        cls.good = pathlib.Path(cls.tmp) / "passport_signed.json"
        cls.keys = pathlib.Path(cls.tmp) / "keys_demo.json"
        d = json.loads(cls.good.read_text(encoding="utf-8"))
        d["agent"]["operator"] = "Evil-org"
        cls.bad = pathlib.Path(cls.tmp) / "passport_tampered.json"
        cls.bad.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")

    def test_valid_signature_passes(self):
        code, out = run(self.good, self.keys)
        self.assertEqual((code, out["verdict"]), (0, "PASS"))

    def test_tamper_fails(self):
        code, out = run(self.bad, self.keys)
        self.assertEqual((code, out["verdict"]), (1, "FAIL"))

    def test_no_key_is_unknown_not_fail(self):
        code, out = run(self.good)
        self.assertEqual((code, out["verdict"]), (3, "UNKNOWN"))

    def test_missing_signature_is_unknown(self):
        p = pathlib.Path(self.tmp) / "nosig.json"
        p.write_text(json.dumps({"agent": {"id": "x"}}), encoding="utf-8")
        code, out = run(p, self.keys)
        self.assertEqual((code, out["verdict"]), (3, "UNKNOWN"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
