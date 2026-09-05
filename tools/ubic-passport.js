/**
 * ubic-passport.js — UBIC Protocol 身份面（Identity）JS 同构实现 v0.1
 * 与 Python 参考网关 tools/ubic_gateway.py 算法逐一对应：
 *   - 规范字节：去 signature 字段后，键名排序、紧凑分隔（"," / ":"）、UTF-8（非 ASCII 不转义）
 *   - 签名：HMAC-SHA256（v0.1 轻量模式；v0.2 起支持 Ed25519）
 *   - 验伪三查：签名 → 指纹对账（display 必须是 fingerprint 前 16 位）→ 私有字段隔离
 * 环境兼容：纯 JS SHA-256/HMAC（不依赖 Node crypto / WebCrypto），
 *           微信小程序 / 浏览器 / Node 通用（与 ubicmem.js 同构）。
 *
 * 用法（Node）：const P = require('./ubic-passport.js');
 * 用法（小程序/浏览器）：<script src="ubicmem.js"></script><script src="ubic-passport.js"></script> 后全局 UBICPassport
 */
(function (root, factory) {
  var U = (typeof module !== 'undefined' && module.exports) ? require('./ubicmem.js') : root.UBICMem;
  var api = factory(U);
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { root.UBICPassport = api; }
})(typeof self !== 'undefined' ? self : this, function (U) {
  if (!U || !U.sha256HexOfBytes) throw new Error('ubic-passport.js 需要 ubicmem.js 提供 sha256HexOfBytes');

  var SCHEMA = 'ubic/ai-passport/v1';
  var PROTOCOL_VERSION = '0.1';

  /** UTF-8 编码（纯 JS，兼容小程序，不依赖 TextEncoder） */
  function utf8Bytes(str) {
    var out = [], i, c;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      else if (c < 0xd800 || c >= 0xe000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      else { // 代理对
        i++; var c2 = str.charCodeAt(i);
        var cp = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
        out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
      }
    }
    return out;
  }

  /** HMAC-SHA256，返回 hex（纯 JS，与 Python hmac.new(...).hexdigest() 一致） */
  function hmacSha256Hex(secretStr, msgStr) {
    var BLOCK = 64;
    var key = utf8Bytes(secretStr);
    if (key.length > BLOCK) key = hexToBytes(U.sha256HexOfBytes(key));
    while (key.length < BLOCK) key.push(0);
    var ipad = [], opad = [], i;
    for (i = 0; i < BLOCK; i++) { ipad.push(key[i] ^ 0x36); opad.push(key[i] ^ 0x5c); }
    var inner = ipad.concat(utf8Bytes(msgStr));
    var innerHash = hexToBytes(U.sha256HexOfBytes(inner));
    var outer = opad.concat(innerHash);
    return U.sha256HexOfBytes(outer);
  }

  function hexToBytes(hex) {
    var out = [];
    for (var i = 0; i < hex.length; i += 2) out.push(parseInt(hex.substr(i, 2), 16));
    return out;
  }

  /** 规范序列化：递归排序键 + 紧凑分隔（与 Python json.dumps(sort_keys, separators=(',',':'), ensure_ascii=False) 对齐） */
  function canonicalJSON(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value === undefined ? null : value);
    if (Array.isArray(value)) return '[' + value.map(canonicalJSON).join(',') + ']';
    var keys = Object.keys(value).sort();
    return '{' + keys.map(function (k) { return JSON.stringify(k) + ':' + canonicalJSON(value[k]); }).join(',') + '}';
  }

  function signDoc(doc, secret) {
    var d = {};
    Object.keys(doc).forEach(function (k) { if (k !== 'signature') d[k] = doc[k]; });
    return hmacSha256Hex(secret, canonicalJSON(d));
  }

  function nowISO() { return new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00'); }

  /** 签发（对应 gateway.py issue） */
  function issue(opts) {
    opts = opts || {};
    var fp = opts.fingerprint || '';
    var fpDisplay = opts.fingerprintDisplay || (fp ? fp.slice(0, 16) : U.sha256HexOfStr(opts.id || '').slice(0, 16));
    if (fp && fp.indexOf(fpDisplay) !== 0) {
      throw new Error('fingerprint_display 必须是 fingerprint 的前 16 位（对账不一致，拒绝签发）');
    }
    var doc = {
      schema: SCHEMA,
      passportId: opts.id,
      alias: opts.alias,
      issuer: opts.issuer || 'SynomosAI',
      issuedAt: opts.issuedAt || nowISO(),
      fingerprint: fp || (fpDisplay + new Array(49).join('0')),
      fingerprintDisplay: fpDisplay,
      fingerprintAlgo: 'SHA-256',
      didRef: opts.didRef || null,
      signature: null
    };
    doc.signature = { algo: 'HMAC-SHA256', keyRef: opts.keyId || 'default', value: signDoc(doc, opts.keySecret) };
    return doc;
  }

  /** 验签（对应 gateway.py verify） */
  function verify(doc, secret) {
    var sig = doc.signature || {};
    var okSig = sig.algo === 'HMAC-SHA256' && signDoc(doc, secret) === sig.value;
    var okFp = typeof doc.fingerprint === 'string' && doc.fingerprint.indexOf(doc.fingerprintDisplay) === 0;
    var forbidden = ['memory', 'L2', 'private', 'human_binding'];
    var okPrivacy = Object.keys(doc).every(function (k) { return forbidden.indexOf(k) === -1; });
    return {
      signatureOk: okSig,
      fingerprintOk: okFp,
      privacyOk: okPrivacy,
      ok: okSig && okFp && okPrivacy,
      verdict: (okSig && okFp && okPrivacy) ? '验伪三查（机器面）: 通过' : '验伪三查（机器面）: 未通过'
    };
  }

  /** 发现文档（对应 gateway.py wellknown） */
  function wellknown(opts) {
    opts = opts || {};
    return {
      schema: 'ubic/discovery/v1',
      protocolVersion: PROTOCOL_VERSION,
      name: opts.name,
      issuer: opts.issuer || 'SynomosAI',
      publicKeyRef: opts.keyId || 'default',
      endpoints: opts.endpoints || {},
      anchors: { merkleRoot: opts.merkleRoot || '', batchId: opts.batch || '' },
      note: 'Discovery document declares UBIC Protocol conformance; it does not grant identity.'
    };
  }

  return {
    SCHEMA: SCHEMA,
    PROTOCOL_VERSION: PROTOCOL_VERSION,
    utf8Bytes: utf8Bytes,
    hmacSha256Hex: hmacSha256Hex,
    canonicalJSON: canonicalJSON,
    issue: issue,
    verify: verify,
    wellknown: wellknown
  };
});
