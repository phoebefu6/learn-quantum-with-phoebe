#!/usr/bin/env node
/* qs_canon.js - run the whole ladder in node from the SAME engine the pages load,
   print the canon tables, and dump every amplitude the numpy reference re-derives.
   Usage: node materials/qs_canon.js [out.json]                                   */
const path = require("path");
const fs = require("fs");
const QS = require(path.join(__dirname, "..", "assets", "qs-live.js"));

const out = { amplitudes: {}, tables: {} };
const f4 = v => (Math.round(v * 10000) / 10000).toFixed(4);

console.log("== self test ==");
const st = QS.selfTest();
st.results.forEach(r => console.log((r.ok ? "  ok   " : "  FAIL ") + r.name + "  [got " + r.got + "]"));
console.log("  all pass:", st.ok);
out.selfTest = st.ok;

/* 1. Grover success per iteration, n = 2..10, target = N-1 (every qubit one) */
console.log("\n== Grover success probability per iteration (target = all ones) ==");
const grover = [];
for (let n = 2; n <= 10; n++) {
  const N = 1 << n, target = N - 1;
  const o = QS.optimalK(n);
  const curve = QS.successCurve(n, target, o.kTheory + 3);
  grover.push({ n, N, kOpt: o.k, pOpt: o.p, kTheory: o.kTheory, gates: o.gates, curve: curve.p, gatesPer: curve.gates });
  const s = QS.grover(n, target, o.k);
  out.amplitudes["grover_n" + n + "_k" + o.k] = { n, target, k: o.k, re: Array.from(s.re), im: Array.from(s.im), gates: s.gates };
  console.log(`  n=${n} N=${N} kOpt=${o.k} (pi/4 sqrt N = ${(Math.PI / 4 * Math.sqrt(N)).toFixed(2)}) p=${o.p.toFixed(6)} gates=${o.gates}  curve: ${curve.p.slice(0, Math.min(curve.p.length, 8)).map(f4).join(" ")}${curve.p.length > 8 ? " ..." : ""}`);
}
out.tables.grover = grover;

/* 2. queries */
console.log("\n== queries: classical N/2 against quantum oracle calls ==");
const q = QS.queryTable(2, 10);
q.forEach(r => console.log(`  n=${r.n} N=${r.N} classical N/2=${r.classicalHalf} quantum k=${r.quantumK} p=${r.pSuccess.toFixed(4)} gates=${r.gates}`));
out.tables.queries = q;

/* 3. loading tax */
console.log("\n== loading tax (loadPerRow 1, queryCost log2 N) ==");
const lt = [];
for (const N of [1e3, 1e4, 1e5, 1e6, 1e7, 1.2e7]) {
  const r1 = QS.loadingTax({ N, R: 1 });
  const r100 = QS.loadingTax({ N, R: 100 });
  lt.push({ N, R1: r1, R100: r100 });
  console.log(`  N=${N} R=1: quantum=${r1.quantum.toFixed(0)} (load ${r1.quantumLoad}, search ${r1.quantumSearch.toFixed(0)}) brute=${r1.brute} indexed=${r1.indexed.toFixed(0)} winner=${r1.winner} crossBrute=${r1.crossBrute} crossIndexed=${r1.crossIndexed}`);
}
out.tables.loading = lt;

/* 4. noise ladder at n = 10, and the anti-lever across n at p = 0.005 */
const ps = [0, 0.001, 0.005, 0.01, 0.02];
console.log("\n== noise ladder, n = 10, at the ideal-optimal depth ==");
const nl10 = QS.noiseLadder(10, ps);
nl10.forEach(r => console.log(`  p=${r.p} k=${r.k} gates=${r.gates} pIdeal=${r.pIdeal.toFixed(6)} pNoisy=${r.pNoisy.toFixed(6)} bestK=${r.bestK} bestP=${r.bestP.toFixed(6)} uniform=${r.uniform.toFixed(6)}`));
out.tables.noise10 = nl10;
console.log("\n== anti-lever: more qubits under noise, p = 0.005 and 0.01 ==");
const anti = [];
for (let n = 2; n <= 10; n++) {
  const r = QS.noiseLadder(n, [0.005, 0.01]);
  anti.push({ n, p005: r[0], p01: r[1] });
  console.log(`  n=${n} gates=${r[0].gates} ideal=${r[0].pIdeal.toFixed(4)} p=0.005 -> ${r[0].pNoisy.toFixed(4)}  p=0.01 -> ${r[1].pNoisy.toFixed(4)}`);
}
out.tables.anti = anti;

/* 5. break button: no oracle */
console.log("\n== break button: oracle removed ==");
const brk = [];
for (const n of [2, 5, 10]) {
  const o = QS.optimalK(n);
  const c = QS.successCurve(n, (1 << n) - 1, o.k, { oracle: false });
  brk.push({ n, k: o.k, p: c.p[o.k], uniform: 1 / (1 << n) });
  const s = QS.grover(n, (1 << n) - 1, o.k, { oracle: false });
  out.amplitudes["broken_n" + n + "_k" + o.k] = { n, target: (1 << n) - 1, k: o.k, oracle: false, re: Array.from(s.re), im: Array.from(s.im), gates: s.gates };
  console.log(`  n=${n} k=${o.k} success=${c.p[o.k].toFixed(6)} uniform=${(1 / (1 << n)).toFixed(6)}`);
}
out.tables.broken = brk;

/* 6. Bell pair, product pair, sampling with the shared PRNG */
console.log("\n== Bell pair and product pair, 1,000 shots, seeds 7 / 11 / 2026 ==");
const bell = QS.bellPair(), prod = QS.productPair();
out.amplitudes.bell = { n: 2, re: Array.from(bell.re), im: Array.from(bell.im), gates: bell.gates };
out.amplitudes.product = { n: 2, re: Array.from(prod.re), im: Array.from(prod.im), gates: prod.gates };
const samples = [];
for (const seed of [7, 11, 2026]) {
  const cb = Array.from(QS.sample(bell, 1000, seed)), cp = Array.from(QS.sample(prod, 1000, seed));
  samples.push({ seed, bell: cb, product: cp, agreeBell: QS.agreement(cb), agreeProduct: QS.agreement(cp) });
  console.log(`  seed ${seed}: bell ${cb.join("/")} agree=${QS.agreement(cb).toFixed(3)}   product ${cp.join("/")} agree=${QS.agreement(cp).toFixed(3)}`);
}
out.tables.samples = samples;
/* one-qubit sampling for p1: H|0>, 100 shots, seed 7 */
const one = QS.newState(1); QS.applyH(one, 0);
const c1 = Array.from(QS.sample(one, 100, 7));
out.tables.oneQubit = { shots: 100, seed: 7, counts: c1 };
console.log(`  one qubit after H, 100 shots seed 7: ${c1.join("/")}`);
/* three-qubit sampling for p1: H on all three, 800 shots seed 11 */
const three = QS.newState(3); QS.hadamardAll(three);
const c3 = Array.from(QS.sample(three, 800, 11));
out.tables.threeQubit = { shots: 800, seed: 11, counts: c3 };
console.log(`  three qubits after H^3, 800 shots seed 11: ${c3.join("/")}`);
/* Grover n=3 sampled, p4 */
const g3 = QS.grover(3, 5, 2);
const cg3 = Array.from(QS.sample(g3, 1000, 7));
out.tables.grover3sample = { shots: 1000, seed: 7, target: 5, k: 2, counts: cg3, pTarget: QS.probs(g3)[5] };
console.log(`  Grover n=3 target 5 k=2, 1,000 shots seed 7: ${cg3.join("/")} (exact p=${QS.probs(g3)[5].toFixed(6)})`);

/* 7. reintroduced faults: the self test must FAIL on each */
console.log("\n== reintroduced faults ==");
const src = fs.readFileSync(path.join(__dirname, "..", "assets", "qs-live.js"), "utf8");
function loadVariant(code) {
  const m = { exports: {} };
  const g = {};
  new Function("module", "globalThis", "window", code)(m, g, undefined);
  return g.QS || m.exports;
}
const faults = {
  "diffusion without the X layer": src.replace(/for \(q = 0; q < s\.n; q\+\+\) applyX\(s, q\);/g, "/* X layer removed */"),
  "oracle that does not flip": src.replace("s.re[index] = -s.re[index]; s.im[index] = -s.im[index];", "/* no flip */")
};
out.faults = {};
for (const name in faults) {
  const V = loadVariant(faults[name]);
  const r = V.selfTest();
  const failed = r.results.filter(x => !x.ok).map(x => x.name);
  out.faults[name] = failed;
  console.log(`  ${name}: ${failed.length} of 7 fail -> ${failed.join(" | ")}`);
}

const dest = process.argv[2];
if (dest) { fs.writeFileSync(dest, JSON.stringify(out)); console.log("\nwrote " + dest); }
