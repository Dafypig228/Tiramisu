// Cards: Algebra (linear) + Advanced Math. Needs cards.js (KP picture kit) loaded first.
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';

  // ---------- pictures ----------
  const picSolveLinear = K.svg(360, 150,
    [['One solution', '3x + 2 = x + 10', '2x = 8', 'x = 4', green, 'x-terms differ'],
     ['No solution', '4x − 8 = 4x + 5', '−8 = 5', 'never true', red, 'same x, different number'],
     ['Infinitely many', '4(x − 2) = 4x − 8', '4x − 8 = 4x − 8', 'always true', blue, 'both sides identical']]
      .map(([h, a, b, c, col, why], i) => {
        const x = 6 + i * 118;
        return K.rect(x, 6, 112, 138, { r: 8, c: col, w: 1.6 }) + K.t(x + 56, 26, h, { a: 'middle', b: true, c: col, s: 12.5 }) +
          K.t(x + 56, 52, a, { a: 'middle', s: 11 }) + K.t(x + 56, 72, '↓', { a: 'middle', c: gray }) +
          K.t(x + 56, 92, b, { a: 'middle', s: 11 }) + K.t(x + 56, 114, c, { a: 'middle', s: 11.5, b: true, c: col }) +
          K.t(x + 56, 134, why, { a: 'middle', s: 9.5, c: gray });
      }).join(''));

  const picChunk = K.svg(360, 140,
    K.rect(10, 14, 130, 34, { r: 8, f: '#f3f4f6' }) + K.t(75, 36, '3x + 2 = 8', { a: 'middle', b: true, s: 14 }) +
    K.l(144, 31, 206, 31, { c: blue, w: 2 }) + K.path('M200 25 L208 31 L200 37', { c: blue, w: 2 }) + K.t(175, 24, '× 2', { a: 'middle', c: blue, b: true }) +
    K.rect(212, 14, 140, 34, { r: 8, f: '#dbeafe', c: blue }) + K.t(282, 36, '6x + 4 = 16', { a: 'middle', b: true, s: 14, c: blue }) +
    K.t(10, 76, 'Never solve for x if they ask for a multiple of the chunk.', { s: 11.5, c: '#374151' }) +
    K.rect(10, 90, 100, 34, { r: 8, f: '#f3f4f6' }) + K.t(60, 112, 'x / y = 3', { a: 'middle', b: true, s: 14 }) +
    K.t(140, 104, 'flip', { a: 'middle', c: orange, b: true }) + K.l(118, 107, 162, 107, { c: orange, w: 2 }) +
    K.rect(170, 90, 182, 34, { r: 8, f: '#ffedd5', c: orange }) + K.t(261, 112, 'y / x = 1/3 → 2y/x = 2/3', { a: 'middle', b: true, s: 12.5, c: orange }));

  const picSlope = (() => {
    const p = K.plot({ x0: -4, x1: 6, y0: -9, y1: 7, xt: 1, yt: 2, h: 220 });
    p.fn(x => -2 * x + 1, { c: '#111' });
    p.seg(-2, 5, 4, 5, { c: blue, w: 3 }).seg(4, 5, 4, -7, { c: red, w: 3 });
    p.pt(-2, 5, { label: '(−2, 5)', dx: -10, dy: 18 }).pt(4, -7, { label: '(4, −7)', dx: 8, dy: 4 });
    p.txt(1, 5.6, 'run = 4 − (−2) = 6', { c: blue, b: true, a: 'middle', s: 11 });
    p.txt(3.8, -1, 'rise = −7 − 5 = −12', { c: red, b: true, s: 11, a: 'end' });
    p.txt(-3.8, -6, 'm = −12 / 6 = −2', { b: true, s: 13 });
    return p.svg();
  })();

  const picStdForm = (() => {
    const p = K.plot({ x0: -1, x1: 10, y0: -1, y1: 8, xt: 1, yt: 1 });
    p.fn(x => (24 - 3 * x) / 4, { c: '#111' });
    p.pt(8, 0, { c: blue, label: 'x-int 8', dx: -10, dy: -10 }).pt(0, 6, { c: red, label: 'y-int 6', dx: 8, dy: -4 });
    p.txt(4.3, 7.2, '3x + 4y = 24', { b: true, s: 14 });
    p.txt(4.3, 6.1, 'slope = −A/B = −3/4', { s: 12, c: '#374151' });
    p.txt(4.3, 5.1, 'cover y: 3x = 24 → x = 8', { s: 11, c: blue });
    p.txt(4.3, 4.2, 'cover x: 4y = 24 → y = 6', { s: 11, c: red });
    return p.svg();
  })();

  const picParPerp = (() => {
    const p = K.plot({ x0: -2, x1: 9, y0: -3, y1: 8, xt: 1, yt: 1, h: 220 });
    p.fn(x => 2 * x + 1, { c: blue }).fn(x => 2 * x - 3, { c: blue, d: '6 4' }).fn(x => -0.5 * x + 4, { c: red });
    const V = [p.X(1.2), p.Y(3.4)];
    p.add(K.ra(V, [p.X(2.2), p.Y(5.4)], [p.X(3.2), p.Y(2.4)], 9));
    p.txt(1.4, 7.4, 'y = 2x + 1', { c: blue, b: true, a: 'end' }).txt(5.6, 6.6, 'y = 2x − 3', { c: blue, b: true }).txt(5.6, 5.8, 'parallel: same slope 2', { c: blue, s: 10.5 });
    p.txt(5.6, 4.2, 'y = −½x + 4', { c: red, b: true }).txt(5.6, 3.4, 'perpendicular:', { c: red, s: 10.5 }).txt(5.6, 2.7, '2 · (−½) = −1', { c: red, s: 10.5 });
    return p.svg();
  })();

  const picSysCount = K.svg(360, 150, [
    ['One solution', 'lines cross', [[10, 100, 100, 20], [10, 30, 100, 95]], green],
    ['No solution', 'parallel', [[10, 95, 100, 35], [10, 70, 100, 10]], red],
    ['Infinitely many', 'same line', [[10, 95, 100, 25], [10, 95, 100, 25]], blue]
  ].map(([h, sub, ls, col], i) => {
    const x0 = 8 + i * 118;
    return K.rect(x0, 4, 110, 114, { r: 8, c: '#d1d5db' }) + ls.map((L, j) => K.l(x0 + L[0], L[1] + 4, x0 + L[2], L[3] + 4, { c: j ? col : '#111', w: j && i === 2 ? 5 : 2.2, d: j && i === 2 ? '2 6' : '' })).join('') +
      (i === 0 ? K.dot(x0 + 61, 66, col, 5) : '') + K.t(x0 + 55, 134, h, { a: 'middle', b: true, c: col, s: 12 }) + K.t(x0 + 55, 147, sub, { a: 'middle', s: 10, c: gray });
  }).join(''));

  const picSysSolve = K.svg(360, 150,
    K.t(40, 26, '2x + 3y = 11', { s: 15, b: true }) + K.t(40, 50, '3x + 2y = 9', { s: 15, b: true }) + K.t(18, 50, '+', { s: 18, b: true, c: blue }) +
    K.l(30, 60, 150, 60, { c: '#111', w: 1.5 }) + K.t(40, 82, '5x + 5y = 20', { s: 15, b: true, c: blue }) + K.t(40, 106, 'x + y = 4', { s: 15, b: true, c: blue }) +
    K.t(196, 26, 'subtract instead:', { s: 11.5, c: gray }) + K.t(196, 50, '(3x+2y) − (2x+3y)', { s: 12.5 }) + K.t(196, 74, '= 9 − 11', { s: 12.5 }) +
    K.t(196, 98, 'x − y = −2', { s: 15, b: true, c: orange }) + K.t(196, 130, 'then x = 1, y = 3', { s: 12.5, c: '#374151' }));

  const picIneq = (() => {
    const p = K.plot({ x0: -3, x1: 8, y0: -3, y1: 8, xt: 1, yt: 1, h: 220 });
    // y >= 2x - 1 (above)  and  y < -x + 5 (below): overlap is the region left of x=2 between them
    p.shade([[-3, -7 < -3 ? -3 : -7], [-1, -3], [2, 3], [-3, 8]].map(([x, y]) => [x, Math.max(-3, Math.min(8, y))]), 'rgba(37,99,235,0.18)');
    p.fn(x => 2 * x - 1, { c: blue }).fn(x => -x + 5, { c: red, d: '7 5' });
    p.pt(2, 3, { open: true, c: '#111' });
    p.txt(4.6, 7.2, 'y ≥ 2x − 1', { c: blue, b: true, s: 11 }).txt(4.6, 6.4, 'solid, shade above', { c: blue, s: 10 });
    p.txt(4.6, 1.8, 'y < −x + 5', { c: red, b: true, s: 11 }).txt(4.6, 1.0, 'dashed, shade below', { c: red, s: 10 });
    p.txt(-2.8, 5.5, 'solutions:', { s: 11, b: true }).txt(-2.8, 4.7, 'both shaded', { s: 11, b: true });
    return p.svg();
  })();

  const picAbs = (() => {
    const X = v => 30 + (v + 6) * 18;
    let s = K.l(X(-6), 60, X(12), 60, { w: 1.5 });
    for (let v = -6; v <= 12; v++) s += K.l(X(v), 56, X(v), 64, { w: 1 }) + (v % 2 === 0 ? K.t(X(v), 78, v, { a: 'middle', s: 10, c: gray }) : '');
    s += K.dot(X(3), 60, '#111', 5) + K.t(X(3), 44, 'center 3', { a: 'middle', b: true, s: 11 });
    s += K.path(`M${X(3)} 52 Q${X(-0.5)} 20 ${X(-4)} 52`, { c: blue, w: 2 }) + K.path(`M${X(3)} 52 Q${X(6.5)} 20 ${X(10)} 52`, { c: blue, w: 2 });
    s += K.dot(X(-4), 60, blue, 5) + K.dot(X(10), 60, blue, 5) + K.t(X(-0.5), 24, '7', { a: 'middle', c: blue, b: true }) + K.t(X(6.5), 24, '7', { a: 'middle', c: blue, b: true });
    s += K.t(10, 104, '|x − 3| = 7  →  x = 3 − 7 = −4  or  x = 3 + 7 = 10', { s: 12, b: true, c: blue });
    s += K.l(X(3), 130, X(7), 130, { c: red, w: 5 }) + K.dot(X(3), 130, red, 5) + K.dot(X(7), 130, red, 5);
    s += K.t(10, 160, '|x − 5| ≤ 2  →  3 ≤ x ≤ 7  (within 2 of 5)', { s: 12, b: true, c: red });
    return K.svg(360, 170, s);
  })();

  const picPointLine = (() => {
    const p = K.plot({ x0: -1, x1: 8, y0: -1, y1: 7, xt: 1, yt: 1 });
    p.fn(x => (21 - 3 * x) / 4, { c: '#111' });
    // foot of perpendicular from (1,2) to 3x+4y=21: (1,2)+t(3,4), 3(1+3t)+4(2+4t)=21 -> 11+25t=21 -> t=0.4 -> (2.2, 3.6)
    p.seg(1, 2, 2.2, 3.6, { c: red, w: 2.6, d: '5 4' }).pt(1, 2, { label: '(1, 2)', dx: -40, dy: 14 }).pt(2.2, 3.6, { c: red, r: 3 });
    p.add(K.ra([p.X(2.2), p.Y(3.6)], [p.X(1), p.Y(2)], [p.X(4.2), p.Y(2.1)], 8));
    p.txt(3.8, 5.6, '3x + 4y = 21', { b: true, s: 13 });
    p.txt(3.2, 1, 'd = |3·1 + 4·2 − 21| / 5 = 2', { c: red, b: true, s: 11.5 });
    return p.svg();
  })();

  const grid = (rows, head) => `<div class="k-ref">${head ? `<div class="k-ref-h give">${head}</div>` : ''}${rows.map(r => `<div>${r}</div>`).join('')}</div>`;

  const picExponents = grid([
    R`$x^a\cdot x^b=x^{a+b}$ <br><small>$x^2\cdot x^3=x^5$</small>`, R`$\dfrac{x^a}{x^b}=x^{a-b}$ <br><small>$\frac{x^7}{x^3}=x^4$</small>`,
    R`$(x^a)^b=x^{ab}$ <br><small>$(x^3)^4=x^{12}$</small>`, R`$(xy)^a=x^ay^a$ <br><small>$(2x)^3=8x^3$</small>`,
    R`$x^{-a}=\dfrac1{x^a}$ <br><small>$2^{-3}=\frac18$</small>`, R`$x^0=1$ <br><small>$(5x)^0=1$</small>`,
    R`$x^{\frac1n}=\sqrt[n]{x}$ <br><small>$8^{\frac13}=2$</small>`, R`$x^{\frac mn}=\sqrt[n]{x^m}$ <br><small>$x^{\frac34}=\sqrt[4]{x^3}$</small>`
  ]);

  const picRadicals = K.svg(360, 170,
    K.t(10, 22, '√(x + 7) = x − 5', { s: 14, b: true }) +
    K.t(10, 46, 'square:  x + 7 = x² − 10x + 25', { s: 12 }) +
    K.t(10, 68, 'x² − 11x + 18 = 0  →  (x − 2)(x − 9) = 0', { s: 12 }) +
    K.t(10, 92, 'check every answer in the ORIGINAL:', { s: 11.5, b: true, c: gray }) +
    K.rect(10, 102, 165, 54, { r: 8, c: red, f: '#fef2f2' }) + K.t(92, 124, 'x = 2:  √9 = 3', { a: 'middle', s: 12.5 }) + K.t(92, 144, 'but 2 − 5 = −3  ✗ fake', { a: 'middle', s: 12, b: true, c: red }) +
    K.rect(185, 102, 165, 54, { r: 8, c: green, f: '#f0fdf4' }) + K.t(267, 124, 'x = 9:  √16 = 4', { a: 'middle', s: 12.5 }) + K.t(267, 144, 'and 9 − 5 = 4  ✓', { a: 'middle', s: 12, b: true, c: green }));

  const picFactor = (() => {
    let s = '';
    const x0 = 14, y0 = 14, a = 84, b = 40;
    s += K.rect(x0, y0, a, a, { f: '#dbeafe', c: blue }) + K.rect(x0 + a, y0, b, a, { f: '#fef3c7', c: '#b45309' }) + K.rect(x0, y0 + a, a, b, { f: '#fef3c7', c: '#b45309' }) + K.rect(x0 + a, y0 + a, b, b, { f: '#dcfce7', c: green });
    s += K.t(x0 + a / 2, y0 + a / 2 + 5, 'a²', { a: 'middle', b: true, s: 15, c: blue }) + K.t(x0 + a + b / 2, y0 + a / 2 + 5, 'ab', { a: 'middle', b: true, c: '#b45309' }) + K.t(x0 + a / 2, y0 + a + b / 2 + 5, 'ab', { a: 'middle', b: true, c: '#b45309' }) + K.t(x0 + a + b / 2, y0 + a + b / 2 + 5, 'b²', { a: 'middle', b: true, c: green });
    s += K.t(x0 + a / 2, y0 - 2, 'a', { a: 'middle', s: 11 }) + K.t(x0 + a + b / 2, y0 - 2, 'b', { a: 'middle', s: 11 });
    s += K.t(x0, y0 + a + b + 20, '(a + b)² = a² + 2ab + b²', { s: 12, b: true });
    s += K.t(170, 34, 'Difference of squares', { b: true, s: 12.5 }) + K.t(170, 56, 'a² − b² = (a − b)(a + b)', { s: 12.5, c: blue, b: true }) + K.t(170, 76, '9x² − 25 = (3x − 5)(3x + 5)', { s: 12 });
    s += K.t(170, 108, 'Trinomial x² + bx + c', { b: true, s: 12.5 }) + K.t(170, 128, 'two numbers: × = c, + = b', { s: 12, c: orange, b: true }) + K.t(170, 148, 'x² − x − 12 = (x − 4)(x + 3)', { s: 12 });
    return K.svg(360, 170, s);
  })();

  const picQuadFormula = K.svg(360, 150, [
    ['D > 0', 'two solutions', 'M8 18 Q55 150 102 18', 72, green],
    ['D = 0', 'one solution', 'M8 14 Q55 142 102 14', 78, blue],
    ['D < 0', 'no real solution', 'M8 10 Q55 100 102 10', 78, red]
  ].map(([h, sub, d, ax, col], i) => {
    const x0 = 8 + i * 118;
    return `<g transform="translate(${x0},4)">${K.rect(0, 0, 110, 110, { r: 8, c: '#d1d5db' })}${K.l(0, ax, 110, ax, { c: gray, w: 1.2 })}${K.path(d, { c: col, w: 2.4 })}${i === 0 ? K.dot(26, ax, col, 4.5) + K.dot(84, ax, col, 4.5) : i === 1 ? K.dot(55, ax, col, 4.5) : ''}</g>` +
      K.t(x0 + 55, 132, h, { a: 'middle', b: true, c: col, s: 13 }) + K.t(x0 + 55, 146, sub, { a: 'middle', s: 10.5, c: gray });
  }).join(''));

  const picVieta = (() => {
    const p = K.plot({ x0: -0.5, x1: 7.5, y0: -6, y1: 4, xt: 1, yt: 2 });
    p.fn(x => 2 * x * x - 8 * x + 3);
    const r1 = 2 - Math.sqrt(10) / 2, r2 = 2 + Math.sqrt(10) / 2;
    p.pt(r1, 0, { c: blue, label: 'r₁', dx: -16, dy: -8 }).pt(r2, 0, { c: blue, label: 'r₂', dx: 6, dy: -8 });
    p.txt(4.4, 2.6, '2x² − 8x + 3 = 0', { b: true, s: 13 });
    p.txt(4.4, -1.6, 'sum = −b/a', { c: blue, b: true, s: 11.5 }).txt(4.4, -2.6, '= 8/2 = 4', { c: blue, b: true, s: 11.5 });
    p.txt(4.4, -4.0, 'product = c/a', { c: orange, b: true, s: 11.5 }).txt(4.4, -5.0, '= 3/2', { c: orange, b: true, s: 11.5 });
    return p.svg();
  })();

  const picCompleteSq = (() => {
    let s = '';
    const x0 = 16, y0 = 18, a = 90, h = 36;
    s += K.rect(x0, y0, a, a, { f: '#dbeafe', c: blue }) + K.t(x0 + a / 2, y0 + a / 2 + 5, 'x²', { a: 'middle', b: true, s: 15, c: blue });
    s += K.rect(x0 + a, y0, h, a, { f: '#fef3c7', c: '#b45309' }) + K.t(x0 + a + h / 2, y0 + a / 2 + 5, '4x', { a: 'middle', b: true, c: '#b45309' });
    s += K.rect(x0, y0 + a, a, h, { f: '#fef3c7', c: '#b45309' }) + K.t(x0 + a / 2, y0 + a + h / 2 + 5, '4x', { a: 'middle', b: true, c: '#b45309' });
    s += K.rect(x0 + a, y0 + a, h, h, { f: '#dcfce7', c: green, d: '4 3' }) + K.t(x0 + a + h / 2, y0 + a + h / 2 + 5, '16', { a: 'middle', b: true, c: green });
    s += K.t(x0 + a / 2, y0 - 4, 'x', { a: 'middle', s: 11 }) + K.t(x0 + a + h / 2, y0 - 4, '4', { a: 'middle', s: 11 });
    s += K.t(168, 36, 'x² + 8x = x² + 4x + 4x', { s: 12.5 }) + K.t(168, 60, 'missing corner: (8/2)² = 16', { s: 12.5, c: green, b: true });
    s += K.t(168, 92, 'x² + 8x + 16 = (x + 4)²', { s: 13, b: true }) + K.t(168, 124, 'so  x² + 8x = (x + 4)² − 16', { s: 12.5, c: blue, b: true });
    return K.svg(360, 160, s);
  })();

  const picFunction = K.svg(360, 150,
    K.rect(10, 30, 70, 40, { r: 8, f: '#f3f4f6' }) + K.t(45, 55, 'x = −2', { a: 'middle', b: true, s: 13 }) +
    K.l(84, 50, 120, 50, { w: 2 }) + K.path('M114 44 L122 50 L114 56', { w: 2 }) +
    K.rect(126, 20, 108, 60, { r: 10, f: '#dbeafe', c: blue }) + K.t(180, 44, 'f', { a: 'middle', b: true, s: 16, c: blue }) + K.t(180, 64, '3( )² − 2', { a: 'middle', s: 12, c: blue }) +
    K.l(238, 50, 274, 50, { w: 2 }) + K.path('M268 44 L276 50 L268 56', { w: 2 }) +
    K.rect(280, 30, 70, 40, { r: 8, f: '#dcfce7', c: green }) + K.t(315, 55, '10', { a: 'middle', b: true, s: 15, c: green }) +
    K.t(10, 104, 'f(−2) = 3(−2)² − 2 = 12 − 2 = 10', { s: 13, b: true }) +
    K.t(10, 130, 'f(g(x)): do g first, then put the result into f', { s: 12, c: '#374151' }));

  const picTransform = (() => {
    const p = K.plot({ x0: -3, x1: 5, y0: -1, y1: 9, xt: 1, yt: 1 });
    p.fn(x => x * x, { c: gray, w: 2 }).fn(x => (x - 2) * (x - 2) + 3, { c: red });
    p.pt(0, 0, { c: gray }).pt(2, 3, { c: red });
    p.add(K.path(`M${p.X(0.15)} ${p.Y(0.2)} L${p.X(1.85)} ${p.Y(2.8)}`, { c: '#111', w: 1.6, d: '4 3' }));
    p.txt(3.1, 1.7, 'y = (x − 2)² + 3', { c: red, b: true, s: 11 }).txt(3.1, 0.6, 'y = x²', { c: gray, b: true, s: 11 });
    p.txt(1.2, 1.2, 'right 2, up 3', { b: true, s: 11 });
    return p.svg();
  })();

  const picExpGrowth = (() => {
    const p = K.plot({ x0: 0, x1: 5, y0: 0, y1: 500, xt: 1, yt: 100, l: 34 });
    p.fn(x => 100 * Math.pow(1.5, x), { c: red }).fn(x => 100 * Math.pow(0.6, x), { c: blue });
    p.pt(0, 100, { label: 'start a = 100', dx: 8, dy: -8 });
    p.txt(0.3, 470, 'y = 100(1.5)ᵗ', { c: red, b: true }).txt(0.3, 435, '×1.5 each step = +50%', { c: red, s: 11 });
    p.txt(2.3, 150, 'y = 100(0.6)ᵗ', { c: blue, b: true }).txt(2.3, 110, '×0.6 each step = −40%', { c: blue, s: 11 });
    return p.svg();
  })();

  const picLinVsExp = (() => {
    const tb = (x0, title, vals, ops, col) => {
      let s = K.t(x0 + 75, 18, title, { a: 'middle', b: true, c: col, s: 12.5 });
      vals.forEach((v, i) => { s += K.rect(x0, 26 + i * 28, 50, 26, { f: '#f3f4f6', c: '#d1d5db' }) + K.t(x0 + 25, 44 + i * 28, i, { a: 'middle', s: 12 }) + K.rect(x0 + 50, 26 + i * 28, 50, 26, { c: '#d1d5db' }) + K.t(x0 + 75, 44 + i * 28, v, { a: 'middle', s: 12, b: true }); });
      ops.forEach((o, i) => { s += K.path(`M${x0 + 104} ${40 + i * 28} q14 14 0 28`, { c: col, w: 1.6 }) + K.t(x0 + 122, 58 + i * 28, o, { s: 11.5, b: true, c: col }); });
      return s;
    };
    return K.svg(360, 150, tb(10, 'Linear', [5, 8, 11, 14], ['+3', '+3', '+3'], blue) + tb(190, 'Exponential', [5, 10, 20, 40], ['×2', '×2', '×2'], red) +
      K.t(60, 144, 'x', { a: 'middle', s: 10, c: gray }) + K.t(240, 144, 'x', { a: 'middle', s: 10, c: gray }));
  })();

  const picPoly = (() => {
    const f = x => 0.25 * (x + 2) * (x - 1) * (x - 1) * (x - 4);
    const p = K.plot({ x0: -2.6, x1: 4.6, y0: -7, y1: 7, xt: 1, yt: 2 });
    p.fn(f);
    p.pt(-2, 0, { c: blue, label: '−2: cross', dx: 6, dy: 16, s: 10.5 }).pt(1, 0, { c: red, label: '1: bounce (squared)', dx: -40, dy: -12, s: 10.5 }).pt(4, 0, { c: blue, label: '4: cross', dx: -50, dy: -8, s: 10.5 });
    p.txt(-2.5, -6.4, 'y = ¼(x + 2)(x − 1)²(x − 4)', { b: true, s: 11.5 });
    return p.svg();
  })();

  const picRational = (() => {
    const p = K.plot({ x0: -3, x1: 7, y0: -4, y1: 6, xt: 1, yt: 1 });
    p.seg(2, -4, 2, 6, { c: red, w: 1.6, d: '6 4' }).seg(-3, 1, 7, 1, { c: blue, w: 1.6, d: '6 4' });
    p.fn(x => (x < 2 ? 1 / (x - 2) + 1 : NaN)).fn(x => (x > 2 ? 1 / (x - 2) + 1 : NaN));
    p.txt(2.2, 5.3, 'x = 2: denominator 0', { c: red, b: true, s: 11 }).txt(2.2, 4.6, '→ not allowed', { c: red, s: 11 });
    p.txt(2.6, 0.4, 'y = 1: flat line it nears', { c: blue, s: 10.5 });
    p.txt(-2.9, 5.2, 'y = 1/(x − 2) + 1', { b: true, s: 12.5 });
    return p.svg();
  })();

  const picNonlin = (() => {
    const p = K.plot({ x0: -1, x1: 6, y0: 0, y1: 9, xt: 1, yt: 1 });
    p.fn(x => x * x - 4 * x + 7);
    p.fn(x => 2 * x - 2, { c: red }).seg(-1, 5, 6, 5, { c: blue, w: 2, d: '7 4' }).seg(-1, 2, 6, 2, { c: gray, w: 2, d: '3 4' });
    p.pt(3, 4, { c: red, label: '1 point (3, 4)', dx: 8, dy: 14, s: 10.5 });
    p.pt(2 - Math.SQRT2, 5, { c: blue }).pt(2 + Math.SQRT2, 5, { c: blue });
    p.txt(4.4, 5.3, 'y = 5: 2 points', { c: blue, b: true, s: 10.5 }).txt(4.4, 2.3, 'y = 2: none', { c: gray, b: true, s: 10.5 });
    p.txt(-0.8, 8.4, 'y = x² − 4x + 7', { b: true, s: 12 });
    return p.svg();
  })();

  const picMatch = K.svg(360, 160,
    K.t(10, 26, '(ax + 3)(2x − 5) = 6x² + bx − 15', { s: 14, b: true }) +
    K.t(10, 56, 'x² terms:', { s: 12, c: gray }) + K.t(90, 56, 'a · 2 = 6  →  a = 3', { s: 13, b: true, c: blue }) +
    K.t(10, 82, 'numbers:', { s: 12, c: gray }) + K.t(90, 82, '3 · (−5) = −15  ✓ (check)', { s: 13, c: green, b: true }) +
    K.t(10, 108, 'x terms:', { s: 12, c: gray }) + K.t(90, 108, '−5a + 3·2 = b  →  b = −15 + 6 = −9', { s: 13, b: true, c: orange }) +
    K.t(10, 142, 'a + b = 3 + (−9) = −6', { s: 14, b: true }));

  // ---------- cards ----------
  const C = (o) => Object.assign({ v: 2 }, o);
  const cards = [
    // ===== LINEAR =====
    C({ id: 'k_solve_linear', topic: 'linear', badge: 'memo', title: 'Linear equations: one, no, or infinitely many solutions',
      keywords: 'linear equation one variable no solution infinitely many solutions identity distribute',
      see: [R`"How many solutions does $4(x-2) = 4x + 5$ have?"`, R`"For what value of $k$ does $3(2x+k) = 6x+12$ have infinitely many solutions?"`],
      pic: picSolveLinear,
      formula: R`$$ax+b=cx+d:\quad a\ne c \to \text{one}\qquad a=c,\ b\ne d \to \text{none}\qquad a=c,\ b=d \to \infty$$`,
      steps: [R`Distribute and collect so each side looks like (number)$\,x$ + (number).`, R`Compare the $x$-numbers first. Different → exactly one solution.`, R`Same $x$-numbers → compare the plain numbers: different → no solution; same → infinitely many.`],
      example: { q: R`$3(2x+k) = 6x+12$ has infinitely many solutions. $k = ?$`, a: [R`$6x + 3k = 6x + 12$`, R`$3k = 12 \Rightarrow k = 4$`] },
      trap: R`Getting $0 = 0$ does not mean $x = 0$ — it means every $x$ works.`,
      desmos: { lines: [{ show: 'y=4(x-2)', latex: 'y=4(x-2)' }, { show: 'y=4x+5', latex: 'y=4x+5' }], tip: 'Graph both sides: parallel lines = no solution, one line on top of the other = infinitely many.' } }),
    C({ id: 'k_chunk', topic: 'linear', badge: 'memo', title: 'Whole-chunk trick: find 6x + 4 without finding x',
      keywords: 'chunk substitution expression value flip fraction reciprocal shortcut',
      see: [R`"If $3x + 2 = 8$, what is the value of $6x + 4$?"`, R`"If $\frac{x}{y} = 3$, what is $\frac{2y}{x}$?"`],
      pic: picChunk,
      formula: R`$$\text{if } A = k \text{ then } nA = nk \qquad \frac{a}{b} = k \Rightarrow \frac{b}{a} = \frac1k$$`,
      steps: [R`Compare what they ask with what they give — is it a multiple (or a part) of the same chunk?`, R`Multiply or divide the whole equation to turn one into the other.`, R`Ratios: flip both sides to get the upside-down fraction.`],
      example: { q: R`$5a - 15b = 40$. What is $a - 3b$?`, a: [R`divide everything by $5$`, R`$a - 3b = 8$`] },
      trap: 'The answer is the chunk they ask for, not x. Reread the last line.' }),
    C({ id: 'k_slope', topic: 'linear', badge: 'memo', title: 'Slope from two points, a table or a graph',
      keywords: 'slope rate of change rise over run two points table graph',
      see: [R`"A line passes through $(-2, 5)$ and $(4, -7)$. What is its slope?"`, R`"The table shows values of $x$ and $y$… rate of change"`],
      pic: picSlope,
      formula: R`$$m=\frac{\text{rise}}{\text{run}}=\frac{y_2-y_1}{x_2-x_1}$$`,
      steps: [R`Pick any two points (two table rows work too).`, R`Subtract the $y$'s and the $x$'s in the same order.`, R`Sanity check: line goes down from left to right → negative slope.`],
      example: { q: R`Table: $(1,\ 7),\ (3,\ 13),\ (5,\ 19)$. Equation?`, a: [R`$m = \frac{13-7}{3-1} = 3$`, R`$b = 7 - 3\cdot1 = 4 \Rightarrow y = 3x + 4$`] },
      trap: R`Rise is $y$, run is $x$ — don't flip them. Horizontal line: $m = 0$. Vertical line: undefined.`,
      desmos: { lines: [{ show: '(-2,5)', latex: '(-2,5)' }, { show: '(4,-7)', latex: '(4,-7)' }, { show: 'y=-2x+1', latex: 'y=-2x+1' }], tip: 'If both points sit on your line, your slope and intercept are right.' } }),
    C({ id: 'k_std_form', topic: 'linear', badge: 'memo', title: 'Standard form Ax + By = C: slope and intercepts in 5 seconds',
      keywords: 'standard form ax+by=c slope intercepts x-intercept y-intercept leapfrog perpendicular',
      see: [R`"What is the slope of the line $3x + 4y = 24$?"`, R`"What is the $x$-intercept of $2x - 5y = 10$?"`],
      pic: picStdForm,
      formula: R`$$m = -\frac{A}{B}\qquad x\text{-int} = \frac{C}{A}\qquad y\text{-int} = \frac{C}{B}$$`,
      steps: [R`Slope: $-\frac{(\text{number with } x)}{(\text{number with } y)}$.`, R`Intercepts: cover the other variable (set it to $0$) and divide.`, R`Leapfrog: when $x$ goes up by $\Delta x$, $y$ changes by $m\cdot\Delta x$ — no need for $b$.`],
      example: { q: R`$2x - 5y = 10$`, a: [R`slope $= -\frac{2}{-5} = \frac25$`, R`$x$-int $= \frac{10}{2} = 5$, $y$-int $= \frac{10}{-5} = -2$`] },
      trap: R`Keep the sign: in $2x - 5y$, $B = -5$. "How much does $x$ change when $y$ goes up 1?" → $\frac1m$.`,
      desmos: { lines: [{ show: '3x+4y=24', latex: '3x+4y=24' }], tip: 'Click where the line crosses each axis.' } }),
    C({ id: 'k_parallel_perp', topic: 'linear', badge: 'memo', title: 'Parallel & perpendicular lines',
      keywords: 'parallel perpendicular negative reciprocal slope line through point',
      see: [R`"Line $\ell$ is perpendicular to $y = \frac23x + 1$ and passes through $(4, 1)$…"`, R`"Which equation's graph is parallel to…"`],
      pic: picParPerp,
      formula: R`$$\text{parallel: } m_1 = m_2 \qquad \text{perpendicular: } m_1\cdot m_2 = -1$$`,
      steps: [R`Get the slope (rewrite as $y = mx + b$, or use $-\frac AB$).`, R`Parallel: same slope. Perpendicular: flip it and change the sign ($\frac23 \to -\frac32$).`, R`Plug the given point into $y = mx + b$ to find $b$.`],
      example: { q: R`Perpendicular to $y = \frac23x + 1$, through $(4, 1)$.`, a: [R`$m = -\frac32$`, R`$1 = -\frac32\cdot4 + b \Rightarrow b = 7$`, R`$y = -\frac32x + 7$`] },
      trap: R`Negative reciprocal of $3$ is $-\frac13$, not $-3$.`,
      desmos: { lines: [{ show: 'y=2x+1', latex: 'y=2x+1' }, { show: 'y=-0.5x+4', latex: 'y=-0.5x+4' }] } }),
    C({ id: 'k_systems_count', topic: 'linear', badge: 'memo', title: 'Systems: 0, 1 or ∞ solutions (ratio test)',
      keywords: 'system of equations no solution infinitely many solutions one solution ratio coefficients parallel',
      see: [R`"For what value of $k$ does the system have no solution?"`, R`"…the system has infinitely many solutions. What is $c$?"`],
      pic: picSysCount,
      formula: R`$$\frac{a_1}{a_2}\ne\frac{b_1}{b_2}\to\text{one}\qquad \frac{a_1}{a_2}=\frac{b_1}{b_2}\ne\frac{c_1}{c_2}\to\text{none}\qquad \text{all equal}\to\infty$$`,
      steps: [R`Write both as $ax + by = c$.`, R`Compare $\frac{a_1}{a_2}$ with $\frac{b_1}{b_2}$. Different → one solution.`, R`Same → compare $\frac{c_1}{c_2}$: different → no solution; same → infinitely many.`],
      example: { q: R`$3x + ky = 7$ and $6x + 8y = 5$ have no solution.`, a: [R`$\frac36 = \frac k8 \Rightarrow k = 4$`, R`check $\frac75 \ne \frac12$ ✓`] },
      trap: 'No solution = same slope, different intercept. Infinitely many = the exact same line.',
      desmos: { lines: [{ show: '3x+ky=7', latex: '3x+ky=7' }, { show: '6x+8y=5', latex: '6x+8y=5' }, { show: 'k=4', latex: 'k=4' }], tip: 'Change k: at k = 4 the lines become parallel.' } }),
    C({ id: 'k_systems_solve', topic: 'linear', badge: 'memo', title: 'Solving systems fast: add or subtract the equations',
      keywords: 'system elimination substitution add equations x+y x-y swapped coefficients',
      see: [R`"If $2x + 3y = 11$ and $3x + 2y = 9$, what is $x + y$?"`, R`"What is the value of $x - y$?"`],
      pic: picSysSolve,
      formula: R`$$\text{add or subtract the equations to get exactly what they ask}$$`,
      steps: [R`Read what they ask: $x + y$? $x - y$? $2x$? Not always $x$.`, R`Swapped numbers ($2x+3y$, $3x+2y$): add → $5(x+y)$, subtract → $x - y$.`, R`Otherwise eliminate (make one variable cancel) or use Desmos intersection.`],
      example: { q: R`$x + y = 10,\ x - y = 4$`, a: [R`add: $2x = 14 \Rightarrow x = 7$`, R`$y = 10 - 7 = 3$`] },
      trap: R`They often ask for $x + y$ or $2x$ — don't stop at $x$.`,
      desmos: { lines: [{ show: '2x+3y=11', latex: '2x+3y=11' }, { show: '3x+2y=9', latex: '3x+2y=9' }], tip: 'Click the intersection: (1, 3).' } }),
    C({ id: 'k_linear_ineq', topic: 'linear', badge: 'memo', title: 'Linear inequalities: "at least", "at most", and shading',
      keywords: 'inequality at least at most no more than maximum minimum flip sign shading system of inequalities',
      see: [R`"A plumber charges $\$60$ plus $\$45$ per hour… at most $\$300$. Maximum hours?"`, R`"Which point $(x, y)$ is a solution to the system of inequalities?"`],
      pic: picIneq,
      formula: R`$$\text{at least} \to \ge \qquad \text{at most / no more than} \to \le \qquad \times(-1) \to \text{flip the sign}$$`,
      steps: [R`Translate the words into $\ge,\ \le,\ >,\ <$.`, R`Solve like an equation. Multiply or divide by a negative → flip the sign.`, R`In context, round to whole items: "at most" → round down, "at least" → round up.`],
      example: { q: R`$60 + 45h \le 300$`, a: [R`$45h \le 240 \Rightarrow h \le 5.33$`, R`maximum $5$ whole hours`] },
      trap: R`$-2x > 6 \Rightarrow x < -3$ (flip!). To test a point, plug it into every inequality.`,
      desmos: { lines: [{ show: 'y≥2x-1', latex: 'y\\ge2x-1' }, { show: 'y<-x+5', latex: 'y<-x+5' }], tip: 'The region shaded twice is the solution set.' } }),
    C({ id: 'k_abs', topic: 'linear', badge: 'memo', title: 'Absolute value: two cases, or distance from the center',
      keywords: 'absolute value |x| distance two solutions sum of solutions inequality center radius',
      see: [R`"$|x - 3| = 7$. What is the sum of the solutions?"`, R`"Which inequality describes all $x$ within $2$ of $5$?"`],
      pic: picAbs,
      formula: R`$$|x-a| = b \Rightarrow x = a \pm b \qquad |x-a| \le b \Rightarrow a-b \le x \le a+b$$`,
      steps: [R`Get the $|\ \ |$ alone on one side.`, R`Split: inside $= +b$ or inside $= -b$.`, R`Sum of the two solutions $= 2\times$center. Range $p \le x \le q$ → center $\frac{p+q}2$, radius $\frac{q-p}2$.`],
      example: { q: R`$|2x - 6| = 10$`, a: [R`$2x - 6 = 10 \Rightarrow x = 8$`, R`$2x - 6 = -10 \Rightarrow x = -2$; sum $= 6$`] },
      trap: R`$|\ldots| =$ negative → no solution. $|\ldots| = 0$ → one solution.` }),
    C({ id: 'k_point_line', topic: 'linear', badge: 'bonus', title: 'Distance from a point to a line',
      keywords: 'distance point to line perpendicular distance tangent line circle',
      see: [R`"What is the distance from $(1, 2)$ to the line $3x + 4y = 21$?"`, R`"Is the line tangent to the circle?"`],
      pic: picPointLine,
      formula: R`$$d = \frac{|Ax_0 + By_0 - C|}{\sqrt{A^2 + B^2}} \quad\text{for the line } Ax + By = C$$`,
      steps: [R`Write the line as $Ax + By = C$.`, R`Plug the point into $Ax + By - C$, take the absolute value.`, R`Divide by $\sqrt{A^2+B^2}$. Line tangent to a circle ⇔ distance from center $=$ radius.`],
      example: { q: R`$(1, 2)$ and $3x + 4y = 21$`, a: [R`$|3 + 8 - 21| = 10$, $\sqrt{9+16} = 5$`, R`$d = 2$`] },
      trap: 'Use the same C as in Ax + By = C (minus C inside the bars).' }),

    // ===== ADVANCED =====
    C({ id: 'k_exponents', topic: 'advanced', badge: 'memo', title: 'Exponent rules & matching bases',
      keywords: 'exponent rules powers negative exponent fractional exponent same base radical',
      see: [R`"Which expression is equivalent to $\frac{(x^3y^{-2})^4}{x^5}$?"`, R`"If $2^{3x} = 32^{x-1}$, what is $x$?"`],
      pic: picExponents,
      formula: R`$$a^m = a^n \Rightarrow m = n \quad (\text{same base})$$`,
      steps: [R`Rewrite everything with the same base: $4 = 2^2,\ 8 = 2^3,\ 32 = 2^5,\ 27 = 3^3,\ \frac19 = 3^{-2}$.`, R`Combine with the rules above.`, R`Same base on both sides → set the exponents equal.`],
      example: { q: R`$2^{3x} = 32^{x-1}$`, a: [R`$2^{3x} = 2^{5(x-1)}$`, R`$3x = 5x - 5 \Rightarrow x = \frac52$`] },
      trap: R`$(x+y)^2 \ne x^2 + y^2$. $\sqrt{x^2} = |x|$. $-2^2 = -4$ but $(-2)^2 = 4$.`,
      desmos: { lines: [{ show: 'y=2^(3x)', latex: 'y=2^{3x}' }, { show: 'y=32^(x-1)', latex: 'y=32^{x-1}' }], tip: 'Intersection at x = 2.5.' } }),
    C({ id: 'k_radicals', topic: 'advanced', badge: 'memo', title: 'Radical equations & fake solutions',
      keywords: 'square root radical equation extraneous solution fake solution conjugate rationalize',
      see: [R`"What are all solutions to $\sqrt{x+7} = x - 5$?"`, R`"Which is equivalent to $\frac{6}{3 - \sqrt3}$?"`],
      pic: picRadicals,
      formula: [R`$$\sqrt{A} = B \Rightarrow A = B^2,\ \text{then CHECK}$$`, R`$$\frac{c}{a+\sqrt b}\cdot\frac{a-\sqrt b}{a-\sqrt b} = \frac{c(a-\sqrt b)}{a^2-b}$$`],
      steps: [R`Get the root alone, then square both sides.`, R`Solve what's left (usually a quadratic).`, R`Plug every answer into the original. Squaring creates fake answers — and they appear as choices.`],
      example: { q: R`$\sqrt{x+7} = x - 5$`, a: [R`candidates $x = 2,\ 9$`, R`only $x = 9$ works`] },
      trap: R`$\sqrt{x} = -4$ has no solution at all (a root is never negative).`,
      desmos: { lines: [{ show: 'y=sqrt(x+7)', latex: 'y=\\sqrt{x+7}' }, { show: 'y=x-5', latex: 'y=x-5' }], tip: 'Only one intersection → only one real solution.' } }),
    C({ id: 'k_factor_patterns', topic: 'advanced', badge: 'memo', title: 'Factoring patterns you must recognize',
      keywords: 'factoring difference of squares perfect square trinomial foil equivalent expression',
      see: [R`"Which expression is equivalent to $9x^2 - 25$?"`, R`"Which is a factor of $x^2 - x - 12$?"`],
      pic: picFactor,
      formula: [R`$$a^2-b^2=(a-b)(a+b)$$`, R`$$(a\pm b)^2=a^2\pm2ab+b^2$$`],
      steps: [R`Two squares with a minus → difference of squares.`, R`Middle term $= 2\cdot\sqrt{\text{first}}\cdot\sqrt{\text{last}}$ → perfect square.`, R`$x^2 + bx + c$: find two numbers that multiply to $c$ and add to $b$.`],
      example: { q: R`$x^2 - x - 12$`, a: [R`$-4 \cdot 3 = -12$, $-4 + 3 = -1$`, R`$(x - 4)(x + 3)$`] },
      trap: R`$a^2 + b^2$ does not factor. $(a+b)^2 \ne a^2 + b^2$.`,
      desmos: { lines: [{ show: 'y=9x^2-25', latex: 'y=9x^2-25' }, { show: 'y=(3x-5)(3x+5)', latex: 'y=(3x-5)(3x+5)' }], tip: 'Same graph = equivalent.' } }),
    C({ id: 'k_quad_formula', topic: 'advanced', badge: 'memo', title: 'Quadratic formula & discriminant (how many solutions)',
      keywords: 'quadratic formula discriminant b^2-4ac number of solutions real solutions roots',
      see: [R`"How many real solutions does $3x^2 - 5x + 4 = 0$ have?"`, R`"For what $k$ does $x^2 + kx + 9 = 0$ have exactly one solution?"`],
      pic: picQuadFormula,
      formula: [R`$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$`, R`$$D = b^2 - 4ac:\ \ D>0 \to 2,\ \ D=0 \to 1,\ \ D<0 \to 0$$`],
      steps: [R`Move everything to one side: $ax^2 + bx + c = 0$.`, R`"How many solutions" → only compute $D = b^2 - 4ac$.`, R`Exact solutions → the formula (or factor, or Desmos).`],
      example: { q: R`$x^2 + kx + 9 = 0$ has exactly one solution, $k > 0$.`, a: [R`$D = k^2 - 36 = 0$`, R`$k = 6$`] },
      trap: R`Signs belong to the numbers: in $x^2 - 6x - 4$, $b = -6$ and $c = -4$.`,
      desmos: { lines: [{ show: 'y=3x^2-5x+4', latex: 'y=3x^2-5x+4' }], tip: 'No x-intercepts → no real solutions.' } }),
    C({ id: 'k_vieta', topic: 'advanced', badge: 'memo', title: 'Sum & product of the solutions without solving',
      keywords: 'sum of roots product of roots vieta solutions quadratic -b/a c/a shifted roots',
      see: [R`"What is the sum of the solutions to $2x^2 - 8x + 3 = 0$?"`, R`"…product of the solutions"`],
      pic: picVieta,
      formula: R`$$r_1 + r_2 = -\frac{b}{a} \qquad r_1\cdot r_2 = \frac{c}{a}$$`,
      steps: [R`Rewrite as $ax^2 + bx + c = 0$ (zero on one side).`, R`Sum $= -\frac ba$, product $= \frac ca$.`, R`Shifted: roots of $f(x-h) = 0$ are each $+h$ → sum grows by $2h$.`],
      example: { q: R`$3x^2 + 12x - 7 = 0$`, a: [R`sum $= -\frac{12}{3} = -4$`, R`product $= -\frac73$`] },
      trap: R`Must equal $0$ first. The sum is $-\frac ba$ — the minus sign matters.` }),
    C({ id: 'k_complete_square', topic: 'advanced', badge: 'memo', title: 'Completing the square (vertex form, circle center)',
      keywords: 'completing the square vertex form circle equation center radius half the coefficient',
      see: [R`"Rewrite $x^2 - 10x + 7$ in the form $(x-h)^2 + k$"`, R`"$x^2 + 8x + y^2 - 6y = 11$ … radius?"`],
      pic: picCompleteSq,
      formula: R`$$x^2 + bx = \left(x + \tfrac b2\right)^2 - \left(\tfrac b2\right)^2$$`,
      steps: [R`Take half of the $x$-number.`, R`Write $(x + \text{half})^2$ and subtract $\text{half}^2$.`, R`Collect the plain numbers. If $a \ne 1$, factor $a$ out first.`],
      example: { q: R`$x^2 - 10x + 7$`, a: [R`half of $-10$ is $-5$`, R`$(x-5)^2 - 25 + 7 = (x-5)^2 - 18$ → vertex $(5, -18)$`] },
      trap: 'In an equation, add the same number to both sides (circle questions).' }),
    C({ id: 'k_function_notation', topic: 'advanced', badge: 'memo', title: 'Function notation: f(3), f(g(x)), f(2x − 1)',
      keywords: 'function notation evaluate composition f(g(x)) input output table graph',
      see: [R`"$f(x) = 3x^2 - 2$. What is $f(-2)$?"`, R`"$f(2x - 1) = 6x + 5$. What is $f(7)$?"`],
      pic: picFunction,
      formula: R`$$f(\square) \text{ means: put } \square \text{ in place of every } x$$`,
      steps: [R`$f(a)$: replace every $x$ with $(a)$ in parentheses.`, R`$f(g(x))$: work inside first — find $g$, feed the result into $f$. From a graph: $f(4)$ is the $y$-value at $x = 4$.`, R`$f(2x-1)$ given: set $2x - 1 = 7$, get $x = 4$, plug into the right side: $6(4) + 5 = 29$.`],
      example: { q: R`$f(x) = 2x + 1,\ g(x) = x^2$. $f(g(3)) = ?$`, a: [R`$g(3) = 9$`, R`$f(9) = 19$`] },
      trap: R`$f(-2)$ with $3x^2$: $3(-2)^2 = 12$, not $-12$. $f(x) + 3 \ne f(x+3)$.` }),
    C({ id: 'k_transform', topic: 'advanced', badge: 'memo', title: 'Graph shifts, flips & stretches',
      keywords: 'transformation shift translate reflect flip stretch f(x-h)+k graph moved',
      see: [R`"The graph of $y = f(x - 2) + 3$ is the graph of $f$ shifted…"`, R`"Point $(1, 4)$ is on $f$. Which point is on $g(x) = f(x-2)+3$?"`],
      pic: picTransform,
      formula: R`$$f(x-h)+k:\ \text{right } h,\ \text{up } k \qquad -f(x):\ \text{flip over x-axis} \qquad f(-x):\ \text{flip over y-axis}$$`,
      steps: [R`Change inside with $x$ → horizontal, and backwards: $f(x-2)$ moves RIGHT $2$.`, R`Change outside → vertical, as written: $+3$ moves up $3$.`, R`Point $(a, b)$ on $f$ → $(a+h,\ b+k)$ on $f(x-h)+k$.`],
      example: { q: R`$(1, 4)$ on $f$. Point on $f(x-2)+3$?`, a: [R`$(1+2,\ 4+3) = (3, 7)$`] },
      trap: R`$f(x+2)$ moves LEFT 2.`,
      desmos: { lines: [{ show: 'y=x^2', latex: 'y=x^2' }, { show: 'y=(x-2)^2+3', latex: 'y=(x-2)^2+3' }] } }),
    C({ id: 'k_exp_growth', topic: 'advanced', badge: 'memo', title: 'Exponential growth & decay: a(1 + r)ᵗ',
      keywords: 'exponential growth decay percent per year half life doubling initial value growth factor monthly quarterly',
      see: [R`"A population of $500$ increases by $4\%$ each year…"`, R`"$y = 2000(0.85)^t$. What does $0.85$ mean?"`],
      pic: picExpGrowth,
      formula: [R`$$y = a(1 \pm r)^{t} \qquad a = \text{start},\ \ 1+r = \text{growth},\ \ 1-r = \text{decay}$$`, R`$$\text{doubles every 3 years: } a\cdot 2^{t/3} \qquad 3\%\ \text{per quarter: } (1.03)^{4t}$$`],
      steps: [R`$a$ = value at $t = 0$ (the $y$-intercept).`, R`Base $> 1$: grows by (base $- 1$)$\times100\%$. Base $< 1$: shrinks by ($1 -$ base)$\times100\%$.`, R`Match time units: rate per month, $t$ in years → exponent $12t$.`],
      example: { q: R`$y = 2000(0.85)^t$`, a: [R`starts at $2000$`, R`decreases $15\%$ each year (not $85\%$)`] },
      trap: R`$3\%$ per quarter is not $12\%$ per year: $(1.03)^4 - 1 = 12.55\%$. In $a\cdot b^{x-h}$ the $y$-intercept is not $a$ — plug $x = 0$.`,
      desmos: { lines: [{ show: 'y=100*1.5^x', latex: 'y=100\\cdot1.5^x' }, { show: 'y=100*0.6^x', latex: 'y=100\\cdot0.6^x' }] } }),
    C({ id: 'k_lin_vs_exp', topic: 'advanced', badge: 'memo', title: 'Linear vs exponential: add the same vs multiply the same',
      keywords: 'linear vs exponential constant difference constant ratio simple interest compound interest table model',
      see: [R`"Which table shows a relationship that is exponential?"`, R`"…increases by $3\%$ each year. Which model?"`],
      pic: picLinVsExp,
      formula: [R`$$\text{linear } y = mx + b:\ \text{same difference} \qquad \text{exponential } y = a\cdot b^x:\ \text{same ratio}$$`, R`$$\text{simple interest } P(1 + rt) \qquad \text{compound } P(1+r)^t$$`],
      steps: [R`Subtract neighbors: always the same → linear.`, R`Divide neighbors: always the same → exponential.`, R`Words: "increases by $3$ each…" → linear; "increases by $3\%$ each…" → exponential.`],
      example: { q: R`$\$1000$ at $5\%$ for $3$ years`, a: [R`simple: $1000(1 + 0.05\cdot3) = 1150$`, R`compound: $1000(1.05)^3 \approx 1157.63$`] },
      trap: 'A percent change per period is exponential, even when the percent is small. Exponential growth always overtakes linear eventually.' }),
    C({ id: 'k_poly_factor', topic: 'advanced', badge: 'memo', title: 'Polynomials: zeros ↔ factors, bounces & remainders',
      keywords: 'polynomial zero factor x-intercept remainder theorem multiplicity bounce cross graph',
      see: [R`"$p(3) = 0$. Which must be a factor of $p(x)$?"`, R`"The graph crosses the $x$-axis at $-2$ and touches at $1$…"`],
      pic: picPoly,
      formula: R`$$p(a) = 0 \iff (x - a) \text{ is a factor} \qquad \text{remainder of } \frac{p(x)}{x-a} = p(a)$$`,
      steps: [R`Zero at $x = a$ ↔ factor $(x - a)$ ↔ $x$-intercept $(a, 0)$.`, R`Squared factor → the graph touches and bounces; single factor → crosses.`, R`Remainder of $p(x) \div (x - a)$ is just $p(a)$. Sum of coefficients $= p(1)$, constant $= p(0)$.`],
      example: { q: R`$p(x) = x^3 - 4x^2 + x + 6$. Is $(x-2)$ a factor?`, a: [R`$p(2) = 8 - 16 + 2 + 6 = 0$`, R`yes`] },
      trap: R`Zero at $x = -3$ → factor $(x + 3)$, not $(x - 3)$.`,
      desmos: { lines: [{ show: 'y=0.25(x+2)(x-1)^2(x-4)', latex: 'y=0.25(x+2)(x-1)^2(x-4)' }] } }),
    C({ id: 'k_rational', topic: 'advanced', badge: 'memo', title: 'Rational expressions: undefined values & extra solutions',
      keywords: 'rational expression undefined denominator zero asymptote hole extraneous fraction equation cross multiply',
      see: [R`"For what value of $x$ is $\frac{1}{x^2 - 6x + 9}$ undefined?"`, R`"$\frac{x}{x-3} = \frac{3}{x-3} + 2$. Solutions?"`],
      pic: picRational,
      formula: R`$$\text{undefined} \iff \text{denominator} = 0 \qquad \frac ab = \frac cd \Rightarrow ad = bc$$`,
      steps: [R`Denominator $= 0$ → that $x$ is not allowed.`, R`Clear fractions: multiply both sides by the common denominator.`, R`Throw out any answer that makes a denominator $0$.`],
      example: { q: R`$\frac{x}{x-3} = \frac{3}{x-3} + 2$`, a: [R`$x = 3 + 2(x - 3) \Rightarrow x = 3$`, R`$x = 3$ makes a denominator $0$ → no solution`] },
      trap: 'A factor that cancels from top and bottom leaves a hole — the value is still not allowed.',
      desmos: { lines: [{ show: 'y=1/(x-2)+1', latex: 'y=\\frac{1}{x-2}+1' }] } }),
    C({ id: 'k_nonlinear_systems', topic: 'advanced', badge: 'memo', title: 'Line meets parabola: how many intersection points',
      keywords: 'nonlinear system parabola line intersection points tangent discriminant horizontal line',
      see: [R`"$y = x^2 - 4x + 7$ and $y = 2x - 2$ intersect at how many points?"`, R`"For which $c$ does $y = c$ meet the parabola exactly once?"`],
      pic: picNonlin,
      formula: R`$$\text{set equal} \to ax^2 + bx + c = 0 \to D = b^2 - 4ac \text{ gives } 2,\ 1,\ 0 \text{ points}$$`,
      steps: [R`Set the two $y$'s equal.`, R`Move everything to one side and use $D$ (or factor).`, R`Horizontal line $y = c$: compare $c$ with the vertex $y$-value.`],
      example: { q: R`$x^2 - 4x + 7 = 2x - 2$`, a: [R`$x^2 - 6x + 9 = 0$, $D = 36 - 36 = 0$`, R`one point: $(3, 4)$`] },
      trap: 'Get y by plugging x into the LINE — it is easier.',
      desmos: { lines: [{ show: 'y=x^2-4x+7', latex: 'y=x^2-4x+7' }, { show: 'y=2x-2', latex: 'y=2x-2' }] } }),
    C({ id: 'k_match_coeff', topic: 'advanced', badge: 'memo', title: 'Equivalent expressions: match the coefficients',
      keywords: 'equivalent expressions for all x match coefficients expand foil constants a b c',
      see: [R`"$(ax + 3)(2x - 5) = 6x^2 + bx - 15$ for all $x$. What is $a + b$?"`, R`"Which expression is equivalent to…"`],
      pic: picMatch,
      formula: R`$$\text{equal for all } x \Rightarrow \text{same number in front of } x^2,\ x, \text{ and the constant}$$`,
      steps: [R`Expand one side.`, R`Match $x^2$ terms, $x$ terms, plain numbers — one small equation each.`, R`Solve them. Or let Desmos do it with the ~ trick.`],
      example: { q: R`$(ax + 3)(2x - 5) = 6x^2 + bx - 15$`, a: [R`$2a = 6 \Rightarrow a = 3$`, R`$-5a + 6 = b \Rightarrow b = -9$, so $a + b = -6$`] },
      trap: 'Check the constant term first — it is usually the fastest equation and catches mistakes.',
      desmos: { lines: [{ show: 'x₁=[1,2,3]', latex: 'x_{1}=\\left[1,2,3\\right]' }, { show: '(ax₁+3)(2x₁−5) ~ 6x₁²+bx₁−15', latex: '\\left(ax_{1}+3\\right)\\left(2x_{1}-5\\right)\\sim6x_{1}^{2}+bx_{1}-15' }], tip: 'Desmos fits a and b: a = 3, b = −9.' } }),

    // ===== ADVANCED: bonus shortcuts =====
    C({ id: 'k_inverse', topic: 'advanced', badge: 'bonus', title: 'Inverse functions without finding the formula',
      keywords: 'inverse function f^-1 swap x and y reflection y=x',
      see: [R`"$f(x) = 3x - 5$. What is $f^{-1}(7)$?"`],
      pic: K.svg(360, 90, K.t(10, 28, 'f⁻¹(7) = ?   means   f(x) = 7', { s: 15, b: true }) + K.t(10, 56, '3x − 5 = 7  →  x = 4', { s: 14, c: blue, b: true }) + K.t(10, 80, 'so f⁻¹(7) = 4 — no inverse formula needed', { s: 12, c: gray })),
      formula: R`$$f^{-1}(k) = x \iff f(x) = k$$`,
      steps: [R`To find $f^{-1}(k)$: solve $f(x) = k$.`, R`Need the formula? Swap $x$ and $y$, solve for $y$.`, R`The graph of $f^{-1}$ is $f$ reflected over $y = x$.`],
      example: { q: R`$f(x) = 3x - 5$, $f^{-1}(x) = ?$`, a: [R`$x = 3y - 5 \Rightarrow y = \frac{x+5}{3}$`] } }),
    C({ id: 'k_quad_ineq', topic: 'advanced', badge: 'bonus', title: 'Quadratic inequalities: outside or between the roots',
      keywords: 'quadratic inequality greater than zero less than zero between roots outside',
      see: [R`"For which $x$ is $(x - 1)(x - 5) < 0$?"`],
      pic: (() => { const p = K.plot({ x0: -1, x1: 7, y0: -5, y1: 6, xt: 1, yt: 1, h: 180 }); p.fn(x => (x - 1) * (x - 5)); p.seg(1, 0, 5, 0, { c: red, w: 5 }); p.seg(-1, 0, 1, 0, { c: blue, w: 5 }).seg(5, 0, 7, 0, { c: blue, w: 5 }); p.txt(3, -2.4, '< 0: between', { a: 'middle', c: red, b: true }); p.txt(5.2, 4.8, '> 0: outside', { c: blue, b: true }); return p.svg(); })(),
      formula: R`$$(x-r_1)(x-r_2) > 0 \Rightarrow \text{outside}\qquad (x-r_1)(x-r_2) < 0 \Rightarrow \text{between}$$`,
      steps: [R`Find the two roots (with positive $x^2$ coefficient).`, R`$> 0$ → outside the roots; $< 0$ → between them.`, R`Or graph it and look where the curve is above/below the $x$-axis.`],
      example: { q: R`$x^2 - 6x + 5 < 0$`, a: [R`roots $1, 5$ → $1 < x < 5$`] } }),
    C({ id: 'k_sequences', topic: 'advanced', badge: 'bonus', title: 'Arithmetic & geometric sequences',
      keywords: 'sequence arithmetic geometric nth term common difference ratio sum series',
      see: [R`"The first term is $3$ and each term is $4$ more than the previous… $20$th term?"`],
      pic: K.svg(360, 100, K.t(10, 26, 'Arithmetic: 3, 7, 11, 15 … (+4)', { s: 13, b: true, c: blue }) + K.t(10, 48, 'aₙ = 3 + (n − 1)·4', { s: 13, c: blue }) + K.t(10, 78, 'Geometric: 3, 6, 12, 24 … (×2)', { s: 13, b: true, c: red }) + K.t(10, 98, 'aₙ = 3 · 2ⁿ⁻¹', { s: 13, c: red })),
      formula: [R`$$a_n = a_1 + (n-1)d \qquad a_n = a_1 r^{\,n-1}$$`, R`$$S_n = \frac n2(a_1 + a_n)$$`],
      steps: [R`Same difference → arithmetic; same ratio → geometric.`, R`$n$th term: use $(n - 1)$ steps from the first term.`, R`Check whether the first term is $n = 1$ or $n = 0$.`],
      example: { q: R`$a_1 = 3,\ d = 4$. $a_{20} = ?$`, a: [R`$3 + 19\cdot4 = 79$`] } }),
    C({ id: 'k_amgm', topic: 'advanced', badge: 'bonus', title: 'Minimum of ax + b/x (x positive)',
      keywords: 'minimum value amgm ax+b/x optimization',
      see: [R`"For $x > 0$, what is the minimum value of $x + \frac9x$?"`],
      formula: R`$$\min\left(ax + \frac bx\right) = 2\sqrt{ab}\quad (x > 0)$$`,
      steps: [R`The minimum happens when the two pieces are equal: $ax = \frac bx$.`, R`Minimum value $= 2\sqrt{ab}$.`],
      example: { q: R`$x + \frac9x$`, a: [R`$2\sqrt{1\cdot9} = 6$ (at $x = 3$)`] },
      trap: 'Only for positive x. Desmos: graph it and click the low point.' }),
    C({ id: 'k_numbers', topic: 'advanced', badge: 'bonus', title: 'Remainders, odd/even & last digits',
      keywords: 'remainder divisible odd even parity last digit integer',
      see: [R`"When $n$ is divided by $7$, the remainder is $3$…"`],
      formula: R`$$n = dq + r \qquad \text{last digit of } a^k:\ \text{cycle of 4, use } k \bmod 4$$`,
      steps: [R`"$n$ divided by $d$ leaves $r$" → $n = dq + r$.`, R`Odd × odd = odd; any factor of an odd number is odd.`, R`Divisible by 3 (or 9) ⇔ digit sum divisible by 3 (or 9).`],
      example: { q: R`Last digit of $3^{23}$`, a: [R`cycle 3, 9, 7, 1; $23 \bmod 4 = 3$ → $7$`] } }),
    C({ id: 'k_partial', topic: 'advanced', badge: 'bonus', title: 'Partial fractions: the cover-up trick',
      keywords: 'partial fractions cover up decompose rational',
      see: [R`"$\frac{5x+11}{(x-1)(x+3)} = \frac{A}{x-1} + \frac{B}{x+3}$. Find $A$."`],
      formula: R`$$A = \left.\frac{5x+11}{x+3}\right|_{x=1} = \frac{16}{4} = 4$$`,
      steps: [R`To find $A$ (over $x - 1$): cover $(x - 1)$ on the left, plug $x = 1$ into the rest.`, R`Same for $B$: cover $(x + 3)$, plug $x = -3$: $\frac{-4}{-4} = 1$.`],
      example: { q: R`$\frac{5x+11}{(x-1)(x+3)}$`, a: [R`$A = 4,\ B = 1$`] } })
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
