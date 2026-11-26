// Cards: Desmos playbook (topic 'desmos') + test strategy (topic 'strategy'). Needs cards.js (KP).
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';
  const DR = '#c74440', DB = '#2d70b3', DG = '#388c46';

  // Desmos-looking mock: left expression list + right graph. rows: [[color, text], ...]
  function mock(rows, drawGraph, note) {
    const gx = 135;
    let s = K.rect(0.5, 0.5, 359, 199, { f: '#fff', c: '#d1d5db', w: 1 });
    s += drawGraph(gx);
    s += K.rect(0.5, 0.5, gx - 1, 199, { f: '#fff', c: '#d1d5db', w: 1 });
    rows.forEach(([col, txt, sub], i) => {
      const y = 4 + i * 36;
      s += K.l(0, y + 36, gx, y + 36, { c: '#e5e7eb', w: 1 }) + K.t(5, y + 11, i + 1, { s: 8, c: '#9ca3af' });
      if (col) s += K.dot(16, y + 18, col, 5.5);
      s += K.t(col ? 27 : 10, y + (sub ? 16 : 22), txt, { s: 11.5, w: 600 });
      if (sub) s += K.t(col ? 27 : 10, y + 30, sub, { s: 10, c: gray });
    });
    if (note) note.forEach((n, i) => { s += K.t(8, 200 - (note.length - i) * 15 + 2, n, { s: 10.5, b: true, c: '#111' }); });
    return K.svg(360, 200, s);
  }
  // graph helper inside the mock (x from gx to 360)
  function graph(gx, cfg, fn) {
    const p = K.plot(Object.assign({ w: 360 - gx, h: 200, l: 8, r: 6, t: 8, b: 14 }, cfg));
    fn(p);
    return `<g transform="translate(${gx},0)">${p.s}</g>`;
  }

  const picPoints = mock([[DR, 'y = x² − 2x − 3']], gx => graph(gx, { x0: -3, x1: 5, y0: -5, y1: 6, xt: 1, yt: 1, labels: false }, p => {
    p.fn(x => x * x - 2 * x - 3, { c: DR, w: 2.4 });
    [[-1, 0, '(−1, 0)', -44, -6], [3, 0, '(3, 0)', 6, -6], [1, -4, '(1, −4)', 8, 4], [0, -3, '(0, −3)', -46, 4]].forEach(([x, y, l, dx, dy]) => p.pt(x, y, { c: '#6b7280', label: l, dx, dy, s: 10.5 }));
  }), ['click the curve → gray dots', 'zeros −1, 3 · vertex (1, −4)', 'y-intercept (0, −3)']);

  const picTable = mock([[DR, 'f(x) = 2x² − 3'], [null, 'f(4)', '= 29'], [null, 'x₁ | f(x₁)', 'table: 0 → −3, 1 → −1, 2 → 5']], gx => {
    let s = K.rect(gx + 20, 20, 190, 160, { f: '#f9fafb', c: '#e5e7eb', r: 6 });
    s += K.t(gx + 115, 42, 'table', { a: 'middle', b: true, s: 12 });
    const rows = [['x₁', 'f(x₁)'], ['0', '−3'], ['1', '−1'], ['2', '5'], ['3', '15'], ['4', '29']];
    rows.forEach((r, i) => r.forEach((c, j) => { s += K.rect(gx + 40 + j * 75, 52 + i * 20, 75, 20, { f: i ? '#fff' : '#eef2ff', c: '#d1d5db', w: 1 }) + K.t(gx + 77 + j * 75, 66 + i * 20, c, { a: 'middle', s: 11.5, b: i === 0 || i === 5, c: i === 5 ? green : '#111' }); }));
    return s;
  }, ['type the choice value → compare']);

  const picEquiv = mock([[DR, 'y = (x + 3)² − 5'], [DB, 'y = x² + 6x + 4', 'choice B: on top ✓'], [DG, 'y = x² + 6x − 4', 'choice C: off ✗']], gx => graph(gx, { x0: -7, x1: 2, y0: -10, y1: 8, xt: 1, yt: 2, labels: false }, p => {
    p.fn(x => x * x + 6 * x - 4, { c: DG, w: 2 });
    p.fn(x => (x + 3) * (x + 3) - 5, { c: DR, w: 5 }).fn(x => x * x + 6 * x + 4, { c: DB, w: 2.2, d: '6 5' });
  }), ['the one lying exactly on top', 'is equivalent']);

  const picSlider = mock([[DR, 'y = x² + kx + 9'], [null, 'k = 6', '◀━━━━━━●━━▶  slider']], gx => graph(gx, { x0: -7, x1: 3, y0: -3, y1: 12, xt: 1, yt: 2, labels: false }, p => {
    p.fn(x => x * x + 4 * x + 9, { c: '#e5a3a1', w: 1.4, d: '4 4' }).fn(x => x * x + 6 * x + 9, { c: DR, w: 2.4 }).fn(x => x * x + 8 * x + 9, { c: '#e5a3a1', w: 1.4, d: '4 4' });
    p.pt(-3, 0, { c: '#6b7280', label: 'touches at k = 6', dx: 8, dy: -8, s: 10.5 });
  }), ['drag k until the graph does', 'what the question says']);

  const picTilde = mock([[null, 'x₁ = [1, 2, 3]'], [DR, '(ax₁+3)(2x₁−5) ~', '6x₁² + bx₁ − 15'], [null, 'a = 3', 'b = −9']], gx => {
    let s = K.t(gx + 14, 40, 'Use ~ instead of =', { b: true, s: 12.5 });
    s += K.t(gx + 14, 64, 'and x₁ (a list) instead of x.', { s: 11.5 });
    s += K.t(gx + 14, 92, 'Desmos finds every letter', { s: 11.5 }) + K.t(gx + 14, 110, 'that makes both sides equal.', { s: 11.5 });
    s += K.rect(gx + 14, 126, 190, 56, { f: '#eff6ff', c: '#bfdbfe', r: 6 }) + K.t(gx + 22, 146, 'System trick:', { b: true, s: 11, c: blue }) + K.t(gx + 22, 166, '[a, b] ~ [eq₁ side, eq₂ side]', { s: 11, c: blue });
    return s;
  });

  const picRegression = mock([[null, 'x₁ | y₁', '0,1,2,3 | 3,7,11,15'], [DR, 'y₁ ~ mx₁ + b', 'm = 4, b = 3, r² = 1'], [DB, 'y₁ ~ a·bˣ¹', 'for exponential data']], gx => graph(gx, { x0: -0.5, x1: 4, y0: 0, y1: 18, xt: 1, yt: 2, labels: false }, p => {
    p.fn(x => 4 * x + 3, { c: DR, w: 2.2 });
    [[0, 3], [1, 7], [2, 11], [3, 15]].forEach(([x, y]) => p.pt(x, y, { c: '#111', r: 4 }));
  }));

  const picStats = mock([[null, 'L = [3,4,4,7,9,10]'], [null, 'mean(L)', '= 6.1667'], [null, 'median(L)', '= 5.5'], [null, 'stdev(L)', '= 2.927']], gx => {
    let s = K.t(gx + 14, 34, 'Frequency table?', { b: true, s: 12.5 });
    s += K.t(gx + 14, 56, 'V = [2, 5, 9]  values', { s: 11.5 }) + K.t(gx + 14, 74, 'F = [3, 4, 2]  counts', { s: 11.5 });
    s += K.t(gx + 14, 98, 'mean = total(V·F) / total(F)', { s: 11.5, b: true, c: blue }) + K.t(gx + 14, 116, '= 44 / 9 ≈ 4.89', { s: 11.5, c: blue });
    s += K.t(gx + 14, 146, 'quartile(L, 1) → Q1', { s: 11.5 }) + K.t(gx + 14, 164, 'quartile(L, 3) → Q3', { s: 11.5 });
    return s;
  });

  const picDmCircle = mock([[DR, 'x² − 6x + y² + 8y + 9 = 0'], [DB, 'y ≥ 2x − 1'], [null, '(2, 4)', 'test a choice point']], gx => graph(gx, { x0: -2, x1: 8, y0: -9, y1: 6, xt: 1, yt: 1, labels: false }, p => {
    p.shade([[-2, -5], [3.5, 6], [-2, 6]], 'rgba(45,112,179,0.18)');
    p.fn(x => 2 * x - 1, { c: DB, w: 2 });
    let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60 * 2 * Math.PI; d += (i ? 'L' : 'M') + p.X(3 + 4 * Math.cos(t)).toFixed(1) + ' ' + p.Y(-4 + 4 * Math.sin(t)).toFixed(1); }
    p.add(K.path(d, { c: DR, w: 2.2 }));
    p.pt(-1, -4, { c: '#6b7280', r: 3.5 }).pt(7, -4, { c: '#6b7280', r: 3.5 }).pt(2, 4, { c: '#111', label: '(2, 4)', dx: 6, dy: -4, s: 10.5 });
  }), ['left & right dots: center between them']);

  const picDmTrig = mock([[null, 'sin(30)', '= 0.5  → Degrees ✓'], [null, 'arcsin(0.6)', '= 36.87°'], [null, 'cos(29π/6)', 'needs Radians']], gx => {
    let s = K.rect(gx + 30, 24, 170, 120, { f: '#fff', c: '#d1d5db', r: 8 });
    s += K.t(gx + 46, 48, '🔧 Graph settings', { b: true, s: 12 });
    s += K.rect(gx + 46, 66, 64, 26, { f: '#111', c: '#111', r: 5 }) + K.t(gx + 78, 83, 'Degrees', { a: 'middle', c: '#fff', b: true, s: 11 });
    s += K.rect(gx + 116, 66, 64, 26, { f: '#fff', c: '#9ca3af', r: 5 }) + K.t(gx + 148, 83, 'Radians', { a: 'middle', b: true, s: 11 });
    s += K.t(gx + 46, 118, 'π in the question → Radians', { s: 10.5, c: red, b: true }) + K.t(gx + 46, 134, '° in the question → Degrees', { s: 10.5, c: blue, b: true });
    return s;
  });

  const picTyping = (() => {
    const rows = [['sqrt', '√ square root'], ['cbrt', '∛ cube root'], ['nthroot(x, 4)', '⁴√x'], ['abs(x) or |x|', 'absolute value'], ['pi', 'π'], ['/  and  ^', 'fraction, power'], ['mod(47, 5)', 'remainder 2'], ['nCr(5, 2)', 'choose 2 of 5'], ['35% of 240', '= 84']];
    let s = '';
    rows.forEach(([a, b], i) => { const x = i < 5 ? 8 : 186, y = 8 + (i % 5) * 32; s += K.rect(x, y, 170, 28, { f: '#f9fafb', c: '#e5e7eb', r: 5 }) + K.t(x + 8, y + 18, a, { s: 11.5, b: true, c: blue }) + K.t(x + 164, y + 18, b, { s: 10.5, a: 'end', c: gray }); });
    s += K.t(186, 182, 'decimal → fraction: tap the', { s: 10.5, b: true }) + K.t(186, 196, 'fraction button next to the result', { s: 10.5, b: true });
    return K.svg(360, 200, s);
  })();

  const picGridIn = (() => {
    const rows = [['3/4', '✓ fraction', green], ['.6667', '✓ 2/3 rounded to fill', green], ['-7/12', '✓ negative: 6 characters', green], ['2 1/2', '✗ mixed number → type 5/2', red], ['$84', '✗ no $, %, units → 84', red]];
    let s = '';
    rows.forEach(([a, b, c], i) => { const y = 8 + i * 34; s += K.rect(10, y, 110, 28, { f: '#fff', c: c, w: 1.8, r: 5 }) + K.t(65, y + 19, a, { a: 'middle', b: true, s: 14 }) + K.t(132, y + 19, b, { s: 12, b: true, c }); });
    return K.svg(360, 180, s);
  })();

  const picBacksolve = (() => {
    const ch = [['A', '2', '✗'], ['B', '4', '✗ too small'], ['C', '6', '✓'], ['D', '9', '']];
    let s = K.t(10, 18, '"x + √(x + 3) = 9. What is x?"', { b: true, s: 12.5 });
    ch.forEach(([l, v, r], i) => { const y = 30 + i * 32, ok = r.startsWith('✓'); s += K.rect(10, y, 140, 26, { f: ok ? '#dcfce7' : '#fff', c: ok ? green : '#d1d5db', r: 5 }) + K.t(20, y + 18, l + ')  ' + v, { b: true, s: 12.5 }) + K.t(160, y + 18, r, { s: 11.5, b: true, c: ok ? green : red }); });
    s += K.t(10, 168, 'try C: 6 + √9 = 9 ✓ — no algebra needed', { s: 11.5, b: true, c: green });
    return K.svg(360, 176, s);
  })();

  const picPick = K.svg(360, 160,
    K.t(10, 20, '"x is 20% more than y, y is 25% less than z.', { s: 11.5, b: true }) + K.t(10, 36, '  x is what fraction of z?"', { s: 11.5, b: true }) +
    K.t(10, 66, 'pick z = 100', { s: 13, b: true, c: blue }) + K.t(10, 88, 'y = 75', { s: 13 }) + K.t(10, 110, 'x = 75 × 1.2 = 90', { s: 13 }) +
    K.t(10, 140, 'x = 0.9z  → choice that gives 90 when z = 100', { s: 12, b: true, c: green }));

  const picRead = K.svg(360, 120,
    K.t(10, 22, '…the system has solution (x, y).', { s: 12.5, c: gray }) +
    K.rect(6, 34, 250, 26, { f: '#fef3c7', c: '#f59e0b', r: 5 }) + K.t(12, 52, 'What is the value of 2x + y?', { s: 13.5, b: true }) +
    K.t(10, 84, 'not x · not y · units? · percent or decimal?', { s: 12, b: true, c: red }) +
    K.t(10, 106, 'Circle the last line BEFORE you start solving.', { s: 12, c: '#374151' }));

  const picPlan = (() => {
    let s = '';
    [['Module 1', '22 questions · 35 min', blue], ['Module 2', '22 questions · 35 min', orange]].forEach(([a, b, c], i) => { s += K.rect(10 + i * 175, 10, 165, 50, { f: i ? '#ffedd5' : '#dbeafe', c, r: 8 }) + K.t(92 + i * 175, 32, a, { a: 'middle', b: true, c, s: 13 }) + K.t(92 + i * 175, 50, b, { a: 'middle', s: 11 }); });
    s += K.t(10, 84, 'Module 2 gets harder if Module 1 went well.', { s: 11.5 });
    s += K.t(10, 106, '≈ 1.6 min per question · no penalty for guessing', { s: 11.5, b: true });
    s += K.t(10, 128, '≈ 75% multiple choice, 25% type-your-answer', { s: 11.5 });
    s += K.t(10, 150, 'Desmos + Reference available the whole time', { s: 11.5, c: green, b: true });
    return K.svg(360, 160, s);
  })();

  // ---------- cards ----------
  const C = (o) => Object.assign({ v: 2 }, o);
  const cards = [
    // ===== DESMOS =====
    C({ id: 'k_dm_points', topic: 'desmos', badge: 'desmos', title: 'Desmos: click for zeros, vertex, max/min & intercepts',
      keywords: 'desmos click points zeros x-intercepts vertex minimum maximum y-intercept gray dots',
      see: [R`"What is the minimum value of $f(x) = x^2 - 2x - 3$?"`, R`"At what values of $x$ does the graph cross the $x$-axis?"`],
      pic: picPoints,
      steps: [R`Type the function as $y = \ldots$ (or $f(x) = \ldots$).`, R`Click the curve — gray dots appear at zeros, vertex, intercepts and intersections.`, R`Click a dot to read its coordinates. Minimum VALUE is the $y$ of the vertex.`],
      example: { q: R`$y = x^2 - 2x - 3$`, a: [R`zeros $-1$ and $3$`, R`vertex $(1, -4)$ → minimum value $-4$`] },
      trap: 'Points with long decimals are rounded — type the value back in to check.',
      desmos: { lines: [{ show: 'y=x^2-2x-3', latex: 'y=x^2-2x-3' }] } }),
    C({ id: 'k_dm_table', topic: 'desmos', badge: 'desmos', title: 'Desmos: plug in answer choices with f(x) and tables',
      keywords: 'desmos evaluate function table of values check answer choices plug in f(4)',
      see: [R`"$f(x) = 2x^2 - 3$. Which table gives values of $f$?"`, R`"Which value of $x$ is a solution?"`],
      pic: picTable,
      steps: [R`Define the function: $f(x) = \ldots$`, R`Type $f(4)$ on its own line → the value appears. Or make a table with $x_1$ and $f(x_1)$.`, R`"Is $(a, b)$ a solution?" → type the point and see if it sits on the graph.`],
      example: { q: R`$f(x) = 2x^2 - 3$`, a: [R`$f(4) = 29$`] },
      trap: 'Use f(x) = … (with f), not y = …, if you want to evaluate f(4).',
      desmos: { lines: [{ show: 'f(x)=2x^2-3', latex: 'f\\left(x\\right)=2x^2-3' }, { show: 'f(4)', latex: 'f\\left(4\\right)' }, { show: 'table x₁ | f(x₁)', expr: { type: 'table', columns: [{ latex: 'x_{1}', values: ['0', '1', '2', '3', '4'] }, { latex: 'f\\left(x_{1}\\right)' }] } }] } }),
    C({ id: 'k_dm_equiv', topic: 'desmos', badge: 'desmos', title: 'Desmos: check equivalent expressions by overlap',
      keywords: 'desmos equivalent expressions overlap same graph answer choices',
      see: [R`"Which expression is equivalent to $(x+3)^2 - 5$?"`],
      pic: picEquiv,
      steps: [R`Type the question's expression as $y = \ldots$`, R`Type each answer choice as another $y = \ldots$`, R`The choice that lies exactly on top (same curve everywhere) is equivalent.`],
      example: { q: R`$(x+3)^2 - 5$`, a: [R`$x^2 + 6x + 4$ overlaps → equivalent`] },
      trap: 'With a second letter (like y or k), make it a slider set to an odd value such as 2.71 — never 0, 1 or 2.',
      desmos: { lines: [{ show: 'y=(x+3)^2-5', latex: 'y=(x+3)^2-5' }, { show: 'y=x^2+6x+4', latex: 'y=x^2+6x+4' }] } }),
    C({ id: 'k_dm_slider', topic: 'desmos', badge: 'desmos', title: 'Desmos: sliders for an unknown constant',
      keywords: 'desmos slider unknown constant k parameter tangent parallel integer step restriction',
      see: [R`"For what positive value of $k$ does $x^2 + kx + 9 = 0$ have exactly one solution?"`],
      pic: picSlider,
      steps: [R`Type the equation with the unknown letter ($k$). If no slider appears, add a line $k = 1$.`, R`Drag $k$ until the graph does what the question says (touches, parallel, passes through…).`, R`Need an integer? Set the slider step to 1. Positive only? Add $\{k > 0\}$.`],
      example: { q: R`$y = x^2 + kx + 9$ touches the $x$-axis`, a: [R`at $k = 6$`] },
      trap: 'Sliders find one answer at a time — check if there could be another (here k = −6 too).',
      desmos: { lines: [{ show: 'y=x^2+kx+9', latex: 'y=x^2+kx+9' }, { show: 'k=6', latex: 'k=6' }] } }),
    C({ id: 'k_dm_tilde', topic: 'desmos', badge: 'desmos', title: 'Desmos: find constants with ~ (the regression trick)',
      keywords: 'desmos tilde regression find constants equivalent expressions for all x system bracket',
      see: [R`"$(ax + 3)(2x - 5) = 6x^2 + bx - 15$ for all $x$. What is $b$?"`, R`"…equivalent for all values of $x$. What is $a + c$?"`],
      pic: picTilde,
      steps: [R`Make a list: $x_1 = [1, 2, 3]$ (use more numbers for more unknowns).`, R`Write the equation with $x_1$ instead of $x$, and $\sim$ instead of $=$.`, R`Read the letters Desmos shows below. For two equations: $[a, b] \sim [\ldots, \ldots]$.`],
      example: { q: R`$(ax+3)(2x-5) \sim 6x^2 + bx - 15$`, a: [R`$a = 3,\ b = -9$`] },
      trap: 'Never use x, y, e or i as unknown letters. With huge powers (x¹⁴) use small list values like 0.5, 0.7, 0.9.',
      desmos: { lines: [{ show: 'x₁=[1,2,3]', latex: 'x_{1}=\\left[1,2,3\\right]' }, { show: '(ax₁+3)(2x₁−5) ~ 6x₁²+bx₁−15', latex: '\\left(ax_{1}+3\\right)\\left(2x_{1}-5\\right)\\sim6x_{1}^{2}+bx_{1}-15' }] } }),
    C({ id: 'k_dm_regression', topic: 'desmos', badge: 'desmos', title: 'Desmos: fit a line or curve to a table',
      keywords: 'desmos regression table line of best fit exponential quadratic model data points',
      see: [R`"The table shows… Which equation models the data?"`, R`"Which exponential function fits the table?"`],
      pic: picRegression,
      steps: [R`Add a table (+ → table) and type the points.`, R`Type $y_1 \sim mx_1 + b$ (line), $y_1 \sim ax_1^2 + bx_1 + c$ (parabola) or $y_1 \sim ab^{x_1}$ (exponential).`, R`Read the letters and match the choice. $r^2$ near $1$ = good fit.`],
      example: { q: R`$(0,3), (1,7), (2,11), (3,15)$`, a: [R`$m = 4,\ b = 3$ → $y = 4x + 3$`] },
      trap: 'Huge x values like years 2010, 2020: re-label them 0, 10 first or the exponential fit can fail.',
      desmos: { lines: [{ show: 'table x₁ | y₁', expr: { type: 'table', columns: [{ latex: 'x_{1}', values: ['0', '1', '2', '3'] }, { latex: 'y_{1}', values: ['3', '7', '11', '15'] }] } }, { show: 'y₁ ~ mx₁ + b', latex: 'y_{1}\\sim mx_{1}+b' }] } }),
    C({ id: 'k_dm_stats', topic: 'desmos', badge: 'desmos', title: 'Desmos: mean, median, SD & frequency tables',
      keywords: 'desmos mean median standard deviation stdev quartile list frequency table weighted',
      see: [R`"What is the mean of the data in the frequency table?"`, R`"What is the median of these $11$ values?"`],
      pic: picStats,
      steps: [R`Make a list: $L = [3, 4, 4, 7, 9, 10]$.`, R`Type $\text{mean}(L)$, $\text{median}(L)$, $\text{stdev}(L)$, $\text{quartile}(L, 1)$.`, R`Frequency table: $V$ = values, $F$ = counts → mean $= \frac{\text{total}(V\cdot F)}{\text{total}(F)}$.`],
      example: { q: R`Values $2, 5, 9$ with counts $3, 4, 2$`, a: [R`$\frac{6 + 20 + 18}{9} = \frac{44}{9} \approx 4.89$`] },
      trap: 'stdev is the sample SD; on the SAT you only compare SDs, so either works.',
      desmos: { lines: [{ show: 'L=[3,4,4,7,9,10]', latex: 'L=\\left[3,4,4,7,9,10\\right]' }, { show: 'mean(L)', latex: '\\operatorname{mean}\\left(L\\right)' }, { show: 'median(L)', latex: '\\operatorname{median}\\left(L\\right)' }, { show: 'V=[2,5,9]', latex: 'V=\\left[2,5,9\\right]' }, { show: 'F=[3,4,2]', latex: 'F=\\left[3,4,2\\right]' }, { show: 'total(VF)/total(F)', latex: '\\frac{\\operatorname{total}\\left(VF\\right)}{\\operatorname{total}\\left(F\\right)}' }] } }),
    C({ id: 'k_dm_circle', topic: 'desmos', badge: 'desmos', title: 'Desmos: messy circles & inequality regions',
      keywords: 'desmos circle equation center radius inequality shading system of inequalities test point',
      see: [R`"$x^2 - 6x + y^2 + 8y = -9$. What is the radius?"`, R`"Which point is a solution to the system of inequalities?"`],
      pic: picDmCircle,
      steps: [R`Type the circle exactly as given — no completing the square.`, R`Click the leftmost and rightmost points: center is halfway, radius is half the distance.`, R`Inequalities: type each one; the double-shaded part is the answer. Type the choice points to see which falls inside.`],
      example: { q: R`circle through $(-1, -4)$ and $(7, -4)$ at its ends`, a: [R`center $(3, -4)$, radius $4$`] },
      trap: 'A point exactly on a dashed line does NOT count (strict < or >).',
      desmos: { lines: [{ show: 'x^2-6x+y^2+8y+9=0', latex: 'x^2-6x+y^2+8y+9=0' }, { show: 'y≥2x-1', latex: 'y\\ge2x-1' }, { show: '(2,4)', latex: '(2,4)' }] } }),
    C({ id: 'k_dm_trig', topic: 'desmos', badge: 'desmos', title: 'Desmos: trig values & the Degrees/Radians switch',
      keywords: 'desmos trig sin cos tan arcsin inverse degrees radians mode wrench',
      see: [R`"What is $\cos\frac{29\pi}{6}$?"`, R`"$\sin x = 0.6$. What is $x$ in degrees?"`],
      pic: picDmTrig,
      steps: [R`Check the mode first: type $\sin(30)$. $0.5$ → Degrees. $-0.988$ → Radians.`, R`Angle with $\pi$ → Radians; angle with $^\circ$ → Degrees (wrench icon).`, R`Find an angle from a ratio: $\arcsin(0.6)$, $\arccos$, $\arctan$.`],
      example: { q: R`$\sin x = 0.6$ (degrees)`, a: [R`$\arcsin(0.6) \approx 36.87^\circ$`] },
      trap: 'Wrong mode gives a confident wrong number. Desmos shows decimals — compare with √3/2 ≈ 0.866, √2/2 ≈ 0.707.',
      desmos: { lines: [{ show: 'sin(30)', latex: '\\sin\\left(30\\right)' }, { show: 'arcsin(0.6)', latex: '\\arcsin\\left(0.6\\right)' }], degreeMode: true } }),
    C({ id: 'k_dm_typing', topic: 'desmos', badge: 'desmos', title: 'Desmos: typing shortcuts & exact fractions',
      keywords: 'desmos typing shortcuts sqrt cbrt nthroot abs pi mod ncr percent of fraction button',
      see: ['Any question with ugly arithmetic, roots, remainders or percents.'],
      pic: picTyping,
      steps: [R`Type words instead of hunting for buttons: sqrt, cbrt, pi, abs, nthroot.`, R`Remainders: mod(a, b). Choose: nCr(n, r). Percent: "35% of 240".`, R`Decimal answer that should be a fraction: tap the fraction button next to it.`],
      example: { q: R`Remainder of $47 \div 5$`, a: [R`mod(47, 5) $= 2$`] },
      trap: 'Use parentheses around fractions in exponents: 8^(1/3), not 8^1/3.',
      desmos: { lines: [{ show: 'mod(47,5)', latex: '\\operatorname{mod}\\left(47,5\\right)' }, { show: 'sqrt(50)', latex: '\\sqrt{50}' }, { show: 'nCr(5,2)', latex: '\\operatorname{nCr}\\left(5,2\\right)' }] } }),
    C({ id: 'k_dm_lists', topic: 'desmos', badge: 'bonus', title: 'Desmos: lists, sequences & sums',
      keywords: 'desmos list sequence sum sigma filter total length sort',
      see: [R`"What is the sum of the first $20$ terms of the sequence…"`],
      formula: R`$$[1, 2, \ldots, 100] \qquad \sum_{n=1}^{20} (3 + 4(n-1)) \qquad L[L > 5]$$`,
      steps: [R`Auto-fill: [1, 2, ..., 100]. Type "sum" for Σ.`, R`List tools: total(L), length(L), sort(L), L[L > 5] keeps values above 5.`],
      example: { q: R`Sum of the first $20$ terms of $3, 7, 11, \ldots$`, a: [R`$\sum_{n=1}^{20}(3 + 4(n-1)) = 820$`] },
      desmos: { lines: [{ show: 'sum n=1..20 of 3+4(n−1)', latex: '\\sum_{n=1}^{20}\\left(3+4\\left(n-1\\right)\\right)' }] } }),

    // ===== STRATEGY =====
    C({ id: 'k_grid_in', topic: 'strategy', badge: 'strategy', title: 'Typing your own answer: the entry rules',
      keywords: 'student produced response grid in rules characters fraction decimal negative mixed number',
      see: ['Questions with an empty box instead of A–D (about 1 in 4 math questions).'],
      pic: picGridIn,
      steps: [R`Up to $5$ characters for a positive answer, $6$ for a negative one (the minus sign counts).`, R`Fraction too long → type the decimal. Decimal too long → round or cut it to fill the space ($\frac23$ → .6666 or .6667).`, R`No mixed numbers, units, $\$$ or $\%$. More than one correct answer → type just one.`],
      example: { q: R`Answer $\frac{2}{3}$`, a: [R`2/3 ✓  .6667 ✓  .6666 ✓  0.67 ✗ (too short)`] },
      trap: 'Re-read: if they ask for a percent like 25%, type 25, not .25.' }),
    C({ id: 'k_backsolve', topic: 'strategy', badge: 'strategy', title: 'Plug in the answer choices',
      keywords: 'backsolve plug in answer choices test choices strategy',
      see: ['A "what is x?" question with plain numbers as choices — and the algebra looks ugly.'],
      pic: picBacksolve,
      steps: [R`Choices are numbers and the question asks for one value? Test them.`, R`Start with a middle choice; if it's too small, go bigger (choices are in order).`, R`Plug into the ORIGINAL equation — that also kills fake solutions.`],
      example: { q: R`$x + \sqrt{x+3} = 9$`, a: [R`$6 + \sqrt9 = 9$ ✓ → $x = 6$`] },
      trap: 'Desmos often does this faster: graph both sides and click the intersection.' }),
    C({ id: 'k_pick_numbers', topic: 'strategy', badge: 'strategy', title: 'Pick numbers when the choices have letters',
      keywords: 'pick numbers plug in values variables choices percent strategy',
      see: ['Answer choices full of variables, or percents of unknown amounts.'],
      pic: picPick,
      steps: [R`Choose easy numbers for the letters (100 for percent questions, 2 or 3 otherwise).`, R`Get the target number from the question.`, R`Plug the same numbers into each choice — keep the one that gives the target. Two match? Pick new numbers.`],
      example: { q: R`$x$ is 20% more than $y$, $y$ is 25% less than $z$`, a: [R`$z = 100 \Rightarrow y = 75 \Rightarrow x = 90$`, R`$x = 0.9z$`] },
      trap: 'Avoid 0 and 1 — they make different expressions look equal (1² = 1³).' }),
    C({ id: 'k_read_question', topic: 'strategy', badge: 'strategy', title: 'Answer the question they actually asked',
      keywords: 'read the question last line units what is asked careless mistakes',
      see: ['Every question — this is the #1 source of lost points.'],
      pic: picRead,
      steps: [R`Read the last line first and underline what they want ($2x + y$? the $y$-value? in minutes?).`, R`Solve.`, R`Before clicking: does your number answer that line? Right units, right sign, percent vs decimal?`],
      example: { q: R`Solved $x = 3$, but they ask for $2x + 1$`, a: [R`answer $7$ — and $3$ is usually one of the choices`] },
      trap: 'The wrong choices are built from the most common mistakes — getting a matching choice doesn\'t prove you\'re right.' }),
    C({ id: 'k_test_plan', topic: 'strategy', badge: 'strategy', title: 'SAT Math: structure, pacing & guessing',
      keywords: 'test structure modules time pacing guessing adaptive digital sat math',
      see: ['Before the test — know the clock.'],
      pic: picPlan,
      steps: [R`2 modules × 22 questions × 35 minutes. Roughly $1.5$ minutes each.`, R`Never leave a blank: there's no penalty for wrong answers. Mark hard ones and come back.`, R`Module 1 matters most: it decides how hard (and how high-scoring) Module 2 can be.`],
      trap: 'Don\'t burn 5 minutes on one question early — skip, mark, return.' })
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
