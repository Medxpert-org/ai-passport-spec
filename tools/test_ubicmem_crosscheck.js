// 交叉验证（JS 侧）：读取同一 sample 目录，用 ubicmem.js 计算 fp 与 Merkle root，
// 与 Python 主线输出的 crosscheck_expected.json 比对；另跑 SHA-256 标准向量自检。
const fs = require('fs');
const path = require('path');
const U = require('./ubicmem.js');

// SHA-256 标准向量自检
const v1 = U.sha256HexOfStr('abc');
const v2 = U.sha256HexOfStr('');
const v3 = U.sha256HexOfStr('中文测试123');
const vecOk = v1 === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
           && v2 === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
console.log('[selftest] sha256 vectors:', vecOk ? 'PASS' : 'FAIL ' + v1 + ' ' + v2);

// 读取 sample 目录（复刻 build_leaves 的文件枚举口径）
const SAMPLE = path.join(__dirname, '.crosscheck', 'sample');
function walk(dir, base) {
  let out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p, base));
    else {
      const rel = './' + path.relative(base, p).split(path.sep).join('/');
      out.push({ path: rel, bytes: new Uint8Array(fs.readFileSync(p)) });
    }
  }
  return out;
}
const files = walk(SAMPLE, SAMPLE);

// fp_of_dir 同构：JS 端需 './xxx' 路径格式
const fp = U.fingerprintOfFiles(files.map(f => ({ path: f.path, bytes: f.bytes })));
const root = U.merkleRootFromLeaves(
  U.buildLeaves(files.map(f => ({ path: f.path, bytes: f.bytes }))).map(l => l.sha256));

// 与 Python 主线比对
const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '.crosscheck', 'crosscheck_expected.json'), 'utf8'));
const fpOk = fp === expected.fingerprint;
const rootOk = root === expected.root;
console.log('[fp]   JS:', fp);
console.log('[fp]   PY:', expected.fingerprint, fpOk ? '→ PASS' : '→ FAIL');
console.log('[root] JS:', root);
console.log('[root] PY:', expected.root, rootOk ? '→ PASS' : '→ FAIL');

if (!(vecOk && fpOk && rootOk)) { console.log('CROSSCHECK: FAIL'); process.exit(1); }
console.log('CROSSCHECK: ALL PASS ✓');
