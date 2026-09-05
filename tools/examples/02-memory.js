/**
 * 02-memory.js — UBIC-Mem 记忆包导出与校验（记忆可携带律的实现）
 * 四层模型：Embodied=SOUL / Crystallized=MEMORY / Stable=logs / Volatile 不持久化
 * 运行：node examples/02-memory.js
 */
'use strict';
const UBIC = require('../index.js');

const bundle = UBIC.mem.buildGrowthBundle({
  companionId: '示例 AI',
  soulText: '# SOUL\n- 名字：示例 AI\n- 性格：严谨、诚实\n',
  memoryText: '# MEMORY\n- 持有人偏好：中文交流\n- 长期事实：2026-09 建档\n',
  dailyLogs: [
    { date: '2026-09-05', text: '完成第一次验签\n' }
  ]
});

console.log('manifest：');
console.log(JSON.stringify(bundle.manifest, null, 2));

// 自校验：指纹 + Merkle 锚点
const result = UBIC.mem.verifyGrowthBundle(bundle);
console.log('\n校验：', result.ok ? 'OK（未被篡改）' : 'PROBLEM: ' + result.problems.join('; '));

// 迁移演示：换模型/换平台，记忆包带走，指纹不变
console.log('\n把整个 bundle 文件拷到新机器 → 在新机器运行 verifyGrowthBundle(bundle)');
console.log('指纹不变 = 记忆连续（“模型是租的脑子，护照才是这个人”）');
