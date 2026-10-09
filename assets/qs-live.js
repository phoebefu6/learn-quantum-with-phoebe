/* qs-live.js - a statevector simulator for a data team, running in the page.

   Everything here is computed, not quoted. A register of n qubits is a vector
   of 2^n complex amplitudes; a gate is a matrix applied to that vector; a
   measurement is a sample drawn from the squared amplitudes. The simulator is
   exact up to floating point. Ten qubits is 1,024 amplitudes, which is nothing.

   Four benches sit on top of it:
     Grover   - success probability per iteration, optimal iteration count
     Queries  - oracle calls, quantum against classical N/2
     Loading  - the loading tax: order-N load against sqrt-N search
     Noise    - a one-parameter global depolarising channel per gate (modelled,
                and kinder than real hardware; the page says so)

   Qubit q is bit q of the basis index. Index 0 is the state with every qubit
   zero. The engine is also loaded by node for the canon run and by the numpy
   reference for the cross-check, so nothing in here touches the DOM.
*/
(function (root) {
  "use strict";

  /* ---------- seeded PRNG, shared bit for bit with the Python reference ---------- */
  function mulberry(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- the register ---------- */
  function newState(n) {
    var N = 1 << n;
    var s = { n: n, N: N, re: new Float64Array(N), im: new Float64Array(N), gates: 0 };
    s.re[0] = 1;
    return s;
  }

  function norm(s) {
    var t = 0;
    for (var i = 0; i < s.N; i++) t += s.re[i] * s.re[i] + s.im[i] * s.im[i];
    return t;
  }

  function probs(s) {
    var p = new Float64Array(s.N);
    for (var i = 0; i < s.N; i++) p[i] = s.re[i] * s.re[i] + s.im[i] * s.im[i];
    return p;
  }

  /* ---------- single-qubit gates, as the 2 x 2 matrix on every pair ---------- */
  var S = Math.SQRT1_2;

  function applyH(s, q) {
    var bit = 1 << q;
    for (var i = 0; i < s.N; i++) {
      if (i & bit) continue;
      var j = i | bit;
      var ar = s.re[i], ai = s.im[i], br = s.re[j], bi = s.im[j];
      s.re[i] = (ar + br) * S; s.im[i] = (ai + bi) * S;
      s.re[j] = (ar - br) * S; s.im[j] = (ai - bi) * S;
    }
    s.gates++;
  }

  function applyX(s, q) {
    var bit = 1 << q;
    for (var i = 0; i < s.N; i++) {
      if (i & bit) continue;
      var j = i | bit;
      var tr = s.re[i], ti = s.im[i];
      s.re[i] = s.re[j]; s.im[i] = s.im[j];
      s.re[j] = tr; s.im[j] = ti;
    }
    s.gates++;
  }

  function applyZ(s, q) {
    var bit = 1 << q;
    for (var i = 0; i < s.N; i++) {
      if (i & bit) { s.re[i] = -s.re[i]; s.im[i] = -s.im[i]; }
    }
    s.gates++;
  }

  /* CNOT: flip target t wherever control c is one */
  function applyCNOT(s, c, t) {
    var cb = 1 << c, tb = 1 << t;
    for (var i = 0; i < s.N; i++) {
      if (!(i & cb) || (i & tb)) continue;
      var j = i | tb;
      var tr = s.re[i], ti = s.im[i];
      s.re[i] = s.re[j]; s.im[i] = s.im[j];
      s.re[j] = tr; s.im[j] = ti;
    }
    s.gates++;
  }

  /* Phase flip on ONE basis state. As the oracle it marks the item being
     searched for; inside the diffusion it is the multi-controlled Z. Counted
     as one gate, which undercounts real hardware and the page says so. */
  function applyPhaseFlip(s, index) {
    s.re[index] = -s.re[index]; s.im[index] = -s.im[index];
    s.gates++;
  }

  /* ---------- Grover ---------- */
  function hadamardAll(s) { for (var q = 0; q < s.n; q++) applyH(s, q); }

  /* Diffusion = H^n (2|0><0| - I) H^n, built from gates: H on every qubit, X on
     every qubit, a phase flip on the all-ones state, X back, H back. 4n + 1 gates. */
  function diffusion(s) {
    var q;
    hadamardAll(s);
    for (q = 0; q < s.n; q++) applyX(s, q);
    applyPhaseFlip(s, s.N - 1);
    for (q = 0; q < s.n; q++) applyX(s, q);
    hadamardAll(s);
  }

  /* One full Grover run: uniform superposition, then k iterations of
     oracle + diffusion. opts.oracle === false removes the phase flip, which is
     the break button: the diffusion alone leaves the uniform state untouched. */
  function grover(n, target, k, opts) {
    opts = opts || {};
    var useOracle = opts.oracle !== false;
    var s = newState(n);
    hadamardAll(s);
    for (var i = 0; i < k; i++) {
      if (useOracle) applyPhaseFlip(s, target);
      diffusion(s);
    }
    return s;
  }

  /* Success probability after each of 0..kmax iterations, read from one
     run that records the target amplitude as it goes. */
  function successCurve(n, target, kmax, opts) {
    opts = opts || {};
    var useOracle = opts.oracle !== false;
    var s = newState(n);
    hadamardAll(s);
    var out = [], gates = [];
    out.push(s.re[target] * s.re[target] + s.im[target] * s.im[target]);
    gates.push(s.gates);
    for (var i = 0; i < kmax; i++) {
      if (useOracle) applyPhaseFlip(s, target);
      diffusion(s);
      out.push(s.re[target] * s.re[target] + s.im[target] * s.im[target]);
      gates.push(s.gates);
    }
    return { p: out, gates: gates };
  }

  /* The closed form the simulator is checked against: sin^2((2k+1) theta),
     sin theta = 1 / sqrt N. Not used by the benches, only by the self test. */
  function closedForm(n, k) {
    var theta = Math.asin(1 / Math.sqrt(1 << n));
    var v = Math.sin((2 * k + 1) * theta);
    return v * v;
  }

  /* Optimal iteration count, found by scanning the curve rather than quoted. */
  function optimalK(n) {
    var N = 1 << n;
    var kTheory = Math.floor(Math.PI / 4 * Math.sqrt(N));
    var curve = successCurve(n, 0, kTheory + 3);
    var best = 0;
    for (var k = 1; k < curve.p.length; k++) if (curve.p[k] > curve.p[best]) best = k;
    return { n: n, N: N, k: best, p: curve.p[best], kTheory: kTheory, gates: curve.gates[best], curve: curve.p };
  }

  /* ---------- queries: quantum oracle calls against classical lookups ---------- */
  function queryTable(nMin, nMax) {
    var rows = [];
    for (var n = nMin; n <= nMax; n++) {
      var o = optimalK(n);
      rows.push({ n: n, N: o.N, classicalHalf: o.N / 2, quantumK: o.k, pSuccess: o.p, kTheory: o.kTheory, gates: o.gates });
    }
    return rows;
  }

  /* ---------- the loading tax ----------
     N classical rows cost loadPerRow each to write into any quantum memory,
     once. Each search then costs about pi/4 sqrt N oracle calls, each of which
     reads that memory at queryCost (default log2 N, the switch count of the
     best proposed qRAM). Classical brute force costs N/2 lookups per search.
     A classical index costs N log2 N once and log2 N per search. R is the
     number of searches run against one load. Every term is a declared model. */
  function loadingTax(opts) {
    opts = opts || {};
    var N = opts.N, R = opts.R == null ? 1 : opts.R;
    var loadPerRow = opts.loadPerRow == null ? 1 : opts.loadPerRow;
    var log2N = Math.log(N) / Math.LN2;
    var queryCost = opts.queryCost == null ? log2N : opts.queryCost;
    var k = Math.max(1, Math.round(Math.PI / 4 * Math.sqrt(N)));
    var perSearchQ = k * queryCost;
    var quantum = N * loadPerRow + R * perSearchQ;
    var brute = R * N / 2;
    var indexed = N * log2N + R * log2N;
    var denomB = N / 2 - perSearchQ;
    var crossBrute = denomB > 0 ? Math.ceil((N * loadPerRow) / denomB) : null;
    var denomI = perSearchQ - log2N;
    var crossIndexed = denomI > 0 ? (N * log2N - N * loadPerRow) / denomI : null;
    return {
      N: N, R: R, k: k, log2N: log2N, queryCost: queryCost, loadPerRow: loadPerRow,
      quantum: quantum, brute: brute, indexed: indexed,
      quantumLoad: N * loadPerRow, quantumSearch: R * perSearchQ,
      crossBrute: crossBrute,
      crossIndexed: crossIndexed === null ? null : (crossIndexed > 0 ? Math.floor(crossIndexed) : 0),
      winner: quantum < brute && quantum < indexed ? "quantum" : (indexed <= brute ? "classical index" : "classical brute force")
    };
  }

  /* ---------- noise ----------
     Global depolarising channel, one parameter p: after every gate, with
     probability p the whole register is replaced by the uniform mixture.
     After G gates the state is (1-p)^G of the ideal plus the rest uniform, so
     the noisy distribution is exact and cheap. Real hardware noise is per
     qubit and structured; this is the standard one-knob simplification and it
     is kinder than hardware because the oracle counts as one gate. */
  function noisySuccess(pIdeal, p, gates, N) {
    var keep = Math.pow(1 - p, gates);
    return keep * pIdeal + (1 - keep) / N;
  }

  function noiseLadder(n, ps) {
    var o = optimalK(n);
    return ps.map(function (p) {
      /* success at the ideal-optimal depth, and the best any depth can do under this noise */
      var atOpt = noisySuccess(o.p, p, o.gates, o.N);
      var curve = successCurve(n, 0, o.kTheory + 3);
      var bestK = 0, bestP = curve.p[0];
      for (var k = 0; k < curve.p.length; k++) {
        var v = noisySuccess(curve.p[k], p, curve.gates[k], o.N);
        if (v > bestP) { bestP = v; bestK = k; }
      }
      return { n: n, N: o.N, p: p, k: o.k, gates: o.gates, pIdeal: o.p, pNoisy: atOpt, bestK: bestK, bestP: bestP, uniform: 1 / o.N };
    });
  }

  /* ---------- sampling ---------- */
  function sample(s, shots, seed) {
    var p = probs(s), cum = new Float64Array(s.N), acc = 0, i;
    for (i = 0; i < s.N; i++) { acc += p[i]; cum[i] = acc; }
    var rnd = mulberry(seed == null ? 7 : seed);
    var counts = new Int32Array(s.N);
    for (var t = 0; t < shots; t++) {
      var u = rnd() * acc, idx = s.N - 1;
      for (i = 0; i < s.N; i++) if (u < cum[i]) { idx = i; break; }
      counts[idx]++;
    }
    return counts;
  }

  /* ---------- small circuits the practitioner pages use ---------- */
  function bellPair() {
    var s = newState(2);
    applyH(s, 0);
    applyCNOT(s, 0, 1);
    return s;
  }

  function productPair() {
    var s = newState(2);
    applyH(s, 0);
    applyH(s, 1);
    return s;
  }

  /* fraction of shots in which both qubits read the same value */
  function agreement(counts) {
    var same = counts[0] + counts[3], all = counts[0] + counts[1] + counts[2] + counts[3];
    return all ? same / all : 0;
  }

  /* ---------- self test ----------
     Seven properties, checked on load. Two of them fail against the faults a
     simulator most easily carries: a diffusion built without the X layer, and
     an oracle that does not flip. The canon run reintroduces both on purpose. */
  function selfTest() {
    var out = [], s, p, i, ok;

    // 1. normalisation survives every gate
    s = newState(3);
    applyH(s, 0); applyX(s, 1); applyCNOT(s, 0, 2); applyZ(s, 2); applyH(s, 1); applyPhaseFlip(s, 5);
    ok = Math.abs(norm(s) - 1) < 1e-12;
    out.push({ name: "the register stays normalised through six gates", expected: 1, got: norm(s), ok: ok });

    // 2. H on |0> splits the amplitude equally
    s = newState(1); applyH(s, 0);
    ok = Math.abs(s.re[0] - S) < 1e-12 && Math.abs(s.re[1] - S) < 1e-12;
    out.push({ name: "H on zero gives two equal amplitudes", expected: S, got: s.re[1], ok: ok });

    // 3. a Bell pair puts all the probability on 00 and 11
    s = bellPair(); p = probs(s);
    ok = Math.abs(p[0] - 0.5) < 1e-12 && Math.abs(p[3] - 0.5) < 1e-12 && p[1] < 1e-12 && p[2] < 1e-12;
    out.push({ name: "a Bell pair reads 00 or 11 and never 01 or 10", expected: "0.5, 0, 0, 0.5", got: Array.from(p).map(function (v) { return +v.toFixed(6); }).join(", "), ok: ok });

    // 4. on two qubits one Grover iteration finds the item with certainty
    s = grover(2, 3, 1); p = probs(s);
    ok = Math.abs(p[3] - 1) < 1e-12;
    out.push({ name: "two qubits, one iteration, certainty", expected: 1, got: p[3], ok: ok });

    // 5. the simulator matches the closed form on five qubits, every iteration
    var curve = successCurve(5, 17, 6), worst = 0;
    for (i = 0; i < curve.p.length; i++) worst = Math.max(worst, Math.abs(curve.p[i] - closedForm(5, i)));
    ok = worst < 1e-9;
    out.push({ name: "five qubits match sin^2((2k+1) theta) at every iteration", expected: "< 1e-9", got: worst, ok: ok });

    // 6. the oracle is what does the work: without it the state stays uniform
    var withO = successCurve(3, 6, 1).p[1], without = successCurve(3, 6, 3, { oracle: false }).p[3];
    ok = withO > 0.5 && Math.abs(without - 1 / 8) < 1e-12;
    out.push({ name: "remove the oracle and Grover returns the uniform distribution", expected: "> 0.5 with, 0.125 without", got: withO.toFixed(5) + " with, " + without.toFixed(5) + " without", ok: ok });

    // 7. noise can only lower success below the ideal and never below uniform
    var o = optimalK(6), noisy = noisySuccess(o.p, 0.01, o.gates, o.N);
    ok = noisy < o.p && noisy > 1 / o.N && Math.abs(noisySuccess(o.p, 0, o.gates, o.N) - o.p) < 1e-12;
    out.push({ name: "noise lowers success, never below uniform, and p = 0 is the ideal", expected: "between 1/64 and " + o.p.toFixed(4), got: noisy, ok: ok });

    return { ok: out.every(function (r) { return r.ok; }), results: out };
  }

  root.QS = {
    mulberry: mulberry,
    newState: newState, norm: norm, probs: probs,
    applyH: applyH, applyX: applyX, applyZ: applyZ, applyCNOT: applyCNOT, applyPhaseFlip: applyPhaseFlip,
    hadamardAll: hadamardAll, diffusion: diffusion, grover: grover, successCurve: successCurve,
    closedForm: closedForm, optimalK: optimalK, queryTable: queryTable,
    loadingTax: loadingTax, noisySuccess: noisySuccess, noiseLadder: noiseLadder,
    sample: sample, bellPair: bellPair, productPair: productPair, agreement: agreement,
    selfTest: selfTest
  };
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) {
  module.exports = (typeof window !== "undefined" ? window : globalThis).QS;
}
