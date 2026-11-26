// CardKit: renders the new-format formula cards (v: 2) and their interactive widgets.
// A card: { v:2, id, topic, title, badge, see:[...], pic: svgString | widget:'unitcircle',
//           formula, steps:[...], example:{ q, a:[...] }, trap, desmos:{ lines:[{show, latex}], tip, degreeMode } }
(function () {
  const css = `
  .k-card { border:1px solid var(--border,#e5e7eb); border-radius:12px; padding:11px 12px; background:#fff; display:flex; flex-direction:column; gap:7px; flex-shrink:0; }
  .k-card.k-on-board { border:none; padding:2px 2px 6px; }
  .k-head { display:flex; align-items:flex-start; gap:6px; }
  .k-title { font-size:14px; font-weight:800; line-height:1.25; flex:1; }
  .k-badge { font-size:10px; font-weight:800; padding:2px 7px; border-radius:999px; white-space:nowrap; text-transform:uppercase; letter-spacing:.03em; margin-top:1px; }
  .k-b-memo { background:#fef3c7; color:#92400e; }
  .k-b-sheet { background:#dcfce7; color:#166534; }
  .k-b-desmos { background:#dbeafe; color:#1e40af; }
  .k-b-strat { background:#f3e8ff; color:#6b21a8; }
  .k-b-bonus { background:#f1f5f9; color:#475569; }
  .k-new { font-size:9px; font-weight:800; color:#fff; background:#111; border-radius:4px; padding:1px 5px; margin-left:4px; vertical-align:middle; }
  .k-see { font-size:12.5px; color:#374151; line-height:1.4; background:#f8f9fa; border-radius:8px; padding:6px 9px; }
  .k-see b { color:#111; }
  .k-see > span { display:block; }
  .k-pic { display:flex; justify-content:center; }
  .k-pic > svg { width:100%; height:auto; max-width:380px; }
  .k-formula { font-size:15px; text-align:center; overflow-x:auto; overflow-y:hidden; padding:2px 0; }
  .k-formula > div + div { margin-top:-6px; }
  .k-more { align-self:flex-start; border:1px solid #d1d5db; background:#fff; border-radius:7px; font-size:12px; font-weight:700; padding:5px 10px; cursor:pointer; color:#111; }
  .k-more:hover { background:#f3f4f6; }
  .k-detail { display:flex; flex-direction:column; gap:8px; }
  .k-detail[hidden] { display:none; }
  .k-steps { margin:0; padding-left:20px; font-size:13px; line-height:1.5; }
  .k-steps li { margin-bottom:3px; }
  .k-label { font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; color:#6b7280; margin-bottom:2px; }
  .k-example { border-left:3px solid #111; padding:4px 0 4px 10px; font-size:13px; line-height:1.5; }
  .k-example .k-ex-a { color:#374151; }
  .k-trap { font-size:12.5px; color:#b91c1c; font-weight:600; line-height:1.4; }
  .k-desmos { border:1px solid #bfdbfe; background:#eff6ff; border-radius:9px; padding:8px 10px; font-size:12.5px; display:flex; flex-direction:column; gap:5px; }
  .k-desmos code { display:block; font-family:ui-monospace,Menlo,Consolas,monospace; font-size:13px; background:#fff; border:1px solid #dbeafe; border-radius:6px; padding:3px 8px; }
  .k-dm-btn { align-self:flex-start; border:none; background:#1d4ed8; color:#fff; font-weight:800; font-size:12px; border-radius:7px; padding:6px 11px; cursor:pointer; }
  .k-ref { display:grid; grid-template-columns:1fr 1fr; gap:6px; width:100%; font-size:12px; }
  .k-ref > div { border:1px solid #e5e7eb; border-radius:8px; padding:5px 7px; }
  .k-ref .k-ref-h { grid-column:1 / -1; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; border:none; padding:4px 0 0; }
  .k-ref .k-ref-h.give { color:#166534; } .k-ref .k-ref-h.mem { color:#92400e; }
  .k-ref .k-mem { background:#fffbeb; border-color:#fde68a; }
  .uc { display:flex; flex-direction:column; gap:6px; width:100%; align-items:center; }
  .uc-bar { display:flex; gap:6px; flex-wrap:wrap; justify-content:center; align-items:center; font-size:12px; }
  .uc-bar button { border:1px solid #d1d5db; background:#fff; border-radius:6px; padding:4px 9px; font-size:12px; font-weight:700; cursor:pointer; color:#111; }
  .uc-bar button.on { background:#111; color:#fff; border-color:#111; }
  .uc-bar input { width:110px; padding:4px 7px; border:1.5px solid #111; border-radius:6px; font-size:14px; font-weight:600; }
  .uc > svg { width:100%; max-width:380px; height:auto; touch-action:manipulation; }
  .uc-pt { cursor:pointer; }
  .uc-info { width:100%; font-size:13px; line-height:1.55; background:#f8f9fa; border-radius:8px; padding:7px 10px; min-height:44px; }
  .uc-info .c { color:#1d4ed8; font-weight:700; } .uc-info .s { color:#dc2626; font-weight:700; }
  .uc-steps { margin:2px 0 0; padding-left:18px; }
  .touch-ui .k-more, .touch-ui .k-dm-btn, .touch-ui .uc-bar button { padding:8px 12px; font-size:13px; }
  .touch-ui .uc-bar input { font-size:16px; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const BADGES = {
    memo: ['Memorize', 'k-b-memo'], sheet: ['On reference sheet', 'k-b-sheet'], partly: ['Partly on sheet', 'k-b-sheet'],
    desmos: ['Desmos', 'k-b-desmos'], strategy: ['Strategy', 'k-b-strat'], bonus: ['Bonus shortcut', 'k-b-bonus']
  };

  function render(f, mode) {
    const board = mode === 'board';
    const b = BADGES[f.badge];
    const see = (f.see || []).map(s => `<span>${s}</span>`).join('');
    const pic = f.widget ? `<div class="k-widget k-interactive" data-widget="${f.widget}" style="width:100%"></div>` : (f.pic || '');
    const steps = f.steps && f.steps.length ? `<div><div class="k-label">Steps</div><ol class="k-steps">${f.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>` : '';
    const ex = f.example ? `<div><div class="k-label">Example</div><div class="k-example"><div>${f.example.q}</div>${(f.example.a || []).map(l => `<div class="k-ex-a">→ ${l}</div>`).join('')}</div></div>` : '';
    const trap = f.trap ? `<div class="k-trap">⚠ Trap: ${f.trap}</div>` : '';
    const dm = f.desmos ? `<div class="k-desmos"><div class="k-label" style="color:#1e40af;">Desmos</div>${f.desmos.lines.map(l => `<code>${l.show}</code>`).join('')}${f.desmos.tip ? `<div>${f.desmos.tip}</div>` : ''}<button class="k-dm-btn">▶ Put in Desmos</button></div>` : '';
    const hasDetail = steps || ex || trap || dm;
    return `<div class="k-card ${board ? 'k-on-board' : ''}" data-card="${f.id}">
      <div class="k-head"><span class="k-title">${f.title}${f.isNew && !board ? '<span class="k-new">NEW</span>' : ''}</span>${b ? `<span class="k-badge ${b[1]}">${b[0]}</span>` : ''}${board ? '' : '<button class="pin-mini-btn k-pin">+ Board</button>'}</div>
      ${see ? `<div class="k-see"><b>You'll see:</b>${see}</div>` : ''}
      ${pic ? `<div class="k-pic">${pic}</div>` : ''}
      ${f.formula ? `<div class="k-formula">${splitFormula(f.formula).map(x => `<div>${x}</div>`).join('')}</div>` : ''}
      ${hasDetail ? `<button class="k-more">${board ? 'Hide steps ▴' : 'Steps, example' + (dm ? ' & Desmos' : '') + ' ▾'}</button><div class="k-detail" ${board ? '' : 'hidden'}>${steps}${ex}${trap}${dm}</div>` : ''}
    </div>`;
  }

  // Long display formulas joined with \qquad become one line each.
  function splitFormula(fm) {
    return [].concat(fm).flatMap(x => {
      const m = String(x).match(/^\$\$([\s\S]*)\$\$$/);
      if (!m || !m[1].includes('\\qquad')) return [x];
      return m[1].split('\\qquad').map(p => '$$' + p.trim() + '$$');
    });
  }
  // Shrink a formula line until it fits the card (KaTeX sizes are em-based).
  function fitFormulas(root) {
    root.querySelectorAll('.k-formula > div').forEach(d => {
      let fs = 15; d.style.fontSize = '';
      while (d.scrollWidth > d.clientWidth + 1 && fs > 10) { fs -= 0.5; d.style.fontSize = fs + 'px'; }
    });
  }
  function hydrate(root, f, api) {
    const more = root.querySelector('.k-more'), detail = root.querySelector('.k-detail');
    if (more && detail) more.onclick = (e) => {
      e.stopPropagation();
      detail.hidden = !detail.hidden;
      more.textContent = detail.hidden ? 'Steps, example' + (f.desmos ? ' & Desmos' : '') + ' ▾' : 'Hide steps ▴';
      if (api.onResize) api.onResize();
    };
    const dmBtn = root.querySelector('.k-dm-btn');
    if (dmBtn) dmBtn.onclick = (e) => { e.stopPropagation(); api.putInDesmos(f.desmos.lines.map(l => l.expr || l.latex), { degreeMode: f.desmos.degreeMode }); };
    const w = root.querySelector('.k-widget');
    if (w && WIDGETS[w.dataset.widget]) WIDGETS[w.dataset.widget](w, api);
    api.renderMath(root);
    fitFormulas(root);
    requestAnimationFrame(() => fitFormulas(root));
  }

  function searchText(f) {
    return [f.title, ...(f.see || []), ...[].concat(f.formula || []), ...(f.steps || []), f.trap, f.topic, f.keywords || ''].join(' ').toLowerCase();
  }

  /* ==================== UNIT CIRCLE ==================== */
  const STD = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  const EXACT = {
    cos: { 0: '1', 30: '\\frac{\\sqrt3}{2}', 45: '\\frac{\\sqrt2}{2}', 60: '\\frac12', 90: '0' },
    sin: { 0: '0', 30: '\\frac12', 45: '\\frac{\\sqrt2}{2}', 60: '\\frac{\\sqrt3}{2}', 90: '1' },
    tan: { 0: '0', 30: '\\frac{\\sqrt3}{3}', 45: '1', 60: '\\sqrt3', 90: '\\text{undefined}' }
  };
  const PLAIN = { 0: '0', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '1' };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  function radLabel(D, latex) {
    if (D === 0) return '0';
    const g = gcd(D, 180), n = D / g, d = 180 / g;
    const pi = latex ? '\\pi' : 'π';
    const top = (n === 1 ? '' : n) + pi;
    if (d === 1) return top;
    return latex ? `\\frac{${top}}{${d}}` : `${top}/${d}`;
  }
  function fracPi(r, d) {
    if (r === 0) return '0';
    const g = gcd(r, d), n = r / g, dd = d / g, top = (n === 1 ? '' : n) + '\\pi';
    return dd === 1 ? top : `\\frac{${top}}{${dd}}`;
  }
  function quadInfo(D) {
    if (D % 90 === 0) return { axis: true, ref: D === 0 || D === 180 ? 0 : 90 };
    const q = Math.floor(D / 90) + 1;
    const ref = [D, 180 - D, D - 180, 360 - D][q - 1];
    const sign = [['+', '+', '+'], ['-', '+', '-'], ['-', '-', '+'], ['+', '-', '-']][q - 1];
    return { q, ref, sign };
  }
  function signed(sign, val) { return val === '0' || val.includes('undefined') ? val : (sign === '-' ? '-' : '') + val; }
  function values(D) {
    const qi = quadInfo(D);
    if (qi.axis) {
      const t = { 0: ['1', '0', '0'], 90: ['0', '1', '\\text{undefined}'], 180: ['-1', '0', '0'], 270: ['0', '-1', '\\text{undefined}'] }[D];
      return { exact: true, cos: t[0], sin: t[1], tan: t[2], qi };
    }
    if ([30, 45, 60].includes(qi.ref)) {
      return { exact: true, qi, cos: signed(qi.sign[0], EXACT.cos[qi.ref]), sin: signed(qi.sign[1], EXACT.sin[qi.ref]), tan: signed(qi.sign[2], EXACT.tan[qi.ref]) };
    }
    const r = D * Math.PI / 180, f = v => (Math.round(v * 10000) / 10000).toString();
    return { exact: false, qi, cos: f(Math.cos(r)), sin: f(Math.sin(r)), tan: f(Math.tan(r)) };
  }
  // "565pi/6", "-7π/4", "π/3", "2pi", "750", "-210°" → { deg in [0,360), steps:[...] }
  function parseAngle(raw) {
    const s = String(raw).trim().toLowerCase().replace(/\s+/g, '').replace(/pi/g, 'π').replace(/−/g, '-').replace(/°|deg/g, '');
    let m = s.match(/^(-?\d*)π(?:\/(\d+))?$/);
    if (!m) { const m2 = s.match(/^(-?\d+)\/(\d+)π$/); if (m2) m = [null, m2[1], m2[2]]; }
    if (m) {
      let k = m[1] === '' ? 1 : m[1] === '-' ? -1 : parseInt(m[1], 10);
      const d = m[2] ? parseInt(m[2], 10) : 1;
      if (!d) return null;
      const turn = 2 * d, r = ((k % turn) + turn) % turn, n = (k - r) / turn;
      const deg = r * 180 / d;
      const name = `${k === 1 ? '' : k === -1 ? '-' : k}\\pi${d === 1 ? '' : '/' + d}`;
      const steps = [];
      if (n > 0) {
        steps.push(`One full turn $= 2\\pi = \\frac{${turn}\\pi}{${d}}$. Count turns: $${k} \\div ${turn} = ${n}$ remainder $${r}$.`);
        steps.push(`Remove $${n}$ full turn${n === 1 ? '' : 's'} → $${name} \\to ${fracPi(r, d)}$`);
      } else if (n < 0) {
        steps.push(`Negative angle: add full turns ($2\\pi = \\frac{${turn}\\pi}{${d}}$) until it is positive: $${k} + ${-n * turn} = ${r}$ → $${fracPi(r, d)}$`);
      }
      steps.push(`Convert: replace $\\pi$ with $180^\\circ$ → $${Number.isInteger(deg) ? deg : deg.toFixed(2)}^\\circ$`);
      return { deg, steps, name };
    }
    m = s.match(/^(-?\d+(?:\.\d+)?)$/);
    if (m) {
      const v = parseFloat(m[1]), r = ((v % 360) + 360) % 360, n = Math.round((v - r) / 360);
      const steps = [];
      if (n !== 0) steps.push(`${n > 0 ? 'Subtract' : 'Add'} $360^\\circ$ ${Math.abs(n) === 1 ? 'once' : Math.abs(n) + ' times'}: $${v}^\\circ \\to ${r}^\\circ$`);
      return { deg: r, steps, name: v + '^\\circ' };
    }
    return null;
  }

  function unitCircle(mount, api) {
    let mode = 'deg', coords = true, sel = 210, typed = null;
    mount.innerHTML = `<div class="uc">
      <div class="uc-bar"><button data-m="deg" class="on">Degrees</button><button data-m="rad">Radians</button><button data-c="1" class="on">Coordinates</button></div>
      <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="uc-bar">Any angle: <input type="text" placeholder="29pi/6" /><button data-go="1">Go</button></div>
      <div class="uc-info"></div></div>`;
    const svg = mount.querySelector('svg'), info = mount.querySelector('.uc-info'), input = mount.querySelector('input');
    const C = 210, R = 105;
    const P = (deg, rad) => [C + rad * Math.cos(deg * Math.PI / 180), C - rad * Math.sin(deg * Math.PI / 180)];
    function draw() {
      let s = '';
      // quadrant sign hints
      s += `<g font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="#9ca3af">
        <text x="${C + 52}" y="${C - 48}" text-anchor="middle">Q1: all +</text><text x="${C - 52}" y="${C - 48}" text-anchor="middle">Q2: sin +</text>
        <text x="${C - 52}" y="${C + 58}" text-anchor="middle">Q3: tan +</text><text x="${C + 52}" y="${C + 58}" text-anchor="middle">Q4: cos +</text></g>`;
      s += `<line x1="20" y1="${C}" x2="400" y2="${C}" stroke="#9ca3af"/><line x1="${C}" y1="20" x2="${C}" y2="400" stroke="#9ca3af"/>`;
      s += `<text x="404" y="${C + 4}" font-size="12" fill="#6b7280">x</text><text x="${C + 5}" y="18" font-size="12" fill="#6b7280">y</text>`;
      s += `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#111" stroke-width="1.6"/>`;
      // selection geometry (drawn under the points)
      if (sel !== null) {
        const [px, py] = P(sel, R), v = values(sel);
        const big = sel > 180 ? 1 : 0;
        const [ax, ay] = P(sel, 24);
        if (sel > 0) s += `<path d="M${C + 24} ${C} A24 24 0 ${big} 0 ${ax} ${ay}" fill="none" stroke="#6b7280" stroke-width="1.3"/>`;
        // reference angle arc (between radius and x-axis)
        if (!v.qi.axis) {
          const toAxis = v.qi.q === 1 || v.qi.q === 4 ? 0 : 180;
          const [bx, by] = P(toAxis, 40), [cx2, cy2] = P(sel, 40);
          const sweep = (v.qi.q === 1 || v.qi.q === 3) ? 0 : 1;
          s += `<path d="M${bx} ${by} A40 40 0 0 ${sweep} ${cx2} ${cy2}" fill="none" stroke="#f59e0b" stroke-width="3"/>`;
          const [lx, ly] = P(toAxis === 0 ? (v.qi.q === 1 ? sel / 2 : 360 - v.qi.ref / 2) : (v.qi.q === 2 ? 180 - v.qi.ref / 2 : 180 + v.qi.ref / 2), 56);
          s += `<text x="${lx}" y="${ly + 4}" font-size="11" font-weight="800" fill="#b45309" text-anchor="middle">${Math.round(v.qi.ref * 10) / 10}°</text>`;
        }
        s += `<line x1="${C}" y1="${C}" x2="${px}" y2="${C}" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round"/>`;
        s += `<line x1="${px}" y1="${C}" x2="${px}" y2="${py}" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>`;
        s += `<line x1="${C}" y1="${C}" x2="${px}" y2="${py}" stroke="#111" stroke-width="2"/>`;
        s += `<text x="${(C + px) / 2}" y="${C + (py > C ? -7 : 15)}" font-size="12" font-weight="800" fill="#1d4ed8" text-anchor="middle">cos</text>`;
        s += `<text x="${px + (px >= C ? 8 : -8)}" y="${(C + py) / 2 + 4}" font-size="12" font-weight="800" fill="#dc2626" text-anchor="${px >= C ? 'start' : 'end'}">sin</text>`;
      }
      STD.forEach(D => {
        const [px, py] = P(D, R), [lx, ly] = P(D, R + 17), [cx2, cy2r] = P(D, R + 52), cy2 = (D === 0 || D === 180) ? cy2r - 10 : cy2r;
        const on = D === sel;
        s += `<circle cx="${px}" cy="${py}" r="${on ? 6.5 : 4.2}" fill="${on ? '#111' : '#fff'}" stroke="#111" stroke-width="1.6"/>`;
        s += `<text x="${lx}" y="${ly + 4}" font-size="12.5" font-weight="${on ? 800 : 600}" text-anchor="middle" fill="#111">${mode === 'deg' ? D + '°' : radLabel(D, false)}</text>`;
        if (coords) {
          const v = values(D), t = x => x.replace(/\\frac\{\\sqrt(\d)\}\{2\}/g, '√$1/2').replace(/\\frac12/g, '1/2').replace('\\text{undefined}', '—');
          s += `<text x="${cx2}" y="${cy2 + 4}" font-size="10.5" text-anchor="middle" fill="${on ? '#111' : '#4b5563'}" font-weight="${on ? 800 : 500}">(${t(v.cos)}, ${t(v.sin)})</text>`;
        }
        s += `<circle class="uc-pt" data-d="${D}" cx="${px}" cy="${py}" r="15" fill="transparent"/>`;
      });
      if (sel !== null && !STD.includes(sel)) {
        const [px, py] = P(sel, R);
        s += `<circle cx="${px}" cy="${py}" r="6.5" fill="#111"/>`;
      }
      svg.innerHTML = s;
      svg.querySelectorAll('.uc-pt').forEach(el => el.addEventListener('click', (e) => { e.stopPropagation(); sel = Number(el.dataset.d); typed = null; draw(); emit(); }));
      explain();
    }
    function explain() {
      if (sel === null) { info.innerHTML = 'Tap a point.'; return; }
      const v = values(sel);
      const degTxt = Number.isInteger(sel) ? sel : sel.toFixed(2);
      const refTxt = Number.isInteger(v.qi.ref) ? v.qi.ref : (Math.round(v.qi.ref * 100) / 100);
      const where = v.qi.axis ? 'on an axis' : `Quadrant ${['I', 'II', 'III', 'IV'][v.qi.q - 1]}, reference angle $${refTxt}^\\circ$`;
      let h = '';
      if (typed) h += `<div><b>$${typed.name}$</b></div><ol class="uc-steps">${typed.steps.map(x => `<li>${x}</li>`).join('')}</ol>`;
      h += `<div>$\\theta = ${degTxt}^\\circ${Number.isInteger(sel) ? ' = ' + radLabel(sel, true) : ''}$ · ${where}</div>`;
      if (!v.qi.axis) h += `<div style="font-size:12px;color:#6b7280;">Signs in Q${v.qi.q}: cos ${v.qi.sign[0]}, sin ${v.qi.sign[1]}, tan ${v.qi.sign[2]}. Use the ${refTxt}° values, then add the sign.</div>`;
      h += `<div><span class="c">cos θ = $${v.cos}$</span> &nbsp; <span class="s">sin θ = $${v.sin}$</span> &nbsp; tan θ = $${v.tan}$</div>`;
      if (!v.exact) h += `<div style="font-size:12px;color:#6b7280;">Not a special angle — these are decimals. On the test, use Desmos.</div>`;
      info.innerHTML = h;
      api.renderMath(info);
    }
    // Shared boards: report every change, and accept the other person's state.
    const emit = () => { if (api.onWidgetState) api.onWidgetState({ mode, coords, sel, q: typed ? input.value : null }); };
    const syncBars = () => { mount.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x.dataset.m === mode)); cb.classList.toggle('on', coords); };
    mount.querySelectorAll('[data-m]').forEach(b => b.onclick = (e) => { e.stopPropagation(); mode = b.dataset.m; syncBars(); draw(); emit(); });
    const cb = mount.querySelector('[data-c]');
    cb.onclick = (e) => { e.stopPropagation(); coords = !coords; syncBars(); draw(); emit(); };
    const go = () => {
      const r = parseAngle(input.value);
      if (!r) { info.innerHTML = 'Try a form like <b>565pi/6</b>, <b>7π/4</b>, <b>-210</b> or <b>750</b>.'; return; }
      sel = Math.round(r.deg * 1e6) / 1e6; typed = r; draw(); emit();
    };
    mount._setState = (st) => {
      if (!st) return;
      mode = st.mode === 'rad' ? 'rad' : 'deg'; coords = st.coords !== false;
      const r = st.q ? parseAngle(st.q) : null;
      if (r) { input.value = st.q; sel = Math.round(r.deg * 1e6) / 1e6; typed = r; }
      else { typed = null; sel = (st.sel === null || st.sel === undefined) ? 210 : st.sel; }
      syncBars(); draw();
    };
    mount.querySelector('[data-go]').onclick = (e) => { e.stopPropagation(); go(); };
    input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') go(); });
    input.addEventListener('keyup', (e) => e.stopPropagation());
    draw();
    if (api.widgetState) mount._setState(api.widgetState);
  }


  /* ==================== PICTURE KIT (used by data/cards_*.js) ==================== */
  const FONT = "font-family='Inter,Arial,sans-serif'";
  const KP = {
    svg: (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" ${FONT}>${body}</svg>`,
    t: (x, y, s, o = {}) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" font-size="${o.s || 12}" fill="${o.c || '#111'}" font-weight="${o.b ? 700 : (o.w || 400)}" text-anchor="${o.a || 'start'}"${o.i ? ' font-style="italic"' : ''}>${s}</text>`,
    l: (x1, y1, x2, y2, o = {}) => `<line x1="${(+x1).toFixed(1)}" y1="${(+y1).toFixed(1)}" x2="${(+x2).toFixed(1)}" y2="${(+y2).toFixed(1)}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.6}"${o.d ? ` stroke-dasharray="${o.d}"` : ''} stroke-linecap="round"/>`,
    c: (cx, cy, r, o = {}) => `<circle cx="${(+cx).toFixed(1)}" cy="${(+cy).toFixed(1)}" r="${r}" fill="${o.f || 'none'}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.6}"${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`,
    dot: (x, y, c = '#111', r = 4) => `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${r}" fill="${c}"/>`,
    poly: (pts, o = {}) => `<polygon points="${pts.map(p => p.map(v => (+v).toFixed(1)).join(',')).join(' ')}" fill="${o.f || 'none'}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.6}"${o.d ? ` stroke-dasharray="${o.d}"` : ''} stroke-linejoin="round"/>`,
    path: (d, o = {}) => `<path d="${d}" fill="${o.f || 'none'}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.6}"${o.d ? ` stroke-dasharray="${o.d}"` : ''} stroke-linejoin="round"/>`,
    rect: (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 0}" fill="${o.f || 'none'}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.4}"${o.d ? ` stroke-dasharray="${o.d}"` : ''}/>`,
    // right-angle mark at vertex V, sides going toward points A and B
    ra: (V, A, B, s = 10) => {
      const u = (P) => { const dx = P[0] - V[0], dy = P[1] - V[1], n = Math.hypot(dx, dy); return [dx / n * s, dy / n * s]; };
      const a = u(A), b = u(B);
      return `<path d="M${V[0] + a[0]} ${V[1] + a[1]} L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]} L${V[0] + b[0]} ${V[1] + b[1]}" fill="none" stroke="#111" stroke-width="1.2"/>`;
    },
    // arc around (cx,cy) from math-angle a1 to a2 (degrees, counter-clockwise)
    arc: (cx, cy, r, a1, a2, o = {}) => {
      const P = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
      const [x1, y1] = P(a1), [x2, y2] = P(a2), large = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="${o.f || 'none'}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.3}"/>`;
    },
    // angle (degrees) of the direction from P to Q, math orientation
    ang: (P, Q) => Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * 180 / Math.PI,
    // coordinate plane
    plot(cfg) {
      const o = Object.assign({ w: 360, h: 210, l: 30, r: 12, t: 12, b: 22, grid: true, axes: true, labels: true }, cfg);
      const X = x => o.l + (x - o.x0) / (o.x1 - o.x0) * (o.w - o.l - o.r);
      const Y = y => o.t + (o.y1 - y) / (o.y1 - o.y0) * (o.h - o.t - o.b);
      let s = '';
      if (o.grid) {
        for (let x = Math.ceil(o.x0 / o.xt) * o.xt; x <= o.x1 + 1e-9; x += o.xt) s += KP.l(X(x), Y(o.y0), X(x), Y(o.y1), { c: '#eef0f3', w: 1 });
        for (let y = Math.ceil(o.y0 / o.yt) * o.yt; y <= o.y1 + 1e-9; y += o.yt) s += KP.l(X(o.x0), Y(y), X(o.x1), Y(y), { c: '#eef0f3', w: 1 });
      }
      if (o.axes) {
        const ax = Math.min(Math.max(0, o.y0), o.y1), ay = Math.min(Math.max(0, o.x0), o.x1);
        s += KP.l(X(o.x0), Y(ax), X(o.x1), Y(ax), { c: '#6b7280', w: 1.2 }) + KP.l(X(ay), Y(o.y0), X(ay), Y(o.y1), { c: '#6b7280', w: 1.2 });
        if (o.labels) {
          for (let x = Math.ceil(o.x0 / o.xt) * o.xt; x <= o.x1 + 1e-9; x += o.xt) if (Math.abs(x) > 1e-9) s += KP.t(X(x), Y(ax) + 13, +x.toFixed(4), { s: 9.5, c: '#6b7280', a: 'middle' });
          for (let y = Math.ceil(o.y0 / o.yt) * o.yt; y <= o.y1 + 1e-9; y += o.yt) if (Math.abs(y) > 1e-9) s += KP.t(X(ay) - 4, Y(y) + 3, +y.toFixed(4), { s: 9.5, c: '#6b7280', a: 'end' });
        }
      }
      const p = {
        X, Y, o, s,
        add(str) { p.s += str; return p; },
        fn(f, st = {}) {
          let d = '', pen = false;
          for (let i = 0; i <= 240; i++) {
            const x = o.x0 + (o.x1 - o.x0) * i / 240, y = f(x);
            if (!isFinite(y) || y < o.y0 - (o.y1 - o.y0) * 0.02 || y > o.y1 + (o.y1 - o.y0) * 0.02) { pen = false; continue; }
            d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); pen = true;
          }
          return p.add(KP.path(d, { c: st.c || '#111', w: st.w || 2.4, d: st.d }));
        },
        seg(x1, y1, x2, y2, st = {}) { return p.add(KP.l(X(x1), Y(y1), X(x2), Y(y2), Object.assign({ w: 2.2 }, st))); },
        pt(x, y, st = {}) {
          p.add(st.open ? KP.c(X(x), Y(y), st.r || 4.5, { f: '#fff', c: st.c || '#111', w: 2 }) : KP.dot(X(x), Y(y), st.c || '#111', st.r || 4.5));
          if (st.label) p.add(KP.t(X(x) + (st.dx ?? 8), Y(y) + (st.dy ?? -7), st.label, { s: st.s || 11, c: st.c || '#111', b: true, a: st.a }));
          return p;
        },
        txt(x, y, str, st = {}) { return p.add(KP.t(X(x), Y(y), str, st)); },
        shade(pts, fill) { return p.add(KP.poly(pts.map(([x, y]) => [X(x), Y(y)]), { f: fill, c: 'none', w: 0 })); },
        svg(extra = '') { return KP.svg(o.w, o.h, p.s + extra); }
      };
      return p;
    }
  };

  const WIDGETS = { unitcircle: unitCircle };
  window.CardKit = { render, hydrate, searchText, parseAngle, values, isV2: f => f && f.v === 2 };
  window.KP = KP;
})();
