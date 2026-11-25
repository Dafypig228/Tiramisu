window.SAT_FORMULAS = [
  // ==================== DESMOS COMPLETE PLAYBOOK ====================
  {
    id: 'dm_const',
    topic: 'desmos',
    title: 'Desmos: Find Missing Constants (~)',
    math: '$x_1=[2,3,5,7],\\;\\; \\text{Left}(x_1)\\sim\\text{Right}(x_1)$',
    note: 'If two expressions are equal for all x (like (ax+b)(2x-3) = 6x²+cx-12), make a list x1=[2,3,5,7] and replace = with ~. Desmos solves a, b, and c at once!',
    trap: 'Never use x, y, e, or i as unknown letters. For huge powers like x^14, use small decimals x1=[0.5, 0.7, 0.9].',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="14" width="74" height="50" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="14" y="34" font-size="10" font-weight="bold">x1=[2,3,5,7]</text><text x="14" y="52" font-size="11" font-weight="bold">L(x1)~R(x1)</text></svg>`
  },
  {
    id: 'dm_bracket',
    topic: 'desmos',
    title: 'Desmos: Multi-Equation Solver [ ] ~ [ ]',
    math: '$[a, b] \\sim [\\text{eq}_1,\\; \\text{eq}_2]$',
    note: 'Solves 2+ equations or multi-step % problems together. Example: "a is 2241% of (b+c), b is 83% of c" → type c=1, then [a,b] ~ [22.41(b+c), 0.83c].',
    trap: 'Make sure both sides inside [ ] are in the exact same order.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="8" y="16" width="74" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="13" y="36" font-size="10" font-weight="bold">[a, b] ~</text><text x="13" y="52" font-size="10" font-weight="bold">[eq1, eq2]</text></svg>`
  },
  {
    id: 'dm_reg',
    topic: 'desmos',
    title: 'Desmos: Curve Fitting from Points',
    math: '$y_1\\sim mx_1+b \\;|\\; y_1\\sim ax_1^2+bx_1+c \\;|\\; y_1\\sim ab^{x_1}$',
    note: 'Click + → Table and enter the given (x, y) points. Use y1~mx1+b for a line, ax1²+bx1+c for a parabola, or ab^x1 for exponential. Then type f(x)=... to plug in new x values.',
    trap: 'If x values are huge years like 2010 and 2020, exponential fit can fail—enter 0 and 10 instead.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="62" x2="78" y2="62" stroke="#9ca3af"/><line x1="18" y1="12" x2="18" y2="68" stroke="#9ca3af"/><path d="M20 56 Q45 14 74 44" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="28" cy="44" r="2.5"/><circle cx="46" cy="28" r="2.5"/><circle cx="68" cy="40" r="2.5"/></svg>`
  },
  {
    id: 'dm_sliders',
    topic: 'desmos',
    title: 'Desmos: Solve Any Equation & Sliders',
    math: '$y=\\text{Left Side},\\;\\; y=\\text{Right Side}$',
    note: 'To solve any ugly equation, graph y = Left Side and y = Right Side, then click the gray intersection dot—its x-value is the answer! Use a slider for unknown k to find when lines are parallel or touch once.',
    trap: 'Rename letters like p or t to x before graphing so Desmos draws them cleanly.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="54" x2="74" y2="20" stroke="#111" stroke-width="1.5"/><line x1="16" y1="22" x2="72" y2="56" stroke="#111" stroke-width="1.5"/><circle cx="44" cy="38" r="3.5" fill="#6b7280"/></svg>`
  },
  {
    id: 'dm_equiv',
    topic: 'desmos',
    title: 'Desmos: Equivalent Expressions Overlap',
    math: '$f(x)=\\text{Question},\\;\\; g(x)=\\text{Choice}$',
    note: 'Graph the question expression, then graph each answer choice. The right answer completely covers the original curve. If there is a second letter y, set a slider y = 2.71.',
    trap: 'Never set y = 0, 1, or 2 because 2+2 = 2×2 = 2², which can trick you into a false match.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 58 Q45 14 76 58" fill="none" stroke="#9ca3af" stroke-width="4"/><path d="M14 58 Q45 14 76 58" fill="none" stroke="#111" stroke-width="1.5" stroke-dasharray="3 2"/><text x="20" y="70" font-size="8">exact overlap</text></svg>`
  },
  {
    id: 'dm_hybrid',
    topic: 'desmos',
    title: 'Desmos: Positive Roots & Integer Sliders',
    math: '$k^2\\sim 25\\{k\\gt 0\\}$',
    note: 'Add {k > 0} to force Desmos to pick the positive answer. If there are 2 unknown integers j and k, make j a slider (step 1) and use ~ to solve for k until k becomes a whole number.',
    trap: 'Regression (~) only gives one solution—graph y=Left and y=Right when you need ALL solutions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="28" x2="76" y2="28" stroke="#9ca3af" stroke-width="2"/><circle cx="52" cy="28" r="4.5" fill="#111"/><text x="14" y="54" font-size="10" font-weight="bold">j=1,2.. {k&gt;0}</text></svg>`
  },
  {
    id: 'dm_freq',
    topic: 'desmos',
    title: 'Desmos: Frequency Tables & Box Stats',
    math: '$A=\\text{repeat}(V, F),\\;\\; \\text{stats}(A)$',
    note: 'If a table shows values V and how often they appear F, type A = repeat(V, F) to build the full list. Then type mean(A), median(A), stdev(A), or stats(A) for min, Q1, median, Q3, and max.',
    trap: 'stdev(A) is sample SD; stdevp(A) is whole population SD. Use Gear → Duplicate list to test adding/removing an outlier.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="10" font-weight="bold">repeat(V,F)</text><text x="10" y="46" font-size="10" font-weight="bold">stats(A)</text><text x="10" y="61" font-size="9">mean · stdevp</text></svg>`
  },
  {
    id: 'dm_seq',
    topic: 'desmos',
    title: 'Desmos: Lists, Sums (Σ) & Filters',
    math: '$[1,2...100] \\;|\\; [2^i \\text{ for } i=[1...10]]$',
    note: 'Type [1,2...100] to auto-fill a sequence, or type sum on your keyboard to add terms with Σ. Useful list tools: sort(L), length(L), total(L), and L[L > 5] to keep only values above 5.',
    trap: 'Type /, ^, sqrt, nthroot, abs, pi, and sum directly—never waste time clicking the on-screen keypad.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="13" font-weight="bold">Σ · Π</text><text x="12" y="52" font-size="10" font-weight="bold">[3,7...99]</text></svg>`
  },
  {
    id: 'dm_geom',
    topic: 'desmos',
    title: 'Desmos: Geometry, Remainders & nCr',
    math: '$\\text{distance}(A,B),\\; \\text{midpoint}(A,B),\\; \\text{mod}(a,b)$',
    note: 'Desmos has built-in tools: distance((x1,y1),(x2,y2)), midpoint, polygon(A,B,C), mod(a,b) for remainders, gcd(a,b), lcm(a,b), nCr(n,r), nPr(n,r), and "35% of 240".',
    trap: 'Click the little fraction circle icon next to any decimal answer to turn it into an exact fraction.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="20" y1="54" x2="70" y2="22" stroke="#111" stroke-width="1.6"/><circle cx="20" cy="54" r="2.5"/><circle cx="70" cy="22" r="2.5"/><circle cx="45" cy="38" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },
  {
    id: 'dm_circle',
    topic: 'desmos',
    title: 'Desmos: Instant Circle & Inequalities',
    math: '$C=\\text{midpoint}(A,B),\\;\\; r=\\frac{\\text{distance}(A,B)}{2}$',
    note: 'Type ANY messy circle equation right into Desmos. Click the leftmost and rightmost dots (A and B) to find the exact center and radius without algebra. For inequalities, plot choice points (x,y) to see which sits in the overlap.',
    trap: 'If a dot lands right on the border line, check if the line is dashed (not included) or solid (included).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="25" fill="none" stroke="#111" stroke-width="1.5"/><line x1="20" y1="39" x2="70" y2="39" stroke="#111" stroke-dasharray="3 2"/><circle cx="20" cy="39" r="2.5"/><circle cx="70" cy="39" r="2.5"/><circle cx="45" cy="39" r="2.5" fill="#fff" stroke="#111"/></svg>`
  },
  {
    id: 'dm_trigmode',
    topic: 'desmos',
    title: 'Desmos: Degree vs Radian Safety Check',
    math: '$\\sin(30)=0.5\\;(\\text{Degrees}) \\;|\\; -0.988\\;(\\text{Radians})$',
    note: 'Never guess which mode Desmos is in! Type sin(30) or click the top-right Wrench icon to switch between Degrees and Radians. To check if a function is even or odd, compare f(-x) with f(x) and -f(x).',
    trap: 'Do not type f\'(x) on Bluebook Desmos—it throws an error in some test versions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="36" font-size="10" font-weight="bold">sin(30)=0.5?</text><text x="15" y="52" font-size="9">Wrench: Deg/Rad</text></svg>`
  },

  // ==================== TRIGONOMETRY ====================
  {
    id: 'tr_unit',
    topic: 'trig',
    title: 'Unit Circle & Signs by Quadrant (ASTC)',
    math: '$(x, y) = (\\cos\\theta,\\; \\sin\\theta)$',
    note: 'On a radius-1 circle, x is cosine, y is sine, and slope (y/x) is tangent. Positive functions by quadrant ("All Students Take Calculus"): Q1 All +, Q2 Sin +, Q3 Tan +, Q4 Cos +.',
    trap: 'Check which quadrant the angle ends in before picking + or -.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="8" y1="39" x2="82" y2="39" stroke="#9ca3af"/><line x1="45" y1="6" x2="45" y2="72" stroke="#9ca3af"/><circle cx="45" cy="39" r="26" fill="none" stroke="#111" stroke-width="1.5"/><text x="56" y="26" font-size="10" font-weight="bold">A</text><text x="27" y="26" font-size="10" font-weight="bold">S</text><text x="27" y="57" font-size="10" font-weight="bold">T</text><text x="56" y="57" font-size="10" font-weight="bold">C</text></svg>`
  },
  {
    id: 'tr_angles',
    topic: 'trig',
    title: 'Special Angles & Radians to Degrees',
    math: '$\\pi\\text{ rad}=180^\\circ,\\;\\; \\text{Rad}=\\text{Deg}\\cdot\\frac{\\pi}{180}$',
    note: 'Quick trick: replace pi with 180° to convert radians instantly (ex: 2pi/3 = 2×180°/3 = 120°). Key values: 30°(pi/6): sin=1/2, cos=√3/2; 45°(pi/4): both √2/2; 60°(pi/3): sin=√3/2, cos=1/2.',
    trap: 'sin 0°=0, cos 0°=1, sin 90°=1, cos 90°=0, and tan 90° is undefined.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 64 L76 64 M18 64 L18 10" stroke="#9ca3af"/><path d="M70 64 A52 52 0 0 0 18 12" fill="none" stroke="#111" stroke-width="1.5"/><line x1="18" y1="64" x2="64" y2="38" stroke="#111"/><line x1="18" y1="64" x2="54" y2="27" stroke="#111"/><line x1="18" y1="64" x2="44" y2="18" stroke="#111"/><text x="66" y="38" font-size="8">30°</text><text x="56" y="26" font-size="8">45°</text><text x="45" y="16" font-size="8">60°</text></svg>`
  },
  {
    id: 'tr_soh',
    topic: 'trig',
    title: 'SOH CAH TOA & Similar Triangles',
    math: '$\\sin=\\frac{\\text{opp}}{\\text{hyp}},\\;\\; \\cos=\\frac{\\text{adj}}{\\text{hyp}},\\;\\; \\tan=\\frac{\\text{opp}}{\\text{adj}}$',
    note: 'Opposite = across from the angle; Adjacent = touching the angle; Hypotenuse = longest side across from 90°. Trig depends ONLY on the angle—if a big triangle contains a smaller similar triangle, their sin/cos/tan are identical!',
    trap: 'A line through (0,0) at angle θ has slope = tan(θ).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="16,18 16,60 76,60" fill="none" stroke="#111" stroke-width="1.5"/><rect x="16" y="51" width="9" height="9" fill="none" stroke="#111"/><text x="3" y="42" font-size="8">opp</text><text x="40" y="70" font-size="8">adj</text><text x="46" y="35" font-size="8">hyp</text></svg>`
  },
  {
    id: 'tr_comp',
    topic: 'trig',
    title: 'Complementary Angles: sin(A) = cos(B)',
    math: '$\\sin A = \\cos B \\iff A + B = 90^\\circ\\;\\left(\\text{or }\\frac{\\pi}{2}\\right)$',
    note: 'In any right triangle, the two acute angles add to 90°, and sin of one equals cos of the other. Shortcut: whenever you see sin(expr1) = cos(expr2), just set expr1 + expr2 = 90° and solve!',
    trap: 'Example: sin(2x) = cos(x + 15°) → 2x + x + 15 = 90 → x = 25°. Check deg vs rad!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><text x="22" y="32" font-size="9">B</text><text x="53" y="58" font-size="9">A</text></svg>`
  },
  {
    id: 'tr_wrap',
    topic: 'trig',
    title: 'Pythagorean Identity & 180°/360° Wrap',
    math: '$\\sin^2\\theta+\\cos^2\\theta=1 \\;|\\; \\cos(180^\\circ-\\theta)=-\\cos\\theta$',
    note: 'Adding or subtracting 360° (2pi) gives the exact same sin and cos (180°/pi for tan). For supplementary angles (adding to 180°): sin stays positive, while cos flips to negative.',
    trap: 'Given sin x = 3/5, draw a 3-4-5 right triangle right away to read cos x = 4/5 and tan x = 3/4.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="3 2"/><path d="M45 11 A28 28 0 1 1 20 26" fill="none" stroke="#111" stroke-width="1.6"/><polygon points="18,22 24,25 19,30" fill="#111"/><text x="34" y="43" font-size="10">+2πk</text></svg>`
  },
  {
    id: 'tr_laws',
    topic: 'trig',
    title: 'Area of Any Triangle Using Sine',
    math: '$\\text{Area}=\\frac{1}{2}ab\\sin C \\;|\\; c^2=a^2+b^2-2ab\\cos C$',
    note: 'You can find the area of any triangle without knowing its height if you know two sides (a, b) and the angle C between them. Law of Sines: a/sin A = b/sin B = c/sin C.',
    trap: 'Angle C MUST be the corner trapped between sides a and b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,60 32,16 78,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="19" y="40" font-size="9">a</text><text x="44" y="70" font-size="9">b</text><text x="23" y="56" font-size="9">C</text></svg>`
  },

  // ==================== CIRCLES ====================
  {
    id: 'c_std',
    topic: 'circles',
    title: 'Circle Area, Circumference & Standard Eq',
    math: '$(x-h)^2+(y-k)^2=r^2 \\;|\\; A=\\pi r^2,\\;\\; C=2\\pi r$',
    note: 'Center (h, k) has the OPPOSITE signs from inside the parentheses, and the right side is r² (not r). Example: (x-3)²+(y+5)²=16 has center (3, -5) and radius 4.',
    trap: 'If the circle touches the x-axis, radius = |k|. If it touches the y-axis, radius = |h|.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="50" x2="80" y2="50" stroke="#9ca3af"/><line x1="32" y1="10" x2="32" y2="70" stroke="#9ca3af"/><circle cx="52" cy="34" r="20" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="52" cy="34" r="2"/><line x1="52" y1="34" x2="72" y2="34" stroke="#111" stroke-dasharray="2 2"/><text x="45" y="46" font-size="8">(h,k)</text></svg>`
  },
  {
    id: 'c_eq',
    topic: 'circles',
    title: 'Expanded Circle Eq Shortcut (No Algebra)',
    math: '$x^2+Dx+y^2+Ey+F=0 \\implies C=\\left(-\\frac{D}{2},-\\frac{E}{2}\\right)$',
    note: 'Skip completing the square! Take half of D and E and flip their signs to get the center. Then r² = (D/2)² + (E/2)² - F. Example: x²-6x+y²+8y+9=0 → center (3,-4), r² = 9+16-9 = 16, so r = 4.',
    trap: 'If x² and y² have a number in front (like 2x²+2y²), divide the whole equation by 2 first!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="24" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="45" cy="39" r="2.2"/><text x="21" y="34" font-size="8">(-D/2,-E/2)</text></svg>`
  },
  {
    id: 'c_radii',
    topic: 'circles',
    title: 'Equal Radii & Chord Perpendicular Bisector',
    math: '$OA = OB = r \\;|\\; \\text{Central } 60^\\circ\\to r,\\; 90^\\circ\\to r\\sqrt{2},\\; 120^\\circ\\to r\\sqrt{3}$',
    note: 'Two radii drawn to a chord always make an isosceles triangle (equal base angles). A line from the center perpendicular to a chord ALWAYS cuts that chord in half, forming a right triangle with r as the hypotenuse.',
    trap: 'Whenever a diagram shows extra points on the circle, draw a radius to them—its length is always r.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="39" x2="20" y2="23" stroke="#111" stroke-width="1.5"/><line x1="45" y1="39" x2="70" y2="23" stroke="#111" stroke-width="1.5"/><line x1="20" y1="23" x2="70" y2="23" stroke="#111" stroke-width="1.2"/><line x1="45" y1="39" x2="45" y2="23" stroke="#111" stroke-dasharray="3 2"/><text x="27" y="21" font-size="9">α</text><text x="58" y="21" font-size="9">α</text><text x="47" y="56" font-size="9">r</text></svg>`
  },
  {
    id: 'c_arc',
    topic: 'circles',
    title: 'Arc Length (Degrees & Radians)',
    math: '$\\text{Arc}=\\frac{\\theta}{360^\\circ}\\cdot 2\\pi r \\;|\\; \\text{In radians: } s=r\\theta$',
    note: 'Arc length is just a fraction of the circumference! With degrees, divide angle by 360° and multiply by 2pi r. With radians, just multiply radius × angle (s = rθ).',
    trap: 'Arc length is part of the edge (2pi r), NOT the area (pi r²).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="29" fill="none" stroke="#9ca3af"/><path d="M45 39 L68 21 A29 29 0 0 0 22 21 Z" fill="rgba(0,0,0,0.06)" stroke="#111" stroke-width="1.4"/><path d="M22 21 A29 29 0 0 1 68 21" fill="none" stroke="#111" stroke-width="2.6"/><text x="41" y="29" font-size="10">θ</text></svg>`
  },
  {
    id: 'c_sector',
    topic: 'circles',
    title: 'Sector (Pizza Slice) & Segment Area',
    math: '$A_{\\text{sec}}=\\frac{\\theta}{360^\\circ}\\cdot\\pi r^2 \\;|\\; \\text{In radians: } \\frac{1}{2}r^2\\theta$',
    note: 'Sector area is a fraction of the total circle area (pi r²). If you need the small cap between a chord and an arc ("segment"), find Sector Area minus Triangle Area.',
    trap: 'Watch out for "major arc" vs "minor arc": subtract the given angle from 360° if it asks for the bigger slice.',
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
    title: 'Inscribed Angle, Thales 90° & Cyclic Quad',
    math: '$\\text{Central}=2\\times\\text{Inscribed} \\;|\\; A+C=180^\\circ$',
    note: 'An angle with its tip at the center is DOUBLE an angle on the edge looking at the same arc. Any triangle built on a diameter is a 90° right triangle. Any 4-sided shape inside a circle has opposite angles adding to 180°.',
    trap: 'Make sure the corner is actually touching the circle edge, not floating inside.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="39" r="28" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 45,39 70,50" fill="none" stroke="#111" stroke-width="1.4"/><polyline points="67,21 19,52 70,50" fill="none" stroke="#111" stroke-width="1.3"/><text x="48" y="42" font-size="9">2x</text><text x="27" y="50" font-size="9">x</text></svg>`
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
    note: 'A line tangent to a circle always meets the radius at 90°. Two tangent lines from the same outside point P have equal lengths (PA = PB), and the central angle at O plus the tip angle at P always add to 180°.',
    trap: 'Draw a line from center O to P to split the shape into two identical right triangles.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="32" cy="39" r="18" fill="none" stroke="#111" stroke-width="1.4"/><line x1="32" y1="39" x2="40" y2="23" stroke="#111"/><line x1="32" y1="39" x2="40" y2="55" stroke="#111"/><line x1="40" y1="23" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><line x1="40" y1="55" x2="78" y2="39" stroke="#111" stroke-width="1.5"/><text x="79" y="42" font-size="9">P</text></svg>`
  },

  // ==================== TRIANGLES, POLYGONS & COORDINATES ====================
  {
    id: 't_sum',
    topic: 'triangles',
    title: 'Triangle Angle Sum & Side Inequality',
    math: '$a+b+c=180^\\circ \\;|\\; |a-b|\\lt c\\lt a+b$',
    note: 'The 3 inside angles always add to 180°. To form a real triangle, the 3rd side c MUST be strictly bigger than the difference of the other two sides and strictly smaller than their sum. Example: sides 4 and 9 → 3rd side is between 5 and 13.',
    trap: 'Equal (=) makes a flat line, not a triangle! In isosceles △s, check if the given angle is the top or a base angle.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="45,12 14,64 76,64" fill="none" stroke="#111" stroke-width="1.5"/><text x="42" y="29" font-size="10">b</text><text x="24" y="59" font-size="10">a</text><text x="61" y="59" font-size="10">c</text></svg>`
  },
  {
    id: 't_pyth',
    topic: 'triangles',
    title: 'Pythagorean Triples & GCF Speed Trick',
    math: '$a^2+b^2=c^2$',
    note: 'Memorize triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 9-40-41 (and multiples like 6-8-10). Big numbers? Divide both legs by their greatest common factor first! Ex: legs 24 and 21 → divide by 3 → 8 and 7 → hyp = √(64+49) = √113 → multiply back by 3 = 3√113.',
    trap: 'Make sure c is the longest side (across from 90°), not one of the legs.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,16 18,62 74,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="7" y="42" font-size="9">a</text><text x="44" y="72" font-size="9">b</text><text x="48" y="36" font-size="9">c</text></svg>`
  },
  {
    id: 't_special',
    topic: 'triangles',
    title: '30-60-90 & 45-45-90 Triangles',
    math: '$30\\text{-}60\\text{-}90: x,\\;x\\sqrt{3},\\;2x \\;|\\; 45\\text{-}45\\text{-}90: x,\\;x,\\;x\\sqrt{2}$',
    note: '45-45-90 (half a square): if hypotenuse is d, each leg is d√2/2 and area is d²/4. 30-60-90 (half an equilateral △): if the medium leg (opposite 60°) is L, the short leg is L√3/3. Also, a median to the hypotenuse is always half the hypotenuse.',
    trap: 'If a 45-45-90 perimeter is written as A + A√2, then its hypotenuse is instantly A!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="18,12 18,62 72,62" fill="none" stroke="#111" stroke-width="1.5"/><rect x="18" y="53" width="9" height="9" fill="none" stroke="#111"/><text x="2" y="40" font-size="9">x√3</text><text x="42" y="72" font-size="9">x</text><text x="48" y="34" font-size="9">2x</text></svg>`
  },
  {
    id: 't_alt',
    topic: 'triangles',
    title: 'Altitude in a Right Triangle (3 Similar △s)',
    math: '$h^2=p\\cdot q,\\;\\; a^2=p\\cdot c,\\;\\; b^2=q\\cdot c,\\;\\; a\\cdot b=c\\cdot h$',
    note: 'Dropping a height h from the 90° corner to hypotenuse c splits c into pieces p (under leg a) and q (under leg b), making 3 similar right triangles. Fast area trick: (leg a × leg b) always equals (hypotenuse c × height h)!',
    trap: 'Also useful: label angles α and 90°-α around any rectangle or circle to spot matching similar right triangles.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 34,18 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="34" y1="18" x2="34" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="36" y="44" font-size="9">h</text><text x="22" y="68" font-size="8">p</text><text x="53" y="68" font-size="8">q</text></svg>`
  },
  {
    id: 't_equi',
    topic: 'triangles',
    title: 'Equilateral △, Hexagon & Circle Fit',
    math: '$A_\\triangle=\\frac{s^2\\sqrt{3}}{4},\\;\\; h=\\frac{s\\sqrt{3}}{2},\\;\\; A_{\\text{hex}}=\\frac{3\\sqrt{3}}{2}s^2$',
    note: 'For an equilateral △ of side s: circumscribed circle radius R = s/√3, inscribed circle radius r = s/(2√3) (notice R = 2r). Regular hexagon = 6 equilateral △s (long diagonal = 2s, short = s√3). Square inside circle(r): side s = r√2, area = 2r².',
    trap: 'Circle inside a square of side s simply has radius r = s/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="45" cy="43" r="27" fill="none" stroke="#9ca3af"/><circle cx="45" cy="43" r="13.5" fill="none" stroke="#9ca3af"/><polygon points="45,16 22,56 68,56" fill="none" stroke="#111" stroke-width="1.5"/><line x1="45" y1="16" x2="45" y2="56" stroke="#111" stroke-dasharray="2 2"/><text x="26" y="38" font-size="9">s</text><text x="47" y="42" font-size="9">h</text></svg>`
  },
  {
    id: 't_area',
    topic: 'triangles',
    title: 'Area, Heron, Shared Height & Bisector',
    math: '$A=\\frac{1}{2}bh=\\sqrt{s(s-a)(s-b)(s-c)}$',
    note: 'Heron finds area from 3 sides alone: let s = (a+b+c)/2, then √(s(s-a)(s-b)(s-c)). If two triangles share the same top vertex/height, their Areas have the same ratio as their Bases! An angle bisector splits the opposite side in the exact ratio of the two adjacent sides.',
    trap: 'Inscribed circle radius inside ANY triangle: Area = r × s (where s is half the perimeter).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="14,58 42,16 76,58" fill="none" stroke="#111" stroke-width="1.5"/><line x1="42" y1="16" x2="50" y2="58" stroke="#111" stroke-dasharray="3 2"/><text x="27" y="68" font-size="8">b1</text><text x="60" y="68" font-size="8">b2</text></svg>`
  },
  {
    id: 't_quad',
    topic: 'triangles',
    title: 'Trapezoid, Kite & Tilted Square',
    math: '$A_{\\text{trap}}=\\frac{b_1+b_2}{2}h \\;|\\; A_{\\text{kite}}=\\frac{d_1d_2}{2} \\;|\\; A_{\\text{tilt}}=a^2+b^2$',
    note: 'Trapezoid area = average of parallel bases × height. Any shape with perpendicular diagonals (square, rhombus, kite) has area = (diag1 × diag2)/2. If a tilted square sits inside a larger square, the 4 corner right triangles are identical (legs a and b), and inner area = a²+b².',
    trap: 'Parallelogram area is base × perpendicular height (NOT slanted side), or a·b·sin(θ).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="52" height="52" fill="none" stroke="#9ca3af"/><polygon points="34,14 70,30 54,66 18,50" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/><text x="23" y="21" font-size="8">a</text><text x="11" y="34" font-size="8">b</text></svg>`
  },
  {
    id: 't_ext',
    topic: 'triangles',
    title: 'Exterior Angles, Polygons & Parallel Lines',
    math: '$x=a+b \\;|\\; \\text{Interior Sum}=180^\\circ(n-2) \\;|\\; \\text{Ext}=\\frac{360^\\circ}{n}$',
    note: 'Triangle exterior angle = sum of the 2 far interior angles. Parallel lines only create 2 angle sizes (equal or adding to 180°). Between parallel lines, a zig-zag obeys: sum of Left-pointing angles = sum of Right-pointing angles.',
    trap: 'Fastest way to get one angle of a regular n-sided polygon: find exterior 360°/n, then subtract from 180°. Total diagonals = n(n-3)/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="18" x2="78" y2="18" stroke="#111" stroke-width="1.5"/><line x1="12" y1="60" x2="78" y2="60" stroke="#111" stroke-width="1.5"/><polyline points="30,18 58,39 28,60" fill="none" stroke="#111" stroke-width="1.5"/><text x="61" y="42" font-size="8">L=R</text></svg>`
  },
  {
    id: 't_cong',
    topic: 'triangles',
    title: 'Similarity, Congruence & k, k², k³ Scaling',
    math: '$\\text{Lengths}\\times k \\implies \\text{Area}\\times k^2 \\implies \\text{Volume}\\times k^3$',
    note: 'If you scale all sides of a shape by k (ex: double them, k=2), the area becomes 4× larger (k²) and volume becomes 8× larger (k³)! In a triangle cut by a parallel line: side pieces match top/bottom = top/bottom, while parallel bases use small/BIG = top/WHOLE.',
    trap: 'Congruence proofs are SSS, SAS, ASA, AAS, HL. AAA and SSA do NOT prove congruence.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><polygon points="8,58 22,18 38,58" fill="none" stroke="#111" stroke-width="1.4"/><polygon points="50,58 64,18 80,58" fill="none" stroke="#111" stroke-width="1.4"/><text x="41" y="42" font-size="10">~</text></svg>`
  },
  {
    id: 't_box',
    topic: 'triangles',
    title: 'Coordinate Distance, Shoelace & Box Area',
    math: '$d=\\sqrt{\\Delta x^2+\\Delta y^2} \\;|\\; A=\\frac{1}{2}|x_1y_2-x_2y_1|$',
    note: 'To find the area of any tilted triangle from coordinates: (1) Box Method: draw a tight rectangle around the 3 points and subtract the 3 outer right triangles; OR (2) Shoelace: shift one point to (0,0) by subtracting it from the other two, then use 1/2|x1y2 - x2y1|.',
    trap: 'Remember the 1/2 in Shoelace and always shift one point to (0,0) first!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="14" width="58" height="48" fill="none" stroke="#9ca3af" stroke-dasharray="3 2"/><polygon points="16,32 74,14 54,62" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 't_trans',
    topic: 'triangles',
    title: 'All 7 Coordinate Reflections & Rotations',
    math: '$(x,y)\\xrightarrow{y=x}(y,x) \\;|\\; \\xrightarrow{90^\\circ\\text{CCW}}(-y,x)$',
    note: 'Reflections: across x-axis → (x,-y); y-axis → (-x,y); y=x → (y,x); y=-x → (-y,-x). Rotations around origin: 90° counterclockwise (or 270° clockwise) → (-y,x); 180° → (-x,-y); 90° clockwise (or 270° counterclockwise) → (y,-x).',
    trap: 'Test with an easy point like (3, 1) to double-check which sign flips!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#9ca3af"/><line x1="45" y1="8" x2="45" y2="70" stroke="#9ca3af"/><path d="M62 22 A24 24 0 0 0 28 22" fill="none" stroke="#111" stroke-width="1.5"/><polygon points="26,24 31,20 32,26" fill="#111"/><text x="35" y="16" font-size="8">90°CCW</text></svg>`
  },

  // ==================== ALGEBRA & NUMBER THEORY ====================
  {
    id: 'a_slope',
    topic: 'algebra',
    title: 'Lines: Slope, Intercept & Word Problems',
    math: '$m=\\frac{y_2-y_1}{x_2-x_1},\\;\\; y=mx+b,\\;\\; y-y_1=m(x-x_1)$',
    note: 'In word problems, m is the rate of change ("per", "each", "for every") and b is the starting amount or one-time flat fee. Parallel lines have equal slopes (m1 = m2); perpendicular slopes multiply to -1 (flip fraction and change sign).',
    trap: 'If a table increases x by 3 each row and y by 12, the slope is 12/3 = 4, NOT 12.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="58" x2="78" y2="58" stroke="#9ca3af"/><line x1="26" y1="10" x2="26" y2="68" stroke="#9ca3af"/><line x1="14" y1="52" x2="74" y2="18" stroke="#111" stroke-width="1.6"/><text x="46" y="28" font-size="9">m</text><text x="15" y="43" font-size="9">b</text></svg>`
  },
  {
    id: 'a_lines',
    topic: 'algebra',
    title: 'Standard Form Ax+By=C & Point Distance',
    math: '$m=-\\frac{A}{B},\\;\\; \\Delta y=-\\frac{A}{B}\\Delta x,\\;\\; d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$',
    note: 'In Ax+By=C: slope is -A/B, x-intercept is C/A, y-intercept is C/B, and a perpendicular line is Bx-Ay=D. Shortcut: if x goes up by Δx, y changes by slope × Δx. Use the distance formula d above for the shortest distance from point (x0,y0) to a line.',
    trap: 'If asked "how much does x change when y increases by 1?", flip the slope to 1/m!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="58" x2="74" y2="16" stroke="#111" stroke-width="1.5"/><circle cx="32" cy="24" r="2.5"/><line x1="32" y1="24" x2="43" y2="39" stroke="#111" stroke-dasharray="2 2"/><text x="41" y="31" font-size="9">d</text></svg>`
  },
  {
    id: 'a_sys',
    topic: 'algebra',
    title: '0 / 1 / ∞ Solutions & Add Straight Down',
    math: '$\\frac{a_1}{a_2}=\\frac{b_1}{b_2}\\ne\\frac{c_1}{c_2}\\;(\\text{0 solutions})$',
    note: 'For two lines: parallel (0 sols) has equal x/y ratios but different C ratio; same line (∞ sols) has ALL 3 ratios equal; 1 sol has different x/y ratios. Shortcut: if coefficients are swapped (like 3x+7y=29 and 7x+3y=41), add or subtract straight down to get x+y or x-y in 3 seconds!',
    trap: '1-variable Ax+B = Cx+D: 0 solutions when A=C and B≠D; infinitely many when A=C and B=D.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="56" x2="66" y2="16" stroke="#111" stroke-width="1.5"/><line x1="28" y1="62" x2="78" y2="22" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_abs',
    topic: 'algebra',
    title: 'Absolute Value Ranges & Sum of Roots',
    math: '$|x-c|\\le r,\\; c=\\frac{a+b}{2},\\; r=\\frac{b-a}{2} \\;|\\; \\text{Sum}=-\\frac{2b}{a}$',
    note: 'To turn a range like 12 <= x <= 20 into an absolute value inequality: find the midpoint c = (12+20)/2 = 16 and distance to the edge r = (20-12)/2 = 4, giving |x-16| <= 4. Shortcut: for |ax+b|=k (k positive), the sum of its two solutions is ALWAYS -2b/a!',
    trap: '|ax+b| = negative number has 0 solutions; |ax+b| = 0 has only 1 solution.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="54" x2="78" y2="54" stroke="#9ca3af"/><polyline points="18,18 45,54 72,18" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'a_chunk',
    topic: 'algebra',
    title: 'Whole-Chunk, Flip Fraction & f(2x-1)',
    math: '$\\frac{2}{a}=\\frac{3}{4}\\implies\\frac{a}{2}=\\frac{4}{3} \\;|\\; f(2x-1)=6x+5$',
    note: 'Never solve for x if the whole chunk repeats! Ex: if 5x-3=17, then 10x-1 = 2(5x-3)+5 = 2(17)+5 = 39. For "given f(2x-1)=6x+5, find f(7)": set 2x-1=7 to get x=4, then plug 4 into the right side: 6(4)+5 = 29.',
    trap: 'Double fractions: (a/b)/c = a/(bc), whereas a/(b/c) = ac/b.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="18" width="70" height="42" rx="6" fill="none" stroke="#111" stroke-width="1.4"/><text x="16" y="36" font-size="10" font-weight="bold">2/a = 3/4</text><text x="16" y="52" font-size="10" font-weight="bold">a/2 = 4/3</text></svg>`
  },
  {
    id: 'a_id',
    topic: 'algebra',
    title: 'Core Factoring Identities',
    math: '$x^2-y^2=(x+y)(x-y) \\;|\\; x^2+y^2=(x+y)^2-2xy$',
    note: 'Spot these in disguise! Example: if x²-y² = 40 and x-y = 4, divide 40 by 4 to get x+y = 10 immediately. If given x+y and xy, use (x+y)² - 2xy to find x²+y². Also: (x+y)² - (x-y)² = 4xy.',
    trap: '(x+y)² equals x² + 2xy + y², NEVER just x² + y²!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="18" y="14" width="48" height="48" fill="none" stroke="#111" stroke-width="1.5"/><rect x="46" y="14" width="20" height="20" fill="rgba(0,0,0,0.12)" stroke="#111"/></svg>`
  },
  {
    id: 'a_fact',
    topic: 'algebra',
    title: 'Cubes (SOAP), Remainder & Coeff Sums',
    math: '$a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2) \\;|\\; \\text{Rem}=P(a)$',
    note: 'Remainder Theorem: dividing polynomial P(x) by (x-a) leaves remainder P(a) (by ax-b leaves P(b/a)); if P(a)=0, (x-a) is a factor! For any polynomial P(x): sum of all coefficients = P(1), constant term = P(0), alternating sum = P(-1).',
    trap: 'Cubes sign rule "SOAP": Same sign, Opposite sign, Always Positive.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">Rem = P(a)</text><text x="12" y="51" font-size="10">Sum coeff: P(1)</text></svg>`
  },
  {
    id: 'a_partial',
    topic: 'algebra',
    title: 'Partial Fractions (Cover-Up) & Asymptotes',
    math: '$\\frac{5x+11}{(x-1)(x+3)}=\\frac{A}{x-1}+\\frac{B}{x+3}$',
    note: 'Cover-Up Shortcut: to find A (over x-1), mentally cover (x-1) on the left and plug x=1 into the rest: (5(1)+11)/(1+3) = 4! To find B, cover (x+3) and plug x=-3: (-15+11)/(-3-1) = 1. Horizontal asymptote: Bigger on Bottom → y=0; Bigger on Top → none; Same degree → divide leading coeffs.',
    trap: 'If a factor cancels from top and bottom, it makes a HOLE (not a vertical asymptote or solution).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="10" x2="45" y2="68" stroke="#9ca3af" stroke-dasharray="3 2"/><line x1="10" y1="39" x2="80" y2="39" stroke="#9ca3af" stroke-dasharray="3 2"/><path d="M14 34 Q40 32 42 12" fill="none" stroke="#111" stroke-width="1.5"/><path d="M48 66 Q50 46 76 44" fill="none" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'a_exp',
    topic: 'algebra',
    title: 'Exponent Laws, Base Matching & √x²',
    math: '$x^{a/b}=\\sqrt[b]{x^a},\\;\\; 2^{x+3}-2^x=7(2^x),\\;\\; \\sqrt{x^2}=|x|$',
    note: 'Convert bases like 4, 8, 9, 27 to powers of 2 or 3! Example: 8^x / 2^y = (2³)^x / 2^y = 2^(3x-y). Rules: x^a·x^b = x^(a+b), (x^a)^b = x^(ab), x^(-n) = 1/x^n, x^0 = 1.',
    trap: '(-3)² = 9, but -3² = -9. Also √(x²) is |x| (positive), not x when x is negative!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="34" font-size="12" font-weight="bold">x^(a/b)</text><text x="12" y="54" font-size="11" font-weight="bold">√(x²) = |x|</text></svg>`
  },
  {
    id: 'a_rad',
    topic: 'algebra',
    title: 'Radical Conjugates & Fake Solutions',
    math: '$\\frac{c}{a+\\sqrt{b}}\\cdot\\frac{a-\\sqrt{b}}{a-\\sqrt{b}}=\\frac{c(a-\\sqrt{b})}{a^2-b}$',
    note: 'To clear a square root from a denominator like 3 + √5, multiply top and bottom by its opposite-sign conjugate (3 - √5). When solving radical equations, get the root alone first, square both sides, then plug answers back in!',
    trap: 'Squaring both sides can create fake (extraneous) answers. Also √x = -4 immediately has 0 real solutions.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="11" font-weight="bold">a + √b</text><text x="10" y="52" font-size="10">× (a - √b)</text></svg>`
  },
  {
    id: 'a_seq',
    topic: 'algebra',
    title: 'Arithmetic & Geometric Sequences + AM-GM',
    math: '$S_n=\\frac{n}{2}(a_1+a_n) \\;|\\; a_1\\frac{1-r^n}{1-r} \\;|\\; \\min\\left(ax+\\frac{b}{x}\\right)=2\\sqrt{ab}$',
    note: 'Arithmetic (adds d each step): nth term = a1 + (n-1)d. Geometric (multiplies r each step): nth term = a1·r^(n-1). Minimum value shortcut: for x positive, ax + b/x is smallest when ax = b/x, giving 2√(ab).',
    trap: 'Check carefully whether the first term is labeled n=1 or n=0.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><circle cx="18" cy="54" r="3"/><circle cx="36" cy="44" r="3"/><circle cx="54" cy="30" r="3"/><circle cx="72" cy="14" r="3"/><path d="M18 54 Q45 40 72 14" fill="none" stroke="#111" stroke-dasharray="2 2"/></svg>`
  },
  {
    id: 'a_num',
    topic: 'algebra',
    title: 'Remainders, Parity & Last-Digit Cycles',
    math: '$n=dq+r \\;|\\; \\text{Last digit: } \\text{mod}(\\text{exp}, 4)$',
    note: '"Dividing n by d leaves remainder r" translates to n = dq + r. Any factor of an odd number must be odd! To find the last digit of a^k, divide k by 4 and take the remainder (if remainder is 0, use a^4). Divisible by 3 or 9: sum of digits is divisible by 3 or 9.',
    trap: 'For any evenly spaced list (like consecutive integers), Mean = Median = (first + last)/2.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="32" font-size="11" font-weight="bold">n = dq + r</text><text x="12" y="52" font-size="10">mod(exp, 4)</text></svg>`
  },

  // ==================== QUADRATICS & FUNCTIONS ====================
  {
    id: 'q_vert',
    topic: 'quadratics',
    title: 'Parabola: 3 Forms & Symmetry Vertex',
    math: '$x_v=-\\frac{b}{2a}=\\frac{p+q}{2}=\\frac{m+n}{2}\\;(f(m)=f(n))$',
    note: 'Standard ax²+bx+c shows y-intercept c. Vertex a(x-h)²+k shows vertex (h,k) and root sum = 2h. Factored a(x-p)(x-q) shows roots p and q. Symmetry trick: if f(2)=f(8), the vertex x-value is halfway between them: (2+8)/2 = 5!',
    trap: '"Minimum or maximum value" asks for the y-value k, NOT x-value h! No real root if vertex is above x-axis (a positive) or below (a negative).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 16 Q45 76 74 16" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="46" r="2.5"/><text x="33" y="61" font-size="9">(h,k)</text></svg>`
  },
  {
    id: 'q_vieta',
    topic: 'quadratics',
    title: 'Vieta (Sum/Product of Roots) & Shifts',
    math: '$\\text{Sum}=-\\frac{b}{a},\\;\\;\\text{Prod}=\\frac{c}{a} \\;|\\; f(x-h)\\implies S+nh$',
    note: 'For ax²+bx+c=0, sum of roots is -b/a and product is c/a—no factoring needed! (Cubic ax³+bx²+cx+d=0: sum=-b/a, pairwise=c/a, prod=-d/a.) Shifting f(x-h)=0 moves all n roots right by h, so the new sum is S + n·h; f(kx)=0 divides sum by k.',
    trap: 'Always check that b² - 4ac is at least 0 if the question asks for the sum of REAL solutions!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="50" x2="78" y2="50" stroke="#9ca3af"/><path d="M18 22 Q45 76 72 22" fill="none" stroke="#111" stroke-width="1.5"/><circle cx="29" cy="50" r="2.5"/><circle cx="61" cy="50" r="2.5"/><text x="23" y="65" font-size="8">r1</text><text x="57" y="65" font-size="8">r2</text></svg>`
  },
  {
    id: 'q_disc',
    topic: 'quadratics',
    title: 'Discriminant, Tangent & No-Solution Max b',
    math: '$D=b^2-4ac \\;|\\; \\text{0 real sols: } b \\lt 2\\sqrt{ac}$',
    note: 'D positive = 2 real solutions; D = 0 = 1 solution (tangent line touching once); D negative = 0 real solutions. Shortcut: for -x²+bx-k²=0 (or x²+bx+k²=0) to have 0 real solutions, the biggest integer b is 2k - 1!',
    trap: 'Line y=mx+k tangent to a parabola: set them equal, move everything to one side, and set b² - 4ac = 0.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M18 16 Q45 70 72 16" fill="none" stroke="#111" stroke-width="1.5"/><line x1="14" y1="43" x2="76" y2="43" stroke="#111" stroke-dasharray="3 2"/><circle cx="45" cy="43" r="2.5"/><text x="24" y="62" font-size="8">tangent D=0</text></svg>`
  },
  {
    id: 'q_maxb',
    topic: 'quadratics',
    title: 'Factoring Cheat: Max b & Max ac',
    math: '$b_{\\max}=ac+1 \\;|\\; (ac)_{\\max}=\\lfloor\\frac{b^2}{4}\\rfloor$',
    note: 'If ax²+bx+c factors with positive integers (px+q)(rx+s): biggest possible b is ac+1 (if c is negative, a|c|-1). Reverse: if b is given (like ax²+148x+c), biggest possible ac is (b/2)² when b is even (here 74² = 5,476) or (b²-1)/4 when b is odd.',
    trap: 'Check the problem wording to see whether negative integer factors are allowed or only positive ones.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="31" font-size="10" font-weight="bold">max b = ac+1</text><text x="10" y="52" font-size="10" font-weight="bold">max ac = b²/4</text></svg>`
  },
  {
    id: 'q_nosol',
    topic: 'quadratics',
    title: 'No-Solution Traps & Quadratic Inequalities',
    math: '$-(3x-7)^2=p+17 \\implies p+17\\gt 0\\; (0\\text{ sol})$',
    note: 'A negative square is ALWAYS at most 0, so setting it equal to anything positive gives 0 solutions (here p+17 positive → p at least -16). For ax²+bx+c (a positive): above 0 means OUTSIDE the two roots; below 0 means BETWEEN the roots.',
    trap: 'Factor parity trap: in 4x²+bx-45 = (hx+k)(x+j), kj = -45 (odd!), so k and j MUST both be odd, making b = 4j+k odd!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="10" y1="30" x2="80" y2="30" stroke="#9ca3af"/><path d="M16 62 Q45 14 74 62" fill="none" stroke="#111" stroke-width="1.5"/><text x="18" y="22" font-size="9">p+17 &gt; 0</text></svg>`
  },
  {
    id: 'q_shift',
    topic: 'quadratics',
    title: 'Function Shifts, Flips, |f(x)| & Inverses',
    math: '$f(x-h)+k \\;|\\; f^{-1}(7)\\iff f(x)=7 \\;|\\; \\frac{x-b}{m}$',
    note: 'Inside x does the OPPOSITE: f(x-3) moves RIGHT 3, f(2x) squishes horizontally by 1/2. Outside does DIRECT: +4 moves UP 4, 2f(x) stretches taller. -f(x) flips across x-axis; f(-x) flips across y-axis; |f(x)| bounces negative y upward. Shortcut: to find f⁻¹(7), just solve f(x) = 7!',
    trap: 'Linear inverse shortcut: if f(x) = mx + b, then f⁻¹(x) = (x - b)/m.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 54 Q32 16 50 54" fill="none" stroke="#9ca3af" stroke-dasharray="2 2"/><path d="M34 46 Q52 8 70 46" fill="none" stroke="#111" stroke-width="1.6"/></svg>`
  },
  {
    id: 'q_expfn',
    topic: 'quadratics',
    title: 'Exponential y-Intercept & Poly Bounces',
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
    note: 'Multiply the multipliers instead of adding percents! Example: up 20% then down 10% is 1.20 × 0.90 = 1.08 (+8%). Special shortcut: going up p% then down p% ALWAYS loses (p/10)% squared (up 20%, down 20% = -4%).',
    trap: 'Up 30% then down 30% is a 9% LOSS, not 0%!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="32" font-size="10" font-weight="bold">+p%, -p%</text><text x="10" y="52" font-size="11" font-weight="bold">-(p/10)² %</text></svg>`
  },
  {
    id: 'p_exp',
    topic: 'percent',
    title: 'Exponential Growth Cycles & Rate Swap',
    math: '$y=a(1\\pm r)^{t/n} \\;|\\; 1+r_{\\text{year}}=(1+r_{\\text{sub}})^k$',
    note: 'a = start value, t = time passed, n = time per cycle. Example: "doubles every 5 hours" → a·2^(t/5); "drops 12% every 3 days" → a(0.88)^(t/3). To turn a quarterly 3% rate into an annual rate: (1.03)^4 - 1 = 12.55%.',
    trap: '5% monthly growth is NOT 60% per year—it is (1.05)^12 - 1 = 79.6%!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q46 56 72 16" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="72" y2="26" stroke="#9ca3af" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'p_int',
    topic: 'percent',
    title: 'Simple vs Compound Interest & Exp Beat',
    math: '$I=Prt \\;|\\; A=P\\left(1+\\frac{r}{n}\\right)^{nt}$',
    note: 'Simple interest adds the same dollar amount Pr every year (a straight line). Compound interest multiplies every n times per year. Any exponential growth (base above 1) will ALWAYS eventually overtake any linear growth.',
    trap: 'Check if the question asks for total account balance A or just the interest earned (A - P).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M14 60 Q48 56 74 14" fill="none" stroke="#111" stroke-width="1.6"/><line x1="14" y1="54" x2="74" y2="30" stroke="#9ca3af" stroke-width="1.4"/></svg>`
  },
  {
    id: 'p_rates',
    topic: 'percent',
    title: 'Average Speed, Combined Work & Variation',
    math: '$v_{\\text{avg}}=\\frac{2ab}{a+b} \\;|\\; T=\\frac{t_1t_2}{t_1+t_2} \\;|\\; x_1y_1=x_2y_2$',
    note: 'Driving there at speed a and back the SAME distance at speed b gives average speed 2ab/(a+b). Two workers finishing a job in t1 and t2 hours finish together in (t1·t2)/(t1+t2) hours. Direct variation: y1/x1 = y2/x2; Inverse: x1·y1 = x2·y2.',
    trap: 'Round-trip average speed of 30 mph and 50 mph is 37.5 mph, NOT 40 mph!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M16 32 H70 L62 24 M74 48 H20 L28 56" fill="none" stroke="#111" stroke-width="1.5"/><text x="30" y="23" font-size="9">a</text><text x="48" y="65" font-size="9">b</text></svg>`
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
    title: 'All 3D Volumes & Surface Areas',
    math: '$V_{\\text{cyl}}=\\pi r^2h,\\;\\; V_{\\text{cone}}=\\frac{1}{3}\\pi r^2h,\\;\\; V_{\\text{sph}}=\\frac{4}{3}\\pi r^3$',
    note: 'Surface areas are NOT on the SAT reference sheet: Cube = 6s²; Box = 2(lw+lh+wh); Cylinder = 2pi r² + 2pi rh; Cone = pi r² + pi r·l (slant l = √(r²+h²)); Sphere = 4pi r²; Square Pyramid = s² + 2sl.',
    trap: 'Check carefully if a container has an "open top" or asks for "lateral area only" (no base).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><ellipse cx="45" cy="20" rx="18" ry="6" fill="none" stroke="#111" stroke-width="1.3"/><line x1="27" y1="20" x2="27" y2="54" stroke="#111"/><line x1="63" y1="20" x2="63" y2="54" stroke="#111"/><ellipse cx="45" cy="54" rx="18" ry="6" fill="none" stroke="#111"/></svg>`
  },
  {
    id: 'v_diag',
    topic: 'volume',
    title: '3D Diagonals, Cube in Sphere & Gluing',
    math: '$d_{\\text{cube}}=s\\sqrt{3},\\;\\; d_{\\text{box}}=\\sqrt{l^2+w^2+h^2}$',
    note: 'Longest line fitting inside a box is √(l²+w²+h²). If a cube fits tightly inside a sphere of radius r, the cube 3D diagonal equals 2r, so s = 2r/√3. Gluing two prisms hides 2 touching faces from surface area. Unpainted inner cube = (n-2)³.',
    trap: 'A box with wall thickness t and an open top has inside space (L-2t)(W-2t)(H-t).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="20" y="26" width="34" height="34" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="20,26 36,14 70,14 54,26" fill="none" stroke="#111" stroke-width="1.3"/><polygon points="54,26 70,14 70,48 54,60" fill="none" stroke="#111" stroke-width="1.3"/><line x1="20" y1="60" x2="70" y2="14" stroke="#111" stroke-dasharray="3 2"/></svg>`
  },
  {
    id: 'v_frust',
    topic: 'volume',
    title: 'Chopped Cone (Frustum) & Sphere Slice',
    math: '$V_{\\text{bottom}}=V_{\\text{big}}\\left(1-\\frac{1}{k^3}\\right) \\;|\\; A_{\\text{slice}}=\\pi(R^2-d^2)$',
    note: 'If the top 1/k of a cone or pyramid height is chopped off, the remaining bottom part holds (1 - 1/k³) of the full volume! Slicing a sphere of radius R at distance d from its center makes a circle of radius √(R²-d²).',
    trap: 'Slicing a cone at distance d from its tip gives a circle of radius R·(d/H).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="45" y1="12" x2="32" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><line x1="45" y1="12" x2="58" y2="34" stroke="#9ca3af" stroke-dasharray="2 2"/><polygon points="32,34 58,34 70,60 20,60" fill="rgba(0,0,0,0.08)" stroke="#111" stroke-width="1.5"/></svg>`
  },
  {
    id: 'v_disp',
    topic: 'volume',
    title: 'Water Rise & Formula % Multiplier Trick',
    math: '$\\Delta h=\\frac{V_{\\text{object}}}{A_{\\text{base}}}$',
    note: 'Dropping an object into a tank makes the water level rise by (Object Volume ÷ Tank Base Area). Percent-change shortcut: if cone radius goes up 20% and height drops 10%, plug multipliers straight into r²h: (1.2)²(0.9) = 1.296 → volume increases by 29.6%!',
    trap: 'Drop pi and constants like 1/3 when computing % change—only the variables affect the ratio.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="26" y="16" width="38" height="46" fill="none" stroke="#111" stroke-width="1.4"/><rect x="26" y="38" width="38" height="24" fill="rgba(0,0,0,0.1)"/><line x1="26" y1="30" x2="64" y2="30" stroke="#111" stroke-dasharray="3 2"/><text x="68" y="36" font-size="8">Δh</text></svg>`
  },

  // ==================== DATA, STATS, PROBABILITY & META ====================
  {
    id: 'd_mean',
    topic: 'data',
    title: 'Total Sum, Tug-of-War & Offset Mean',
    math: '$\\text{Sum}=\\text{Mean}\\times n$',
    note: 'Always turn averages into Totals first! Tug-of-War: if 10 juniors avg 70 and 30 seniors avg 90 (1:3 size ratio), the combined mean sits 1/4 of the gap from 90 → 85. Offset trick: to average 90 on [88, 91, 94, 86], track (-2+1+4-4) = -1, so 5th score needs 90+1 = 91.',
    trap: 'Combined average is ALWAYS pulled closer to whichever group has more people.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="14" y1="39" x2="76" y2="39" stroke="#111" stroke-width="1.5"/><circle cx="20" cy="39" r="3"/><circle cx="70" cy="39" r="5.5"/><circle cx="56" cy="39" r="3" fill="#fff" stroke="#111" stroke-width="1.5"/><text x="48" y="56" font-size="8">mean</text></svg>`
  },
  {
    id: 'd_minmax',
    topic: 'data',
    title: 'Max/Min Possible Value (Mean & Median)',
    math: '$\\text{Max}=\\text{Total}-(\\text{smallest possible other values})$',
    note: 'To make the largest number in a sorted list as BIG as possible: push every number below the median down to the lowest allowed value (usually 0 or 1), and make every number between the median and the max EQUAL to the median!',
    trap: 'Numbers above the median cannot drop below the median, or the median itself would change.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="10" y="30" font-size="9" font-weight="bold">0..0 | M | M..M | MAX</text><line x1="10" y1="44" x2="80" y2="44" stroke="#111"/><text x="12" y="58" font-size="8">minimize rest</text></svg>`
  },
  {
    id: 'd_stats',
    topic: 'data',
    title: 'Standard Deviation: Shift, Scale & Shape',
    math: '$+c\\implies\\text{SD same} \\;|\\; \\times k\\implies\\text{SD}\\times|k|$',
    note: 'Standard deviation measures how spread out data is from the center: tall narrow bell = smallest SD; bimodal (clustered at far left & right ends) = largest SD! Adding +c to every value shifts Mean/Median by +c, but Range, IQR, and SD stay identical. Multiplying by k scales ALL of them by |k|.',
    trap: 'Adding a new point EQUAL to the mean keeps the mean the same and LOWERS standard deviation!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><path d="M12 58 Q24 16 36 52 Q45 62 54 52 Q66 16 78 58" fill="none" stroke="#111" stroke-width="1.5"/><text x="20" y="70" font-size="8">bimodal = max SD</text></svg>`
  },
  {
    id: 'd_box',
    topic: 'data',
    title: 'Box Plots, IQR, Outliers & Skewness',
    math: '$\\text{IQR}=Q_3-Q_1 \\;|\\; \\text{Low}\\lt Q_1-1.5\\,\\text{IQR}$',
    note: 'The box spans Q1 to Q3 (the middle 50% of data). High outlier exceeds Q3 + 1.5·IQR. Right-skewed (long tail to the right) pulls Mean higher than Median; left-skewed pulls Mean below Median; symmetric means Mean = Median.',
    trap: 'Total Range is Max - Min (whisker to whisker), while IQR is ONLY Q3 - Q1 (box width).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="12" y1="39" x2="78" y2="39" stroke="#111"/><rect x="28" y="25" width="32" height="28" fill="#fff" stroke="#111" stroke-width="1.4"/><line x1="42" y1="25" x2="42" y2="53" stroke="#111" stroke-width="2"/><text x="26" y="66" font-size="8">Q1</text><text x="40" y="66" font-size="8">M</text><text x="56" y="66" font-size="8">Q3</text></svg>`
  },
  {
    id: 'd_prob',
    topic: 'data',
    title: 'Probability, Conditional & Expected Value',
    math: '$P(A\\text{ given }B)=\\frac{\\text{both }A\\text{ and }B}{\\text{total in }B} \\;|\\; E[X]=\\sum x_i P(x_i)$',
    note: 'Basic probability = Target ÷ Total. Whenever a question says "Given X" or "If a person from group X is chosen", the denominator shrinks to ONLY the people in group X! For "A or B", add P(A) + P(B) and subtract the overlap P(A and B).',
    trap: 'In two-way tables, verify whether your denominator should be a row total, column total, or grand total.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="16" y="18" width="58" height="42" fill="none" stroke="#111" stroke-width="1.3"/><line x1="16" y1="38" x2="74" y2="38" stroke="#111"/><line x1="45" y1="18" x2="45" y2="60" stroke="#111"/><rect x="45" y="38" width="29" height="22" fill="rgba(17,17,17,0.14)"/></svg>`
  },
  {
    id: 'd_count',
    topic: 'data',
    title: 'Counting, Permutations & Combinations',
    math: '${}_nP_r=\\frac{n!}{(n-r)!} \\;|\\; {}_nC_r=\\frac{n!}{r!(n-r)!} \\;|\\; \\frac{n(n-1)}{2}$',
    note: 'Multiply choices across independent steps (ex: 3 shirts × 4 pants = 12 outfits). Use Permutations (nPr) when order matters, Combinations (nCr) when order does not matter. Total pairwise handshakes/games among n teams is n(n-1)/2.',
    trap: 'Use Desmos nCr(n,r) and nPr(n,r) so you never make an arithmetic mistake with factorials.',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><text x="12" y="31" font-size="11" font-weight="bold">nCr · nPr</text><text x="12" y="51" font-size="10">pairs: n(n-1)/2</text></svg>`
  },
  {
    id: 'd_study',
    topic: 'data',
    title: 'Margin of Error, 95% CI & Study Design',
    math: '$\\text{MOE} \\propto \\frac{1}{\\sqrt{n}} \\;|\\; 4n \\implies \\frac{1}{2}\\text{ MOE}$',
    note: 'Bigger sample size n shrinks Margin of Error (4× bigger sample cuts MOE in half; 9× bigger cuts it to 1/3). Random SAMPLING lets you generalize to the whole population. Random ASSIGNMENT (experiment) lets you prove cause-and-effect.',
    trap: 'A 95% confidence interval ONLY estimates the population MEAN/proportion—it does NOT mean 95% of individuals fall inside that range!',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><line x1="16" y1="39" x2="74" y2="39" stroke="#111" stroke-width="1.6"/><line x1="16" y1="32" x2="16" y2="46" stroke="#111" stroke-width="1.6"/><line x1="74" y1="32" x2="74" y2="46" stroke="#111" stroke-width="1.6"/><circle cx="45" cy="39" r="3"/><text x="24" y="60" font-size="8">4n → ½ MOE</text></svg>`
  },
  {
    id: 'd_meta',
    topic: 'data',
    title: '3-Second Test Triage & Plug-In Strategy',
    math: '$\\text{Plug } n=2, 3 \\;|\\; \\text{Units Check}$',
    note: 'Spend 3 seconds picking your fastest lane: (1) 10-sec mental shortcut, (2) Desmos graph/table, or (3) [ ]~[ ] regression. When testing multiple-choice algebra expressions by plugging in a number, use n=2 (and n=3 if two choices tie).',
    trap: 'Never use n=0 or n=1 as your only test number—0 and 1 make different powers look equal. Also watch for backward-% trap pairs (e.g. 96 vs 100).',
    svg: `<svg width="80" height="66" viewBox="0 0 90 78"><rect x="10" y="16" width="70" height="46" rx="5" fill="none" stroke="#111" stroke-width="1.4"/><text x="15" y="34" font-size="9" font-weight="bold">1. Mental 10s</text><text x="15" y="47" font-size="9" font-weight="bold">2. Desmos Graph</text><text x="15" y="59" font-size="9" font-weight="bold">3. [ ] ~ [ ] Reg</text></svg>`
  }
];
