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

  // Question-specific adjustments after mapping (ids: the mapped list, in order).
  // The old links were made for the old cards, so these rules point each question at the most useful new card.
  window.CARD_LINK_FIX = function (q, ids) {
    const p = (q.prompt || '').toLowerCase();
    const has = (id) => ids.includes(id);
    const front = (id) => { ids = [id, ...ids.filter(x => x !== id)]; };
    const drop = (id) => { ids = ids.filter(x => x !== id); };
    const after = (id, ref) => { if (has(id)) return; const k = ids.indexOf(ref); ids.splice(k < 0 ? ids.length : k + 1, 0, id); };
    const before = (id, ref) => { drop(id); const k = ids.indexOf(ref); ids.splice(k < 0 ? 0 : k, 0, id); };

    // Circle equation card only where there is an equation / coordinate plane.
    if (has('k_circle_eq') && !/xy-plane|equation|\(x|x\^2/.test(p)) drop('k_circle_eq');
    if (q.topic === 'Circles' && /xy-plane|\(x|x\^2/.test(p) && has('k_circle_eq')) front('k_circle_eq');
    if (has('k_equilateral') && !/equilateral/.test(p)) drop('k_equilateral');
    // "for all x" / "where a is a constant" questions: matching coefficients first, Desmos regression second.
    if (has('k_dm_tilde')) before('k_match_coeff', 'k_dm_tilde');
    if (/\(hx\+k\)\(x\+j\)/.test(p)) ids = ['k_poly_factor', 'k_match_coeff'];

    if (q.topic === 'Lines, Angles & Triangles') drop('k_circle_radii');

    if (q.topic === 'Area & Volume') {
      const shape = p.replace(/square (units|inches|centimeters|meters|feet|yards|miles|kilometers|millimeters|cm|mm|m)\b/g, '');
      if (/rectangle|square/.test(shape) && !/similar|times|scale|copy|perimeter of square|circle|prism|diagonal|box|surface/.test(p)) ids = ['k_refsheet', 'k_quads'];
      else if (/perimeter/.test(p) && /triangle/.test(p) && !/similar/.test(p)) ids = ['k_read_question'];
      else if (/increases?.*%|%.*increase/.test(p) && /area/.test(p)) ids = ['k_scale', 'k_percent'];
      else if (/square/.test(shape) && /circle/.test(p)) ids = ['k_circle_basic', 'k_quads'];
      if (/volume|cylinder|cone|sphere|prism|cube/.test(p) && has('k_volume')) after('k_refsheet', 'k_volume');
    }

    if (q.topic === 'Ratios, Rates & Units') {
      if (/ratio|proportion|scale/.test(p)) front('k_ratio');
      if (/\(\$?[\d.,{}]+\\text\{[^}]*\}\s*=/.test(q.prompt || '') || /in grams\?|in square (yards|miles|kilometers)/.test(p)) front('k_units');
      if (/survey|customers would be/.test(p)) ids = ['k_sampling', 'k_percent'];
    }
    if (q.topic === 'Percentages' && !has('k_percent')) front('k_percent');

    if (q.topic === 'One-Variable Data' && has('k_mean')) {
      const list = (q.prompt || '').match(/\$\$[^$]*\$\$/);
      if (list && (list[0].match(/,/g) || []).length >= 4) after('k_dm_stats', 'k_mean');
    }
    if (/radians?/.test(p) && !has('k_rad_deg') && (q.topic === 'Circles' || q.topic === 'Right Triangles & Trig')) ids.push('k_rad_deg');
    return ids.slice(0, 4);
  };
})();
