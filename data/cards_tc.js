// Cards: Right-triangle trig (topic 'trig') + Circles (topic 'circles'). Needs cards.js (KP).
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';

  // ---------- pictures ----------
  const picSoh = (() => {
    const A = [30, 140], B = [190, 140], C = [190, 20];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.ra(B, A, C, 11);
    s += K.arc(A[0], A[1], 26, 0, K.ang(A, C), { c: '#111', w: 2 }) + K.t(62, 132, 'θ', { b: true, s: 14 });
    s += K.l(...B, ...C, { c: red, w: 3.5 }) + K.l(...A, ...B, { c: blue, w: 3.5 }) + K.l(...A, ...C, { c: '#111', w: 2.5 });
    s += K.t(184, 104, 'opp 3', { b: true, c: red, s: 12, a: 'end' }) + K.t(110, 158, 'adjacent 4', { a: 'middle', b: true, c: blue, s: 12 }) + K.t(82, 72, 'hyp 5', { b: true, s: 12, a: 'end' });
    s += K.t(232, 40, 'SOH', { b: true, s: 13, c: red }) + K.t(272, 40, 'sin = 3/5', { s: 12 });
    s += K.t(232, 64, 'CAH', { b: true, s: 13, c: blue }) + K.t(272, 64, 'cos = 4/5', { s: 12 });
    s += K.t(232, 88, 'TOA', { b: true, s: 13, c: orange }) + K.t(272, 88, 'tan = 3/4', { s: 12 });
    s += K.t(232, 124, 'stand at θ:', { s: 11, c: gray }) + K.t(232, 140, 'opposite = across,', { s: 11, c: gray }) + K.t(232, 156, 'adjacent = touching', { s: 11, c: gray });
    return K.svg(360, 168, s);
  })();

  const picComplement = (() => {
    const A = [30, 140], B = [210, 140], C = [210, 30];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.ra(B, A, C, 11);
    s += K.arc(A[0], A[1], 28, 0, K.ang(A, C), { c: blue, w: 2.4 }) + K.t(66, 132, 'A', { b: true, c: blue });
    s += K.arc(C[0], C[1], 24, K.ang(C, A), 270, { c: red, w: 2.4 }) + K.t(196, 70, 'B', { b: true, c: red });
    s += K.l(...B, ...C, { c: '#7c3aed', w: 3.5 }) + K.t(218, 90, 'this side', { s: 11, b: true, c: '#7c3aed' });
    s += K.t(236, 30, 'A + B = 90°', { b: true, s: 13 }) + K.t(236, 56, 'opposite A =', { s: 11.5 }) + K.t(236, 72, 'adjacent to B', { s: 11.5 });
    s += K.t(236, 104, 'sin A = cos B', { b: true, s: 13, c: '#7c3aed' }) + K.t(10, 168, 'sin(2x) = cos(x + 15°) → 2x + x + 15 = 90 → x = 25', { s: 11.5, b: true });
    return K.svg(360, 176, s);
  })();

  const picTrigFind = (() => {
    const A = [30, 140], B = [190, 140], C = [190, 73.3];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.ra(B, A, C, 10) + K.arc(A[0], A[1], 26, 0, K.ang(A, C), { w: 2 }) + K.t(62, 134, 'x', { b: true, s: 13 });
    s += K.t(198, 112, '5', { b: true, c: red, s: 13 }) + K.t(110, 158, '12', { a: 'middle', b: true, c: blue, s: 13 }) + K.t(100, 96, '13', { b: true, s: 13 });
    s += K.t(220, 34, 'sin x = 5/13 given', { b: true, s: 12 }) + K.t(220, 56, 'opp 5, hyp 13', { s: 11.5 }) + K.t(220, 74, '→ adj 12 (5-12-13)', { s: 11.5, c: blue, b: true });
    s += K.t(220, 104, 'cos x = 12/13', { s: 12.5, b: true, c: blue }) + K.t(220, 124, 'tan x = 5/12', { s: 12.5, b: true, c: orange });
    return K.svg(360, 168, s);
  })();

  const picRadDeg = (() => {
    const c = [180, 140], r = 110;
    let s = K.l(50, 140, 310, 140, { c: gray }) + K.path(`M${c[0] + r} ${c[1]} A${r} ${r} 0 0 0 ${c[0] - r} ${c[1]}`, { w: 2 });
    [[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [120, '2π/3'], [135, '3π/4'], [150, '5π/6'], [180, 'π'], [0, '0']].forEach(([d, lab]) => {
      const P = [c[0] + r * Math.cos(d * Math.PI / 180), c[1] - r * Math.sin(d * Math.PI / 180)];
      const L = [c[0] + (r + 22) * Math.cos(d * Math.PI / 180), c[1] - (r + 22) * Math.sin(d * Math.PI / 180)];
      const L2 = [c[0] + (r - 20) * Math.cos(d * Math.PI / 180), c[1] - (r - 20) * Math.sin(d * Math.PI / 180)];
      s += K.dot(P[0], P[1], '#111', 3.5) + K.t(L[0], L[1] + 4, lab, { a: 'middle', b: true, c: blue, s: 11 }) + K.t(L2[0], L2[1] + 4, d + '°', { a: 'middle', s: 10, c: gray });
    });
    s += K.t(c[0], 160, 'π = 180°  →  replace π with 180', { a: 'middle', b: true, s: 12.5 });
    return K.svg(360, 168, s);
  })();

  const picCircleBasic = (() => {
    let s = K.c(90, 86, 62, { f: '#eff6ff', c: blue, w: 2 }) + K.l(28, 86, 152, 86, { c: orange, w: 2, d: '5 4' }) + K.l(90, 86, 90 + 62 * Math.cos(1), 86 - 62 * Math.sin(1), { c: red, w: 2.4 }) + K.dot(90, 86);
    s += K.t(116, 62, 'r', { b: true, c: red }) + K.t(60, 104, 'd = 2r', { b: true, c: orange, s: 11.5 });
    s += K.t(180, 46, 'C = 2πr = πd', { b: true, s: 13.5 }) + K.t(180, 72, 'A = πr²', { b: true, s: 13.5 }) + K.t(180, 104, 'C = 10π → r = 5', { s: 12, c: gray }) + K.t(180, 122, '→ A = 25π', { s: 12, c: gray });
    return K.svg(360, 160, s);
  })();

  const picCircleEq = (() => {
    const p = K.plot({ x0: -1.5, x1: 12.9, y0: -8.5, y1: 0.8, xt: 1, yt: 1, h: 240 });
    let d = ''; for (let i = 0; i <= 72; i++) { const t = i / 72 * 2 * Math.PI; d += (i ? 'L' : 'M') + p.X(3 + 4 * Math.cos(t)).toFixed(1) + ' ' + p.Y(-4 + 4 * Math.sin(t)).toFixed(1); }
    p.add(K.path(d, { c: blue, w: 2.4 }));
    p.pt(3, -4, { c: red, label: 'center (3, −4)', dx: -40, dy: 18 }).seg(3, -4, 7, -4, { c: red, w: 2 }).txt(5, -3.6, 'r = 4', { a: 'middle', b: true, c: red, s: 11 });
    p.pt(3, 0, { c: green, r: 4 }).txt(3.3, 0.35, 'touches x-axis: r = |−4|', { c: green, b: true, s: 10.5 });
    p.txt(7.6, -5.6, 'x² − 6x + y² + 8y + 9 = 0', { b: true, s: 10.5 }).txt(7.6, -6.6, '(x − 3)² + (y + 4)² = 16', { b: true, s: 10.5, c: blue });
    return p.svg();
  })();

  const picInscribed = (() => {
    const O = [100, 90], r = 66, P = a => [O[0] + r * Math.cos(a * Math.PI / 180), O[1] - r * Math.sin(a * Math.PI / 180)];
    const A = P(-20), B = P(60), V = P(200);
    let s = K.c(O[0], O[1], r, { w: 1.8 }) + K.arc(O[0], O[1], r, -20, 60, { c: red, w: 4.5 });
    s += K.l(...O, ...A, { c: blue, w: 2 }) + K.l(...O, ...B, { c: blue, w: 2 }) + K.dot(...O, blue, 3.5);
    s += K.l(...V, ...A, { c: orange, w: 2 }) + K.l(...V, ...B, { c: orange, w: 2 }) + K.dot(...V, orange, 3.5);
    s += K.arc(O[0], O[1], 16, -20, 60, { c: blue, w: 2 }) + K.t(O[0] + 20, O[1] - 2, '80°', { b: true, c: blue, s: 11.5 });
    s += K.arc(V[0], V[1], 22, K.ang(V, A), K.ang(V, B), { c: orange, w: 2 }) + K.t(V[0] + 26, V[1] - 2, '40°', { b: true, c: orange, s: 11.5 });
    s += K.t(190, 36, 'center angle = arc = 80°', { b: true, s: 12, c: blue }) + K.t(190, 60, 'angle ON the circle', { b: true, s: 12, c: orange }) + K.t(190, 76, '= half the arc = 40°', { b: true, s: 12, c: orange });
    s += K.t(190, 110, 'diameter side → 90°', { s: 11.5 }) + K.t(190, 128, 'quad in circle:', { s: 11.5 }) + K.t(190, 144, 'opposite angles sum 180°', { s: 11.5 });
    return K.svg(360, 166, s);
  })();

  const picTangent = (() => {
    const O = [80, 90], r = 50, Pp = [250, 90], al = Math.acos(r / (Pp[0] - O[0]));
    const A = [O[0] + r * Math.cos(al), O[1] - r * Math.sin(al)], B = [O[0] + r * Math.cos(al), O[1] + r * Math.sin(al)];
    let s = K.c(O[0], O[1], r, { f: '#eff6ff', c: blue, w: 2 }) + K.l(...Pp, ...A, { w: 2 }) + K.l(...Pp, ...B, { w: 2 }) + K.l(...O, ...A, { c: red, w: 2 }) + K.l(...O, ...B, { c: red, w: 2 }) + K.l(...O, ...Pp, { c: gray, d: '4 3', w: 1.2 });
    s += K.ra(A, O, Pp, 8) + K.ra(B, O, Pp, 8) + K.dot(...O) + K.dot(...Pp) + K.t(O[0] - 14, O[1] + 4, 'O', { b: true }) + K.t(Pp[0] + 6, Pp[1] + 4, 'P', { b: true });
    s += K.t(170, 52, 'PA', { b: true, s: 12 }) + K.t(170, 140, 'PB', { b: true, s: 12 }) + K.t(84, 60, 'r', { b: true, c: red });
    s += K.t(10, 168, 'radius ⊥ tangent (90°)   ·   PA = PB', { b: true, s: 12 });
    return K.svg(360, 176, s);
  })();

  const picRadii = (() => {
    const O = [100, 80], r = 64, A = [O[0] - 51.2, O[1] + 38.4], B = [O[0] + 51.2, O[1] + 38.4], M = [O[0], O[1] + 38.4];
    let s = K.c(O[0], O[1], r, { w: 1.8 }) + K.l(...A, ...B, { w: 2.4 }) + K.l(...O, ...A, { c: red, w: 2 }) + K.l(...O, ...B, { c: red, w: 2 }) + K.l(...O, ...M, { c: blue, w: 2, d: '4 3' }) + K.ra(M, B, O, 8) + K.dot(...O);
    s += K.t(60, 92, '10', { b: true, c: red }) + K.t(104, 106, '6', { b: true, c: blue }) + K.t(126, 134, '8', { b: true }) + K.t(70, 134, '8', { b: true });
    s += K.t(190, 36, 'two radii → isosceles', { b: true, s: 12, c: red }) + K.t(190, 62, '⊥ from center cuts', { b: true, s: 12, c: blue }) + K.t(190, 78, 'the chord in half', { b: true, s: 12, c: blue });
    s += K.t(190, 110, 'chord = 2 · 8 = 16', { b: true, s: 12.5 }) + K.t(190, 140, 'center angle 60° → chord r', { s: 11 }) + K.t(190, 156, '90° → r√2,  120° → r√3', { s: 11 });
    return K.svg(360, 166, s);
  })();

  // ---------- cards ----------
  const C = (o) => Object.assign({ v: 2 }, o);
  const cards = [
    // ===== TRIG =====
    C({ id: 'k_soh', topic: 'trig', badge: 'memo', title: 'SOH CAH TOA: sin, cos, tan in a right triangle',
      keywords: 'soh cah toa sine cosine tangent opposite adjacent hypotenuse right triangle trig ratio slope',
      see: [R`"In right triangle $ABC$, what is $\sin A$?"`, R`"The hypotenuse is $15$ and $\sin A = 0.6$. Length of $BC$?"`],
      pic: picSoh,
      formula: R`$$\sin = \frac{\text{opp}}{\text{hyp}} \qquad \cos = \frac{\text{adj}}{\text{hyp}} \qquad \tan = \frac{\text{opp}}{\text{adj}}$$`,
      steps: [R`Stand at the angle: opposite = the side across, adjacent = the side touching it (not the hypotenuse).`, R`Write the ratio and fill in what you know.`, R`Missing side: ratio $=$ value, solve. A line through the origin at angle $\theta$ has slope $\tan\theta$.`],
      example: { q: R`Hypotenuse $15$, $\sin A = 0.6$. Side opposite $A$?`, a: [R`$\frac{\text{opp}}{15} = 0.6$`, R`opp $= 9$`] },
      trap: 'Only for right triangles. Label opposite/adjacent from the angle they ask about — it changes with the angle.' }),
    C({ id: 'k_complement', topic: 'trig', badge: 'memo', title: 'sin A = cos B when A + B = 90°',
      keywords: 'complementary angles sin cos cofunction sin x = cos 90-x right triangle',
      see: [R`"In right triangle $ABC$, $\sin A = \frac{7}{25}$. What is $\cos B$?"`, R`"$\sin(2x) = \cos(x + 15^\circ)$. What is $x$?"`],
      pic: picComplement,
      formula: R`$$\sin x = \cos(90^\circ - x) \qquad \sin A = \cos B \iff A + B = 90^\circ$$`,
      steps: [R`The two small angles of a right triangle add to $90^\circ$.`, R`The side opposite one is adjacent to the other → $\sin$ of one $=$ $\cos$ of the other.`, R`See $\sin(\ldots) = \cos(\ldots)$? Set the two angles' sum to $90^\circ$ and solve.`],
      example: { q: R`$\sin A = \frac{7}{25}$ in right triangle $ABC$ (right angle at $C$). $\cos B$?`, a: [R`$\cos B = \sin A = \frac{7}{25}$`] },
      trap: R`In radians the sum is $\frac\pi2$, not $90$.` }),
    C({ id: 'k_trig_find', topic: 'trig', badge: 'memo', title: 'Given one trig ratio, find the others',
      keywords: 'given sin find cos tan pythagorean identity sin squared cos squared triangle trick',
      see: [R`"If $\sin x = \frac{5}{13}$ and $x$ is acute, what is $\tan x$?"`],
      pic: picTrigFind,
      formula: R`$$\sin^2\theta + \cos^2\theta = 1 \qquad \tan\theta = \frac{\sin\theta}{\cos\theta}$$`,
      steps: [R`Draw a right triangle and put the given ratio's numbers on the matching sides.`, R`Find the third side with Pythagoras (look for a triple).`, R`Read off the ratio they ask for. Not acute? Use the unit circle card for the sign.`],
      example: { q: R`$\cos x = \frac{3}{5}$, $x$ acute. $\sin x$?`, a: [R`adj $3$, hyp $5$ → opp $4$`, R`$\sin x = \frac45$`] },
      trap: 'Use sides of the triangle, not the angle itself, for the ratio.' }),
    C({ id: 'k_rad_deg', topic: 'trig', badge: 'partly', title: 'Radians ↔ degrees: replace π with 180',
      keywords: 'radians degrees convert pi 180 angle measure',
      see: [R`"An angle measures $\frac{5\pi}{6}$ radians. What is it in degrees?"`, R`"What is $135^\circ$ in radians?"`],
      pic: picRadDeg,
      formula: R`$$\pi = 180^\circ \qquad \text{deg} = \text{rad}\cdot\frac{180}{\pi} \qquad \text{rad} = \text{deg}\cdot\frac{\pi}{180}$$`,
      steps: [R`Radians → degrees: put $180$ where $\pi$ is: $\frac{5\pi}6 = \frac{5\cdot180}{6} = 150^\circ$.`, R`Degrees → radians: multiply by $\frac\pi{180}$ and simplify.`, R`Know the common ones: $\frac\pi6 = 30^\circ$, $\frac\pi4 = 45^\circ$, $\frac\pi3 = 60^\circ$, $\frac\pi2 = 90^\circ$.`],
      example: { q: R`$135^\circ$ in radians`, a: [R`$135\cdot\frac{\pi}{180} = \frac{3\pi}{4}$`] },
      trap: R`"$\pi$ radians $= 180^\circ$" is on the sheet; the conversions are not. Match Desmos' angle mode to the question.` }),
    C({ id: 'k_laws', topic: 'trig', badge: 'bonus', title: 'Any triangle: ½ab sin C, Law of Sines & Cosines',
      keywords: 'law of sines law of cosines area sine non right triangle',
      see: [R`"In triangle $ABC$, $a = 5$, $b = 8$, angle $C = 60^\circ$…"`],
      formula: [R`$$\text{Area} = \tfrac12 ab\sin C \qquad \frac{a}{\sin A} = \frac{b}{\sin B}$$`, R`$$c^2 = a^2 + b^2 - 2ab\cos C$$`],
      steps: [R`Two sides and the angle between them: area $\frac12ab\sin C$; third side with the Law of Cosines.`, R`Side-angle pairs: Law of Sines.`],
      example: { q: R`$a = 5,\ b = 8,\ C = 60^\circ$`, a: [R`$c^2 = 25 + 64 - 80\cdot\frac12 = 49 \Rightarrow c = 7$`, R`area $= \frac12\cdot5\cdot8\cdot\frac{\sqrt3}{2} = 10\sqrt3$`] },
      trap: 'Angle C must be the angle between sides a and b.' }),

    // ===== CIRCLES =====
    C({ id: 'k_circle_basic', topic: 'circles', badge: 'sheet', title: 'Circle: radius, diameter, circumference, area',
      keywords: 'circle area circumference radius diameter pi',
      see: [R`"A circle has circumference $10\pi$. What is its area?"`, R`"The area of a circle is $36\pi$…"`],
      pic: picCircleBasic,
      formula: R`$$C = 2\pi r = \pi d \qquad A = \pi r^2$$`,
      steps: [R`Get $r$ first from whatever they give (diameter, circumference, area).`, R`Then compute what they ask.`, R`Answer "in terms of $\pi$" → keep $\pi$ as a letter.`],
      example: { q: R`Area $36\pi$. Circumference?`, a: [R`$r^2 = 36 \Rightarrow r = 6$`, R`$C = 12\pi$`] },
      trap: 'Diameter given? Halve it before using the area formula.' }),
    C({ id: 'k_circle_eq', topic: 'circles', badge: 'memo', title: 'Circle equation: center & radius (even when expanded)',
      keywords: 'circle equation center radius standard form expanded form completing the square tangent to axis diameter endpoints',
      see: [R`"$(x - 3)^2 + (y + 5)^2 = 16$. Center and radius?"`, R`"$x^2 - 6x + y^2 + 8y + 9 = 0$… radius?"`],
      pic: picCircleEq,
      formula: [R`$$(x-h)^2 + (y-k)^2 = r^2 \Rightarrow \text{center } (h, k)$$`, R`$$x^2 + Dx + y^2 + Ey + F = 0 \Rightarrow \text{center} \left(-\tfrac D2,\ -\tfrac E2\right)$$`, R`$$r^2 = \left(\tfrac D2\right)^2 + \left(\tfrac E2\right)^2 - F$$`],
      steps: [R`Standard form: center has the OPPOSITE signs; right side is $r^2$.`, R`Expanded form: halve the $x$- and $y$-numbers, flip signs → center. $r^2 = $ (half)$^2$ + (half)$^2 - F$.`, R`Touches the x-axis → $r = |k|$; touches the y-axis → $r = |h|$. Diameter ends → center = midpoint.`],
      example: { q: R`$x^2 - 6x + y^2 + 8y + 9 = 0$`, a: [R`center $(3, -4)$`, R`$r^2 = 9 + 16 - 9 = 16 \Rightarrow r = 4$`] },
      trap: R`If it starts $2x^2 + 2y^2$, divide everything by $2$ first. Answer may ask for $r^2$, not $r$.`,
      desmos: { lines: [{ show: 'x^2-6x+y^2+8y+9=0', latex: 'x^2-6x+y^2+8y+9=0' }], tip: 'Desmos draws it; click the left and right edge points — center is halfway between.' } }),
    C({ id: 'k_inscribed', topic: 'circles', badge: 'memo', title: 'Angles in a circle: center angle vs angle on the circle',
      keywords: 'inscribed angle central angle arc semicircle thales cyclic quadrilateral',
      see: [R`"Points $A$, $B$, $C$ lie on the circle… What is the measure of angle $ACB$?"`, R`"$\overline{AB}$ is a diameter…"`],
      pic: picInscribed,
      formula: R`$$\text{center angle} = \text{arc} \qquad \text{angle on the circle} = \tfrac12\,\text{arc}$$`,
      steps: [R`Find which arc the angle "looks at".`, R`Vertex at the center → equals the arc. Vertex on the circle → half of the arc.`, R`Triangle with a diameter as a side → $90^\circ$ opposite it. Four corners on a circle → opposite angles add to $180^\circ$.`],
      example: { q: R`Arc $AB = 110^\circ$, $C$ on the circle`, a: [R`$\angle ACB = 55^\circ$`] },
      trap: 'Make sure the vertex is really on the circle, not inside it.' }),
    C({ id: 'k_tangent', topic: 'circles', badge: 'memo', title: 'Tangent lines: 90° with the radius',
      keywords: 'tangent line radius perpendicular two tangents equal external point',
      see: [R`"Line $\ell$ is tangent to the circle at point $A$…"`, R`"$PA$ and $PB$ are tangent to circle $O$…"`],
      pic: picTangent,
      formula: R`$$\text{radius} \perp \text{tangent} \qquad PA = PB \qquad OP^2 = r^2 + PA^2$$`,
      steps: [R`Draw the radius to the point of tangency — it makes a $90^\circ$ angle.`, R`Now you have a right triangle: use Pythagoras or trig.`, R`Two tangents from one point are equal; angle at $O$ + angle at $P$ $= 180^\circ$.`],
      example: { q: R`$OP = 13$, $r = 5$. Tangent length?`, a: [R`$PA = \sqrt{169 - 25} = 12$`] },
      trap: 'Tangent slope at a point = negative reciprocal of the radius slope.' }),
    C({ id: 'k_circle_radii', topic: 'circles', badge: 'memo', title: 'Chords: equal radii and the perpendicular bisector',
      keywords: 'chord radius perpendicular bisector isosceles distance from center chord length',
      see: [R`"A chord is $6$ units from the center of a circle with radius $10$. Chord length?"`],
      pic: picRadii,
      formula: R`$$\left(\tfrac{\text{chord}}{2}\right)^2 + d^2 = r^2$$`,
      steps: [R`Any two radii make an isosceles triangle (equal base angles).`, R`The perpendicular from the center cuts the chord in half — right triangle with $r$ as the hypotenuse.`, R`Center angle $60^\circ$ → chord $= r$; $90^\circ$ → $r\sqrt2$; $120^\circ$ → $r\sqrt3$.`],
      example: { q: R`$r = 10$, distance $6$`, a: [R`half chord $= 8$ (6-8-10)`, R`chord $= 16$`] },
      trap: 'Double the half-chord at the end.' }),
    C({ id: 'k_ring', topic: 'circles', badge: 'bonus', title: 'Shaded ring between two circles',
      keywords: 'annulus ring two concentric circles tangent chord area',
      see: [R`"Two circles share a center. A chord of the big circle of length $10$ is tangent to the small circle…"`],
      formula: R`$$A = \pi(R^2 - r^2) = \pi\left(\tfrac L2\right)^2$$`,
      steps: [R`Ring area $= \pi R^2 - \pi r^2$.`, R`Chord of the big circle tangent to the small one: $R^2 - r^2 = (L/2)^2$.`],
      example: { q: R`$L = 10$`, a: [R`$\pi\cdot5^2 = 25\pi$`] } }),
    C({ id: 'k_chords', topic: 'circles', badge: 'bonus', title: 'Crossing chords & secants: products are equal',
      keywords: 'intersecting chords secant tangent power of a point',
      see: [R`"Chords $AB$ and $CD$ intersect at $E$…"`],
      formula: R`$$\text{chords: } a\cdot b = c\cdot d \qquad \text{outside: outside}\cdot\text{whole} = \text{outside}\cdot\text{whole} \qquad \text{tangent}^2 = \text{outside}\cdot\text{whole}$$`,
      steps: [R`Chords crossing inside: piece × piece = piece × piece.`, R`From an outside point: outside part × whole line (outside + inside).`],
      example: { q: R`Pieces $4$ and $6$; other chord $3$ and $x$`, a: [R`$4\cdot6 = 3x \Rightarrow x = 8$`] } })
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
