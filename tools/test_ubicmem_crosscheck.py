#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""交叉验证（Python 侧）：读取 .crosscheck/sample，按主线口径计算指纹与 Merkle root，
写入 .crosscheck/crosscheck_expected.json，供 test_ubicmem_crosscheck.js 比对。

口径（与 ubicmem.js / ubic_mem_export.py / ubic_merkle.py 一致）：
  - 行 = "{sha256} *./{rel}\n"，按路径排序后逐行拼接，整体 sha256
  - Merkle：叶子按路径排序，奇数补末叶，父 = sha256(hexA + hexB)

用法: python test_ubicmem_crosscheck.py
"""
import hashlib
import json
import pathlib
import sys


def sha256_hex_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def walk(base: pathlib.Path):
    """按相对路径的**原始字节序**排序（不做大小写归一化）。
    注意：Windows 的 pathlib.Path 比较使用 normcase（小写化），
    与 JS 的 a.path < b.path（原始序）在混合大小写文件名下顺序不同，
    会导致 Merkle root 不一致——故此处显式用 as_posix() 字符串排序对齐 JS。"""
    out = []
    for p in sorted(base.rglob("*"), key=lambda x: x.relative_to(base).as_posix()):
        if p.is_file():
            rel = "./" + p.relative_to(base).as_posix()
            out.append({"path": rel, "bytes": p.read_bytes()})
    return out


def fingerprint_of_files(files) -> str:
    lines = "".join(f"{sha256_hex_bytes(f['bytes'])} *{f['path']}\n" for f in files)
    return hashlib.sha256(lines.encode("utf-8")).hexdigest()


def merkle_root(leaves):
    if not leaves:
        return ""
    layer = list(leaves)
    while len(layer) > 1:
        if len(layer) % 2:
            layer.append(layer[-1])
        layer = [hashlib.sha256((layer[i] + layer[i + 1]).encode()).hexdigest()
                 for i in range(0, len(layer), 2)]
    return layer[0]


def main():
    base = pathlib.Path(__file__).resolve().parent / ".crosscheck" / "sample"
    if not base.exists():
        print(f"缺少样例目录: {base}")
        return 1
    files = walk(base)
    fp = fingerprint_of_files(files)
    root = merkle_root([sha256_hex_bytes(f["bytes"]) for f in files])
    expected = {
        "fingerprint": fp,
        "merkleRoot": root,
        "root": root,  # JS 端读取的字段名
        "fileCount": len(files),
        "files": [f["path"] for f in files],
        "note": "Python 主线口径输出，供 JS 同构实现比对",
    }
    out = base.parent / "crosscheck_expected.json"
    out.write_text(json.dumps(expected, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[py] fingerprint: {fp}")
    print(f"[py] merkleRoot : {root}")
    print(f"[py] files      : {len(files)} -> {out.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
