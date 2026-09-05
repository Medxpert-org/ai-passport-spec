/**
 * ubicmem.js — UBIC-Mem 导出 + Merkle 存证（小程序/H5 端同构实现）v0.1
 * 与主线工具算法逐一对应：
 *   - 指纹：ubic_mem_export.py fp_of_dir（GNU sha256sum 口径："{sha256} *./{rel}\n" 全量行合成）
 *   - 存证：ubic_merkle.py（叶子按路径排序，奇数补末叶，sha256(hexA+hexB)）
 * 环境兼容：纯 JS SHA-256（不依赖 WebCrypto/TextEncoder），微信小程序 / 浏览器 / Node 通用。
 * 用法（Node）：const U = require('./ubicmem.js');
 * 用法（浏览器/小程序）：<script src="ubicmem.js"> 后全局 U；或直接引入该文件。
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.UBICMem = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- 纯 JS SHA-256 ---------- */
  var K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  function sha256(msgBytes) {
    var l = msgBytes.length;
    var totalLen = ((l + 9 + 63) >> 6) << 6;
    var buf = new Uint8Array(totalLen);
    buf.set(msgBytes);
    buf[l] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(totalLen - 8, Math.floor(l / 536870912));
    dv.setUint32(totalLen - 4, (l << 3) >>> 0);
    var H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    var w = new Uint32Array(64);
    for (var off = 0; off < totalLen; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var x = w[i - 15], y = w[i - 2];
        var s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
        var s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var out = new Uint8Array(32), odv = new DataView(out.buffer);
    for (i = 0; i < 8; i++) odv.setUint32(i * 4, H[i]);
    return out;
  }

  function utf8Encode(str) {
    var out = [], i, c;
    for (i = 0; i < str.length; i++) {
      c = str.codePointAt(i);
      if (c > 0xffff) i++;
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return new Uint8Array(out);
  }

  function hexOf(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += (bytes[i] >>> 4).toString(16) + (bytes[i] & 15).toString(16);
    return s;
  }

  function sha256HexOfBytes(b) { return hexOf(sha256(b)); }
  function sha256HexOfStr(s) { return hexOf(sha256(utf8Encode(s))); }

  /* ---------- UBIC-Mem 导出（对齐 ubic_mem_export.py v0.1） ---------- */

  // 文件项：{ path: 'SOUL.md' 或 'logs/2026-09-05.md', text: '...' }
  function textFile(path, text) { return { path: path, bytes: utf8Encode(text), text: text }; }

  // fp_of_dir 同构：行 = "{sha256} *./{rel}"，按路径排序后逐行拼接（行尾 \n）整体 sha256
  // 排序口径（v0.2 修订）：**原始字节序（大小写敏感）**，与 buildLeaves 统一。
  // 旧版用 toLowerCase 迁就 Windows pathlib 的 normcase，导致 Linux/Mac 与 JS 结果不一致；
  // 统一为原始序后跨平台、跨语言（Python/JS）结果稳定。路径含 ./ 前缀。
  function fingerprintOfFiles(files) {
    var sorted = files.slice().sort(function (a, b) {
      return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
    });
    var lines = '';
    for (var i = 0; i < sorted.length; i++) {
      var rel = sorted[i].path.replace(/^\.\//, '');
      lines += sha256HexOfBytes(sorted[i].bytes) + ' *./' + rel + '\n';
    }
    return sha256HexOfStr(lines);
  }

  // 成长记忆包：四层模型（Embodied=SOUL / Crystallized=MEMORY / Stable=logs / Volatile 不持久化）
  function buildGrowthBundle(opts) {
    var files = [
      textFile('SOUL.md', opts.soulText),
      textFile('MEMORY.md', opts.memoryText)
    ];
    (opts.dailyLogs || []).forEach(function (lg) {
      files.push(textFile('logs/' + lg.date + '.md', lg.text));
    });
    var fp = fingerprintOfFiles(files);
    var manifest = {
      schema: 'ubic-mem/v0.1',
      owner: opts.companionId,
      profile: 'companion-kid/v0',
      created_utc: opts.createdUtc || new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      layers: { embodied: 'SOUL.md', crystallized: 'MEMORY.md', stable: 'logs/', volatile: '不持久化' },
      files: files.slice().sort(function (a, b) {
        return a.path.toLowerCase() < b.path.toLowerCase() ? -1 : 1;
      }).map(function (f) { return './' + f.path; }),
      fingerprint: fp,
      fingerprint_algo: 'SHA-256（GNU sha256sum 规范口径，全量文件合成）',
      privacy: '儿童学习数据包：由监护人（家长）持有并加密导出，永不作为公开文件传播（规范 §3.2/§11.3 儿童档）',
      issuer: 'SynomosAI · UBIC 圈层'
    };
    return { files: files, manifest: manifest };
  }

  /* ---------- Merkle 存证（对齐 ubic_merkle.py v0.1） ---------- */

  // 叶子：{path:'./xxx', sha256}，按路径字节序排序；奇数层补末叶；父 = sha256(hexA+hexB)
  function buildLeaves(files) {
    var leaves = files.map(function (f) {
      return { path: './' + f.path.replace(/^\.\//, ''), sha256: sha256HexOfBytes(f.bytes) };
    });
    leaves.sort(function (a, b) { return a.path < b.path ? -1 : a.path > b.path ? 1 : 0; });
    return leaves;
  }

  function merkleRootFromLeaves(leafHexArray) {
    if (!leafHexArray.length) return '';
    var layer = leafHexArray.slice();
    while (layer.length > 1) {
      if (layer.length % 2) layer.push(layer[layer.length - 1]); // pad
      var next = [];
      for (var i = 0; i < layer.length; i += 2) {
        next.push(sha256HexOfStr(layer[i] + layer[i + 1]));
      }
      layer = next;
    }
    return layer[0];
  }

  function buildAnchor(files) {
    var leaves = buildLeaves(files);
    var root = merkleRootFromLeaves(leaves.map(function (l) { return l.sha256; }));
    return {
      schema: 'ubic-merkle/v0.1',
      root: root,
      leaf_count: leaves.length,
      generated_utc: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
      note: 'root 供锚定/存证；leaves 供单文件验真（proof=兄弟路径重算）',
      leaves: leaves
    };
  }

  /* ---------- 校验（防篡改演示与生产共用） ---------- */
  // 输入：{files, manifest, anchor}；输出：{ok, problems:[]}
  function verifyGrowthBundle(bundle) {
    var problems = [];
    var leafMap = {};
    (bundle.anchor && bundle.anchor.leaves || []).forEach(function (l) { leafMap[l.path] = l.sha256; });

    bundle.files.forEach(function (f) {
      var rel = './' + f.path.replace(/^\.\//, '');
      var actual = sha256HexOfBytes(f.bytes);
      if (leafMap[rel] && leafMap[rel] !== actual) {
        problems.push('文件被篡改：' + rel + '（存证 sha256 不匹配）');
      }
    });

    var fpNow = fingerprintOfFiles(bundle.files);
    if (bundle.manifest && fpNow !== bundle.manifest.fingerprint) {
      problems.push('记忆包指纹不匹配（manifest.fingerprint 与实际内容不一致）');
    }

    if (bundle.anchor) {
      var rootNow = merkleRootFromLeaves(bundle.anchor.leaves.map(function (l) { return l.sha256; }));
      if (rootNow !== bundle.anchor.root) {
        problems.push('Merkle 根不匹配（leaves 与 root 不一致）');
      }
    }
    return { ok: problems.length === 0, problems: problems };
  }

  /* ---------- 导出 ---------- */
  return {
    sha256HexOfBytes: sha256HexOfBytes,
    sha256HexOfStr: sha256HexOfStr,
    utf8Encode: utf8Encode,
    textFile: textFile,
    fingerprintOfFiles: fingerprintOfFiles,
    buildGrowthBundle: buildGrowthBundle,
    buildLeaves: buildLeaves,
    merkleRootFromLeaves: merkleRootFromLeaves,
    buildAnchor: buildAnchor,
    verifyGrowthBundle: verifyGrowthBundle
  };
});
