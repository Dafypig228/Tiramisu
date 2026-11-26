// One-Variable Data: distributions and measures of center and spread
// Transcribed from "(3)one-variable data distributions and measures of center an.pdf".
// Charts are drawn by the small SVG helpers below (bar graph, histogram, dot plot, box plot).
(function () {
  const FONT = "font-family='Times New Roman, serif' fill='#111'";

  // Bar graph / histogram. For a histogram pass edges (bin boundaries) instead of cats.
  function bars({ cats, edges, vals, yMax, yStep, yLabel = '', xLabel = '', title = '', w = 300, h = 200, gap = 0.4, rotate = false }) {
    const hist = !!edges;
    const n = vals.length;
    const top = title ? 26 : 10, left = yLabel ? 46 : 30, right = 10, bottom = (rotate ? 46 : 22) + (xLabel ? 18 : 0);
    const pw = w - left - right, ph = h - top - bottom;
    const slot = pw / n, bw = hist ? slot : slot * (1 - gap);
    const y = v => top + ph - (v / yMax) * ph;
    let s = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    if (title) s += `<text x="${left + pw / 2}" y="16" text-anchor="middle" font-size="14" ${FONT}>${title}</text>`;
    for (let v = 0; v <= yMax + 1e-9; v += yStep) {
      s += `<line x1="${left}" y1="${y(v)}" x2="${left + pw}" y2="${y(v)}" stroke="${v === 0 ? '#111' : '#9ca3af'}" stroke-width="${v === 0 ? 1.4 : 0.8}"/>`;
      s += `<text x="${left - 5}" y="${y(v) + 4}" text-anchor="end" font-size="11" ${FONT}>${v}</text>`;
    }
    s += `<line x1="${left}" y1="${top}" x2="${left}" y2="${top + ph}" stroke="#111" stroke-width="1.4"/>`;
    vals.forEach((v, i) => {
      const x0 = left + i * slot + (slot - bw) / 2;
      if (v > 0) s += `<rect x="${x0}" y="${y(v)}" width="${bw}" height="${top + ph - y(v)}" fill="#b5b5b5" stroke="#111" stroke-width="1"/>`;
      if (!hist) {
        const cx = left + i * slot + slot / 2;
        s += rotate
          ? `<text transform="translate(${cx + 4},${top + ph + 10}) rotate(-40)" text-anchor="end" font-size="11" ${FONT}>${cats[i]}</text>`
          : `<text x="${cx}" y="${top + ph + 15}" text-anchor="middle" font-size="11" ${FONT}>${cats[i]}</text>`;
      }
    });
    if (hist) edges.forEach((e, i) => {
      const x = left + i * slot;
      s += `<line x1="${x}" y1="${top + ph}" x2="${x}" y2="${top + ph + 4}" stroke="#111"/>`;
      s += `<text x="${x}" y="${top + ph + 16}" text-anchor="middle" font-size="11" ${FONT}>${e}</text>`;
    });
    if (yLabel) s += `<text transform="translate(13,${top + ph / 2}) rotate(-90)" text-anchor="middle" font-size="12" ${FONT}>${yLabel}</text>`;
    if (xLabel) s += `<text x="${left + pw / 2}" y="${h - 4}" text-anchor="middle" font-size="12" ${FONT}>${xLabel}</text>`;
    return s + '</svg>';
  }

  // Dot plot: values min..max (step 1), counts[i] dots above each value.
  function dots({ min, max, counts, title = '', xLabel = '', unit = 30, r = 4.2 }) {
    const n = max - min + 1, maxC = Math.max(...counts);
    const left = 18, w = left * 2 + (n - 1) * unit, top = title ? 26 : 8;
    const axisY = top + maxC * 13 + 8, h = axisY + 22 + (xLabel ? 18 : 0);
    let s = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    if (title) s += `<text x="${w / 2}" y="16" text-anchor="middle" font-size="14" ${FONT}>${title}</text>`;
    s += `<line x1="4" y1="${axisY}" x2="${w - 4}" y2="${axisY}" stroke="#111" stroke-width="1.3"/>`;
    for (let i = 0; i < n; i++) {
      const x = left + i * unit;
      s += `<line x1="${x}" y1="${axisY - 4}" x2="${x}" y2="${axisY + 4}" stroke="#111"/>`;
      s += `<text x="${x}" y="${axisY + 17}" text-anchor="middle" font-size="12" ${FONT}>${min + i}</text>`;
      for (let k = 0; k < counts[i]; k++) s += `<circle cx="${x}" cy="${axisY - 10 - k * 13}" r="${r}" fill="#111"/>`;
    }
    if (xLabel) s += `<text x="${w / 2}" y="${h - 3}" text-anchor="middle" font-size="12" ${FONT}>${xLabel}</text>`;
    return s + '</svg>';
  }

  // Box plots on one shared axis. rows: [{ label, min, q1, med, q3, max }]
  function boxes({ rows, lo, hi, tick, labelEvery, xLabel = '', w = 340, fmt = v => v, rotateLabels = false }) {
    const lab = rows.some(r => r.label) ? 70 : 12, right = 16;
    const pw = w - lab - right, x = v => lab + (v - lo) / (hi - lo) * pw;
    const rowH = 30, axisY = 14 + rows.length * rowH;
    const h = axisY + (rotateLabels ? 44 : 22) + (xLabel ? 18 : 0);
    let s = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
    rows.forEach((r, i) => {
      const cy = 14 + i * rowH + rowH / 2 - 4;
      if (r.label) s += `<text x="4" y="${cy + 5}" font-size="13" ${FONT}>${r.label}</text>`;
      s += `<line x1="${x(r.min)}" y1="${cy}" x2="${x(r.q1)}" y2="${cy}" stroke="#111" stroke-width="1.3"/>`;
      s += `<line x1="${x(r.q3)}" y1="${cy}" x2="${x(r.max)}" y2="${cy}" stroke="#111" stroke-width="1.3"/>`;
      s += `<line x1="${x(r.min)}" y1="${cy - 7}" x2="${x(r.min)}" y2="${cy + 7}" stroke="#111" stroke-width="1.3"/>`;
      s += `<line x1="${x(r.max)}" y1="${cy - 7}" x2="${x(r.max)}" y2="${cy + 7}" stroke="#111" stroke-width="1.3"/>`;
      s += `<rect x="${x(r.q1)}" y="${cy - 9}" width="${x(r.q3) - x(r.q1)}" height="18" fill="#fff" stroke="#111" stroke-width="1.3"/>`;
      s += `<line x1="${x(r.med)}" y1="${cy - 9}" x2="${x(r.med)}" y2="${cy + 9}" stroke="#111" stroke-width="1.3"/>`;
    });
    s += `<line x1="${x(lo) - 6}" y1="${axisY}" x2="${x(hi) + 6}" y2="${axisY}" stroke="#111" stroke-width="1.2"/>`;
    let k = 0;
    for (let v = lo; v <= hi + 1e-9; v += tick, k++) {
      s += `<line x1="${x(v)}" y1="${axisY - 4}" x2="${x(v)}" y2="${axisY + 4}" stroke="#111"/>`;
      if (k % labelEvery === 0) s += rotateLabels
        ? `<text transform="translate(${x(v) + 3},${axisY + 9}) rotate(-60)" text-anchor="end" font-size="10" ${FONT}>${fmt(v)}</text>`
        : `<text x="${x(v)}" y="${axisY + 17}" text-anchor="middle" font-size="12" ${FONT}>${fmt(v)}</text>`;
    }
    if (xLabel) s += `<text x="${lab + pw / 2}" y="${h - 3}" text-anchor="middle" font-size="12" ${FONT}>${xLabel}</text>`;
    return s + '</svg>';
  }

  // HTML table for the diagram box (styled by .q-diagram-box table)
  function tbl(head, rows, caption = '') {
    return (caption ? `<div style="text-align:center;font-size:12px;font-weight:700;margin-bottom:3px;">${caption}</div>` : '') +
      `<table><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr>` +
      rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') + '</table>';
  }
  // Small inline table used inside answer choices
  function ctbl(head, rows) {
    const cell = 'border:1px solid #111;padding:2px 9px;text-align:center;';
    return `<table style="border-collapse:collapse;font-size:12px;background:#fff;"><tr>${head.map(c => `<th style="${cell}background:#f3f4f6;">${c}</th>`).join('')}</tr>` +
      rows.map(r => `<tr>${r.map(c => `<td style="${cell}">${c}</td>`).join('')}</tr>`).join('') + '</table>';
  }
  const pair = (a, b) => `<div style="display:flex;gap:18px;align-items:flex-end;justify-content:center;flex-wrap:wrap;">${a}${b}</div>`;
  const T = 'One-Variable Data';
  const q = (id, difficulty, n, o) => Object.assign({ id, topic: T, difficulty, num: `${difficulty[0].toUpperCase() + difficulty.slice(1)} #${n}`, diagramHtml: '', formulas: [] }, o);

  window.SAT_QUESTIONS.push(
    // ==================== EASY (25) ====================
    q('ov_e1', 'easy', 1, { prompt: '$$2, 2, 2, 3, 4, 4, 11$$ What is the median of the seven data values shown?', type: 'mcq', choices: { A: '$2$', B: '$3$', C: '$4$', D: '$9$' }, answer: 'B', formulas: ['d_minmax'] }),
    q('ov_e2', 'easy', 2, { prompt: 'The bar graph summarizes the charge, in kilowatt-hours (kWh), a battery received each day for $15$ days. For how many of these $15$ days did the battery receive a charge of $0$ kWh?',
      diagramHtml: bars({ cats: [0, 8, 9, 11, 16, 23], vals: [6, 1, 2, 4, 1, 1], yMax: 7, yStep: 1, yLabel: 'Number of days', xLabel: 'Charge (kWh)' }),
      type: 'mcq', choices: { A: '$0$', B: '$1$', C: '$4$', D: '$6$' }, answer: 'D', formulas: ['d_mean'] }),
    q('ov_e3', 'easy', 3, { prompt: '$$4, 4, 4, 4, 8, 8, 8, 13, 13$$ Which frequency table correctly represents the data listed?', type: 'mcq',
      choices: {
        A: ctbl(['Number', 'Frequency'], [[4, 4], [8, 3], [13, 2]]),
        B: ctbl(['Number', 'Frequency'], [[4, 4], [3, 8], [2, 13]]),
        C: ctbl(['Number', 'Frequency'], [[4, 16], [8, 24], [13, 26]]),
        D: ctbl(['Number', 'Frequency'], [[16, 4], [24, 8], [26, 13]])
      }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_e4', 'easy', 4, { prompt: 'The bar graph shows the distribution of the number of students in each of four extracurricular activities at a high school. How many students are in drama?',
      diagramHtml: bars({ cats: ['chess', 'drama', 'robotics', 'yearbook'], vals: [30, 40, 58, 43], yMax: 60, yStep: 10, yLabel: 'Number of students', xLabel: 'Activity', rotate: true, h: 220 }),
      type: 'mcq', choices: { A: '$10$', B: '$30$', C: '$40$', D: '$70$' }, answer: 'C', formulas: ['d_mean'] }),
    q('ov_e5', 'easy', 5, { prompt: 'Data set A: $72, 73, 73, 76, 76$<br>Data set B: $61, 64, 74, 85, x$<br>Data set A and data set B each contain $5$ numbers. If the mean of data set A is equal to the mean of data set B, what is the value of $x$?', type: 'mcq', choices: { A: '$77$', B: '$85$', C: '$86$', D: '$95$' }, answer: 'C', formulas: ['d_mean'] }),
    q('ov_e6', 'easy', 6, { prompt: 'For a school fund-raiser, $10$ students sold a total of $90$ boxes of cookies. Which of the following can be calculated from this information?', type: 'mcq', choices: { A: 'The average number of boxes sold per student', B: 'The median number of boxes sold per student', C: 'The greatest number of boxes sold by one student', D: 'The least number of boxes sold by one student' }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_e7', 'easy', 7, { prompt: 'The bar graph shows the distribution of the number of walnuts per container for $20$ containers at a grocery store. How many of these containers of walnuts contain exactly $78$ walnuts?',
      diagramHtml: bars({ cats: [75, 76, 77, 78], vals: [2, 5, 6, 7], yMax: 8, yStep: 1, yLabel: 'Frequency', xLabel: 'Number of walnuts per container' }),
      type: 'mcq', choices: { A: '$2$', B: '$7$', C: '$20$', D: '$78$' }, answer: 'B', formulas: ['d_mean'] }),
    q('ov_e8', 'easy', 8, { prompt: 'A data set consists of $173$ colors. The bar graph shows the number of times each color appears in the data set. Which color appears $70$ times?',
      diagramHtml: bars({ cats: ['blue', 'green', 'red', 'yellow'], vals: [27, 70, 33, 43], yMax: 80, yStep: 10, yLabel: 'Frequency', xLabel: 'Color' }),
      type: 'mcq', choices: { A: 'Blue', B: 'Green', C: 'Red', D: 'Yellow' }, answer: 'B', formulas: ['d_mean'] }),
    q('ov_e9', 'easy', 9, { prompt: 'Five <i>Eretmochelys imbricata</i>, a type of sea turtle, each have a nest. The table shows an original data set of the number of eggs that each turtle laid in its nest. A sixth nest with $121$ eggs is added to create a new data set. Which of the following correctly compares the means of the two data sets?',
      diagramHtml: tbl(['Nest', 'Number of eggs'], [['A', 149], ['B', 144], ['C', 148], ['D', 136], ['E', 139]]),
      type: 'mcq', choices: { A: 'The mean of the original data set is greater than the mean of the new data set.', B: 'The mean of the original data set is less than the mean of the new data set.', C: 'The means of both data sets are equal.', D: 'There is not enough information to compare the means.' }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_e10', 'easy', 10, { prompt: '$$73, 74, 75, 77, 79, 82, 84, 85, 91$$ What is the median of the data shown?', type: 'gridin', answer: '79', formulas: ['d_minmax'] }),
    q('ov_e11', 'easy', 11, { prompt: '$$2, 9, 14, 23, 32$$ What is the mean of the data shown?', type: 'mcq', choices: { A: '$14$', B: '$16$', C: '$17$', D: '$32$' }, answer: 'B', formulas: ['d_mean'] }),
    q('ov_e12', 'easy', 12, { prompt: 'For a certain region, the table shows the average number of store employees in $2016$ by type of store. Based on the table, how much greater was the average number of store employees in warehouse stores than in supermarkets?',
      diagramHtml: tbl(['Type of store', 'Average number of employees'], [['Warehouse store', 365], ['Department store', 213], ['Supermarket', 130]]),
      type: 'mcq', choices: { A: '$83$', B: '$152$', C: '$235$', D: '$495$' }, answer: 'C', formulas: ['d_mean'] }),
    q('ov_e13', 'easy', 13, { prompt: 'A list of $10$ data values is shown. $$6, 8, 16, 4, 17, 26, 8, 5, 5, 5$$ What is the mean of these data?', type: 'gridin', answer: '10', formulas: ['d_mean'] }),
    q('ov_e14', 'easy', 14, { prompt: '$$6, 6, 8, 8, 8, 10, 21$$ Which of the following lists represents a data set that has the same median as the data set shown?', type: 'mcq', choices: { A: '$4, 6, 6, 6, 8, 8$', B: '$6, 6, 8, 8, 10, 10$', C: '$6, 8, 10, 10, 10, 12$', D: '$8, 8, 10, 10, 21, 21$' }, answer: 'B', formulas: ['d_minmax'] }),
    q('ov_e15', 'easy', 15, { prompt: 'The table shows the high and low temperatures in Houston, Texas, during a five-day period. What was the mean low temperature, in degrees Fahrenheit, during the five-day period?',
      diagramHtml: tbl(['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], [['High temperature', 73, 56, 62, 75, 81], ['Low temperature', 49, 37, 41, 54, 63]], 'Temperatures in Houston, Texas (degrees Fahrenheit)'),
      type: 'mcq', choices: { A: '$48.8$', B: '$49$', C: '$59$', D: '$59.1$' }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_e16', 'easy', 16, { prompt: 'Data set A: $1, 2, 3, 4, 5, 6, 7$<br>Data set B: $1, 1, 2, 2, 3, 3, 4$<br>Which of the following statements correctly compares the means of data set A and data set B?', type: 'mcq', choices: { A: 'The mean of each data set is $2$.', B: 'The mean of each data set is $4$.', C: 'The mean of data set A is less than the mean of data set B.', D: 'The mean of data set A is greater than the mean of data set B.' }, answer: 'D', formulas: ['d_mean'] }),
    q('ov_e17', 'easy', 17, { prompt: 'Each value in the data set shown represents the height, in centimeters, of a plant. $$6, 10, 13, 2, 15, 22, 10, 4, 4, 4$$ What is the mean height, in centimeters, of these plants?', type: 'gridin', answer: '9', formulas: ['d_mean'] }),
    q('ov_e18', 'easy', 18, { prompt: 'The table shows the amount of time it took Robert to complete each of the $5$ tasks in a project. What was the mean time, in minutes, for Robert to complete a task for this project?',
      diagramHtml: tbl(['Task', 'Time (minutes)'], [['I', 5], ['II', 2], ['III', 15], ['IV', 9], ['V', 9]]),
      type: 'gridin', answer: '8', formulas: ['d_mean'] }),
    q('ov_e19', 'easy', 19, { prompt: 'The number of acres of useful timberland in $13$ counties in California is summarized in the box plot shown. Which of the following is closest to the median number of acres?',
      diagramHtml: boxes({ rows: [{ min: 1000, q1: 4600, med: 7100, q3: 11200, max: 14000 }], lo: 1000, hi: 14000, tick: 1000, labelEvery: 1, xLabel: 'Acres of useful timberland', w: 380, fmt: v => v.toLocaleString('en-US'), rotateLabels: true }),
      type: 'mcq', choices: { A: '$4{,}399$', B: '$7{,}067$', C: '$8{,}831$', D: '$10{,}595$' }, answer: 'B', formulas: ['d_box'] }),
    q('ov_e20', 'easy', 20, { prompt: 'The table gives the results of a survey of $200$ people who were asked how often they see a movie in a theater. How many people responded either “never” or “almost never”?',
      diagramHtml: tbl(['Response', 'Frequency'], [['Once a week or more', 3], ['Two or three times a month', 16], ['About once a month', 26], ['A few times a year', 73], ['Almost never', 53], ['Never', 29], ['<b>Total</b>', '<b>200</b>']]),
      type: 'mcq', choices: { A: '$24$', B: '$53$', C: '$82$', D: '$118$' }, answer: 'C', formulas: ['d_mean'] }),
    q('ov_e21', 'easy', 21, { prompt: 'Data set X: $5, 9, 9, 13$<br>Data set Y: $5, 9, 9, 13, 27$<br>The lists give the values in data sets X and Y. Which statement correctly compares the mean of data set X and the mean of data set Y?', type: 'mcq', choices: { A: 'The mean of data set X is greater than the mean of data set Y.', B: 'The mean of data set X is less than the mean of data set Y.', C: 'The means of data set X and data set Y are equal.', D: 'There is not enough information to compare the means.' }, answer: 'B', formulas: ['d_mean'] }),
    q('ov_e22', 'easy', 22, { prompt: 'The bar graph shows the distribution of $419$ cans collected by $10$ different groups for a food drive. How many cans were collected by group $6$?',
      diagramHtml: bars({ cats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], vals: [30, 63, 38, 50, 47, 40, 54, 60, 17, 20], yMax: 70, yStep: 10, yLabel: 'Number of cans', xLabel: 'Group', w: 340, h: 210, gap: 0.3 }),
      type: 'gridin', answer: '40', formulas: ['d_mean'] }),
    q('ov_e23', 'easy', 23, { prompt: 'In April, there were $43$ volunteers in a cleanup project. Each volunteer was asked to choose a small gift labeled A, B, C, or D. The bar graph shows the number of volunteers who chose each gift. How many volunteers chose gift C?',
      diagramHtml: bars({ cats: ['A', 'B', 'C', 'D'], vals: [14, 8, 18, 3], yMax: 20, yStep: 2, yLabel: 'Number of volunteers', xLabel: 'Gift' }),
      type: 'mcq', choices: { A: '$3$', B: '$8$', C: '$14$', D: '$18$' }, answer: 'D', formulas: ['d_mean'] }),
    q('ov_e24', 'easy', 24, { prompt: 'The table shows the land area, in square kilometers, of the five smallest countries of the world in $2016$. Based on the table, what is the mean land area of the $5$ smallest countries in $2016$, to the nearest square kilometer?',
      diagramHtml: tbl(['Country', 'Land area (square kilometers)'], [['Monaco', '2.0'], ['Nauru', 21], ['San Marino', 61], ['Tuvalu', 26], ['Vatican City', '0.44']], 'Five Smallest Countries in 2016'),
      type: 'mcq', choices: { A: '$20$', B: '$22$', C: '$61$', D: '$110$' }, answer: 'B', formulas: ['d_mean'] }),
    q('ov_e25', 'easy', 25, { prompt: 'The box plot summarizes $15$ data values. What is the median of this data set?',
      diagramHtml: boxes({ rows: [{ min: 2, q1: 4, med: 5, q3: 7, max: 8 }], lo: 2, hi: 8, tick: 1, labelEvery: 1, w: 260 }),
      type: 'mcq', choices: { A: '$2$', B: '$3$', C: '$5$', D: '$8$' }, answer: 'C', formulas: ['d_box'] }),

    // ==================== MEDIUM (19) ====================
    q('ov_m1', 'medium', 1, { prompt: '$$4, 10, 18, 4, 4, 5, 6, 5$$ What is the median of the data set shown?', type: 'mcq', choices: { A: '$4$', B: '$5$', C: '$7$', D: '$14$' }, answer: 'B', formulas: ['d_minmax'] }),
    q('ov_m2', 'medium', 2, { prompt: 'The table shows the distribution of ages of the $20$ students enrolled in a college class. Which of the following gives the correct order of the mean, median, and mode of the ages?',
      diagramHtml: tbl(['Age', 'Frequency'], [[18, 6], [19, 5], [20, 4], [21, 2], [22, 1], [23, 1], [30, 1]], 'Ages of 20 Students Enrolled in a College Class'),
      type: 'mcq', choices: { A: 'mode &lt; median &lt; mean', B: 'mode &lt; mean &lt; median', C: 'median &lt; mode &lt; mean', D: 'mean &lt; mode &lt; median' }, answer: 'A', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_m3', 'medium', 3, { prompt: 'The frequency table summarizes the $57$ data values in a data set. What is the maximum data value in the data set?',
      diagramHtml: tbl(['Data value', 'Frequency'], [[6, 3], [7, 3], [8, 8], [9, 8], [10, 9], [11, 11], [12, 9], [13, 0], [14, 6]]),
      type: 'gridin', answer: '14', formulas: ['d_minmax'] }),
    q('ov_m4', 'medium', 4, { prompt: 'The results of two independent surveys are shown in the table. Which statement is true based on the table?',
      diagramHtml: tbl(['Group', 'Sample size', 'Mean (centimeters)', 'Standard deviation (centimeters)'], [['A', '2,500', 186, 12.5], ['B', '2,500', 186, 19.1]], "Men's Height"),
      type: 'mcq', choices: { A: 'The Group A data set was identical to the Group B data set.', B: 'Group B contained the tallest participant.', C: 'The heights of the men in Group B had a larger spread than the heights of the men in Group A.', D: 'The median height of Group B is larger than the median height of Group A.' }, answer: 'C', formulas: ['d_stats'] }),
    q('ov_m5', 'medium', 5, { prompt: '$$15, 14, 18, 17, x$$ The mean and the median of the five numbers above are equal. Which of the following is NOT a possible value of $x$?', type: 'mcq', choices: { A: '$6$', B: '$11$', C: '$16$', D: '$21$' }, answer: 'A', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_m6', 'medium', 6, { prompt: 'The table shows the number of international tourist arrivals, rounded to the nearest tenth of a million, to the top nine tourist destinations in both $2012$ and $2013$. Based on the information given in the table, how much greater, in millions, was the median number of international tourist arrivals to the top nine tourist destinations in $2013$ than the median number in $2012$, to the nearest tenth of a million?',
      diagramHtml: tbl(['Country', '2012', '2013'], [['France', '83.0', 84.7], ['United States', 66.7, 69.8], ['Spain', 57.5, 60.7], ['China', 57.7, 55.7], ['Italy', 46.4, 47.7], ['Turkey', 35.7, 37.8], ['Germany', 30.4, 31.5], ['United Kingdom', 26.3, 32.2], ['Russia', 24.7, 28.4]], 'International Tourist Arrivals, in millions'),
      type: 'gridin', answer: '1.3', formulas: ['d_minmax'] }),
    q('ov_m7', 'medium', 7, { prompt: 'Data set A has $15$ values and is represented by the dot plot shown. Data set B is created by adding $46$ to each of the values in data set A. Which of the following correctly compares the medians and the ranges of data sets A and B?',
      diagramHtml: dots({ min: 22, max: 26, counts: [5, 4, 3, 2, 1], title: 'Data Set A' }),
      type: 'mcq', choices: { A: 'The median of data set B is greater than the median of data set A, and the range of data set B is equal to the range of data set A.', B: 'The median of data set B is greater than the median of data set A, and the range of data set B is greater than the range of data set A.', C: 'The median of data set B is equal to the median of data set A, and the range of data set B is greater than the range of data set A.', D: 'The median of data set B is equal to the median of data set A, and the range of data set B is equal to the range of data set A.' }, answer: 'A', formulas: ['d_shift'] }),
    q('ov_m8', 'medium', 8, { prompt: 'The list gives the mass, in grams, of $5$ alpine marmots. $$4{,}010;\\ 4{,}010;\\ 3{,}030;\\ 4{,}050;\\ 3{,}050$$ What is the mean mass, in grams, of these $5$ alpine marmots?', type: 'gridin', answer: '3630', formulas: ['d_mean'] }),
    q('ov_m9', 'medium', 9, { prompt: 'In the table, Melissa recorded the price of one gallon of regular gas from five different local gas stations on the same day. What is the median of the gas prices Melissa recorded?',
      diagramHtml: tbl(['Station 1', 'Station 2', 'Station 3', 'Station 4', 'Station 5'], [['3.699', '3.609', '3.729', '3.679', '3.729'].map(c => `$\\$${c}$`)]),
      type: 'mcq', choices: { A: '$\\$3.679$', B: '$\\$3.689$', C: '$\\$3.699$', D: '$\\$3.729$' }, answer: 'C', formulas: ['d_minmax'] }),
    q('ov_m10', 'medium', 10, { prompt: 'For which of the following data sets is the mean greater than the median?', type: 'mcq', choices: { A: '$5, 5, 5, 5, 5, 5, 5, 5, 5$', B: '$0, 10, 20, 30, 40, 50, 60, 70, 80$', C: '$2, 4, 8, 16, 32, 64, 128, 256, 512$', D: '$7, 107, 107, 207, 207, 207, 307, 307, 307$' }, answer: 'C', formulas: ['d_stats', 'd_box'] }),
    q('ov_m11', 'medium', 11, { prompt: 'The table shows the frequency of values in a data set. What is the minimum value of the data set?',
      diagramHtml: tbl(['Value', 'Frequency'], [[19, 7], [21, 1], [23, 7], [25, 4]]),
      type: 'gridin', answer: '19', formulas: ['d_minmax'] }),
    q('ov_m12', 'medium', 12, { prompt: 'Each of the dot plots shown represents the number of glue sticks brought in by each student for two classes, class A and class B. Which statement best compares the standard deviations of the numbers of glue sticks brought in by each student for these two classes?',
      diagramHtml: pair(dots({ min: 1, max: 7, counts: [1, 1, 3, 4, 5, 6, 7], title: 'Class A', unit: 24 }), dots({ min: 14, max: 20, counts: [1, 1, 3, 4, 5, 6, 7], title: 'Class B', unit: 24 })),
      type: 'mcq', choices: { A: 'The standard deviation of the number of glue sticks brought in by each student for class A is less than the standard deviation for class B.', B: 'The standard deviation of the number of glue sticks brought in by each student for class A is equal to the standard deviation for class B.', C: 'The standard deviation of the number of glue sticks brought in by each student for class A is greater than the standard deviation for class B.', D: 'There is not enough information to compare these standard deviations.' }, answer: 'B', formulas: ['d_stats', 'd_shift'] }),
    q('ov_m13', 'medium', 13, { prompt: '$$23, 27, 27, 32, 35, 36, 52$$ What is the range of the $7$ scores shown?', type: 'gridin', answer: '29', formulas: ['d_box'] }),
    q('ov_m14', 'medium', 14, { prompt: 'The weights, in pounds, for $15$ horses in a stable were reported, and the mean, median, range, and standard deviation for the data were found. The horse with the lowest reported weight was found to actually weigh $10$ pounds less than its reported weight. What value remains unchanged if the four values are reported using the corrected weight?', type: 'mcq', choices: { A: 'Mean', B: 'Median', C: 'Range', D: 'Standard deviation' }, answer: 'B', formulas: ['d_stats'] }),
    q('ov_m15', 'medium', 15, { prompt: 'Data set A: $5, 5, 5, 5, 5, 5, 5, 5, 5$<br>Data set B: $5, 5, 5, 5, 5, 5, 5, 5, 5, 100$<br>Which of the following statements about the means and medians of data set A and data set B is true?', type: 'mcq', choices: { A: 'Only the means are different.', B: 'Only the medians are different.', C: 'Both the means and the medians are different.', D: 'Neither the means nor the medians are different.' }, answer: 'A', formulas: ['d_stats'] }),
    q('ov_m16', 'medium', 16, { prompt: 'If $a$ is the mean and $b$ is the median of nine consecutive integers, what is the value of $|a-b|$?', type: 'gridin', answer: '0', formulas: ['d_mean'] }),
    q('ov_m17', 'medium', 17, { prompt: 'A fish hatchery has three tanks for holding fish before they are introduced into the wild. Ten fish weighing less than $5$ ounces are placed in tank A. Eleven fish weighing at least $5$ ounces but no more than $13$ ounces are placed in tank B. Twelve fish weighing more than $13$ ounces are placed in tank C. Which of the following could be the median of the weights, in ounces, of these $33$ fish?', type: 'mcq', choices: { A: '$4.5$', B: '$8$', C: '$13.5$', D: '$15$' }, answer: 'B', formulas: ['d_minmax'] }),
    q('ov_m18', 'medium', 18, { prompt: '$$2, 10, 3, 7, 6$$ The mean of the list of numbers above is what fraction of the sum of the five numbers?', type: 'gridin', answer: '1/5', formulas: ['d_mean'] }),
    q('ov_m19', 'medium', 19, { prompt: 'The histograms summarize the distributions of number of units sold, in thousands, for company A and company B. Which statement best compares the standard deviations of number of units sold for these companies?',
      diagramHtml: pair(
        bars({ edges: [15, 20, 25, 30, 35, 40, 45, 50], vals: [0, 0, 42, 49, 42, 0, 0], yMax: 50, yStep: 10, yLabel: 'Frequency', xLabel: 'Units sold (thousands)', title: 'Company A', w: 250, h: 190 }),
        bars({ edges: [15, 20, 25, 30, 35, 40, 45, 50], vals: [31, 22, 12, 3, 12, 22, 31], yMax: 50, yStep: 10, yLabel: 'Frequency', xLabel: 'Units sold (thousands)', title: 'Company B', w: 250, h: 190 })),
      type: 'mcq', choices: { A: 'The standard deviation of number of units sold for company A is less than the standard deviation of number of units sold for company B.', B: 'The standard deviation of number of units sold for company A is greater than the standard deviation of number of units sold for company B.', C: 'The standard deviation of number of units sold for company A is equal to the standard deviation of number of units sold for company B.', D: 'There is not enough information to compare the standard deviations.' }, answer: 'A', formulas: ['d_stats'] }),

    // ==================== HARD (23) ====================
    q('ov_h1', 'hard', 1, { prompt: 'The box plots summarize the masses, in kilograms, of two groups of gazelles. Based on the box plots, which of the following statements must be true?',
      diagramHtml: boxes({ rows: [{ label: 'Group 1', min: 21, q1: 22, med: 25, q3: 26, max: 28 }, { label: 'Group 2', min: 22, q1: 23, med: 24, q3: 25, max: 28 }], lo: 20, hi: 32, tick: 1, labelEvery: 2, xLabel: 'Mass (kilograms)', w: 380 }),
      type: 'mcq', choices: { A: 'The mean mass of group 1 is greater than the mean mass of group 2.', B: 'The mean mass of group 1 is less than the mean mass of group 2.', C: 'The median mass of group 1 is greater than the median mass of group 2.', D: 'The median mass of group 1 is less than the median mass of group 2.' }, answer: 'C', formulas: ['d_box'] }),
    q('ov_h2', 'hard', 2, { prompt: 'The histogram summarizes data set A, which represents the number of points per player earned by $50$ players of a game. A new player earns $18$ points playing the game, and this number of points is added to data set A to create data set B with $51$ values. Which of the following must be true?<br>I. The median number of points per player for data set B is less than the median number of points per player for data set A.<br>II. The mean number of points per player for data set B is less than the mean number of points per player for data set A.',
      diagramHtml: bars({ edges: [0, 10, 20, 30, 40, 50, 60, 70], vals: [0, 1, 0, 4, 7, 26, 12], yMax: 30, yStep: 5, yLabel: 'Frequency', xLabel: 'Number of points', w: 300 }),
      type: 'mcq', choices: { A: 'I only', B: 'II only', C: 'I and II', D: 'Neither I nor II' }, answer: 'B', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h3', 'hard', 3, { prompt: 'Data set A consists of $10$ positive integers less than $60$. The list shown gives $9$ of the integers from data set A. $$43, 45, 44, 43, 38, 39, 40, 46, 40$$ The mean of these $9$ integers is $42$. If the mean of data set A is an integer that is greater than $42$, what is the value of the largest integer from data set A?', type: 'gridin', answer: '52', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h4', 'hard', 4, { prompt: 'Data set A and data set B each consist of $27$ values. The table shows the frequencies of the values for each data set. Which of the following statements best compares the means of the two data sets?',
      diagramHtml: tbl(['Value', 'Data set A frequency', 'Data set B frequency'], [[30, 2, 9], [34, 4, 7], [38, 5, 5], [42, 7, 4], [46, 9, 2]]),
      type: 'mcq', choices: { A: 'The mean of data set A is greater than the mean of data set B.', B: 'The mean of data set A is less than the mean of data set B.', C: 'The mean of data set A is equal to the mean of data set B.', D: 'There is not enough information to compare the means of the data sets.' }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_h5', 'hard', 5, { prompt: 'A data set of $27$ different numbers has a mean of $33$ and a median of $33$. A new data set is created by adding $7$ to each number in the original data set that is greater than the median and subtracting $7$ from each number in the original data set that is less than the median. Which of the following measures does NOT have the same value in both the original and new data sets?', type: 'mcq', choices: { A: 'Median', B: 'Mean', C: 'Sum of the numbers', D: 'Standard deviation' }, answer: 'D', formulas: ['d_stats', 'd_mean'] }),
    q('ov_h6', 'hard', 6, { prompt: 'The two box plots show the distribution of number of books read over the summer by the students in two different English classes. What is the positive difference between the ranges of number of books read over the summer for the two classes?',
      diagramHtml: boxes({ rows: [{ label: 'Class A', min: 0, q1: 1, med: 2, q3: 4, max: 5 }, { label: 'Class B', min: 1, q1: 4, med: 7, q3: 9, max: 10 }], lo: 0, hi: 12, tick: 1, labelEvery: 2, xLabel: 'Number of books', w: 380 }),
      type: 'gridin', answer: '4', formulas: ['d_box'] }),
    q('ov_h7', 'hard', 7, { prompt: 'The dot plots represent the distributions of values in data sets A and B. Which of the following statements must be true?<br>I. The median of data set A is equal to the median of data set B.<br>II. The standard deviation of data set A is equal to the standard deviation of data set B.',
      diagramHtml: pair(dots({ min: 10, max: 16, counts: [1, 4, 2, 3, 2, 4, 1], title: 'Data Set A', xLabel: 'Value', unit: 26 }), dots({ min: 10, max: 16, counts: [2, 4, 2, 1, 2, 4, 2], title: 'Data Set B', xLabel: 'Value', unit: 26 })),
      type: 'mcq', choices: { A: 'I only', B: 'II only', C: 'I and II', D: 'Neither I nor II' }, answer: 'A', formulas: ['d_stats', 'd_minmax'] }),
    q('ov_h8', 'hard', 8, { prompt: 'The frequency table summarizes a data set of the weights, rounded to the nearest pound, of $71$ tortoises. A weight of $39$ pounds is added to the original data set, creating a new data set of the weights, rounded to the nearest pound, of $72$ tortoises. Which statement best compares the mean and median of the new data set to the mean and median of the original data set?',
      diagramHtml: tbl(['Weight (pounds)', 'Frequency'], [[13, 12], [14, 8], [15, 5], [16, 7], [17, 9], [18, 10], [19, 13], [20, 7]]),
      type: 'mcq', choices: { A: 'The mean of the new data set is greater than the mean of the original data set, and the median of the new data set is greater than the median of the original data set.', B: 'The mean of the new data set is greater than the mean of the original data set, and the medians of the two data sets are equal.', C: 'The mean of the new data set is less than the mean of the original data set, and the median of the new data set is less than the median of the original data set.', D: 'The mean of the new data set is less than the mean of the original data set, and the medians of the two data sets are equal.' }, answer: 'B', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h9', 'hard', 9, { prompt: 'The table shown summarizes the number of employees at each of the $17$ restaurants in a town. Which of the following could be the median number of employees for the restaurants in this town?',
      diagramHtml: tbl(['Number of employees', 'Number of restaurants'], [['2 to 7', 2], ['8 to 13', 4], ['14 to 19', 2], ['20 to 25', 7], ['26 to 31', 2]]),
      type: 'mcq', choices: { A: '$2$', B: '$9$', C: '$15$', D: '$21$' }, answer: 'D', formulas: ['d_minmax'] }),
    q('ov_h10', 'hard', 10, { prompt: 'Two data sets of $23$ integers each are summarized in the histograms shown. For each of the histograms, the first interval represents the frequency of integers greater than or equal to $10$, but less than $20$. The second interval represents the frequency of integers greater than or equal to $20$, but less than $30$, and so on. What is the smallest possible difference between the mean of data set A and the mean of data set B?',
      diagramHtml: pair(
        bars({ edges: [10, 20, 30, 40, 50, 60], vals: [0, 3, 4, 7, 9], yMax: 12, yStep: 2, yLabel: 'Frequency', xLabel: 'Integer', title: 'Data Set A', w: 220, h: 190 }),
        bars({ edges: [10, 20, 30, 40, 50, 60], vals: [3, 4, 7, 9, 0], yMax: 12, yStep: 2, yLabel: 'Frequency', xLabel: 'Integer', title: 'Data Set B', w: 220, h: 190 })),
      type: 'mcq', choices: { A: '$0$', B: '$1$', C: '$10$', D: '$23$' }, answer: 'B', formulas: ['d_minmax', 'd_mean'] }),
    q('ov_h11', 'hard', 11, { prompt: 'The frequency distribution summarizes a set of data, where $a$ is a positive integer. How much greater is the mean of the set of data than the median?',
      diagramHtml: tbl(['Value', 'Frequency'], [[1, '<i>a</i>'], [2, '2<i>a</i>'], [3, '3<i>a</i>'], [4, '2<i>a</i>'], [5, '<i>a</i>']]),
      type: 'mcq', choices: { A: '$0$', B: '$1$', C: '$2$', D: '$3$' }, answer: 'A', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h12', 'hard', 12, { prompt: 'The mean score of $8$ players in a basketball game was $14.5$ points. If the highest individual score is removed, the mean score of the remaining $7$ players becomes $12$ points. What was the highest score?', type: 'mcq', choices: { A: '$20$', B: '$24$', C: '$32$', D: '$36$' }, answer: 'C', formulas: ['d_mean'] }),
    q('ov_h13', 'hard', 13, { prompt: 'The dot plot represents a data set of the number of bursts for $13$ eruptions of a steam vent. If an additional eruption with $11$ bursts is added to this data set to create a new data set of $14$ eruptions, which of the following measures will be greater for the new data set than for the original data set?<br>I. The median number of bursts<br>II. The mean number of bursts',
      diagramHtml: dots({ min: 1, max: 5, counts: [4, 5, 2, 1, 1], xLabel: 'Number of bursts' }),
      type: 'mcq', choices: { A: 'I and II', B: 'I only', C: 'II only', D: 'Neither I nor II' }, answer: 'C', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h14', 'hard', 14, { prompt: 'Each of the following frequency tables represents a data set. Which data set has the greatest mean?', type: 'mcq',
      choices: {
        A: ctbl(['Value', 'Frequency'], [[70, 4], [80, 5], [90, 6], [100, 7]]),
        B: ctbl(['Value', 'Frequency'], [[70, 6], [80, 6], [90, 6], [100, 6]]),
        C: ctbl(['Value', 'Frequency'], [[70, 7], [80, 6], [90, 6], [100, 7]]),
        D: ctbl(['Value', 'Frequency'], [[70, 8], [80, 5], [90, 5], [100, 8]])
      }, answer: 'A', formulas: ['d_mean'] }),
    q('ov_h15', 'hard', 15, { prompt: 'The mean amount of time that the $20$ employees of a construction company have worked for the company is $6.7$ years. After one of the employees leaves the company, the mean amount of time that the remaining employees have worked for the company is reduced to $6.25$ years. How many years did the employee who left the company work for the company?', type: 'mcq', choices: { A: '$0.45$', B: '$2.30$', C: '$9.00$', D: '$15.25$' }, answer: 'D', formulas: ['d_mean'] }),
    q('ov_h16', 'hard', 16, { prompt: 'The dot plot represents the $15$ values in data set A. Data set B is created by adding $56$ to each of the values in data set A. Which of the following correctly compares the medians and the ranges of data sets A and B?',
      diagramHtml: dots({ min: 22, max: 26, counts: [5, 4, 3, 2, 1], title: 'Data Set A' }),
      type: 'mcq', choices: { A: 'The median of data set B is equal to the median of data set A, and the range of data set B is equal to the range of data set A.', B: 'The median of data set B is equal to the median of data set A, and the range of data set B is greater than the range of data set A.', C: 'The median of data set B is greater than the median of data set A, and the range of data set B is equal to the range of data set A.', D: 'The median of data set B is greater than the median of data set A, and the range of data set B is greater than the range of data set A.' }, answer: 'C', formulas: ['d_shift'] }),
    q('ov_h17', 'hard', 17, { prompt: 'Data set A consists of the heights of $75$ objects and has a mean of $25$ meters. Data set B consists of the heights of $50$ objects and has a mean of $65$ meters. Data set C consists of the heights of the $125$ objects from data sets A and B. What is the mean, in meters, of data set C?', type: 'gridin', answer: '41', formulas: ['d_tug'] }),
    q('ov_h18', 'hard', 18, { prompt: 'Data set F consists of $55$ integers between $170$ and $290$. Data set G consists of all the integers in data set F as well as the integer $10$. Which of the following must be less for data set F than for data set G?<br>I. The mean<br>II. The median', type: 'mcq', choices: { A: 'I only', B: 'II only', C: 'I and II', D: 'Neither I nor II' }, answer: 'D', formulas: ['d_mean', 'd_minmax'] }),
    q('ov_h19', 'hard', 19, { prompt: 'Data set A consists of the heights of $75$ buildings and has a mean of $32$ meters. Data set B consists of the heights of $50$ buildings and has a mean of $62$ meters. Data set C consists of the heights of the $125$ buildings from data sets A and B. What is the mean, in meters, of data set C?', type: 'gridin', answer: '44', formulas: ['d_tug'] }),
    q('ov_h20', 'hard', 20, { prompt: 'A survey was given to residents of all $50$ states asking if they had earned a bachelor’s degree or higher. The results from $7$ of the states are given in the table. The median percent of residents who earned a bachelor’s degree or higher for all $50$ states was 26.95%. What is the difference between the median percent of residents who earned a bachelor’s degree or higher for these $7$ states and the median for all $50$ states?',
      diagramHtml: tbl(['State', 'Percent of residents'], [['State A', '21.9%'], ['State B', '27.9%'], ['State C', '25.9%'], ['State D', '19.5%'], ['State E', '30.1%'], ['State F', '36.4%'], ['State G', '35.5%']], 'Percent of Residents Who Earned a Bachelor’s Degree or Higher'),
      type: 'mcq', choices: { A: '0.05%', B: '0.95%', C: '1.22%', D: '7.45%' }, answer: 'B', formulas: ['d_minmax'] }),
    q('ov_h21', 'hard', 21, { prompt: 'Andrew and Maria each collected six rocks, and the masses of the rocks are shown in the table. The mean of the masses of the rocks Maria collected is $0.1$ kilogram greater than the mean of the masses of the rocks Andrew collected. What is the value of $x$?',
      diagramHtml: tbl(['', 'Rock 1', 'Rock 2', 'Rock 3', 'Rock 4', 'Rock 5', 'Rock 6'], [['<b>Andrew</b>', 2.4, 2.5, 3.6, 3.1, 2.5, 2.7], ['<b>Maria</b>', '<i>x</i>', 3.1, 2.7, 2.9, 3.3, 2.8]], 'Masses (kilograms)'),
      type: 'gridin', answer: '2.6', formulas: ['d_mean'] }),
    q('ov_h22', 'hard', 22, { prompt: 'A scientist measured the lengths of $240$ gray seals from Muskeget Island and $120$ gray seals from Sable Island. The scientist determined that the mean length of the $240$ gray seals from Muskeget Island was $88$ inches and the mean length of the $120$ gray seals from Sable Island was $94$ inches. What was the mean length of all $360$ gray seals the scientist measured for this study?', type: 'mcq', choices: { A: '$89$', B: '$90$', C: '$91$', D: '$92$' }, answer: 'B', formulas: ['d_tug'] }),
    q('ov_h23', 'hard', 23, { prompt: 'For a certain computer game, individuals receive an integer score that ranges from $2$ through $10$. The table shows the frequency distribution of the scores of the $9$ players in group A and the $11$ players in group B. The median of the scores for group B is how much greater than the median of the scores for group A?',
      diagramHtml: tbl(['Score', 'Group A frequency', 'Group B frequency'], [[2, 1, 0], [3, 1, 0], [4, 2, 0], [5, 1, 4], [6, 3, 2], [7, 0, 0], [8, 0, 2], [9, 1, 1], [10, 0, 2], ['<b>Total</b>', '<b>9</b>', '<b>11</b>']]),
      type: 'gridin', answer: '1', formulas: ['d_minmax'] })
  );
})();
