// Cards: Ratios, rates, units, percent (topic 'ratios') + data & probability (topic 'data'). Needs cards.js (KP) first.
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';

  // ---------- pictures ----------
  const picRatio = (() => {
    let s = K.t(10, 18, 'Boys : Girls = 3 : 5,  total 40', { b: true, s: 13 });
    for (let i = 0; i < 8; i++) {
      const boy = i < 3, x = 10 + i * 42;
      s += K.rect(x, 30, 40, 32, { f: boy ? '#dbeafe' : '#fee2e2', c: boy ? blue : red }) + K.t(x + 20, 51, '5', { a: 'middle', b: true, c: boy ? blue : red });
    }
    s += K.t(10, 84, '8 parts = 40  →  1 part = 5', { s: 12.5, b: true });
    s += K.t(10, 108, 'boys = 3 × 5 = 15', { s: 12.5, b: true, c: blue }) + K.t(190, 108, 'girls = 5 × 5 = 25', { s: 12.5, b: true, c: red });
    s += K.t(10, 134, 'part : part = 3 : 5     part : whole = 3 : 8', { s: 11.5, c: gray });
    return K.svg(360, 144, s);
  })();

  const picRates = K.svg(360, 160,
    K.poly([[60, 14], [10, 104], [110, 104]], { f: '#f3f4f6' }) + K.l(30, 66, 90, 66) + K.l(60, 66, 60, 104) +
    K.t(60, 56, 'd', { a: 'middle', b: true, s: 18 }) + K.t(37, 94, 'r', { a: 'middle', b: true, s: 16 }) + K.t(83, 94, 't', { a: 'middle', b: true, s: 16 }) +
    K.t(10, 128, 'cover the one you want:', { s: 10.5, c: gray }) + K.t(10, 145, 'd = r·t   r = d/t   t = d/r', { s: 11.5, b: true }) +
    K.t(140, 30, 'Work together: add RATES', { s: 12, b: true, c: blue }) + K.t(140, 52, 'A: 6 h → 1/6 tank per hour', { s: 11.5 }) + K.t(140, 72, 'B: 3 h → 1/3 tank per hour', { s: 11.5 }) +
    K.t(140, 94, '1/6 + 1/3 = 1/2 per hour → 2 h', { s: 12, b: true, c: blue }) +
    K.t(140, 124, 'Average speed =', { s: 12, b: true, c: orange }) + K.t(140, 144, 'total distance ÷ total time', { s: 12, b: true, c: orange }));

  const picUnits = K.svg(360, 120,
    K.t(10, 30, '72 km/h', { s: 15, b: true }) + K.t(84, 30, '×', { s: 15 }) +
    K.t(120, 20, '1000 m', { s: 13, a: 'middle', c: blue, b: true }) + K.l(94, 26, 146, 26) + K.t(120, 42, '1 km', { s: 13, a: 'middle', c: blue, b: true }) +
    K.t(156, 30, '×', { s: 15 }) +
    K.t(196, 20, '1 h', { s: 13, a: 'middle', c: orange, b: true }) + K.l(168, 26, 224, 26) + K.t(196, 42, '3600 s', { s: 13, a: 'middle', c: orange, b: true }) +
    K.t(236, 30, '= 20 m/s', { s: 15, b: true, c: green }) +
    K.t(10, 76, 'km on top cancels km on bottom; h on bottom cancels h on top.', { s: 11.5, c: '#374151' }) +
    K.t(10, 102, 'Area: 1 ft² = 12² = 144 in²    Volume: 1 ft³ = 12³ = 1728 in³', { s: 11.5, b: true }));

  const picVariation = (() => {
    const a = K.plot({ x0: 0, x1: 6, y0: 0, y1: 12, xt: 1, yt: 2, w: 175, h: 160, l: 24 });
    a.fn(x => 2 * x, { c: blue }).txt(0.4, 11, 'y = 2x', { c: blue, b: true }).txt(0.4, 9.6, 'y/x same', { c: blue, s: 10.5 });
    const b = K.plot({ x0: 0, x1: 6, y0: 0, y1: 12, xt: 1, yt: 2, w: 175, h: 160, l: 24 });
    b.fn(x => 12 / x, { c: red }).txt(2.4, 11, 'y = 12/x', { c: red, b: true }).txt(2.4, 9.6, 'x·y same', { c: red, s: 10.5 });
    return K.svg(360, 176, `<g>${a.s}</g><g transform="translate(185,0)">${b.s}</g>` + K.t(88, 172, 'direct', { a: 'middle', b: true, c: blue }) + K.t(272, 172, 'inverse', { a: 'middle', b: true, c: red }));
  })();

  const picMean = (() => {
    const vals = [8, 12, 10, 14, 16], X = i => 80 + i * 58, Y = v => 150 - v * 8;
    let s = K.l(20, Y(12), 345, Y(12), { c: green, w: 2, d: '6 4' }) + K.t(10, Y(12) - 5, 'mean 12', { c: green, b: true, s: 11 });
    vals.forEach((v, i) => {
      s += K.rect(X(i) - 16, Y(v), 32, 150 - Y(v), { f: '#e5e7eb', c: '#9ca3af' }) + K.t(X(i), 165, v, { a: 'middle', b: true });
      const off = v - 12; if (off) s += K.l(X(i) + 22, Y(12), X(i) + 22, Y(v), { c: off > 0 ? blue : red, w: 3 }) + K.t(X(i) + 27, (Y(12) + Y(v)) / 2 + 4, (off > 0 ? '+' : '') + off, { s: 11, b: true, c: off > 0 ? blue : red });
    });
    s += K.t(20, 16, 'total = 12 × 5 = 60', { b: true, s: 12.5 }) + K.t(200, 16, 'offsets: −4 + 0 − 2 + 2 + 4 = 0', { s: 10.5, c: gray });
    return K.svg(360, 172, s);
  })();

  const picMedian = (() => {
    let s = K.t(10, 18, 'sorted: 3  4  4  7  9  10   (n = 6, even)', { s: 12.5, b: true });
    [3, 4, 4, 7, 9, 10].forEach((v, i) => { const mid = i === 2 || i === 3; s += K.rect(10 + i * 40, 28, 36, 28, { f: mid ? '#dbeafe' : '#f9fafb', c: mid ? blue : '#d1d5db' }) + K.t(28 + i * 40, 47, v, { a: 'middle', b: true, c: mid ? blue : '#111' }); });
    s += K.t(260, 47, '(4 + 7)/2 = 5.5', { s: 12, b: true, c: blue });
    s += K.t(10, 82, 'Frequency table → count up:', { s: 12, b: true });
    const rows = [['value', 'count', 'running'], ['2', '3', '1–3'], ['5', '4', '4–7'], ['9', '2', '8–9']];
    rows.forEach((r, i) => r.forEach((c, j) => { const hit = i === 2; s += K.rect(10 + j * 66, 90 + i * 20, 66, 20, { f: i === 0 ? '#f3f4f6' : hit ? '#dcfce7' : '#fff', c: '#d1d5db' }) + K.t(43 + j * 66, 104 + i * 20, c, { a: 'middle', s: 11, b: i === 0 || hit, c: hit ? green : '#111' }); }));
    s += K.t(220, 120, 'n = 9 → 5th value', { s: 11.5, b: true }) + K.t(220, 140, 'in rows 4–7 → median 5', { s: 11.5, b: true, c: green });
    return K.svg(360, 176, s);
  })();

  const picCombined = (() => {
    const X = v => 30 + (v - 76) * 20;
    let s = K.l(X(77), 90, X(92), 90, { w: 3 }) + K.poly([[X(84), 92], [X(84) - 12, 116], [X(84) + 12, 116]], { f: green, c: green });
    for (let v = 78; v <= 92; v += 2) s += K.t(X(v), 136, v, { a: 'middle', s: 10, c: gray });
    s += K.rect(X(80) - 38, 46, 76, 42, { f: '#dbeafe', c: blue }) + K.t(X(80), 64, '15 students', { a: 'middle', s: 10.5, c: blue, b: true }) + K.t(X(80), 80, 'mean 80', { a: 'middle', s: 10.5, c: blue });
    s += K.rect(X(90) - 25, 60, 50, 28, { f: '#fee2e2', c: red }) + K.t(X(90), 72, '10 st.', { a: 'middle', s: 10, c: red, b: true }) + K.t(X(90), 84, 'mean 90', { a: 'middle', s: 10, c: red });
    s += K.t(X(84), 154, 'balance at 84', { a: 'middle', b: true, c: green });
    s += K.t(10, 20, '(15·80 + 10·90) / 25 = 2100 / 25 = 84', { b: true, s: 12.5 }) + K.t(10, 36, 'closer to the bigger group, not 85', { s: 11, c: gray });
    return K.svg(360, 162, s);
  })();

  const dotRow = (y, xs, col, label) => K.l(20, y, 340, y, { c: '#9ca3af', w: 1 }) + xs.map(([x, k]) => Array.from({ length: k }, (_, j) => K.dot(20 + x * 20, y - 8 - j * 11, col, 4.5)).join('')).join('') + K.t(20, y - 34, label, { b: true, c: col, s: 11.5 });
  const picSD = K.svg(360, 150,
    dotRow(58, [[7, 1], [8, 3], [9, 4], [10, 3], [11, 1]], blue, 'small SD') +
    dotRow(128, [[3, 2], [5, 1], [9, 2], [13, 1], [15, 2]], red, 'large SD') +
    K.t(20, 76, 'values packed near the mean', { s: 10.5, c: blue }) + K.t(20, 146, 'values far from the mean (same mean 9)', { s: 10.5, c: red }));

  const picShift = (() => {
    const head = ['', 'mean / median', 'range / SD'];
    const rows = [['+ c to every value', '+ c', 'same'], ['× k to every value', '× k', '× k']];
    let s = '';
    head.forEach((h, j) => { s += K.rect(10 + [0, 150, 255][j], 10, [140, 105, 95][j], 28, { f: '#f3f4f6', c: '#d1d5db' }) + K.t(10 + [70, 202, 302][j], 29, h, { a: 'middle', b: true, s: 11.5 }); });
    rows.forEach((r, i) => r.forEach((c, j) => { const col = j === 0 ? '#111' : c === 'same' ? green : blue; s += K.rect(10 + [0, 150, 255][j], 38 + i * 32, [140, 105, 95][j], 32, { c: '#d1d5db' }) + K.t(10 + [70, 202, 302][j], 59 + i * 32, c, { a: 'middle', b: j > 0, s: 12, c: col }); }));
    s += K.t(10, 124, 'Scores: mean 70, SD 8.  +5 → mean 75, SD 8.', { s: 11.5 }) + K.t(10, 144, '×1.1 → mean 77, SD 8.8.', { s: 11.5 });
    return K.svg(360, 152, s);
  })();

  const picBox = (() => {
    const X = v => 30 + (v - 1) * 42;
    let s = K.l(X(2), 60, X(4), 60, { w: 2 }) + K.l(X(7), 60, X(8), 60, { w: 2 }) + K.l(X(2), 50, X(2), 70, { w: 2 }) + K.l(X(8), 50, X(8), 70, { w: 2 });
    s += K.rect(X(4), 42, X(7) - X(4), 36, { f: '#dbeafe', c: blue, w: 2 }) + K.l(X(5), 42, X(5), 78, { c: red, w: 3 });
    for (let v = 1; v <= 8; v++) s += K.l(X(v), 96, X(v), 102, { w: 1 }) + K.t(X(v), 116, v, { a: 'middle', s: 10.5, c: gray });
    s += K.l(X(1) - 10, 99, X(8) + 10, 99, { w: 1.2, c: '#9ca3af' });
    [['min 2', 2, '#111'], ['Q1 4', 4, blue], ['median 5', 5, red], ['Q3 7', 7, blue], ['max 8', 8, '#111']].forEach(([t, v, c], i) => { s += K.t(X(v), i % 2 ? 22 : 34, t, { a: 'middle', s: 11, b: true, c }); });
    s += K.t(10, 142, 'IQR = Q3 − Q1 = 3   (middle 50%)', { s: 12, b: true, c: blue }) + K.t(10, 162, 'range = max − min = 6   each section = 25% of data', { s: 11.5, b: true });
    return K.svg(360, 170, s);
  })();

  const picTwoWay = (() => {
    const cols = [16, 106, 186, 266], w = [90, 80, 80, 80];
    const rows = [['', 'Teen', 'Adult', 'Total'], ['Tea', '30', '20', '50'], ['Coffee', '10', '40', '50'], ['Total', '40', '60', '100']];
    let s = '';
    rows.forEach((r, i) => r.forEach((c, j) => {
      const given = i === 1, hit = i === 1 && j === 1;
      s += K.rect(cols[j], 8 + i * 28, w[j], 28, { f: hit ? '#bbf7d0' : given && j === 3 ? '#fde68a' : given ? '#fef9c3' : (i === 0 || j === 0) ? '#f3f4f6' : '#fff', c: '#d1d5db' });
      s += K.t(cols[j] + w[j] / 2, 27 + i * 28, c, { a: 'middle', b: i === 0 || j === 0 || hit || (given && j === 3), s: 12 });
    }));
    s += K.t(16, 146, 'P(teen | tea) = 30 / 50 = 0.6', { s: 12.5, b: true, c: green }) + K.t(16, 166, 'given "tea" → only the tea row (50) counts', { s: 11, c: gray });
    return K.svg(360, 174, s);
  })();

  const picScatter = (() => {
    const p = K.plot({ x0: 0, x1: 20, y0: 0, y1: 60, xt: 2, yt: 10 });
    [[2, 25], [3, 22], [5, 30], [6, 27], [8, 33], [9, 31], [12, 36], [13, 41], [15, 42], [17, 47], [18, 44]].forEach(([x, y]) => p.pt(x, y, { c: '#6b7280', r: 3.5 }));
    p.fn(x => 1.5 * x + 20, { c: blue });
    p.pt(10, 40, { c: red, r: 5 }).pt(10, 35, { c: blue, r: 4.5, open: true }).seg(10, 35, 10, 40, { c: red, w: 2.4, d: '3 3' });
    p.txt(10.6, 42.5, 'actual 40', { c: red, b: true, s: 11 }).txt(10.6, 32.5, 'predicted 35', { c: blue, b: true, s: 11 });
    p.txt(0.6, 56, 'y = 1.5x + 20', { c: blue, b: true, s: 12.5 }).txt(0.6, 51, 'actual − predicted = +5 (above line)', { s: 10.5, c: red });
    return p.svg();
  })();

  const picSampling = (() => {
    const X = v => 30 + (v - 45) * 24;
    let s = K.l(X(45), 80, X(58), 80, { w: 1.4, c: '#9ca3af' });
    for (let v = 45; v <= 58; v++) s += K.l(X(v), 76, X(v), 84, { w: 1 }) + (v % 2 === 1 ? K.t(X(v), 100, v + '%', { a: 'middle', s: 9.5, c: gray }) : '');
    s += K.l(X(49), 66, X(55), 66, { c: blue, w: 8 }) + K.dot(X(52), 66, '#111', 6);
    s += K.t(X(52), 54, 'estimate 52%', { a: 'middle', b: true }) + K.t(X(49), 40, '52 − 3', { a: 'middle', s: 11, c: blue }) + K.t(X(55), 40, '52 + 3', { a: 'middle', s: 11, c: blue });
    s += K.l(X(50), 110, X(50), 120, { c: red, w: 2 }) + K.t(X(50), 134, '50% is inside → "more than half" is NOT certain', { a: 'middle', s: 11, b: true, c: red });
    s += K.t(10, 18, 'plausible values: 49% to 55%', { s: 12.5, b: true, c: blue });
    return K.svg(360, 144, s);
  })();

  const picExperiment = (() => {
    let s = K.t(250, 16, 'random ASSIGNMENT?', { a: 'middle', b: true, s: 11.5, c: blue }) + K.t(190, 34, 'yes', { a: 'middle', b: true, c: blue }) + K.t(305, 34, 'no', { a: 'middle', b: true, c: blue });
    s += `<text transform="translate(16,110) rotate(-90)" text-anchor="middle" font-size="11.5" font-weight="700" fill="${orange}">random SAMPLE?</text>`;
    s += K.t(48, 84, 'yes', { a: 'middle', b: true, c: orange }) + K.t(48, 148, 'no', { a: 'middle', b: true, c: orange });
    const cell = (x, y, a, b, f) => K.rect(x, y, 114, 60, { f, c: '#d1d5db', r: 6 }) + K.t(x + 57, y + 26, a, { a: 'middle', b: true, s: 11 }) + K.t(x + 57, y + 44, b, { a: 'middle', s: 10.5 });
    s += cell(133, 44, 'cause ✓', 'for the population', '#dcfce7') + cell(248, 44, 'association only', 'for the population', '#fef9c3');
    s += cell(133, 108, 'cause ✓', 'only for the subjects', '#fef9c3') + cell(248, 108, 'association only', 'only for the subjects', '#fee2e2');
    return K.svg(370, 172, s);
  })();

  // ---------- cards ----------
  const C = (o) => Object.assign({ v: 2 }, o);
  const cards = [
    // ===== RATIOS / RATES / UNITS =====
    C({ id: 'k_ratio', topic: 'ratios', badge: 'memo', title: 'Ratios & proportions: parts of a total',
      keywords: 'ratio proportion part to part part to whole cross multiply scale map',
      see: [R`"The ratio of boys to girls is $3:5$. There are $40$ students…"`, R`"On a map, $2$ cm represents $15$ km…"`],
      pic: picRatio,
      formula: R`$$\text{1 part} = \frac{\text{total}}{\text{sum of ratio numbers}} \qquad \frac ab = \frac cd \Rightarrow ad = bc$$`,
      steps: [R`Part : part ($3:5$) or part : whole ($3:8$)? Read carefully.`, R`One part $=$ total $\div$ (sum of the ratio numbers). Multiply back.`, R`Proportion: same units on top, same on bottom, then cross-multiply.`],
      example: { q: R`Map: $2$ cm $= 15$ km. What is $7$ cm?`, a: [R`$\frac{2}{15} = \frac{7}{x} \Rightarrow x = \frac{7\cdot15}{2} = 52.5$ km`] },
      trap: R`A ratio of $3:5$ doesn't mean 3 boys — it can be 15 and 25.` }),
    C({ id: 'k_rates', topic: 'ratios', badge: 'memo', title: 'Rates: distance = rate × time, work, average speed',
      keywords: 'rate distance speed time work together pump average speed per hour',
      see: [R`"A car travels $150$ miles in $2.5$ hours…"`, R`"Pump A fills a tank in $6$ hours, pump B in $3$ hours. Together?"`],
      pic: picRates,
      formula: R`$$d = r\cdot t \qquad \frac1{t_A} + \frac1{t_B} = \frac1{t_\text{together}} \qquad \text{avg speed} = \frac{\text{total distance}}{\text{total time}}$$`,
      steps: [R`Keep units in the rate: miles per hour, pages per minute.`, R`Working together: add the rates (jobs per hour), never the times.`, R`Average speed $=$ total distance $\div$ total time — not the average of the speeds.`],
      example: { q: R`$60$ mph there, $40$ mph back (same road). Average speed?`, a: [R`time per mile: $\frac1{60} + \frac1{40} = \frac1{24}$ h for 2 miles`, R`$\frac{2}{1/24} = 48$ mph, not $50$`] },
      trap: 'Check the units of the answer (minutes vs hours) before choosing.' }),
    C({ id: 'k_units', topic: 'ratios', badge: 'memo', title: 'Unit conversions: chain fractions that cancel',
      keywords: 'unit conversion dimensional analysis square feet cubic inches density per second',
      see: [R`"$72$ kilometers per hour is how many meters per second?"`, R`"A rug has area $3$ square feet. How many square inches?"`],
      pic: picUnits,
      formula: R`$$\text{multiply by } \frac{\text{new unit}}{\text{old unit}} = 1 \qquad \text{density} = \frac{\text{mass}}{\text{volume}}$$`,
      steps: [R`Write the starting number with its units.`, R`Multiply by conversion fractions so the unwanted unit sits once on top and once on bottom — it cancels.`, R`Area units: square the factor. Volume units: cube it.`],
      example: { q: R`$3\text{ ft}^2 = ?\text{ in}^2$`, a: [R`$3 \times 12^2 = 432\text{ in}^2$`] },
      trap: R`$1\text{ ft}^2 = 144\text{ in}^2$, not $12$. $1\text{ yd}^3 = 27\text{ ft}^3$.` }),
    C({ id: 'k_variation', topic: 'ratios', badge: 'memo', title: 'Direct & inverse variation',
      keywords: 'direct variation inverse variation proportional inversely proportional constant k',
      see: [R`"$y$ varies directly with $x$…"`, R`"The pressure is inversely proportional to the volume…"`],
      pic: picVariation,
      formula: R`$$\text{direct: } y = kx\ \left(\tfrac yx \text{ constant}\right) \qquad \text{inverse: } y = \frac kx\ (xy \text{ constant})$$`,
      steps: [R`Direct: $k = \frac yx$ from the known pair.`, R`Inverse: $k = x\cdot y$ from the known pair.`, R`Use the same $k$ for the new value.`],
      example: { q: R`$y$ inversely with $x$; $x = 4,\ y = 6$. $y$ when $x = 8$?`, a: [R`$k = 24$`, R`$y = \frac{24}{8} = 3$`] },
      trap: 'A direct-variation line always passes through (0, 0).' }),

    // ===== DATA =====
    C({ id: 'k_mean', topic: 'data', badge: 'memo', title: 'Mean ↔ total: the sum trick',
      keywords: 'mean average total sum missing value new value test score',
      see: [R`"The mean of $5$ numbers is $12$. A sixth number makes the mean $14$…"`, R`"What score is needed on the next test…"`],
      pic: picMean,
      formula: R`$$\text{total} = \text{mean} \times \text{count} \qquad \text{missing value} = \text{new total} - \text{old total}$$`,
      steps: [R`Turn every mean into a total: mean $\times$ count.`, R`Subtract totals to find the missing value(s).`, R`Shortcut: distances above the mean cancel distances below.`],
      example: { q: R`Mean of $5$ numbers is $12$; adding $x$ makes the mean $14$.`, a: [R`$6\cdot14 - 5\cdot12 = 84 - 60$`, R`$x = 24$`] },
      trap: 'Don\'t average two averages when the groups have different sizes — use totals.',
      desmos: { lines: [{ show: 'mean([8,12,10,14,16])', latex: '\\operatorname{mean}\\left(\\left[8,12,10,14,16\\right]\\right)' }] } }),
    C({ id: 'k_median', topic: 'data', badge: 'memo', title: 'Median, mode & range — from a list or a frequency table',
      keywords: 'median mode range middle value frequency table histogram greatest possible median',
      see: [R`"What is the median of the data in the frequency table?"`, R`"What is the greatest possible median?"`],
      pic: picMedian,
      formula: R`$$\text{median: middle of the SORTED data, position } \frac{n+1}{2} \qquad \text{range} = \max - \min$$`,
      steps: [R`Sort first. For a table or histogram, count up with running totals.`, R`$n$ odd → the middle value; $n$ even → average the two middle values.`, R`"Greatest/least possible": push the unknown values as far as the rules allow.`],
      example: { q: R`Values $2,\ 5,\ 9$ with counts $3,\ 4,\ 2$`, a: [R`$n = 9$ → 5th value`, R`running totals $3,\ 7$ → median $= 5$`] },
      trap: 'The median of a frequency table is not the middle row — count the values.',
      desmos: { lines: [{ show: 'median([3,4,4,7,9,10])', latex: '\\operatorname{median}\\left(\\left[3,4,4,7,9,10\\right]\\right)' }] } }),
    C({ id: 'k_combined_mean', topic: 'data', badge: 'memo', title: 'Combining two groups: weighted mean',
      keywords: 'combined mean weighted average two groups different sizes',
      see: [R`"$15$ students averaged $80$ and $10$ students averaged $90$. Mean of all $25$?"`],
      pic: picCombined,
      formula: R`$$\text{mean} = \frac{n_1m_1 + n_2m_2}{n_1 + n_2}$$`,
      steps: [R`Make totals: $n_1m_1$ and $n_2m_2$.`, R`Add the totals, divide by the total count.`, R`Check: the answer lies between the two means, closer to the bigger group.`],
      example: { q: R`$75$ objects mean $20$, $25$ objects mean $40$`, a: [R`$\frac{1500 + 1000}{100} = 25$`] },
      trap: R`$\frac{80 + 90}{2} = 85$ only works when the groups are the same size.` }),
    C({ id: 'k_sd', topic: 'data', badge: 'memo', title: 'Standard deviation: how spread out the data is',
      keywords: 'standard deviation spread variability outlier compare data sets',
      see: [R`"Which data set has the greater standard deviation?"`, R`"An outlier is removed. What happens to the standard deviation?"`],
      pic: picSD,
      formula: R`$$\text{SD} \approx \text{typical distance from the mean}$$`,
      steps: [R`More values far from the center → bigger SD. (You never calculate it by hand on the SAT.)`, R`Same shape slid left/right → same SD.`, R`Remove an outlier → SD goes down (and the mean moves toward the rest).`],
      example: { q: R`$\{5,5,5,5\}$ vs $\{1,5,9\}$`, a: [R`first: SD $= 0$ (no spread)`, R`second: bigger SD`] },
      trap: R`SD measures spread, not size: $\{101, 102, 103\}$ has the same SD as $\{1, 2, 3\}$.`,
      desmos: { lines: [{ show: 'stdev([1,5,9])', latex: '\\operatorname{stdev}\\left(\\left[1,5,9\\right]\\right)' }] } }),
    C({ id: 'k_data_shift', topic: 'data', badge: 'memo', title: 'Add or multiply every value: what changes',
      keywords: 'add constant multiply every value mean median range standard deviation shift scale',
      see: [R`"Each value in the data set is increased by $5$. Which statement is true?"`, R`"…data set B is created by adding $46$ to each value"`],
      pic: picShift,
      formula: R`$$+c:\ \text{center} + c,\ \text{spread same} \qquad \times k:\ \text{center} \times k,\ \text{spread} \times k$$`,
      steps: [R`Center = mean and median. Spread = range, IQR and SD.`, R`Adding $c$ slides everything: center changes, spread does not.`, R`Multiplying by $k$ stretches: both change by $\times k$.`],
      example: { q: R`Mean $70$, SD $8$. Every score $\times 1.1$.`, a: [R`mean $77$, SD $8.8$`] },
      trap: 'Adding the same number never changes range or SD.' }),
    C({ id: 'k_box', topic: 'data', badge: 'memo', title: 'Box plots: median, quartiles, IQR, range',
      keywords: 'box plot interquartile range quartile median whisker range five number summary outlier skew',
      see: [R`"Based on the box plot, what is the interquartile range?"`, R`"Which statement about the two box plots must be true?"`],
      pic: picBox,
      formula: R`$$\text{IQR} = Q_3 - Q_1 \qquad \text{range} = \max - \min$$`,
      steps: [R`Read 5 numbers: whisker end, box edge, middle line, box edge, whisker end.`, R`Each of the 4 sections holds 25% of the data — a longer section is just more spread out.`, R`Box plots show medians, never means. Long right tail → mean is above the median.`],
      example: { q: R`Box from $4$ to $7$, line at $5$`, a: [R`median $5$, IQR $= 7 - 4 = 3$`] },
      trap: '"Which must be true about the means?" — a box plot alone can\'t tell you the mean.' }),
    C({ id: 'k_prob_table', topic: 'data', badge: 'memo', title: 'Probability & two-way tables: "given" = new total',
      keywords: 'probability two-way table conditional probability given selected at random or and',
      see: [R`"If a person who prefers tea is selected at random, what is the probability the person is a teen?"`, R`"…given that the student is a junior"`],
      pic: picTwoWay,
      formula: R`$$P = \frac{\text{favorable}}{\text{total}} \qquad P(A \mid B) = \frac{\text{both } A \text{ and } B}{\text{total of } B}$$`,
      steps: [R`Find the group after "given", "of those who", "selected from" — its total is the denominator.`, R`Numerator: the cell that is in both groups.`, R`"$A$ or $B$": add them, subtract the overlap once.`],
      example: { q: R`Same table: $P(\text{tea} \mid \text{teen})$`, a: [R`teens total $40$, teen + tea $= 30$`, R`$\frac{30}{40} = 0.75$`] },
      trap: R`$P(\text{teen} \mid \text{tea}) \ne P(\text{tea} \mid \text{teen})$ — the denominator changes.` }),
    C({ id: 'k_scatter', topic: 'data', badge: 'memo', title: 'Scatterplots & line of best fit',
      keywords: 'scatterplot line of best fit predicted actual residual slope meaning model',
      see: [R`"The line of best fit is $y = 1.5x + 20$. What does $1.5$ mean?"`, R`"What is the difference between the actual and predicted value?"`],
      pic: picScatter,
      formula: R`$$\text{predicted} = \text{plug } x \text{ into the line} \qquad \text{actual} - \text{predicted} = \text{how far above the line}$$`,
      steps: [R`Slope: predicted change in $y$ for each $+1$ in $x$ (use the context words).`, R`$y$-intercept: predicted $y$ when $x = 0$.`, R`Point above the line → actual is more than predicted.`],
      example: { q: R`$y = 1.5x + 20$, at $x = 10$ the actual value is $40$`, a: [R`predicted $1.5(10) + 20 = 35$`, R`actual is $5$ more`] },
      trap: 'It\'s a prediction, not a promise — and less reliable far outside the data.' }),
    C({ id: 'k_sampling', topic: 'data', badge: 'memo', title: 'Samples & margin of error: what you can conclude',
      keywords: 'random sample margin of error population estimate inference conclusion generalize',
      see: [R`"A random sample of $400$ residents… $52\%$ … margin of error $3\%$. Which conclusion is best?"`],
      pic: picSampling,
      formula: R`$$\text{plausible values} = \text{estimate} \pm \text{margin of error}$$`,
      steps: [R`Random sample → you may generalize, but only to the group it was drawn from.`, R`Any value inside estimate $\pm$ margin is plausible; nothing is certain.`, R`Bigger sample → smaller margin of error.`],
      example: { q: R`$52\% \pm 3\%$`, a: [R`between $49\%$ and $55\%$`, R`"more than half" is plausible but not certain`] },
      trap: 'A sample of one club, or of volunteers, can\'t be generalized to the whole school.' }),
    C({ id: 'k_experiment', topic: 'data', badge: 'memo', title: 'Experiments vs observational studies: cause or not',
      keywords: 'experiment observational study random assignment random selection cause effect correlation conclusion',
      see: [R`"Researchers randomly assigned $200$ volunteers to two groups… Which conclusion is appropriate?"`],
      pic: picExperiment,
      formula: R`$$\text{random assignment} \to \text{cause} \qquad \text{random sampling} \to \text{generalize}$$`,
      steps: [R`Random assignment to treatments? Yes → you may say "causes".`, R`Randomly selected from a population? Yes → you may generalize to that population.`, R`Neither → only "is associated with", for the people studied.`],
      example: { q: R`Volunteers randomly assigned to two diets`, a: [R`diet causes the difference`, R`but only for people like these volunteers`] },
      trap: 'A survey that finds a link never proves cause.' }),
    C({ id: 'k_expected', topic: 'data', badge: 'bonus', title: 'Expected value',
      keywords: 'expected value average outcome probability game',
      see: [R`"A game pays $\$10$ with probability $0.2$ and costs $\$3$ otherwise…"`],
      formula: R`$$E = \sum (\text{value} \times \text{probability})$$`,
      steps: [R`List each outcome with its value and probability.`, R`Multiply each pair and add.`],
      example: { q: R`win $\$10$ (0.2), lose $\$3$ (0.8)`, a: [R`$10(0.2) - 3(0.8) = -0.4$ per game`] } }),
    C({ id: 'k_counting', topic: 'data', badge: 'bonus', title: 'Counting: multiply choices, arrangements & groups',
      keywords: 'counting principle permutations combinations arrangements choose nCr nPr',
      see: [R`"How many different outfits…"`, R`"How many ways to choose $2$ of $5$…"`],
      formula: R`$$\text{choices} \times \text{choices} \qquad _nP_r = \frac{n!}{(n-r)!} \qquad _nC_r = \frac{n!}{r!(n-r)!}$$`,
      steps: [R`Independent choices: multiply.`, R`Order matters (president, VP) → permutation; order doesn't (a team) → combination.`, R`Desmos: nCr(5,2), nPr(5,2).`],
      example: { q: R`Choose $2$ of $5$ people`, a: [R`$_5C_2 = 10$`] },
      desmos: { lines: [{ show: 'nCr(5,2)', latex: '\\operatorname{nCr}\\left(5,2\\right)' }] } })
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
