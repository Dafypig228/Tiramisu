// Old formula-card ids → new cards. Used to relink questions and to show the new card
// for any old card that is already pinned on a board.
(function () {
  window.CARD_MAP_OLD = {
    // Desmos
    dm_trig: ['k_dm_trig'], dm_trigmode: ['k_dm_trig'], dm_abs_rad: ['k_dm_typing'], dm_const: ['k_dm_tilde'], dm_bracket: ['k_dm_tilde'],
    dm_reg: ['k_dm_regression'], dm_sliders: ['k_dm_intersect', 'k_dm_slider'], dm_equiv: ['k_dm_equiv'], dm_hybrid: ['k_dm_slider'],
    dm_freq: ['k_dm_stats'], dm_seq: ['k_dm_lists'], dm_geom: ['k_dm_typing'], dm_circle: ['k_dm_circle'],
    // Trig
    tr_table: ['k_unit'], tr_unit: ['k_unit'], tr_axes: ['k_unit'], tr_wrap: ['k_unit'], tr_angles: ['k_rad_deg'], tr_soh: ['k_soh'],
    tr_sim: ['k_soh', 'k_similar'], tr_comp: ['k_complement'], tr_pyth: ['k_trig_find'], tr_laws: ['k_laws'],
    // Circles
    c_std: ['k_circle_basic', 'k_circle_eq'], c_axes: ['k_circle_eq'], c_eq: ['k_circle_eq'], c_radii: ['k_circle_radii'], c_arc: ['k_arc'], c_sector: ['k_arc'],
    c_annulus: ['k_ring'], c_inscribed: ['k_inscribed'], c_thales: ['k_inscribed'], c_power: ['k_chords'], c_tangents: ['k_tangent'],
    // Triangles & polygons
    t_sum: ['k_tri_angles'], t_pyth: ['k_pyth'], t_special: ['k_special'], t_alt: ['k_altitude'], t_equi: ['k_equilateral'], t_area: ['k_tri_area'],
    t_heron: ['k_heron'], t_quad: ['k_quads'], t_tilt: ['k_tilt'], t_ext: ['k_parallel_angles', 'k_tri_angles'], t_poly: ['k_polygon'],
    t_cong: ['k_similar', 'k_scale'], t_box: ['k_dist_mid'], t_trans: ['k_reflect'],
    // Algebra
    a_slope: ['k_line_words', 'k_slope'], a_lines: ['k_std_form'], a_ptdist: ['k_point_line'], a_sys: ['k_systems_count', 'k_systems_solve'], a_combo: ['k_systems_solve'],
    a_abs: ['k_abs'], a_chunk: ['k_chunk', 'k_function_notation'], a_id: ['k_factor_patterns'], a_fact: ['k_poly_factor'], a_partial: ['k_partial'],
    a_asym: ['k_rational'], a_exp: ['k_exponents'], a_rad: ['k_radicals'], a_seq: ['k_sequences'], a_amgm: ['k_amgm'], a_num: ['k_numbers'],
    // Quadratics / functions
    q_vert: ['k_parabola'], q_vieta: ['k_vieta'], q_rshift: ['k_vieta'], q_disc: ['k_quad_formula'], q_maxb: ['k_quad_formula'], q_nosol: ['k_rational'],
    q_ineq: ['k_quad_ineq'], q_shift: ['k_transform'], q_inv: ['k_inverse'], q_expfn: ['k_exp_growth', 'k_poly_factor'],
    // Percent / rates
    p_pct: ['k_percent'], p_succ: ['k_percent'], p_exp: ['k_exp_growth'], p_period: ['k_exp_growth'], p_int: ['k_lin_vs_exp'],
    p_rates: ['k_rates'], p_var: ['k_variation'], p_units: ['k_units'],
    // Volume
    v_solids: ['k_volume'], v_sa: ['k_surface'], v_diag: ['k_3d_diag'], v_wall: ['k_wall'], v_frust: ['k_frustum'], v_disp: ['k_volume', 'k_water'],
    // Data
    d_mean: ['k_mean'], d_tug: ['k_combined_mean'], d_minmax: ['k_median'], d_stats: ['k_sd'], d_shift: ['k_data_shift'], d_box: ['k_box'],
    d_prob: ['k_prob_table'], d_ev: ['k_expected'], d_count: ['k_counting'], d_study: ['k_sampling', 'k_experiment'], d_meta: ['k_backsolve', 'k_pick_numbers']
  };

  // Picking cards for a question: the old links give a starting score, then keyword rules on the question text
  // add points. The highest-scoring cards (up to 4) are shown under "This Task".
  // Each rule: [topics or null for all, test on the lower-case question text, [card, points], [card, points], ...]
  const T = {
    circ: 'Circles', rt: 'Right Triangles & Trig', lat: 'Lines, Angles & Triangles', pct: 'Percentages', rat: 'Ratios, Rates & Units',
    eq: 'Equivalent Expressions', av: 'Area & Volume', data: 'One-Variable Data', prob: 'Probability'
  };
  const RULES = [
    // ---- any topic
    [null, /in terms of|solve for|rearrang/, ['k_literal', 9]],
    [[T.pct, T.rat, T.data, T.prob, T.eq], /interpretation|what does [^?]* represent|best describes|meaning of/, ['k_interpret', 8]],
    [[T.pct, T.rat, T.prob, T.data], /which (equation|expression|inequality) (represents|models|could be used)|if there are [a-z] |works [a-z] hours|of [a-z] identical/, ['k_words_to_eq', 6]],
    [null, /system of inequalities|inequalit(y|ies) .* solution/, ['k_dm_ineq', 6]],
    [[T.eq, T.rat, T.pct, T.data], /thrown|launched|projectile|\bball\b|rocket|h\(t\)/, ['k_quad_context', 6]],
    [[T.lat, T.av, T.rt], /congruent/, ['k_congruent', 9]],
    [[T.lat, T.circ], /isosceles(?! right)|\bab\s*=\s*ac\b|\b[a-z]{2}\s*=\s*[a-z]{2}\b[,.]|each \d+\^/, ['k_isosceles', 9]],
    [[T.circ], /triangle (o|p)[a-z]{2}|in triangle o/, ['k_isosceles', 6]],
    [[T.av], /shaded|region/, ['k_composite', 9]],
    [[T.prob], /die|bag|box contains|cubes|marbles|buttons|out of every|data set of three numbers|randomly selects|of the \d+ planets/, ['k_prob_basic', 9]],
    [[T.prob], /\bnot\b|expected|how many .* (would|expect)/, ['k_prob_basic', 5]],
    [[T.eq, T.rat, T.pct], /\\frac\{\d+\}\{\d+\}/, ['k_fractions', 3]],
    [[T.eq], /factor/, ['k_factor_trinomial', 5]],
    [null, /rate of change|average rate/, ['k_rate_change', 8]],
    [null, /intercept/, ['k_intercepts', 8]],
    [null, /the graph (shows|shown)|graph of (y\s*=\s*)?[fgh]\b/, ['k_read_graph', 5]],
    [null, /mixture|mixing|mixed|concentration/, ['k_mixture', 6]],
    [null, /what value of [a-z] (satisfies|is the solution)|what is the solution to/, ['k_dm_onevar', 6]],
    [[T.rt, T.circ, T.eq], /\\sqrt\{\d+\}|\d\\sqrt/, ['k_simplify_roots', 4]],
    [null, /passes through|line .* through the points|tangent to this circle at the point/, ['k_point_slope', 6]],
    [[T.pct], /what percent(age)?|nearest (whole|tenth of a) percent/, ['k_fdp', 4]],
    [null, /(sin|cos|tan)\s*\(?\s*(30|45|60)\^|\\(sin|cos|tan)\s*\\?d?frac\{\\pi\}\{(3|4|6)\}/, ['k_trig_table', 7]],
    [[T.rt], /\b(30|45|60)\^/, ['k_trig_table', 3]],
    [null, /vertices[^.]*\(\d|graphed in the xy-plane/, ['k_coord_area', 6]],
    [null, /consecutive/, ['k_consecutive', 9]],
    [null, /positive integer|reciprocal|product of the/, ['k_vocab', 4]],
    [null, /[fgh]\(x\)\s*=/, ['k_dm_function', 4]],
    [null, /compound|\binterest\b|invested|deposited/, ['k_compound', 7]],
    [[T.lat], /intersecting lines|two lines intersect|lines? .* intersects?|straight/, ['k_angle_basics', 6]],
    // ---- angles in radians / trig values of big angles
    [null, /radian/, ['k_rad_deg', 9]],
    [null, /(sin|cos|tan)\s*\\?(left\()?\s*\\?d?frac\{\d*\\pi|(sin|cos|tan)\s*\(?\s*\d+\\pi/, ['k_unit', 9], ['k_rad_deg', 7], ['k_dm_trig', 2]],
    // ---- circles
    [[T.circ, T.av], /arc/, ['k_arc', 8]],
    [[T.circ], /tangent/, ['k_tangent', 8]],
    [[T.circ], /xy-plane|\(x|x\^2|equation/, ['k_circle_eq', 7]],
    [[T.circ], /x\^2\s*[+-]\s*\d*x|x\^2\+\d+x|2x\^2-6x/, ['k_complete_square', 6]],
    [[T.circ], /translat|shift/, ['k_transform', 4]],
    [[T.circ], /endpoints|diameter with|lies on the circle/, ['k_dist_mid', 4]],
    // ---- right triangles & trig
    [[T.rt, T.lat], /\b(sin|cos|tan)\b|\\(sin|cos|tan)/, ['k_soh', 7]],
    [[T.rt], /sum of the measures .*90|same value as|\\sin\s*\d+\^\\circ.*\\cos|cos\((.*)\)\s*-\s*\\?sin|tangent of the other|cos\(l\)|cos\(k\)/, ['k_complement', 8]],
    [[T.rt], /isosceles right|45\^/, ['k_special', 8]],
    [[T.rt], /30\^|60\^|equilateral/, ['k_special', 5]],
    [[T.lat], /30\^|60\^/, ['k_special', 4]],
    [[T.rt], /equilateral/, ['k_equilateral', 7]],
    [[T.rt, T.lat], /hypotenuse|legs|leg of|diagonal|\\sqrt\{/, ['k_pyth', 5]],
    [[T.rt, T.lat], /similar/, ['k_similar', 7]],
    [[T.rt], /inscribed in a circle|lie on a circle/, ['k_inscribed', 5], ['k_special', 4]],
    // ---- lines, angles, triangles
    [[T.lat], /parallel/, ['k_parallel_angles', 8]],
    [[T.lat], /intersect/, ['k_parallel_angles', 5]],
    [[T.lat], /isosceles|ab\s*=\s*ac|[a-z]{2}\s*=\s*[a-z]{2}[,.]|each \d+\^/, ['k_tri_angles', 8]],
    [[T.lat], /measure of .*angle|∠|\\angle|value of [xyzw]\b/, ['k_tri_angles', 4]],
    [[T.lat], /extended/, ['k_tri_angles', 7]],
    [[T.lat], /congruent/, ['k_similar', 6]],
    [[T.lat], /shadow|casts|tall/, ['k_similar', 8], ['k_ratio', 4]],
    [[T.lat], /pentagon|hexagon|polygon|octagon/, ['k_polygon', 8]],
    [[T.lat], /altitude|\\perp/, ['k_altitude', 7]],
    [[T.lat], /area of triangle|area .* triangle/, ['k_tri_area', 6]],
    // ---- area & volume
    [[T.av], /perimeter/, ['k_basic_area', 8]],
    [[T.av], /rectangle|square/, ['k_basic_area', 5]],
    [[T.av], /triangle/, ['k_tri_area', 4]],
    [[T.av], /circle|circumference/, ['k_circle_basic', 7]],
    [[T.av], /three points/, ['k_dist_mid', 5]],
    [[T.av], /cylinder|cone|sphere|prism|cube|volume|pyramid/, ['k_volume', 7], ['k_refsheet', 2]],
    [[T.av], /surface area|each side of the box|does not have a (top|lid)/, ['k_surface', 9]],
    [[T.av], /similar|times the side|times (that|those) of|scale model|side lengths that are \d+ times|perimeter of square y is|\d+ times (its|the|that)|copy|both length and width/, ['k_scale', 9], ['k_similar', 4]],
    [[T.av], /%/, ['k_percent', 5]],
    [[T.av], /slant height/, ['k_pyth', 6]],
    // ---- percentages
    [[T.pct], /./, ['k_percent', 7]],
    [[T.pct], /%[^%]*%/, ['k_percent_chain', 6]],
    [[T.pct], /(greater|less|more) than[^.]*\.[^%]*%|of (all|those|the) [a-z ]*,?\s*\d+(\.\d+)?\\?%/, ['k_percent_chain', 3]],
    [[T.pct], /depreciat|each year|per year|annual/, ['k_exp_growth', 6]],
    [[T.pct], /table|graph/, ['k_read_question', 2]],
    // ---- ratios, rates, units
    [[T.rat], /ratio|proportion|equivalent to the ratio/, ['k_ratio', 8]],
    [[T.rat], /\(\$?[\d.,{}]+\s*\\text\{[^}]*\}\s*=|=\s*1\\text|equivalent to how many|how many [a-z ]+ are equivalent|in grams\?|square (yards|miles|kilometers|nautical)|per second squared|which of the following speeds/, ['k_units', 9]],
    [[T.rat], /density/, ['k_units', 8]],
    [[T.rat], /cube with edge|edge length/, ['k_volume', 5]],
    [[T.rat], /per (hour|minute|second|day|pound)|rate|speed|miles|each hour|every \d+ days/, ['k_rates', 6]],
    [[T.rat], /scale model|scale/, ['k_ratio', 6], ['k_scale', 4]],
    [[T.rat], /survey|customers would/, ['k_sampling', 9]],
    [[T.rat], /\\frac\{\d*[a-z]\}\{\d*[a-z]+\}\s*=/, ['k_chunk', 7]],
    // ---- data
    [[T.data], /bar graph|frequency|histogram|dot plot|table (shows|gives) the (number|distribution|frequenc)/, ['k_freq_table', 7]],
    [[T.data], /\bmean\b|average/, ['k_mean', 6]],
    [[T.data], /median/, ['k_median', 6]],
    [[T.data], /\brange\b/, ['k_median', 5]],
    [[T.data], /standard deviation/, ['k_sd', 8]],
    [[T.data], /mean .* (greater|less) than .* median|median .* (greater|less) than .* mean|outlier|which of the following (is|statements?)/, ['k_skew', 6]],
    [[T.data], /mean (is )?(greater|less) than (the )?median/, ['k_skew', 6]],
    [[T.data], /box plot/, ['k_box', 9]],
    [[T.data], /created by (adding|multiplying|subtracting|removing)|adding \d+ to each/, ['k_data_shift', 9]],
    [[T.data], /data set a consists of .* mean of .* data set b/, ['k_combined_mean', 8]],
    // ---- probability
    [[T.prob], /./, ['k_prob_table', 3]],
    [[T.prob], /table|summariz|distribution|survey|frequency|data on/, ['k_prob_table', 6]],
    [[T.prob], /given that|if the (person|flower|student|one) .* (chosen|selected) (is|was)|of those|on which there was no/, ['k_prob_table', 3]],
    // ---- equivalent expressions
    [[T.eq], /equivalent|rewritten|form/, ['k_dm_equiv', 3]],
    [[T.eq], /constant|for all|can be rewritten|in the form|true for all/, ['k_match_coeff', 8], ['k_dm_tilde', 4]],
    [[T.eq], /factor/, ['k_poly_factor', 8]],
    [[T.eq], /\\sqrt|\^\{-|\^\{\\frac|\^\{\(|\^\{\d+\}\s*\\?\)|positive values of x|a\^\{/, ['k_exponents', 7]],
    [[T.eq], /\\frac\{[^}]*\}\{[^}]*x[^}]*\}|\\frac\{[^}]*\}\{\d*[a-z]-\d+\}|\\frac\{[^}]*x[^}]*\}\{[^}]*\}/, ['k_rational_ops', 8]],
    [[T.eq], /\)\^2|x\^2\s*-\s*\d+\b|x\^2-y\^2|x\^2=a/, ['k_factor_patterns', 6]],
    [[T.eq], /\\cdot|g\(x\)\s*\\cdot|\)\s*\(/, ['k_like_terms', 8]],
    [[T.eq], /\(hx\+k\)|can be rewritten as \(/, ['k_poly_factor', 6]]
  ];
  const DEFAULTS = {
    [T.circ]: ['k_circle_basic', 'k_dm_circle'], [T.rt]: ['k_soh', 'k_pyth', 'k_special'], [T.lat]: ['k_tri_angles', 'k_parallel_angles', 'k_angle_basics'],
    [T.pct]: ['k_percent', 'k_fdp', 'k_backsolve'], [T.rat]: ['k_ratio', 'k_units', 'k_rates'], [T.eq]: ['k_dm_equiv', 'k_like_terms', 'k_backsolve'],
    [T.av]: ['k_refsheet', 'k_basic_area'], [T.data]: ['k_mean', 'k_median', 'k_dm_stats'], [T.prob]: ['k_prob_basic', 'k_prob_table', 'k_read_question']
  };
  const isSimplePoly = (p) => !/\\frac|\\sqrt|\^\{-|\^\{\\|factor|constant|for all|rewritten|\\left\(a/.test(p);

  // hand-checked links: these questions use exactly these cards
  const EXACT = {
    rt_e2: ['k_pyth', 'k_dm_typing'],
    rt_e8: ['k_pyth', 'k_dm_typing'],
    rt_m8: ['k_pyth', 'k_dm_typing'],
    rt_e3: ['k_pyth'],
    rt_m7: ['k_pyth'],
    rt_e7: ['k_pyth', 'k_simplify_roots'],
    rt_m10: ['k_pyth', 'k_simplify_roots'],
    rt_h17: ['k_pyth', 'k_simplify_roots'],
    rt_h8: ['k_soh'],
    rt_m11: ['k_special', 'k_soh'],
    rt_m14: ['k_special', 'k_soh'],
    rt_h5: ['k_special', 'k_soh', 'k_trig_table'],
    rt_h7: ['k_equilateral', 'k_special', 'k_quads'],
    rt_e10: ['k_special', 'k_isosceles', 'k_tri_angles'],
    rt_m9: ['k_isosceles', 'k_special', 'k_tri_angles'],
    rt_m12: ['k_isosceles', 'k_special', 'k_tri_angles'],
    rt_h22: ['k_complement', 'k_trig_find'],
    rt_h25: ['k_complement', 'k_trig_table', 'k_special'],
    rt_m2: ['k_complement', 'k_soh'],
    cir_m3: ['k_rad_deg', 'k_unit'],
    cir_m6: ['k_rad_deg', 'k_unit'],
    cir_m8: ['k_rad_deg', 'k_unit'],
    cir_m9: ['k_rad_deg', 'k_unit'],
    cir_m10: ['k_rad_deg', 'k_unit'],
    cir_h5: ['k_unit', 'k_rad_deg'],
    cir_h2: ['k_circle_radii', 'k_isosceles'],
    cir_h8: ['k_arc', 'k_circle_radii', 'k_isosceles', 'k_tri_angles'],
    cir_h18: ['k_circle_radii', 'k_isosceles', 'k_tri_angles'],
    cir_h29: ['k_circle_radii', 'k_dist_mid', 'k_special'],
    cir_h1: ['k_tangent', 'k_slope', 'k_parallel_perp', 'k_point_slope'],
    cir_h16: ['k_tangent', 'k_slope', 'k_parallel_perp', 'k_point_slope'],
    lat_e1: ['k_congruent', 'k_tri_angles'],
    lat_m18: ['k_congruent', 'k_tri_angles'],
    lat_m20: ['k_congruent', 'k_tri_angles'],
    lat_e2: ['k_parallel_angles', 'k_tri_angles', 'k_angle_basics'],
    lat_e6: ['k_parallel_angles', 'k_tri_angles', 'k_angle_basics'],
    lat_e8: ['k_parallel_angles', 'k_tri_angles', 'k_angle_basics'],
    lat_e3: ['k_parallel_angles', 'k_tri_angles'],
    lat_m19: ['k_parallel_angles', 'k_tri_angles'],
    lat_h24: ['k_parallel_angles', 'k_tri_angles'],
    lat_e4: ['k_isosceles', 'k_tri_angles'],
    lat_m11: ['k_isosceles', 'k_tri_angles'],
    lat_m14: ['k_isosceles', 'k_tri_angles'],
    lat_e7: ['k_tri_angles', 'k_angle_basics'],
    lat_e10: ['k_tri_angles', 'k_angle_basics'],
    lat_e12: ['k_tri_angles', 'k_angle_basics'],
    lat_e13: ['k_tri_angles', 'k_angle_basics'],
    lat_m16: ['k_tri_angles', 'k_angle_basics'],
    lat_e15: ['k_angle_basics', 'k_tri_angles'],
    lat_e14: ['k_similar', 'k_ratio'],
    lat_m3: ['k_similar', 'k_ratio'],
    lat_m2: ['k_similar', 'k_parallel_angles'],
    lat_m7: ['k_complement', 'k_similar'],
    lat_m15: ['k_parallel_angles', 'k_angle_basics'],
    lat_h1: ['k_isosceles', 'k_tri_angles', 'k_angle_basics'],
    lat_h4: ['k_isosceles', 'k_tri_angles', 'k_angle_basics'],
    lat_h6: ['k_isosceles', 'k_tri_angles', 'k_angle_basics'],
    lat_h15: ['k_isosceles', 'k_tri_angles', 'k_angle_basics'],
    lat_h2: ['k_angle_basics', 'k_isosceles'],
    lat_h3: ['k_angle_basics'],
    lat_h14: ['k_angle_basics'],
    lat_h13: ['k_parallel_angles'],
    lat_h7: ['k_similar', 'k_parallel_angles', 'k_angle_basics'],
    lat_h20: ['k_similar', 'k_parallel_angles', 'k_angle_basics'],
    lat_h22: ['k_similar', 'k_parallel_angles', 'k_angle_basics'],
    lat_h8: ['k_similar'],
    lat_h9: ['k_similar'],
    lat_h11: ['k_altitude', 'k_pyth', 'k_tri_area'],
    lat_h17: ['k_tri_area'],
    lat_h18: ['k_tri_angles', 'k_parallel_angles'],
    lat_h19: ['k_coord_area', 'k_similar'],
    lat_h21: ['k_similar', 'k_tri_area'],
    lat_h23: ['k_polygon', 'k_parallel_angles'],
    lat_h25: ['k_similar', 'k_pyth', 'k_tri_area'],
    lat_m13: ['k_similar', 'k_scale'],
    av_m7: ['k_dist_mid', 'k_circle_basic'],
    av_h8: ['k_dist_mid', 'k_circle_basic'],
    av_m10: ['k_tri_area'],
    av_h4: ['k_volume', 'k_refsheet'],
    av_m15: ['k_volume', 'k_percent', 'k_refsheet'],
    av_h19: ['k_volume', 'k_pyth', 'k_refsheet'],
    av_e3: ['k_tri_area', 'k_basic_area'],
    av_m4: ['k_basic_area'],
    av_h13: ['k_volume', 'k_words_to_eq', 'k_refsheet'],
    eq_e4: ['k_like_terms', 'k_dm_equiv'],
    eq_e13: ['k_like_terms', 'k_dm_equiv'],
    eq_e12: ['k_like_terms', 'k_dm_equiv'],
    eq_h5: ['k_exponents', 'k_fractions'],
    eq_h11: ['k_poly_factor', 'k_factor_trinomial', 'k_backsolve'],
    eq_h12: ['k_rational_ops', 'k_poly_factor', 'k_dm_equiv'],
    rat_m5: ['k_chunk', 'k_fractions'],
    rat_h5: ['k_chunk', 'k_fractions'],
    rat_m10: ['k_ratio', 'k_similar', 'k_scale'],
    pr_h1: ['k_prob_table', 'k_solve_linear'],
    pr_h5: ['k_prob_basic', 'k_numbers'],
    pr_m9: ['k_rates', 'k_fractions'],
    ov_m13: ['k_box', 'k_sd', 'k_dm_stats'],
    pr_e9: ['k_prob_basic', 'k_read_question'],
    pr_e12: ['k_prob_basic', 'k_read_question'],
    pr_e13: ['k_prob_basic', 'k_read_question'],
    pr_e20: ['k_prob_basic', 'k_read_question'],
    pr_e22: ['k_prob_basic', 'k_read_question'],
    pr_m4: ['k_prob_basic', 'k_read_question'],
    pr_m6: ['k_prob_basic', 'k_read_question'],
    pr_m12: ['k_prob_basic', 'k_read_question'],
    pr_e14: ['k_prob_basic', 'k_words_to_eq'],
    pr_h2: ['k_prob_basic', 'k_counting'],
    ov_m15: ['k_mean', 'k_median', 'k_skew', 'k_sd'],
  };
  window.CARD_LINK_FIX = function (q, ids) {
    if (EXACT[q.id]) return EXACT[q.id].slice();
    const p = (q.prompt || '').toLowerCase();
    const score = {};
    const add = (id, pts) => { score[id] = (score[id] || 0) + pts; };
    ids.forEach((id, i) => add(id, Math.max(1, 4 - i))); // old links: 4, 3, 2, 1
    RULES.forEach(([topics, re, ...gives]) => {
      if (topics && !topics.includes(q.topic)) return;
      if (!re.test(p)) return;
      gives.forEach(([id, pts]) => add(id, pts));
    });
    // basic polynomial clean-up questions: the like-terms card first, the Desmos check second
    if (q.topic === T.eq && isSimplePoly(p)) { add('k_like_terms', 12); add('k_dm_equiv', 3); }
    // circle questions without an equation don't need the equation card
    if (score.k_circle_eq && !/xy-plane|equation|\(x|x\^2/.test(p)) delete score.k_circle_eq;
    if (score.k_equilateral && !/equilateral/.test(p)) delete score.k_equilateral;
    if (q.topic === T.lat) delete score.k_circle_radii;
    // old links that were wrong for these kinds of questions
    if (q.topic === T.av && /rectangle|square|perimeter/.test(p) && !/circle|prism|box|cube/.test(p)) { delete score.k_quads; delete score.k_read_question; }
    if (q.topic === T.eq) { delete score.k_partial; delete score.k_numbers; if (!/\\frac/.test(p)) delete score.k_rational; }
    if (q.topic === T.rat && /survey|customers would/.test(p)) { delete score.k_rates; delete score.k_prob_table; }
    if (q.topic === T.av && score.k_basic_area) delete score.k_refsheet;
    if (q.topic === T.av) {
      if (!/triangle/.test(p) || (/perimeter/.test(p) && !/area/.test(p))) delete score.k_tri_area;
      if (/perimeter/.test(p)) delete score.k_tri_angles;
      if (!/isosceles right|30\^|45\^|60\^/.test(p)) delete score.k_special;
      if (!/cylinder|cone|sphere|prism|cube|volume|container|box|pyramid/.test(p)) { delete score.k_volume; delete score.k_water; delete score.k_refsheet; }
    }
    if (q.topic === T.pct) { delete score.k_eliminate; if (/increas|decreas|greater|less than|depreciat|discount|% more|% less|marks? |sale price/.test(p)) add('k_percent_chain', 2.5); else add('k_fdp', 2.5); }
    if (q.topic === T.lat && !/isosceles|[a-z]{2}\s*=\s*[a-z]{2}|each \d+\^/.test(p)) delete score.k_isosceles;
    if (q.topic === T.prob && !/table|frequency|summariz|shown|distribution/.test(p)) delete score.k_prob_table;
    // long lists of numbers: Desmos mean()/median()
    if (q.topic === T.data && (score.k_mean || score.k_median)) {
      const list = (q.prompt || '').match(/\$\$[^$]*\$\$|(-?\d[\d.]*\s*,\s*){4,}-?\d/);
      if (list && ((list[0].match(/,/g) || []).length >= 4)) add('k_dm_stats', 4.5);
    }
    // up to 5 cards; if fewer than 3 fit well, add the topic's go-to cards
    let out = Object.keys(score).filter(id => score[id] >= 2).sort((a, b) => score[b] - score[a]).slice(0, 5);
    if (!out.length) out = Object.keys(score).sort((a, b) => score[b] - score[a]).slice(0, 2);
    (DEFAULTS[q.topic] || []).forEach(id => { if (out.length < 2 && !out.includes(id)) out.push(id); });
    return out;
  };
})();
