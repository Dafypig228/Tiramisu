window.SAT_FORMULAS = [
  // ==================== DESMOS COMPLETE PLAYBOOK ====================
  {
    id: 'dm_bracket',
    topic: 'desmos',
    title: 'Desmos: Bracket System & % Solver',
    math: '$[a, b] \\sim [22.41(b+c),\\; 0.83c]$',
    note: 'Solve multi-equation constants or multi-step % problems simultaneously. Fix one anchor variable (e.g. c=1) and wrap both sides in [ ].',
    trap: 'Never use x, y, e, or i as unknown parameter letters in regressions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="16" width="74" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="13" y="36" font-size="10" font-weight="bold">[a, b] ~</text><text x="13" y="52" font-size="10" font-weight="bold">[eq1, eq2]</text></svg>`
  },
  {
    id: 'dm_const',
    topic: 'desmos',
    title: 'Desmos: Unknown Constants List (~)',
    math: '$x_1=[1,2,3,4,5],\\;\\; \\text{LHS}(x_1)\\sim\\text{RHS}(x_1)$',
    note: 'Identities like (ax+b)(2x-3)=6x^2+cx-12: define x1 list and replace = with ~ to solve a, b, c at once.',
    trap: 'For huge powers (x^14), use small decimals x1=[0.5, 0.7, 0.9] so Desmos does not overflow.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="14" width="74" height="50" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="14" y="34" font-size="10" font-weight="bold">x1=[1,2,3,4]</text><text x="14" y="52" font-size="11" font-weight="bold">L(x1)~R(x1)</text></svg>`
  },
  {
    id: 'dm_equiv',
    topic: 'desmos',
    title: 'Desmos: Equivalent Expressions Overlap',
    math: '$f(x)=\\text{Prompt},\\;\\; g(x)=\\text{Choice}$',
    note: 'Correct answer completely overlaps f(x). For 2-3 variables (x,y,z), set y=2.71 and z=3.19 as prime-decimal sliders.',
    trap: 'Never test multi-var equivalence with 0, 1, or 2 (2+2 = 2*2 = 2^2 causes false ties).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 58 Q45 14 76 58" fill="none" stroke="#9ca3af" stroke-width="4"/><path d="M14 58 Q45 14 76 58" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/><text x="20" y="70" font-size="8">exact overlap</text></svg>`
  },
  {
    id: 'dm_reg',
    topic: 'desmos',
    title: 'Desmos: Table Regressions + f(x) Export',
    math: '$y_1\\sim mx_1+b \\;|\\; ax_1^2+bx_1+c \\;|\\; ab^{x_1}$',
    note: 'Enter points in + Table. Vertex: y1~a(x1-h)^2+k. Circle (3 pts): (x1-h)^2+(y1-k)^2~r^2. Type f(x)=... afterward to keep 15-digit precision.',
    trap: 'Huge x (years 2010,2020) breaks ab^x: shift x to 0, 10! Auto-reg: click ... -> Export custom.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="62" x2="78" y2="62" stroke="#9ca3af"/><line x1="18" y1="12" x2="18" y2="68" stroke="#9ca3af"/><path d="M20 56 Q45 14 74 44" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="28" cy="44" r="2.5"/><circle cx="46" cy="28" r="2.5"/><circle cx="68" cy="40" r="2.5"/></svg>`
  },
  {
    id: 'dm_hybrid',
    topic: 'desmos',
    title: 'Desmos: Constraints & Hybrid Slider',
    math: '$k^2\\sim 25\\{k>0\\} \\;|\\; \\text{slider } j + \\text{regress } k$',
    note: 'Use {k>0} to force positive root. For 2 unknown integers (j,k), make j a step-1 slider, regress k, and step j until k is an integer.',
    trap: 'Regression only finds 1 root; graph y=LHS and y=RHS to see ALL solutions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="28" x2="76" y2="28" stroke="#9ca3af" stroke-width="2"/><circle cx="52" cy="28" r="4.5" fill="#111"/><text x="14" y="54" font-size="10" font-weight="bold">j=1,2.. {k&gt;0}</text></svg>`
  },
  {
    id: 'dm_stats',
    topic: 'desmos',
    title: 'Desmos: repeat(), stats() & Outliers',
    math: '$A=\\text{repeat}(V, F),\\;\\; \\text{stats}(A)$',
    note: 'repeat(values, freq) builds frequency lists! stats(A) gives min, Q1, med, Q3, max. Table weighted mean: total(x1*y1)/total(y1).',
    trap: 'stdev = sample (n-1), stdevp = population (n). Gear -> Duplicate list to test adding/removing outliers.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="10" font-weight="bold">repeat(V,F)</text><text x="10" y="46" font-size="10" font-weight="bold">stats(A)</text><text x="10" y="61" font-size="9">mean · stdevp</text></svg>`
  },
  {
    id: 'dm_seq',
    topic: 'desmos',
    title: 'Desmos: Sequences, Sums & Filters',
    math: '$[1,2...100] \\;|\\; [2^i \\text{ for } i=[1...10]]$',
    note: 'Type sum or prod on keyboard for series! List commands: sort(L), unique(L), join(L1,L2), length(L), L[L>5], L[3].',
    trap: 'Type /, ^, _, sqrt, cbrt, nthroot, abs, pi, sum instead of clicking keypad.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="13" font-weight="bold">Σ · Π</text><text x="12" y="52" font-size="10" font-weight="bold">[3,7...99]</text></svg>`
  },
  {
    id: 'dm_geom',
    topic: 'desmos',
    title: 'Desmos: Geometry, Mod & Percents',
    math: '$\\text{distance}(A,B),\\; \\text{midpoint}(A,B),\\; \\text{polygon}$',
    note: 'Built-in: mod(a,b), gcd(a,b)/gcf, lcm(a,b), nCr(n,r), nPr(n,r), n!, floor, ceil, round, 35% of 240.',
    trap: 'Click circle-fraction icon next to any decimal output to convert to an exact reduced fraction.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="20" y1="54" x2="70" y2="22" stroke="#111" stroke-width="1.6"/><circle cx="20" cy="54" r="2.5"/><circle cx="70" cy="22" r="2.5"/><circle cx="45" cy="38" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },
  {
    id: 'dm_circle',
    topic: 'desmos',
    title: 'Desmos: Instant Circle & Inequalities',
    math: '$\\text{Center}=\\text{midpoint}(A,B),\\; r=\\frac{\\text{distance}(A,B)}{2}$',
    note: 'Type ANY messy circle eq directly. Click leftmost/rightmost (or top/bottom) pts A, B for center & radius. Plot (x,y) dots on inequality overlaps.',
    trap: 'Check dashed (<, >) vs solid (<=, >=) if a test point sits directly on a boundary line.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="25" fill="none" stroke="#111" stroke-width="1.5"/><line x1="20" y1="39" x2="70" y2="39" stroke="#111" stroke-dasharray="3 2"/><circle cx="20" cy="39" r="2.5"/><circle cx="70" cy="39" r="2.5"/><circle cx="45" cy="39" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },
  {
    id: 'dm_solve',
    topic: 'desmos',
    title: 'Desmos: 1-Var Solve, Sliders & Parity',
    math: '$y=\\text{LHS},\\; y=\\text{RHS} \\;|\\; f(-x)=\\pm f(x)$',
    note: 'Click intersection gray dots for x solutions. Add slider k for 0/1/∞ solutions. f(-x)=f(x) is even; f(-x)=-f(x) is odd.',
    trap: 'Direct LHS=RHS vertical lines fail if variable is not x (like p or t): rename var to x and graph y=LHS, y=RHS.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="54" x2="74" y2="20" stroke="#111" stroke-width="1.5"/><line x1="16" y1="22" x2="72" y2="56" stroke="#111" stroke-width="1.5"/><circle cx="44" cy="38" r="3.5" fill="#6b7280"/></svg>`
  },
  {
    id: 'dm_trigmode',
    topic: 'desmos',
    title: 'Desmos: Rad/Deg Check & f\'(x) Bug Fix',
    math: '$\\sin(30)=0.5\\;(\\text{Deg}) \\;|\\; -0.988\\;(\\text{Rad})$',
    note: 'NEVER assume Bluebook default trig mode: click Wrench or test sin(30). For numerical slope, use (f(x+0.0001)-f(x))/0.0001.',
    trap: 'Typing f\'(x) throws an error in ~10% of Bluebook builds.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="36" font-size="10" font-weight="bold">sin(30)=0.5?</text><text x="15" y="52" font-size="9">Wrench: Deg/Rad</text></svg>`
  },

  // ==================== TRIGONOMETRY ====================
  {
    id: 'tr_unit',
    topic: 'trig',
    title: 'Unit Circle + ASTC + Polar Grid',
    math: '$(x, y) = (\\cos\\theta,\\; \\sin\\theta)$',
    note: 'x = cos, y = sin, tan = y/x. ASTC: Q1 All(+), Q2 Sin(+), Q3 Tan(+), Q4 Cos(+). In Desmos: Wrench -> Polar Grid, graph r=1.',
    trap: 'Check quadrant sign first before picking + or - answer.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="8" y1="39" x2="82" y2="39" stroke="#9ca3af"/><line x1="45" y1="6" x2="45" y2="72" stroke="#9ca3af"/><circle cx="45" cy="39" r="26" fill="none" stroke="#111" stroke-width="1.5"/><text x="56" y="26" font-size="10" font-weight="bold">A</text><text x="27" y="26" font-size="10" font-weight="bold">S</text><text x="27" y="57" font-size="10" font-weight="bold">T</text><text x="56" y="57" font-size="10" font-weight="bold">C</text></svg>`
  },
  {
    id: 'tr_angles',
    topic: 'trig',
    title: 'Special Angles + Radians ↔ Degrees',
    math: '$\\text{Rad}=\\text{Deg}\\cdot\\frac{\\pi}{180} \\;|\\; \\pi\\text{ rad}=180^\\circ$',
    note: '30°(pi/6):(√3/2, 1/2) · 45°(pi/4):(√2/2, √2/2) · 60°(pi/3):(1/2, √3/2). Replace pi with 180° to convert radians in 1 sec.',
    trap: 'sin 0°=0, cos 0°=1, sin 90°=1, cos 90°=0, tan 90°=undef.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 64 L76 64 M18 64 L18 10" stroke="#9ca3af"/><path d="M70 64 A52 52 0 0 0 18 12" fill="none" stroke="#111" stroke-width="1.5"/><line x1="18" y1="64" x2="64" y2="38" stroke="#111"/><line x1="18" y1="64" x2="54" y2="27" stroke="#111"/><line x1="18" y1="64" x2="44" y2="18" stroke="#111"/><text x="66" y="38" font-size="8">30°</text><text x="56" y="26" font-size="8">45°</text><text x="45" y="16" font-size="8">60°</text></svg>`
  },
  {
    id: 'tr_soh',
    topic: 'trig',
    title: 'SOH CAH TOA + Slope = tan θ',
    math: '$\\sin=\\frac{\\text{opp}}{\\text{hyp}},\\;\\cos=\\frac{\\text{adj}}{\\text{hyp}},\\;\\tan=\\frac{\\text{opp}}{\\text{adj}}=\\text{slope}$',
    note: 'Trig depends ONLY on angle, not triangle size! If nested right △s share an angle, compute sin/cos/tan from the easiest △.',
    trap: 'Reciprocals: csc=1/sin, sec=1/cos, cot=1/tan.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="16,18 16,60 76,60" fill="none" stroke="#111" stroke-width="1.5"/><rect x="16" y="51" width="9" height="9" fill="none" stroke="#111"/><text x="3" y="42" font-size="8">opp</text><text x="40" y="70" font-size="8">adj</text><text x="46" y="35" font-size="8">hyp</text></svg>`
  },
  {
    id: 'tr_comp',
    topic: 'trig',
    title: 'Complementary Swap (5-Sec Rule)',
    math: '$\\sin A = \\cos B \\iff A + B = 90^\\circ\\;(\\frac{\\pi}{2})$',
    note: 'Whenever sin(x) = cos(90°-x) or sin(A) = cos(B) for acute angles, set A + B = 90° (or pi/2 in radians) and solve!',
    trap: 'Check whether the equation uses degrees or radians.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><text x="22" y="32" font-size="9">B</text><text x="53" y="58" font-size="9">A</text></svg>`
  },
  {
    id: 'tr_id',
    topic: 'trig',
    title: 'Pythagorean, Quotient & 180° Rules',
    math: '$\\sin^2\\theta+\\cos^2\\theta=1 \\;|\\; \\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta} \\;|\\; \\cos(180^\\circ-\\theta)=-\\cos\\theta$',
    note: 'sin(180°-x)=sin(x). Coterminal: add/subtract 2pi (or pi for tan). Given sin x, draw a right △ to get cos/tan fast.',
    trap: 'In obtuse angles (90° to 180°), cos and tan are NEGATIVE.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="3 2"/><path d="M45 11 A28 28 0 1 1 20 26" fill="none" stroke="#111" stroke-width="1.6"/><polygon points="18,22 24,25 19,30" fill="#111"/><text x="34" y="43" font-size="10">+2πk</text></svg>`
  },
  {
    id: 'tr_laws',
    topic: 'trig',
    title: 'Trig Triangle Area, Sines & Cosines',
    math: '$A=\\frac{1}{2}ab\\sin C \\;|\\; c^2=a^2+b^2-2ab\\cos C$',
    note: 'Area from 2 sides + included angle: 1/2 ab sin C. Law of Sines: a/sin A = b/sin B = c/sin C.',
    trap: 'Angle C MUST be strictly between sides a and b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,60 32,16 78,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="19" y="40" font-size="9">a</text><text x="44" y="70" font-size="9">b</text><text x="23" y="56" font-size="9">C</text></svg>`
  },

  // ==================== CIRCLES ====================
  {
    id: 'c_std',
    topic: 'circles',
    title: 'Circle Basics & Standard Form',
    math: '$(x-h)^2+(y-k)^2=r^2 \\;|\\; A=\\pi r^2 \\;|\\; C=2\\pi r$',
    note: 'Center (h,k) flips signs from equation; radius r = sqrt(RHS). Tangent to x-axis -> r=|k|; tangent to y-axis -> r=|h|.',
    trap: 'Trap: question gives diameter d instead of r, or asks for r instead of r².',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="50" x2="80" y2="50" stroke="#9ca3af"/><line x1="32" y1="10" x2="32" y2="70" stroke="#9ca3af"/><circle cx="52" cy="34" r="20" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="52" cy="34" r="2"/><line x1="52" y1="34" x2="72" y2="34" stroke="#111" stroke-dasharray="2 2"/><text x="45" y="46" font-size="8">(h,k)</text></svg>`
  },
  {
    id: 'c_eq',
    topic: 'circles',
    title: 'Zero-Work Completing the Square',
    math: '$x^2+Dx+y^2+Ey+F=0 \\implies C=(-\\frac{D}{2},-\\frac{E}{2})$',
    note: 'Radius squared: r² = (D/2)² + (E/2)² - F. Divide entire equation by leading coefficient first if x²,y² have coeff != 1!',
    trap: 'Or just type equation directly into Desmos and read endpoints.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="45" cy="39" r="2.2"/><text x="21" y="34" font-size="8">(-D/2,-E/2)</text></svg>`
  },
  {
    id: 'c_arc',
    topic: 'circles',
    title: 'Arc, Sector & Segment (Deg & Rad)',
    math: '$s=r\\theta,\\; A_{\\text{sec}}=\\frac{1}{2}r^2\\theta \\;|\\; \\frac{\\theta}{360^\\circ}(2\\pi r,\\;\\pi r^2)$',
    note: 'Use (θ/360) for degrees; use s=rθ and A=1/2 r²θ for radians! Circular segment area = Sector - Triangle = 1/2 r²(θ - sin θ).',
    trap: 'Arc length uses 2pi r; sector area uses pi r².',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#9ca3af"/><path d="M45 39 L68 21 A29 29 0 0 0 22 21 Z" fill="rgba(0,0,0,0.06)" stroke="#111" stroke-width="1.4"/><path d="M22 21 A29 29 0 0 1 68 21" fill="none" stroke="#111" stroke-width="2.6"/><text x="41" y="29" font-size="10">θ</text></svg>`
  },
  {
    id: 'c_annulus',
    topic: 'circles',
    title: 'Concentric Ring (Tangent Chord)',
    math: '$A_{\\text{ring}}=\\pi(R^2-r^2)=\\pi\\left(\\frac{L}{2}\\right)^2$',
    note: 'If chord L of outer circle is tangent to inner circle, ring area is ALWAYS pi(L/2)²—you do not need either radius!',
    trap: 'Use half the chord (L/2), not L.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="rgba(0,0,0,0.1)" stroke="#111" stroke-width="1.4"/><circle cx="45" cy="39" r="15" fill="#fff" stroke="#111" stroke-width="1.4"/><line x1="21" y1="24" x2="69" y2="24" stroke="#111" stroke-width="1.6"/><text x="42" y="20" font-size="9">L</text></svg>`
  },
  {
    id: 'c_power',
    topic: 'circles',
    title: 'Power of a Point (Chords/Secants)',
    math: '$ab=cd \\;|\\; O_1W_1=O_2W_2 \\;|\\; t^2=O\\cdot W$',
    note: 'Intersecting chords: part*part = part*part. Two secants: Out*Whole = Out*Whole. Tangent+secant: Tangent² = Out*Whole.',
    trap: 'Whole = Outside + Inside, NOT just the inside segment!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="34" cy="39" r="22" fill="none" stroke="#111" stroke-width="1.4"/><line x1="34" y1="17" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><line x1="16" y1="48" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><text x="58" y="26" font-size="9">t</text></svg>`
  },
  {
    id: 'c_angles',
    topic: 'circles',
    title: 'Inscribed, Thales 90° & Cyclic Quad',
    math: '$\\text{Central}=2\\cdot\\text{Inscribed} \\;|\\; A+C=180^\\circ$',
    note: 'Inscribed angles sharing same arc are equal. Thales: triangle inscribed on diameter = 90°. Cyclic quad (4 pts on circle): opp angles sum to 180°.',
    trap: 'Verify vertex lies ON the circle circumference.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 45,39 70,50" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 19,52 70,50" fill="none" stroke="#111" stroke-width="1.3"/><text x="48" y="42" font-size="9">2x</text><text x="27" y="50" font-size="9">x</text></svg>`
  },
  {
    id: 'c_chords',
    topic: 'circles',
    title: 'Chord Bisector & 60°/90°/120° Chords',
    math: '$60^\\circ\\to r,\\;\\; 90^\\circ\\to r\\sqrt{2},\\;\\; 120^\\circ\\to r\\sqrt{3}$',
    note: 'Perpendicular from center to chord ALWAYS bisects the chord (making a right △ with r as hyp). 120° chord sits r/2 from center.',
    trap: '2 radii + any chord always form an isosceles triangle.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="39" x2="20" y2="23" stroke="#111" stroke-width="1.4"/><line x1="45" y1="39" x2="70" y2="23" stroke="#111" stroke-width="1.4"/><line x1="20" y1="23" x2="70" y2="23" stroke="#111" stroke-width="1.4"/><line x1="45" y1="39" x2="45" y2="23" stroke="#111" stroke-dasharray="2 2"/><text x="42" y="19" font-size="8">L</text></svg>`
  },
  {
    id: 'c_tangents',
    topic: 'circles',
    title: 'Tangent ⊥ Radius & 2 Tangents',
    math: '$PA=PB,\\;\\; \\angle OAP=\\angle OBP=90^\\circ$',
    note: 'Radius to tangency point is ALWAYS 90° to tangent. Two tangents from external P are equal; central angle + angle P = 180°.',
    trap: 'Connect O to P to form 2 congruent right triangles.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="32" cy="39" r="18" fill="none" stroke="#111" stroke-width="1.4"/><line x1="32" y1="39" x2="40" y2="23" stroke="#111"/><line x1="32" y1="39" x2="40" y2="55" stroke="#111"/><line x1="40" y1="23" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><line x1="40" y1="55" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><text x="79" y="42" font-size="9">P</text></svg>`
  },

  // ==================== TRIANGLES, POLYGONS & COORDINATES ====================
  {
    id: 't_basic',
    topic: 'triangles',
    title: 'Triangle Sum, Exterior & Inequality',
    math: '$a+b+c=180^\\circ \\;|\\; x=a+b \\;|\\; |a-b|<c<a+b$',
    note: 'Inside angles sum to 180°. Exterior angle equals sum of the two opposite interior angles. Sum of any 2 sides > 3rd side.',
    trap: 'Isosceles trap: check whether given angle is the vertex or a base angle!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 36,16 58,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="58" y1="58" x2="82" y2="58" stroke="#111" stroke-width="1.5"/><text x="22" y="54" font-size="9">a</text><text x="34" y="31" font-size="9">b</text><text x="64" y="54" font-size="9">x</text></svg>`
  },
  {
    id: 't_pyth',
    topic: 'triangles',
    title: 'Pythagorean Triples & GCF Reduce',
    math: '$a^2+b^2=c^2$',
    note: 'Triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 9-40-41 (& multiples). Divide legs by GCF first, solve small △, multiply back!',
    trap: '24 and 21 -> ÷3 -> 8 and 7 -> hyp = 3√113!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 74,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="7" y="42" font-size="9">a</text><text x="44" y="72" font-size="9">b</text><text x="48" y="36" font-size="9">c</text></svg>`
  },
  {
    id: 't_special',
    topic: 'triangles',
    title: '30-60-90, 45-45-90 & Reverse Hacks',
    math: '$x,x\\sqrt{3},2x \\;|\\; x,x,x\\sqrt{2}$',
    note: '45-45-90 hyp d -> leg d√2/2, Area = d²/4. 30-60-90 long leg L -> short leg L√3/3. Square diag d = s√2 -> Area = d²/2.',
    trap: 'Perimeter A + A√2 in 45-45-90 means hypotenuse = A.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,12 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="2" y="40" font-size="9">x√3</text><text x="42" y="72" font-size="9">x</text><text x="48" y="34" font-size="9">2x</text></svg>`
  },
  {
    id: 't_chase',
    topic: 'triangles',
    title: 'Angle-Chasing & Altitude Geom Mean',
    math: '$h^2=pq,\\;\\; a^2=pc,\\;\\; b^2=qc,\\;\\; ab=ch$',
    note: 'Label right-△ angles α and 90°-α to spot instant similar triangles. Altitude h to hyp c splits c into p (by a) and q (by b).',
    trap: 'ab = ch finds altitude h in 2 seconds from area equality.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 34,18 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="34" y1="18" x2="34" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="36" y="44" font-size="9">h</text><text x="22" y="68" font-size="8">p</text><text x="53" y="68" font-size="8">q</text></svg>`
  },
  {
    id: 't_equi',
    topic: 'triangles',
    title: 'Equilateral △, Hexagon & Inscribed Circles',
    math: '$A_\\triangle=\\frac{s^2\\sqrt{3}}{4},\\;h=\\frac{s\\sqrt{3}}{2},\\;A_{\\text{hex}}=\\frac{3\\sqrt{3}}{2}s^2$',
    note: 'Equilateral △: circumradius R=s/√3, inradius r=s/(2√3) (R=2r). Square(s) in circle(r): s=r√2, A=2r². Circle in square(s): r=s/2.',
    trap: 'Hexagon long diagonal = 2s, short diagonal = s√3.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="43" r="27" fill="none" stroke="#9ca3af"/><circle cx="45" cy="43" r="13.5" fill="none" stroke="#9ca3af"/><polygon points="45,16 22,56 68,56" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="16" x2="45" y2="56" stroke="#111" stroke-dasharray="2 2"/><text x="26" y="38" font-size="9">s</text><text x="47" y="42" font-size="9">h</text></svg>`
  },
  {
    id: 't_area',
    topic: 'triangles',
    title: 'Area, Heron, Shared Height & Bisector',
    math: '$A=\\frac{1}{2}bh=\\sqrt{s(s-a)(s-b)(s-c)}=r_{\\text{in}}s$',
    note: 'Heron: s=(a+b+c)/2. Triangles sharing height/vertex: Area1/Area2 = Base1/Base2! Angle bisector: side1/side2 = seg1/seg2.',
    trap: 'Make sure height is perpendicular to the chosen base.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 42,16 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="42" y1="16" x2="50" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="27" y="68" font-size="8">b1</text><text x="60" y="68" font-size="8">b2</text></svg>`
  },
  {
    id: 't_quad',
    topic: 'triangles',
    title: 'Trapezoid, Kite & Tilted Square',
    math: '$A_{\\text{trap}}=\\frac{b_1+b_2}{2}h \\;|\\; A_{\\perp\\text{diag}}=\\frac{d_1d_2}{2} \\;|\\; A_{\\text{tilt}}=a^2+b^2$',
    note: 'Trapezoid Midsegment = (b1+b2)/2 -> A = Mid*h. Parallelogram: A = bh = ab sin θ. Tilted square inside square: 4 congruent corner △s (a,b).',
    trap: 'Rhombus & Kite both use d1*d2/2 because diagonals are perpendicular.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="52" height="52" fill="none" stroke="#9ca3af"/><polygon points="34,14 70,30 54,66 18,50" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/><text x="23" y="21" font-size="8">a</text><text x="11" y="34" font-size="8">b</text></svg>`
  },
  {
    id: 't_poly',
    topic: 'triangles',
    title: 'Polygons, Exterior & Zig-Zag Parallel',
    math: '$180^\\circ(n-2) \\;|\\; \\text{Ext}=\\frac{360^\\circ}{n} \\;|\\; \\text{Diags}=\\frac{n(n-3)}{2}$',
    note: 'Fastest regular interior angle: 180° - 360°/n. Parallel lines create only 2 angle sizes (sum 180°). Zig-zag: Σ Left = Σ Right.',
    trap: 'Exterior angle sum is ALWAYS 360° for any convex polygon.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="18" x2="78" y2="18" stroke="#111" stroke-width="1.5"/><line x1="12" y1="60" x2="78" y2="60" stroke="#111" stroke-width="1.5"/><polyline points="30,18 58,39 28,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="61" y="42" font-size="8">L=R</text></svg>`
  },
  {
    id: 't_sim',
    topic: 'triangles',
    title: 'Similarity, Congruence & k, k², k³',
    math: '$\\text{Scale}=k \\implies \\text{Area}=k^2 \\implies \\text{Vol}=k^3$',
    note: 'Parallel cut in △: side pieces top/bot = top/bot; bases small/BIG = top/WHOLE. Congruence: SSS, SAS, ASA, AAS, HL.',
    trap: 'AAA and SSA do NOT prove congruence.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="8,58 22,18 38,58" fill="none" stroke="#111" stroke-width="1.4"/><polygon points="50,58 64,18 80,58" fill="none" stroke="#111" stroke-width="1.4"/><text x="41" y="42" font-size="10">~</text></svg>`
  },
  {
    id: 't_coord',
    topic: 'triangles',
    title: 'Distance, Midpoint, Shoelace & Box',
    math: '$d=\\sqrt{\\Delta x^2+\\Delta y^2} \\;|\\; A=\\frac{1}{2}|x_1y_2-x_2y_1|$',
    note: 'Midpoint = ((x1+x2)/2, (y1+y2)/2). Shoelace: shift 1 vertex to (0,0) first! Or Box Method: enclosing rect minus 3 corner △s.',
    trap: 'Do not forget the 1/2 in Shoelace!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="14" width="58" height="48" fill="none" stroke="#9ca3af" stroke-dasharray="3 2"/><polygon points="16,32 74,14 54,62" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 't_trans',
    topic: 'triangles',
    title: 'All 7 Coordinate Reflections & Rotations',
    math: '$(x,y)\\xrightarrow{y=x}(y,x) \\;|\\; \\xrightarrow{90^\\circ\\text{CCW}}(-y,x)$',
    note: 'Reflect x-axis:(x,-y), y-axis:(-x,y), y=x:(y,x), y=-x:(-y,-x). Rotate 90°CCW/270°CW:(-y,x), 180°:(-x,-y), 90°CW/270°CCW:(y,-x).',
    trap: 'Reflecting across y=x is the exact rule for inverse functions f⁻¹(x).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#9ca3af"/><line x1="45" y1="8" x2="45" y2="70" stroke="#9ca3af"/><path d="M62 22 A24 24 0 0 0 28 22" fill="none" stroke="#111" stroke-width="1.5"/><polygon points="26,24 31,20 32,26" fill="#111"/><text x="35" y="16" font-size="8">90°CCW</text></svg>`
  },

  // ==================== ALGEBRA & NUMBER THEORY ====================
  {
    id: 'a_slope',
    topic: 'algebra',
    title: 'Linear Eq Basics & Word Translation',
    math: '$m=\\frac{y_2-y_1}{x_2-x_1},\\;\\; y=mx+b,\\;\\; y-y_1=m(x-x_1)$',
    note: 'm = rate ("per", "each", "every"), b = start/fixed fee ("at t=0"). Parallel: m1=m2. Perp: m1·m2=-1. Horiz y=c (m=0), Vert x=c (undef).',
    trap: 'If table x jumps by 3 and y by 12, slope is 12/3 = 4, NOT 12.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="58" x2="78" y2="58" stroke="#9ca3af"/><line x1="26" y1="10" x2="26" y2="68" stroke="#9ca3af"/><line x1="14" y1="52" x2="74" y2="18" stroke="#111" stroke-width="1.6"/><text x="46" y="28" font-size="9">m</text><text x="15" y="43" font-size="9">b</text></svg>`
  },
  {
    id: 'a_lines',
    topic: 'algebra',
    title: 'Standard Form, Δy Leapfrog & Pt Dist',
    math: '$Ax+By=C \\implies \\Delta y=-\\frac{A}{B}\\Delta x,\\;\\; d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$',
    note: 'Slope m=-A/B, x-int=C/A, y-int=C/B. Perp line: Bx-Ay=D. Perp bisector: midpoint + negative reciprocal slope.',
    trap: '"Increase in x per +1 y" -> flip slope 1/m!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="58" x2="74" y2="16" stroke="#111" stroke-width="1.5"/><circle cx="32" cy="24" r="2.5"/><line x1="32" y1="24" x2="43" y2="39" stroke="#111" stroke-dasharray="2 2"/><text x="41" y="31" font-size="9">d</text></svg>`
  },
  {
    id: 'a_sys',
    topic: 'algebra',
    title: 'Systems (0/1/∞ Ratios) & Add Down',
    math: '$\\frac{a_1}{a_2}=\\frac{b_1}{b_2}\\ne\\frac{c_1}{c_2}\\;(0\\text{ sol}) \\;|\\; \\text{Add/Sub eqs}$',
    note: 'All ratios equal = ∞ sols; slopes unequal = 1 sol. 1-var Ax+B=Cx+D: A=C & B≠D (0 sol), A=C & B=D (∞ sol). Swapped coeffs: add/sub straight down!',
    trap: 'Before solving for x and y separately, check if adding equations gives x+y or 5x+5y directly.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="56" x2="66" y2="16" stroke="#111" stroke-width="1.5"/><line x1="28" y1="62" x2="78" y2="22" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_abs',
    topic: 'algebra',
    title: 'Abs Value Bounds & Sum Shortcut',
    math: '$|x-c|\\le r,\\; c=\\frac{a+b}{2},\\; r=\\frac{b-a}{2} \\;|\\; \\text{Sum}=-\\frac{2b}{a}$',
    note: '|x-c| < r means inside (c-r, c+r); > r means outside. Sum of solutions to |ax+b|=k (k>0) is ALWAYS -2b/a!',
    trap: '|ax+b| = negative has 0 solutions; = 0 has 1 solution.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="54" x2="78" y2="54" stroke="#9ca3af"/><polyline points="18,18 45,54 72,18" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'a_chunk',
    topic: 'algebra',
    title: 'Whole-Chunk, Flip & Input-Match',
    math: '$\\frac{2}{a}=\\frac{3}{4}\\implies\\frac{a}{2}=\\frac{4}{3} \\;|\\; f(2x-1)=6x+5$',
    note: 'Don\'t solve for x if chunk repeats (5x-3=17 -> 10x-1=2(17)+5). For f(7) given f(2x-1): set 2x-1=7 -> x=4 -> plug 4 into RHS!',
    trap: 'Double-decker fractions: (a/b)/c = a/(bc); a/(b/c) = ac/b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="18" width="70" height="42" rx="6" fill="none" stroke="#111" stroke-width="1.4"/><text x="16" y="36" font-size="10" font-weight="bold">2/a = 3/4</text><text x="16" y="52" font-size="10" font-weight="bold">a/2 = 4/3</text></svg>`
  },
  {
    id: 'a_id',
    topic: 'algebra',
    title: 'Core Algebraic Identities',
    math: '$x^2-y^2=(x+y)(x-y) \\;|\\; x^2+y^2=(x+y)^2-2xy$',
    note: 'Also: (x-y)² + 2xy = x²+y², and (x+y)² - (x-y)² = 4xy. Disguised SAT trick: given x²-y²=40 & x-y=4 -> x+y=10 instantly.',
    trap: '(x+y)² is NEVER x²+y²—never drop the middle 2xy!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="48" height="48" fill="none" stroke="#111" stroke-width="1.5"/><rect x="46" y="14" width="20" height="20" fill="rgba(0,0,0,0.12)" stroke="#111"/></svg>`
  },
  {
    id: 'a_fact',
    topic: 'algebra',
    title: 'Cubes (SOAP), Remainder & Coeff Sums',
    math: '$a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2) \\;|\\; \\text{Rem}=P(a)$',
    note: 'SOAP = Same, Opposite, Always +. P(x)÷(ax-b) -> rem P(b/a). Factor (x-a) -> P(a)=0. Coeff sum = P(1), constant = P(0), alt sum = P(-1).',
    trap: 'True for all x -> group like powers and match every coefficient.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">Rem = P(a)</text><text x="12" y="51" font-size="10">Sum coeff: P(1)</text></svg>`
  },
  {
    id: 'a_partial',
    topic: 'algebra',
    title: 'Heaviside Cover-Up, Holes & Asymptotes',
    math: '$\\frac{5x+11}{(x-1)(x+3)}=\\frac{A}{x-1}+\\frac{B}{x+3}$',
    note: 'Cover (x-1) & plug x=1 -> A=16/4=4; cover (x+3) & plug x=-3 -> B=-4/-4=1! Horiz asym: BOBO (y=0), BOTN (none), EATS DC.',
    trap: 'Canceled common factor = HOLE, not vertical asymptote or solution!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="10" x2="45" y2="68" stroke="#9ca3af" stroke-dasharray="3 2"/><line x1="10" y1="39" x2="80" y2="39" stroke="#9ca3af" stroke-dasharray="3 2"/><path d="M14 34 Q40 32 42 12" fill="none" stroke="#111" stroke-width="1.5"/><path d="M48 66 Q50 46 76 44" fill="none" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_exp',
    topic: 'algebra',
    title: 'Exponent Laws, Base Match & √x²',
    math: '$a^m a^n=a^{m+n},\\; a^{-n}=\\frac{1}{a^n},\\; a^{m/n}=\\sqrt[n]{a^m},\\; \\sqrt{x^2}=|x|$',
    note: 'Rewrite 4, 8, 27 as prime powers (8^x/2^y = 2^(3x-y)). Split factors: 2^(x+3)-2^x = 7(2^x). (a^m)^n = a^(mn), a^0 = 1.',
    trap: '(-3)² = 9, but -3² = -9.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="34" font-size="12" font-weight="bold">x^(m/n)</text><text x="12" y="54" font-size="11" font-weight="bold">√(x²) = |x|</text></svg>`
  },
  {
    id: 'a_rad',
    topic: 'algebra',
    title: 'Radical Conjugates & Extraneous Roots',
    math: '$\\frac{c}{a+\\sqrt{b}}\\cdot\\frac{a-\\sqrt{b}}{a-\\sqrt{b}}=\\frac{c(a-\\sqrt{b})}{a^2-b}$',
    note: 'Isolate radical before squaring both sides. Always plug answers back into the ORIGINAL radical/rational equation!',
    trap: '√x = -4 has NO real solution (principal square root is >= 0).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="11" font-weight="bold">a + √b</text><text x="10" y="52" font-size="10">× (a - √b)</text></svg>`
  },
  {
    id: 'a_seq',
    topic: 'algebra',
    title: 'Sequences, Series & AM-GM Min',
    math: '$S_n=\\frac{n}{2}(a_1+a_n) \\;|\\; a_1\\frac{1-r^n}{1-r} \\;|\\; \\min\\left(ax+\\frac{b}{x}\\right)=2\\sqrt{ab}$',
    note: 'Arith: a_n = a1+(n-1)d. Geom: a_n = a1·r^(n-1). For x>0, ax + b/x is minimized at 2√(ab) when ax = b/x.',
    trap: 'Verify whether sequence starts at n=0 or n=1!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="18" cy="54" r="3"/><circle cx="36" cy="44" r="3"/><circle cx="54" cy="30" r="3"/><circle cx="72" cy="14" r="3"/><path d="M18 54 Q45 40 72 14" fill="none" stroke="#111" stroke-dasharray="2 2"/></svg>`
  },
  {
    id: 'a_num',
    topic: 'algebra',
    title: 'Parity, Remainders & Units Cycles',
    math: '$n=dq+r \\;|\\; \\text{Units cycle: } \\text{mod}(\\text{exp}, 4)$',
    note: 'Factor of an odd number MUST be odd (Odd×Odd=Odd). Div 3/9: digit sum. Div 4: last 2 digits. Units cycle rem 0 uses a^4. Consec ints: Mean=Med.',
    trap: 'Even ± Odd = Odd; Odd ± Odd = Even; Even × Anything = Even.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">n = dq + r</text><text x="12" y="52" font-size="10">mod(exp, 4)</text></svg>`
  },

  // ==================== QUADRATICS & FUNCTIONS ====================
  {
    id: 'q_forms',
    topic: 'quadratics',
    title: 'All 3 Quadratic Forms + Symmetry',
    math: '$x_v=-\\frac{b}{2a}=\\frac{p+q}{2}=\\frac{m+n}{2}\\;(f(m)=f(n))$',
    note: 'Standard ax²+bx+c: y-int c. Vertex a(x-h)²+k: min/max k, root sum 2h! Factored a(x-p)(x-q): roots p,q.',
    trap: '"Minimum value" means the y-coordinate k, NOT h!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 16 Q45 76 74 16" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="46" r="2.5"/><line x1="25" y1="30" x2="65" y2="30" stroke="#9ca3af" stroke-dasharray="2 2"/><text x="33" y="61" font-size="9">(h,k)</text></svg>`
  },
  {
    id: 'q_vieta',
    topic: 'quadratics',
    title: 'Vieta (Quad & Cubic) + Root Shifts',
    math: '$\\text{Sum}=-\\frac{b}{a},\\;\\text{Prod}=\\frac{c}{a} \\;|\\; f(x-h)\\implies S+nh$',
    note: 'Cubic ax³+bx²+cx+d: sum=-b/a, pairwise=c/a, prod=-d/a. Shift f(x-h)=0 adds h to all n roots; f(kx)=0 divides root sum by k.',
    trap: 'Check b²-4ac >= 0 if prompt asks for sum of REAL solutions!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="50" x2="78" y2="50" stroke="#9ca3af"/><path d="M18 22 Q45 76 72 22" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="29" cy="50" r="2.5"/><circle cx="61" cy="50" r="2.5"/><text x="23" y="65" font-size="8">r1</text><text x="57" y="65" font-size="8">r2</text></svg>`
  },
  {
    id: 'q_disc',
    topic: 'quadratics',
    title: 'Discriminant, Tangent & Max-b (0 Sol)',
    math: '$D=b^2-4ac \\;|\\; \\text{No real sol: } b < 2\\sqrt{ac}$',
    note: 'D>0 (2 sols), D=0 (1 sol/tangent), D<0 (0 real sols). Line tangent to parabola: set equal -> set D=0. For -x²+bx-k²=0 (0 sol): max int b=2k-1.',
    trap: 'Take the largest integer STRICTLY less than 2√(ac).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 16 Q45 70 72 16" fill="none" stroke="#111" stroke-width="1.5"/><line x1="14" y1="43" x2="76" y2="43" stroke="#111" stroke-dasharray="3 2"/><circle cx="45" cy="43" r="2.5"/><text x="24" y="62" font-size="8">tangent D=0</text></svg>`
  },
  {
    id: 'q_maxb',
    topic: 'quadratics',
    title: 'Factoring Max b & Max ac Cheats',
    math: '$b_{\\max}=ac+1 \\;|\\; b_{\\max}(c<0)=a|c|-1 \\;|\\; (ac)_{\\max}=\\lfloor\\frac{b^2}{4}\\rfloor$',
    note: 'Positive integer factors (px+q)(rx+s): max b is ac+1. Given b (e.g. ax²+148x+c): max ac is (b/2)² if b even, (b²-1)/4 if b odd.',
    trap: 'Check if factor coefficients must be positive or can be negative.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="31" font-size="10" font-weight="bold">max b = ac+1</text><text x="10" y="52" font-size="10" font-weight="bold">max ac = b²/4</text></svg>`
  },
  {
    id: 'q_nosol',
    topic: 'quadratics',
    title: 'Squared-Term, Hole & Quad Ineq Traps',
    math: '$-(3x-7)^2=p+17 \\implies p+17>0 \\text{ (0 sol)}$',
    note: 'Negative square <=0, so right side >0 gives 0 sols. Quad ineq (a>0): >0 OUTSIDE roots, <0 BETWEEN roots. Hole (x-3)/(x-k)=0 at k=3 gives 0 sols.',
    trap: '4x²+bx-45=(hx+k)(x+j): kj=-45 (odd!) -> k,j both odd -> b is odd!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="30" x2="80" y2="30" stroke="#9ca3af"/><path d="M16 62 Q45 14 74 62" fill="none" stroke="#111" stroke-width="1.5"/><text x="18" y="22" font-size="9">p+17 &gt; 0</text></svg>`
  },
  {
    id: 'q_shift',
    topic: 'quadratics',
    title: 'Shifts, Flips, |f(x)| & Inverse f⁻¹(7)',
    math: '$f(x-h)+k \\;|\\; f^{-1}(7)\\iff f(x)=7 \\;|\\; \\frac{x-b}{m}$',
    note: 'Inside x: - goes RIGHT, + goes LEFT. -f(x) flips x-axis; f(-x) flips y-axis; |f(x)| bounces negative y up. Linear f(x)=mx+b -> f⁻¹(x)=(x-b)/m.',
    trap: 'f(bx) shrinks horizontally by 1/b; af(x) stretches vertically by a.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 54 Q32 16 50 54" fill="none" stroke="#9ca3af" stroke-dasharray="2 2"/><path d="M34 46 Q52 8 70 46" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'q_expfn',
    topic: 'quadratics',
    title: 'Exp y-Int Trap & Poly Multiplicity',
    math: '$y=a\\cdot b^{x-h}+k \\implies y_{\\text{int}}=a\\cdot b^{-h}+k$',
    note: 'Exponential horiz asymptote is y=k; y-int is NOT a when shifted! Polynomial (x-r)^even BOUNCES off x-axis; odd CROSSES. Max turns = deg-1.',
    trap: 'Even-degree polynomial ends go same direction; odd go opposite.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="54" x2="80" y2="54" stroke="#9ca3af" stroke-dasharray="3 2"/><path d="M14 52 Q52 50 74 14" fill="none" stroke="#111" stroke-width="1.6"/><text x="52" y="64" font-size="8">y = k</text></svg>`
  },

  // ==================== PERCENTAGES, RATES & GROWTH ====================
  {
    id: 'p_pct',
    topic: 'percent',
    title: 'Percent Forward/Back & "BY vs TO" Trap',
    math: '$\\%\\Delta=\\frac{\\text{New}-\\text{Old}}{\\text{Old}}\\cdot 100,\\;\\; \\text{Old}=\\frac{\\text{New}}{1\\pm p}$',
    note: '200% OF / TO B = 2B. Increases BY 200% / GREATER THAN B = 3B! No number given? Plug in 100.',
    trap: 'Going backward from after-discount price? DIVIDE by (1-p), NEVER multiply by (1+p)!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">Old → New</text><text x="14" y="52" font-size="10">Back: ÷(1±p)</text></svg>`
  },
  {
    id: 'p_succ',
    topic: 'percent',
    title: 'Successive % & (+p%, -p%) Instant Loss',
    math: '$(1+r_1)(1+r_2)-1 \\;|\\; +p\\%,-p\\%=-\\left(\\frac{p}{10}\\right)^2\\%$',
    note: 'Multiply multipliers! +20% then -20% = 1.2×0.8 = 0.96 = -4% (or -(20/10)² = -4%). +30%, -30% = -9%.',
    trap: 'Never just add or subtract percentages.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="10" font-weight="bold">+p%, -p%</text><text x="10" y="52" font-size="11" font-weight="bold">-(p/10)² %</text></svg>`
  },
  {
    id: 'p_exp',
    topic: 'percent',
    title: 'Growth Cycles & Period Conversion',
    math: '$y=a(1\\pm r)^{t/n} \\;|\\; 1+r_{\\text{full}}=(1+r_{\\text{sub}})^k$',
    note: 'Doubles every n hrs -> a·2^(t/n); half-life -> a·(0.5)^(t/n). Quarterly 3% -> annual (1.03)^4 - 1 = 12.55%.',
    trap: 'Monthly 5% is NOT 60% annual: it is (1.05)^12 - 1!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q46 56 72 16" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="72" y2="26" stroke="#9ca3af" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'p_int',
    topic: 'percent',
    title: 'Simple vs Compound Interest & Exp Beat',
    math: '$I=Prt \\;|\\; A=P\\left(1+\\frac{r}{n}\\right)^{nt}$',
    note: 'Simple interest adds constant Pr each year (linear). Compound multiplies each period. Exponential (b>1) ALWAYS eventually overtakes linear!',
    trap: 'Read whether question asks for total balance A or interest earned I = A - P.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q48 56 74 14" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="74" y2="30" stroke="#9ca3af" stroke-width="1.4"/></svg>`
  },
  {
    id: 'p_rates',
    topic: 'percent',
    title: 'Harmonic Speed, Work & Variation',
    math: '$v_{\\text{avg}}=\\frac{2ab}{a+b} \\;|\\; T=\\frac{t_1t_2}{t_1+t_2} \\;|\\; x_1y_1=x_2y_2$',
    note: 'Equal-distance round trip speed = 2ab/(a+b). Combined work = t1·t2/(t1+t2). Direct: y=kx (y1/x1=y2/x2); Inverse: y=k/x (x1y1=x2y2).',
    trap: 'Avg speed of 30 mph there and 50 mph back is 37.5, NOT 40!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 32 H70 L62 24 M74 48 H20 L28 56" fill="none" stroke="#111" stroke-width="1.5"/><text x="30" y="23" font-size="9">a</text><text x="48" y="65" font-size="9">b</text></svg>`
  },
  {
    id: 'p_units',
    topic: 'percent',
    title: 'Unit Power Trap (ft²/ft³) & Density',
    math: '$1\\text{ yd}^2 = 3^2\\text{ ft}^2 \\;|\\; 1\\text{ m}^3 = 100^3\\text{ cm}^3 \\;|\\; \\rho=\\frac{m}{V}$',
    note: 'Always square linear conversion factor for area, cube it for volume! Density = Mass / Volume.',
    trap: 'Never multiply ft² by 12 to get in²—multiply by 144 (12²)!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="20" width="36" height="36" fill="none" stroke="#111" stroke-width="1.5"/><line x1="30" y1="20" x2="30" y2="56" stroke="#9ca3af"/><line x1="42" y1="20" x2="42" y2="56" stroke="#9ca3af"/><line x1="18" y1="32" x2="54" y2="32" stroke="#9ca3af"/><line x1="18" y1="44" x2="54" y2="44" stroke="#9ca3af"/><text x="58" y="42" font-size="9">k²</text></svg>`
  },

  // ==================== 3D VOLUME & SURFACE ====================
  {
    id: 'v_solids',
    topic: 'volume',
    title: 'All 3D Volumes & Surface Areas',
    math: '$SA_{\\text{cyl}}=2\\pi r^2+2\\pi rh \\;|\\; SA_{\\text{cone}}=\\pi r^2+\\pi rl \\;|\\; SA_{\\text{sph}}=4\\pi r^2$',
    note: 'Volumes: cube s³, prism lwh, cyl πr²h, cone 1/3 πr²h, sph 4/3 πr³, pyr 1/3 s²h. SA NOT on sheet! Cone slant l=√(r²+h²); cube 6s²; pyr s²+2sl.',
    trap: 'Check for "open top" or "lateral surface area only" (no base).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><ellipse cx="45" cy="20" rx="18" ry="6" fill="none" stroke="#111" stroke-width="1.3"/><line x1="27" y1="20" x2="27" y2="54" stroke="#111"/><line x1="63" y1="20" x2="63" y2="54" stroke="#111"/><ellipse cx="45" cy="54" rx="18" ry="6" fill="none" stroke="#111"/></svg>`
  },
  {
    id: 'v_diag',
    topic: 'volume',
    title: '3D Diagonals, Cube-Sphere & Gluing',
    math: '$d_{\\text{cube}}=s\\sqrt{3},\\;\\; d_{\\text{prism}}=\\sqrt{l^2+w^2+h^2}$',
    note: 'Cube in sphere(r): s√3=2r -> s=2r/√3. Glued solids lose 2 touching faces. Unpainted inner cube = (n-2)³.',
    trap: 'Wall thickness t with open top: inside is (L-2t)(W-2t)(H-t).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="20" y="26" width="34" height="34" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="20,26 36,14 70,14 54,26" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="54,26 70,14 70,48 54,60" fill="none" stroke="#111" stroke-width="1.3"/><line x1="20" y1="60" x2="70" y2="14" stroke="#111" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'v_frust',
    topic: 'volume',
    title: 'Frustum (Cut-Off Cone) & Sphere Slice',
    math: '$V_{\\text{frust}}=V_{\\text{big}}\\left(1-\\frac{1}{k^3}\\right) \\;|\\; A_{\\text{slice}}=\\pi(R^2-d^2)$',
    note: 'If top 1/k of cone/pyramid height is cut off, remaining bottom holds (1 - 1/k³) of volume! Sphere sliced at dist d has radius √(R²-d²).',
    trap: 'Horizontal cone slice at dist d from tip has radius R(d/H).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="12" x2="32" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><line x1="45" y1="12" x2="58" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><polygon points="32,34 58,34 70,60 20,60" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'v_disp',
    topic: 'volume',
    title: 'Water Rise & Formula % Plug-In',
    math: '$\\Delta h=\\frac{V_{\\text{obj}}}{A_{\\text{base}}} \\;|\\; \\Delta V_{\\text{cone}}=m_r^2\\cdot m_h-1$',
    note: 'Submerging object in cylinder raises water Δh = V_obj/(πr²). Radius +20%, height -10% in cone/cyl -> (1.2)²(0.9)=1.296 -> +29.6%!',
    trap: 'Drop π and constants; plug multipliers straight into the variables.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="26" y="16" width="38" height="46" fill="none" stroke="#111" stroke-width="1.4"/><rect x="26" y="38" width="38" height="24" fill="rgba(0,0,0,0.1)"/><line x1="26" y1="30" x2="64" y2="30" stroke="#111" stroke-dasharray="3 2"/><text x="68" y="36" font-size="8">Δh</text></svg>`
  },

  // ==================== DATA, STATS, PROBABILITY & META ====================
  {
    id: 'd_mean',
    topic: 'data',
    title: 'Sum Trick, Tug-of-War & Offsets',
    math: '$\\text{Sum}=\\text{Mean}\\cdot n \\;|\\; \\sum(x_i-\\bar{x})=0$',
    note: 'Convert averages to totals first! Tug-of-War: combined mean splits gap between M1 & M2 in INVERSE size ratio. Offset trick: balance +/- from target mean.',
    trap: 'Equal group sizes -> simple average (M1+M2)/2; unequal -> closer to bigger group.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="39" x2="76" y2="39" stroke="#111" stroke-width="1.5"/><circle cx="20" cy="39" r="3"/><circle cx="70" cy="39" r="5.5"/><circle cx="56" cy="39" r="3" fill="#fff" stroke="#111" stroke-width="1.5"/><text x="48" y="56" font-size="8">mean</text></svg>`
  },
  {
    id: 'd_minmax',
    topic: 'data',
    title: 'Max/Min Element Given Mean & Med',
    math: '$\\text{Max}=\\text{Total}-\\text{Min(below)}-\\text{Med}-\\text{Min(above)}$',
    note: 'To maximize largest value in sorted set: push values below median to lowest allowed (0 or 1), and values between median & max EQUAL to median!',
    trap: 'Numbers between median and max CANNOT go below the median.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="9" font-weight="bold">0..0 | M | M..M | MAX</text><line x1="10" y1="44" x2="80" y2="44" stroke="#111"/><text x="12" y="58" font-size="8">minimize rest</text></svg>`
  },
  {
    id: 'd_sd',
    topic: 'data',
    title: 'SD: Shift vs Scale, Shape & Add Mean',
    math: '$+c\\implies\\text{SD same} \\;|\\; \\times k\\implies\\text{SD}\\times|k|$',
    note: 'Spread rank: tall bell < flat < skewed < bimodal at ends! Adding a value EQUAL to mean lowers SD; removing min/max lowers SD.',
    trap: 'Adding +c changes Mean/Med/Q1/Q3, but Range/IQR/SD NEVER change.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M12 58 Q24 16 36 52 Q45 62 54 52 Q66 16 78 58" fill="none" stroke="#111" stroke-width="1.5"/><text x="20" y="70" font-size="8">bimodal = max SD</text></svg>`
  },
  {
    id: 'd_box',
    topic: 'data',
    title: 'Box Plots, IQR, Outliers & Skew',
    math: '$\\text{IQR}=Q_3-Q_1 \\;|\\; \\text{Outlier }<Q_1-1.5\\,\\text{IQR}$',
    note: 'Upper outlier > Q3 + 1.5·IQR. Right-skew (tail right) -> Mean > Median. Left-skew -> Mean < Median. Symmetric -> Mean = Median.',
    trap: 'Box middle 50% width is IQR, NOT whisker-to-whisker range.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#111"/><rect x="28" y="25" width="32" height="28" fill="#fff" stroke="#111" stroke-width="1.4"/><line x1="42" y1="25" x2="42" y2="53" stroke="#111" stroke-width="2"/><text x="26" y="66" font-size="8">Q1</text><text x="40" y="66" font-size="8">M</text><text x="56" y="66" font-size="8">Q3</text></svg>`
  },
  {
    id: 'd_prob',
    topic: 'data',
    title: 'Probability, Conditional & Expected Val',
    math: '$P(A|B)=\\frac{P(A\\cap B)}{P(B)} \\;|\\; E[X]=\\sum x_i P(x_i)$',
    note: 'Basic P = target/total. "Given X" / "Of those who..." shrinks denominator to ONLY group X! P(A or B) = P(A)+P(B)-P(A and B).',
    trap: 'Two-way tables: double-check row total vs column total vs grand total.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="18" width="58" height="42" fill="none" stroke="#111" stroke-width="1.3"/><line x1="16" y1="38" x2="74" y2="38" stroke="#111"/><line x1="45" y1="18" x2="45" y2="60" stroke="#111"/><rect x="45" y="38" width="29" height="22" fill="rgba(17,17,17,0.14)"/></svg>`
  },
  {
    id: 'd_count',
    topic: 'data',
    title: 'Counting, Permutations & Combos',
    math: '$_nP_r=\\frac{n!}{(n-r)!} \\;|\\; _nC_r=\\frac{n!}{r!(n-r)!} \\;|\\; \\frac{n(n-1)}{2}$',
    note: 'Fundamental Counting Principle: multiply options n1*n2*n3. Permutations: order matters. Combinations: order does not matter. Handshakes = n(n-1)/2.',
    trap: 'Use Desmos nCr(n,r) and nPr(n,r) so you never mess up factorials.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">nCr · nPr</text><text x="12" y="51" font-size="10">pairs: n(n-1)/2</text></svg>`
  },
  {
    id: 'd_study',
    topic: 'data',
    title: 'MOE (1/√n), 95% CI & Study Design',
    math: '$\\text{MOE} \\propto \\frac{1}{\\sqrt{n}} \\;|\\; 4n \\implies \\frac{1}{2}\\text{ MOE}$',
    note: 'Larger n -> smaller MOE (4x n cuts MOE in half; 9x cuts to 1/3). Random SAMPLE -> generalize to pop. Random ASSIGN -> cause-and-effect.',
    trap: '95% CI is ONLY about the population MEAN/proportion, NOT 95% of people!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="39" x2="74" y2="39" stroke="#111" stroke-width="1.6"/><line x1="16" y1="32" x2="16" y2="46" stroke="#111" stroke-width="1.6"/><line x1="74" y1="32" x2="74" y2="46" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="39" r="3"/><text x="24" y="60" font-size="8">4n → ½ MOE</text></svg>`
  },
  {
    id: 'd_meta',
    topic: 'data',
    title: 'Test-Day Triage, Plug-In & Trap Pairs',
    math: '$\\text{Plug } n=2, 3 \\;|\\; \\text{Units Check} \\;|\\; \\text{3-Sec Triage}$',
    note: '3-sec triage: (1) 10-sec mental shortcut, (2) Desmos graph/stats, (3) [ ]~[ ] regression. Plug in n=2 (then 3), never 0 or 1.',
    trap: 'Trap answer pairs (e.g. 96 vs 100): check if you divided vs multiplied on % backward!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="34" font-size="9" font-weight="bold">1. Mental 10s</text><text x="15" y="47" font-size="9" font-weight="bold">2. Desmos Graph</text><text x="15" y="59" font-size="9" font-weight="bold">3. [ ] ~ [ ] Reg</text></svg>`
  }
];
