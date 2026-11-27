// More cards, added after a tutoring session: gaps found by going through all 526 questions.
// Needs cards.js (KP) first.
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';
  const C = (o) => Object.assign({ v: 2 }, o);

  // ---------- pictures ----------
  const picLikeTerms = (() => {
    // box method for (x + 3)(2x − 5)
    const x0 = 70, y0 = 42, cw = 74, ch = 32;
    let s = K.t(10, 18, '(x + 3)(2x − 5): every term × every term', { s: 12, b: true });
    s += K.t(x0 + cw / 2, y0 - 6, '2x', { a: 'middle', b: true, c: blue }) + K.t(x0 + cw * 1.5, y0 - 6, '−5', { a: 'middle', b: true, c: blue });
    s += K.t(x0 - 12, y0 + ch / 2 + 4, 'x', { a: 'end', b: true, c: orange }) + K.t(x0 - 12, y0 + ch * 1.5 + 4, '+3', { a: 'end', b: true, c: orange });
    const cells = [['2x²', '−5x'], ['6x', '−15']];
    cells.forEach((row, r) => row.forEach((v, c) => {
      const like = (r === 0 && c === 1) || (r === 1 && c === 0);
      s += K.rect(x0 + c * cw, y0 + r * ch, cw, ch, { f: like ? '#fef3c7' : '#f9fafb', c: '#9ca3af' }) + K.t(x0 + c * cw + cw / 2, y0 + r * ch + ch / 2 + 5, v, { a: 'middle', b: true, s: 13 });
    }));
    s += K.t(232, 62, '−5x + 6x = x', { s: 12, b: true, c: orange }) + K.t(232, 84, '= 2x² + x − 15', { s: 13, b: true, c: green });
    s += K.t(10, 128, 'Minus in front: −(−3x² + 2x − 7) = +3x² − 2x + 7', { s: 12, b: true, c: red });
    s += K.t(10, 148, 'Like terms = same letter AND same power: 5x² + 3x² = 8x²', { s: 11.5, c: '#374151' });
    return K.svg(360, 158, s);
  })();

  const picRationalOps = K.svg(360, 150,
    K.t(10, 18, 'One denominator: multiply across', { s: 12, b: true }) +
    K.t(10, 44, '4/(4x−5) − 1/(x+1)', { s: 13, b: true }) +
    K.t(10, 66, '= [4(x+1) − 1(4x−5)] / [(4x−5)(x+1)]', { s: 12, c: blue, b: true }) +
    K.t(10, 88, '= (4x + 4 − 4x + 5) / … = 9 / [(4x−5)(x+1)]', { s: 12, c: green, b: true }) +
    K.t(10, 116, 'Cancel only FACTORS:', { s: 12, b: true, c: red }) +
    K.t(150, 116, '(x+7)(x−1) / (x+7) = x − 1', { s: 12, b: true }) +
    K.t(10, 138, '(x + 6)/(x + 3) ≠ 6/3 — those are terms, not factors', { s: 11.5, c: red }));

  const picPercentChain = (() => {
    let s = K.t(10, 18, 'b is 80% less than 24;  a is 190% greater than b', { s: 12, b: true });
    const box = (x, v, c) => K.rect(x, 40, 70, 32, { f: '#f9fafb', c, r: 6 }) + K.t(x + 35, 61, v, { a: 'middle', b: true, s: 14, c });
    s += box(10, '24', '#111') + box(145, '4.8', blue) + box(280, '13.92', green);
    s += K.l(82, 56, 141, 56, { c: blue, w: 2 }) + K.t(112, 50, '× 0.2', { a: 'middle', b: true, c: blue, s: 12 }) + K.t(112, 88, '−80%', { a: 'middle', c: blue, s: 11 });
    s += K.l(217, 56, 276, 56, { c: green, w: 2 }) + K.t(247, 50, '× 2.9', { a: 'middle', b: true, c: green, s: 12 }) + K.t(247, 88, '+190%', { a: 'middle', c: green, s: 11 });
    s += K.t(10, 116, '"p% greater than" → × (1 + p/100)     "p% of" → × p/100', { s: 11.5, b: true });
    s += K.t(10, 138, '40% of the 30% → 0.4 × 0.3 = 0.12 = 12% of all', { s: 11.5, c: orange, b: true });
    return K.svg(360, 148, s);
  })();

  const picBasicArea = (() => {
    let s = K.rect(14, 24, 130, 70, { f: '#eff6ff', c: blue, w: 2 }) + K.t(79, 18, 'l = 9', { a: 'middle', b: true, c: blue }) + K.t(150, 64, 'w = 7', { b: true, c: blue });
    s += K.t(79, 56, 'A = l·w = 63', { a: 'middle', b: true, s: 12.5 }) + K.t(79, 76, 'P = 2l + 2w = 32', { a: 'middle', b: true, s: 12.5, c: orange });
    const T = [[230, 94], [345, 94], [262, 26]];
    s += K.poly(T, { f: '#fef2f2', c: red, w: 2 }) + K.l(262, 26, 262, 94, { c: gray, d: '4 3' }) + K.ra([262, 94], [262, 26], [345, 94], 8);
    s += K.t(236, 56, '4', { b: true, c: red }) + K.t(312, 56, '7', { b: true, c: red }) + K.t(287, 110, '?', { a: 'middle', b: true, c: red });
    s += K.t(10, 128, 'Perimeter = add the sides:  17 − 4 − 7 = 6', { s: 12, b: true, c: red });
    s += K.t(10, 148, 'Square: A = s², P = 4s.  Area 64 → side √64 = 8', { s: 12, b: true });
    return K.svg(360, 156, s);
  })();

  const picFreq = (() => {
    const vals = [1, 2, 3, 4], cnt = [2, 5, 2, 1], X = i => 36 + i * 42, Y = c => 112 - c * 17;
    let s = K.l(20, 112, 200, 112, { c: gray }) + K.l(20, 112, 20, 20, { c: gray });
    vals.forEach((v, i) => {
      s += K.rect(X(i) - 14, Y(cnt[i]), 28, 112 - Y(cnt[i]), { f: '#dbeafe', c: blue }) + K.t(X(i), 126, v, { a: 'middle', b: true });
      s += K.t(X(i), Y(cnt[i]) - 4, cnt[i], { a: 'middle', s: 11, c: blue, b: true });
    });
    s += K.t(110, 142, 'value', { a: 'middle', s: 10.5, c: gray }) + K.t(10, 16, 'count', { s: 10.5, c: gray });
    s += K.t(214, 30, 'value × count', { s: 11.5, b: true }) + K.t(214, 50, '1·2 + 2·5 + 3·2 + 4·1', { s: 11.5 }) + K.t(214, 70, '= 22  (total)', { s: 12, b: true, c: green });
    s += K.t(214, 96, 'n = 2+5+2+1 = 10', { s: 12, b: true, c: orange }) + K.t(214, 120, 'mean = 22/10 = 2.2', { s: 13, b: true, c: green });
    return K.svg(360, 150, s);
  })();

  const picSkew = (() => {
    const data = [2, 3, 3, 4, 4, 4, 5, 5, 6, 14], X = v => 20 + v * 22;
    let s = K.l(20, 92, 340, 92, { c: gray }) + [0, 2, 4, 6, 8, 10, 12, 14].map(v => K.t(X(v), 106, v, { a: 'middle', s: 9.5, c: gray })).join('');
    const seen = {};
    data.forEach(v => { seen[v] = (seen[v] || 0) + 1; s += K.dot(X(v), 92 - seen[v] * 11, v === 14 ? red : '#111', 4.5); });
    const median = 4, mean = 5;
    s += K.l(X(median), 24, X(median), 92, { c: blue, w: 2, d: '5 3' }) + K.t(X(median) - 4, 20, 'median 4', { a: 'end', b: true, c: blue, s: 11.5 });
    s += K.l(X(mean), 24, X(mean), 92, { c: green, w: 2 }) + K.t(X(mean) + 4, 20, 'mean 5', { b: true, c: green, s: 11.5 });
    s += K.t(X(14), 66, 'outlier', { a: 'middle', b: true, c: red, s: 11 });
    s += K.t(10, 128, 'Tail to the right → mean > median', { s: 12, b: true });
    s += K.t(10, 146, 'Remove the 14: mean drops to 4, median stays 4', { s: 11.5, c: '#374151' });
    return K.svg(360, 154, s);
  })();

  const cards = [
    C({ id: 'k_like_terms', topic: 'advanced', badge: 'memo', title: 'Simplify: distribute, combine like terms, watch the minus',
      keywords: 'equivalent expression simplify combine like terms distribute distributive property foil multiply polynomials box method subtract polynomials minus sign',
      see: [R`"Which expression is equivalent to $(2x^2-4)-(-3x^2+2x-7)$?"`, R`"Which is equivalent to $3(x+5)-6$?"`],
      pic: picLikeTerms,
      formula: [R`$$a(b + c) = ab + ac \qquad -(b - c) = -b + c$$`, R`$$(x+3)(2x-5) = 2x^2 - 5x + 6x - 15 = 2x^2 + x - 15$$`],
      steps: [
        R`Distribute first. A minus in front of parentheses flips the sign of <b>every</b> term inside.`,
        R`Like terms have the same letter <b>and</b> the same power ($x^2$ with $x^2$, $x$ with $x$). Add their numbers; the power stays.`,
        R`Two parentheses multiplied: every term times every term (the box), then combine.`
      ],
      example: { q: R`$(2x^2-4)-(-3x^2+2x-7)$`, a: [R`$2x^2 - 4 + 3x^2 - 2x + 7$`, R`$5x^2 - 2x + 3$`] },
      trap: R`$5x^2 + 3x^2 = 8x^2$, not $8x^4$: adding never changes the power.`,
      desmos: { lines: [
        { show: 'y = (2x^2 − 4) − (−3x^2 + 2x − 7)', latex: R`y=\left(2x^2-4\right)-\left(-3x^2+2x-7\right)` },
        { show: 'y = 5x^2 − 2x + 3', latex: R`y=5x^2-2x+3` }],
        tip: 'Graph the question and an answer choice: if the two curves sit exactly on top of each other, they are equivalent.' } }),

    C({ id: 'k_rational_ops', topic: 'advanced', badge: 'partly', title: 'Fractions with x: one denominator, cancel only factors',
      keywords: 'rational expression fraction add subtract common denominator simplify cancel factor divide polynomial long division equivalent',
      see: [R`"Which is equivalent to $\frac{4}{4x-5} - \frac{1}{x+1}$?"`, R`"$\frac{x^2+6x-7}{x+7} = ax + d$ for all $x \ne -7$…"`],
      pic: picRationalOps,
      formula: [R`$$\frac{a}{b} \pm \frac{c}{d} = \frac{ad \pm bc}{bd}$$`, R`$$\frac{x^2+6x-7}{x+7} = \frac{(x+7)(x-1)}{x+7} = x - 1$$`],
      steps: [
        R`Add/subtract: multiply across to one denominator; the tops become $ad \pm bc$. Put the second top in parentheses before subtracting.`,
        R`Simplify: factor the top and the bottom, then cancel a factor that appears in both.`,
        R`If nothing factors, divide (long division) or check the choices in Desmos.`
      ],
      example: { q: R`$\frac{4}{4x-5} - \frac{1}{x+1}$`, a: [R`$\frac{4(x+1) - (4x-5)}{(4x-5)(x+1)}$`, R`$= \frac{9}{(4x-5)(x+1)}$`] },
      trap: R`You can cancel things that are multiplied (factors), never things that are added: $\frac{x+6}{x+3} \ne \frac{6}{3}$.`,
      desmos: { lines: [
        { show: 'y = 4/(4x−5) − 1/(x+1)', latex: R`y=\frac{4}{4x-5}-\frac{1}{x+1}` },
        { show: 'y = 9/((4x−5)(x+1))', latex: R`y=\frac{9}{\left(4x-5\right)\left(x+1\right)}` }],
        tip: 'Same graph = equivalent. Holes or undefined points do not show up as differences.' } }),

    C({ id: 'k_percent_chain', topic: 'ratios', badge: 'partly', title: 'Percent chains: every % becomes a multiplier',
      keywords: 'percent chain percent of a percent greater than less than successive percent multiplier compound percent',
      see: [R`"$a$ is $70\%$ less than $b$. $c$ is $80\%$ greater than $a$…"`, R`"$40\%$ of the items are red. Of the red items, $30\%$ have stripes…"`],
      pic: picPercentChain,
      formula: [R`$$p\%\text{ greater than} \to \times\left(1 + \tfrac{p}{100}\right) \qquad p\%\text{ less than} \to \times\left(1 - \tfrac{p}{100}\right)$$`, R`$$p\%\text{ of} \to \times\tfrac{p}{100}$$`],
      steps: [
        R`Write each sentence as <b>new = multiplier × base</b>. The base is the number after "than" or "of".`,
        R`Chain the multipliers in order (start from the number you know).`,
        R`Going backwards (find the start)? Divide by the multiplier.`
      ],
      example: { q: R`$b$ is $80\%$ less than $24$; $a$ is $190\%$ greater than $b$. Find $a$.`, a: [R`$b = 0.2 \cdot 24 = 4.8$`, R`$a = 2.9 \cdot 4.8 = 13.92$`] },
      trap: R`"$190\%$ <b>greater than</b>" is $\times 2.9$; "$190\%$ <b>of</b>" is $\times 1.9$.` }),

    C({ id: 'k_basic_area', topic: 'geometry', badge: 'sheet', title: 'Rectangles, squares & triangles: area & perimeter',
      keywords: 'area perimeter rectangle square triangle side length width length missing side square units',
      see: [R`"The perimeter of triangle $ABC$ is $17$, $AB = 4$, $AC = 7$. Find $BC$."`, R`"A rectangle has area $63$ and length $9$. What is the width?"`],
      pic: picBasicArea,
      formula: [R`$$\text{rectangle: } A = lw,\ \ P = 2l + 2w \qquad \text{square: } A = s^2,\ \ P = 4s$$`, R`$$\text{triangle: } A = \tfrac12 bh,\ \ P = a + b + c$$`],
      steps: [
        R`Perimeter = the distance around: add all the sides.`,
        R`Area = the space inside, in square units.`,
        R`Missing side: from a perimeter subtract the known sides; from an area divide ($w = A \div l$, square side $= \sqrt{A}$).`
      ],
      example: { q: R`Perimeter $17$; two sides are $4$ and $7$. Third side?`, a: [R`$17 - 4 - 7 = 6$`] },
      trap: R`Square with area $64$: the side is $\sqrt{64} = 8$, not $64 \div 4 = 16$ (that's for a perimeter).` }),

    C({ id: 'k_freq_table', topic: 'data', badge: 'memo', title: 'Mean from a bar graph, frequency table or dot plot',
      keywords: 'frequency table bar graph histogram dot plot mean average weighted mean count total number of values',
      see: [R`"The bar graph shows the number of walnuts per container for $20$ containers. What is the mean?"`, R`"The frequency table summarizes $57$ data values…"`],
      pic: picFreq,
      formula: R`$$\text{mean} = \frac{\sum(\text{value} \times \text{count})}{\sum \text{count}}$$`,
      steps: [
        R`Multiply each value by how many times it appears; add the products. That's the total.`,
        R`Divide by the number of data values (add up the counts), not by the number of bars.`,
        R`Median: it's at position $\frac{n+1}{2}$. Count up with running totals.`
      ],
      example: { q: R`Values $1, 2, 3, 4$ with counts $2, 5, 2, 1$`, a: [R`total $= 2 + 10 + 6 + 4 = 22$, $n = 10$`, R`mean $= 2.2$; median: 5th and 6th values are both $2$ → $2$`] },
      trap: R`Divide by the total count ($10$), not by the number of bars ($4$).`,
      desmos: { lines: [
        { show: 'V = [1,2,3,4]', latex: R`V=\left[1,2,3,4\right]` },
        { show: 'C = [2,5,2,1]', latex: R`C=\left[2,5,2,1\right]` },
        { show: 'total(V·C) / total(C)', latex: R`\frac{\operatorname{total}\left(V\cdot C\right)}{\operatorname{total}\left(C\right)}` }],
        tip: 'V = the values, C = the counts. V·C multiplies them pair by pair.' } }),

    C({ id: 'k_skew', topic: 'data', badge: 'partly', title: 'Mean vs median: outliers pull the mean',
      keywords: 'mean greater than median skew outlier extreme value tail symmetric remove value add value which is greater',
      see: [R`"For which data set is the mean greater than the median?"`, R`"Data set B is data set A with the value $100$ added. Which statement is true?"`],
      pic: picSkew,
      formula: R`$$\text{tail on the right} \Rightarrow \text{mean} > \text{median} \qquad \text{tail on the left} \Rightarrow \text{mean} < \text{median}$$`,
      steps: [
        R`An extreme value drags the mean toward it; the median hardly moves.`,
        R`Symmetric data: mean $\approx$ median.`,
        R`Add or remove an outlier: the mean, range and standard deviation change a lot; the median moves at most a little.`
      ],
      example: { q: R`$5, 5, 5, 5, 100$`, a: [R`median $= 5$`, R`mean $= \frac{120}{5} = 24$ → mean $>$ median`] },
      trap: R`Don't compute everything: on the SAT, "which is greater" questions are usually answered by looking where the tail is.` })
  ];

  // ---------- second batch ----------
  const picLiteral = K.svg(360, 132,
    K.t(10, 22, 'F = (9/5)C + 32', { s: 15, b: true }) + K.t(190, 22, 'undo + 32 first:', { s: 11.5, c: gray }) +
    K.t(10, 52, 'F − 32 = (9/5)C', { s: 15, b: true, c: blue }) + K.t(190, 52, '− 32 on both sides', { s: 11.5, c: blue }) +
    K.t(10, 82, 'C = (5/9)(F − 32)', { s: 15, b: true, c: green }) + K.t(190, 82, '× 5/9 on both sides', { s: 11.5, c: green }) +
    K.t(10, 116, 'Other letters = just numbers. Undo in reverse order.', { s: 12, b: true, c: orange }));

  const picInterpret = K.svg(360, 150,
    K.t(10, 26, 'C = 25 + 4h', { s: 17, b: true }) +
    K.l(73, 32, 73, 46, { c: orange }) + K.t(40, 62, 'start / fixed fee', { s: 11.5, b: true, c: orange }) + K.t(40, 76, '(cost when h = 0)', { s: 10.5, c: gray }) +
    K.l(100, 32, 150, 46, { c: blue }) + K.t(150, 62, 'per 1 hour', { s: 11.5, b: true, c: blue }) + K.t(150, 76, '(+4 for each extra hour)', { s: 10.5, c: gray }) +
    K.t(10, 108, 'P = 800(1.03)ᵗ', { s: 17, b: true }) + K.t(160, 100, '800 = amount at t = 0', { s: 11.5, b: true, c: orange }) +
    K.t(160, 118, '1.03 = grows 3% each period', { s: 11.5, b: true, c: green }) + K.t(160, 136, '0.85 would be −15% each period', { s: 10.5, c: gray }));

  const picWords = (() => {
    const rows = [['5 more than x', 'x + 5'], ['5 less than x', 'x − 5  (order!)'], ['twice / double x', '2x'], ['at least 10', '≥ 10'], ['at most / no more than 10', '≤ 10'], ['$3 each for n items', '3n'], ['total / altogether', 'add']];
    let s = '';
    rows.forEach(([a, b], i) => { const y = 18 + i * 19; s += K.t(10, y, a, { s: 12 }) + K.t(196, y, '→  ' + b, { s: 12, b: true, c: i === 1 ? red : blue }); });
    return K.svg(360, 146, s);
  })();

  const picFractions = (() => {
    const bar = (x, y, n, k, c) => { let s = ''; for (let i = 0; i < n; i++) s += K.rect(x + i * (120 / n), y, 120 / n, 22, { f: i < k ? c : '#fff', c: '#9ca3af', w: 1 }); return s; };
    let s = K.t(10, 16, '2/3 + 3/4: make the pieces the same size', { s: 12, b: true });
    s += bar(10, 26, 3, 2, '#dbeafe') + K.t(140, 42, '2/3 = 8/12', { s: 12, b: true, c: blue });
    s += bar(10, 56, 4, 3, '#fee2e2') + K.t(140, 72, '3/4 = 9/12', { s: 12, b: true, c: red });
    s += K.t(250, 58, '= 17/12', { s: 15, b: true, c: green });
    s += K.t(10, 104, 'Divide: keep, change, flip', { s: 12, b: true }) + K.t(10, 124, '(2/3) ÷ (4/5) = (2/3) × (5/4) = 10/12 = 5/6', { s: 12, c: '#374151' });
    return K.svg(360, 134, s);
  })();

  const picProb = (() => {
    let s = K.c(80, 70, 58, { f: '#f9fafb', c: '#9ca3af' });
    const cols = [...Array(8).fill('#e5e7eb'), ...Array(2).fill('#f97316'), ...Array(10).fill('#92400e')];
    cols.forEach((c, i) => { const a = i * 2.4, r = 12 + (i % 4) * 11; s += K.dot(80 + r * Math.cos(a), 70 + r * Math.sin(a), c, 6); });
    s += K.t(160, 30, '8 white, 2 orange, 10 brown', { s: 12, b: true }) + K.t(160, 54, 'P(orange) = 2/20 = 1/10', { s: 12.5, b: true, c: orange });
    s += K.t(160, 78, 'P(not brown) = 1 − 10/20 = 1/2', { s: 12.5, b: true, c: blue }) + K.t(160, 102, 'Draw 200 times → expect', { s: 12, c: '#374151' }) + K.t(160, 120, '200 × 1/10 = 20 orange', { s: 12.5, b: true, c: green });
    return K.svg(360, 140, s);
  })();

  const picComposite = K.svg(360, 140,
    '<defs><pattern id="hatchC" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill="#bfdbfe"/></pattern></defs>' +
    K.rect(14, 14, 110, 110, { f: 'url(#hatchC)', c: blue, w: 2 }) + K.c(69, 69, 55, { f: '#fff', c: '#111', w: 2 }) +
    K.l(69, 69, 124, 69, { c: red, w: 2 }) + K.t(96, 64, 'r = 5', { a: 'middle', s: 11, b: true, c: red }) + K.t(69, 138, 'side = 10', { a: 'middle', s: 11, b: true, c: blue }) +
    K.t(140, 34, 'shaded = square − circle', { s: 12.5, b: true }) + K.t(140, 60, '= 10² − π·5²', { s: 13, b: true, c: blue }) +
    K.t(140, 84, '= 100 − 25π ≈ 21.5', { s: 13, b: true, c: green }) + K.t(140, 112, 'inscribed circle: d = side', { s: 11.5, c: red, b: true }));

  const picCongruent = (() => {
    const A = [20, 110], B = [60, 30], Cc = [140, 110], D = [200, 110], E = [240, 30], F = [320, 110];
    let s = K.poly([A, B, Cc], { f: '#eff6ff', c: blue, w: 2 }) + K.poly([D, E, F], { f: '#eff6ff', c: blue, w: 2 });
    s += K.t(12, 124, 'A', { b: true }) + K.t(56, 24, 'B', { b: true }) + K.t(142, 124, 'C', { b: true });
    s += K.t(192, 124, 'D', { b: true }) + K.t(236, 24, 'E', { b: true }) + K.t(322, 124, 'F', { b: true });
    s += K.arc(20, 110, 16, 0, 63, { c: red, w: 2 }) + K.arc(200, 110, 16, 0, 63, { c: red, w: 2 });
    s += K.t(180, 18, 'ABC ≅ DEF', { a: 'middle', b: true, s: 13 }) + K.t(180, 140, 'A↔D, B↔E, C↔F: same order = matching parts', { a: 'middle', s: 11.5, c: '#374151', b: true });
    return K.svg(360, 148, s);
  })();

  const picIso = (() => {
    const A = [120, 18], B = [40, 128], Cc = [200, 128];
    let s = K.poly([A, B, Cc], { f: '#fef3c7', c: orange, w: 2 });
    s += K.l(76, 70, 86, 76, { c: '#111', w: 2 }) + K.l(154, 76, 164, 70, { c: '#111', w: 2 }); // tick marks on equal sides
    s += K.arc(40, 128, 18, 0, 54, { c: blue, w: 2 }) + K.arc(200, 128, 18, 126, 180, { c: blue, w: 2 });
    s += K.t(64, 122, '67°', { b: true, c: blue, s: 12 }) + K.t(158, 122, '67°', { b: true, c: blue, s: 12 }) + K.t(120, 44, '46°', { a: 'middle', b: true, c: red, s: 12 });
    s += K.t(112, 14, 'A', { b: true }) + K.t(28, 140, 'B', { b: true }) + K.t(204, 140, 'C', { b: true });
    s += K.t(222, 40, 'AB = AC', { s: 12.5, b: true }) + K.t(222, 62, '→ ∠B = ∠C', { s: 12.5, b: true, c: blue }) + K.t(222, 92, 'top = 180 − 2·67', { s: 12, c: red, b: true }) + K.t(222, 110, '= 46°', { s: 12, c: red, b: true });
    return K.svg(360, 146, s);
  })();

  const picDmIneq = (() => {
    const p = K.plot({ x0: -1, x1: 6, y0: -1, y1: 8, xt: 1, yt: 1, w: 360, h: 190, l: 22 });
    // region y < 2x + 1 (below) and y > -x + 4 (above): overlap polygon
    p.shade([[1, 3], [3.5, 8], [6, 8], [6, -1], [5, -1]], 'rgba(37,99,235,0.18)');
    p.fn(x => 2 * x + 1, { c: blue, d: '6 4' }).fn(x => -x + 4, { c: red, d: '6 4' });
    p.pt(3, 2, { c: green, label: '(3, 2) ✓', s: 12 });
    p.txt(3.6, 7.3, 'y < 2x + 1', { c: blue, b: true, s: 11.5 }).txt(0.15, 5.3, 'y > −x + 4', { c: red, b: true, s: 11.5 });
    return p.svg();
  })();

  const picQuad = (() => {
    const p = K.plot({ x0: 0, x1: 4.6, y0: 0, y1: 80, xt: 1, yt: 20, w: 360, h: 180, l: 28 });
    p.fn(x => -16 * x * x + 64 * x + 5, { c: blue });
    p.pt(2, 69, { c: green, label: 'top (2, 69)', dx: -30, dy: -9 }).pt(0, 5, { c: orange, label: 'start 5', dx: 8, dy: -4 }).pt(4.08, 0, { c: red, label: 'lands ≈ 4.08', a: 'end', dx: -10, dy: -22 });
    return p.svg();
  })();

  cards.push(
    C({ id: 'k_literal', topic: 'linear', badge: 'memo', title: 'Solve a formula for one letter',
      keywords: 'solve for in terms of formula rearrange isolate variable literal equation express',
      see: [R`"$F = \frac95C + 32$. Which equation gives $C$ in terms of $F$?"`, R`"$A = \frac12h(b_1 + b_2)$. Solve for $h$."`],
      pic: picLiteral,
      formula: R`$$F = \tfrac95C + 32 \ \Rightarrow\ F - 32 = \tfrac95C \ \Rightarrow\ C = \tfrac59(F - 32)$$`,
      steps: [
        R`Treat every other letter as if it were a number.`,
        R`Undo in reverse order: first $+$ and $-$, then $\times$ and $\div$, then powers and roots.`,
        R`Letter appears twice? Get both terms on one side and factor it out: $ax + bx = c \Rightarrow x = \frac{c}{a+b}$.`
      ],
      example: { q: R`$A = \frac12 h(b_1 + b_2)$, solve for $h$`, a: [R`$2A = h(b_1 + b_2)$`, R`$h = \frac{2A}{b_1 + b_2}$`] },
      trap: R`Do it to the whole side: from $F - 32 = \frac95C$ multiply <b>all of</b> $F - 32$ by $\frac59$.` }),

    C({ id: 'k_interpret', topic: 'linear', badge: 'memo', title: 'What does this number mean? Constants in context',
      keywords: 'interpret meaning represents best interpretation context constant slope intercept initial value growth factor what does the number',
      see: [R`"In $C = 25 + 4h$, what does $4$ represent?"`, R`"$P = 800(1.03)^t$. What is the best interpretation of $1.03$?"`],
      pic: picInterpret,
      formula: [R`$$y = mx + b:\quad b = \text{start},\ \ m = \text{per } 1 \text{ of } x$$`, R`$$y = a(1 + r)^t:\quad a = \text{start},\ \ r = \%\text{ per period}$$`],
      steps: [
        R`Plug in $0$ for the variable: what's left is the starting value.`,
        R`Ask "what happens when $x$ goes up by $1$?": that's the rate, with units "per $x$".`,
        R`Exponential base: $1.03 \to +3\%$ each period, $0.85 \to -15\%$ each period.`
      ],
      example: { q: R`$C = 25 + 4h$ (bike rental for $h$ hours)`, a: [R`$25$: fixed fee (cost at $h = 0$)`, R`$4$: dollars for each extra hour`] },
      trap: R`$(1.03)^t$ means $3\%$ growth, not $103\%$. And the units matter: "per hour", not "hours".` }),

    C({ id: 'k_words_to_eq', topic: 'linear', badge: 'memo', title: 'Word problems → equations: phrase by phrase',
      keywords: 'word problem translate equation expression more than less than at least at most per each total tickets cost system setup',
      see: [R`"A plumber charges $\$50$ plus $\$30$ per hour…"`, R`"Adult tickets cost $\$8$, child tickets $\$5$; $120$ tickets were sold for $\$780$…"`],
      pic: picWords,
      formula: R`$$\text{total} = \text{fixed part} + (\text{rate}) \times (\text{how many})$$`,
      steps: [
        R`Name the unknowns with letters ($a$ = adult tickets, $k$ = child tickets).`,
        R`One equation per fact: usually a <b>count</b> equation and a <b>money</b> equation.`,
        R`Check units: dollars $=$ (dollars per ticket) $\times$ tickets.`
      ],
      example: { q: R`$120$ tickets, $\$8$ adult, $\$5$ child, $\$780$ total. Adults?`, a: [R`$a + k = 120,\quad 8a + 5k = 780$`, R`$8a + 5(120 - a) = 780 \Rightarrow 3a = 180 \Rightarrow a = 60$`] },
      trap: R`"$5$ less than $x$" is $x - 5$, not $5 - x$.` }),

    C({ id: 'k_fractions', topic: 'strategy', badge: 'memo', title: 'Fractions without panic: add, multiply, divide',
      keywords: 'fraction add subtract multiply divide common denominator keep change flip reciprocal clear fractions lcd decimal',
      see: [R`"What is $\frac23 + \frac34$?"`, R`"$\frac{x}{3} + \frac{x}{4} = 7$. What is $x$?"`],
      pic: picFractions,
      formula: R`$$\frac ab + \frac cd = \frac{ad + bc}{bd} \qquad \frac ab \cdot \frac cd = \frac{ac}{bd} \qquad \frac ab \div \frac cd = \frac ab \cdot \frac dc$$`,
      steps: [
        R`Add/subtract: same denominator first, then add the tops.`,
        R`Multiply: straight across (cancel first if you can).`,
        R`Divide: keep, change, flip. Equation full of fractions: multiply both sides by the common denominator to clear them.`
      ],
      example: { q: R`$\frac{x}{3} + \frac{x}{4} = 7$`, a: [R`$\times 12$: $4x + 3x = 84$`, R`$x = 12$`] },
      trap: R`$\frac23 + \frac34 \ne \frac57$: never add the bottoms.` }),

    C({ id: 'k_prob_basic', topic: 'data', badge: 'memo', title: 'Probability basics: favorable ÷ total',
      keywords: 'probability chosen at random favorable total not complement expected number outcomes fair die marbles',
      see: [R`"A bag has $8$ white, $2$ orange and $10$ brown buttons. What is the probability of orange?"`, R`"$29$ out of every $100$ beads are defective. How many in $1{,}000$?"`],
      pic: picProb,
      formula: [R`$$P = \frac{\text{favorable}}{\text{total}} \qquad P(\text{not } A) = 1 - P(A)$$`, R`$$\text{expected count} = P \times \text{number of tries}$$`],
      steps: [
        R`Count the total first, then only the outcomes the question asks about.`,
        R`"Not" → $1$ minus the probability.`,
        R`"How many would you expect" → probability $\times$ how many.`
      ],
      example: { q: R`$8$ white, $2$ orange, $10$ brown. P(not brown)?`, a: [R`total $= 20$`, R`$1 - \frac{10}{20} = \frac12$`] },
      trap: R`A probability is never more than $1$. If you get $\frac{20}{8}$, it's upside down.` }),

    C({ id: 'k_composite', topic: 'geometry', badge: 'partly', title: 'Shaded regions: big area minus small area',
      keywords: 'shaded region composite figure area inscribed circle square subtract add pieces l-shape',
      see: [R`"A circle is inscribed in a square with side $10$. What is the area of the shaded region?"`],
      pic: picComposite,
      formula: R`$$\text{shaded} = \text{outer area} - \text{inner area}$$`,
      steps: [
        R`Name the outer shape and the cut-out shape.`,
        R`Find each area with the reference-sheet formulas; look for a shared length (circle's diameter = square's side).`,
        R`Subtract. For an L-shape, cut it into rectangles and add.`
      ],
      example: { q: R`Circle inscribed in a square of side $10$`, a: [R`$10^2 - \pi \cdot 5^2 = 100 - 25\pi \approx 21.5$`] },
      trap: R`Inscribed circle: the radius is half the side, not the side.` }),

    C({ id: 'k_congruent', topic: 'geometry', badge: 'partly', title: 'Congruent triangles: same size, same shape',
      keywords: 'congruent triangles corresponding parts sss sas asa aas hl prove sufficient information',
      see: [R`"Triangles $ABC$ and $DEF$ are congruent, where $A$ corresponds to $D$… What is the measure of angle $F$?"`, R`"Which additional information is sufficient to prove the triangles congruent?"`],
      pic: picCongruent,
      formula: [R`$$\triangle ABC \cong \triangle DEF \Rightarrow AB = DE,\ \ \angle A = \angle D,\ \dots$$`, R`$$\text{enough to prove: SSS, SAS, ASA, AAS, HL (right triangles)}$$`],
      steps: [
        R`Letter order tells you which parts match: 1st ↔ 1st, 2nd ↔ 2nd, 3rd ↔ 3rd.`,
        R`Congruent = every matching side and angle is equal. (Similar = same angles, sides in a ratio.)`,
        R`AAA proves only similar, and SSA proves nothing.`
      ],
      example: { q: R`$\triangle ABC \cong \triangle DEF$, $\angle B = 90^\circ$, $\angle A = 35^\circ$. Find $\angle F$.`, a: [R`$F \leftrightarrow C$`, R`$\angle C = 180 - 90 - 35 = 55^\circ$, so $\angle F = 55^\circ$`] },
      trap: R`Match by the letter order, not by how the pictures are turned.` }),

    C({ id: 'k_isosceles', topic: 'geometry', badge: 'memo', title: 'Isosceles triangles: equal sides ↔ equal angles',
      keywords: 'isosceles triangle equal sides base angles equal legs vertex angle two sides equal',
      see: [R`"In the triangle, $AB = AC$ and angle $ABC$ measures $67^\circ$. What is $x$?"`, R`"In the figure, $RT = TU$… What is the value of $x$?"`],
      pic: picIso,
      formula: R`$$AB = AC \iff \angle B = \angle C \qquad \text{top} = 180^\circ - 2\cdot\text{base}$$`,
      steps: [
        R`Equal sides face equal angles: the two base angles (the ones touching the third side).`,
        R`Know a base angle $b$: top $= 180 - 2b$. Know the top $t$: each base $= \frac{180 - t}{2}$.`,
        R`Two radii of a circle also make an isosceles triangle.`
      ],
      example: { q: R`$AB = AC$, $\angle ABC = 67^\circ$. Find $\angle A$.`, a: [R`$\angle C = 67^\circ$`, R`$\angle A = 180 - 134 = 46^\circ$`] },
      trap: R`The equal angles are NOT the one between the equal sides.` }),

    C({ id: 'k_dm_ineq', topic: 'desmos', badge: 'desmos', title: 'Desmos: inequalities and "which point is a solution"',
      keywords: 'desmos inequality system of inequalities shading solution point region dashed solid',
      see: [R`"Which point $(x, y)$ is a solution to the system $y < 2x + 1$ and $y > -x + 4$?"`],
      pic: picDmIneq,
      formula: R`$$\text{solutions} = \text{where all the shadings overlap}$$`,
      steps: [
        R`Type each inequality on its own line exactly as given: Desmos shades it.`,
        R`Dashed line = $<$ or $>$ (the line itself is not included); solid = $\le$ or $\ge$.`,
        R`Type the answer choices as points, like (3, 2): the one inside the overlap is the answer.`
      ],
      example: { q: R`Is $(3, 2)$ a solution of $y < 2x + 1$, $y > -x + 4$?`, a: [R`$2 < 7$ ✓ and $2 > 1$ ✓ → yes`] },
      trap: R`A point exactly on a dashed line is not a solution.`,
      desmos: { lines: [{ show: 'y < 2x + 1', latex: R`y<2x+1` }, { show: 'y > −x + 4', latex: R`y>-x+4` }, { show: '(3, 2)', latex: R`\left(3,2\right)` }],
        tip: 'The point is a solution if it sits in the darker overlap.' } }),

    C({ id: 'k_quad_context', topic: 'advanced', badge: 'partly', title: 'Quadratic word problems: highest point, start, landing',
      keywords: 'projectile height ball thrown maximum height minimum vertex time hits the ground quadratic model word problem',
      see: [R`"$h(t) = -16t^2 + 64t + 5$ gives the height of a ball. What is the maximum height?"`, R`"After how many seconds does it hit the ground?"`],
      pic: picQuad,
      formula: [R`$$\text{top at } t = -\frac{b}{2a}, \quad \text{max} = h\!\left(-\tfrac{b}{2a}\right)$$`, R`$$\text{start: } h(0) = c \qquad \text{lands: } h(t) = 0$$`],
      steps: [
        R`Maximum or minimum → the vertex: $t = -\frac{b}{2a}$, then plug it in.`,
        R`Starting value → plug in $0$ (it's just $c$).`,
        R`Hits the ground → solve $h(t) = 0$ and keep the positive answer. Fastest: graph it and click.`
      ],
      example: { q: R`$h(t) = -16t^2 + 64t + 5$`, a: [R`$t = -\frac{64}{2(-16)} = 2$`, R`$h(2) = -64 + 128 + 5 = 69$ feet`] },
      trap: R`"When" asks for $t$ (the vertex's $x$); "how high" asks for $h$ (the vertex's $y$).`,
      desmos: { lines: [{ show: 'y = −16x^2 + 64x + 5', latex: R`y=-16x^2+64x+5` }], tip: 'Click the top of the curve for the maximum, and the x-intercept for when it lands.' } })
  );

  // ---------- third batch ----------
  const picTrinomial = K.svg(360, 150,
    K.t(10, 20, 'x² + 2x − 15:  multiply to −15, add to +2', { s: 12, b: true }) +
    [['1, −15', '−14'], ['−1, 15', '14'], ['3, −5', '−2'], ['−3, 5', '2 ✓']].map(([a, b], i) =>
      K.t(20 + i * 82, 44, a, { s: 12, c: i === 3 ? green : gray, b: i === 3 }) + K.t(20 + i * 82, 60, 'sum ' + b, { s: 11, c: i === 3 ? green : gray, b: i === 3 })).join('') +
    K.t(10, 84, '→ (x − 3)(x + 5)', { s: 14, b: true, c: green }) +
    K.t(10, 112, '2x² + 7x + 3: a·c = 6 → 6 and 1 (add to 7)', { s: 12, b: true, c: blue }) +
    K.t(10, 132, '2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)', { s: 11.5, c: blue }));

  const picPemdas = K.svg(360, 120,
    K.t(10, 20, 'x = −2:  always put it in ( )', { s: 12.5, b: true }) +
    K.t(10, 44, 'x² − 3x = (−2)² − 3(−2) = 4 + 6 = 10', { s: 13, b: true, c: green }) +
    K.t(10, 76, '−3² = −9', { s: 14, b: true, c: red }) + K.t(110, 76, '(−3)² = 9', { s: 14, b: true, c: blue }) +
    K.t(210, 76, '5 − (−4) = 9', { s: 14, b: true }) +
    K.t(10, 106, '( ) → powers → × ÷ → + −   (left to right)', { s: 12, b: true, c: orange }));

  const picFdp = (() => {
    const rows = [['1/2', '0.5', '50%'], ['1/3', '0.333…', '33.3%'], ['2/3', '0.666…', '66.7%'], ['1/4', '0.25', '25%'], ['3/4', '0.75', '75%'], ['1/5', '0.2', '20%'], ['1/8', '0.125', '12.5%']];
    let s = K.t(20, 16, 'fraction', { s: 11, c: gray, b: true }) + K.t(120, 16, 'decimal', { s: 11, c: gray, b: true }) + K.t(230, 16, 'percent', { s: 11, c: gray, b: true });
    rows.forEach((r, i) => { const y = 34 + i * 16; s += K.t(20, y, r[0], { s: 12, b: true }) + K.t(120, y, r[1], { s: 12, c: blue }) + K.t(230, y, r[2], { s: 12, c: green, b: true }); });
    return K.svg(360, 148, s);
  })();

  const picRateChange = (() => {
    const p = K.plot({ x0: 0, x1: 5, y0: 0, y1: 20, xt: 1, yt: 5, w: 360, h: 170, l: 26 });
    p.fn(x => x * x, { c: blue }).seg(1, 1, 4, 16, { c: red, w: 2.2, d: '6 4' });
    p.seg(1, 1, 4, 1, { c: orange, w: 1.6 }).seg(4, 1, 4, 16, { c: orange, w: 1.6 });
    p.pt(1, 1, { c: red, label: '(1, 1)', dx: -42, dy: -6 }).pt(4, 16, { c: red, label: '(4, 16)', a: 'end', dx: -8 });
    p.txt(2.2, 2.2, 'run 3', { c: orange, b: true, s: 11 }).txt(4.1, 8, 'rise 15', { c: orange, b: true, s: 11 });
    p.txt(0.2, 18.5, 'average rate = 15/3 = 5', { c: red, b: true, s: 12 });
    return p.svg();
  })();

  const picIntercepts = (() => {
    const p = K.plot({ x0: -1, x1: 10, y0: -1, y1: 8, xt: 1, yt: 1, w: 360, h: 170, l: 22 });
    p.fn(x => (24 - 3 * x) / 4, { c: blue });
    p.pt(0, 6, { c: green, label: '(0, 6)  x = 0', s: 11.5 }).pt(8, 0, { c: red, label: '(8, 0)  y = 0', dx: 6, dy: -14, s: 11.5 });
    p.txt(4.6, 6.6, '3x + 4y = 24', { c: blue, b: true, s: 12 });
    return p.svg();
  })();

  const picReadGraph = (() => {
    const f = x => -0.5 * (x - 3) * (x - 3) + 4;
    const p = K.plot({ x0: -0.5, x1: 6.5, y0: -1, y1: 5, xt: 1, yt: 1, w: 360, h: 175, l: 22 });
    p.fn(f, { c: blue }).seg(-0.5, 2, 6.5, 2, { c: orange, w: 1.6, d: '5 4' });
    p.seg(3, 0, 3, 4, { c: green, w: 1.6, d: '3 3' }).pt(3, 4, { c: green, label: 'f(3) = 4', dy: -8 });
    p.pt(1, 2, { c: orange, label: 'x = 1', a: 'end', dx: -6, dy: -6 }).pt(5, 2, { c: orange, label: 'x = 5', dy: -6 });
    p.txt(5.7, 1.55, 'f(x) = 2', { c: orange, b: true, s: 11 });
    return p.svg();
  })();

  const picMixture = (() => {
    const beaker = (x, w, lab1, lab2, c) => K.path(`M${x} 30 L${x} 100 Q${x} 108 ${x + 8} 108 L${x + w - 8} 108 Q${x + w} 108 ${x + w} 100 L${x + w} 30`, { c: '#6b7280', w: 2 }) +
      K.rect(x + 2, 58, w - 4, 48, { f: c, c: 'none', r: 4 }) + K.t(x + w / 2, 80, lab1, { a: 'middle', b: true, s: 12 }) + K.t(x + w / 2, 96, lab2, { a: 'middle', s: 10.5, c: '#374151' });
    return K.svg(360, 140, beaker(10, 80, '20 L', '40% salt', '#bfdbfe') + K.t(100, 78, '+', { s: 18, b: true }) + beaker(118, 80, 'x L', '10% salt', '#dbeafe') +
      K.t(208, 78, '=', { s: 18, b: true }) + beaker(228, 120, '(20 + x) L', '25% salt', '#93c5fd') +
      K.t(10, 128, 'salt: 0.40·20 + 0.10·x = 0.25·(20 + x)  →  x = 20', { s: 12, b: true, c: blue }) + K.t(10, 18, 'Track the pure part (the salt):', { s: 12, b: true }));
  })();

  const picPointSlope = (() => {
    const p = K.plot({ x0: 0, x1: 8, y0: 0, y1: 16, xt: 1, yt: 2, w: 360, h: 170, l: 26 });
    p.fn(x => 2 * x + 1, { c: blue }).seg(2, 5, 6, 5, { c: orange, w: 1.6 }).seg(6, 5, 6, 13, { c: orange, w: 1.6 });
    p.pt(2, 5, { c: red, label: '(2, 5)', dx: -44, dy: -4 }).pt(6, 13, { c: red, label: '(6, 13)', a: 'end', dx: -8 });
    p.txt(3.6, 4.2, 'run 4', { c: orange, b: true, s: 11 }).txt(6.15, 9, 'rise 8', { c: orange, b: true, s: 11 });
    p.txt(0.3, 15, 'm = 8/4 = 2 → y = 2x + 1', { c: green, b: true, s: 12 });
    return p.svg();
  })();

  cards.push(
    C({ id: 'k_factor_trinomial', topic: 'advanced', badge: 'memo', title: 'Factoring x² + bx + c (and ax² + bx + c)',
      keywords: 'factor trinomial quadratic two numbers multiply add ac method grouping split middle term factored form',
      see: [R`"Which of the following is a factor of $x^2 + 2x - 15$?"`, R`"Which expression is equivalent to $2x^2 + 7x + 3$?"`],
      pic: picTrinomial,
      formula: [R`$$x^2 + bx + c = (x + p)(x + q) \quad \text{where } pq = c,\ \ p + q = b$$`, R`$$ax^2 + bx + c:\ \ pq = ac,\ \ p + q = b,\ \text{ split } bx \text{ and group}$$`],
      steps: [
        R`List the factor pairs of $c$ (or of $a \cdot c$) and pick the pair that adds to $b$.`,
        R`Signs: $c$ negative → one $+$ and one $-$. $c$ positive and $b$ negative → both $-$.`,
        R`If $a \ne 1$: split the middle term with that pair, then factor in two groups.`
      ],
      example: { q: R`$2x^2 + 7x + 3$`, a: [R`$ac = 6$: $6$ and $1$ add to $7$`, R`$2x^2 + 6x + x + 3 = 2x(x+3) + (x+3) = (2x+1)(x+3)$`] },
      trap: R`Multiply your answer back out (FOIL). It takes 5 seconds and catches sign mistakes.`,
      desmos: { lines: [{ show: 'y = 2x^2 + 7x + 3', latex: R`y=2x^2+7x+3` }], tip: 'Zeros at x = −0.5 and x = −3 mean the factors are (2x + 1) and (x + 3).' } }),

    C({ id: 'k_pemdas', topic: 'strategy', badge: 'memo', title: 'Order of operations & negative signs',
      keywords: 'order of operations pemdas negative numbers substitute plug in evaluate expression parentheses exponent sign',
      see: [R`"If $x = -2$, what is the value of $x^2 - 3x$?"`, R`"What is the value of $-3^2 + 4(2 - 5)$?"`],
      pic: picPemdas,
      formula: R`$$(\ )\ \to\ \text{powers}\ \to\ \times\,\div\ \to\ +\,-\qquad(\text{left to right})$$`,
      steps: [
        R`Plug in a negative number inside parentheses: $(-2)^2 = 4$.`,
        R`$-3^2$ means $-(3^2) = -9$, but $(-3)^2 = 9$.`,
        R`Minus times minus is plus; subtracting a negative is adding.`
      ],
      example: { q: R`$-3^2 + 4(2 - 5)$`, a: [R`$-9 + 4(-3)$`, R`$= -9 - 12 = -21$`] },
      trap: R`Type it into Desmos to double-check: it follows the order of operations exactly.` }),

    C({ id: 'k_fdp', topic: 'ratios', badge: 'memo', title: 'Fractions ↔ decimals ↔ percents',
      keywords: 'fraction decimal percent convert grid in enter answer rounding repeating decimal',
      see: [R`"What is $0.045$ written as a percent?"`, R`"Enter $\frac23$ in the answer box…"`],
      pic: picFdp,
      formula: [R`$$\frac38 = 3 \div 8 = 0.375 = 37.5\%$$`, R`$$\text{decimal} \to \%:\ \times 100 \qquad \% \to \text{decimal}:\ \div 100$$`],
      steps: [
        R`Fraction → decimal: divide the top by the bottom.`,
        R`Decimal → percent: move the point two places right ($0.045 \to 4.5\%$).`,
        R`Grid-in: $\frac23$ can be entered as 2/3, .6666 or .6667, but not .67.`
      ],
      example: { q: R`$0.045$ as a percent`, a: [R`$0.045 \times 100 = 4.5\%$`] },
      trap: R`$0.5\%$ is $0.005$, not $0.5$.` }),

    C({ id: 'k_rate_change', topic: 'linear', badge: 'partly', title: 'Average rate of change between two points',
      keywords: 'average rate of change between interval from to slope secant per year table function',
      see: [R`"What is the average rate of change of $f$ from $x = 1$ to $x = 4$?"`, R`"Based on the table, what was the average rate of change from 2010 to 2014?"`],
      pic: picRateChange,
      formula: R`$$\text{average rate of change} = \frac{f(b) - f(a)}{b - a}$$`,
      steps: [
        R`Find the two outputs, $f(a)$ and $f(b)$ (from the formula, table or graph).`,
        R`Subtract the outputs and the inputs in the same order.`,
        R`Divide. The units are "output per input" (dollars per year…).`
      ],
      example: { q: R`$f(x) = x^2$, from $x = 1$ to $x = 4$`, a: [R`$\frac{16 - 1}{4 - 1} = \frac{15}{3}$`, R`$= 5$`] },
      trap: R`Same order on top and bottom: (later − earlier) ÷ (later − earlier).` }),

    C({ id: 'k_intercepts', topic: 'linear', badge: 'memo', title: 'x- and y-intercepts: set the other one to 0',
      keywords: 'x-intercept y-intercept intercept zero root crosses the axis starting value set equal to zero',
      see: [R`"What is the $x$-intercept of the graph of $3x + 4y = 24$?"`, R`"What is the best interpretation of the $y$-intercept?"`],
      pic: picIntercepts,
      formula: R`$$y\text{-intercept: put } x = 0 \qquad x\text{-intercept: put } y = 0$$`,
      steps: [
        R`$y$-intercept: plug in $x = 0$ → the point $(0, b)$.`,
        R`$x$-intercept (zero): plug in $y = 0$ (or $f(x) = 0$) → the point $(a, 0)$.`,
        R`In a word problem: $y$-intercept = the starting amount; $x$-intercept = when it reaches $0$.`
      ],
      example: { q: R`$3x + 4y = 24$`, a: [R`$x = 0$: $y = 6$ → $(0, 6)$`, R`$y = 0$: $x = 8$ → $(8, 0)$`] },
      trap: R`The $x$-intercept is $(8, 0)$, not $(0, 8)$: on the $x$-axis, $y$ is $0$.` }),

    C({ id: 'k_read_graph', topic: 'advanced', badge: 'memo', title: 'Reading a function\'s graph',
      keywords: 'graph of f read value f(3) f(x)= how many solutions maximum minimum increasing decreasing interval zeros',
      see: [R`"The graph of $y = f(x)$ is shown. What is the value of $f(3)$?"`, R`"For how many values of $x$ does $f(x) = 2$?"`],
      pic: picReadGraph,
      formula: R`$$f(a) = \text{height at } x = a \qquad f(x) = k \Rightarrow \text{where the graph meets } y = k$$`,
      steps: [
        R`$f(3)$: go to $x = 3$, up or down to the curve, read the $y$-value.`,
        R`$f(x) = k$: draw the flat line $y = k$; the crossings are the answers (count them for "how many").`,
        R`Zeros = $x$-intercepts; maximum/minimum = highest/lowest point; increasing = going up from left to right.`
      ],
      example: { q: R`The graph above: $f(3)$? Solutions of $f(x) = 2$?`, a: [R`$f(3) = 4$`, R`$f(x) = 2$ at $x = 1$ and $x = 5$`] },
      trap: R`$f(3)$ asks for a $y$-value; "$f(x) = 3$" asks for $x$-values.` }),

    C({ id: 'k_mixture', topic: 'ratios', badge: 'partly', title: 'Mixtures: track the pure part',
      keywords: 'mixture solution concentration percent salt acid alloy combine liters weighted',
      see: [R`"How many liters of a $10\%$ salt solution must be added to $20$ liters of a $40\%$ solution to make a $25\%$ solution?"`],
      pic: picMixture,
      formula: R`$$A_1p_1 + A_2p_2 = (A_1 + A_2)\,p_{\text{mix}}$$`,
      steps: [
        R`Pure part (salt, acid…) = amount $\times$ percent.`,
        R`Pure part before mixing = pure part after mixing.`,
        R`Solve for the unknown amount; check that the mix % lands between the two starting %.`
      ],
      example: { q: R`$20$ L of $40\%$ + $x$ L of $10\%$ = $25\%$`, a: [R`$8 + 0.1x = 0.25(20 + x) = 5 + 0.25x$`, R`$3 = 0.15x$ → $x = 20$ L`] },
      trap: R`Percents don't add: $40\% + 10\%$ is not $50\%$. The mix is always between them.` }),

    C({ id: 'k_dm_onevar', topic: 'desmos', badge: 'desmos', title: 'Desmos: type the equation, read x',
      keywords: 'desmos solve equation one variable vertical line solution value of x check answer',
      see: [R`"What value of $x$ satisfies $3(x - 4) + 7 = 2x + 9$?"`],
      formula: R`$$\text{type } 3(x-4)+7 = 2x+9 \ \to\ \text{Desmos draws the line } x = 14$$`,
      steps: [
        R`Type the equation exactly as given (only $x$ in it).`,
        R`Desmos draws a vertical line at each solution. Click it to read $x$.`,
        R`Two lines = two solutions; no line = no real solution.`
      ],
      example: { q: R`$3(x - 4) + 7 = 2x + 9$`, a: [R`vertical line at $x = 14$`] },
      trap: R`Another letter in it (like $k$)? Desmos adds a slider: use the value from the question first.`,
      desmos: { lines: [{ show: '3(x − 4) + 7 = 2x + 9', latex: R`3\left(x-4\right)+7=2x+9` }], tip: 'A vertical line appears at the solution. Click it to read the x-value.' } }),

    C({ id: 'k_simplify_roots', topic: 'advanced', badge: 'memo', title: 'Simplify square roots: pull out perfect squares',
      keywords: 'simplify square root radical perfect square rationalize denominator root 2 root 3 equivalent',
      see: [R`"Which of the following is equivalent to $\sqrt{72}$?"`, R`"What is $\frac{6}{\sqrt3}$ in simplest form?"`],
      formula: [R`$$\sqrt{ab} = \sqrt a \cdot \sqrt b \qquad \sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt2$$`, R`$$\frac{6}{\sqrt3} = \frac{6\sqrt3}{3} = 2\sqrt3$$`],
      steps: [
        R`Find the biggest perfect-square factor ($4, 9, 16, 25, 36, 49, 64, 81, 100$) and take its root outside.`,
        R`A root in the bottom: multiply top and bottom by that root.`,
        R`Only like roots add: $2\sqrt3 + 5\sqrt3 = 7\sqrt3$.`
      ],
      example: { q: R`$\sqrt{50} + \sqrt8$`, a: [R`$5\sqrt2 + 2\sqrt2$`, R`$= 7\sqrt2$`] },
      trap: R`$\sqrt{9 + 16} = 5$, not $3 + 4$: roots don't split over $+$.`,
      desmos: { lines: [{ show: '√72', latex: R`\sqrt{72}` }, { show: '6√2', latex: R`6\sqrt{2}` }], tip: 'Same decimal = same number. Quick way to check an answer choice.' } }),

    C({ id: 'k_point_slope', topic: 'linear', badge: 'memo', title: 'Equation of a line from two points (or a point and a slope)',
      keywords: 'equation of a line through two points point slope form passes through slope intercept find equation',
      see: [R`"A line passes through $(2, 5)$ and $(6, 13)$. Which is an equation of the line?"`],
      pic: picPointSlope,
      formula: [R`$$y - y_1 = m(x - x_1)$$`, R`$$m = \frac{13 - 5}{6 - 2} = 2 \ \Rightarrow\ y - 5 = 2(x - 2) \ \Rightarrow\ y = 2x + 1$$`],
      steps: [
        R`Slope from the two points: rise over run.`,
        R`Plug one point into $y - y_1 = m(x - x_1)$ and rearrange to $y = mx + b$.`,
        R`Or skip the algebra: plug both points into each answer choice.`
      ],
      example: { q: R`Through $(2, 5)$ and $(6, 13)$`, a: [R`$m = 2$, $y = 2x + 1$`, R`check $(6, 13)$: $2 \cdot 6 + 1 = 13$ ✓`] },
      trap: R`Signs flip inside: through $(-3, 4)$ gives $y - 4 = m(x + 3)$.` }),

    C({ id: 'k_eliminate', topic: 'strategy', badge: 'strategy', title: 'Estimate, eliminate, check',
      keywords: 'estimate eliminate answer choices check answer plug back reread question sign size units strategy',
      see: [R`Any question with answer choices — and especially grid-ins, where there's nothing to compare against.`],
      formula: R`$$\text{before: guess the size and sign} \qquad \text{after: plug the answer back in}$$`,
      steps: [
        R`Before solving, estimate: bigger or smaller than the numbers given? Positive or negative?`,
        R`Cross out choices that can't be right (wrong sign, far too big, wrong units).`,
        R`After solving, plug your answer back into the original sentence. It takes 10 seconds and catches most mistakes.`
      ],
      example: { q: R`A shirt costs $\$40$ after a $20\%$ discount. Original price?`, a: [R`The original must be MORE than $\$40$ → cross out anything $\le 40$`, R`$40 \div 0.8 = \$50$; check: $50 \times 0.8 = 40$ ✓`] },
      trap: R`The answer to the wrong question is usually one of the choices: reread what's asked ($x$ or $2x$? width or length?).` })
  );

  // ---------- fourth batch ----------
  const picTrigTable = (() => {
    const rows = [['', '30° (π/6)', '45° (π/4)', '60° (π/3)'], ['sin', '1/2', '√2/2', '√3/2'], ['cos', '√3/2', '√2/2', '1/2'], ['tan', '√3/3', '1', '√3']];
    let s = '';
    rows.forEach((r, i) => r.forEach((v, j) => {
      const x = 10 + (j === 0 ? 0 : 50 + (j - 1) * 100), y = 22 + i * 28;
      if (i === 0 || j === 0) s += K.t(x, y, v, { s: 12, b: true, c: gray });
      else s += K.t(x + 20, y, v, { s: 14, b: true, c: i === 1 ? blue : i === 2 ? red : green });
    }));
    s += K.t(10, 134, 'sin: √1, √2, √3 over 2 — cos: the same list backwards', { s: 11.5, b: true, c: orange });
    return K.svg(360, 144, s);
  })();

  const picCoordArea = (() => {
    const p = K.plot({ x0: 0, x1: 8, y0: 0, y1: 7, xt: 1, yt: 1, w: 360, h: 170, l: 22 });
    p.shade([[1, 1], [7, 1], [4, 6]], 'rgba(37,99,235,0.15)');
    p.seg(1, 1, 7, 1, { c: blue }).seg(7, 1, 4, 6, { c: blue }).seg(4, 6, 1, 1, { c: blue }).seg(4, 1, 4, 6, { c: red, d: '5 4' });
    p.pt(1, 1, { label: '(1, 1)', dx: -12, dy: 14 }).pt(7, 1, { label: '(7, 1)', dx: -12, dy: 14 }).pt(4, 6, { label: '(4, 6)', dy: -6 });
    p.txt(2.3, 0.45, 'base 7 − 1 = 6', { c: blue, b: true, s: 11 }).txt(4.4, 3.4, 'height 6 − 1 = 5', { c: red, b: true, s: 11 });
    return p.svg();
  })();

  const picVocab = (() => {
    const rows = [['sum / difference', '+ / −'], ['product / quotient', '× / ÷'], ['integer', '…, −2, −1, 0, 1, 2, …'], ['consecutive', 'one right after another'], ['reciprocal of 2/3', '3/2'], ['factor of 12', '1, 2, 3, 4, 6, 12'], ['multiple of 12', '12, 24, 36, …'], ['coefficient', 'the 5 in 5x'], ['prime', '2, 3, 5, 7, 11, …']];
    let s = '';
    rows.forEach(([a, b], i) => { const y = 16 + i * 16; s += K.t(10, y, a, { s: 11.5, b: true }) + K.t(150, y, b, { s: 11.5, c: blue }); });
    return K.svg(360, 154, s);
  })();

  const picExpGraph = (() => {
    const p = K.plot({ x0: -3, x1: 4, y0: -1, y1: 9, xt: 1, yt: 1, w: 360, h: 180, l: 22 });
    p.seg(-3, 0, 4, 0, { c: '#9ca3af', d: '4 4', w: 1.5 });
    p.fn(x => 2 * Math.pow(1.5, x), { c: green }).fn(x => 6 * Math.pow(0.6, x), { c: red });
    p.pt(0, 2, { c: green, label: '(0, 2)', dx: 8, dy: 14 }).pt(0, 6, { c: red, label: '(0, 6)', dx: 8 });
    p.txt(2.35, 3.3, 'y = 2(1.5)ˣ', { c: green, b: true, s: 11.5 }).txt(2.35, 2.6, 'grows', { c: green, b: true, s: 11.5 }).txt(-2.9, 6.8, 'y = 6(0.6)ˣ decays', { c: red, b: true, s: 11.5 });
    p.txt(1.5, 0.45, 'never reaches y = 0', { c: gray, s: 10.5, b: true });
    return p.svg();
  })();

  const picMatchGraph = (() => {
    const p = K.plot({ x0: -2, x1: 4, y0: -3, y1: 5, xt: 1, yt: 1, w: 360, h: 175, l: 22 });
    p.fn(x => -2 * x + 3, { c: blue });
    p.pt(0, 3, { c: green, label: '① crosses at (0, 3)', dx: 8, dy: -4 }).pt(1, 1, { c: orange, label: '③ (1, 1) on it', dx: 8, dy: 4 });
    p.txt(1.9, -1.6, '② falls → slope < 0', { c: red, b: true, s: 11.5 });
    p.txt(-1.9, -2.4, 'y = −2x + 3', { c: blue, b: true, s: 12 });
    return p.svg();
  })();

  const picAngles = K.svg(360, 124,
    K.l(8, 78, 112, 78, { w: 2 }) + K.l(60, 78, 95, 28, { w: 2 }) + K.arc(60, 78, 14, 0, 55, { c: blue, w: 2 }) + K.arc(60, 78, 20, 55, 180, { c: red, w: 2 }) +
    K.t(80, 70, 'x', { b: true, c: blue }) + K.t(8, 60, '180 − x', { b: true, c: red, s: 10.5 }) +
    K.t(60, 100, 'straight line', { a: 'middle', s: 11, b: true }) + K.t(60, 115, 'adds to 180°', { a: 'middle', s: 11, c: gray }) +
    K.l(135, 78, 228, 78, { w: 2 }) + K.l(135, 78, 135, 18, { w: 2 }) + K.l(135, 78, 196, 32, { w: 2 }) + K.rect(135, 68, 10, 10, { c: '#111', w: 1.2 }) +
    K.t(174, 70, 'a', { b: true, c: blue }) + K.t(146, 42, 'b', { b: true, c: red }) +
    K.t(180, 100, 'corner', { a: 'middle', s: 11, b: true }) + K.t(180, 115, 'a + b = 90°', { a: 'middle', s: 11, c: gray }) +
    K.l(256, 30, 344, 86, { w: 2 }) + K.l(256, 86, 344, 30, { w: 2 }) +
    K.t(300, 46, '1', { a: 'middle', b: true, c: blue }) + K.t(300, 80, '1', { a: 'middle', b: true, c: blue }) +
    K.t(300, 100, 'vertical angles', { a: 'middle', s: 11, b: true }) + K.t(300, 115, 'are equal', { a: 'middle', s: 11, c: gray }));

  cards.push(
    C({ id: 'k_trig_table', topic: 'trig', badge: 'memo', title: 'sin, cos, tan of 30°, 45°, 60°: the table to know',
      keywords: 'special angles exact values sin 30 sin 45 sin 60 cos 30 tan 60 trig table root 3 over 2',
      see: [R`"What is the value of $\sin 60^\circ$?"`, R`"Which is equal to $\cos\frac{\pi}{4}$?"`],
      pic: picTrigTable,
      formula: R`$$\sin:\ \tfrac{\sqrt1}{2},\ \tfrac{\sqrt2}{2},\ \tfrac{\sqrt3}{2} \qquad \cos:\ \text{the same list backwards} \qquad \tan = \frac{\sin}{\cos}$$`,
      steps: [
        R`$\sin$ of $30^\circ, 45^\circ, 60^\circ$: $\frac{\sqrt1}{2}, \frac{\sqrt2}{2}, \frac{\sqrt3}{2}$ (count 1, 2, 3 under the root).`,
        R`$\cos$: the same three, backwards.`,
        R`$\tan = \sin \div \cos$: $\frac{\sqrt3}{3},\ 1,\ \sqrt3$.`
      ],
      example: { q: R`$\tan 60^\circ$`, a: [R`$\frac{\sqrt3/2}{1/2}$`, R`$= \sqrt3$`] },
      trap: R`Desmos in radian mode gives $\sin(30) = -0.988$. Check Degrees vs Radians.` }),

    C({ id: 'k_coord_area', topic: 'geometry', badge: 'partly', title: 'Area of a shape from its corner points',
      keywords: 'area coordinates vertices xy-plane triangle rectangle plot points base height length from coordinates',
      see: [R`"A triangle has vertices $(1, 1)$, $(7, 1)$ and $(4, 6)$. What is its area?"`],
      pic: picCoordArea,
      formula: R`$$\text{flat side: subtract } x\text{'s} \qquad \text{up-down side: subtract } y\text{'s} \qquad A = \tfrac12 \cdot 6 \cdot 5 = 15$$`,
      steps: [
        R`Sketch the points (rough is fine).`,
        R`Flat sides: subtract the $x$'s. Vertical sides and heights: subtract the $y$'s.`,
        R`Slanted sides: distance formula — or put a box around the shape and subtract the corner triangles.`
      ],
      example: { q: R`$(1, 1)$, $(7, 1)$, $(4, 6)$`, a: [R`base $7 - 1 = 6$, height $6 - 1 = 5$`, R`area $= \frac12 \cdot 6 \cdot 5 = 15$`] },
      trap: R`The height goes straight up from the base, not along a slanted side.` }),

    C({ id: 'k_vocab', topic: 'strategy', badge: 'memo', title: 'SAT math words, decoded',
      keywords: 'vocabulary sum difference product quotient integer consecutive reciprocal factor multiple coefficient constant prime positive nonnegative',
      see: [R`"What is the product of the solutions…?"`, R`"If $x$ is a positive integer…"`, R`"…where $k$ is a constant"`],
      pic: picVocab,
      formula: R`$$\text{sum} = +\quad \text{difference} = -\quad \text{product} = \times\quad \text{quotient} = \div$$`,
      steps: [
        R`Integer = whole number; it can be negative or $0$. "Positive" leaves out $0$; "nonnegative" includes $0$.`,
        R`Factor of $12$ divides $12$; multiple of $12$ is $12$ times something.`,
        R`Constant = a fixed number (could be a letter like $k$); coefficient = the number in front of a variable.`
      ],
      example: { q: R`The product of the solutions of $(x - 2)(x + 5) = 0$`, a: [R`solutions $2$ and $-5$`, R`product $= -10$`] },
      trap: R`$0$ is an integer and even, but it's neither positive nor negative.` }),

    C({ id: 'k_dm_function', topic: 'desmos', badge: 'desmos', title: 'Desmos: define f(x) once, then ask f(3), f(g(2))',
      keywords: 'desmos function notation define f(x) evaluate composition f(g(x)) value of the function',
      see: [R`"If $f(x) = 3x^2 - 2$ and $g(x) = x + 4$, what is $f(g(-1))$?"`],
      formula: R`$$\text{type } f(x) = 3x^2 - 2,\ \ g(x) = x + 4,\ \text{ then } f(g(-1)) \to 25$$`,
      steps: [
        R`Define each function on its own line: f(x)= …`,
        R`On a new line type f(3) or f(g(−1)): Desmos shows the value.`,
        R`Find where $f(x) = 7$: type f(x)=7 and read the vertical lines.`
      ],
      example: { q: R`$f(g(-1))$`, a: [R`$g(-1) = 3$`, R`$f(3) = 27 - 2 = 25$`] },
      trap: R`$f(g(-1))$ means do $g$ first, then $f$.`,
      desmos: { lines: [{ show: 'f(x) = 3x^2 − 2', latex: R`f\left(x\right)=3x^2-2` }, { show: 'g(x) = x + 4', latex: R`g\left(x\right)=x+4` }, { show: 'f(g(−1))', latex: R`f\left(g\left(-1\right)\right)` }],
        tip: 'The last line shows the answer, 25.' } }),

    C({ id: 'k_exp_graph', topic: 'advanced', badge: 'partly', title: 'Exponential graphs: start, grow or decay, never touch 0',
      keywords: 'exponential graph y-intercept growth decay asymptote curve which graph b greater than 1 less than 1',
      see: [R`"Which could be the graph of $y = 3(0.5)^x$?"`, R`"The graph of $y = a\cdot b^x$ passes through $(0, 4)$…"`],
      pic: picExpGraph,
      formula: [R`$$y = a\cdot b^x:\ \ (0, a) \text{ is the } y\text{-intercept}$$`, R`$$b > 1 \text{ rises},\ \ 0 < b < 1 \text{ falls}$$`],
      steps: [
        R`$y$-intercept = $a$ (plug in $x = 0$).`,
        R`$b > 1$: rises faster and faster. $0 < b < 1$: falls and flattens out.`,
        R`It gets close to $y = 0$ but never touches it. With $+k$ added, it flattens at $y = k$ instead.`
      ],
      example: { q: R`$y = 3(0.5)^x$`, a: [R`starts at $(0, 3)$`, R`falls, halving each step: $3,\ 1.5,\ 0.75, \dots$`] },
      trap: R`An exponential graph never crosses its flat line: $y = 3(0.5)^x$ stays above $0$.`,
      desmos: { lines: [{ show: 'y = 3(0.5)^x', latex: R`y=3\left(0.5\right)^x` }] } }),

    C({ id: 'k_match_graph', topic: 'linear', badge: 'memo', title: 'Which graph matches? Intercept, direction, one point',
      keywords: 'which graph could be the graph of line matches equation slope sign y-intercept choose graph',
      see: [R`"Which of the following could be the graph of $y = -2x + 3$?"`],
      pic: picMatchGraph,
      formula: [R`$$y = mx + b:\ \ b = \text{where it crosses the } y\text{-axis}$$`, R`$$m < 0 \text{ falls},\ \ m > 0 \text{ rises}$$`],
      steps: [
        R`Check where it crosses the $y$-axis: usually knocks out two choices.`,
        R`Check the direction: negative slope goes down from left to right.`,
        R`Still two left? Plug in one more point ($x = 1 \to y = 1$).`
      ],
      example: { q: R`$y = -2x + 3$`, a: [R`crosses at $(0, 3)$, falls`, R`passes through $(1, 1)$`] },
      trap: R`Check the axis scales: the grid may count by $2$s or $5$s.` }),

    C({ id: 'k_consecutive', topic: 'advanced', badge: 'bonus', title: 'Consecutive integers: middle × count',
      keywords: 'consecutive integers even odd sum of consecutive evenly spaced mean median middle',
      see: [R`"The sum of three consecutive integers is $72$. What is the largest?"`, R`"$a$ is the mean and $b$ the median of nine consecutive integers…"`],
      formula: R`$$n,\ n+1,\ n+2 \qquad \text{sum} = \text{middle} \times \text{count} \qquad \text{mean} = \text{median}$$`,
      steps: [
        R`Call them $n, n+1, n+2$ (consecutive even or odd: $n, n+2, n+4$).`,
        R`Shortcut for an odd count: middle $=$ sum $\div$ count.`,
        R`Evenly spaced numbers: mean $=$ median $=$ the middle.`
      ],
      example: { q: R`Three consecutive integers add to $72$`, a: [R`middle $= 72 \div 3 = 24$`, R`$23, 24, 25$ → largest $25$`] },
      trap: R`Consecutive EVEN integers go up by $2$: $10, 12, 14$, not $10, 11, 12$.` }),

    C({ id: 'k_compound', topic: 'advanced', badge: 'partly', title: 'Interest: simple (linear) vs compound (exponential)',
      keywords: 'compound interest simple interest compounded monthly quarterly annually invested account balance principal rate',
      see: [R`"$\$1{,}000$ is invested at $6\%$ annual interest, compounded monthly…"`],
      formula: [R`$$\text{compound: } A = P\left(1 + \frac{r}{n}\right)^{nt}$$`, R`$$\text{simple: } A = P(1 + rt)$$`],
      steps: [
        R`$P$ = start, $r$ = yearly rate as a decimal, $n$ = times per year (12 monthly, 4 quarterly), $t$ = years.`,
        R`Simple interest adds the same amount every year: linear.`,
        R`Compound interest multiplies every period: exponential.`
      ],
      example: { q: R`$\$1{,}000$ at $6\%$ compounded monthly, $2$ years`, a: [R`$1000\left(1 + \frac{0.06}{12}\right)^{24} = 1000(1.005)^{24}$`, R`$\approx \$1{,}127.16$`] },
      trap: R`Monthly: divide the rate by $12$ AND multiply the years by $12$.`,
      desmos: { lines: [{ show: '1000(1 + 0.06/12)^(12·2)', latex: R`1000\left(1+\frac{0.06}{12}\right)^{12\cdot2}` }] } }),

    C({ id: 'k_angle_basics', topic: 'geometry', badge: 'memo', title: 'Angle basics: 180 on a line, 90 in a corner, 360 around',
      keywords: 'straight line supplementary complementary right angle around a point vertical angles linear pair 180 90 360',
      see: [R`"Two angles form a straight line. One measures $47^\circ$…"`, R`"In the figure, what is the value of $x$?"`],
      pic: picAngles,
      formula: R`$$\text{straight line} = 180^\circ \qquad \text{right angle} = 90^\circ \qquad \text{around a point} = 360^\circ$$`,
      steps: [
        R`Angles along a straight line add to $180^\circ$ (supplementary).`,
        R`Angles filling a right angle add to $90^\circ$ (complementary).`,
        R`Opposite (vertical) angles are equal; all the way around a point is $360^\circ$.`
      ],
      example: { q: R`Angles $x$ and $3x$ form a straight line`, a: [R`$4x = 180$`, R`$x = 45$`] },
      trap: R`Supplementary = $180$ (Straight), Complementary = $90$ (Corner).` })
  );

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
