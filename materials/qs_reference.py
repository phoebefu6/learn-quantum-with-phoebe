#!/usr/bin/env python3
"""qs_reference.py - numpy twin of assets/qs-live.js.

Re-derives every amplitude and every bench number independently and compares them
with the node run's JSON dump. Amplitudes must agree to 1e-9; sampled counts must
agree exactly because both sides use the same mulberry32 stream and the same
cumulative sums.

Usage:
  node materials/qs_canon.js /path/to/canon.json
  python3 materials/qs_reference.py /path/to/canon.json
"""
import json
import math
import sys

import numpy as np

SQRT1_2 = math.sqrt(0.5)
MASK = 0xFFFFFFFF


# ---------- the same PRNG, emulated on unsigned 32-bit integers ----------
def imul(a, b):
    return (a * b) & MASK


def mulberry(seed):
    t = seed & MASK

    def rnd():
        nonlocal t
        t = (t + 0x6D2B79F5) & MASK
        r = imul(t ^ (t >> 15), (1 | t) & MASK)
        r = (r ^ ((r + imul(r ^ (r >> 7), (61 | r) & MASK)) & MASK)) & MASK
        return ((r ^ (r >> 14)) & MASK) / 4294967296

    return rnd


# ---------- register and gates, element for element the same arithmetic ----------
def new_state(n):
    N = 1 << n
    re = np.zeros(N)
    im = np.zeros(N)
    re[0] = 1.0
    return {"n": n, "N": N, "re": re, "im": im, "gates": 0}


def _pairs(N, q):
    bit = 1 << q
    i = np.arange(N)
    i = i[(i & bit) == 0]
    return i, i | bit


def apply_h(s, q):
    i, j = _pairs(s["N"], q)
    ar, ai, br, bi = s["re"][i].copy(), s["im"][i].copy(), s["re"][j].copy(), s["im"][j].copy()
    s["re"][i] = (ar + br) * SQRT1_2
    s["im"][i] = (ai + bi) * SQRT1_2
    s["re"][j] = (ar - br) * SQRT1_2
    s["im"][j] = (ai - bi) * SQRT1_2
    s["gates"] += 1


def apply_x(s, q):
    i, j = _pairs(s["N"], q)
    for key in ("re", "im"):
        a = s[key][i].copy()
        s[key][i] = s[key][j]
        s[key][j] = a
    s["gates"] += 1


def apply_z(s, q):
    bit = 1 << q
    idx = np.arange(s["N"])
    m = (idx & bit) != 0
    s["re"][m] = -s["re"][m]
    s["im"][m] = -s["im"][m]
    s["gates"] += 1


def apply_cnot(s, c, t):
    cb, tb = 1 << c, 1 << t
    idx = np.arange(s["N"])
    i = idx[((idx & cb) != 0) & ((idx & tb) == 0)]
    j = i | tb
    for key in ("re", "im"):
        a = s[key][i].copy()
        s[key][i] = s[key][j]
        s[key][j] = a
    s["gates"] += 1


def phase_flip(s, index):
    s["re"][index] = -s["re"][index]
    s["im"][index] = -s["im"][index]
    s["gates"] += 1


def hadamard_all(s):
    for q in range(s["n"]):
        apply_h(s, q)


def diffusion(s):
    hadamard_all(s)
    for q in range(s["n"]):
        apply_x(s, q)
    phase_flip(s, s["N"] - 1)
    for q in range(s["n"]):
        apply_x(s, q)
    hadamard_all(s)


def grover(n, target, k, oracle=True):
    s = new_state(n)
    hadamard_all(s)
    for _ in range(k):
        if oracle:
            phase_flip(s, target)
        diffusion(s)
    return s


def probs(s):
    return s["re"] * s["re"] + s["im"] * s["im"]


def success_curve(n, target, kmax, oracle=True):
    s = new_state(n)
    hadamard_all(s)
    p = [float(s["re"][target] ** 2 + s["im"][target] ** 2)]
    g = [s["gates"]]
    for _ in range(kmax):
        if oracle:
            phase_flip(s, target)
        diffusion(s)
        p.append(float(s["re"][target] ** 2 + s["im"][target] ** 2))
        g.append(s["gates"])
    return p, g


def closed_form(n, k):
    theta = math.asin(1 / math.sqrt(1 << n))
    return math.sin((2 * k + 1) * theta) ** 2


def optimal_k(n):
    N = 1 << n
    k_theory = math.floor(math.pi / 4 * math.sqrt(N))
    p, g = success_curve(n, 0, k_theory + 3)
    best = max(range(1, len(p)), key=lambda k: p[k])
    return {"n": n, "N": N, "k": best, "p": p[best], "kTheory": k_theory, "gates": g[best], "curve": p, "gatesPer": g}


def noisy_success(p_ideal, p, gates, N):
    keep = (1 - p) ** gates
    return keep * p_ideal + (1 - keep) / N


def loading_tax(N, R=1, load_per_row=1, query_cost=None):
    log2N = math.log(N) / math.log(2)
    if query_cost is None:
        query_cost = log2N
    k = max(1, round(math.pi / 4 * math.sqrt(N)))
    per_search = k * query_cost
    quantum = N * load_per_row + R * per_search
    brute = R * N / 2
    indexed = N * log2N + R * log2N
    return {"quantum": quantum, "brute": brute, "indexed": indexed, "k": k}


def sample(s, shots, seed):
    p = probs(s)
    cum, acc = [], 0.0
    for v in p:
        acc += float(v)
        cum.append(acc)
    rnd = mulberry(seed)
    counts = [0] * s["N"]
    for _ in range(shots):
        u = rnd() * acc
        idx = s["N"] - 1
        for i, c in enumerate(cum):
            if u < c:
                idx = i
                break
        counts[idx] += 1
    return counts


def bell_pair():
    s = new_state(2)
    apply_h(s, 0)
    apply_cnot(s, 0, 1)
    return s


def product_pair():
    s = new_state(2)
    apply_h(s, 0)
    apply_h(s, 1)
    return s


def agreement(c):
    tot = sum(c)
    return (c[0] + c[3]) / tot if tot else 0


# ---------- compare with the node dump ----------
def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    canon = json.load(open(sys.argv[1]))
    worst = 0.0
    n_amp = 0
    for name, a in canon["amplitudes"].items():
        n = a["n"]
        if name.startswith("grover") or name.startswith("broken"):
            s = grover(n, a["target"], a["k"], oracle=a.get("oracle", True))
        elif name == "bell":
            s = bell_pair()
        elif name == "product":
            s = product_pair()
        else:
            continue
        d = max(float(np.max(np.abs(s["re"] - np.array(a["re"])))), float(np.max(np.abs(s["im"] - np.array(a["im"])))))
        worst = max(worst, d)
        n_amp += s["N"]
        assert s["gates"] == a["gates"], (name, s["gates"], a["gates"])
    print(f"amplitudes: {n_amp} compared across {len(canon['amplitudes'])} states, max abs diff {worst:.3e}")
    assert worst < 1e-9, "amplitude disagreement"

    # Grover table and closed form
    for row in canon["tables"]["grover"]:
        o = optimal_k(row["n"])
        assert o["k"] == row["kOpt"] and abs(o["p"] - row["pOpt"]) < 1e-12 and o["gates"] == row["gates"], row["n"]
        for k, v in enumerate(row["curve"]):
            assert abs(v - o["curve"][k]) < 1e-12
            assert abs(v - closed_form(row["n"], k)) < 1e-9, (row["n"], k)
    print("grover: kOpt, pOpt, gate counts and every curve point agree; closed form within 1e-9")

    # queries
    for row in canon["tables"]["queries"]:
        o = optimal_k(row["n"])
        assert row["classicalHalf"] == row["N"] / 2 and row["quantumK"] == o["k"]
    print("queries: agree")

    # loading tax
    for row in canon["tables"]["loading"]:
        for key, R in (("R1", 1), ("R100", 100)):
            r = loading_tax(row["N"], R)
            for f in ("quantum", "brute", "indexed"):
                assert abs(r[f] - row[key][f]) <= 1e-6 * max(1, abs(r[f])), (row["N"], key, f)
    print("loading tax: agree to 1e-6 relative")

    # noise
    for row in canon["tables"]["noise10"]:
        o = optimal_k(10)
        v = noisy_success(o["p"], row["p"], o["gates"], 1024)
        assert abs(v - row["pNoisy"]) < 1e-12, row["p"]
        best_k, best_p = 0, o["curve"][0]
        for k, pk in enumerate(o["curve"]):
            vv = noisy_success(pk, row["p"], o["gatesPer"][k], 1024)
            if vv > best_p:
                best_p, best_k = vv, k
        assert best_k == row["bestK"] and abs(best_p - row["bestP"]) < 1e-12
    for row in canon["tables"]["anti"]:
        o = optimal_k(row["n"])
        for key, p in (("p005", 0.005), ("p01", 0.01)):
            assert abs(noisy_success(o["p"], p, o["gates"], o["N"]) - row[key]["pNoisy"]) < 1e-12
    print("noise ladder and anti-lever: agree to 1e-12")

    # break button
    for row in canon["tables"]["broken"]:
        p, _ = success_curve(row["n"], (1 << row["n"]) - 1, row["k"], oracle=False)
        assert abs(p[row["k"]] - row["p"]) < 1e-12 and abs(p[row["k"]] - 1 / (1 << row["n"])) < 1e-12
    print("break button: uniform, agree")

    # samples: exact match
    bell, prod = bell_pair(), product_pair()
    for row in canon["tables"]["samples"]:
        assert sample(bell, 1000, row["seed"]) == row["bell"], row["seed"]
        assert sample(prod, 1000, row["seed"]) == row["product"], row["seed"]
    one = new_state(1)
    apply_h(one, 0)
    assert sample(one, 100, 7) == canon["tables"]["oneQubit"]["counts"]
    three = new_state(3)
    hadamard_all(three)
    assert sample(three, 800, 11) == canon["tables"]["threeQubit"]["counts"]
    g3 = grover(3, 5, 2)
    assert sample(g3, 1000, 7) == canon["tables"]["grover3sample"]["counts"]
    print("samples: every count identical (shared PRNG stream)")
    print("REFERENCE AGREES")


if __name__ == "__main__":
    main()
