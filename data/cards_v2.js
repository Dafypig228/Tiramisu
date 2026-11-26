// New-format formula cards (pilot). Rendered by cards.js (CardKit).
// Formula/step strings use String.raw so LaTeX backslashes stay single.
(function () {
  const R = String.raw;
  const F = "font-family='Inter,Arial,sans-serif'";

  // ---------- pictures ----------
  const picLine = (() => {
    const xs = h => 48 + h * 42, ys = c => 180 - c * 1.15;
    let s = `<svg viewBox="0 0 360 212" xmlns="http://www.w3.org/2000/svg" ${F}>`;
    [30, 60, 90, 120].forEach(c => { s += `<line x1="48" y1="${ys(c)}" x2="342" y2="${ys(c)}" stroke="#eef0f3"/><text x="42" y="${ys(c) + 4}" font-size="10" text-anchor="end" fill="#6b7280">${c}</text>`; });
    for (let h = 1; h <= 7; h++) s += `<text x="${xs(h)}" y="194" font-size="10" text-anchor="middle" fill="#6b7280">${h}</text>`;
    s += `<line x1="48" y1="180" x2="346" y2="180" stroke="#111"/><line x1="48" y1="180" x2="48" y2="24" stroke="#111"/>`;
    s += `<line x1="${xs(0)}" y1="${ys(45)}" x2="${xs(7)}" y2="${ys(129)}" stroke="#111" stroke-width="2.4"/>`;
    s += `<line x1="${xs(2)}" y1="${ys(69)}" x2="${xs(4)}" y2="${ys(69)}" stroke="#1d4ed8" stroke-width="3"/>`;
    s += `<line x1="${xs(4)}" y1="${ys(69)}" x2="${xs(4)}" y2="${ys(93)}" stroke="#dc2626" stroke-width="3"/>`;
    s += `<text x="${(xs(2) + xs(4)) / 2}" y="${ys(69) + 15}" font-size="11.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">+2 hours</text>`;
    s += `<text x="${xs(4) + 6}" y="${(ys(69) + ys(93)) / 2 + 4}" font-size="11.5" font-weight="700" fill="#dc2626">+$24</text>`;
    s += `<circle cx="${xs(0)}" cy="${ys(45)}" r="5" fill="#16a34a"/>`;
    s += `<text x="56" y="${ys(45) + 22}" font-size="11.5" font-weight="700" fill="#16a34a">b = 45 → cost at h = 0 (the fee)</text>`;
    s += `<text x="62" y="38" font-size="14" font-weight="800" fill="#111">C = 12h + 45</text>`;
    s += `<text x="62" y="55" font-size="11.5" fill="#374151">m = 24 ÷ 2 = <tspan fill="#dc2626" font-weight="700">$12 per hour</tspan></text>`;
    s += `<text x="195" y="208" font-size="11" text-anchor="middle" fill="#374151">hours (h)</text>`;
    s += `<text transform="translate(12,105) rotate(-90)" font-size="11" text-anchor="middle" fill="#374151">cost C ($)</text>`;
    return s + '</svg>';
  })();

  const picParabola = (() => {
    const xs = x => 40 + x * 36, ys = y => 105 - y * 16;
    let d = '';
    for (let i = 0; i <= 60; i++) { const x = i / 10, y = x * x - 6 * x + 5; d += (i ? 'L' : 'M') + xs(x).toFixed(1) + ' ' + ys(y).toFixed(1); }
    let s = `<svg viewBox="0 0 372 200" xmlns="http://www.w3.org/2000/svg" ${F}>`;
    s += `<line x1="22" y1="${ys(0)}" x2="${xs(6.4)}" y2="${ys(0)}" stroke="#111"/><line x1="${xs(0)}" y1="14" x2="${xs(0)}" y2="192" stroke="#111"/>`;
    for (let x = 1; x <= 6; x++) s += `<line x1="${xs(x)}" y1="${ys(0) - 3}" x2="${xs(x)}" y2="${ys(0) + 3}" stroke="#111"/><text x="${xs(x)}" y="${ys(0) + (x === 1 || x === 5 ? -7 : 15)}" font-size="10" text-anchor="middle" fill="#6b7280">${x}</text>`;
    s += `<line x1="${xs(3)}" y1="14" x2="${xs(3)}" y2="192" stroke="#dc2626" stroke-dasharray="4 4" stroke-width="1.2"/>`;
    s += `<path d="${d}" fill="none" stroke="#111" stroke-width="2.4"/>`;
    s += `<circle cx="${xs(0)}" cy="${ys(5)}" r="5" fill="#16a34a"/><text x="${xs(0) + 9}" y="${ys(5) + 4}" font-size="11" font-weight="700" fill="#16a34a">(0, 5)</text>`;
    s += `<circle cx="${xs(1)}" cy="${ys(0)}" r="5" fill="#1d4ed8"/><circle cx="${xs(5)}" cy="${ys(0)}" r="5" fill="#1d4ed8"/>`;
    s += `<circle cx="${xs(3)}" cy="${ys(-4)}" r="5" fill="#dc2626"/><text x="${xs(3) + 9}" y="${ys(-4) + 4}" font-size="11" font-weight="700" fill="#dc2626">(3, −4)</text>`;
    const L = 262;
    s += `<text x="${L}" y="34" font-size="11.5" font-weight="700" fill="#16a34a">y = x² − 6x + 5</text><text x="${L}" y="50" font-size="11" fill="#16a34a">shows y-int 5</text>`;
    s += `<text x="${L}" y="94" font-size="11.5" font-weight="700" fill="#dc2626">y = (x − 3)² − 4</text><text x="${L}" y="110" font-size="11" fill="#dc2626">shows vertex (3, −4)</text>`;
    s += `<text x="${L}" y="154" font-size="11.5" font-weight="700" fill="#1d4ed8">y = (x − 1)(x − 5)</text><text x="${L}" y="170" font-size="11" fill="#1d4ed8">shows zeros 1 and 5</text>`;
    s += `<text x="${xs(3) + 5}" y="22" font-size="10" fill="#dc2626">x = 3 (middle of 1 and 5)</text>`;
    return s + '</svg>';
  })();

  const picPercent = `<svg viewBox="0 0 360 196" xmlns="http://www.w3.org/2000/svg" ${F}>
    <text x="8" y="16" font-size="12" font-weight="800" fill="#111">Increase by 30%  →  × 1.30</text>
    <rect x="8" y="24" width="200" height="28" fill="#e5e7eb" stroke="#111"/><text x="108" y="43" font-size="12" text-anchor="middle" font-weight="700">old = 80 (100%)</text>
    <rect x="208" y="24" width="60" height="28" fill="#bbf7d0" stroke="#111"/><text x="238" y="43" font-size="12" text-anchor="middle" font-weight="700" fill="#166534">+24</text>
    <text x="8" y="70" font-size="12" fill="#374151">new = 80 × 1.30 = <tspan font-weight="800" fill="#111">104</tspan>   (30% of 80 = 24)</text>
    <text x="8" y="100" font-size="12" font-weight="800" fill="#111">Decrease by 25%  →  × 0.75</text>
    <rect x="8" y="108" width="150" height="28" fill="#e5e7eb" stroke="#111"/><text x="83" y="127" font-size="12" text-anchor="middle" font-weight="700">kept 75%</text>
    <rect x="158" y="108" width="50" height="28" fill="#fecaca" stroke="#dc2626" stroke-dasharray="4 3"/><text x="183" y="127" font-size="12" text-anchor="middle" font-weight="700" fill="#b91c1c">−20</text>
    <text x="8" y="154" font-size="12" fill="#374151">new = 80 × 0.75 = <tspan font-weight="800" fill="#111">60</tspan></text>
    <text x="8" y="182" font-size="12" fill="#111" font-weight="700">Backwards: 60 ÷ 0.75 = 80   <tspan fill="#b91c1c">(not 60 × 1.25 = 75)</tspan></text>
  </svg>`;

  const picArc = (() => {
    const cx = 92, cy = 100, r = 72, ex = cx + r * Math.cos(Math.PI / 3), ey = cy - r * Math.sin(Math.PI / 3);
    return `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" ${F}>
      <path d="M${cx} ${cy} L${cx + r} ${cy} A${r} ${r} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="#fed7aa"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#111" stroke-width="1.8"/>
      <path d="M${cx + r} ${cy} A${r} ${r} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#dc2626" stroke-width="4.5"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#111" stroke-width="1.6"/><line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#111" stroke-width="1.6"/>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#111"/>
      <path d="M${cx + 20} ${cy} A20 20 0 0 0 ${(cx + 10).toFixed(1)} ${(cy - 17.3).toFixed(1)}" fill="none" stroke="#111"/>
      <text x="${cx + 24}" y="${cy - 9}" font-size="11.5" font-weight="700">60°</text>
      <text x="${cx + r / 2}" y="${cy + 16}" font-size="11.5" font-weight="700" text-anchor="middle">r = 6</text>
      <text x="${cx + 54}" y="${cy - 60}" font-size="11.5" font-weight="800" fill="#dc2626">arc</text>
      <text x="182" y="46" font-size="13" fill="#374151">60° out of 360°</text>
      <text x="182" y="66" font-size="14" font-weight="800" fill="#111">= 1/6 of the circle</text>
      <text x="182" y="104" font-size="13" font-weight="700" fill="#dc2626">arc = 1/6 × 2π·6 = 2π</text>
      <text x="182" y="132" font-size="13" font-weight="700" fill="#c2410c">sector = 1/6 × π·6² = 6π</text>
      <text x="182" y="168" font-size="11.5" fill="#6b7280">arc uses 2πr (the edge)</text>
      <text x="182" y="184" font-size="11.5" fill="#6b7280">sector uses πr² (the slice)</text>
    </svg>`;
  })();

  const picDesmos = (() => {
    const xs = x => 145 + x * 10.5, ys = y => 190 - y * 4.4;
    let s = `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" ${F}>`;
    s += `<rect x="0.5" y="0.5" width="359" height="199" fill="#fff" stroke="#d1d5db"/>`;
    for (let x = 5; x <= 20; x += 5) s += `<line x1="${xs(x)}" y1="8" x2="${xs(x)}" y2="190" stroke="#eef0f3"/><text x="${xs(x)}" y="198" font-size="8" text-anchor="middle" fill="#9ca3af">${x}</text>`;
    for (let y = 10; y <= 40; y += 10) s += `<line x1="135" y1="${ys(y)}" x2="359" y2="${ys(y)}" stroke="#eef0f3"/><text x="${xs(0) + 3}" y="${ys(y) - 2}" font-size="8" fill="#9ca3af">${y}</text>`;
    s += `<line x1="${xs(0)}" y1="8" x2="${xs(0)}" y2="190" stroke="#6b7280"/><line x1="135" y1="190" x2="359" y2="190" stroke="#6b7280"/>`;
    s += `<line x1="${xs(4)}" y1="${ys(0)}" x2="${xs(52 / 3)}" y2="${ys(40)}" stroke="#c74440" stroke-width="2.4"/>`;
    s += `<line x1="${xs(0)}" y1="${ys(1)}" x2="${xs(19.5)}" y2="${ys(40)}" stroke="#2d70b3" stroke-width="2.4"/>`;
    s += `<circle cx="${xs(13)}" cy="${ys(27)}" r="5.5" fill="#6b7280"/>`;
    s += `<rect x="${xs(13) - 78}" y="${ys(27) - 32}" width="64" height="20" rx="4" fill="#fff" stroke="#6b7280"/><text x="${xs(13) - 46}" y="${ys(27) - 18}" font-size="12" font-weight="800" text-anchor="middle">(13, 27)</text>`;
    s += `<line x1="${xs(13) - 14}" y1="${ys(27) - 14}" x2="${xs(13) - 4}" y2="${ys(27) - 4}" stroke="#6b7280"/>`;
    s += `<rect x="0.5" y="0.5" width="134" height="199" fill="#fff" stroke="#d1d5db"/>`;
    s += `<line x1="0" y1="40" x2="135" y2="40" stroke="#e5e7eb"/><line x1="0" y1="80" x2="135" y2="80" stroke="#e5e7eb"/>`;
    s += `<text x="6" y="14" font-size="8" fill="#9ca3af">1</text><circle cx="18" cy="22" r="6" fill="#c74440"/><text x="30" y="26" font-size="12.5" font-weight="600">y = 3(x − 4)</text>`;
    s += `<text x="6" y="54" font-size="8" fill="#9ca3af">2</text><circle cx="18" cy="62" r="6" fill="#2d70b3"/><text x="30" y="66" font-size="12.5" font-weight="600">y = 2x + 1</text>`;
    s += `<text x="10" y="112" font-size="11" fill="#374151">left side → line 1</text><text x="10" y="128" font-size="11" fill="#374151">right side → line 2</text>`;
    s += `<text x="10" y="156" font-size="11" font-weight="700" fill="#111">click the gray dot:</text><text x="10" y="172" font-size="11" font-weight="700" fill="#111">x = 13 is the answer</text>`;
    return s + '</svg>';
  })();

  const picRef = R`<div class="k-ref">
    <div class="k-ref-h give">Given in Bluebook (Reference button)</div>
    <div>Circle: $A=\pi r^2$, $C=2\pi r$</div><div>Rectangle: $A=\ell w$</div>
    <div>Triangle: $A=\tfrac12 bh$</div><div>$c^2=a^2+b^2$</div>
    <div>30-60-90: $x,\ x\sqrt3,\ 2x$</div><div>45-45-90: $s,\ s,\ s\sqrt2$</div>
    <div>Box: $V=\ell wh$</div><div>Cylinder: $V=\pi r^2h$</div>
    <div>Sphere: $V=\tfrac43\pi r^3$</div><div>Cone: $V=\tfrac13\pi r^2h$</div>
    <div>Pyramid: $V=\tfrac13\ell wh$</div><div>Circle $=360^\circ=2\pi$ rad; triangle angles $=180^\circ$</div>
    <div class="k-ref-h mem">NOT given — memorize</div>
    <div class="k-mem">Slope $\frac{y_2-y_1}{x_2-x_1}$, $y=mx+b$</div><div class="k-mem">$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$</div>
    <div class="k-mem">Vertex $x=-\frac{b}{2a}$</div><div class="k-mem">$(x-h)^2+(y-k)^2=r^2$</div>
    <div class="k-mem">SOH CAH TOA, $\sin x=\cos(90^\circ-x)$</div><div class="k-mem">Arc/sector $=\frac{\theta}{360}\times$ circle</div>
    <div class="k-mem">% change $=\frac{\text{new}-\text{old}}{\text{old}}$</div><div class="k-mem">$a(1+r)^t$, exponent rules</div>
    <div class="k-mem">Mean $=\frac{\text{sum}}{\text{count}}$</div><div class="k-mem">Distance, midpoint</div>
  </div>`;

  // ---------- cards ----------
  const cards = [
    {
      v: 2, id: 'k_unit', topic: 'trig', badge: 'memo',
      title: 'Unit circle: sin & cos of any angle',
      keywords: 'unit circle sin cos tan quadrant reference angle coterminal radians degrees astc',
      see: [R`"What is the value of $\cos\frac{29\pi}{6}$?"`, R`"$\sin 210^\circ = ?$" · "angle in Quadrant II…"`],
      widget: 'unitcircle',
      formula: [R`$$\text{point on the circle} = (\cos\theta,\ \sin\theta)$$`, R`$$\tan\theta=\frac{\sin\theta}{\cos\theta}$$`],
      steps: [
        R`Get the angle between $0^\circ$ and $360^\circ$: remove full turns ($360^\circ$ or $2\pi$). Shortcut for $\frac{k\pi}{6}$: one turn is $\frac{12\pi}{6}$, so keep the remainder of $k \div 12$ (for $\frac{k\pi}{4}$ use $\div 8$, for $\frac{k\pi}{3}$ use $\div 6$).`,
        R`Find the quadrant → signs. Q1: all $+$, Q2: sin $+$, Q3: tan $+$, Q4: cos $+$.`,
        R`Reference angle = distance to the x-axis ($30^\circ$, $45^\circ$ or $60^\circ$). Take its value, then put the sign.`
      ],
      example: { q: R`$\cos 210^\circ = ?$`, a: [R`$210^\circ$ is in Q3 → cos is negative`, R`reference angle $210^\circ - 180^\circ = 30^\circ$, $\cos 30^\circ = \frac{\sqrt3}{2}$`, R`answer: $-\frac{\sqrt3}{2}$`] },
      trap: R`$\pi = 180^\circ$. An angle with $\pi$ is in radians — in Desmos switch to Radians, or the number will be wrong.`,
      desmos: { lines: [{ show: 'cos(29π/6)', latex: R`\cos\left(\frac{29\pi}{6}\right)` }], degreeMode: false, tip: R`Desmos gives $-0.866…$ Compare with choices: $-\frac{\sqrt3}{2}\approx-0.866$. Check the mode first: $\sin(30)=0.5$ means Degrees.` }
    },
    {
      v: 2, id: 'k_line_words', topic: 'linear', badge: 'memo',
      title: 'Lines in word problems: what slope and y-intercept mean',
      keywords: 'slope intercept linear function word problem rate per fixed fee starting value table two points',
      see: [R`"$C = 45 + 12h$ … What does $12$ represent?"`, R`"The table shows a linear relationship… which equation?"`],
      pic: picLine,
      formula: R`$$y = mx + b \qquad m = \frac{y_2 - y_1}{x_2 - x_1}$$`,
      steps: [
        R`$b$ = the value when $x = 0$ → words: <b>starting, fixed, initial, fee</b>.`,
        R`$m$ = change in $y$ for <b>each 1</b> unit of $x$ → words: <b>per, each, every</b>. Negative $m$ = decreases.`,
        R`From two points or two table rows: $m = \frac{\Delta y}{\Delta x}$, then $b = y - mx$ with either point.`
      ],
      example: { q: R`A table shows $(2,\ 69)$ and $(5,\ 105)$. Find the equation.`, a: [R`$m = \frac{105-69}{5-2} = \frac{36}{3} = 12$`, R`$b = 69 - 12\cdot 2 = 45$`, R`$C = 12h + 45$`] },
      trap: R`In $300 - 15w$ the slope is $-15$: it <b>drops</b> 15 per week. The number alone ($300$) is the start, not the rate.`,
      desmos: { lines: [{ show: 'y=12x+45', latex: 'y=12x+45' }, { show: '(2,69)', latex: '(2,69)' }, { show: '(5,105)', latex: '(5,105)' }], tip: 'If the table points sit on the line, the equation fits. Fast way to check answer choices.' }
    },
    {
      v: 2, id: 'k_parabola', topic: 'advanced', badge: 'memo',
      title: 'Parabola: which form shows vertex, zeros or y-intercept',
      keywords: 'parabola quadratic vertex form factored form standard form minimum maximum zeros roots x-intercepts axis of symmetry',
      see: [R`"Which equivalent form displays the minimum value as a constant?"`, R`"$f(2) = f(8)$… $x$-coordinate of the vertex?"`],
      pic: picParabola,
      formula: [R`$$y=ax^2+bx+c \;\to\; \text{y-intercept } c$$`, R`$$y=a(x-h)^2+k \;\to\; \text{vertex } (h,\,k)$$`, R`$$y=a(x-p)(x-q) \;\to\; \text{zeros } p,\ q$$`, R`$$h=-\frac{b}{2a}=\frac{p+q}{2}$$`],
      steps: [
        R`Decide what they ask: min/max <b>value</b> → $k$; <b>where</b> (x) → $h$; x-intercepts → $p, q$; y-intercept → $c$.`,
        R`Pick the form that shows it as a number you can read.`,
        R`Vertex $x$: $h = -\frac{b}{2a}$, or halfway between the zeros, or halfway between any two $x$'s with equal $y$.`
      ],
      example: { q: R`Minimum value of $y = 2x^2 - 12x + 7$?`, a: [R`$h = -\frac{-12}{2\cdot 2} = 3$`, R`$k = 2(3)^2 - 12(3) + 7 = -11$`, R`minimum value $-11$ (at $x = 3$)`] },
      trap: R`"Minimum value" is $k$ (a $y$-value), not $h$. If $a < 0$ it opens down → maximum.`,
      desmos: { lines: [{ show: 'y=2x^2-12x+7', latex: 'y=2x^2-12x+7' }], tip: 'Click the gray vertex dot → (3, −11). Click where it crosses the x-axis to get the zeros.' }
    },
    {
      v: 2, id: 'k_percent', topic: 'ratios', badge: 'memo',
      title: 'Percent: "of", "more than", percent change, backwards',
      keywords: 'percent percentage increase decrease discount markup original price percent change multiplier',
      see: [R`"$A$ is $30\%$ greater than $B$…"`, R`"After a $25\%$ discount the price is $\$60$. Original price?"`],
      pic: picPercent,
      formula: [R`$$\text{part} = \frac{p}{100}\cdot\text{whole}$$`, R`$$\text{new} = \text{old}\times\left(1 \pm \frac{p}{100}\right)$$`, R`$$\%\text{ change} = \frac{\text{new} - \text{old}}{\text{old}}\cdot 100$$`],
      steps: [
        R`Find the base: the number after <b>"of"</b>, <b>"than"</b> or <b>"from"</b>.`,
        R`Turn the percent into a multiplier: $+30\% \to 1.30$, $-25\% \to 0.75$.`,
        R`Forward: multiply. Backwards (find the original): <b>divide</b> by the multiplier.`
      ],
      example: { q: R`Price went from $\$80$ to $\$60$. Percent decrease?`, a: [R`$\frac{60 - 80}{80} = -0.25$`, R`$25\%$ decrease (divide by the <b>old</b> price)`] },
      trap: R`$+20\%$ then $-20\%$ is not back to start: $1.2 \times 0.8 = 0.96$ → $4\%$ less.`
    },
    {
      v: 2, id: 'k_arc', topic: 'circles', badge: 'partly',
      title: 'Arc length & sector area = a fraction of the circle',
      keywords: 'arc length sector area central angle radians degrees circle fraction pizza slice',
      see: [R`"central angle $60^\circ$, radius $6$… length of the arc?"`, R`"sector area… angle $\frac{\pi}{3}$ radians"`],
      pic: picArc,
      formula: [R`$$\text{fraction} = \frac{\theta}{360^\circ} = \frac{\theta}{2\pi}$$`, R`$$\text{arc} = \text{fraction}\cdot 2\pi r$$`, R`$$\text{sector} = \text{fraction}\cdot \pi r^2$$`],
      steps: [
        R`Fraction of the circle = angle $\div 360^\circ$ (or angle $\div 2\pi$ in radians).`,
        R`Arc → multiply the fraction by the circumference $2\pi r$. Sector → multiply by the area $\pi r^2$.`,
        R`Reverse questions: $\frac{\text{arc}}{2\pi r} = \frac{\theta}{360^\circ}$ — solve for the missing piece.`
      ],
      example: { q: R`Arc length $5$, central angle $72^\circ$. Circumference?`, a: [R`$72^\circ$ is $\frac{72}{360} = \frac15$ of the circle`, R`circumference $= 5 \times 5 = 25$`] },
      trap: R`In radians the shortcut is arc $= r\theta$ — only when $\theta$ is in radians. Circle area/circumference are on the sheet; the fraction idea is not.`
    },
    {
      v: 2, id: 'k_dm_intersect', topic: 'desmos', badge: 'desmos',
      title: 'Desmos: solve any equation or system by graphing',
      keywords: 'desmos intersection solve equation system of equations graph both sides number of solutions no solution infinitely many',
      see: [R`"What value of $x$ satisfies $3(x-4) = 2x+1$?"`, R`"How many solutions does the system have?" · "$(x, y)$ is the solution…"`],
      pic: picDesmos,
      steps: [
        R`Equation: type the left side as $y = \ldots$ and the right side as another $y = \ldots$`,
        R`Click the gray intersection dot. Its $x$ is the solution. (System: type both equations as they are.)`,
        R`Count dots = number of solutions. Parallel lines → no solution. Same line → infinitely many.`
      ],
      example: { q: R`$3(x-4) = 2x + 1$`, a: [R`graph $y = 3(x-4)$ and $y = 2x+1$`, R`intersection $(13,\ 27)$ → $x = 13$`] },
      trap: 'No dot visible? Zoom out — it can be off-screen. Use only x and y as variables, otherwise Desmos makes sliders.',
      desmos: { lines: [{ show: 'y=3(x-4)', latex: 'y=3(x-4)' }, { show: 'y=2x+1', latex: 'y=2x+1' }], tip: 'Then click where the lines cross.' }
    },
    {
      v: 2, id: 'k_refsheet', topic: 'strategy', badge: 'strategy',
      title: 'What Bluebook gives you — and what it does not',
      keywords: 'reference sheet formula sheet bluebook given memorize',
      see: ['Any geometry question. Open the Reference button at the top of the Math section.'],
      pic: picRef,
      steps: [
        R`Don't spend time memorizing the green list — open Reference for volumes and special triangles.`,
        R`Do memorize the yellow list: those formulas are used in almost every module and are never given.`
      ],
      trap: 'The sheet gives circle area, not the circle equation. It gives volumes, not surface areas.'
    }
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.unshift(...cards);
})();
