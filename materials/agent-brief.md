# Agent brief - shared by every fan-out page of learn-quantum-with-phoebe

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including that each question has THREE options as `<div class="qopt">` and the
   explanation is `<q class="qwhy">`:
   - Leader track (a2-a6): `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/courses/a1-a-qubit-is-a-vector.html`
   - Practitioner track (p2-p9): `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/courses/p1-a-statevector-simulator-from-scratch.html`
   - The bench page, for any page that quotes a bench number or embeds a widget:
     `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/courses/p10-the-fine-print-bench.html`
2. The source map: every verified fact, its evidence tier, per-session coverage, the seams, and the
   FROZEN CANON tables at the end. Use ONLY its numbers; never invent a statistic; if a fact is
   missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/assets/style.css`
4. The engine API, if your page embeds a widget (the function names and what they return):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-quantum-with-phoebe/assets/qs-live.js`

## Page skeleton (keep every component, in this order, exactly as the template)

`div.toolbar` (crumb EXACTLY `<a href="../index.html">learn-quantum-with-phoebe</a> / Leader session N of 6`
or `/ Practitioner session N of 10`, `#toggle-all`, `#zoom-toggle`) · `header.masthead` (eyebrow
`Learn Quantum with Phoebe · Leader session N of 6` or `· Practitioner session N of 10`, h1 with ONE
`<span class="accent">`, `.sub`, `.chip-row` with the level chip `🟠 Leader track` or
`🔧 Practitioner track` (p10 alone is `🔴 Hardest`), two `.chip.audience`, `.chip.time` 45 min,
`.agenda` a1-a4 with flex weights) · `main.wrap` · `section.section#intro` (klabel "Part 0", h2,
`.lede`, `.legend` three pills as the template, `.callout.win` "★ What you walk out with tonight."
for leader pages or "★ What you walk out with today." for practitioner pages, then 2-3
`details.card`) · `section.section#part-1` and `#part-2` (section-kicker with klabel
"Part N · covers ...", h2, `span.tag.concept "N min live"`; a `.lede`; ONE `figure.zoomable`;
2-4 `details.card`; Part 2 may also carry ONE `.wk` widget if the outline says so) ·
`section.section#part-3` (klabel "Part 3 · build-along", h2, `span.tag.build "N min hands on"`,
`.lede`, `div.steps` of 4-6 `div.step` each `<div><h4>..</h4><p>..</p></div>` on leader pages or
`<h4>..</h4><p>..</p>` plus an optional `div.prompt-box.good` with `span.label` on practitioner
pages, then ONE `.callout.tip` "The habit to keep.") · `section.section#quiz` (klabel "Check
yourself", h2 "Three questions", 3 x `div.quiz-q data-answer="0-based"` each with `p.qtext`, three
`div.qopt` "A · ..." "B · ..." "C · ...", `q.qwhy`; then ONE `div.quiz-score`) ·
`section.section#homework` (klabel "Before session N+1" or "After the course", h2 "Homework",
`.lede`, `div.steps` of 2-3 steps) · `section.section#official` (klabel "Covered tonight", h2
EXACTLY "What this session covers", `.covered` of 8-11 `.covered-row` with `span.status.pill.solid`
✓ / `span.status.pill.inkpill` ◐ / `span.status.pill.light` ○, `span.name`, `span.note`) ·
`section.section#cheatsheet` (klabel "Take this with you", h2 "Cheat sheet", `div.cheat` of
exactly 8 `div.cheat-item` each starting `<strong>Label.</strong>`) · `footer.pagefoot` inside
main · `<script src="../assets/qs-live.js?v=1">` then `<script src="../assets/app.js?v=1">`, then
the page's own widget script and `<style>` block if any.

Head: the template's social meta block with this page's own title, description, url (file name);
`<title>Leader session N · <Title> - learn quantum with phoebe</title>` or `Practitioner session
N · ...`; `<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in `#intro` is `open`, and the first card in each Part is `open`; no other.
Sentence case headings. Warm practitioner voice, concrete, never dry. Inside prompt-boxes escape
`&` `<` `>`. 550 to 700 lines is guidance about depth, never a target: never collapse whitespace,
dissolve a list into a paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches". State the professional
  norm directly with its reason. "Session 5" cross-references are fine; "these sessions" is fine.
- Attribution "by Phoebe Fu" in the footer. Never "built with" a tool.
- Every number comes from the course map's canon tables or is labelled constructed. Brindle is a
  constructed retailer: 12 million customer rows, 4 million order rows, twenty years of encrypted
  backups, an unnamed vendor deck. Say "constructed" at least once per page where Brindle appears.
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
  The hardware timeline is contested: the three stances in the map (Preskill "eventually", NIST
  "even if a decade away", Aaronson "supposing we had one") and NO year for a useful machine.
- Citations in the exact form of the map's appendix. The one tier-B source (Nielsen and Chuang) is
  "reported"; never reproduce its text. NIST IR 8547 is a DRAFT: say "proposed" for 2030 and 2035.
- NO vendor, product, machine, cloud service, framework or library name, no qubit count attributed
  to anyone, no named incident, no roadmap, no coin, token, price or market. Where money appears (a
  pilot budget) add "nothing here is investment advice".
- NEVER "lottery" or "lotteries"; say the mechanism ("a random draw", "decided by the seed").
- Default to the English word. A Chinese term that is genuinely a name carries its English in
  brackets right after it, every occurrence. (None is expected on these pages.)
- Titles, widget ids and class names must not collide with siblings: do not reuse `w3-`, `a1-`,
  `p1-`, `p10-`, `p10a-`, `p10b-`, `p10c-`, `p10d-` ids; prefix your widget ids with your page id
  (`a3-`, `p6-`). Never use the heading "The adoption playbook", "The one-page playbook" or any
  heading from the donor web3 course.
- Gate counts: the engine counts the oracle and the multi-controlled flip as ONE gate each. Any page
  quoting a gate count says this undercounts hardware.
- The noise model is a declared global depolarising channel, one parameter per gate. Any page
  quoting a noisy success probability says "modelled" and that the model flatters hardware.
- The loading tax is a declared model with three parameters (load per row, query cost, searches per
  load). Any page quoting its numbers prints the parameters beside them.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): `#242070` deep · `#3730A3` primary · `#9A97D4` mid ·
`#C9C7EA` soft · `#EEEDF9` tint · `#16153A` ink · `#5A5B7A` muted · `#C9C9DF` faint · `#E4E4F1`
hairline · `#0E7490` contrast cyan · `#E3F3F7` cyan tint · `#0B5A70` cyan ink · `#5F6090` faint
text · `#FBFBFE` paper · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a
wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: page id + letter, e.g. `a3a`, `a3b`,
  `p6a`. `<defs>` holds a wobble filter `id="<prefix>Sk"` (feTurbulence type="fractalNoise"
  baseFrequency="0.02" numOctaves="2" seed="<int>" + feDisplacementMap scale="2.4"
  xChannelSelector="R" yChannelSelector="G", x="-3%" y="-3%" width="106%" height="106%"), a hachure
  pattern `id="<prefix>Hc"` (7 x 7 userSpaceOnUse, patternTransform rotate(-38), one `#3730A3`
  line, opacity .5), an open arrowhead `id="<prefix>Ar"` (path M1 1 L9 5 L1 9, fill none, ink
  stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#<prefix>Sk)" fill="none" stroke="#16153A"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; panel rects carry a tiny
  rotation (under 1 degree, `transform="rotate(-0.3 cx cy)"`), hand-placed items up to 4 degrees.
  Fills: white, `#EEEDF9`, `#E3F3F7`, the hachure for "the pile" or "the data", and `#0E7490` ONLY
  for the one thing the figure is about. One doodle anchor per figure (a tiny die, coin, dial,
  bead), simple strokes, never a mascot. A highlight drawn OVER another painted rect must carry
  `fill="none"` explicitly, or the scanner flags a painted-rect overlap.
- Text classes: `.<prefix>H` 800 12px `#16153A` heading · `.<prefix>L` 600 12px ink label ·
  `.<prefix>S` 400 11px `#5A5B7A` · `.<prefix>B` 800 11px `#0B5A70` · `.<prefix>V` 800 16px
  `#242070` value · `.<prefix>W` 800 12px `#FFFFFF` on a fill · `.<prefix>A` 700 11px `#3730A3`
  caption · `.<prefix>N` 400 12px `#5A5B7A` note. ALL `<text>` OUTSIDE the filtered group, never
  below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; a full-width note at x=30 or
  x=46 under 112 characters; a 16px value is about 10px per character; 40px between neighbouring
  point labels; bottom note 22px below the last row, H clears it by 8px. No path may cross a text
  label; no two labels may overlap. When in doubt, shorten.
- Floor: one figure per Part (Parts 1 and 2) plus one in the build-along for practitioner pages
  (leader pages may put the third figure in Part 2 as a second figure instead). Draw the MECHANISM
  (where the amplitude sits, what the oracle flips, which path the noise scrambles, where the N
  writes go, which system holds which key), never a metaphor literally, never decoration.

## Widgets (only where the outline says so)

Copy the `.wk` shell from the template: `div.wk#<id>` > `div.wk-head` (`<b>Live</b>` +
`span.wk-hint`) > `div.wk-body` (`label.sql-label`, `select.sql-code` or `input.sql-code
type="range"`, `div#<id>-out`, `p.sql-note#<id>-verdict`) > `div.wk-foot#<id>-self`. The script at
the bottom of the page starts `if (typeof QS === "undefined") return;`, calls `QS.selfTest()` and
prints the pass/fail line into `-self` exactly as the template does. Every number the widget
prints must come from the engine at render time; never hard-code a result. The engine API:
`QS.newState(n)`, `QS.applyH/applyX/applyZ(s,q)`, `QS.applyCNOT(s,c,t)`, `QS.applyPhaseFlip(s,i)`,
`QS.hadamardAll(s)`, `QS.diffusion(s)`, `QS.grover(n,target,k,{oracle:bool})`,
`QS.successCurve(n,target,kmax,{oracle:bool})` -> `{p:[], gates:[]}`, `QS.optimalK(n)` ->
`{k,p,kTheory,gates,curve}`, `QS.queryTable(2,10)`, `QS.loadingTax({N,R,loadPerRow,queryCost})`,
`QS.noisySuccess(pIdeal,p,gates,N)`, `QS.noiseLadder(n,[p...])`, `QS.sample(s,shots,seed)` ->
Int32Array counts, `QS.bellPair()`, `QS.productPair()`, `QS.agreement(counts)`, `QS.probs(s)`,
`QS.norm(s)`, `QS.closedForm(n,k)`. Add a page `<style>` block scoped to your widget id as the
template does (`.sql-code` border, range max-width, table font size).

## Voice and honesty

Every Part gets a real-world story in a `.callout.example` with `span.ex-pill` "Real world" (at
least one per page, on a Brindle moment, labelled constructed). The practitioner build-along on a
page with Python prints only outputs that follow from the exact code shown; for anything sampled
with numpy's generator say "your counts will differ". Where the page reaches the timeline, the
answer is the disagreement.

## Cross-links (absolute URLs, use only where the outline names them)

- Key management and access control: https://phoebefu6.github.io/learn-cyber-security-with-phoebe/
- Recommender mechanics: https://phoebefu6.github.io/learn-recommendation-with-phoebe/
- Linear algebra in nets: https://phoebefu6.github.io/learn-deep-learning-with-phoebe/
- Signatures as a mechanism: https://phoebefu6.github.io/learn-blockchain-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Footer left: `<p>Leader session N of 6 · learn-quantum-with-phoebe · by Phoebe Fu</p>` (or
Practitioner session N of 10). Footer right, `nav.pagenav`: `<a href="<prev file>">← <Track>
session N-1 · <Title></a>` (session 1 of a track links `../index.html` "← All sessions") and
`<a href="<next file>"><Track> session N+1 · <Title> →</a>` (a6 and p10 link `../index.html`
"All sessions →").

Leader (exact titles, sentence case, file names):
- a1 A qubit is a vector, a gate is a matrix - `a1-a-qubit-is-a-vector.html`
- a2 Where the speedup actually comes from - `a2-where-the-speedup-comes-from.html`
- a3 The data-loading fine print - `a3-the-data-loading-fine-print.html`
- a4 When the classical algorithm catches up - `a4-when-the-classical-algorithm-catches-up.html`
- a5 Why the data-team playbook breaks here - `a5-why-the-data-team-playbook-breaks-here.html`
- a6 From data team to quantum-ready: the transfer map - `a6-from-data-team-to-quantum-ready.html`

Practitioner:
- p1 A statevector simulator from scratch - `p1-a-statevector-simulator-from-scratch.html`
- p2 Gates as matrices - `p2-gates-as-matrices.html`
- p3 Entanglement, measured - `p3-entanglement-measured.html`
- p4 Grover step by step - `p4-grover-step-by-step.html`
- p5 Counting queries - `p5-counting-queries.html`
- p6 The loading-tax calculator - `p6-the-loading-tax-calculator.html`
- p7 A noisy circuit - `p7-a-noisy-circuit.html`
- p8 Reading a speedup claim - `p8-reading-a-speedup-claim.html`
- p9 The post-quantum inventory - `p9-the-post-quantum-inventory.html`
- p10 The fine-print bench - `p10-the-fine-print-bench.html`
