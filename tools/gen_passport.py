# -*- coding: utf-8 -*-
"""gen_passport.py — 计算专家包 SHA-256 指纹，并生成护照链下元数据（tokenURI 内容雏形）。

用法:
  python gen_passport.py <package-dir> --id SP-<slug>-<8hex> --alias <花名> [--out meta.json]

设计对齐《AI 护照规范》§3.2/§11.6：
  - 指纹 = 目录全量文件排序后 sha256sum 汇总（文件一变指纹就变）
  - 元数据只含锚点（Passport ID/花名/指纹/签发方/时间戳/DID 引用），
    绝不包含九层档案明细（L2 记忆尤其禁止入链/入公开元数据）
"""
import argparse, hashlib, json, os, pathlib, sys, datetime

def dir_fingerprint(pkg: pathlib.Path) -> str:
    """精确复刻《AI 护照规范》§3.2 的 bash 命令语义：
       find . -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum

    实现要点（2026-09-04 实测对齐）：
      1) 全量文件（含 . 开头隐藏文件/目录）——find 默认包含，rglob("*") 会漏掉隐藏文件；
      2) 路径按 './...' 字节序排序——与 sort -z（C locale）一致（UTF-8 保序）；
      3) 每行 '<hex> *<path>\\n'——GNU coreutils sha256sum 默认对二进制内容输出
         单星号前缀（不是双空格），逐行拼起再整体 sha256，行尾 \\n 必须保留。

    注意：本函数对目录内全部文件计算（含平台安装/会话元数据）。若要对齐
    "发布物内容"（排除 .codebuddy-plugin/、.created-by-session、settings.json
    等平台物），请先把干净作品文件集复制到独立目录再调用。
    """
    root = pkg.resolve()
    paths = []
    for dirpath, _dirnames, filenames in os.walk(root):  # os.walk 不跳过隐藏目录
        for fn in filenames:
            full = pathlib.Path(dirpath) / fn
            rel = full.relative_to(root).as_posix()
            paths.append("./" + rel)
    paths.sort()

    lines = []
    for rel in paths:
        f = root / rel[2:]
        with open(f, "rb") as fh:
            h = hashlib.sha256()
            for chunk in iter(lambda: fh.read(65536), b""):
                h.update(chunk)
        lines.append(f"{h.hexdigest()} *{rel}")  # GNU sha256sum 二进制标记：单星号
    agg = hashlib.sha256()
    for ln in lines:
        agg.update(ln.encode("utf-8"))
        agg.update(b"\n")
    return agg.hexdigest()

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("pkg", help="专家包目录（计算指纹的对象）")
    ap.add_argument("--id", required=True, help="Passport ID，如 SP-shigongsheng-3f9e2801")
    ap.add_argument("--alias", required=True, help="花名")
    ap.add_argument("--issuer", default="SynomosAI", help="签发方品牌马甲")
    ap.add_argument("--out", default=None, help="输出 metadata JSON 路径（默认打印到 stdout）")
    args = ap.parse_args()

    pkg = pathlib.Path(args.pkg)
    if not pkg.is_dir():
        print(f"错误: 不是目录 {pkg}", file=sys.stderr)
        return 2

    full = dir_fingerprint(pkg)
    meta = {
        "schema": "ubic/ai-passport/v1",
        "passportId": args.id,
        "alias": args.alias,
        "issuer": args.issuer,
        "issuedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "fingerprint": full,
        "fingerprintDisplay": full[:16],
        "fingerprintAlgo": "SHA-256",
        "didRef": f"did:web:ubic.example:agents:{args.alias}",  # 占位，正式域名定稿后替换
        "archiveRef": None,  # 链下护照档案地址（加密），不随公开元数据发布
        "note": "Public metadata carries anchors only. The nine-layer archive never goes on-chain."
    }

    out_txt = json.dumps(meta, ensure_ascii=False, indent=2)
    if args.out:
        pathlib.Path(args.out).write_text(out_txt + "\n", encoding="utf-8")
        print(f"OK -> {args.out}")
        print(f"指纹(16) {meta['fingerprintDisplay']}  全文 {meta['fingerprint']}")
    else:
        print(out_txt)
    return 0

if __name__ == "__main__":
    sys.exit(main())
