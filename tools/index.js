/**
 * ubic-protocol-js — 统一入口
 *   const UBIC = require('ubic-protocol-js');
 *   UBIC.passport.issue(...)   // 身份：签发 / 验签 / 发现文档
 *   UBIC.mem.exportBundle(...)  // 记忆：导出 / 校验（UBIC-Mem 四层模型）
 *
 * 零依赖、纯 JS SHA-256/HMAC，Node / 浏览器 / 微信小程序同构。
 * 算法与 Python 参考实现（tools/ubic_gateway.py、ubic_mem_export.py）逐一对应，
 * 并通过 test_ubicmem_crosscheck.js 与跨语言护照互验测试。
 */
'use strict';

var mem = require('./ubicmem.js');
var passport = require('./ubic-passport.js');

module.exports = {
  mem: mem,
  passport: passport,
  version: '0.1.0',
  schema: {
    passport: passport.SCHEMA,          // ubic/ai-passport/v1
    discovery: 'ubic/discovery/v1',
    memory: 'ubic-mem/v0.1'
  }
};
