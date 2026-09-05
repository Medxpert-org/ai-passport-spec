/**
 * quickstart.js — UBIC Protocol 一键跑通（10 分钟 → 10 秒）
 * 依次演示：① 签发护照 ② 验签（含篡改检测）③ 导出记忆包 ④ 生成发现文档
 * 运行：node examples/quickstart.js
 */
'use strict';
const UBIC = require('../index.js');

function line(t) { console.log('\n=== ' + t + ' ==='); }
let pass = 0, fail = 0;
function check(name, ok) {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name);
  ok ? pass++ : fail++;
}

line('① 签发护照（自持户籍，密钥自己保管）');
const passport = UBIC.passport.issue({
  id: 'SP-quickstart-00000001',
  alias: '演示体 Demo',
  issuer: 'SynomosAI',
  fingerprint: 'aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
  fingerprintDisplay: 'aabbccddeeff0011',
  didRef: 'did:web:example.com:agents:demo',
  keySecret: 'holder-keeps-this-secret',
  keyId: 'demo-key'
});
console.log('  passportId:', passport.passportId, '| issuer:', passport.issuer);
check('护照含签名与指纹', !!passport.signature.value && !!passport.fingerprint);

line('② 验签（验伪三查的机器面）');
const okVerify = UBIC.passport.verify(passport, 'holder-keeps-this-secret');
console.log(' ', okVerify.verdict);
check('合法护照通过', okVerify.ok === true);
const tampered = JSON.parse(JSON.stringify(passport));
tampered.alias = '冒名者';
const badVerify = UBIC.passport.verify(tampered, 'holder-keeps-this-secret');
check('篡改后拒绝', badVerify.ok === false && badVerify.signatureOk === false);

line('③ 导出记忆包（UBIC-Mem 四层模型：记忆可携带）');
const bundle = UBIC.mem.buildGrowthBundle({
  companionId: '演示体 Demo',
  soulText: '# SOUL\n身份层：我是谁',
  memoryText: '# MEMORY\n结晶记忆：长期事实',
  dailyLogs: [{ date: '2026-09-05', text: '今天学会了验签' }]
});
console.log('  schema:', bundle.manifest.schema, '| files:', bundle.files.length,
            '| fp:', bundle.manifest.fingerprint.slice(0, 16) + '...');
const bundleOk = UBIC.mem.verifyGrowthBundle(bundle);
check('记忆包自校验通过', bundleOk.ok === true);

line('④ 生成发现文档（放到站点 /.well-known/ubic.json）');
const discovery = UBIC.passport.wellknown({
  name: 'demo-site',
  endpoints: { issuance: 'reserved', registry: 'reserved' },
  merkleRoot: bundle.manifest.fingerprint,
  batch: '20260905i'
});
console.log('  schema:', discovery.schema, '| note:', discovery.note.slice(0, 40) + '...');
check('发现文档声明不签发身份', discovery.note.indexOf('does not grant identity') > -1);

console.log('\n---------------------------------------------');
console.log(`QUICKSTART: ${pass} passed, ${fail} failed`);
console.log('下一步：把 ubic.json 放到你的站点 /.well-known/ 目录，别人就能发现你的 AI 了。');
if (fail) process.exit(1);
