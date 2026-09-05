/**
 * 01-passport.js — 护照签发与验证的最小示例
 * 运行：node examples/01-passport.js
 */
'use strict';
const UBIC = require('../index.js');

const SECRET = 'replace-with-your-own-secret';

// 1) 签发（谁都能签自己的 AI —— 这叫“自持户籍”）
const agent = UBIC.passport.issue({
  id: 'SP-example-00000001',
  alias: '我的第一个 AI',
  fingerprint: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  fingerprintDisplay: '9f86d081884c7d65',
  didRef: 'did:web:example.com:agents:001',
  keySecret: SECRET,
  keyId: 'my-key'
});

console.log('签发的护照：');
console.log(JSON.stringify(agent, null, 2));

// 2) 验证（任何人拿到护照都能验，不需要你的密钥以外的东西）
console.log('\n验证结果：', UBIC.passport.verify(agent, SECRET));

// 3) 指名比对：确认护照属于预期的 AI
console.log('passportId 匹配：', agent.passportId === 'SP-example-00000001');
console.log('指纹前 16 位对账：', agent.fingerprint.indexOf(agent.fingerprintDisplay) === 0);
