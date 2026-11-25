// Clean, verified starter bank: 3 questions (Easy, Medium, Hard) from each of the 9 PDFs.
// Drop additional topic files into data/ and push to window.SAT_QUESTIONS.
window.SAT_QUESTIONS = [
  // 1. CIRCLES
  {
    id: "cir_h9",
    topic: "Circles",
    difficulty: "hard",
    num: "Hard #9",
    prompt:
      "Point $O$ is the center of the circle above, and the measure of $\\angle OAB$ is $30^\\circ$. If the length of $\\overline{OC}$ is $18$, what is the length of arc $\\widehat{AB}$?",
    diagramHtml: `<svg width="235" height="225" viewBox="0 0 260 250"><circle cx="130" cy="126" r="95" fill="none" stroke="#111" stroke-width="2.4"/><line x1="47.7" y1="78.5" x2="212.3" y2="78.5" stroke="#111" stroke-width="2.2"/><line x1="130" y1="126" x2="47.7" y2="78.5" stroke="#111" stroke-width="2.2"/><line x1="130" y1="126" x2="212.3" y2="78.5" stroke="#111" stroke-width="2.2"/><line x1="130" y1="126" x2="130" y2="221" stroke="#111" stroke-width="2.2"/><circle cx="130" cy="126" r="3.4" fill="#111"/><text x="32" y="76" font-family="Georgia,serif" font-style="italic" font-size="18">A</text><text x="219" y="76" font-family="Georgia,serif" font-style="italic" font-size="18">B</text><text x="124" y="242" font-family="Georgia,serif" font-style="italic" font-size="18">C</text><text x="111" y="142" font-family="Georgia,serif" font-style="italic" font-size="17">O</text></svg>`,
    type: "mcq",
    choices: { A: "$9\\pi$", B: "$12\\pi$", C: "$15\\pi$", D: "$18\\pi$" },
    answer: "B",
    formulas: ["c_radii", "t_sum", "c_arc"],
  },
  {
    id: "cir_e2",
    topic: "Circles",
    difficulty: "easy",
    num: "Easy #2",
    prompt:
      "The circle above with center $O$ has a circumference of $36$. What is the length of minor arc $\\widehat{AC}$?",
    diagramHtml: `<svg width="170" height="170" viewBox="0 0 180 180"><circle cx="90" cy="90" r="68" fill="none" stroke="#111" stroke-width="2.2"/><line x1="42" y1="42" x2="138" y2="138" stroke="#111" stroke-width="1.8"/><line x1="138" y1="42" x2="42" y2="138" stroke="#111" stroke-width="1.8"/><polyline points="82,82 90,74 98,82" fill="none" stroke="#111" stroke-width="1.5"/><text x="30" y="38" font-family="Georgia,serif" font-style="italic" font-size="16">A</text><text x="142" y="38" font-family="Georgia,serif" font-style="italic" font-size="16">C</text><text x="84" y="110" font-family="Georgia,serif" font-style="italic" font-size="15">O</text></svg>`,
    type: "mcq",
    choices: { A: "$9$", B: "$12$", C: "$18$", D: "$36$" },
    answer: "A",
    formulas: ["c_arc"],
  },
  {
    id: "cir_m7",
    topic: "Circles",
    difficulty: "medium",
    num: "Medium #7",
    prompt:
      "$$x^2 + 58x + y^2 = 0$$ In the $xy$-plane, the graph of the given equation is a circle. What are the coordinates $(x,y)$ of the center of the circle?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$(0, 29)$",
      B: "$(0, -29)$",
      C: "$(29, 0)$",
      D: "$(-29, 0)$",
    },
    answer: "D",
    formulas: ["c_eq"],
  },

  // 2. RIGHT TRIANGLES & TRIGONOMETRY
  {
    id: "rt_e1",
    topic: "Right Triangles & Trig",
    difficulty: "easy",
    num: "Easy #1",
    prompt: "In the right triangle shown, what is the value of $\\sin A$?",
    diagramHtml: `<svg width="240" height="170" viewBox="0 0 260 185"><polygon points="45,30 45,155 225,155" fill="none" stroke="#111" stroke-width="2.3"/><rect x="45" y="140" width="15" height="15" fill="none" stroke="#111" stroke-width="1.8"/><text x="37" y="22" font-family="Georgia,serif" font-style="italic" font-size="16">B</text><text x="37" y="175" font-family="Georgia,serif" font-style="italic" font-size="16">C</text><text x="229" y="175" font-family="Georgia,serif" font-style="italic" font-size="16">A</text><text x="12" y="98" font-size="17" font-weight="600">35</text><text x="135" y="82" font-size="17" font-weight="600">171</text></svg>`,
    type: "mcq",
    choices: {
      A: "$\\frac{1}{171}$",
      B: "$\\frac{35}{171}$",
      C: "$\\frac{171}{35}$",
      D: "$171$",
    },
    answer: "B",
    formulas: ["tr_soh"],
  },
  {
    id: "rt_m2",
    topic: "Right Triangles & Trig",
    difficulty: "medium",
    num: "Medium #2",
    prompt:
      "In right triangle $RST$, the sum of the measures of angle $R$ and angle $S$ is $90$ degrees. The value of $\\sin(R)$ is $\\frac{\\sqrt{15}}{4}$. What is the value of $\\cos(S)$?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$\\frac{\\sqrt{15}}{15}$",
      B: "$\\frac{\\sqrt{15}}{4}$",
      C: "$\\frac{4\\sqrt{15}}{15}$",
      D: "$\\sqrt{15}$",
    },
    answer: "B",
    formulas: ["tr_comp", "tr_soh"],
  },
  {
    id: "rt_h4",
    topic: "Right Triangles & Trig",
    difficulty: "hard",
    num: "Hard #4",
    prompt:
      "The perimeter of an isosceles right triangle is $18 + 18\\sqrt{2}$ inches. What is the length, in inches, of the hypotenuse of this triangle?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$9$", B: "$9\\sqrt{2}$", C: "$18$", D: "$18\\sqrt{2}$" },
    answer: "C",
    formulas: ["t_special", "t_pyth"],
  },

  // 3. LINES, ANGLES & TRIANGLES
  {
    id: "lat_e6",
    topic: "Lines, Angles & Triangles",
    difficulty: "easy",
    num: "Easy #6",
    prompt:
      "In the figure above, lines $\\ell$ and $m$ are parallel, $y = 20$, and $z = 60$. What is the value of $x$?",
    diagramHtml: `<svg width="240" height="145" viewBox="0 0 260 155"><line x1="20" y1="65" x2="240" y2="85" stroke="#111" stroke-width="2"/><line x1="20" y1="115" x2="240" y2="135" stroke="#111" stroke-width="2"/><line x1="50" y1="140" x2="170" y2="18" stroke="#111" stroke-width="2"/><line x1="158" y1="12" x2="215" y2="142" stroke="#111" stroke-width="2"/><text x="242" y="88" font-family="Georgia,serif" font-style="italic" font-size="14">ℓ</text><text x="242" y="138" font-family="Georgia,serif" font-style="italic" font-size="14">m</text><text x="150" y="34" font-size="13">x°</text><text x="172" y="72" font-size="13">z°</text><text x="80" y="114" font-size="13">y°</text></svg>`,
    type: "mcq",
    choices: { A: "$120$", B: "$100$", C: "$90$", D: "$80$" },
    answer: "B",
    formulas: ["t_ext", "t_sum"],
  },
  {
    id: "lat_m14",
    topic: "Lines, Angles & Triangles",
    difficulty: "medium",
    num: "Medium #14",
    prompt:
      "In triangle $ABC$, the measure of angle $A$ is $50^\\circ$. If triangle $ABC$ is isosceles, which of the following is NOT a possible measure of angle $B$?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$50^\\circ$",
      B: "$65^\\circ$",
      C: "$80^\\circ$",
      D: "$100^\\circ$",
    },
    answer: "D",
    formulas: ["t_sum"],
  },
  {
    id: "lat_h8",
    topic: "Lines, Angles & Triangles",
    difficulty: "hard",
    num: "Hard #8",
    prompt:
      "In triangles $ABC$ and $DEF$, angles $B$ and $E$ each have measure $27^\\circ$ and angles $C$ and $F$ each have measure $41^\\circ$. Which additional piece of information is sufficient to determine whether triangle $ABC$ is congruent to triangle $DEF$?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "The measure of angle $A$",
      B: "The length of side $AB$",
      C: "The lengths of sides $BC$ and $EF$",
      D: "No additional information is necessary.",
    },
    answer: "C",
    formulas: ["t_cong"],
  },

  // 4. PERCENTAGES
  {
    id: "pct_e2",
    topic: "Percentages",
    difficulty: "easy",
    num: "Easy #2",
    prompt:
      "A table of the US minimum wage for $6$ different years is shown above. What was the percent increase of the minimum wage from $1960$ to $1970$?",
    diagramHtml: `<table><tr><th>Year</th><th>Wage ($/hr)</th></tr><tr><td>1960</td><td>1.00</td></tr><tr><td>1970</td><td>1.60</td></tr><tr><td>1980</td><td>3.10</td></tr><tr><td>1990</td><td>3.80</td></tr><tr><td>2000</td><td>5.15</td></tr><tr><td>2010</td><td>7.25</td></tr></table>`,
    type: "mcq",
    choices: { A: "$30\\%$", B: "$60\\%$", C: "$62.5\\%$", D: "$120\\%$" },
    answer: "B",
    formulas: ["p_pct"],
  },
  {
    id: "pct_m12",
    topic: "Percentages",
    difficulty: "medium",
    num: "Medium #12",
    prompt:
      "A number $n$ is increased $6\\%$. If the result is $318$, what is the value of $n$?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$199$", B: "$299$", C: "$300$", D: "$337$" },
    answer: "C",
    formulas: ["p_pct"],
  },
  {
    id: "pct_h8",
    topic: "Percentages",
    difficulty: "hard",
    num: "Hard #8",
    prompt:
      "The number $a$ is $190\\%$ greater than the number $b$. The number $b$ is $80\\%$ less than $24$. What is the value of $a$?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$9.12$", B: "$13.92$", C: "$26.40$", D: "$36.48$" },
    answer: "B",
    formulas: ["p_pct"],
  },

  // 5. RATIOS, RATES & UNITS
  {
    id: "rat_e6",
    topic: "Ratios, Rates & Units",
    difficulty: "easy",
    num: "Easy #6",
    prompt:
      "A group of monarch butterflies migrated from Chicago, Illinois, to Michoacán, Mexico, flying a total of $2{,}100$ miles. It took a single butterfly $120$ days to travel this route one way. On average, how many miles did the butterfly travel per day?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$0.057$", B: "$0.729$", C: "$17.5$", D: "$24$" },
    answer: "C",
    formulas: ["p_exp"],
  },
  {
    id: "rat_m16",
    topic: "Ratios, Rates & Units",
    difficulty: "medium",
    num: "Medium #16",
    prompt:
      "Which of the following speeds is equivalent to $90$ kilometers per hour? ($1\\text{ kilometer} = 1{,}000\\text{ meters}$)",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$25$ meters per second",
      B: "$32$ meters per second",
      C: "$250$ meters per second",
      D: "$324$ meters per second",
    },
    answer: "A",
    formulas: ["p_exp"],
  },
  {
    id: "rat_h3",
    topic: "Ratios, Rates & Units",
    difficulty: "hard",
    num: "Hard #3",
    prompt:
      "The speed of a vehicle is increasing at a rate of $7.3$ meters per second squared. What is this rate, in miles per minute squared, rounded to the nearest tenth? ($1\\text{ mile} = 1{,}609\\text{ meters}$)",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$0.3$", B: "$16.3$", C: "$195.8$", D: "$220.4$" },
    answer: "B",
    formulas: ["p_exp"],
  },

  // 6. AREA & VOLUME
  {
    id: "av_e12",
    topic: "Area & Volume",
    difficulty: "easy",
    num: "Easy #12",
    prompt:
      "Triangle $ABC$ and triangle $DEF$ are similar triangles, where $\\overline{AB}$ and $\\overline{DE}$ are corresponding sides. If $DE = 2AB$ and the perimeter of triangle $ABC$ is $20$, what is the perimeter of triangle $DEF$?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$10$", B: "$40$", C: "$80$", D: "$120$" },
    answer: "B",
    formulas: ["t_cong"],
  },
  {
    id: "av_m15",
    topic: "Area & Volume",
    difficulty: "medium",
    num: "Medium #15",
    prompt:
      "Two sizes of cylindrical containers each have a height of $50$ centimeters. The radius of container A is $16$ centimeters, and the radius of container B is $25\\%$ longer than the radius of container A. What is the volume, in cubic centimeters, of container B?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$16{,}000\\pi$",
      B: "$20{,}000\\pi$",
      C: "$25{,}000\\pi$",
      D: "$31{,}250\\pi$",
    },
    answer: "B",
    formulas: ["v_solids", "p_pct"],
  },
  {
    id: "av_h4",
    topic: "Area & Volume",
    difficulty: "hard",
    num: "Hard #4",
    prompt:
      "A cube has an edge length of $68$ inches. A solid sphere with a radius of $34$ inches is inside the cube, touching the center of each face. To the nearest cubic inch, what is the volume of the space in the cube NOT taken up by the sphere?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$149{,}796$",
      B: "$164{,}500$",
      C: "$190{,}955$",
      D: "$310{,}800$",
    },
    answer: "A",
    formulas: ["v_solids"],
  },

  // 7. ONE-VARIABLE DATA
  {
    id: "ovd_e5",
    topic: "One-Variable Data",
    difficulty: "easy",
    num: "Easy #5",
    prompt:
      "Data set A: $72, 73, 73, 76, 76$<br>Data set B: $61, 64, 74, 85, x$<br>If the mean of data set A equals the mean of data set B, what is the value of $x$?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$77$", B: "$85$", C: "$86$", D: "$95$" },
    answer: "C",
    formulas: ["d_stats"],
  },
  {
    id: "ovd_m14",
    topic: "One-Variable Data",
    difficulty: "medium",
    num: "Medium #14",
    prompt:
      "The weights, in pounds, for $15$ horses were reported, and the mean, median, range, and standard deviation were found. The horse with the lowest reported weight actually weighed $10$ pounds less. What value remains unchanged?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "Mean", B: "Median", C: "Range", D: "Standard deviation" },
    answer: "B",
    formulas: ["d_stats"],
  },
  {
    id: "ovd_h12",
    topic: "One-Variable Data",
    difficulty: "hard",
    num: "Hard #12",
    prompt:
      "The mean score of $8$ players in a basketball game was $14.5$ points. If the highest individual score is removed, the mean score of the remaining $7$ players becomes $12$ points. What was the highest score?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$20$", B: "$24$", C: "$32$", D: "$36$" },
    answer: "C",
    formulas: ["d_stats"],
  },

  // 8. PROBABILITY & CONDITIONAL PROBABILITY
  {
    id: "pr_e3",
    topic: "Probability",
    difficulty: "easy",
    num: "Easy #3",
    prompt:
      "Based on the data in the table, what is the probability that a gas station customer selected at random on that day did not purchase gasoline?",
    diagramHtml: `<table><tr><th></th><th>Beverage</th><th>No Beverage</th><th>Total</th></tr><tr><td>Gasoline purchased</td><td>60</td><td>25</td><td>85</td></tr><tr><td>Gasoline not purchased</td><td>35</td><td>15</td><td>50</td></tr><tr><td>Total</td><td>90</td><td>40</td><td>135</td></tr></table>`,
    type: "mcq",
    choices: {
      A: "$\\frac{15}{50}$",
      B: "$\\frac{15}{40}$",
      C: "$\\frac{35}{50}$",
      D: "$\\frac{50}{135}$",
    },
    answer: "D",
    formulas: ["d_prob"],
  },
  {
    id: "pr_m7",
    topic: "Probability",
    difficulty: "medium",
    num: "Medium #7",
    prompt:
      "If one of the days on which there was no rain is selected at random, what is the probability the day was a weekend day?",
    diagramHtml: `<table><tr><th></th><th>Rain</th><th>No rain</th><th>Total</th></tr><tr><td>Weekdays</td><td>12</td><td>48</td><td>60</td></tr><tr><td>Weekend days</td><td>8</td><td>16</td><td>24</td></tr><tr><td>Total</td><td>20</td><td>64</td><td>84</td></tr></table>`,
    type: "mcq",
    choices: {
      A: "$\\frac{4}{21}$",
      B: "$\\frac{1}{4}$",
      C: "$\\frac{2}{3}$",
      D: "$\\frac{3}{4}$",
    },
    answer: "B",
    formulas: ["d_prob"],
  },
  {
    id: "pr_h2",
    topic: "Probability",
    difficulty: "hard",
    num: "Hard #2",
    prompt:
      "A grove has $6$ rows of birch trees ($8$ trees $\\ge 20$ ft, $6$ shorter) and $5$ rows of maple trees ($9$ trees $\\ge 20$ ft, $7$ shorter). What is the probability of selecting a maple tree, given that the tree is $20$ feet or taller?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$\\frac{9}{164}$",
      B: "$\\frac{3}{10}$",
      C: "$\\frac{15}{31}$",
      D: "$\\frac{9}{17}$",
    },
    answer: "C",
    formulas: ["d_prob"],
  },

  // 9. EQUIVALENT EXPRESSIONS
  {
    id: "eq_e13",
    topic: "Equivalent Expressions",
    difficulty: "easy",
    num: "Easy #13",
    prompt:
      "Which expression is equivalent to $(2x^2 - 4) - (-3x^2 + 2x - 7)$?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$5x^2 - 2x + 3$",
      B: "$5x^2 + 2x - 3$",
      C: "$-x^2 - 2x - 11$",
      D: "$-x^2 + 2x - 11$",
    },
    answer: "A",
    formulas: ["a_fact"],
  },
  {
    id: "eq_m3",
    topic: "Equivalent Expressions",
    difficulty: "medium",
    num: "Medium #3",
    prompt:
      "Which expression is equivalent to $\\frac{8x(x-7)-3(x-7)}{2x-14}$, where $x > 7$?",
    diagramHtml: "",
    type: "mcq",
    choices: {
      A: "$\\frac{x-7}{5}$",
      B: "$\\frac{8x-3}{2}$",
      C: "$\\frac{8x^2-3x-14}{2x-14}$",
      D: "$\\frac{8x^2-3x-77}{2x-14}$",
    },
    answer: "B",
    formulas: ["a_fact"],
  },
  {
    id: "eq_h4",
    topic: "Equivalent Expressions",
    difficulty: "hard",
    num: "Hard #4",
    prompt:
      "$$\\frac{2}{x-2} + \\frac{3}{x+5} = \\frac{rx+t}{(x-2)(x+5)}$$ The equation above is true for all $x > 2$, where $r$ and $t$ are positive constants. What is the value of $rt$?",
    diagramHtml: "",
    type: "mcq",
    choices: { A: "$-20$", B: "$15$", C: "$20$", D: "$60$" },
    answer: "C",
    formulas: ["a_fact"],
  },
];