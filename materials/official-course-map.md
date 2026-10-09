# Official course map - learn-quantum-with-phoebe

Hub title: "Quantum for Data Teams: Fine Print First". Bucket `emrg`, difficulty d4, audience both.
16 sessions: Leader a1-a6, Practitioner p1-p10. **Every session is 45 minutes, on both tracks.**

**Scope, set by Phoebe 2026-10-08: the data and AI angle.** What quantum computing will and will not
do to a data team's workload, taught on a REAL statevector simulator that runs in the page
(`assets/qs-live.js`, up to 10 qubits, 1,024 complex amplitudes). Speedups are per algorithm, never
general. Most "quantum machine learning" claims die at data loading. Some were dequantized. Noise
collapses success probability with circuit depth. The hardware timeline is contested evidence and is
taught as a disagreement. Post-quantum migration is taught as a DATA INVENTORY job, which is the one
quantum task a data team is certain to be handed.

Setting: **Brindle**, a constructed mid-sized retailer. Its data team holds a 12-million-row
customer table, a 4-million-row order table and a 20-year archive of encrypted backups. The board
has received an unnamed vendor's pitch for a "quantum pilot" and has asked the data team two
questions: will this change our workload, and what do we have to do about the encryption. No real
company, no real vendor, no real hardware. Every number about Brindle is constructed and says so.

**Refusals carried on every page.** No vendor names, no vendor roadmaps, no product names, no qubit
counts attributed to anyone, no named incidents. No coins, tokens or prices. Money is near this
subject only in the form of a pilot budget, so the landing page and a1 carry "not investment
advice". The timeline question is answered with the disagreement, never with a date.

---

## The seam

| Subject | Owner | Here |
|---|---|---|
| Key management, rotation, custody, access control | `learn-cyber-security-with-phoebe` (dsec, LIVE: b2 credential paths, b4 supply chain) and `learn-data-access-control-with-phoebe` | **Named, never re-taught.** p9 and a6 produce an inventory of WHERE which cryptography is used and HOW LONG the data must stay secret; what to do with the keys afterwards is handed on. |
| Recommender mechanics: collaborative filtering, matrix factorisation, low-rank approximation | `learn-recommendation-with-phoebe` (LIVE: b6 matrix factorization) | **Named, never re-taught.** a4 teaches what Tang 2018 did to the Kerenidis-Prakash algorithm; the recommender itself is pointed at. |
| Linear algebra inside neural nets, backprop, embeddings | `learn-deep-learning-with-phoebe` (LIVE: 01 the neuron, 02 backprop by hand) | **Named, never re-taught.** a1 and p2 use vectors and matrices only as far as a 2 x 2 and a 4 x 4 gate needs. |
| Hashes, signatures as a mechanism, chains | `learn-blockchain-with-phoebe` (emrg, LIVE: p7 signatures and identity) | Named in p9 where a signature scheme appears in the inventory. |
| Physics of qubits: superconducting, trapped ion, photonic hardware | nobody on the hub | **Not taught.** The simulator is the hardware here, and the page says so. |
| Shor's algorithm and factoring | nobody on the hub | **Named, not run.** The course says why public-key cryptography is at risk (a6, p9) and runs nothing; a 10-qubit simulator cannot factor anything worth the page. |

**Estate vocabulary check before this build (2026-10-08).** `qubit` **0**, `Grover` **0**, `QRAM`
**0**, `quantum RAM` **0**, `dequantiz` **0**, `Ewin Tang` **0**, `harvest now` **0**, `post-quantum`
**0**, `FIPS 203` **0**, `ML-KEM` **0**, `statevector` **0**, `Preskill` **0**, `NISQ` **0**,
`superposition` **0**, `entanglement` **1** (a figurative use). `fine print` returns 32 pages, all the
plain English phrase; no sibling heading contains it. Running-case name `Brindle` **0**.

---

## Verified facts, with evidence tiers

Tier **A** = read at source on 2026-10-08 (the paper, the standard, the factsheet). Tier **B** =
reported from a publisher's description or abstract page only. Anything not in this table does not
go on a page as a fact.

### Grover 1996 (A)

- Lov K. Grover, "A fast quantum mechanical algorithm for database search", arXiv quant-ph/9605043,
  submitted 29 May 1996 (v3 19 November 1996); STOC 1996. Read at source (abstract).
- The abstract's own setting is a phone directory of N entries, unsorted. Any classical method,
  deterministic or randomised, needs at least **N/2** lookups to find a target with probability one
  half. The quantum algorithm obtains it in **O(sqrt N)** steps, and the abstract claims it is within
  a small constant factor of the fastest possible quantum algorithm.
- The mechanism in the abstract's own words is phases: operations are tuned so correct paths
  reinforce and the others cancel. That sentence is the whole of a2: interference, not parallelism.
- The precise iteration count is not in the abstract; the course derives it on the simulator
  (frozen canon below) and checks it against the closed form sin^2((2k+1) theta), sin theta = 1/sqrt N.

### Aaronson 2015, "Quantum machine learning algorithms: read the fine print" (A)

- Scott Aaronson, Nature Physics 11, 291-293 (2015). Read at source from the author's copy
  (scottaaronson.com/papers/qml.pdf). The published volume and page are reported from the standard
  citation, not from the PDF, which carries no journal header.
- Four caveats on HHL and its offshoots, each of which can kill the exponential speedup: (1) the
  input vector must be loaded fast, which needs a quantum RAM and a reasonably uniform vector, and if
  preparation already takes n^c steps the speedup vanishes "in the very first step"; (2) applying the
  matrix as a unitary must be fast, which needs sparsity or structure; (3) the matrix must be
  well-conditioned, since run time grows about linearly with the condition number; (4) the output is
  a quantum state, and reading a specific entry costs about n repetitions.
- The general rule he states: an exponential speedup needs an extremely fast way to create a
  certain superposition AND no fast way to create the analogous probability distribution
  classically. His worked example: the Lloyd-Mohseni-Rebentrost inner-product estimate runs in about
  log(mn)/epsilon quantum steps, and under the same uniformity condition a classical sampler does it
  in about log(mn)/epsilon^2, so the gap is at most quadratic.
- Footnote worth quoting in substance: a quantum RAM has to be "passive"; one that needs a parallel
  processing element per stored number would let a classical parallel machine solve the linear
  system in O(log^2 n) too. Also: if HHL could handle a vector with a single 1 and zeros elsewhere it
  would contradict the Bennett-Bernstein-Brassard-Vazirani bound on black-box search, which is the
  same bound Grover's algorithm sits at. This is the bridge from the HHL fine print to the search
  fine print the course is built on: loading N classical rows costs order N, and a sqrt N search gain
  cannot survive an order-N load.
- Closing position, which the course adopts as its stance: for each application one must check (a)
  whether it satisfies all of the fine print and (b) whether, once the fine print is included, a
  fast classical algorithm gives the same information.

### Kerenidis and Prakash 2016 (A)

- Iordanis Kerenidis, Anupam Prakash, "Quantum Recommendation Systems", arXiv 1603.08675 (v1 29
  March 2016, v3 22 September 2016); ITCS 2017. Read at source (PDF).
- Claimed running time O(poly(k) polylog(mn)) for an m x n preference matrix of rank about k,
  sampling from a low-rank approximation without reconstructing the matrix. The paper itself says
  this is exponentially smaller than classical time only if the rank k is a small constant.
- The paper states its memory assumption plainly: the data is stored in a classical data structure
  to which the algorithm has quantum access and which lets it create the needed superpositions in
  polylogarithmic time; entry time is polylogarithmic; preprocessing a plain array into that
  structure takes linear time. It explicitly says this is the same memory model as any quantum query
  algorithm, Grover's included. That assumption is the hinge Tang turned.

### Tang 2018 (A)

- Ewin Tang, "A quantum-inspired classical algorithm for recommendation systems", arXiv 1807.04271
  (v1 10 July 2018, v3 9 May 2019); STOC 2019, doi 10.1145/3313276.3316310. Read at source (abstract).
- Given the matrix in a data structure that supports l2-norm sampling (the classical analogue of the
  Kerenidis-Prakash assumption), a classical algorithm samples from a rank-k approximation in
  O(poly(k) log(mn)) time, only polynomially slower than the quantum one. Her abstract's conclusion:
  the Kerenidis-Prakash algorithm does not give an exponential speedup over classical. The abstract
  also notes the quantum algorithm had been "previously believed to be one of the strongest
  candidates" for a provable exponential speedup in quantum machine learning.
- Her framing, which a4 teaches as the method: manipulating l2-norm sampling distributions plays the
  role that quantum superpositions play. Note the matched assumption: the classical algorithm needs
  the same kind of preprocessed data structure the quantum one needed. Neither runs on a raw table.

### Preskill 2018 (A)

- John Preskill, "Quantum Computing in the NISQ era and beyond", Quantum 2, 79 (2018), arXiv
  1801.00862 (v1 2 January 2018, v3 31 July 2018). Read at source (arXiv abstract page; the journal
  site refused the connection on the day).
- NISQ = Noisy Intermediate-Scale Quantum. The abstract names devices of 50 to 100 qubits as the
  near-term class that might do some tasks beyond classical reach, says noise in quantum gates
  limits the size of circuit that can run reliably, says such devices should be useful for exploring
  many-body physics and "may have other useful applications", and frames more accurate gates and
  "eventually" fault tolerance as the longer-term path. No date is given for fault tolerance.

### NIST FIPS 203, 204, 205 (A) and the August 2024 release (A)

- FIPS 203 "Module-Lattice-Based Key-Encapsulation Mechanism Standard", published 13 August 2024.
  Specifies ML-KEM, with parameter sets ML-KEM-512, 768 and 1024. Security rests on the Module
  Learning With Errors problem. Read at source (csrc.nist.gov/pubs/fips/203/final).
- FIPS 204 "Module-Lattice-Based Digital Signature Standard", 13 August 2024, specifies ML-DSA.
  FIPS 205 "Stateless Hash-Based Digital Signature Standard", 13 August 2024, specifies SLH-DSA,
  derived from SPHINCS+. Both read at source.
- NIST news release of 13 August 2024, "NIST Releases First 3 Finalized Post-Quantum Encryption
  Standards" (read at source): FIPS 203 is based on CRYSTALS-Kyber, FIPS 204 on CRYSTALS-Dilithium,
  FIPS 205 on SPHINCS+ as a backup signature scheme; a fourth, FN-DSA from FALCON, is planned as
  FIPS 206. NIST encourages administrators to begin transitioning "as soon as possible".

### NIST IR 8547 ipd, "Transition to Post-Quantum Cryptography Standards" (A)

- Initial public draft, November 2024, Moody, Perlner, Regenscheid, Robinson, Cooper. Read at
  source (PDF). It is a DRAFT: pages must say "proposed" for its dates.
- Proposed transition (Tables 3 and 4): ECDSA, RSA signatures, finite-field DH and MQV, elliptic
  curve DH and MQV, and RSA key establishment at **112 bits of security are deprecated after 2030
  and disallowed after 2035**; at 128 bits or more, disallowed after 2035. EdDSA at 128 bits or
  more, disallowed after 2035.
- Quotes National Security Memorandum 10's goal of mitigating as much quantum risk as feasible by
  2035, and notes timelines vary by use case: long-term confidentiality may need earlier transition.
- States the "harvest now, decrypt later" threat in its own words: adversaries collect encrypted
  data now with the goal of decrypting it once quantum technology matures; sensitive data often
  retains its value for many years, so the transition is urgent before any such computer exists. It
  gives the planning inequality in prose: migration time plus required secrecy lifetime must not
  exceed the time until a cryptographically relevant quantum computer exists.

### CISA, NSA, NIST factsheet "Quantum-Readiness: Migration to Post-Quantum Cryptography" (A)

- As of 17 August 2023, TLP:CLEAR. Read at source (nccoe.nist.gov copy of the PDF).
- Names the threat as "catch now, break later or harvest now, decrypt later" against data with a
  long secrecy lifetime. Names RSA, ECDH and ECDSA as the public-key algorithms that will need
  updating. Tells organisations to establish a project team, run cryptographic discovery, and
  PREPARE A CRYPTOGRAPHIC INVENTORY covering network protocols, assets on end-user systems and
  servers including software and firmware update paths, and cryptographic code in CI/CD pipelines;
  to record when and where quantum-vulnerable cryptography protects the most sensitive datasets
  with estimates of how long those datasets need protecting; to correlate it with existing asset,
  identity and endpoint inventories; and to ask vendors for lists of embedded cryptography because
  discovery tools may miss it. This factsheet is the primary source for p9 and the a6 inventory.

### Giovannetti, Lloyd, Maccone 2008 (A)

- "Quantum random access memory", Phys. Rev. Lett. 100, 160501 (2008), arXiv 0708.1879. Read at
  source (abstract). A classical RAM uses n bits to address N = 2^n cells; a qRAM uses n qubits to
  address a superposition of cells. Their architecture needs O(log N) switches per memory call
  rather than the N of a conventional design. The abstract does not use the words "bucket brigade";
  pages must not. The course uses this paper for one claim only: even the best proposed qRAM makes a
  QUERY cost about log N, and nothing in it makes the initial WRITE of N classical values cost less
  than N writes.

### Nielsen and Chuang (B)

- Michael A. Nielsen, Isaac L. Chuang, "Quantum Computation and Quantum Information", 10th
  Anniversary Edition, Cambridge University Press, 2010. Reported from the publisher's page only,
  which describes it as a leading textbook covering fast quantum algorithms, teleportation,
  cryptography and error correction. The standard gate set and the Bell-pair circuit taught in p2
  are textbook material; the course states the matrices from first principles and checks them on the
  simulator rather than quoting the book. Cite as "the standard textbook", never reproduce text.

### The timeline, which is contested (teach the disagreement)

Three primary sources, three different stances, none with a date:
- Preskill 2018: noisy 50 to 100 qubit devices are the near term; fault tolerance is "eventually".
- NIST IR 8547 (draft, 2024): plans as if the computer may arrive within the secrecy lifetime of
  data being encrypted today, and writes "even if quantum computers are a decade away" the migration
  must begin now; proposes 2030 and 2035 as deprecation and disallowance years for the algorithms,
  which are policy dates, not a prediction of hardware.
- Aaronson 2015: "supposing we had a quantum computer"; the essay is about what it would be for.
Pages state all three and resolve nothing. No page gives a year for a cryptographically relevant
quantum computer. The only dated things on any page are standards and policy dates.

---

## Coverage per session

`✓` taught to working depth. `◐` named and handed on.

### Leader track (no code)

| Session | Covers | Depth |
|---|---|---|
| a1 A qubit is a vector, a gate is a matrix | Amplitudes, normalisation, measurement as sampling; one qubit on the simulator | ✓ |
| a2 Where the speedup actually comes from | Interference not parallelism; Grover's amplitude climbing watched per iteration | ✓ |
| a3 The data-loading fine print | Order-N load against sqrt-N search; Aaronson's four caveats; the qRAM write cost | ✓ |
| a4 When the classical algorithm catches up | Dequantization: Kerenidis-Prakash 2016 and Tang 2018; matched assumptions | ✓ |
| a5 Why the data-team playbook breaks here | Noise with depth, no intermediate inspection, no debugging by printing state, cost per shot, contested timeline | ✓ |
| a6 From data team to quantum-ready: the transfer map | Carries over / must learn / must unlearn; the post-quantum inventory as a data job; 90-day ladder | ✓ |
| Key management, rotation, custody | `learn-cyber-security` | ◐ |
| Recommender mechanics | `learn-recommendation` | ◐ |

### Practitioner track (hands on, in the page)

| Session | Covers | Depth |
|---|---|---|
| p1 A statevector simulator from scratch | Complex amplitudes, 1 to 3 qubits, seeded sampling, the self test | ✓ |
| p2 Gates as matrices | H, X, Z, CNOT; a Bell pair; normalisation checked after every gate | ✓ |
| p3 Entanglement, measured | Sampled correlations of a Bell pair against a product state | ✓ |
| p4 Grover step by step | Oracle, diffusion, amplitude per iteration, about pi/4 sqrt N iterations | ✓ |
| p5 Counting queries | Quantum iterations against classical N/2, n = 2 to 10, measured | ✓ |
| p6 The loading-tax calculator | Load order N, search sqrt N, searches per load, the indexed classical baseline | ✓ |
| p7 A noisy circuit | Global depolarising noise per gate, success against depth, the anti-lever | ✓ |
| p8 Reading a speedup claim | The fine-print checklist applied to three constructed claims | ✓ |
| p9 The post-quantum inventory | Cataloguing which systems use which cryptography and for how long | ✓ |
| p10 The fine-print bench | All four benches live, driven by the reader, anti-lever and break button | ✓ |
| Shor's algorithm, factoring | named, not run | ◐ |
| Hardware physics | nobody on the hub | ◐ |

---

## Frozen canon

Computed in node from `assets/qs-live.js` and cross-checked by `materials/qs_reference.py` (numpy)
before any page quoted a number. See the "Canon" section appended below after the run. Pages may
quote ONLY numbers that appear there and that the p10 widgets actually print.

---

## Figure grammar (hand-drawn, every figure)

Per-figure prefix: a1a, a1b, ... (session id + letter). `<defs>` holds a wobble filter `<prefix>Sk`
(feTurbulence fractalNoise baseFrequency 0.02 numOctaves 2, feDisplacementMap scale 2.4), a hachure
pattern `<prefix>Hc` (7 x 7 userSpaceOnUse, rotate(-38), one accent line, opacity .5) and an open
arrowhead `<prefix>Ar` (path M1 1 L9 5 L1 9, fill none, ink stroke 1.6). All shapes inside ONE
`<g filter="url(#<prefix>Sk)" fill="none" stroke="<ink>" stroke-width="2" stroke-linecap="round"
stroke-linejoin="round">`; rects carry a tiny rotation. Text OUTSIDE the filtered group. Palette
hexes ONLY from `assets/style.css` `:root`, plus white and the universal reds. Text classes per the
agent brief. Draw the mechanism: where the amplitude sits, what the oracle flips, what the load
costs, which path the noise scrambles.

---

## Not covered, by design

- A date for a cryptographically relevant quantum computer. Contested; the disagreement is taught.
- Any vendor, product, roadmap, qubit count attributed to a machine, or named incident.
- Hardware physics, error-correcting codes, Shor's algorithm as a running circuit.
- Per-qubit structured noise models. The course's noise is a declared one-parameter global
  depolarising channel, labelled on the widget as modelled and as kinder than hardware.
- Key management after the inventory. `learn-cyber-security-with-phoebe`.
- Recommender mechanics. `learn-recommendation-with-phoebe`.
- Coins, tokens, prices, markets, investment of any kind.

## Re-verify before delivery

If `qs-live.js` changes, run `selfTest()` first, then `node materials/qs_canon.js` and
`python3 materials/qs_reference.py` and confirm they agree to 1e-9 on every amplitude before any
page number is touched. NIST IR 8547 was a DRAFT at build time: re-check csrc.nist.gov for the final
report and update the "proposed" wording if it has been finalised.

---

## Citation appendix (exact forms for pages)

- Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. STOC 1996; arXiv quant-ph/9605043.
- Aaronson, S. (2015). Quantum machine learning algorithms: read the fine print. Nature Physics 11, 291-293.
- Kerenidis, I. and Prakash, A. (2016). Quantum recommendation systems. arXiv 1603.08675; ITCS 2017.
- Tang, E. (2019). A quantum-inspired classical algorithm for recommendation systems. STOC 2019; arXiv 1807.04271.
- Preskill, J. (2018). Quantum computing in the NISQ era and beyond. Quantum 2, 79; arXiv 1801.00862.
- Giovannetti, V., Lloyd, S. and Maccone, L. (2008). Quantum random access memory. Physical Review Letters 100, 160501; arXiv 0708.1879.
- NIST (2024). FIPS 203, Module-Lattice-Based Key-Encapsulation Mechanism Standard. 13 August 2024.
- NIST (2024). FIPS 204, Module-Lattice-Based Digital Signature Standard. 13 August 2024.
- NIST (2024). FIPS 205, Stateless Hash-Based Digital Signature Standard. 13 August 2024.
- NIST (2024). NIST Releases First 3 Finalized Post-Quantum Encryption Standards. News release, 13 August 2024.
- Moody, D., Perlner, R., Regenscheid, A., Robinson, A. and Cooper, D. (2024). Transition to Post-Quantum Cryptography Standards. NIST IR 8547 ipd, initial public draft, November 2024.
- CISA, NSA and NIST (2023). Quantum-Readiness: Migration to Post-Quantum Cryptography. Factsheet, 17 August 2023.
- Nielsen, M. A. and Chuang, I. L. (2010). Quantum Computation and Quantum Information, 10th Anniversary Edition. Cambridge University Press. (reported)

---

## Canon (node run of `assets/qs-live.js`, 2026-10-08, confirmed by `materials/qs_reference.py`)

Agreement: 3,112 amplitudes across 14 states, max absolute difference **0.000e+00** (the two
implementations perform the same floating-point operations in the same order); every bench table
within 1e-12; every sampled count identical (shared mulberry32 stream). Self test: 7 of 7 pass.
Reintroduced faults, each run through `selfTest()`: a diffusion built without the X layer fails
**4 of 7** properties; an oracle that does not flip fails **4 of 7**. Logs: the scratch `canon.log`
and `reference.log`.

Conventions. Qubit q is bit q of the basis index. Target for every Grover table is the all-ones
state (index N - 1). Gate count per Grover iteration is **4n + 2** (one oracle flip, then H on
every qubit, X on every qubit, one phase flip, X back, H back) plus **n** Hadamards to start, so
G(n, k) = n + k(4n + 2). This counts the oracle and the multi-controlled flip as ONE gate each,
which undercounts hardware; every page that quotes a gate count says so.

### Grover success probability per iteration (ideal, no noise)

| n | N | k at optimum | p at optimum | pi/4 sqrt N | gates | curve p0, p1, p2, ... |
|---|---|---|---|---|---|---|
| 2 | 4 | **1** | **1.000000** | 1.57 | 12 | 0.2500, 1.0000, 0.2500, 0.2500, 1.0000 |
| 3 | 8 | 2 | 0.945313 | 2.22 | 31 | 0.1250, 0.7813, 0.9453, 0.3301, 0.0122, 0.5480 |
| 4 | 16 | 3 | 0.961319 | 3.14 | 58 | 0.0625, 0.4727, 0.9084, 0.9613, 0.5817, 0.1255, 0.0204 |
| 5 | 32 | 4 | 0.999182 | 4.44 | 93 | 0.0313, 0.2583, 0.6024, 0.8969, 0.9992, 0.8596, 0.5459 |
| 6 | 64 | 6 | 0.996586 | 6.28 | 162 | 0.0156, 0.1348, 0.3439, 0.5914, 0.8164, 0.9635, 0.9966, 0.9074 |
| 7 | 128 | 8 | 0.995620 | 8.89 | 247 | 0.0078, 0.0689, 0.1834, 0.3372, 0.5111, 0.6837, 0.8335, 0.9420 |
| 8 | 256 | 12 | 0.999947 | 12.57 | 416 | 0.0039, 0.0348, 0.0946, 0.1797, 0.2847, 0.4032, 0.5276, 0.6503 |
| 9 | 512 | 17 | 0.999448 | 17.77 | 655 | 0.0020, 0.0175, 0.0481, 0.0927, 0.1501, 0.2184, 0.2955, 0.3789 |
| 10 | 1,024 | **25** | **0.999461** | 25.13 | **1,060** | 0.0010, 0.0088, 0.0242, 0.0471, 0.0771, 0.1136, 0.1562, 0.2042 |

Three teaching points, all measured: on two qubits one iteration finds the item with certainty
(p = 1.000000); on three qubits the second iteration is the peak at 0.945 and the THIRD iteration
falls to 0.330, so "more iterations" is wrong past the optimum (the amplitude keeps rotating); the
optimum sits at floor(pi/4 sqrt N) or one below it at every n from 2 to 10. Closed form check:
sin^2((2k+1) theta) with sin theta = 1/sqrt N, worst gap 6.4e-15 on five qubits.

### Oracle queries, quantum against classical

| n | N | classical lookups for a 50 percent chance, N/2 | quantum oracle calls at the optimum | success |
|---|---|---|---|---|
| 2 | 4 | 2 | 1 | 1.0000 |
| 3 | 8 | 4 | 2 | 0.9453 |
| 4 | 16 | 8 | 3 | 0.9613 |
| 5 | 32 | 16 | 4 | 0.9992 |
| 6 | 64 | 32 | 6 | 0.9966 |
| 7 | 128 | 64 | 8 | 0.9956 |
| 8 | 256 | 128 | 12 | 0.9999 |
| 9 | 512 | 256 | 17 | 0.9994 |
| 10 | 1,024 | 512 | 25 | 0.9995 |

N/2 is Grover's own classical figure (lookups for a one-half chance). At ten qubits the quantum
run makes **25** oracle calls against **512**, a factor of about 20, and the factor grows as sqrt N.
This is the only table in the course where quantum wins outright, and it assumes the oracle is free
and the data is already inside the machine. The next table is what that assumption costs.

### The loading tax (declared model: load 1 per row, query cost log2 N per oracle call, k = round(pi/4 sqrt N))

| N rows | quantum, one search (load + search) | classical brute force, one search (N/2) | classical index, one search (N log2 N + log2 N) | searches per load for quantum to beat brute force | searches per load beyond which the classical index beats quantum |
|---|---|---|---|---|---|
| 1,000 | 1,249 (1,000 + 249) | 500 | 9,976 | 4 | 37 |
| 10,000 | 11,050 (10,000 + 1,050) | 5,000 | 132,890 | 3 | 118 |
| 100,000 | 104,119 (100,000 + 4,119) | 50,000 | 1,660,981 | 3 | 380 |
| 1,000,000 | 1,015,646 (1,000,000 + 15,646) | 500,000 | 19,931,589 | 3 | 1,211 |
| 10,000,000 | 10,057,762 | 5,000,000 | 232,534,990 | 3 | 3,854 |
| 12,000,000 (Brindle's customer table) | 12,063,988 (12,000,000 + 63,988) | 6,000,000 | 282,198,396 | 3 | 4,224 |

The one-search row is the fine print in one line: loading N rows costs more than the N/2 lookups a
classical search needed in the first place, so for a single search over fresh classical data the
sqrt N gain is eaten before the first query. If the loaded memory can be searched R times, quantum
beats brute force from R = 3 at every realistic N; but then an honest comparison is against a
classical INDEX built once, and quantum only stays ahead for R below the last column. On Brindle's
12 million rows that window is 3 to 4,224 searches per load. Every column moves if the per-query
cost moves, which is why the calculator exposes it. All of this is a declared model with three
parameters printed on the widget; none of it is a hardware measurement.

### Noise ladder, ten qubits, global depolarising p per gate, at the ideal-optimal depth (k = 25, 1,060 gates)

| p per gate | success at k = 25 | best any depth can do | the depth that does it | uniform floor 1/N |
|---|---|---|---|---|
| 0 | **0.999461** | 0.999461 | 25 | 0.000977 |
| 0.001 | **0.346724** | 0.393189 | 19 | 0.000977 |
| 0.005 | **0.005895** | 0.046121 | 8 | 0.000977 |
| 0.01 | **0.001000** | 0.013693 | 4 | 0.000977 |
| 0.02 | **0.000977** | 0.004457 | 2 | 0.000977 |

At one error per thousand gates the ideal 0.9995 becomes 0.3467. At one per hundred the answer is
the uniform floor to three decimals: the circuit is 1,060 gates deep and (0.99)^1060 is 0.00002.
The "best any depth" column is the honest nuance: under noise the optimum moves EARLIER (k = 4 at
p = 0.01), and even that best is 0.0137, fourteen times the floor and nothing like an answer.

### The anti-lever: add more qubits under non-zero noise

| n | gates at the optimum | ideal success | success at p = 0.005 | success at p = 0.01 |
|---|---|---|---|---|
| 2 | 12 | 1.0000 | 0.9562 | 0.9148 |
| 3 | 31 | 0.9453 | 0.8273 | 0.7257 |
| 4 | 58 | 0.9613 | 0.7346 | 0.5643 |
| 5 | 93 | 0.9992 | 0.6385 | 0.4114 |
| 6 | 162 | 0.9966 | 0.4511 | 0.2082 |
| 7 | 247 | 0.9956 | 0.2942 | 0.0903 |
| 8 | 416 | 0.9999 | 0.1277 | 0.0191 |
| 9 | 655 | 0.9994 | 0.0394 | 0.0033 |
| 10 | 1,060 | 0.9995 | 0.0059 | 0.0010 |

Every added qubit doubles the search space and lengthens the circuit. At p = 0.005 and p = 0.01
the success probability falls at every step from n = 2 to n = 10. It is NOT monotone at every
noise level: at p = 0.001 it rises from 0.9106 (n = 4) to 0.9132 (n = 5), because the ideal
success at the optimal iteration count jumps from 0.9613 to 0.9992 there (engine `noiseLadder`,
checked 2026-10-09). The trend is still down (0.9910 at n = 2, 0.3467 at n = 10). Claim the
anti-lever at p = 0.005 and 0.01, never "under any non-zero noise"; the widget prints the worse number.

### The break button: remove the oracle phase flip

| n | k | success with the oracle | success without it | uniform 1/N |
|---|---|---|---|---|
| 2 | 1 | 1.000000 | 0.250000 | 0.250000 |
| 5 | 4 | 0.999182 | 0.031250 | 0.031250 |
| 10 | 25 | 0.999461 | 0.000977 | 0.000977 |

With no phase flip the diffusion operator maps the uniform state to itself, so Grover finds nothing
and the distribution stays exactly uniform. The bench measures the oracle, not an artifact.

### Sampling (shared PRNG mulberry32; counts identical in node and numpy)

| Circuit | shots | seed | counts in index order | note |
|---|---|---|---|---|
| H on one qubit | 100 | 7 | 43 / 57 | p = 0.5 each; the gap is sampling |
| H on three qubits | 800 | 11 | 115 / 106 / 94 / 106 / 103 / 113 / 77 / 86 | uniform, 100 expected each |
| Bell pair | 1,000 | 7 | 460 / 0 / 0 / 540 | agreement 1.000 |
| Bell pair | 1,000 | 11 | 519 / 0 / 0 / 481 | agreement 1.000 |
| Bell pair | 1,000 | 2026 | 501 / 0 / 0 / 499 | agreement 1.000 |
| Product pair (H, H) | 1,000 | 7 | 220 / 240 / 273 / 267 | agreement 0.487 |
| Product pair (H, H) | 1,000 | 11 | 265 / 254 / 260 / 221 | agreement 0.486 |
| Product pair (H, H) | 1,000 | 2026 | 249 / 252 / 250 / 249 | agreement 0.498 |
| Grover n = 3, target 5, k = 2 | 1,000 | 7 | 12 / 7 / 4 / 3 / 6 / 952 / 8 / 8 | exact p(target) 0.945313 |

The Bell pair agrees 1,000 times in 1,000 on every seed and never once reads 01 or 10; the product
pair agrees about half the time. That difference, measured, is p3's whole subject.

### Derived arithmetic the pages may quote (closed form, not a simulation)

| N | qubits | pi/4 sqrt N | N / 2 | factor |
|---|---|---|---|---|
| 16,777,216 (enough indices for Brindle's 12,000,000 rows) | 24 | 3,217 (3216.99) | 8,388,608 | about 2,600 |

Twenty-four qubits is past the simulator, so these three numbers are arithmetic from the closed
form the engine is checked against, and every page that quotes them says so. The loading-tax row
for 12,000,000 rows uses k = round(pi/4 sqrt 12,000,000) = 2,721 (2720.7) oracle calls per search
at log2 N = 23.5 each, which is where the 63,988 comes from.
