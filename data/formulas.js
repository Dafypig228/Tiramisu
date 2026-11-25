window.SAT_FORMULAS = [
  // ==================== DESMOS COMPLETE PLAYBOOK ====================
  {
    id: 'dm_trig',
    topic: 'desmos',
    title: 'Desmos: Sin, Cos, Tan & Inverse Trig',
    math: '$\\sin(x),\\;\\; \\cos(x),\\;\\; \\tan(x),\\;\\; \\arcsin(0.5)$',
    note: 'You can type sin(x), cos(x), tan(x), or numbers like cos(565*pi/6) directly into Desmos! Type arcsin(0.5) or sin^-1(0.5) to find an angle from a ratio. You can even graph y = a*sin(b*x)+c.',
    trap: 'ALWAYS check Degrees vs Radians in the Wrench icon first! Test sin(30): 0.5 = Degrees, -0.988 = Radians.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="39" x2="80" y2="39" stroke="#9ca3af"/><path d="M12 39 Q26 12 40 39 T68 39 T80 26" fill="none" stroke="#111" stroke-width="1.6"/><text x="14" y="64" font-size="9" font-weight="bold">y = sin(x)</text></svg>`
  },
  {
    id: 'dm_trigmode',
    topic: 'desmos',
    title: 'Desmos: Rad/Deg Check & f\'(x) Fix',
    math: '$\\sin(30)=0.5\\;(\\text{Deg}) \\;|\\; -0.988\\;(\\text{Rad})$',
    note: 'Click the top-right Wrench icon to switch Degrees/Radians or turn on the Polar grid. To check if a function is even or odd, graph f(-x) and compare with f(x) and -f(x).',
    trap: 'Do not type f\'(x) on Bluebook Desmos (it errors on some versions)—use (f(x+0.0001)-f(x))/0.0001 instead.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="36" font-size="10" font-weight="bold">sin(30)=0.5?</text><text x="15" y="52" font-size="9">Wrench: Deg/Rad</text></svg>`
  },
  {
    id: 'dm_abs_rad',
    topic: 'desmos',
    title: 'Desmos: |x|, Roots, Exponents & Fractions',
    math: '$\\text{abs}(x),\\;\\; \\text{sqrt}(x),\\;\\; \\text{cbrt}(x),\\;\\; \\text{nthroot}(x,n)$',
    note: 'Keyboard shortcuts: type abs(x) or |x|, sqrt for √, cbrt for cube root, nthroot(x,4) for 4th root, ^ for exponents, and / for fractions. Click any gray intersection, zero, or vertex dot on the graph to read exact coordinates.',
    trap: 'Click the circle-fraction icon on the left of any decimal output to turn it into an exact fraction.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="10" font-weight="bold">|x| · √x · x^a</text><text x="12" y="51" font-size="10">nthroot(x,n)</text></svg>`
  },
  {
    id: 'dm_const',
    topic: 'desmos',
    title: 'Desmos: Find Missing Constants (~)',
    math: '$x_1=[2,3,5,7],\\;\\; \\text{Left}(x_1)\\sim\\text{Right}(x_1)$',
    note: 'If two expressions are equal for all x (like (ax+b)(2x-3) = 6x²+cx-12), make a list x1=[2,3,5,7] and replace = with ~. Desmos solves a, b, and c at once!',
    trap: 'Never use x, y, e, or i as parameter letters. For huge powers like x^14, use small decimals x1=[0.5, 0.7, 0.9].',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="14" width="74" height="50" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="14" y="34" font-size="10" font-weight="bold">x1=[2,3,5,7]</text><text x="14" y="52" font-size="11" font-weight="bold">L(x1)~R(x1)</text></svg>`
  },
  {
    id: 'dm_bracket',
    topic: 'desmos',
    title: 'Desmos: Multi-Equation Solver [ ] ~ [ ]',
    math: '$[a, b] \\sim [\\text{eq}_1,\\; \\text{eq}_2]$',
    note: 'Solves 2+ equations or multi-step % problems together. Example: "a is 2241% of (b+c), b is 83% of c" → type c=1, then [a,b] ~ [22.41(b+c), 0.83c].',
    trap: 'Keep both sides inside [ ] in the exact same order.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="16" width="74" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="13" y="36" font-size="10" font-weight="bold">[a, b] ~</text><text x="13" y="52" font-size="10" font-weight="bold">[eq1, eq2]</text></svg>`
  },
  {
    id: 'dm_reg',
    topic: 'desmos',
    title: 'Desmos: Curve Fitting from Points',
    math: '$y_1\\sim mx_1+b \\;|\\; y_1\\sim ax_1^2+bx_1+c \\;|\\; y_1\\sim ab^{x_1}$',
    note: 'Click + → Table and enter the (x, y) points. Use mx1+b (line), ax1²+bx1+c (parabola), a(x1-h)²+k (vertex), or ab^x1 (exponential). Then type f(x)=... using those letters to evaluate new points with full 15-digit accuracy.',
    trap: 'If x values are huge years like 2010 and 2020, exponential fit can fail—enter 0 and 10 instead!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="62" x2="78" y2="62" stroke="#9ca3af"/><line x1="18" y1="12" x2="18" y2="68" stroke="#9ca3af"/><path d="M20 56 Q45 14 74 44" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="28" cy="44" r="2.5"/><circle cx="46" cy="28" r="2.5"/><circle cx="68" cy="40" r="2.5"/></svg>`
  },
  {
    id: 'dm_sliders',
    topic: 'desmos',
    title: 'Desmos: Solve Equations & Sliders',
    math: '$y=\\text{Left Side},\\;\\; y=\\text{Right Side}$',
    note: 'To solve any ugly equation, graph y = Left Side and y = Right Side and click the gray intersection dot—its x-value is the solution! Add a slider for unknown k to find when lines are parallel or tangent.',
    trap: 'Rename non-x letters like p or t to x before graphing so Desmos draws the curve properly.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="54" x2="74" y2="20" stroke="#111" stroke-width="1.5"/><line x1="16" y1="22" x2="72" y2="56" stroke="#111" stroke-width="1.5"/><circle cx="44" cy="38" r="3.5" fill="#6b7280"/></svg>`
  },
  {
    id: 'dm_equiv',
    topic: 'desmos',
    title: 'Desmos: Equivalent Expressions Overlap',
    math: '$f(x)=\\text{Question},\\;\\; g(x)=\\text{Choice}$',
    note: 'Graph the question expression, then graph each answer choice. The correct choice completely covers the original curve. If there is a second variable y, add a slider y = 2.71.',
    trap: 'Never test multi-var equivalence with 0, 1, or 2 because 2+2 = 2×2 = 2² causes fake matches.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 58 Q45 14 76 58" fill="none" stroke="#9ca3af" stroke-width="4"/><path d="M14 58 Q45 14 76 58" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/><text x="20" y="70" font-size="8">exact overlap</text></svg>`
  },
  {
    id: 'dm_hybrid',
    topic: 'desmos',
    title: 'Desmos: Positive Roots & Integer Sliders',
    math: '$k^2\\sim 25\\{k\\gt 0\\}$',
    note: 'Add {k > 0} to force Desmos to pick the positive answer. For 2 unknown integers j and k, make j a slider (step 1) and use ~ to solve for k until k becomes a whole number.',
    trap: 'Regression (~) only gives one solution—graph y=Left and y=Right when you need ALL solutions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="28" x2="76" y2="28" stroke="#9ca3af" stroke-width="2"/><circle cx="52" cy="28" r="4.5" fill="#111"/><text x="14" y="54" font-size="10" font-weight="bold">j=1,2.. {k&gt;0}</text></svg>`
  },
  {
    id: 'dm_freq',
    topic: 'desmos',
    title: 'Desmos: Frequency Tables & Box Stats',
    math: '$A=\\text{repeat}(V, F),\\;\\; \\text{stats}(A)$',
    note: 'If a table shows values V and frequencies F, type A = repeat(V, F) to build the full list. Then type mean(A), median(A), stdev(A), or stats(A) for min, Q1, median, Q3, and max.',
    trap: 'stdev(A) is sample SD; stdevp(A) is population SD. Use Gear → Duplicate list to test adding/removing outliers.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="10" font-weight="bold">repeat(V,F)</text><text x="10" y="46" font-size="10" font-weight="bold">stats(A)</text><text x="10" y="61" font-size="9">mean · stdevp</text></svg>`
  },
  {
    id: 'dm_seq',
    topic: 'desmos',
    title: 'Desmos: Sequences, Sums (Σ) & Filters',
    math: '$[1,2...100] \\;|\\; [2^i \\text{ for } i=[1...10]]$',
    note: 'Type [1,2...100] to auto-fill a sequence, or type sum on your keyboard to add terms with Σ (prod for Π). List tools: sort(L), length(L), total(L), and L[L > 5] to filter values above 5.',
    trap: 'Use keyboard shortcuts instead of clicking buttons to save huge time.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="13" font-weight="bold">Σ · Π</text><text x="12" y="52" font-size="10" font-weight="bold">[3,7...99]</text></svg>`
  },
  {
    id: 'dm_geom',
    topic: 'desmos',
    title: 'Desmos: Geometry, Remainders & nCr',
    math: '$\\text{distance}(A,B),\\; \\text{midpoint}(A,B),\\; \\text{mod}(a,b)$',
    note: 'Built-in tools: distance((x1,y1),(x2,y2)), midpoint, polygon(A,B,C), mod(a,b) for remainders, gcd(a,b), lcm(a,b), nCr(n,r), nPr(n,r), and "35% of 240".',
    trap: 'Use mod(a,b) to check remainders and last-digit cycles instantly.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="20" y1="54" x2="70" y2="22" stroke="#111" stroke-width="1.6"/><circle cx="20" cy="54" r="2.5"/><circle cx="70" cy="22" r="2.5"/><circle cx="45" cy="38" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },
  {
    id: 'dm_circle',
    topic: 'desmos',
    title: 'Desmos: Instant Circle & Inequalities',
    math: '$C=\\text{midpoint}(A,B),\\;\\; r=\\frac{\\text{distance}(A,B)}{2}$',
    note: 'Type ANY messy circle equation directly into Desmos. Click leftmost and rightmost dots (A, B) to get center & radius without completing the square. For inequalities, plot choice points (x,y) to see which sits in the shaded overlap.',
    trap: 'If a point sits directly on the border line, check whether the line is dashed (strict) or solid (included).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="25" fill="none" stroke="#111" stroke-width="1.5"/><line x1="20" y1="39" x2="70" y2="39" stroke="#111" stroke-dasharray="3 2"/><circle cx="20" cy="39" r="2.5"/><circle cx="70" cy="39" r="2.5"/><circle cx="45" cy="39" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },

  // ==================== TRIGONOMETRY ====================
  {
    id: 'tr_table',
    topic: 'trig',
    title: 'Sin, Cos, Tan Exact Values Table',
    math: '$\\begin{array}{c|ccccc}\\theta & 0^\\circ & 30^\\circ & 45^\\circ & 60^\\circ & 90^\\circ \\\\ \\hline \\sin & 0 & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} & 1 \\\\ \\cos & 1 & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} & 0 \\\\ \\tan & 0 & \\frac{\\sqrt{3}}{3} & 1 & \\sqrt{3} & \\text{undef}\\end{array}$',
    note: 'Easy memory trick for sin(0°, 30°, 45°, 60°, 90°): it goes √0/2, √1/2, √2/2, √3/2, √4/2! Cosine goes in the exact reverse order (√4/2 down to √0/2). Tangent is just sin ÷ cos.',
    trap: 'In radians: 30° = pi/6, 45° = pi/4, 60° = pi/3, 90° = pi/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="14" width="74" height="50" fill="none" stroke="#111" stroke-width="1.3"/><line x1="8" y1="30" x2="82" y2="30" stroke="#111"/><line x1="28" y1="14" x2="28" y2="64" stroke="#111"/><text x="12" y="25" font-size="8" font-weight="bold">θ</text><text x="33" y="25" font-size="8">30° 45° 60°</text><text x="11" y="42" font-size="8">sin</text><text x="11" y="55" font-size="8">cos</text><text x="33" y="42" font-size="8">½  √2/2 √3/2</text><text x="33" y="55" font-size="8">√3/2 √2/2 ½</text></svg>`
  },
  {
    id: 'tr_unit',
    topic: 'trig',
    title: 'Unit Circle & Signs by Quadrant (ASTC)',
    math: '$(x, y) = (\\cos\\theta,\\; \\sin\\theta),\\;\\; \\tan\\theta=\\frac{y}{x}$',
    note: 'On a radius-1 circle, x-coordinate is cosine, y-coordinate is sine, and slope (y/x) is tangent. Positive functions by quadrant ("All Students Take Calculus"): Q1 All +, Q2 Sin +, Q3 Tan +, Q4 Cos +.',
    trap: 'Always check which quadrant the angle lands in to know whether the answer is + or -.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="8" y1="39" x2="82" y2="39" stroke="#9ca3af"/><line x1="45" y1="6" x2="45" y2="72" stroke="#9ca3af"/><circle cx="45" cy="39" r="26" fill="none" stroke="#111" stroke-width="1.5"/><text x="56" y="26" font-size="10" font-weight="bold">A</text><text x="27" y="26" font-size="10" font-weight="bold">S</text><text x="27" y="57" font-size="10" font-weight="bold">T</text><text x="56" y="57" font-size="10" font-weight="bold">C</text></svg>`
  },
  {
    id: 'tr_axes',
    topic: 'trig',
    title: 'Unit Circle Axis Angles (0°, 90°, 180°, 270°)',
    math: '$0^\\circ:(1,0),\\; 90^\\circ:(0,1),\\; 180^\\circ:(-1,0),\\; 270^\\circ:(0,-1)$',
    note: 'Read (cos, sin) straight off the 4 axis points: at 180° (pi rad), point is (-1, 0), so cos(pi) = -1 and sin(pi) = 0. At 270° (3pi/2), point is (0, -1), so sin = -1 and cos = 0.',
    trap: 'tan(90°) and tan(270°) are undefined because x = 0 (division by zero).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#9ca3af"/><line x1="45" y1="8" x2="45" y2="70" stroke="#9ca3af"/><circle cx="45" cy="39" r="23" fill="none" stroke="#111" stroke-width="1.4"/><circle cx="68" cy="39" r="2.5"/><circle cx="45" cy="16" r="2.5"/><circle cx="22" cy="39" r="2.5"/><circle cx="45" cy="62" r="2.5"/></svg>`
  },
  {
    id: 'tr_angles',
    topic: 'trig',
    title: 'Radians ↔ Degrees Conversion',
    math: '$\\pi\\text{ rad}=180^\\circ,\\;\\; \\text{Rad}=\\text{Deg}\\cdot\\frac{\\pi}{180},\\;\\; \\text{Deg}=\\text{Rad}\\cdot\\frac{180}{\\pi}$',
    note: 'Fastest trick to convert radians to degrees: simply replace pi with 180°! Example: 5pi/6 = 5(180°)/6 = 150°. Notice /6 = 30°, /4 = 45°, /3 = 60°, /2 = 90°.',
    trap: 'Make sure Desmos matches the units of your question (Deg vs Rad).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 64 L76 64 M18 64 L18 10" stroke="#9ca3af"/><path d="M70 64 A52 52 0 0 0 18 12" fill="none" stroke="#111" stroke-width="1.5"/><line x1="18" y1="64" x2="64" y2="38" stroke="#111"/><line x1="18" y1="64" x2="54" y2="27" stroke="#111"/><line x1="18" y1="64" x2="44" y2="18" stroke="#111"/><text x="66" y="38" font-size="8">30°</text><text x="56" y="26" font-size="8">45°</text><text x="45" y="16" font-size="8">60°</text></svg>`
  },
  {
    id: 'tr_soh',
    topic: 'trig',
    title: 'SOH CAH TOA, Reciprocals & Slope',
    math: '$\\sin=\\frac{\\text{opp}}{\\text{hyp}},\\;\\; \\cos=\\frac{\\text{adj}}{\\text{hyp}},\\;\\; \\tan=\\frac{\\text{opp}}{\\text{adj}}$',
    note: 'Opposite = across from the angle; Adjacent = touching the angle; Hypotenuse = longest side across from 90°. Reciprocals: csc = 1/sin, sec = 1/cos, cot = 1/tan. A line through (0,0) at angle θ has slope = tan(θ).',
    trap: 'Do NOT use SOH CAH TOA on a non-right triangle unless you drop a 90° height first!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="16,18 16,60 76,60" fill="none" stroke="#111" stroke-width="1.5"/><rect x="16" y="51" width="9" height="9" fill="none" stroke="#111"/><text x="3" y="42" font-size="8">opp</text><text x="40" y="70" font-size="8">adj</text><text x="46" y="35" font-size="8">hyp</text></svg>`
  },
  {
    id: 'tr_sim',
    topic: 'trig',
    title: 'Trig in Similar / Nested Right Triangles',
    math: '$\\triangle ABC \\sim \\triangle DEF \\implies \\sin A=\\sin D,\\; \\cos A=\\cos D$',
    note: 'Trig ratios depend ONLY on the angle, NOT on how big the triangle is! If a question draws nested right triangles or scales all sides up by 3×, the sin, cos, and tan of matching angles stay 100% identical.',
    trap: 'Check which letter corresponds to which angle carefully before matching sides.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="12,60 78,60 78,16" fill="none" stroke="#111" stroke-width="1.5"/><line x1="48" y1="36" x2="48" y2="60" stroke="#111" stroke-dasharray="3 2"/><text x="23" y="56" font-size="8">θ</text></svg>`
  },
  {
    id: 'tr_comp',
    topic: 'trig',
    title: 'Complementary Angles: sin(A) = cos(B)',
    math: '$\\sin A = \\cos B \\iff A + B = 90^\\circ\\;\\left(\\text{or }\\frac{\\pi}{2}\\right)$',
    note: 'In any right triangle, the two acute angles add to 90°, and sin of one equals cos of the other. Shortcut: whenever you see sin(expr1) = cos(expr2), just set expr1 + expr2 = 90° and solve! Also tan(A) = 1/tan(B).',
    trap: 'Example: sin(2x) = cos(x + 15°) → 2x + x + 15 = 90 → x = 25°. Watch deg vs rad!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><text x="22" y="32" font-size="9">B</text><text x="53" y="58" font-size="9">A</text></svg>`
  },
  {
    id: 'tr_wrap',
    topic: 'trig',
    title: 'Coterminal Wrap & Reference Angles',
    math: '$\\cos(\\theta\\pm 2\\pi k)=\\cos\\theta \\;|\\; \\cos(180^\\circ-\\theta)=-\\cos\\theta$',
    note: 'For huge angles like 565pi/6: subtract multiples of 2pi (12pi/6) until you land between 0 and 2pi (565 ÷ 12 = 47 rem 1 → pi/6 = 30°!). For tangent, subtract pi. Supplementary (180°-θ): sin stays +, cos flips to -.',
    trap: 'Even/Odd trig: cos(-θ) = cos(θ), while sin(-θ) = -sin(θ).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="3 2"/><path d="M45 11 A28 28 0 1 1 20 26" fill="none" stroke="#111" stroke-width="1.6"/><polygon points="18,22 24,25 19,30" fill="#111"/><text x="34" y="43" font-size="10">+2πk</text></svg>`
  },
  {
    id: 'tr_pyth',
    topic: 'trig',
    title: 'Pythagorean Identity & Triangle Trick',
    math: '$\\sin^2\\theta+\\cos^2\\theta=1 \\;|\\; \\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$',
    note: 'Fastest way when given one trig ratio (ex: sin x = 5/13): draw a right triangle with opp=5, hyp=13, use 5-12-13 to get adj=12, and immediately read cos x = 12/13 and tan x = 5/12!',
    trap: 'Watch which quadrant θ is in to see if cos or tan should be negative.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,18 18,60 72,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="6" y="42" font-size="9">5</text><text x="41" y="71" font-size="9">12</text><text x="48" y="36" font-size="9">13</text></svg>`
  },
  {
    id: 'tr_laws',
    topic: 'trig',
    title: 'Area of Any △, Law of Sines & Cosines',
    math: '$A=\\frac{1}{2}ab\\sin C \\;|\\; \\frac{a}{\\sin A}=\\frac{b}{\\sin B} \\;|\\; c^2=a^2+b^2-2ab\\cos C$',
    note: 'Area without knowing height: 1/2 × side a × side b × sin(angle C between them). Use Law of Sines for matching side-angle pairs, and Law of Cosines when you know 3 sides or 2 sides + included angle.',
    trap: 'Angle C MUST be the angle trapped directly between sides a and b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,60 32,16 78,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="19" y="40" font-size="9">a</text><text x="44" y="70" font-size="9">b</text><text x="23" y="56" font-size="9">C</text></svg>`
  },

  // ==================== CIRCLES ====================
  {
    id: 'c_std',
    topic: 'circles',
    title: 'Circle Area, Circumference & Standard Eq',
    math: '$(x-h)^2+(y-k)^2=r^2 \\;|\\; A=\\pi r^2,\\;\\; C=2\\pi r$',
    note: 'Center (h, k) has OPPOSITE signs from inside the parentheses, and the right side is r² (take square root for r). Example: (x-3)²+(y+5)²=16 has center (3, -5) and radius 4.',
    trap: 'Read carefully if the question gives diameter d instead of radius r, or asks for r² instead of r.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="50" x2="80" y2="50" stroke="#9ca3af"/><line x1="32" y1="10" x2="32" y2="70" stroke="#9ca3af"/><circle cx="52" cy="34" r="20" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="52" cy="34" r="2"/><line x1="52" y1="34" x2="72" y2="34" stroke="#111" stroke-dasharray="2 2"/><text x="45" y="46" font-size="8">(h,k)</text></svg>`
  },
  {
    id: 'c_axes',
    topic: 'circles',
    title: 'Circles Touching Axes & Diameter Endpoints',
    math: '$\\text{Center}=\\text{Midpoint},\\;\\; r=\\frac{d}{2}$',
    note: 'If a circle touches (is tangent to) the x-axis once, radius = |k|. If it touches the y-axis once, radius = |h|. Given two ends of a diameter (x1,y1) and (x2,y2): center is their midpoint, and radius is half the distance between them.',
    trap: 'If the circle is tangent to the y-axis at (0, 9), then |h| = r and k = 9.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="18" y1="12" x2="18" y2="66" stroke="#9ca3af"/><circle cx="42" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="18" cy="39" r="2.5"/><text x="44" y="43" font-size="8">r=|h|</text></svg>`
  },
  {
    id: 'c_eq',
    topic: 'circles',
    title: 'Expanded Circle Eq Shortcut (No Algebra)',
    math: '$x^2+Dx+y^2+Ey+F=0 \\implies C=\\left(-\\frac{D}{2},-\\frac{E}{2}\\right)$',
    note: 'Skip completing the square! Take half of D and E and flip their signs for the center. Then r² = (D/2)² + (E/2)² - F. Example: x²-6x+y²+8y+9=0 → center (3,-4), r² = 9+16-9 = 16, so r = 4.',
    trap: 'If x² and y² have a number in front (like 2x²+2y²), divide the whole equation by 2 first!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="45" cy="39" r="2.2"/><text x="21" y="34" font-size="8">(-D/2,-E/2)</text></svg>`
  },
  {
    id: 'c_radii',
    topic: 'circles',
    title: 'Equal Radii, Chord Bisector & 60°/90°/120°',
    math: '$60^\\circ\\to r,\\;\\; 90^\\circ\\to r\\sqrt{2},\\;\\; 120^\\circ\\to r\\sqrt{3}$',
    note: 'Two radii drawn to a chord make an isosceles triangle (equal base angles). A line from the center perpendicular to a chord ALWAYS cuts the chord in half. Special chord lengths: central 60° → r, 90° → r√2, 120° → r√3.',
    trap: 'Draw a radius to any point touching the circle—its length is always r.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="39" x2="20" y2="23" stroke="#111" stroke-width="1.5"/><line x1="45" y1="39" x2="70" y2="23" stroke="#111" stroke-width="1.5"/><line x1="20" y1="23" x2="70" y2="23" stroke="#111" stroke-width="1.2"/><line x1="45" y1="39" x2="45" y2="23" stroke="#111" stroke-dasharray="3 2"/><text x="27" y="21" font-size="9">α</text><text x="58" y="21" font-size="9">α</text><text x="47" y="56" font-size="9">r</text></svg>`
  },
  {
    id: 'c_arc',
    topic: 'circles',
    title: 'Arc Length (Degrees & Radians)',
    math: '$\\text{Arc}=\\frac{\\theta}{360^\\circ}\\cdot 2\\pi r \\;|\\; \\text{In radians: } s=r\\theta$',
    note: 'Arc length is just a fraction of the circumference! With degrees, divide angle by 360° and multiply by 2pi r. With radians, just multiply radius × angle (s = rθ).',
    trap: 'Arc length uses circumference (2pi r), NOT area (pi r²).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#9ca3af"/><path d="M45 39 L68 21 A29 29 0 0 0 22 21 Z" fill="rgba(0,0,0,0.06)" stroke="#111" stroke-width="1.4"/><path d="M22 21 A29 29 0 0 1 68 21" fill="none" stroke="#111" stroke-width="2.6"/><text x="41" y="29" font-size="10">θ</text></svg>`
  },
  {
    id: 'c_sector',
    topic: 'circles',
    title: 'Sector (Pizza Slice) & Segment Area',
    math: '$A_{\\text{sec}}=\\frac{\\theta}{360^\\circ}\\cdot\\pi r^2 \\;|\\; \\text{In radians: } \\frac{1}{2}r^2\\theta$',
    note: 'Sector area is a fraction of total circle area (pi r²). For the small cap between a chord and an arc ("segment"), calculate Sector Area minus Triangle Area = 1/2 r²(θ - sin θ).',
    trap: 'Watch for "major arc" vs "minor arc": subtract the given angle from 360° if it asks for the larger slice.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#111" stroke-width="1.3"/><path d="M45 39 L74 39 A29 29 0 0 0 58 13 Z" fill="rgba(17,17,17,0.16)" stroke="#111" stroke-width="1.4"/><text x="53" y="34" font-size="9">θ</text></svg>`
  },
  {
    id: 'c_annulus',
    topic: 'circles',
    title: 'Shaded Ring (Tangent Chord Shortcut)',
    math: '$A_{\\text{ring}}=\\pi(R^2-r^2)=\\pi\\left(\\frac{L}{2}\\right)^2$',
    note: 'Two circles sharing a center make a ring of area pi(R² - r²). Shortcut: if a chord of length L in the big circle barely touches (is tangent to) the small circle, the ring area is ALWAYS pi(L/2)²—you do not need R or r!',
    trap: 'Example: tangent chord has length 10 → half is 5 → ring area = pi(5²) = 25pi.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="rgba(0,0,0,0.1)" stroke="#111" stroke-width="1.4"/><circle cx="45" cy="39" r="15" fill="#fff" stroke="#111" stroke-width="1.4"/><line x1="21" y1="24" x2="69" y2="24" stroke="#111" stroke-width="1.6"/><text x="42" y="20" font-size="9">L</text></svg>`
  },
  {
    id: 'c_inscribed',
    topic: 'circles',
    title: 'Central vs Inscribed Angles',
    math: '$\\text{Central Angle}=2\\times\\text{Inscribed Angle}$',
    note: 'An angle with its tip at the center equals its arc; an angle with its tip on the circle edge is HALF of that arc. Inscribed angles looking at the same arc are equal.',
    trap: 'Make sure the vertex is actually ON the circle edge, not floating inside or outside.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 45,39 70,50" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 19,52 70,50" fill="none" stroke="#111" stroke-width="1.3"/><text x="48" y="42" font-size="9">2x</text><text x="27" y="50" font-size="9">x</text></svg>`
  },
  {
    id: 'c_thales',
    topic: 'circles',
    title: 'Semicircle 90° (Thales) & Cyclic Quad',
    math: '$\\text{Diameter }\\triangle = 90^\\circ \\;|\\; \\angle A+\\angle C=180^\\circ$',
    note: 'Any triangle inscribed in a semicircle (where one side is the diameter) is ALWAYS a 90° right triangle across from the diameter! Any 4-sided shape with all 4 corners on a circle has opposite angles adding to 180°.',
    trap: 'Opposite angles in a cyclic quadrilateral sum to 180°, NOT equal each other.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="26" fill="none" stroke="#111" stroke-width="1.4"/><line x1="19" y1="39" x2="71" y2="39" stroke="#111" stroke-width="1.4"/><polyline points="19,39 54,15 71,39" fill="none" stroke="#111" stroke-width="1.4"/><text x="48" y="29" font-size="8">90°</text></svg>`
  },
  {
    id: 'c_power',
    topic: 'circles',
    title: 'Intersecting Chords & Secant Lengths',
    math: '$a\\cdot b=c\\cdot d \\;|\\; O_1\\cdot W_1=O_2\\cdot W_2 \\;|\\; t^2=O\\cdot W$',
    note: 'Two chords crossing inside a circle: (part 1)×(part 2) = (part 3)×(part 4). Two lines meeting outside: (Outside)×(Whole) = (Outside)×(Whole). Tangent and secant: Tangent² = (Outside)×(Whole).',
    trap: '"Whole" means Outside + Inside combined, NOT just the inside piece!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="34" cy="39" r="22" fill="none" stroke="#111" stroke-width="1.4"/><line x1="34" y1="17" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><line x1="16" y1="48" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><text x="58" y="26" font-size="9">t</text></svg>`
  },
  {
    id: 'c_tangents',
    topic: 'circles',
    title: 'Tangent ⊥ Radius & Two Tangents',
    math: '$PA=PB,\\;\\; \\angle OAP=\\angle OBP=90^\\circ$',
    note: 'A tangent line always meets the radius at 90°. Two tangent lines from the same outside point P have equal lengths (PA = PB), and the central angle at O plus tip angle P always add to 180°.',
    trap: 'Connect center O to P to split the figure into two identical right triangles.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="32" cy="39" r="18" fill="none" stroke="#111" stroke-width="1.4"/><line x1="32" y1="39" x2="40" y2="23" stroke="#111"/><line x1="32" y1="39" x2="40" y2="55" stroke="#111"/><line x1="40" y1="23" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><line x1="40" y1="55" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><text x="79" y="42" font-size="9">P</text></svg>`
  },

  // ==================== TRIANGLES, POLYGONS & COORDINATES ====================
  {
    id: 't_sum',
    topic: 'triangles',
    title: 'Triangle Angle Sum & Side Inequality',
    math: '$a+b+c=180^\\circ \\;|\\; |a-b|\\lt c\\lt a+b$',
    note: 'The 3 inside angles always add to 180°. To form a real triangle, the 3rd side c MUST be strictly bigger than |a-b| and strictly smaller than a+b. Example: sides 4 and 9 → 3rd side is between 5 and 13.',
    trap: 'Equal (=) makes a flat line, not a triangle! In isosceles △s, check if the given angle is the top or a base angle.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="45,12 14,64 76,64" fill="none" stroke="#111" stroke-width="1.5"/><text x="42" y="29" font-size="10">b</text><text x="24" y="59" font-size="10">a</text><text x="61" y="59" font-size="10">c</text></svg>`
  },
  {
    id: 't_pyth',
    topic: 'triangles',
    title: 'Pythagorean Triples & GCF Speed Trick',
    math: '$a^2+b^2=c^2$',
    note: 'Memorize triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 9-40-41 (and multiples like 6-8-10). Big legs? Divide both by their GCF first! Ex: 24 and 21 → ÷3 → 8 and 7 → hyp = √(64+49) = √113 → multiply back by 3 = 3√113.',
    trap: 'c is always the longest side (across from 90°), not a leg.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 74,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="7" y="42" font-size="9">a</text><text x="44" y="72" font-size="9">b</text><text x="48" y="36" font-size="9">c</text></svg>`
  },
  {
    id: 't_special',
    topic: 'triangles',
    title: '30-60-90 & 45-45-90 Triangles',
    math: '$30\\text{-}60\\text{-}90: x,\\;x\\sqrt{3},\\;2x \\;|\\; 45\\text{-}45\\text{-}90: x,\\;x,\\;x\\sqrt{2}$',
    note: '45-45-90 (half square): hyp d → leg d√2/2, area = d²/4. 30-60-90 (half equilateral △): medium leg L (opp 60°) → short leg L√3/3. Also, a median to the hypotenuse is always half the hypotenuse.',
    trap: 'If a 45-45-90 perimeter is A + A√2, then its hypotenuse is instantly A!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,12 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="2" y="40" font-size="9">x√3</text><text x="42" y="72" font-size="9">x</text><text x="48" y="34" font-size="9">2x</text></svg>`
  },
  {
    id: 't_alt',
    topic: 'triangles',
    title: 'Altitude in a Right Triangle (Geom Mean)',
    math: '$h^2=p\\cdot q,\\;\\; a^2=p\\cdot c,\\;\\; b^2=q\\cdot c,\\;\\; a\\cdot b=c\\cdot h$',
    note: 'Dropping height h from 90° to hypotenuse c splits c into pieces p (under leg a) and q (under leg b), making 3 similar right triangles. Fast area trick: leg a × leg b always equals hypotenuse c × height h!',
    trap: 'Label acute angles α and 90°-α to spot matching similar right triangles anywhere in a diagram.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 34,18 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="34" y1="18" x2="34" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="36" y="44" font-size="9">h</text><text x="22" y="68" font-size="8">p</text><text x="53" y="68" font-size="8">q</text></svg>`
  },
  {
    id: 't_equi',
    topic: 'triangles',
    title: 'Equilateral △, Hexagon & Circle Fit',
    math: '$A_\\triangle=\\frac{s^2\\sqrt{3}}{4},\\;\\; h=\\frac{s\\sqrt{3}}{2},\\;\\; A_{\\text{hex}}=\\frac{3\\sqrt{3}}{2}s^2$',
    note: 'Equilateral △ (side s): outer circle radius R = s/√3, inner circle radius r = s/(2√3) (R = 2r). Regular hexagon = 6 equilateral △s (long diag = 2s, short diag = s√3). Square inside circle(r): side s = r√2, area = 2r².',
    trap: 'Circle inside a square of side s simply has radius r = s/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="43" r="27" fill="none" stroke="#9ca3af"/><circle cx="45" cy="43" r="13.5" fill="none" stroke="#9ca3af"/><polygon points="45,16 22,56 68,56" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="16" x2="45" y2="56" stroke="#111" stroke-dasharray="2 2"/><text x="26" y="38" font-size="9">s</text><text x="47" y="42" font-size="9">h</text></svg>`
  },
  {
    id: 't_area',
    topic: 'triangles',
    title: 'Triangle Area, Shared Height & Bisector',
    math: '$A=\\frac{1}{2}bh \\;|\\; \\frac{\\text{Area}_1}{\\text{Area}_2}=\\frac{\\text{Base}_1}{\\text{Base}_2} \\;|\\; \\frac{\\text{side}_1}{\\text{side}_2}=\\frac{\\text{seg}_1}{\\text{seg}_2}$',
    note: 'If two triangles share the same top vertex/height, their Areas have the exact same ratio as their Bases! An angle bisector splits the opposite side in the exact ratio of the two adjacent sides.',
    trap: 'Make sure the height is perpendicular (90°) to the chosen base.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 42,16 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="42" y1="16" x2="50" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="27" y="68" font-size="8">b1</text><text x="60" y="68" font-size="8">b2</text></svg>`
  },
  {
    id: 't_heron',
    topic: 'triangles',
    title: 'Heron’s Formula & Inradius Area',
    math: '$s=\\frac{a+b+c}{2},\\;\\; A=\\sqrt{s(s-a)(s-b)(s-c)}=r_{\\text{in}}\\cdot s$',
    note: 'Use Heron when you know all 3 side lengths (a, b, c) of a non-right triangle and have no height. Bonus: if a circle of radius r fits inside any triangle, Area = r × s (half-perimeter).',
    trap: 'Remember s is HALF the perimeter, not the full perimeter.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="16,60 44,16 74,60" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="44" cy="44" r="15" fill="none" stroke="#9ca3af"/><text x="23" y="38" font-size="9">a</text><text x="62" y="38" font-size="9">b</text><text x="42" y="70" font-size="9">c</text></svg>`
  },
  {
    id: 't_quad',
    topic: 'triangles',
    title: 'Trapezoid, Parallelogram, Rhombus & Kite',
    math: '$A_{\\text{trap}}=\\frac{b_1+b_2}{2}h \\;|\\; A_{\\perp\\text{diag}}=\\frac{d_1d_2}{2}$',
    note: 'Trapezoid area = average of parallel bases × height (Midsegment = (b1+b2)/2). Any shape with 90° diagonals (square, rhombus, kite) has area = (diag1 × diag2)/2. Parallelogram: base × height = a·b·sin(θ).',
    trap: 'For parallelogram and trapezoid, multiply by perpendicular height, NEVER the slanted edge.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="24,20 66,20 78,58 12,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="28" y1="20" x2="28" y2="58" stroke="#9ca3af" stroke-dasharray="2 2"/><text x="41" y="16" font-size="8">b1</text><text x="41" y="70" font-size="8">b2</text></svg>`
  },
  {
    id: 't_tilt',
    topic: 'triangles',
    title: 'Tilted Square Inside a Square',
    math: '$A_{\\text{inner}}=a^2+b^2,\\;\\; \\text{side}=\\sqrt{a^2+b^2}$',
    note: 'Whenever a tilted square sits inside a larger square (touching all 4 sides), all 4 corner right triangles are 100% congruent! Their legs swap (a, b) around the edges, and the inner square area is a² + b².',
    trap: 'Use the Pythagorean theorem on one corner triangle to get the tilted square side immediately.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="52" height="52" fill="none" stroke="#9ca3af"/><polygon points="34,14 70,30 54,66 18,50" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/><text x="23" y="21" font-size="8">a</text><text x="11" y="34" font-size="8">b</text></svg>`
  },
  {
    id: 't_ext',
    topic: 'triangles',
    title: 'Exterior Angles & Parallel Zig-Zag Rule',
    math: '$x=a+b \\;|\\; \\sum\\text{Left Angles}=\\sum\\text{Right Angles}$',
    note: 'A triangle exterior angle equals the sum of the 2 far interior angles. Parallel lines create only 2 angle sizes (either equal, or adding to 180°). If lines zig-zag between two parallel lines, Left-pointing angles = Right-pointing angles.',
    trap: 'Vertical angles (across an X) are always equal; straight-line pairs always sum to 180°.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="18" x2="78" y2="18" stroke="#111" stroke-width="1.5"/><line x1="12" y1="60" x2="78" y2="60" stroke="#111" stroke-width="1.5"/><polyline points="30,18 58,39 28,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="61" y="42" font-size="8">L=R</text></svg>`
  },
  {
    id: 't_poly',
    topic: 'triangles',
    title: 'Polygons: Interior, Exterior & Diagonals',
    math: '$\\text{Int Sum}=180^\\circ(n-2) \\;|\\; \\text{Ext}=\\frac{360^\\circ}{n} \\;|\\; \\frac{n(n-3)}{2}$',
    note: 'Exterior angle sum of ANY convex polygon is always 360°. Fastest way to find one interior angle of a regular n-gon: find 360°/n, then subtract from 180°. Total diagonals = n(n-3)/2.',
    trap: 'Example: regular hexagon (n=6) → ext = 360/6 = 60° → each interior angle = 180 - 60 = 120°.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="45,12 72,28 72,54 45,68 18,54 18,28" fill="none" stroke="#111" stroke-width="1.5"/><text x="32" y="43" font-size="9">180(n-2)</text></svg>`
  },
  {
    id: 't_cong',
    topic: 'triangles',
    title: 'Similarity, Congruence & k, k², k³ Scaling',
    math: '$\\text{Lengths}\\times k \\implies \\text{Area}\\times k^2 \\implies \\text{Volume}\\times k^3$',
    note: 'Scale all lengths by k → area scales by k² and volume scales by k³! Parallel cut in △: side pieces match top/bottom = top/bottom, while parallel bases use small/BIG = top/WHOLE.',
    trap: 'Congruence is SSS, SAS, ASA, AAS, HL. AAA and SSA do NOT prove congruence.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="8,58 22,18 38,58" fill="none" stroke="#111" stroke-width="1.4"/><polygon points="50,58 64,18 80,58" fill="none" stroke="#111" stroke-width="1.4"/><text x="41" y="42" font-size="10">~</text></svg>`
  },
  {
    id: 't_box',
    topic: 'triangles',
    title: 'Distance, Midpoint, Shoelace & Box Area',
    math: '$d=\\sqrt{\\Delta x^2+\\Delta y^2} \\;|\\; A=\\frac{1}{2}|x_1y_2-x_2y_1|$',
    note: 'Area of any tilted coordinate triangle: (1) Box Method: draw a tight rectangle around the 3 points and subtract the 3 corner right triangles; OR (2) Shoelace: shift one point to (0,0) first, then use 1/2|x1y2 - x2y1|.',
    trap: 'Remember the 1/2 in Shoelace and always subtract the shifted vertex from the other two first!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="14" width="58" height="48" fill="none" stroke="#9ca3af" stroke-dasharray="3 2"/><polygon points="16,32 74,14 54,62" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 't_trans',
    topic: 'triangles',
    title: 'All 7 Coordinate Reflections & Rotations',
    math: '$(x,y)\\xrightarrow{y=x}(y,x) \\;|\\; \\xrightarrow{90^\\circ\\text{CCW}}(-y,x)$',
    note: 'Reflections: across x-axis → (x,-y); y-axis → (-x,y); y=x → (y,x); y=-x → (-y,-x). Rotations around origin: 90° CCW (or 270° CW) → (-y,x); 180° → (-x,-y); 90° CW (or 270° CCW) → (y,-x).',
    trap: 'Plug in a quick test point like (3, 1) to make sure you flipped the right sign.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#9ca3af"/><line x1="45" y1="8" x2="45" y2="70" stroke="#9ca3af"/><path d="M62 22 A24 24 0 0 0 28 22" fill="none" stroke="#111" stroke-width="1.5"/><polygon points="26,24 31,20 32,26" fill="#111"/><text x="35" y="16" font-size="8">90°CCW</text></svg>`
  },

  // ==================== ALGEBRA & NUMBER THEORY ====================
  {
    id: 'a_slope',
    topic: 'algebra',
    title: 'Lines: Slope, Intercept & Word Problems',
    math: '$m=\\frac{y_2-y_1}{x_2-x_1},\\;\\; y=mx+b,\\;\\; y-y_1=m(x-x_1)$',
    note: 'In word problems, m is the rate of change ("per", "each", "for every") and b is the starting amount or flat fee. Parallel lines: m1 = m2. Perpendicular lines: flip the fraction and change the sign (m1·m2 = -1).',
    trap: 'If table x jumps by 3 each row and y jumps by 12, slope is 12/3 = 4, NOT 12.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="58" x2="78" y2="58" stroke="#9ca3af"/><line x1="26" y1="10" x2="26" y2="68" stroke="#9ca3af"/><line x1="14" y1="52" x2="74" y2="18" stroke="#111" stroke-width="1.6"/><text x="46" y="28" font-size="9">m</text><text x="15" y="43" font-size="9">b</text></svg>`
  },
  {
    id: 'a_lines',
    topic: 'algebra',
    title: 'Standard Form Ax+By=C & Δy Leapfrog',
    math: '$m=-\\frac{A}{B},\\;\\; x\\text{-int}=\\frac{C}{A},\\;\\; y\\text{-int}=\\frac{C}{B},\\;\\; \\Delta y=-\\frac{A}{B}\\Delta x$',
    note: 'Perpendicular line shortcut: swap A and B and flip one sign (Bx - Ay = D). Leapfrog trick: if x goes up by Δx, y ALWAYS changes by (slope × Δx)—no need to find the y-intercept!',
    trap: 'If asked "how much does x increase when y increases by 1?", flip the slope to 1/m!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="31" font-size="10" font-weight="bold">Ax + By = C</text><text x="10" y="51" font-size="10">perp: Bx - Ay = D</text></svg>`
  },
  {
    id: 'a_ptdist',
    topic: 'algebra',
    title: 'Shortest Distance from Point to Line',
    math: '$d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$',
    note: 'Gives the exact perpendicular distance from point (x0, y0) to line Ax + By + C = 0. Super fast for finding if a line touches a circle or finding the closest distance from (0,0) to a line.',
    trap: 'Move C to the LEFT side so the equation equals 0 before plugging in!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="58" x2="74" y2="16" stroke="#111" stroke-width="1.5"/><circle cx="32" cy="24" r="2.5"/><line x1="32" y1="24" x2="43" y2="39" stroke="#111" stroke-dasharray="2 2"/><text x="41" y="31" font-size="9">d</text></svg>`
  },
  {
    id: 'a_sys',
    topic: 'algebra',
    title: 'Systems: 0, 1, or ∞ Solutions Ratio Test',
    math: '$\\frac{a_1}{a_2}=\\frac{b_1}{b_2}\\ne\\frac{c_1}{c_2}\\;(\\text{0 sol}) \\;|\\; \\frac{a_1}{a_2}=\\frac{b_1}{b_2}=\\frac{c_1}{c_2}\\;(\\infty\\text{ sol})$',
    note: 'Parallel lines (0 solutions) have equal x/y ratios but a different constant ratio. Identical lines (∞ solutions) have ALL 3 ratios equal. One solution means x/y ratios are different. 1-var Ax+B = Cx+D: 0 sol when A=C, B≠D.',
    trap: 'Line up both equations into Ax + By = C order before dividing coefficients!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="56" x2="66" y2="16" stroke="#111" stroke-width="1.5"/><line x1="28" y1="62" x2="78" y2="22" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_combo',
    topic: 'algebra',
    title: 'Swapped-Coeff Systems: Add Straight Down',
    math: '$(3x+7y=29) + (7x+3y=41) \\implies 10x+10y=70$',
    note: 'Whenever a system asks for (x+y), (x-y), or (5x+5y) instead of x alone, try adding or subtracting the two equations straight down—you get x+y = 7 in 3 seconds without elimination!',
    trap: 'Always check what expression the question actually asks for before solving for x and y.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="28" font-size="10" font-weight="bold">3x + 7y = 29</text><text x="12" y="44" font-size="10" font-weight="bold">7x + 3y = 41</text><line x1="10" y1="50" x2="80" y2="50" stroke="#111"/><text x="12" y="64" font-size="10" font-weight="bold">x + y = 7</text></svg>`
  },
  {
    id: 'a_abs',
    topic: 'algebra',
    title: 'Absolute Value Bounds & Sum of Roots',
    math: '$|x-c|\\le r,\\; c=\\frac{a+b}{2},\\; r=\\frac{b-a}{2} \\;|\\; \\text{Sum}=-\\frac{2b}{a}$',
    note: 'Turn range a <= x <= b into |x - center| <= radius by taking center = (a+b)/2 and radius = (b-a)/2. Shortcut: for |ax+b|=k (k positive), the sum of its two solutions is ALWAYS -2b/a!',
    trap: '|ax+b| = negative has 0 solutions; |ax+b| = 0 has only 1 solution.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="54" x2="78" y2="54" stroke="#9ca3af"/><polyline points="18,18 45,54 72,18" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'a_chunk',
    topic: 'algebra',
    title: 'Whole-Chunk, Flip Fraction & f(2x-1)',
    math: '$\\frac{2}{a}=\\frac{3}{4}\\implies\\frac{a}{2}=\\frac{4}{3} \\;|\\; f(2x-1)=6x+5$',
    note: 'Never solve for x if the whole chunk repeats! Ex: if 5x-3=17, then 10x-1 = 2(5x-3)+5 = 39. For "given f(2x-1)=6x+5, find f(7)": set 2x-1=7 → x=4 → plug 4 into right side = 29!',
    trap: 'Double fractions: (a/b)/c = a/(bc), whereas a/(b/c) = ac/b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="18" width="70" height="42" rx="6" fill="none" stroke="#111" stroke-width="1.4"/><text x="16" y="36" font-size="10" font-weight="bold">2/a = 3/4</text><text x="16" y="52" font-size="10" font-weight="bold">a/2 = 4/3</text></svg>`
  },
  {
    id: 'a_id',
    topic: 'algebra',
    title: 'Core Factoring Identities',
    math: '$x^2-y^2=(x+y)(x-y) \\;|\\; x^2+y^2=(x+y)^2-2xy$',
    note: 'Spot these in disguise! Ex: if x²-y² = 40 and x-y = 4, divide 40 by 4 to get x+y = 10 immediately. Given x+y and xy, use (x+y)² - 2xy to get x²+y². Also: (x+y)² - (x-y)² = 4xy.',
    trap: '(x+y)² equals x² + 2xy + y², NEVER just x² + y²!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="48" height="48" fill="none" stroke="#111" stroke-width="1.5"/><rect x="46" y="14" width="20" height="20" fill="rgba(0,0,0,0.12)" stroke="#111"/></svg>`
  },
  {
    id: 'a_fact',
    topic: 'algebra',
    title: 'Cubes (SOAP), Remainder & Coeff Sums',
    math: '$a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2) \\;|\\; \\text{Rem}=P(a)$',
    note: 'Remainder Theorem: dividing P(x) by (x-a) leaves remainder P(a) (by ax-b leaves P(b/a)); if P(a)=0, (x-a) is a factor! For any polynomial P(x): sum of coefficients = P(1), constant term = P(0), alternating sum = P(-1).',
    trap: 'Cubes sign rule "SOAP": Same sign, Opposite sign, Always Positive.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">Rem = P(a)</text><text x="12" y="51" font-size="10">Sum coeff: P(1)</text></svg>`
  },
  {
    id: 'a_partial',
    topic: 'algebra',
    title: 'Partial Fractions (Cover-Up Shortcut)',
    math: '$\\frac{5x+11}{(x-1)(x+3)}=\\frac{A}{x-1}+\\frac{B}{x+3}$',
    note: 'To find A (over x-1): mentally cover (x-1) on the left and plug x=1 into what remains: (5(1)+11)/(1+3) = 4! To find B, cover (x+3) and plug x=-3: (-15+11)/(-3-1) = 1. Zero algebra needed!',
    trap: 'You can also solve A and B in Desmos with x1=[2,3,4,5] and ~.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="10" font-weight="bold">Cover (x-1)</text><text x="10" y="48" font-size="10">plug x = 1 → A</text></svg>`
  },
  {
    id: 'a_asym',
    topic: 'algebra',
    title: 'Rational Holes & Asymptotes',
    math: '$\\text{Vert Asym: } D(x)=0 \\;|\\; \\text{Horiz: BOBO BOTN EATS DC}$',
    note: 'Canceled common factor = HOLE (not an asymptote or root). Remaining bottom = 0 gives vertical asymptote. Horizontal asymptote: Bigger on Bottom → y=0; Bigger on Top → None; Exponents Same → Divide Leading Coeffs.',
    trap: 'Always check whether a root makes the denominator zero (extraneous/hole).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="10" x2="45" y2="68" stroke="#9ca3af" stroke-dasharray="3 2"/><line x1="10" y1="39" x2="80" y2="39" stroke="#9ca3af" stroke-dasharray="3 2"/><path d="M14 34 Q40 32 42 12" fill="none" stroke="#111" stroke-width="1.5"/><path d="M48 66 Q50 46 76 44" fill="none" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_exp',
    topic: 'algebra',
    title: 'Exponent Laws, Base Match & √x²',
    math: '$x^{a/b}=\\sqrt[b]{x^a},\\;\\; 2^{x+3}-2^x=7(2^x),\\;\\; \\sqrt{x^2}=|x|$',
    note: 'Convert bases like 4, 8, 9, 27 to powers of 2 or 3 (ex: 8^x / 2^y = 2^(3x-y)). Laws: x^a·x^b = x^(a+b), x^a/x^b = x^(a-b), (x^a)^b = x^(ab), x^(-n) = 1/x^n, x^0 = 1.',
    trap: '(-3)² = 9, but -3² = -9. Also √(x²) is |x| (positive), NOT x when x is negative!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="34" font-size="12" font-weight="bold">x^(a/b)</text><text x="12" y="54" font-size="11" font-weight="bold">√(x²) = |x|</text></svg>`
  },
  {
    id: 'a_rad',
    topic: 'algebra',
    title: 'Radical Conjugates & Fake Solutions',
    math: '$\\frac{c}{a+\\sqrt{b}}\\cdot\\frac{a-\\sqrt{b}}{a-\\sqrt{b}}=\\frac{c(a-\\sqrt{b})}{a^2-b}$',
    note: 'Clear a square root from a denominator by multiplying top and bottom by the opposite-sign conjugate (a - √b). When solving radical equations, get the root alone first, square both sides, then plug answers back in!',
    trap: 'Squaring can create fake answers. Also √x = -4 immediately has 0 real solutions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="11" font-weight="bold">a + √b</text><text x="10" y="52" font-size="10">× (a - √b)</text></svg>`
  },
  {
    id: 'a_seq',
    topic: 'algebra',
    title: 'Arithmetic & Geometric Sequences + Series',
    math: '$S_n=\\frac{n}{2}(a_1+a_n) \\;|\\; S_n=a_1\\frac{1-r^n}{1-r}$',
    note: 'Arithmetic (adds d each step): nth term = a1 + (n-1)d, sum = n × (first+last)/2. Geometric (multiplies r each step): nth term = a1·r^(n-1). You can also use Desmos sum or [a1, a2...an].',
    trap: 'Check carefully whether the first term is labeled n=1 or n=0.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="18" cy="54" r="3"/><circle cx="36" cy="44" r="3"/><circle cx="54" cy="30" r="3"/><circle cx="72" cy="14" r="3"/><path d="M18 54 Q45 40 72 14" fill="none" stroke="#111" stroke-dasharray="2 2"/></svg>`
  },
  {
    id: 'a_amgm',
    topic: 'algebra',
    title: 'Minimum Value Shortcut (ax + b/x)',
    math: '$\\min\\left(ax+\\frac{b}{x}\\right)=2\\sqrt{ab}\\;\\; (x \\text{ positive})$',
    note: 'When x is positive, expressions like x + 9/x or 4x + 25/x hit their minimum value when the two pieces are equal (ax = b/x), giving minimum = 2√(ab). Example: min of x + 9/x is 2√(1·9) = 6!',
    trap: 'Only holds when x is positive.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M20 16 Q32 62 72 34" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="38" cy="48" r="2.5"/><text x="24" y="64" font-size="8">min = 2√ab</text></svg>`
  },
  {
    id: 'a_num',
    topic: 'algebra',
    title: 'Remainders, Parity & Last-Digit Cycles',
    math: '$n=dq+r \\;|\\; \\text{Last digit: } \\text{mod}(\\text{exp}, 4)$',
    note: '"Dividing n by d leaves remainder r" translates to n = dq + r. Any factor of an odd number must be odd! To find the last digit of a^k, divide k by 4 and take the remainder (remainder 0 uses a^4). Divisible by 3/9: digit sum div by 3/9.',
    trap: 'For consecutive integers, Mean = Median = (first + last)/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">n = dq + r</text><text x="12" y="52" font-size="10">mod(exp, 4)</text></svg>`
  },

  // ==================== QUADRATICS & FUNCTIONS ====================
  {
    id: 'q_vert',
    topic: 'quadratics',
    title: 'Parabola: 3 Forms & Symmetry Vertex',
    math: '$x_v=-\\frac{b}{2a}=\\frac{p+q}{2}=\\frac{m+n}{2}\\;(f(m)=f(n))$',
    note: 'Standard ax²+bx+c shows y-int c. Vertex a(x-h)²+k shows vertex (h,k) and root sum = 2h. Factored a(x-p)(x-q) shows roots p, q. Symmetry trick: if f(2)=f(8), vertex x is halfway: (2+8)/2 = 5!',
    trap: '"Minimum/maximum value" means the y-value k, NOT h!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 16 Q45 76 74 16" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="46" r="2.5"/><text x="33" y="61" font-size="9">(h,k)</text></svg>`
  },
  {
    id: 'q_vieta',
    topic: 'quadratics',
    title: 'Vieta’s Formulas (Quadratics & Cubics)',
    math: '$\\text{Sum}=-\\frac{b}{a},\\;\\;\\text{Prod}=\\frac{c}{a}$',
    note: 'For ax²+bx+c=0, sum of solutions is -b/a and product is c/a without factoring! For a cubic ax³+bx²+cx+d=0: sum of all 3 roots = -b/a, pairwise sum = c/a, product = -d/a.',
    trap: 'Check that b² - 4ac is at least 0 if the question asks for the sum of REAL solutions!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="50" x2="78" y2="50" stroke="#9ca3af"/><path d="M18 22 Q45 76 72 22" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="29" cy="50" r="2.5"/><circle cx="61" cy="50" r="2.5"/><text x="23" y="65" font-size="8">r1</text><text x="57" y="65" font-size="8">r2</text></svg>`
  },
  {
    id: 'q_rshift',
    topic: 'quadratics',
    title: 'Sum of Roots After Shifting / Scaling',
    math: '$f(x-h)=0\\implies S_{\\text{new}}=S+n\\cdot h \\;|\\; f(kx)=0\\implies\\frac{S}{k}$',
    note: 'If f(x) = 0 has n roots with sum S, then replacing x with (x - h) shifts ALL n roots right by h, so the new sum is S + n·h! Example: quadratic has root sum 10 (n=2) → f(x-4)=0 has sum 10 + 2(4) = 18.',
    trap: 'Replacing x with kx divides every root by k, so the new sum is S/k.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 54 Q30 20 46 54" fill="none" stroke="#9ca3af" stroke-dasharray="2 2"/><path d="M36 54 Q52 20 68 54" fill="none" stroke="#111" stroke-width="1.6"/><text x="26" y="68" font-size="8">+h each root</text></svg>`
  },
  {
    id: 'q_disc',
    topic: 'quadratics',
    title: 'Discriminant, Tangent & No-Solution Max b',
    math: '$D=b^2-4ac \\;|\\; \\text{0 real sols: } b \\lt 2\\sqrt{ac}$',
    note: 'D positive = 2 real sols; D = 0 = 1 sol (tangent line); D negative = 0 real sols. Shortcut: for -x²+bx-k²=0 (or x²+bx+k²=0) to have 0 real solutions, biggest integer b is 2k - 1!',
    trap: 'Line y=mx+k tangent to parabola: set them equal, move to one side, and set b² - 4ac = 0.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 16 Q45 70 72 16" fill="none" stroke="#111" stroke-width="1.5"/><line x1="14" y1="43" x2="76" y2="43" stroke="#111" stroke-dasharray="3 2"/><circle cx="45" cy="43" r="2.5"/><text x="24" y="62" font-size="8">tangent D=0</text></svg>`
  },
  {
    id: 'q_maxb',
    topic: 'quadratics',
    title: 'Factoring Cheat: Max b & Max ac',
    math: '$b_{\\max}=ac+1 \\;|\\; (ac)_{\\max}=\\lfloor\\frac{b^2}{4}\\rfloor$',
    note: 'If ax²+bx+c factors with positive integers (px+q)(rx+s): biggest possible b is ac+1 (if c negative: a|c|-1). Reverse: if b is given (like ax²+148x+c), biggest possible ac is (b/2)² when b even (here 74² = 5,476) or (b²-1)/4 when b odd.',
    trap: 'Check whether the problem restricts factors to positive integers only.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="31" font-size="10" font-weight="bold">max b = ac+1</text><text x="10" y="52" font-size="10" font-weight="bold">max ac = b²/4</text></svg>`
  },
  {
    id: 'q_nosol',
    topic: 'quadratics',
    title: 'Squared-Term, Odd-Factor & Hole Traps',
    math: '$-(3x-7)^2=p+17 \\implies p+17\\gt 0\\; (0\\text{ sol})$',
    note: 'A negative square is ALWAYS at most 0, so setting it equal to a positive number gives 0 solutions (p+17 positive → least integer p = -16). Hole trap: (x-3)(x+2)/(x-k)=0 loses a root when k = 3 or -2.',
    trap: 'Factor parity trap: in 4x²+bx-45 = (hx+k)(x+j), kj = -45 (odd!), so k and j must BOTH be odd → b = 4j+k is odd!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="30" x2="80" y2="30" stroke="#9ca3af"/><path d="M16 62 Q45 14 74 62" fill="none" stroke="#111" stroke-width="1.5"/><text x="18" y="22" font-size="9">p+17 &gt; 0</text></svg>`
  },
  {
    id: 'q_ineq',
    topic: 'quadratics',
    title: 'Quadratic Inequalities (> 0 vs < 0)',
    math: '$(x-r_1)(x-r_2)\\gt 0 \\;|\\; (x-r_1)(x-r_2)\\lt 0$',
    note: 'Find the two roots r1 and r2 (with a positive): greater than 0 means OUTSIDE the roots (left of r1 or right of r2); less than 0 means BETWEEN the roots (r1 to r2).',
    trap: 'Or just graph y = quadratic in Desmos and look where the curve is above or below the x-axis!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="44" x2="80" y2="44" stroke="#9ca3af"/><path d="M18 16 Q45 76 72 16" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="28" cy="44" r="2.5"/><circle cx="62" cy="44" r="2.5"/></svg>`
  },
  {
    id: 'q_shift',
    topic: 'quadratics',
    title: 'Function Shifts, Flips, Stretches & |f(x)|',
    math: '$f(x-h)+k,\\;\\; -f(x),\\;\\; f(-x),\\;\\; |f(x)|$',
    note: 'Inside x does OPPOSITE: f(x-3) moves RIGHT 3, f(2x) squishes horizontally by 1/2. Outside does DIRECT: +4 moves UP 4, 2f(x) stretches taller. -f(x) flips x-axis; f(-x) flips y-axis; |f(x)| bounces negative y upward.',
    trap: 'Vertex (h, k) under f(x-3) + 4 moves to (h+3, k+4).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 54 Q32 16 50 54" fill="none" stroke="#9ca3af" stroke-dasharray="2 2"/><path d="M34 46 Q52 8 70 46" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'q_inv',
    topic: 'quadratics',
    title: 'Function Inverses f⁻¹(x) Shortcut',
    math: '$f^{-1}(7)=x \\iff f(x)=7 \\;|\\; f(x)=mx+b \\implies f^{-1}(x)=\\frac{x-b}{m}$',
    note: 'To find f⁻¹(7), NEVER solve for the inverse formula—just set f(x) = 7 and solve for x (or graph y=f(x) and y=7 in Desmos)! To find the inverse equation, swap x and y and solve for y.',
    trap: 'The graph of f⁻¹(x) is the reflection of f(x) across the line y = x.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="62" x2="74" y2="14" stroke="#9ca3af" stroke-dasharray="3 2"/><text x="16" y="30" font-size="10" font-weight="bold">f⁻¹(7)</text><text x="38" y="54" font-size="10">f(x)=7</text></svg>`
  },
  {
    id: 'q_expfn',
    topic: 'quadratics',
    title: 'Exponential y-Int Trap & Poly Bounces',
    math: '$y=a\\cdot b^{x-h}+k \\implies y_{\\text{int}}=a\\cdot b^{-h}+k$',
    note: 'For y = a·b^(x-h) + k, the flat asymptote line is y = k, and the y-intercept is NOT a—always plug x = 0! In polynomials, an even power like (x-3)² BOUNCES off the x-axis at 3, while an odd power like (x-3)³ CROSSES through it.',
    trap: 'A degree-n polynomial has at most n x-intercepts and at most n - 1 turning bends.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="54" x2="80" y2="54" stroke="#9ca3af" stroke-dasharray="3 2"/><path d="M14 52 Q52 50 74 14" fill="none" stroke="#111" stroke-width="1.6"/><text x="52" y="64" font-size="8">y = k</text></svg>`
  },

  // ==================== PERCENTAGES, RATES & GROWTH ====================
  {
    id: 'p_pct',
    topic: 'percent',
    title: 'Percents Forward/Backward & "BY vs TO"',
    math: '$\\%\\Delta=\\frac{\\text{New}-\\text{Old}}{\\text{Old}}\\cdot 100,\\;\\; \\text{Old}=\\frac{\\text{New}}{1\\pm p}$',
    note: '"200% OF B" means 2×B, while "200% GREATER THAN B" (or "increases BY 200%") means B + 2B = 3×B! If no starting number is given, pretend the start is 100.',
    trap: 'Going backward from a discounted price? DIVIDE by (1 - p), NEVER multiply by (1 + p)! Ex: $80 after 20% off → 80 / 0.80 = $100.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">Old → New</text><text x="14" y="52" font-size="10">Back: ÷(1±p)</text></svg>`
  },
  {
    id: 'p_succ',
    topic: 'percent',
    title: 'Successive % & (+p%, -p%) Loss Trick',
    math: '$(1+r_1)(1+r_2)-1 \\;|\\; +p\\%,-p\\%=-\\left(\\frac{p}{10}\\right)^2\\%$',
    note: 'Multiply the multipliers instead of adding percents! Ex: up 20% then down 10% is 1.20 × 0.90 = 1.08 (+8%). Shortcut: going up p% then down p% ALWAYS loses (p/10)% squared (up 20%, down 20% = -4%).',
    trap: 'Up 30% then down 30% is a 9% LOSS, NOT 0%!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="10" font-weight="bold">+p%, -p%</text><text x="10" y="52" font-size="11" font-weight="bold">-(p/10)² %</text></svg>`
  },
  {
    id: 'p_exp',
    topic: 'percent',
    title: 'Exponential Growth & Decay Cycles',
    math: '$y=a(1\\pm r)^{t/n} \\;|\\; y=a\\cdot 2^{t/T_d} \\;|\\; y=a(0.5)^{t/T_{1/2}}$',
    note: 'a = start amount, t = time passed, n = time per cycle. Ex: "doubles every 5 hours" → a·2^(t/5); "loses 12% every 3 days" → a(0.88)^(t/3).',
    trap: 'Check whether t is in hours, days, or years so t and n use the same unit.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q46 56 72 16" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="72" y2="26" stroke="#9ca3af" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'p_period',
    topic: 'percent',
    title: 'Converting Monthly/Quarterly Rates to Yearly',
    math: '$1+r_{\\text{year}}=(1+r_{\\text{sub}})^k$',
    note: 'If an equation grows by 3% per quarter, y = A(1.03)^(4t), the annual growth rate is (1.03)^4 - 1 = 12.55%—do NOT multiply 3% × 4 = 12%!',
    trap: '5% monthly growth is (1.05)^12 - 1 = 79.6% annual growth, NOT 60%!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="10" font-weight="bold">(1 + r_sub)^k</text><text x="10" y="52" font-size="10">= 1 + r_year</text></svg>`
  },
  {
    id: 'p_int',
    topic: 'percent',
    title: 'Simple vs Compound Interest & Exp Beat',
    math: '$I=Prt \\;|\\; A=P\\left(1+\\frac{r}{n}\\right)^{nt}$',
    note: 'Simple interest adds the same dollar amount Pr each year (linear). Compound multiplies n times per year. Any exponential growth (base above 1) will ALWAYS eventually overtake any linear growth.',
    trap: 'Check if the question asks for total balance A or just the interest earned (A - P).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q48 56 74 14" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="74" y2="30" stroke="#9ca3af" stroke-width="1.4"/></svg>`
  },
  {
    id: 'p_rates',
    topic: 'percent',
    title: 'Average Speed & Combined Work Rate',
    math: '$v_{\\text{avg}}=\\frac{2ab}{a+b} \\;|\\; T_{\\text{together}}=\\frac{t_1\\cdot t_2}{t_1+t_2}$',
    note: 'Driving there at speed a and back the SAME distance at speed b gives average speed 2ab/(a+b). Two workers taking t1 and t2 hours alone finish together in (t1·t2)/(t1+t2) hours.',
    trap: 'Round-trip average speed of 30 mph and 50 mph is 37.5 mph, NOT 40 mph!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 32 H70 L62 24 M74 48 H20 L28 56" fill="none" stroke="#111" stroke-width="1.5"/><text x="30" y="23" font-size="9">a</text><text x="48" y="65" font-size="9">b</text></svg>`
  },
  {
    id: 'p_var',
    topic: 'percent',
    title: 'Direct vs Inverse Variation',
    math: '$\\text{Direct: } \\frac{y_1}{x_1}=\\frac{y_2}{x_2} \\;|\\; \\text{Inverse: } x_1y_1=x_2y_2$',
    note: 'Direct ("y is proportional to x"): y = kx, so when x doubles, y doubles. Inverse ("y is inversely proportional to x"): y = k/x, so when x doubles, y cuts in half!',
    trap: 'For inverse variation, multiply x·y to find the constant k first.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="58" x2="72" y2="18" stroke="#111" stroke-width="1.4"/><path d="M22 18 Q26 50 74 56" fill="none" stroke="#9ca3af" stroke-width="1.5"/></svg>`
  },
  {
    id: 'p_units',
    topic: 'percent',
    title: 'Area/Volume Unit Trap & Density',
    math: '$1\\text{ ft}^2 = 12^2\\text{ in}^2 \\;|\\; 1\\text{ m}^3 = 100^3\\text{ cm}^3 \\;|\\; \\rho=\\frac{m}{V}$',
    note: 'When converting square units (area), SQUARE the conversion factor; when converting cubic units (volume), CUBE it! Density equals Mass divided by Volume.',
    trap: '1 square yard = 3² = 9 square feet (NOT 3). 1 cubic foot = 12³ = 1,728 cubic inches!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="20" width="36" height="36" fill="none" stroke="#111" stroke-width="1.5"/><line x1="30" y1="20" x2="30" y2="56" stroke="#9ca3af"/><line x1="42" y1="20" x2="42" y2="56" stroke="#9ca3af"/><line x1="18" y1="32" x2="54" y2="32" stroke="#9ca3af"/><line x1="18" y1="44" x2="54" y2="44" stroke="#9ca3af"/><text x="58" y="42" font-size="9">k²</text></svg>`
  },

  // ==================== 3D VOLUME & SURFACE ====================
  {
    id: 'v_solids',
    topic: 'volume',
    title: 'All 3D Volumes (Cube to Sphere)',
    math: '$V_{\\text{cyl}}=\\pi r^2h,\\;\\; V_{\\text{cone}}=\\frac{1}{3}\\pi r^2h,\\;\\; V_{\\text{sph}}=\\frac{4}{3}\\pi r^3$',
    note: 'Cube = s³; Rectangular Prism = lwh; Any Prism = Base Area × h; Pyramid = (1/3) × Base Area × h. Notice a cone is 1/3 of a cylinder with the same base and height.',
    trap: 'Divide diameter by 2 to get radius r BEFORE squaring or cubing!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><ellipse cx="45" cy="20" rx="18" ry="6" fill="none" stroke="#111" stroke-width="1.3"/><line x1="27" y1="20" x2="27" y2="54" stroke="#111"/><line x1="63" y1="20" x2="63" y2="54" stroke="#111"/><ellipse cx="45" cy="54" rx="18" ry="6" fill="none" stroke="#111"/></svg>`
  },
  {
    id: 'v_sa',
    topic: 'volume',
    title: 'All Surface Areas (NOT on SAT Sheet!)',
    math: '$SA_{\\text{cyl}}=2\\pi r^2+2\\pi rh \\;|\\; SA_{\\text{cone}}=\\pi r^2+\\pi rl \\;|\\; SA_{\\text{sph}}=4\\pi r^2$',
    note: 'Cube SA = 6s²; Box SA = 2(lw+lh+wh); Cone slant height l = √(r²+h²); Square Pyramid SA = s² + 2sl (square base + 4 triangles).',
    trap: 'Check carefully if a box/cylinder has an "open top" (1 base instead of 2) or asks for "lateral area only" (0 bases).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="45,14 22,58 68,58" fill="none" stroke="#111" stroke-width="1.4"/><ellipse cx="45" cy="58" rx="23" ry="6" fill="none" stroke="#111" stroke-width="1.3"/><text x="61" y="38" font-size="9">l</text></svg>`
  },
  {
    id: 'v_diag',
    topic: 'volume',
    title: '3D Diagonals, Cube in Sphere & Gluing',
    math: '$d_{\\text{cube}}=s\\sqrt{3},\\;\\; d_{\\text{box}}=\\sqrt{l^2+w^2+h^2}$',
    note: 'Longest stick fitting inside a box is √(l²+w²+h²). If a cube fits tightly inside a sphere of radius r, cube 3D diagonal = 2r, so s = 2r/√3. Gluing two prisms hides 2 touching faces from surface area. Unpainted inner cube = (n-2)³.',
    trap: 'Cube space diagonal uses √3, whereas a flat square diagonal uses √2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="20" y="26" width="34" height="34" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="20,26 36,14 70,14 54,26" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="54,26 70,14 70,48 54,60" fill="none" stroke="#111" stroke-width="1.3"/><line x1="20" y1="60" x2="70" y2="14" stroke="#111" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'v_wall',
    topic: 'volume',
    title: 'Wall Thickness & Open-Top Containers',
    math: '$V_{\\text{inside}}=(L-2t)(W-2t)(H-t)$',
    note: 'If a box has wall thickness t: subtract 2t from L and W (left + right walls). If it has a lid, subtract 2t from H; if open-top, subtract only 1t (just the bottom)!',
    trap: 'To find the volume of the wall material itself: Outer Volume minus Inner Volume.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="16" width="58" height="46" fill="none" stroke="#111" stroke-width="1.5"/><rect x="24" y="16" width="42" height="38" fill="none" stroke="#9ca3af" stroke-dasharray="3 2"/><text x="36" y="60" font-size="8">t</text></svg>`
  },
  {
    id: 'v_frust',
    topic: 'volume',
    title: 'Chopped Cone (Frustum) & Sphere Slice',
    math: '$V_{\\text{bottom}}=V_{\\text{big}}\\left(1-\\frac{1}{k^3}\\right) \\;|\\; A_{\\text{slice}}=\\pi(R^2-d^2)$',
    note: 'If the top 1/k of a cone or pyramid height is chopped off, the remaining bottom part holds (1 - 1/k³) of the full volume! Slicing a sphere of radius R at distance d from its center makes a circle of radius √(R²-d²).',
    trap: 'Slicing a cone horizontally at distance d from its tip gives a circle of radius R·(d/H).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="12" x2="32" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><line x1="45" y1="12" x2="58" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><polygon points="32,34 58,34 70,60 20,60" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'v_disp',
    topic: 'volume',
    title: 'Water Rise & Formula % Multiplier Trick',
    math: '$\\Delta h=\\frac{V_{\\text{object}}}{A_{\\text{base}}}$',
    note: 'Dropping an object into a tank makes the water level rise by (Object Volume ÷ Tank Base Area). Percent-change shortcut: if cone radius goes up 20% and height drops 10%, plug multipliers straight into r²h: (1.2)²(0.9) = 1.296 → volume increases by 29.6%!',
    trap: 'Drop pi and constants like 1/3 when computing % change—only variables affect the ratio.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="26" y="16" width="38" height="46" fill="none" stroke="#111" stroke-width="1.4"/><rect x="26" y="38" width="38" height="24" fill="rgba(0,0,0,0.1)"/><line x1="26" y1="30" x2="64" y2="30" stroke="#111" stroke-dasharray="3 2"/><text x="68" y="36" font-size="8">Δh</text></svg>`
  },

  // ==================== DATA, STATS, PROBABILITY & META ====================
  {
    id: 'd_mean',
    topic: 'data',
    title: 'Total Sum Trick & Signed Offsets',
    math: '$\\text{Sum}=\\text{Mean}\\times n \\;|\\; \\sum(x_i-\\bar{x})=0$',
    note: 'Always convert averages into Totals first! Offset trick: to average 90 on [88, 91, 94, 86], track differences from 90 (-2+1+4-4 = -1), so the 5th score needs 90 + 1 = 91!',
    trap: 'If 1 player leaves, subtract New Total from Old Total to get that player’s exact score.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">Sum = Mean × n</text><text x="12" y="52" font-size="10">Offsets sum = 0</text></svg>`
  },
  {
    id: 'd_tug',
    topic: 'data',
    title: 'Tug-of-War Combined Group Mean',
    math: '$\\bar{x}_{\\text{all}}=\\frac{n_1M_1+n_2M_2}{n_1+n_2}$',
    note: 'Shortcut: if two groups have equal size, combined mean is just (M1+M2)/2. If unequal, it sits closer to the bigger group in the inverse ratio of sizes! Ex: 10 people avg 70, 30 people avg 90 (1:3) → sits 1/4 of gap from 90 → 85.',
    trap: 'Combined mean is NEVER halfway unless both groups have the exact same count.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="39" x2="76" y2="39" stroke="#111" stroke-width="1.5"/><circle cx="20" cy="39" r="3"/><circle cx="70" cy="39" r="5.5"/><circle cx="56" cy="39" r="3" fill="#fff" stroke="#111" stroke-width="1.5"/><text x="48" y="56" font-size="8">mean</text></svg>`
  },
  {
    id: 'd_minmax',
    topic: 'data',
    title: 'Max/Min Possible Value (Mean & Median)',
    math: '$\\text{Max}=\\text{Total}-(\\text{smallest possible other values})$',
    note: 'To make the largest number in a sorted list as BIG as possible: push every number below the median down to the lowest allowed value (0 or 1), and make every number between median and max EQUAL to the median!',
    trap: 'Values above the median cannot drop below the median, or the median itself would change.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="9" font-weight="bold">0..0 | M | M..M | MAX</text><line x1="10" y1="44" x2="80" y2="44" stroke="#111"/><text x="12" y="58" font-size="8">minimize rest</text></svg>`
  },
  {
    id: 'd_stats',
    topic: 'data',
    title: 'Standard Deviation: Spread & Outliers',
    math: '$\\text{Bell} \\lt \\text{Flat} \\lt \\text{Skewed} \\lt \\text{Bimodal Ends}$',
    note: 'SD measures spread from the mean: tall narrow bell = smallest SD; data stacked at the far left & right ends (bimodal) = largest SD! Adding a number EQUAL to the mean lowers SD; removing min or max lowers SD.',
    trap: 'SD depends on distance from the mean—values grouped tightly near the center give smaller SD.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M12 58 Q24 16 36 52 Q45 62 54 52 Q66 16 78 58" fill="none" stroke="#111" stroke-width="1.5"/><text x="20" y="70" font-size="8">bimodal = max SD</text></svg>`
  },
  {
    id: 'd_shift',
    topic: 'data',
    title: 'Adding +c vs Multiplying ×k Data Rules',
    math: '$+c\\implies\\text{SD same} \\;|\\; \\times k\\implies\\text{SD}\\times|k|$',
    note: 'Adding +c to every point shifts Mean, Median, Q1, Q3, Min, Max by +c—while Range, IQR, and SD DO NOT CHANGE! Multiplying every point by k multiplies EVERYTHING (Mean, Median, Range, IQR, and SD) by |k|.',
    trap: 'Changing only the smallest number moves Mean and Range, while Median and IQR usually stay unchanged.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="10" font-weight="bold">+c : SD stays same</text><text x="12" y="52" font-size="10" font-weight="bold">×k : ALL × |k|</text></svg>`
  },
  {
    id: 'd_box',
    topic: 'data',
    title: 'Box Plots, IQR, Outliers & Skewness',
    math: '$\\text{IQR}=Q_3-Q_1 \\;|\\; \\text{Low}\\lt Q_1-1.5\\,\\text{IQR}$',
    note: 'The box spans Q1 to Q3 (middle 50% of data). High outlier exceeds Q3 + 1.5·IQR. Right-skewed (long tail right) pulls Mean higher than Median; left-skewed pulls Mean below Median; symmetric means Mean = Median.',
    trap: 'Total Range is Max - Min (whisker to whisker), while IQR is ONLY Q3 - Q1 (box width).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#111"/><rect x="28" y="25" width="32" height="28" fill="#fff" stroke="#111" stroke-width="1.4"/><line x1="42" y1="25" x2="42" y2="53" stroke="#111" stroke-width="2"/><text x="26" y="66" font-size="8">Q1</text><text x="40" y="66" font-size="8">M</text><text x="56" y="66" font-size="8">Q3</text></svg>`
  },
  {
    id: 'd_prob',
    topic: 'data',
    title: 'Probability, "OR" & Conditional ("Given")',
    math: '$P(A\\text{ given }B)=\\frac{\\text{both }A\\text{ and }B}{\\text{total in }B} \\;|\\; P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$',
    note: 'Basic P = Target ÷ Total. Whenever a question says "Given X" or "If a person from group X is chosen", shrink the denominator to ONLY group X! For "A or B", add both and subtract the overlap.',
    trap: 'In two-way tables, verify whether your denominator is a row total, column total, or grand total.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="18" width="58" height="42" fill="none" stroke="#111" stroke-width="1.3"/><line x1="16" y1="38" x2="74" y2="38" stroke="#111"/><line x1="45" y1="18" x2="45" y2="60" stroke="#111"/><rect x="45" y="38" width="29" height="22" fill="rgba(17,17,17,0.14)"/></svg>`
  },
  {
    id: 'd_ev',
    topic: 'data',
    title: 'Expected Value (Weighted Outcomes)',
    math: '$E[X]=\\sum x_i\\cdot P(x_i)$',
    note: 'Multiply each outcome value by its probability and add them all together. Example: 25% chance to win $20 and 75% chance to win $4 → (0.25×20) + (0.75×4) = $8.',
    trap: 'Remember to treat losses as negative values.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="34" font-size="11" font-weight="bold">E[X] = Σ x·P(x)</text><text x="12" y="54" font-size="9">val × prob, then add</text></svg>`
  },
  {
    id: 'd_count',
    topic: 'data',
    title: 'Counting, Permutations & Combinations',
    math: '${}_nP_r=\\frac{n!}{(n-r)!} \\;|\\; {}_nC_r=\\frac{n!}{r!(n-r)!} \\;|\\; \\frac{n(n-1)}{2}$',
    note: 'Multiply choices across independent steps (ex: 3 shirts × 4 pants = 12 outfits). Use Permutations (nPr) when order matters, Combinations (nCr) when order does not matter. Pairwise handshakes/games among n teams = n(n-1)/2.',
    trap: 'Use Desmos nCr(n,r) and nPr(n,r) so you never mess up factorials.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">nCr · nPr</text><text x="12" y="51" font-size="10">pairs: n(n-1)/2</text></svg>`
  },
  {
    id: 'd_study',
    topic: 'data',
    title: 'Margin of Error, 95% CI & Study Design',
    math: '$\\text{MOE} \\propto \\frac{1}{\\sqrt{n}} \\;|\\; 4n \\implies \\frac{1}{2}\\text{ MOE}$',
    note: 'Bigger sample size n shrinks Margin of Error (4× bigger sample cuts MOE in half; 9× cuts it to 1/3). Random SAMPLING lets you generalize to the whole population. Random ASSIGNMENT (experiment) proves cause-and-effect.',
    trap: 'A 95% confidence interval ONLY estimates the population MEAN/proportion—NOT 95% of individuals!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="39" x2="74" y2="39" stroke="#111" stroke-width="1.6"/><line x1="16" y1="32" x2="16" y2="46" stroke="#111" stroke-width="1.6"/><line x1="74" y1="32" x2="74" y2="46" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="39" r="3"/><text x="24" y="60" font-size="8">4n → ½ MOE</text></svg>`
  },
  {
    id: 'd_meta',
    topic: 'data',
    title: '3-Second Test Triage & Plug-In Strategy',
    math: '$\\text{Plug } n=2, 3 \\;|\\; \\text{Units Check}$',
    note: 'Pick your fastest lane in 3 seconds: (1) 10-sec mental shortcut, (2) Desmos graph/table, or (3) [ ]~[ ] regression. When testing multiple-choice algebra expressions by plugging in a number, use n=2 (and n=3 if two choices tie).',
    trap: 'Never use n=0 or n=1 as your only test number—0 and 1 make different powers look equal. Watch for backward-% trap pairs (96 vs 100).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="34" font-size="9" font-weight="bold">1. Mental 10s</text><text x="15" y="47" font-size="9" font-weight="bold">2. Desmos Graph</text><text x="15" y="59" font-size="9" font-weight="bold">3. [ ] ~ [ ] Reg</text></svg>`
  }
];

window.FORMULA_OVERRIDES = {
  // ===== RIGHT TRIANGLES & TRIG =====
  rt_e1: ['tr_soh', 'dm_trig'], rt_e2: ['t_pyth'], rt_e3: ['t_pyth'], rt_e4: ['tr_soh'],
  rt_e5: ['t_cong', 'tr_sim', 'tr_soh'], rt_e6: ['tr_soh'], rt_e7: ['t_pyth'], rt_e8: ['t_pyth'],
  rt_e9: ['t_pyth'], rt_e10: ['t_special', 't_sum'],
  rt_m1: ['t_cong', 'tr_sim', 'tr_soh'], rt_m2: ['tr_comp', 'tr_soh'], rt_m3: ['tr_comp', 'tr_soh'],
  rt_m4: ['tr_soh'], rt_m5: ['tr_soh'], rt_m6: ['tr_soh', 't_pyth', 'tr_pyth'],
  rt_m7: ['t_pyth'], rt_m8: ['t_pyth'], rt_m9: ['t_special', 't_sum'],
  rt_m10: ['t_pyth'], rt_m11: ['t_special', 'tr_table', 'tr_soh'], rt_m12: ['t_special', 't_sum'],
  rt_m13: ['t_pyth'], rt_m14: ['t_special', 'tr_table', 'tr_soh'],
  rt_h1: ['tr_soh', 't_pyth', 'tr_pyth'], rt_h2: ['tr_soh', 't_area', 'dm_trig'],
  rt_h3: ['tr_soh', 't_pyth', 'tr_pyth'], rt_h4: ['t_special', 't_pyth'],
  rt_h5: ['t_special', 'tr_table', 'tr_soh'], rt_h6: ['tr_soh'],
  rt_h7: ['t_equi', 't_quad'], rt_h8: ['tr_soh'], rt_h9: ['t_equi'], rt_h10: ['t_pyth'],
  rt_h11: ['tr_soh', 'tr_sim', 't_pyth', 't_cong'], rt_h12: ['t_special', 't_pyth'],
  rt_h13: ['t_special', 'c_thales', 't_area'], rt_h14: ['t_equi'],
  rt_h15: ['t_special', 't_pyth'], rt_h16: ['tr_soh', 'tr_sim', 't_cong'], rt_h17: ['t_pyth'],
  rt_h18: ['tr_soh', 'tr_sim', 't_cong'], rt_h19: ['tr_comp', 'tr_soh'],
  rt_h20: ['t_special', 'tr_table', 'tr_soh', 't_cong'], rt_h21: ['t_pyth'],
  rt_h22: ['tr_comp', 'tr_wrap', 'dm_trig'], rt_h23: ['t_equi', 't_special', 't_pyth'],
  rt_h24: ['tr_soh', 'tr_pyth', 't_pyth', 't_cong'], rt_h25: ['tr_soh', 'tr_comp', 'tr_table'],
  rt_h26: ['t_pyth', 'tr_soh'], rt_h27: ['tr_soh', 'tr_comp', 'tr_sim'],
  rt_h28: ['t_pyth', 't_cong'], rt_h29: ['tr_comp', 'tr_pyth', 't_pyth'], rt_h30: ['tr_soh'],

  // ===== RATIOS, RATES & UNITS =====
  rat_e1: ['p_rates'], rat_e2: ['d_prob', 'd_study', 'p_rates'], rat_e3: ['p_rates', 'p_var'],
  rat_e4: ['p_rates'], rat_e5: ['p_rates'], rat_e6: ['p_rates'], rat_e7: ['p_rates'],
  rat_e8: ['p_units', 'p_rates'], rat_e9: ['p_rates'], rat_e10: ['p_units', 'p_rates'],
  rat_e11: ['a_slope', 'p_var', 'p_rates'], rat_e12: ['p_rates'], rat_e13: ['p_rates'],
  rat_e14: ['p_rates'], rat_e15: ['p_rates'], rat_e16: ['p_rates'], rat_e17: ['p_rates'],
  rat_e18: ['p_rates'], rat_e19: ['p_rates'], rat_e20: ['p_rates'],
  rat_m1: ['p_rates'], rat_m2: ['p_units', 'p_rates'], rat_m3: ['p_rates'],
  rat_m4: ['p_rates'], rat_m5: ['p_rates', 'a_chunk'], rat_m6: ['p_units', 'p_rates'],
  rat_m7: ['p_rates'], rat_m8: ['p_rates'], rat_m9: ['p_rates'],
  rat_m10: ['t_cong', 'p_rates'], rat_m11: ['p_units'], rat_m12: ['p_rates'],
  rat_m13: ['p_rates'], rat_m14: ['p_rates'], rat_m15: ['p_rates'], rat_m16: ['p_rates'],
  rat_m17: ['p_rates'], rat_m18: ['p_rates'], rat_m19: ['p_units', 'p_rates'], rat_m20: ['p_rates'],
  rat_h1: ['p_units', 'v_solids'], rat_h2: ['p_rates'], rat_h3: ['p_rates', 'p_units'],
  rat_h4: ['p_exp', 'dm_sliders'], rat_h5: ['p_rates', 'a_chunk'],
  rat_h6: ['p_units', 'v_solids'], rat_h7: ['p_units'], rat_h8: ['p_units', 'v_solids'],
  rat_h9: ['p_units'], rat_h10: ['p_units', 'v_solids'], rat_h11: ['p_rates', 'p_var'],
  rat_h12: ['t_cong', 'p_rates'], rat_h13: ['p_rates'], rat_h14: ['p_units', 'p_rates'],
  rat_h15: ['p_rates'], rat_h16: ['p_units', 'v_solids'], rat_h17: ['p_units'],

  // ===== PROBABILITY =====
  pr_e1: ['d_prob'], pr_e2: ['d_prob'], pr_e3: ['d_prob'], pr_e4: ['d_prob'],
  pr_e5: ['d_prob'], pr_e6: ['d_prob'], pr_e7: ['d_prob'], pr_e8: ['d_prob'],
  pr_e9: ['d_prob'], pr_e10: ['d_prob'], pr_e11: ['d_prob'], pr_e12: ['d_prob'],
  pr_e13: ['d_prob'], pr_e14: ['d_prob'], pr_e15: ['d_prob'], pr_e16: ['d_prob'],
  pr_e17: ['d_prob'], pr_e18: ['d_prob'], pr_e19: ['d_prob', 'p_pct'], pr_e20: ['d_prob'],
  pr_e21: ['d_prob'], pr_e22: ['d_prob'], pr_e23: ['d_prob'],
  pr_m1: ['d_prob'], pr_m2: ['d_prob'], pr_m3: ['d_prob'], pr_m4: ['d_prob'],
  pr_m5: ['d_prob', 'p_pct'], pr_m6: ['d_prob'], pr_m7: ['d_prob'],
  pr_m8: ['d_prob', 'p_pct'], pr_m9: ['d_prob', 'p_rates'], pr_m10: ['d_prob'],
  pr_m11: ['d_prob'], pr_m12: ['d_prob'], pr_m13: ['d_prob'], pr_m14: ['d_prob'],
  pr_h1: ['d_prob', 'dm_sliders'], pr_h2: ['d_prob'], pr_h3: ['d_prob', 'p_pct'],
  pr_h4: ['d_prob'], pr_h5: ['d_prob', 'a_num'], pr_h6: ['d_prob', 'p_pct'],
  pr_h7: ['d_prob'], pr_h8: ['d_prob'],

  // ===== PERCENTAGES =====
  pct_e1: ['p_pct'], pct_e2: ['p_pct'], pct_e3: ['p_pct'], pct_e4: ['p_pct'],
  pct_e5: ['p_pct'], pct_e6: ['p_pct'], pct_e7: ['p_pct', 'dm_geom'], pct_e8: ['p_pct', 'dm_geom'],
  pct_e9: ['p_pct', 'dm_geom'], pct_e10: ['p_pct'], pct_e11: ['p_pct'], pct_e12: ['p_pct'],
  pct_e13: ['p_pct'], pct_e14: ['p_pct'], pct_e15: ['p_pct'], pct_e16: ['p_pct'],
  pct_e17: ['p_pct'], pct_e18: ['p_pct'], pct_e19: ['p_pct'], pct_e20: ['p_pct'],
  pct_m1: ['p_pct'], pct_m2: ['p_pct', 'p_succ'], pct_m3: ['p_pct', 'p_rates'],
  pct_m4: ['p_pct'], pct_m5: ['p_pct'], pct_m6: ['p_pct'], pct_m7: ['p_pct'],
  pct_m8: ['p_pct'], pct_m9: ['p_pct'], pct_m10: ['p_pct'],
  pct_m11: ['p_pct', 'p_succ'], pct_m12: ['p_pct'], pct_m13: ['p_pct'],
  pct_m14: ['p_pct'], pct_m15: ['p_pct'], pct_m16: ['p_pct'], pct_m17: ['p_pct'],
  pct_m18: ['p_pct'], pct_m19: ['p_pct'], pct_m20: ['p_pct', 'p_exp'],
  pct_m21: ['p_pct'], pct_m22: ['p_pct'],
  pct_h1: ['p_pct'], pct_h2: ['p_pct'], pct_h3: ['p_pct'],
  pct_h4: ['p_pct', 'dm_bracket'], pct_h5: ['p_pct'], pct_h6: ['p_pct'],
  pct_h7: ['p_pct', 'dm_bracket'], pct_h8: ['p_pct'],
  pct_h9: ['p_pct', 'p_succ'], pct_h10: ['p_pct', 'p_succ'], pct_h11: ['p_pct'],
  pct_h12: ['p_pct', 'dm_bracket'], pct_h13: ['p_pct'], pct_h14: ['p_pct'],
  pct_h15: ['p_pct', 'p_succ'], pct_h16: ['p_pct'],
  pct_h17: ['p_pct', 'p_succ'], pct_h18: ['p_pct'], pct_h19: ['p_pct'],
  pct_h20: ['p_pct'], pct_h21: ['p_pct'], pct_h22: ['p_pct'],
  pct_h23: ['p_pct', 'p_succ'], pct_h24: ['p_pct'],
  pct_h25: ['p_pct', 'p_succ'], pct_h26: ['p_pct'],
  pct_h27: ['p_pct', 'p_succ'], pct_h28: ['p_pct', 'p_succ'],

  // ===== LINES, ANGLES & TRIANGLES =====
  lat_e1: ['t_cong'], lat_e2: ['t_ext'], lat_e3: ['t_ext'], lat_e4: ['t_sum', 'c_radii'],
  lat_e5: ['t_sum', 't_cong'], lat_e6: ['t_ext', 't_sum'], lat_e7: ['t_sum'],
  lat_e8: ['t_ext'], lat_e9: ['t_ext'], lat_e10: ['t_sum'], lat_e11: ['t_ext'],
  lat_e12: ['t_sum'], lat_e13: ['t_sum'], lat_e14: ['t_cong', 'p_rates'], lat_e15: ['t_sum'],
  lat_m1: ['t_ext'], lat_m2: ['t_cong'], lat_m3: ['t_cong', 'p_rates'], lat_m4: ['t_cong'],
  lat_m5: ['t_cong'], lat_m6: ['t_cong'], lat_m7: ['tr_comp', 't_cong'], lat_m8: ['t_cong'],
  lat_m9: ['t_ext'], lat_m10: ['t_cong'], lat_m11: ['t_sum'], lat_m12: ['t_cong', 't_sum'],
  lat_m13: ['t_cong'], lat_m14: ['t_sum'], lat_m15: ['t_ext'], lat_m16: ['t_ext', 't_sum'],
  lat_m17: ['t_cong'], lat_m18: ['t_sum', 't_cong'], lat_m19: ['t_sum', 't_ext'],
  lat_m20: ['t_sum', 't_cong'],
  lat_h1: ['t_sum', 't_ext', 'c_radii'], lat_h2: ['t_sum', 't_ext'], lat_h3: ['t_sum', 't_ext'],
  lat_h4: ['t_sum', 'c_radii'], lat_h5: ['t_alt', 't_pyth', 't_cong'],
  lat_h6: ['t_sum', 't_ext'], lat_h7: ['t_cong'], lat_h8: ['t_cong'],
  lat_h9: ['t_cong', 't_sum'], lat_h10: ['t_cong'], lat_h11: ['t_alt', 't_pyth'],
  lat_h12: ['t_cong'], lat_h13: ['t_ext'], lat_h14: ['t_ext'],
  lat_h15: ['t_sum', 't_ext'], lat_h16: ['t_cong'], lat_h17: ['t_area', 't_cong'],
  lat_h18: ['t_sum', 't_ext'], lat_h19: ['t_sum', 't_cong'], lat_h20: ['t_cong'],
  lat_h21: ['t_area', 't_cong'], lat_h22: ['t_cong'], lat_h23: ['t_ext', 't_poly'],
  lat_h24: ['t_ext', 't_sum'], lat_h25: ['t_pyth', 't_cong', 't_area'],

  // ===== EQUIVALENT EXPRESSIONS =====
  eq_e1: ['a_exp', 'dm_equiv'], eq_e2: ['a_fact', 'dm_equiv'], eq_e3: ['dm_equiv', 'd_meta'],
  eq_e4: ['dm_equiv', 'd_meta'], eq_e5: ['dm_equiv'], eq_e6: ['a_exp', 'dm_equiv'],
  eq_e7: ['dm_equiv'], eq_e8: ['dm_equiv'], eq_e9: ['dm_equiv'], eq_e10: ['dm_equiv'],
  eq_e11: ['a_fact', 'dm_equiv'], eq_e12: ['dm_equiv'], eq_e13: ['dm_equiv'],
  eq_e14: ['a_fact'], eq_e15: ['a_fact', 'dm_const'],
  eq_m1: ['dm_equiv'], eq_m2: ['dm_equiv', 'a_fact'], eq_m3: ['a_fact', 'dm_equiv'],
  eq_m4: ['a_fact', 'dm_equiv'], eq_m5: ['dm_equiv'], eq_m6: ['a_id', 'dm_equiv'],
  eq_m7: ['a_fact', 'dm_equiv'], eq_m8: ['a_fact', 'dm_const'], eq_m9: ['dm_equiv'],
  eq_m10: ['dm_equiv'], eq_m11: ['a_exp', 'dm_equiv'], eq_m12: ['dm_equiv'],
  eq_m13: ['a_id', 'dm_equiv'], eq_m14: ['dm_equiv'], eq_m15: ['a_exp', 'dm_equiv'],
  eq_m16: ['q_vert', 'dm_equiv'], eq_m17: ['a_fact', 'dm_const'], eq_m18: ['dm_equiv'],
  eq_m19: ['a_fact', 'dm_equiv'], eq_m20: ['a_exp', 'dm_equiv'],
  eq_h1: ['a_fact', 'dm_const'], eq_h2: ['a_fact', 'dm_equiv'], eq_h3: ['a_exp', 'dm_const'],
  eq_h4: ['a_partial', 'a_fact', 'dm_const'], eq_h5: ['a_exp', 'dm_const'],
  eq_h6: ['a_fact', 'dm_const'], eq_h7: ['a_partial', 'dm_equiv'],
  eq_h8: ['a_id', 'dm_const'], eq_h9: ['a_fact', 'dm_const'], eq_h10: ['a_fact', 'dm_const'],
  eq_h11: ['a_fact', 'q_vieta'], eq_h12: ['a_fact', 'dm_equiv'], eq_h13: ['a_exp', 'dm_equiv'],
  eq_h14: ['q_nosol', 'a_num'], eq_h15: ['a_fact', 'a_asym', 'dm_equiv'],
  eq_h16: ['a_id', 'dm_const'], eq_h17: ['a_exp', 'dm_const'], eq_h18: ['a_exp', 'dm_sliders'],
  eq_h19: ['a_id', 'dm_equiv'], eq_h20: ['a_partial', 'dm_equiv'], eq_h21: ['a_fact', 'dm_sliders'],
  eq_h22: ['a_fact', 'dm_const'], eq_h23: ['a_fact', 'dm_const'],
  eq_h24: ['a_partial', 'dm_equiv'], eq_h25: ['a_fact', 'dm_const'],

  // ===== CIRCLES =====
  cir_e1: ['tr_table', 'tr_unit', 'tr_wrap', 'dm_trig', 'dm_trigmode'],
  cir_e2: ['c_arc', 'c_std'],
  cir_e3: ['c_std', 'dm_circle'],
  cir_m1: ['c_std', 'dm_circle'], cir_m2: ['c_std'], cir_m3: ['tr_angles'],
  cir_m4: ['c_arc', 'c_std'], cir_m5: ['c_std', 'dm_circle'], cir_m6: ['tr_angles'],
  cir_m7: ['c_eq', 'c_std', 'dm_circle'], cir_m8: ['tr_angles'], cir_m9: ['tr_angles'],
  cir_m10: ['tr_angles'], cir_m11: ['c_std', 'dm_circle'], cir_m12: ['tr_angles', 'tr_unit', 'tr_axes'],
  cir_m13: ['c_arc', 'c_std'], cir_m14: ['c_std', 't_box', 'dm_circle'],
  cir_m15: ['c_std', 'dm_circle'],
  cir_h1: ['c_tangents', 'a_slope', 'c_std'], cir_h2: ['c_radii', 't_sum'],
  cir_h3: ['c_arc', 'c_std'], cir_h4: ['c_eq', 'c_std', 'dm_circle'],
  cir_h5: ['tr_unit', 'tr_axes', 'tr_wrap'], cir_h6: ['c_std', 'dm_circle'],
  cir_h7: ['c_eq', 'c_std', 'dm_circle'], cir_h8: ['c_radii', 't_sum', 'c_arc'],
  cir_h9: ['c_std', 'c_axes', 't_box', 'dm_geom'], cir_h10: ['c_std'], cir_h11: ['c_std'],
  cir_h12: ['c_std'], cir_h13: ['c_std'], cir_h14: ['c_inscribed', 'c_arc'],
  cir_h15: ['c_std'], cir_h16: ['c_tangents', 'a_slope', 'c_std'],
  cir_h17: ['c_std', 'q_shift', 'dm_circle'], cir_h18: ['c_radii', 't_sum'],
  cir_h19: ['c_eq', 'c_std', 'dm_circle'], cir_h20: ['c_std'],
  cir_h21: ['c_std', 'q_shift', 'dm_circle'], cir_h22: ['c_std', 'q_shift', 'dm_circle'],
  cir_h23: ['tr_table', 'tr_unit', 'tr_wrap', 'dm_trig', 'dm_trigmode'],
  cir_h24: ['c_tangents', 't_pyth'], cir_h25: ['c_arc', 'c_std'],
  cir_h26: ['c_axes', 'c_std', 'dm_circle'], cir_h27: ['c_axes', 'c_std', 't_box', 'dm_geom'],
  cir_h28: ['c_eq', 'c_std', 'dm_circle'], cir_h29: ['c_radii', 't_special', 't_pyth'],
  cir_h30: ['c_std', 'q_shift', 'dm_circle'], cir_h31: ['c_arc', 'c_std'],

  // ===== AREA & VOLUME (up to av_h19) =====
  av_e1: ['t_area'], av_e2: ['t_special', 't_area'], av_e3: ['t_area'], av_e4: ['t_cong'],
  av_e5: ['t_area'], av_e6: ['v_solids'], av_e7: ['t_area'], av_e8: ['t_sum'],
  av_e9: ['t_area'], av_e10: ['t_cong'], av_e11: ['t_area'], av_e12: ['t_cong'],
  av_e13: ['t_area'], av_e14: ['t_sum'], av_e15: ['t_area'], av_e16: ['v_solids'],
  av_e17: ['t_sum'], av_e18: ['t_area'], av_e19: ['t_area'], av_e20: ['t_area'],
  av_m1: ['v_sa'], av_m2: ['v_solids'], av_m3: ['c_std', 't_area'], av_m4: ['t_cong'],
  av_m5: ['c_std'], av_m6: ['c_std'], av_m7: ['c_std', 'dm_reg'], av_m8: ['v_solids'],
  av_m9: ['v_solids'], av_m10: ['t_area'], av_m11: ['v_solids'], av_m12: ['v_solids'],
  av_m13: ['v_solids'], av_m14: ['t_cong'], av_m15: ['v_disp', 'v_solids', 'p_pct'],
  av_m16: ['v_solids'], av_m17: ['v_solids'], av_m18: ['t_cong'], av_m19: ['c_std'],
  av_m20: ['c_std'], av_m21: ['c_std'], av_m22: ['t_cong'], av_m23: ['v_solids'],
  av_m24: ['t_area'], av_m25: ['t_area'],
  av_h1: ['t_cong'], av_h2: ['v_solids'], av_h3: ['v_solids', 'c_std'],
  av_h4: ['v_solids', 'v_diag'], av_h5: ['v_disp', 'v_solids'],
  av_h6: ['t_cong', 'v_solids', 'v_sa'], av_h7: ['t_cong'],
  av_h8: ['c_std', 'dm_reg'], av_h9: ['t_cong'], av_h10: ['v_solids', 'v_sa'],
  av_h11: ['v_solids'], av_h12: ['v_sa'], av_h13: ['v_solids'], av_h14: ['t_cong'],
  av_h15: ['t_cong'], av_h16: ['v_disp', 'p_pct', 't_cong'], av_h17: ['v_sa'],
  av_h18: ['v_solids'], av_h19: ['v_solids', 'v_sa', 't_pyth'],

  // ===== ONE-VARIABLE DATA (from starter) =====
  ovd_e5: ['d_mean', 'd_stats'], ovd_m14: ['d_stats', 'd_shift', 'd_box'], ovd_h12: ['d_mean', 'd_stats']
};
