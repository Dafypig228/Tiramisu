// Cards: Geometry — lines, angles, triangles, polygons, coordinates, area & volume (topic 'geometry'). Needs cards.js (KP).
(function () {
  const R = String.raw, K = window.KP;
  const red = '#dc2626', blue = '#1d4ed8', green = '#16a34a', orange = '#c2410c', gray = '#6b7280';
  const lblAt = (P, ang, r, s, o) => K.t(P[0] + r * Math.cos(ang * Math.PI / 180), P[1] - r * Math.sin(ang * Math.PI / 180) + 4, s, Object.assign({ a: 'middle', b: true, s: 12 }, o));

  // ---------- pictures ----------
  const picParallel = (() => {
    const A = [100, 175], B = [270, 5], P1 = [217.5, 57.5], P2 = [152.5, 122.5];
    let s = K.l(15, 57.5, 345, 57.5) + K.l(15, 122.5, 345, 122.5) + K.l(...A, ...B);
    s += K.t(340, 50, 'ℓ', { a: 'end', b: true }) + K.t(340, 115, 'm', { a: 'end', b: true }) + K.t(18, 92, 'ℓ ∥ m', { b: true, s: 12 });
    const t = 45;
    [P1, P2].forEach(P => {
      s += K.arc(P[0], P[1], 18, 0, t, { c: blue, w: 2.4 }) + K.arc(P[0], P[1], 18, 180, 180 + t, { c: blue, w: 2.4 });
      s += K.arc(P[0], P[1], 13, t, 180, { c: red, w: 2 }) + K.arc(P[0], P[1], 13, 180 + t, 360, { c: red, w: 2 });
      s += lblAt(P, t / 2, 30, 'a', { c: blue }) + lblAt(P, 180 + t / 2, 30, 'a', { c: blue }) + lblAt(P, 112, 26, 'b', { c: red }) + lblAt(P, 292, 26, 'b', { c: red });
    });
    s += K.t(250, 96, 'only 2 sizes:', { s: 11.5, b: true }) + K.t(250, 112, 'a + b = 180°', { s: 12.5, b: true, c: orange });
    return K.svg(360, 180, s);
  })();

  const picTriAngles = (() => {
    const A = [40, 140], B = [200, 140], C = [134.8, 27];
    let s = K.l(20, 140, 300, 140, { c: gray, w: 1.4 }) + K.poly([A, B, C], { f: '#f8fafc' });
    s += K.arc(A[0], A[1], 22, 0, K.ang(A, C), { c: blue, w: 2 }) + K.t(A[0] + 28, A[1] - 8, '50°', { b: true, c: blue, s: 11.5 });
    s += K.arc(C[0], C[1], 20, K.ang(C, A), K.ang(C, B) + 360, { c: green, w: 2 }) + K.t(C[0], C[1] + 34, '70°', { a: 'middle', b: true, c: green, s: 11.5 });
    s += K.arc(B[0], B[1], 20, K.ang(B, C), 180, { c: '#7c3aed', w: 2 }) + K.t(B[0] - 32, B[1] - 8, '60°', { b: true, c: '#7c3aed', s: 11.5 });
    s += K.arc(B[0], B[1], 26, 0, K.ang(B, C), { c: red, w: 3 }) + K.t(B[0] + 30, B[1] - 16, '120°', { b: true, c: red, s: 12 });
    s += K.t(10, 16, '50 + 60 + 70 = 180', { b: true, s: 12.5 }) + K.t(222, 72, 'outside angle', { s: 11, c: red, b: true }) + K.t(222, 88, '= 50 + 70 = 120', { s: 11.5, c: red, b: true });
    s += K.t(10, 170, 'Sides 4 and 9 → third side between 5 and 13', { s: 11.5, b: true });
    return K.svg(360, 178, s);
  })();

  const picSimilar = (() => {
    const A = [180, 14], B = [40, 150], C = [320, 150], D = [124, 68.4], E = [236, 68.4];
    let s = K.poly([A, B, C], { f: '#eff6ff', c: blue }) + K.poly([A, D, E], { f: '#fef3c7', c: orange, w: 2.2 });
    s += K.t(A[0], A[1] - 2, 'A', { a: 'middle', b: true }) + K.t(B[0] - 10, B[1] + 4, 'B', { b: true }) + K.t(C[0] + 4, C[1] + 4, 'C', { b: true }) + K.t(D[0] - 14, D[1] + 4, 'D', { b: true }) + K.t(E[0] + 5, E[1] + 4, 'E', { b: true });
    s += K.t(140, 44, '4', { b: true, c: orange }) + K.t(100, 116, '6', { b: true, c: blue }) + K.t(180, 64, 'DE = 6', { a: 'middle', b: true, c: orange, s: 11.5 }) + K.t(180, 168, 'BC = ?', { a: 'middle', b: true, c: blue, s: 12 });
    s += K.t(250, 30, 'DE ∥ BC', { b: true, s: 11.5 }) + K.t(250, 46, '4/10 = 6/BC', { b: true, s: 11.5, c: blue }) + K.t(250, 62, 'BC = 15', { b: true, s: 12, c: blue });
    return K.svg(360, 176, s);
  })();

  const picScale = (() => {
    let s = '';
    s += K.rect(20, 70, 40, 40, { f: '#dbeafe', c: blue }) + K.t(40, 126, '1', { a: 'middle', b: true });
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) s += K.rect(100 + i * 40, 30 + j * 40, 40, 40, { f: '#dbeafe', c: blue });
    s += K.t(140, 126, '2 (k = 2)', { a: 'middle', b: true });
    s += K.t(210, 40, 'lengths × k = × 2', { b: true, s: 12.5 }) + K.t(210, 66, 'area × k² = × 4', { b: true, s: 12.5, c: blue }) + K.t(210, 92, 'volume × k³ = × 8', { b: true, s: 12.5, c: orange });
    s += K.t(10, 152, 'Area ratio 9 : 25 → length ratio 3 : 5 (take √)', { s: 11.5, c: gray });
    return K.svg(360, 160, s);
  })();

  const picPyth = (() => {
    const A = [40, 140], B = [200, 140], C = [40, 20];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.ra(A, B, C, 12);
    s += K.t(120, 158, 'a = 8', { a: 'middle', b: true, c: blue }) + K.t(18, 84, 'b = 6', { a: 'middle', b: true, c: blue }) + K.t(132, 72, 'c = 10', { b: true, c: red });
    s += K.t(220, 34, 'a² + b² = c²', { b: true, s: 13.5 }) + K.t(220, 56, '64 + 36 = 100', { s: 12.5 });
    s += K.t(220, 88, 'Triples:', { b: true, s: 12 }) + K.t(220, 106, '3-4-5   5-12-13', { s: 12, c: orange, b: true }) + K.t(220, 124, '8-15-17  7-24-25', { s: 12, c: orange, b: true }) + K.t(220, 142, '(and multiples: 6-8-10)', { s: 11, c: gray });
    return K.svg(360, 168, s);
  })();

  const picSpecial = (() => {
    let s = '';
    const A = [20, 140], B = [130, 140], C = [20, 30];
    s += K.poly([A, B, C], { f: '#eff6ff', c: blue }) + K.ra(A, B, C, 10) + K.t(75, 158, 'x', { a: 'middle', b: true }) + K.t(10, 90, 'x', { a: 'middle', b: true }) + K.t(84, 78, 'x√2', { b: true, c: blue });
    s += K.t(108, 134, '45°', { s: 10, c: gray }) + K.t(25, 52, '45°', { s: 10, c: gray }) + K.t(75, 16, '45-45-90', { a: 'middle', b: true, c: blue });
    const D = [190, 140], E = [340, 140], F = [190, 53.4];
    s += K.poly([D, E, F], { f: '#fef3c7', c: orange }) + K.ra(D, E, F, 10) + K.t(265, 158, 'x√3', { a: 'middle', b: true }) + K.t(180, 100, 'x', { a: 'middle', b: true }) + K.t(272, 88, '2x', { b: true, c: orange });
    s += K.t(312, 134, '30°', { s: 10, c: gray }) + K.t(195, 74, '60°', { s: 10, c: gray }) + K.t(265, 30, '30-60-90', { a: 'middle', b: true, c: orange });
    s += K.t(265, 46, 'short side faces 30°', { a: 'middle', s: 10, c: gray });
    return K.svg(360, 168, s);
  })();

  const picTriArea = (() => {
    const A = [20, 120], B = [170, 120], C = [110, 26], H = [110, 120];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.l(...C, ...H, { c: red, d: '5 4', w: 2 }) + K.ra(H, B, C, 9);
    s += K.t(95, 138, 'base b', { a: 'middle', b: true }) + K.t(116, 80, 'h', { b: true, c: red });
    s += K.t(10, 160, 'A = ½ · b · h  (h ⊥ base)', { b: true, s: 12.5 });
    const P = [270, 26];
    s += K.poly([[200, 120], [245, 120], P], { f: '#dbeafe', c: blue }) + K.poly([[245, 120], [345, 120], P], { f: '#fef3c7', c: orange });
    s += K.t(222, 138, '3', { a: 'middle', b: true, c: blue }) + K.t(295, 138, '5', { a: 'middle', b: true, c: orange });
    s += K.t(270, 160, 'same height → areas 3 : 5', { a: 'middle', b: true, s: 11 });
    return K.svg(360, 170, s);
  })();

  const picQuads = (() => {
    let s = K.poly([[30, 110], [150, 110], [125, 40], [60, 40]], { f: '#eff6ff', c: blue }) + K.l(70, 40, 70, 110, { c: red, d: '4 3', w: 1.8 });
    s += K.t(92, 34, 'b₁', { a: 'middle', b: true, c: blue }) + K.t(90, 128, 'b₂', { a: 'middle', b: true, c: blue }) + K.t(74, 80, 'h', { b: true, c: red });
    s += K.t(90, 150, 'trapezoid: (b₁ + b₂)/2 · h', { a: 'middle', b: true, s: 11 });
    s += K.poly([[270, 20], [330, 75], [270, 130], [210, 75]], { f: '#fef3c7', c: orange }) + K.l(270, 20, 270, 130, { c: orange, d: '4 3' }) + K.l(210, 75, 330, 75, { c: orange, d: '4 3' });
    s += K.t(276, 52, 'd₁', { b: true, c: orange }) + K.t(298, 70, 'd₂', { b: true, c: orange }) + K.t(270, 150, 'rhombus / kite: d₁·d₂ / 2', { a: 'middle', b: true, s: 11 });
    s += K.t(10, 170, 'parallelogram: base × height (not the slanted side)', { s: 11, c: gray });
    return K.svg(360, 176, s);
  })();

  const picPolygon = (() => {
    const c = [100, 88], r = 62;
    const pts = Array.from({ length: 6 }, (_, i) => [c[0] + r * Math.cos(i * Math.PI / 3), c[1] - r * Math.sin(i * Math.PI / 3)]);
    let s = K.poly(pts, { f: '#eff6ff', c: blue });
    const P = pts[0], Q = pts[1];
    s += K.l(P[0], P[1], P[0] + (P[0] - pts[5][0]) * 0.8, P[1] + (P[1] - pts[5][1]) * 0.8, { c: red, d: '4 3' });
    s += K.arc(P[0], P[1], 16, K.ang(pts[5], P), K.ang(P, Q), { c: red, w: 2 }) + K.t(P[0] + 18, P[1] - 18, '60°', { b: true, c: red, s: 11 });
    s += K.t(P[0] - 34, P[1] + 4, '120°', { b: true, c: blue, s: 11 });
    s += K.t(190, 34, 'interior sum = 180(n − 2)', { b: true, s: 12 }) + K.t(190, 54, 'hexagon: 180 · 4 = 720', { s: 11.5 });
    s += K.t(190, 86, 'each exterior = 360 / n', { b: true, s: 12, c: red }) + K.t(190, 106, '360 / 6 = 60°', { s: 11.5, c: red });
    s += K.t(190, 138, 'each interior = 180 − 60', { b: true, s: 12, c: blue }) + K.t(190, 158, '= 120°', { s: 11.5, c: blue });
    return K.svg(360, 168, s);
  })();

  const picEquilateral = (() => {
    const A = [20, 140], B = [160, 140], C = [90, 18.8], H = [90, 140];
    let s = K.poly([A, B, C], { f: '#eff6ff', c: blue }) + K.l(...C, ...H, { c: red, d: '5 4', w: 2 }) + K.ra(H, B, C, 9);
    s += K.t(90, 158, 's', { a: 'middle', b: true }) + K.t(42, 76, 's', { b: true }) + K.t(96, 96, 'h = s√3/2', { b: true, c: red, s: 11.5 });
    s += K.t(190, 40, 'A = s²√3 / 4', { b: true, s: 14, c: blue }) + K.t(190, 64, 's = 6 → A = 9√3', { s: 12 });
    const c = [270, 120], r = 30;
    const hex = Array.from({ length: 6 }, (_, i) => [c[0] + r * Math.cos(i * Math.PI / 3), c[1] - r * Math.sin(i * Math.PI / 3)]);
    s += K.poly(hex, { f: '#fef3c7', c: orange }) + hex.map(p => K.l(c[0], c[1], p[0], p[1], { c: orange, w: 1 })).join('');
    s += K.t(310, 116, 'hexagon =', { s: 11, b: true }) + K.t(310, 132, '6 of them', { s: 11, b: true });
    return K.svg(360, 166, s);
  })();

  const picDist = (() => {
    const p = K.plot({ x0: 0, x1: 9, y0: 0, y1: 11, xt: 1, yt: 1 });
    p.seg(1, 2, 7, 10, { c: '#111', w: 2.4 }).seg(1, 2, 7, 2, { c: blue, w: 2.4, d: '5 4' }).seg(7, 2, 7, 10, { c: red, w: 2.4, d: '5 4' });
    p.pt(1, 2, { label: 'A(1, 2)', dx: -10, dy: 18 }).pt(7, 10, { label: 'B(7, 10)', dx: -64, dy: -4 }).pt(4, 6, { c: green, label: 'M(4, 6)', dx: -60, dy: -4 });
    p.txt(4, 1.2, 'Δx = 6', { a: 'middle', b: true, c: blue }).txt(7.2, 6, 'Δy = 8', { b: true, c: red });
    p.txt(0.3, 10.2, 'd = √(6² + 8²) = 10', { b: true, s: 12.5 });
    return p.svg();
  })();

  const picVolume = (() => {
    let s = '';
    // cylinder
    s += `<ellipse cx="45" cy="30" rx="30" ry="9" fill="#eff6ff" stroke="#111" stroke-width="1.5"/>` + K.l(15, 30, 15, 95) + K.l(75, 30, 75, 95) + K.path('M15 95 A30 9 0 0 0 75 95', {}) + K.path('M15 95 A30 9 0 0 1 75 95', { d: '3 3', c: gray });
    s += K.l(45, 30, 75, 30, { c: red }) + K.t(55, 26, 'r', { b: true, c: red, s: 11 }) + K.t(45, 118, 'πr²h', { a: 'middle', b: true });
    // cone
    s += K.l(135, 20, 110, 95) + K.l(135, 20, 160, 95) + K.path('M110 95 A25 8 0 0 0 160 95') + K.path('M110 95 A25 8 0 0 1 160 95', { d: '3 3', c: gray }) + K.l(135, 20, 135, 95, { c: red, d: '3 3' }) + K.t(139, 64, 'h', { b: true, c: red, s: 11 });
    s += K.t(135, 118, '⅓πr²h', { a: 'middle', b: true });
    // sphere
    s += K.c(215, 58, 34, { f: '#f0fdf4' }) + `<ellipse cx="215" cy="58" rx="34" ry="10" fill="none" stroke="${gray}" stroke-dasharray="3 3"/>` + K.l(215, 58, 249, 58, { c: red }) + K.t(228, 54, 'r', { b: true, c: red, s: 11 });
    s += K.t(215, 118, '⁴⁄₃πr³', { a: 'middle', b: true });
    // box
    s += K.poly([[280, 40], [330, 40], [330, 95], [280, 95]], { f: '#fef3c7' }) + K.poly([[280, 40], [295, 25], [345, 25], [330, 40]], { f: '#fde68a' }) + K.poly([[330, 40], [345, 25], [345, 80], [330, 95]], { f: '#fcd34d' });
    s += K.t(312, 118, 'ℓwh', { a: 'middle', b: true });
    s += K.t(10, 146, 'Pyramid: ⅓ℓwh. Any prism: base area × height.', { s: 11.5 }) + K.t(10, 164, 'All of these are on the Reference sheet.', { s: 11, c: green, b: true });
    return K.svg(360, 172, s);
  })();

  const picSurface = (() => {
    let s = K.c(70, 38, 26, { f: '#eff6ff', c: blue }) + K.rect(30, 66, 160, 60, { f: '#fef3c7', c: orange }) + K.c(70, 154, 26, { f: '#eff6ff', c: blue });
    s += K.t(110, 100, '2πr × h', { a: 'middle', b: true, c: orange }) + K.t(70, 42, 'πr²', { a: 'middle', b: true, c: blue, s: 11 }) + K.t(70, 158, 'πr²', { a: 'middle', b: true, c: blue, s: 11 });
    s += K.t(204, 34, 'Cylinder (unrolled):', { b: true, s: 12 }) + K.t(204, 54, '2πr² + 2πrh', { b: true, s: 13, c: orange });
    s += K.t(204, 86, 'Box: 2(ℓw + ℓh + wh)', { s: 11.5 }) + K.t(204, 106, 'Cube: 6s²', { s: 11.5 }) + K.t(204, 126, 'Sphere: 4πr²', { s: 11.5 }) + K.t(204, 146, 'NOT on the sheet', { s: 11, c: red, b: true });
    return K.svg(360, 184, s);
  })();

  const picDiag = (() => {
    const o = [40, 140], dx = 170, dy = 70, ox = 60, oy = -45;
    const P = (a, b, c) => [o[0] + a * dx + c * ox, o[1] - b * dy + c * oy];
    let s = K.poly([P(0, 0, 0), P(1, 0, 0), P(1, 1, 0), P(0, 1, 0)], { f: '#f8fafc' }) + K.poly([P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)], { f: '#eff6ff' }) + K.poly([P(1, 0, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1, 0)], { f: '#e0e7ff' });
    s += K.l(...P(0, 0, 0), ...P(0, 0, 1), { c: gray, d: '3 3', w: 1 }) + K.l(...P(0, 0, 1), ...P(1, 0, 1), { c: gray, d: '3 3', w: 1 }) + K.l(...P(0, 0, 1), ...P(0, 1, 1), { c: gray, d: '3 3', w: 1 });
    s += K.l(...P(0, 0, 0), ...P(1, 1, 1), { c: red, w: 2.6 });
    s += K.t(125, 158, 'ℓ = 4', { a: 'middle', b: true }) + K.t(18, 110, 'h = 12', { b: true, s: 11 }) + K.t(P(1, 0, 0.5)[0] + 8, P(1, 0, 0.5)[1] + 10, 'w = 3', { b: true, s: 11 });
    s += K.t(210, 172, 'd = √(16 + 9 + 144) = 13', { b: true, s: 12, c: red });
    return K.svg(360, 180, s);
  })();

  const picWater = (() => {
    let s = K.rect(30, 30, 130, 120, { c: '#111', w: 2 }) + K.rect(31, 90, 128, 59, { f: '#bfdbfe', c: 'none' }) + K.rect(200, 30, 130, 120, { c: '#111', w: 2 }) + K.rect(201, 75, 128, 74, { f: '#bfdbfe', c: 'none' }) + K.rect(245, 108, 40, 40, { f: '#fca5a5', c: red });
    s += K.l(200, 90, 330, 90, { c: blue, d: '4 3' }) + K.l(340, 75, 340, 90, { c: red, w: 2.4 }) + K.t(344, 86, 'Δh', { b: true, c: red, s: 11 });
    s += K.t(95, 22, 'before', { a: 'middle', b: true, c: gray }) + K.t(265, 22, 'drop a block in', { a: 'middle', b: true, c: gray });
    s += K.t(10, 170, 'Δh = (block volume) ÷ (tank base area)', { b: true, s: 12.5 });
    return K.svg(360, 178, s);
  })();

  const picAltitude = (() => {
    const A = [20, 140], B = [300, 140], C = [92, 17.6], H = [92, 140];
    let s = K.poly([A, B, C], { f: '#f8fafc' }) + K.ra(C, A, B, 10) + K.l(...C, ...H, { c: red, d: '5 4', w: 2 }) + K.ra(H, B, C, 8);
    s += K.t(56, 156, 'p', { a: 'middle', b: true, c: blue }) + K.t(196, 156, 'q', { a: 'middle', b: true, c: blue }) + K.t(98, 100, 'h', { b: true, c: red });
    s += K.t(220, 40, 'h² = p · q', { b: true, s: 13, c: red }) + K.t(220, 62, 'leg × leg = hyp × h', { s: 11.5 });
    return K.svg(360, 166, s);
  })();

  const picTilt = (() => {
    const o = [30, 20], S = 130, a = 40;
    let s = K.rect(o[0], o[1], S, S, { f: '#fef3c7', c: orange }) + K.poly([[o[0] + a, o[1]], [o[0] + S, o[1] + a], [o[0] + S - a, o[1] + S], [o[0], o[1] + S - a]], { f: '#dbeafe', c: blue });
    s += K.t(o[0] + a / 2, o[1] - 4, 'a', { a: 'middle', b: true }) + K.t(o[0] + a + (S - a) / 2, o[1] - 4, 'b', { a: 'middle', b: true });
    s += K.t(190, 50, 'inner square area', { b: true, s: 12 }) + K.t(190, 72, '= a² + b²', { b: true, s: 14, c: blue }) + K.t(190, 104, '4 corner triangles', { s: 11.5 }) + K.t(190, 122, 'are identical', { s: 11.5 });
    return K.svg(360, 164, s);
  })();

  const picReflect = (() => {
    const p = K.plot({ x0: -4, x1: 4, y0: -4, y1: 4, xt: 1, yt: 1 });
    p.seg(-4, -4, 4, 4, { c: '#cbd5e1', w: 1.4, d: '4 3' }).txt(3.1, 3.7, 'y = x', { c: gray, s: 10 });
    p.pt(3, 1, { label: '(3, 1)', dx: 6, dy: -6 }).pt(3, -1, { c: blue, label: 'x-axis (3, −1)', dx: -40, dy: 18, s: 10 }).pt(-3, 1, { c: blue, label: 'y-axis (−3, 1)', dx: -20, dy: -9, s: 10 });
    p.pt(1, 3, { c: orange, label: 'y = x: (1, 3)', dx: 6, dy: -4, s: 10 }).pt(-1, 3, { c: red, label: '90° CCW (−1, 3)', dx: -60, dy: -9, s: 10 }).pt(-3, -1, { c: red, label: '180°: (−3, −1)', dx: -20, dy: 18, s: 10 });
    return p.svg();
  })();

  // ---------- cards ----------
  const C = (o) => Object.assign({ v: 2 }, o);
  const cards = [
    C({ id: 'k_parallel_angles', topic: 'geometry', badge: 'memo', title: 'Angles with parallel lines: only two sizes',
      keywords: 'parallel lines transversal alternate interior corresponding vertical angles linear pair supplementary zig zag',
      see: [R`"Lines $\ell$ and $m$ are parallel… What is the value of $x$?"`, R`"In the figure, two parallel lines are cut by a transversal…"`],
      pic: picParallel,
      formula: R`$$\text{vertical angles equal} \qquad \text{straight line} = 180^\circ \qquad \text{parallel: } a = a,\ a + b = 180^\circ$$`,
      steps: [R`Across an X → equal. Next to each other on a straight line → add to $180^\circ$.`, R`Parallel lines + transversal: every angle is either $a$ (small) or $b$ (big), with $a + b = 180^\circ$.`, R`Zig-zag between two parallel lines: angles pointing left add up to angles pointing right.`],
      example: { q: R`One angle at the crossing is $3x + 10$, the matching angle is $5x - 30$`, a: [R`equal: $3x + 10 = 5x - 30$`, R`$x = 20$, angle $= 70^\circ$`] },
      trap: 'Check whether the two angles look the same size (equal) or one small, one big (sum 180).' }),
    C({ id: 'k_tri_angles', topic: 'geometry', badge: 'partly', title: 'Triangle angles, outside angle & possible side lengths',
      keywords: 'triangle angle sum 180 exterior angle isosceles base angles triangle inequality third side',
      see: [R`"In triangle $ABC$, the measure of angle $B$ is…"`, R`"Two sides are $4$ and $9$. Which could be the third side?"`],
      pic: picTriAngles,
      formula: R`$$A + B + C = 180^\circ \qquad \text{outside angle} = \text{sum of the two far angles} \qquad |a-b| < c < a+b$$`,
      steps: [R`Inside angles add to $180^\circ$ (on the sheet).`, R`An outside angle equals the two inside angles that don't touch it.`, R`Isosceles: equal sides face equal angles. Third side is strictly between the difference and the sum.`],
      example: { q: R`Isosceles triangle, top angle $40^\circ$. Base angles?`, a: [R`$(180 - 40)/2 = 70^\circ$ each`] },
      trap: 'Isosceles: check whether the given angle is the top angle or a base angle.' }),
    C({ id: 'k_similar', topic: 'geometry', badge: 'memo', title: 'Similar triangles: same shape, proportional sides',
      keywords: 'similar triangles proportional sides parallel segment scale factor congruent corresponding angles',
      see: [R`"In the figure, $\overline{DE}$ is parallel to $\overline{BC}$…"`, R`"Triangle $ABC$ is similar to triangle $DEF$… what is $\tan F$?"`],
      pic: picSimilar,
      formula: R`$$\frac{\text{small side}}{\text{matching big side}} = \text{same for every pair} \qquad \frac{AD}{AB} = \frac{DE}{BC} = \frac{AE}{AC}$$`,
      steps: [R`Match corners: same angles ↔ matching sides (watch the letter order: $ABC \sim DEF$ means $A \leftrightarrow D$).`, R`Make one ratio from a known pair, use it for the unknown side.`, R`Parallel cut: compare to the WHOLE side ($AB = AD + DB$), not just the bottom piece.`],
      example: { q: R`$AD = 4,\ DB = 6,\ DE = 6$. $BC = ?$`, a: [R`$AB = 10$`, R`$\frac{4}{10} = \frac{6}{BC} \Rightarrow BC = 15$`] },
      trap: R`Similar triangles have the same sin, cos, tan. Congruence proofs: SSS, SAS, ASA, AAS, HL — not AAA or SSA.` }),
    C({ id: 'k_scale', topic: 'geometry', badge: 'memo', title: 'Scaling: lengths × k, area × k², volume × k³',
      keywords: 'scale factor similar figures area ratio volume ratio k squared k cubed enlarge',
      see: [R`"Each side of the cube is doubled. The volume is multiplied by…"`, R`"Two similar triangles have areas $9$ and $25$…"`],
      pic: picScale,
      formula: R`$$\text{lengths} \times k \Rightarrow \text{area} \times k^2 \Rightarrow \text{volume} \times k^3$$`,
      steps: [R`Find $k$ from matching lengths.`, R`Area changes by $k^2$, volume by $k^3$.`, R`Going backwards: area ratio → take $\sqrt{\ }$ for $k$; volume ratio → take $\sqrt[3]{\ }$.`],
      example: { q: R`Radius of a sphere $\times 3$. Volume?`, a: [R`$\times 3^3 = \times 27$`] },
      trap: 'Doubling lengths doesn\'t double the area — it multiplies it by 4.' }),
    C({ id: 'k_pyth', topic: 'geometry', badge: 'sheet', title: 'Pythagorean theorem & the triples to recognize',
      keywords: 'pythagorean theorem right triangle hypotenuse leg triples 3-4-5 5-12-13',
      see: [R`"A right triangle has legs $6$ and $8$. Hypotenuse?"`, R`"A $13$-foot ladder… $5$ feet from the wall…"`],
      pic: picPyth,
      formula: R`$$a^2 + b^2 = c^2 \quad (c = \text{longest side, across from } 90^\circ)$$`,
      steps: [R`Spot a triple first: $3$-$4$-$5$, $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$ and their multiples.`, R`Otherwise plug into $a^2 + b^2 = c^2$.`, R`Big numbers: divide by a common factor, solve, multiply back.`],
      example: { q: R`Hypotenuse $13$, one leg $5$`, a: [R`$5$-$12$-$13$ → other leg $12$`] },
      trap: R`$c$ is the hypotenuse — don't add the hypotenuse and a leg.` }),
    C({ id: 'k_special', topic: 'geometry', badge: 'sheet', title: '30-60-90 & 45-45-90 triangles',
      keywords: 'special right triangles 30-60-90 45-45-90 isosceles right triangle root 2 root 3 half square half equilateral',
      see: [R`"In right triangle $ABC$, angle $A$ is $30^\circ$ and $BC = 7$…"`, R`"The diagonal of a square is $10$…"`],
      pic: picSpecial,
      formula: R`$$45\text{-}45\text{-}90:\ x,\ x,\ x\sqrt2 \qquad 30\text{-}60\text{-}90:\ x,\ x\sqrt3,\ 2x$$`,
      steps: [R`45-45-90 is half a square; 30-60-90 is half an equilateral triangle.`, R`Find $x$ from the side you know, then fill in the rest.`, R`Smallest side faces $30^\circ$; $x\sqrt3$ faces $60^\circ$; $2x$ is the hypotenuse.`],
      example: { q: R`Square with diagonal $10$. Side?`, a: [R`$x\sqrt2 = 10 \Rightarrow x = \frac{10}{\sqrt2} = 5\sqrt2$`] },
      trap: 'These ratios are on the Reference sheet — open it instead of guessing.' }),
    C({ id: 'k_tri_area', topic: 'geometry', badge: 'sheet', title: 'Triangle area & the shared-height shortcut',
      keywords: 'triangle area base height shared height area ratio angle bisector',
      see: [R`"What is the area of triangle $ABC$?"`, R`"Point $D$ is on $\overline{BC}$… ratio of the areas"`],
      pic: picTriArea,
      formula: R`$$A = \tfrac12 bh \qquad \text{same height} \Rightarrow \frac{A_1}{A_2} = \frac{b_1}{b_2}$$`,
      steps: [R`Height must be perpendicular to the base (it may fall outside the triangle).`, R`Right triangle: the two legs are base and height.`, R`Triangles sharing a top point and base line: area ratio $=$ base ratio.`],
      example: { q: R`Bases $3$ and $5$ on one line, same top point`, a: [R`areas in ratio $3 : 5$`] },
      trap: 'Using a slanted side as the height is the most common mistake.' }),
    C({ id: 'k_quads', topic: 'geometry', badge: 'partly', title: 'Quadrilateral areas: trapezoid, parallelogram, rhombus',
      keywords: 'trapezoid parallelogram rhombus kite square rectangle area diagonals',
      see: [R`"The trapezoid has parallel sides $8$ and $14$ and height $5$…"`, R`"A rhombus has diagonals $6$ and $10$…"`],
      pic: picQuads,
      formula: R`$$\text{trapezoid } \frac{b_1+b_2}{2}\,h \qquad \text{parallelogram } b\,h \qquad \text{rhombus/kite } \frac{d_1d_2}{2}$$`,
      steps: [R`Trapezoid: average of the two parallel sides × height.`, R`Parallelogram: base × perpendicular height.`, R`Shapes with perpendicular diagonals (rhombus, kite, square): $\frac{d_1d_2}{2}$.`],
      example: { q: R`Trapezoid $8$, $14$, height $5$`, a: [R`$\frac{8+14}{2}\cdot5 = 55$`] },
      trap: 'Multiply by the perpendicular height, never the slanted side.' }),
    C({ id: 'k_polygon', topic: 'geometry', badge: 'memo', title: 'Polygon angles: interior sum & each angle',
      keywords: 'polygon interior angle sum exterior angle regular polygon hexagon pentagon octagon',
      see: [R`"What is the measure of each interior angle of a regular octagon?"`, R`"The sum of the interior angles of a polygon is $1080^\circ$…"`],
      pic: picPolygon,
      formula: R`$$\text{sum} = 180^\circ(n-2) \qquad \text{each exterior} = \frac{360^\circ}{n} \qquad \text{each interior} = 180^\circ - \frac{360^\circ}{n}$$`,
      steps: [R`Exterior angles of any polygon add to $360^\circ$.`, R`Regular: one exterior $= \frac{360}{n}$, one interior $= 180 -$ that.`, R`Given the sum: $180(n - 2) = $ sum → solve for $n$.`],
      example: { q: R`Regular octagon, each interior angle`, a: [R`exterior $360/8 = 45^\circ$`, R`interior $180 - 45 = 135^\circ$`] },
      trap: R`Sum is $180(n-2)$, not $180n$.` }),
    C({ id: 'k_equilateral', topic: 'geometry', badge: 'memo', title: 'Equilateral triangle & regular hexagon',
      keywords: 'equilateral triangle area height hexagon regular hexagon square in circle',
      see: [R`"An equilateral triangle has side $6$. Area?"`, R`"A regular hexagon with side $4$…"`],
      pic: picEquilateral,
      formula: R`$$A = \frac{s^2\sqrt3}{4} \qquad h = \frac{s\sqrt3}{2} \qquad \text{hexagon} = 6 \times \frac{s^2\sqrt3}{4}$$`,
      steps: [R`Height splits it into two 30-60-90 triangles.`, R`Area $= \frac{s^2\sqrt3}{4}$.`, R`Regular hexagon = 6 equilateral triangles with side $s$. Square in a circle of radius $r$: side $r\sqrt2$.`],
      example: { q: R`Side $6$`, a: [R`$h = 3\sqrt3$`, R`$A = \frac{36\sqrt3}{4} = 9\sqrt3$`] },
      trap: 'A circle inside a square of side s has radius s/2.' }),
    C({ id: 'k_dist_mid', topic: 'geometry', badge: 'memo', title: 'Distance & midpoint between two points',
      keywords: 'distance formula midpoint coordinate geometry pythagorean points',
      see: [R`"What is the distance between $(1, 2)$ and $(7, 10)$?"`, R`"$M$ is the midpoint of $\overline{AB}$…"`],
      pic: picDist,
      formula: R`$$d = \sqrt{(\Delta x)^2 + (\Delta y)^2} \qquad M = \left(\frac{x_1+x_2}{2},\ \frac{y_1+y_2}{2}\right)$$`,
      steps: [R`Distance = Pythagoras on the right triangle under the segment.`, R`Midpoint = average the $x$'s, average the $y$'s.`, R`Given midpoint and one end: other end $= 2M - A$.`],
      example: { q: R`$M = (4, 6)$, $A = (1, 2)$. $B = ?$`, a: [R`$B = (2\cdot4 - 1,\ 2\cdot6 - 2) = (7, 10)$`] },
      trap: R`Square each difference, not each coordinate.`,
      desmos: { lines: [{ show: 'distance((1,2),(7,10))', latex: '\\operatorname{distance}\\left(\\left(1,2\\right),\\left(7,10\\right)\\right)' }, { show: 'midpoint((1,2),(7,10))', latex: '\\operatorname{midpoint}\\left(\\left(1,2\\right),\\left(7,10\\right)\\right)' }] } }),
    C({ id: 'k_volume', topic: 'geometry', badge: 'sheet', title: 'Volumes (cylinder, cone, sphere, box, pyramid)',
      keywords: 'volume cylinder cone sphere prism pyramid cube box radius diameter percent change',
      see: [R`"A cylinder has diameter $10$ and height $8$. Volume?"`, R`"The radius is increased by $20\%$… by what percent does the volume increase?"`],
      pic: picVolume,
      formula: R`$$V_\text{cyl} = \pi r^2h \qquad V_\text{cone} = \tfrac13\pi r^2h \qquad V_\text{sphere} = \tfrac43\pi r^3$$`,
      steps: [R`Diameter → divide by 2 before squaring or cubing.`, R`Cone/pyramid = $\frac13$ of the matching cylinder/prism.`, R`Percent change: plug multipliers into the variables only: $r \times 1.2,\ h \times 0.9 \Rightarrow 1.2^2 \cdot 0.9 = 1.296$ → $+29.6\%$.`],
      example: { q: R`Cylinder, diameter $10$, height $8$`, a: [R`$r = 5$`, R`$V = \pi\cdot25\cdot8 = 200\pi$`] },
      trap: 'Using the diameter as r makes the answer 4× too big (8× for spheres).' }),
    C({ id: 'k_surface', topic: 'geometry', badge: 'memo', title: 'Surface area: add up every face',
      keywords: 'surface area cylinder cube box sphere net lateral area open top',
      see: [R`"What is the surface area of the cylinder?"`, R`"A cube has surface area $150$…"`],
      pic: picSurface,
      formula: R`$$\text{box } 2(\ell w + \ell h + wh) \qquad \text{cube } 6s^2 \qquad \text{cylinder } 2\pi r^2 + 2\pi rh \qquad \text{sphere } 4\pi r^2$$`,
      steps: [R`Picture the net: list every face and add the areas.`, R`Cylinder side unrolls into a rectangle $2\pi r$ by $h$.`, R`Open top → one base, not two. "Lateral" → no bases.`],
      example: { q: R`Cube surface area $150$. Side?`, a: [R`$6s^2 = 150 \Rightarrow s^2 = 25 \Rightarrow s = 5$`] },
      trap: 'Surface area formulas are NOT on the reference sheet.' }),
    C({ id: 'k_3d_diag', topic: 'geometry', badge: 'bonus', title: 'Longest diagonal of a box & cube in a sphere',
      keywords: '3d diagonal space diagonal box cube sphere longest rod',
      see: [R`"What is the length of the longest rod that fits in the box?"`],
      pic: picDiag,
      formula: R`$$d = \sqrt{\ell^2 + w^2 + h^2} \qquad \text{cube: } d = s\sqrt3$$`,
      steps: [R`Space diagonal $= \sqrt{\ell^2 + w^2 + h^2}$.`, R`Cube inside a sphere: cube diagonal $=$ sphere diameter.`],
      example: { q: R`Box $4 \times 3 \times 12$`, a: [R`$\sqrt{16 + 9 + 144} = 13$`] },
      trap: R`Flat square diagonal uses $\sqrt2$; cube diagonal uses $\sqrt3$.` }),
    C({ id: 'k_water', topic: 'geometry', badge: 'bonus', title: 'Water rises when an object is dropped in',
      keywords: 'water level rise displacement tank volume',
      see: [R`"A cube is placed in a rectangular tank of water. How much does the water rise?"`],
      pic: picWater,
      formula: R`$$\Delta h = \frac{V_\text{object}}{\text{base area of tank}}$$`,
      steps: [R`Object volume = volume of water pushed up.`, R`Spread it over the tank's base: divide by base area.`],
      example: { q: R`Cube side $4$ into a $10 \times 8$ tank`, a: [R`$\Delta h = \frac{64}{80} = 0.8$`] } }),
    C({ id: 'k_altitude', topic: 'geometry', badge: 'bonus', title: 'Altitude to the hypotenuse',
      keywords: 'altitude hypotenuse geometric mean similar right triangles',
      see: [R`"In right triangle $ABC$, $\overline{CD}$ is perpendicular to the hypotenuse…"`],
      pic: picAltitude,
      formula: R`$$h^2 = p\cdot q \qquad \text{leg}\cdot\text{leg} = \text{hyp}\cdot h$$`,
      steps: [R`The altitude makes 3 similar right triangles.`, R`$h^2 = p\cdot q$; each leg$^2 =$ (its piece) $\times$ hypotenuse.`],
      example: { q: R`$p = 4,\ q = 9$`, a: [R`$h = \sqrt{36} = 6$`] } }),
    C({ id: 'k_heron', topic: 'geometry', badge: 'bonus', title: 'Area from three sides (Heron)',
      keywords: 'heron formula three sides area semiperimeter',
      see: [R`"A triangle has sides $13$, $14$, $15$. Area?"`],
      formula: R`$$s = \frac{a+b+c}{2} \qquad A = \sqrt{s(s-a)(s-b)(s-c)}$$`,
      steps: [R`$s$ is HALF the perimeter.`, R`Plug in. Inscribed circle radius $r$: $A = r\cdot s$.`],
      example: { q: R`$13, 14, 15$`, a: [R`$s = 21$`, R`$\sqrt{21\cdot8\cdot7\cdot6} = 84$`] } }),
    C({ id: 'k_tilt', topic: 'geometry', badge: 'bonus', title: 'Tilted square inside a square',
      keywords: 'tilted square inscribed square corner triangles',
      see: [R`"A square is inscribed in a larger square…"`],
      pic: picTilt,
      formula: R`$$\text{inner area} = a^2 + b^2$$`,
      steps: [R`The 4 corner right triangles are identical (legs $a$ and $b$).`, R`Inner side $= \sqrt{a^2+b^2}$, inner area $= a^2 + b^2$.`],
      example: { q: R`Big side $7$ split into $3 + 4$`, a: [R`inner area $9 + 16 = 25$`] } }),
    C({ id: 'k_reflect', topic: 'geometry', badge: 'bonus', title: 'Reflections & rotations of a point',
      keywords: 'reflection rotation transformation coordinate point x-axis y-axis y=x 90 degrees',
      see: [R`"Point $(3, 1)$ is reflected across the line $y = x$…"`],
      pic: picReflect,
      formula: [R`$$x\text{-axis}: (x,-y) \quad y\text{-axis}: (-x,y) \quad y=x: (y,x)$$`, R`$$90^\circ\text{ CCW}: (-y,x) \quad 180^\circ: (-x,-y) \quad 90^\circ\text{ CW}: (y,-x)$$`],
      steps: [R`Use the rule, then sanity-check on a sketch with a test point like $(3, 1)$.`],
      example: { q: R`$(3, 1)$ rotated $90^\circ$ counterclockwise`, a: [R`$(-1, 3)$`] } }),
    C({ id: 'k_wall', topic: 'geometry', badge: 'bonus', title: 'Containers with thick walls',
      keywords: 'wall thickness inside volume open box material volume',
      see: [R`"The box has walls $1$ cm thick. Inside volume?"`],
      formula: R`$$V_\text{inside} = (L - 2t)(W - 2t)(H - t) \ \text{(open top)}$$`,
      steps: [R`Subtract $2t$ from length and width (two walls each).`, R`Height: $-t$ if open top, $-2t$ with a lid. Material $=$ outside $-$ inside.`],
      example: { q: R`Open box $10\times8\times6$, $t = 1$`, a: [R`$8\cdot6\cdot5 = 240$`] } }),
    C({ id: 'k_frustum', topic: 'geometry', badge: 'bonus', title: 'Cutting the top off a cone or pyramid',
      keywords: 'frustum cone pyramid cut top similar volume fraction',
      see: [R`"The top third of the cone's height is cut off…"`],
      formula: R`$$\text{top } \tfrac1k \text{ of the height removed} \Rightarrow \text{bottom keeps } 1 - \tfrac{1}{k^3}$$`,
      steps: [R`The small top piece is similar with scale $\frac1k$, so its volume is $\frac1{k^3}$ of the whole.`, R`Bottom piece $=$ whole $-$ top.`],
      example: { q: R`Top half of the height removed`, a: [R`top is $\frac18$ → bottom keeps $\frac78$`] } })
  ];

  window.SAT_FORMULAS = window.SAT_FORMULAS || [];
  window.SAT_FORMULAS.push(...cards);
})();
