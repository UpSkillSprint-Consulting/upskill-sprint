'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'test-bank.html'), 'utf8');
const raw = html
  .match(/var SET3_BANK=(\[[\s\S]*?\n\s*\]);/)[1]
  .replace(/,\s*\]$/, ']');
const bank = JSON.parse(JSON.stringify(vm.runInNewContext('(' + raw + ')')));
const q = number => bank[number - 1];

const domainRoman = {
  p1: 'I', p2: 'II', tm: 'III', def: 'IV', mea: 'V',
  ana: 'VI', imp: 'VII', con: 'VIII', dfss: 'IX',
};

function normalizedChoice(value) {
  return value.normalize('NFKC').replace(/\s+/g, ' ').replace(/[.?!]+$/, '').trim();
}

function questionText(question) {
  return [question.stem, ...question.options, question.why, JSON.stringify(question.chart || {})].join(' ');
}

async function loadPage() {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  return dom;
}

function poissonCdf(lambda, maximum) {
  let term = Math.exp(-lambda);
  let total = term;
  for (let x = 1; x <= maximum; x += 1) {
    term *= lambda / x;
    total += term;
  }
  return total;
}

function explicitBandOutsideCount(chart) {
  function interpolate(band, z) {
    if (z <= band[0][1]) return band[0][0];
    if (z >= band[band.length - 1][1]) return band[band.length - 1][0];
    for (let index = 1; index < band.length; index += 1) {
      if (z <= band[index][1]) {
        const left = band[index - 1];
        const right = band[index];
        const fraction = (z - left[1]) / (right[1] - left[1]);
        return left[0] + fraction * (right[0] - left[0]);
      }
    }
    throw new Error('normal-probability band is not ordered');
  }
  return chart.points.filter(([x, z]) => x < interpolate(chart.lowerBand, z) || x > interpolate(chart.upperBand, z)).length;
}

test('all 694 Set 3 questions are structurally complete, standalone, unique, and clean', () => {
  assert.equal(bank.length, 694);
  assert.equal(new Set(bank.map(question => question.stem)).size, 694, 'every question has a unique mastery-tracking stem');

  const forbiddenOcr = /\uFFFD|KPls|KBls|indictor|indicter|\bJ IT\b|\bF M EA\b|\bS M ED\b|H ig h|Placket(?!t)|Burnam|cooperations|preferrable|bottle necks|Event 8|Pr\(AI B\)|6- sigma|\b1s:|------|Ppk·|\[O,|POCA|54,0 12|0\.13 1|°\/c|bulletized|source (?:guide|erratum|key)|practice question’s|X̄\/S|\b(?:20|25)-30\b/i;
  const falseDependency = /\b(?:use|using) the same\b|same information|answer this question and the next|this question and the next|the next (?:two|three)\b/i;

  bank.forEach((question, index) => {
    const number = index + 1;
    assert.equal(question.set, 3, `Q${number} set`);
    assert.ok(question.stem.trim(), `Q${number} stem`);
    assert.equal(question.options.length, 4, `Q${number} has four choices`);
    assert.equal(new Set(question.options.map(normalizedChoice)).size, 4, `Q${number} has four textually unique choices`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `Q${number} answer index`);
    assert.ok(question.options[question.answer].trim(), `Q${number} keyed choice`);
    assert.doesNotMatch(question.stem, falseDependency, `Q${number} is independently worded`);
    assert.doesNotMatch(questionText(question), forbiddenOcr, `Q${number} has no known OCR damage`);
    const citation = question.why.match(/\[([IVX]+)(?:\.[A-Z0-9]+)*\]\s*$/);
    assert.ok(citation, `Q${number} has one terminal BoK citation`);
    assert.equal(citation[1], domainRoman[question.sub], `Q${number} citation agrees with domain ${question.sub}`);
    assert.equal((question.why.match(/\[[IVX]+(?:\.[A-Z0-9]+)*\]/g) || []).length, 1, `Q${number} has exactly one BoK citation`);
    if (question.chart) {
      assert.equal(Object.hasOwn(question.chart, 'highlight'), false, `Q${number} has no answer-revealing highlight`);
      assert.equal(Object.hasOwn(question.chart, 'highlightSet'), false, `Q${number} has no answer-revealing highlight set`);
    }
  });
});

test('high-risk source errata, screenshot defects, keys, and ambiguity repairs are pinned', () => {
  const expectedKeys = {
    89: '610',
    162: 'DMEDI develops a new design, so no existing-process baseline is available.',
    353: '13',
    405: 'captures both within and between subgroup variation.',
    447: 'Waiting',
    450: 'AB and AC',
    476: 'SMED',
    514: '0.155',
    515: '[0, 0.419]',
    619: 'p',
    620: 'Area 3',
    621: 'Area 9',
    629: '419',
    640: 'is reported after the outcome has occurred and can no longer be changed.',
    652: 'Availability, performance, and quality',
    657: '926.1',
    661: 'χ² = 8.308; χ² critical value = 5.991',
    674: '2',
    681: '1068',
  };
  for (const [number, answer] of Object.entries(expectedKeys)) {
    assert.equal(q(Number(number)).options[q(Number(number)).answer], answer, `Q${number} corrected key`);
  }

  assert.match(q(447).stem, /order for 50 parts.*55 parts.*long production lead time/i);
  assert.match(q(476).why, /internal setup.*external setup/i);
  assert.match(q(619).stem, /varying number.*fraction defective/i);
  assert.match(q(629).stem, /n = N\/\(1 \+ NE²\)/);
  assert.match(q(640).why, /after the fact.*Leading indicators/i);
  assert.match(q(652).why, /OEE = A × P × Q/);
  assert.match(q(674).why, /96 ÷ \(8 × 6\) = 2/);

  assert.deepEqual(q(47).options, ['Listening posts', 'Customer specifications', 'Customer expectations', 'Closed-loop corrective actions']);
  assert.match(q(123).stem, /without resetting or rerandomizing/i);
  assert.match(q(123).why, /Replication would require independently resetting or rerandomizing/i);
  assert.equal(q(289).options[q(289).answer], 'Measurement-system variability is too large relative to the tolerance.');
  assert.equal(q(405).options[1], 'uses only within-subgroup variation.');
  assert.equal(q(460).options[1], 'Eliminates the need for replication.');
  assert.match(q(483).stem, /each be raised by exactly one percentage point/i);
  assert.equal(q(523).options[1], 'To replace preventive maintenance with run-to-failure maintenance.');
  assert.equal(q(529).options[2], 'define the business case and financial benefits for the original project.');
  assert.match(q(555).stem, /consultative C1 decision style/i);
  assert.match(q(577).why, /SMED \(single-minute exchange of dies\) is also known as quick changeover/);
  assert.match(q(593).stem, /12 per 1,000 units/i);
  assert.match(q(615).stem, /establishing shared norms, roles, and working relationships/i);
  assert.match(q(666).stem, /directly searches for active network intrusions/i);
  assert.match(q(681).stem, /ignore the finite-population correction/i);
});

test('all exact lookup values needed by randomized calculation questions travel with the question', () => {
  const required = {
    107: ['2.350'], 108: ['1.691'], 110: ['2.2693', '0.4407'],
    300: ['0.8862'], 309: ['0.4030'], 353: ['0.9496', '0.9739'],
    354: ['0.9599'], 375: ['0.9869'], 376: ['0.9869'], 377: ['2.326'], 378: ['2.326'],
    386: ['1.645'], 403: ['0.9332'], 410: ['1.717'],
    418: ['3.68', '3.06', '2.64'], 419: ['5.991'],
    490: ['0.483'], 491: ['0.076'], 492: ['0.448', '1.552'], 493: ['0.763'],
    547: ['2.706'], 553: ['3.117'], 626: ['1.645'], 657: ['0.680'],
    661: ['5.991'], 667: ['2.132'], 681: ['1.96', '0.50'],
  };
  for (const [number, values] of Object.entries(required)) {
    const question = q(Number(number));
    const available = `${question.stem} ${JSON.stringify(question.chart || {})}`;
    values.forEach(value => assert.match(available, new RegExp(value.replace('.', '\\.')), `Q${number} supplies ${value}`));
  }
});

test('corrected numerical answers recompute from the information shown', () => {
  assert.equal(Math.ceil(2400 / (1 + 2400 * 0.035 ** 2)), 610);
  assert.equal((6.75 - 2.350 * 0.40).toFixed(3), '5.810');
  assert.equal((6.75 + 2.350 * 0.40).toFixed(3), '7.690');
  assert.equal(((48 ** 2 / 38 ** 2) / 2.2693).toFixed(3), '0.703');
  assert.equal(((48 ** 2 / 38 ** 2) / 0.4407).toFixed(3), '3.621');

  const sample = [13.3, 14.5, -4.0, 23.9, 24.2];
  const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
  const sampleSd = Math.sqrt(sample.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (sample.length - 1));
  assert.equal(sampleSd.toFixed(2), '11.47');

  assert.ok(poissonCdf(7.7, 12) < 0.95);
  assert.ok(poissonCdf(7.7, 13) >= 0.95);
  assert.equal((240 / 1550).toFixed(3), '0.155');
  const uBar = 240 / 1550;
  assert.equal((uBar + 3 * Math.sqrt(uBar / 20)).toFixed(3), '0.419');
  assert.equal(Math.ceil(1264 / (1 + 1264 * 0.04 ** 2)), 419);
  assert.equal((904 + 0.680 * 32.5).toFixed(1), '926.1');
  const chiSquare = (340 - 325) ** 2 / 325 + (600 - 650) ** 2 / 650 + (360 - 325) ** 2 / 325;
  assert.equal(chiSquare.toFixed(3), '8.308');
  assert.equal(Math.ceil(1.96 ** 2 * 0.5 * 0.5 / 0.03 ** 2), 1068);
});

test('source-dependent tables and shared visuals contain exact, aligned data', () => {
  assert.deepEqual(q(272).chart, q(273).chart);
  assert.deepEqual(q(272).chart.cells, [
    ['blank', 'large', 'large', 'small'],
    ['large', 'blank', 'blank', 'large'],
    ['blank', 'large', 'large', 'blank'],
    ['large', 'small', 'small', 'large'],
  ]);
  assert.deepEqual(q(408).chart.columns, ['Observation', 'X (Time)', 'Y (Strength)', 'XY', 'X²', 'Y²']);
  assert.deepEqual(q(408).chart.rows.at(-1), ['SUM (n = 8)', '20.0', '344.0', '899.5', '59.00', '15,016.00']);
  assert.deepEqual(q(408).chart, q(409).chart);
  assert.deepEqual(q(480).chart, q(481).chart);
  assert.deepEqual(q(481).chart, q(482).chart);
  assert.deepEqual(q(482).chart, q(483).chart);
  assert.deepEqual(q(540).chart, q(541).chart);
  assert.deepEqual(q(561).chart, q(562).chart);
  assert.equal(q(336).chart.median, 20);
  assert.deepEqual([q(336).chart.min, q(336).chart.max], [6, 32]);
  assert.deepEqual([q(336).chart.axisMin, q(336).chart.axisMax, q(336).chart.tickStep], [0, 35, 5]);
  assert.deepEqual([q(337).chart.axisMin, q(337).chart.axisMax, q(337).chart.tickStep], [80, 180, 10]);
});

test('all unanswered Set 3 visuals render without answer leakage, invalid coordinates, or missing values', async t => {
  const dom = await loadPage();
  t.after(() => dom.window.close());
  const render = dom.window.__TB.renderQuestionChart;
  const chartQuestions = bank.filter(question => question.chart);
  assert.equal(chartQuestions.length, 76);
  chartQuestions.forEach((question, index) => {
    const output = render(question.chart);
    assert.match(output, /<(?:svg|table)\b/, `chart ${index + 1} renders`);
    assert.doesNotMatch(output, /NaN|undefined|null/, `chart ${index + 1} has valid values`);
    assert.doesNotMatch(output, /tb-q-chart-quad-hi/, `chart ${index + 1} does not reveal an answer`);
  });

  const hoq = new dom.window.DOMParser().parseFromString(render(q(620).chart), 'text/html');
  const hoqAreas = Array.from(hoq.querySelectorAll('[data-hoq-area]'));
  assert.deepEqual(hoqAreas.map(area => area.getAttribute('data-hoq-area')).sort((a, b) => Number(a) - Number(b)), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  assert.equal(hoq.querySelectorAll('[data-hoq-area="9"] polygon').length, 1, 'Area 9 is the roof');
  assert.deepEqual(hoqAreas.map(area => area.textContent.trim()).sort((a, b) => Number(a) - Number(b)), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  assert.doesNotMatch(hoq.body.textContent, /customer requirements|target values|relationships/i);

  const matrix = new dom.window.DOMParser().parseFromString(render(q(272).chart), 'text/html');
  assert.equal(matrix.querySelectorAll('[data-matrix-state="large"]').length, 9, 'eight data marks plus legend');
  assert.equal(matrix.querySelectorAll('[data-matrix-state="small"]').length, 4, 'three data marks plus legend');
  assert.equal(matrix.querySelectorAll('[data-matrix-state="blank"]').length, 5);

  const fta = new dom.window.DOMParser().parseFromString(render(q(443).chart), 'text/html');
  const edges = Array.from(fta.querySelectorAll('[data-fta-edge]'), edge => edge.getAttribute('data-fta-edge')).sort();
  assert.deepEqual(edges, ['1-2', '2-3', '2-4', '3-5', '4-6', '5-7', '5-8', '6-10', '6-9'].sort());
  assert.equal(fta.querySelectorAll('[data-fta-node]').length, 10);
  assert.deepEqual(Array.from(fta.querySelectorAll('[data-fta-kind="and"]'), node => node.getAttribute('data-fta-node')), ['2', '6']);
  assert.deepEqual(Array.from(fta.querySelectorAll('[data-fta-kind="or"]'), node => node.getAttribute('data-fta-node')), ['5']);

  const interactionOutput = render(q(450).chart);
  const interaction = new dom.window.DOMParser().parseFromString(interactionOutput, 'text/html');
  assert.deepEqual(Array.from(interaction.querySelectorAll('[data-interaction-panel]'), panel => panel.getAttribute('data-interaction-panel')), ['A × B', 'A × C', 'B × C']);
  assert.equal(interaction.querySelectorAll('[data-interaction-marker="circle"]').length, 6);
  assert.equal(interaction.querySelectorAll('[data-interaction-marker="square"]').length, 6);
  assert.doesNotMatch(interactionOutput, /crossing\s*=|parallel\s*=|no interaction/i);
  const expectedSeries = [
    [[24, 19], [45, 29]],
    [[45, 16], [24, 32]],
    [[23, 37], [20, 36]],
  ];
  Array.from(interaction.querySelectorAll('[data-interaction-panel]')).forEach((panel, panelIndex) => {
    Array.from(panel.querySelectorAll('[data-interaction-series]')).forEach((series, seriesIndex) => {
      const recovered = series.getAttribute('points').split(/\s+/).map(point => {
        const y = Number(point.split(',')[1]);
        return Math.round((1 - (y - 34) / 145) * 50);
      });
      assert.deepEqual(recovered, expectedSeries[panelIndex][seriesIndex]);
    });
  });

  const normalChart = q(341).chart;
  const skewChart = q(342).chart;
  assert.equal(normalChart.sourceN, 29);
  assert.equal(skewChart.sourceN, 100);
  assert.equal(normalChart.points.length, 29, 'Plot 1 preserves all 29 source observations');
  assert.equal(skewChart.points.length, 100, 'Plot 2 restores all 100 source observations from the digitized curve');
  assert.deepEqual(skewChart.points[0], [0.11, -2.576]);
  assert.deepEqual(skewChart.points[skewChart.points.length - 1], [25.53, 2.576]);
  assert.ok(skewChart.points.filter(([x]) => x <= 1).length >= 25, 'Plot 2 preserves the dense near-zero cluster');
  assert.ok(Math.max(...skewChart.points.map(([x]) => x)) > 25, 'Plot 2 preserves the long upper tail');
  assert.deepEqual(normalChart.fitPoints, [[11.6, -2.17], [32.8, 2.11]]);
  assert.deepEqual(skewChart.fitPoints, [[-8.66, -2.58], [17.4, 2.53]]);
  assert.equal(normalChart.lowerBand.length, 10);
  assert.equal(normalChart.upperBand.length, 10);
  assert.equal(skewChart.lowerBand.length, 21);
  assert.equal(skewChart.upperBand.length, 21);
  assert.equal(explicitBandOutsideCount(normalChart), 0, 'Plot 1 points remain inside the source confidence bands');
  assert.ok(explicitBandOutsideCount(skewChart) >= 20, 'Plot 2 visibly departs from the source confidence bands');
  assert.deepEqual([normalChart.xMin, normalChart.xMax, normalChart.yMin, normalChart.yMax], [5, 40, -2.17, 2.5]);
  assert.deepEqual([skewChart.xMin, skewChart.xMax, skewChart.yMin, skewChart.yMax], [-15, 30, -2.58, 3]);

  const plot1 = render(normalChart);
  const plot2 = render(skewChart);
  assert.match(plot1, /data-normal-prob-n="29"/);
  assert.match(plot1, /data-normal-prob-visible="29"/);
  assert.match(plot2, /data-normal-prob-n="100"/);
  assert.match(plot2, /data-normal-prob-visible="100"/);
  assert.equal((plot1.match(/<polygon points=/g) || []).length, 29);
  assert.equal((plot2.match(/<polygon points=/g) || []).length, 100);
  assert.equal((plot1.match(/class="tb-chart-band"/g) || []).length, 2);
  assert.equal((plot2.match(/class="tb-chart-band"/g) || []).length, 2);
  assert.match(plot1, /<clipPath id="tbNormalProbClip29Plot1">/);
  assert.match(plot1, /clip-path="url\(#tbNormalProbClip29Plot1\)"/);
  assert.match(plot2, /<clipPath id="tbNormalProbClip100Plot2">/);
  assert.match(plot2, /clip-path="url\(#tbNormalProbClip100Plot2\)"/);
  assert.match(plot1, /representing 29 ordered observations/);
  assert.match(plot2, /representing 100 ordered observations/);

  const boxplot = new dom.window.DOMParser().parseFromString(render(q(337).chart), 'text/html');
  const tickText = new Set(Array.from(boxplot.querySelectorAll('text'), node => node.textContent.trim()));
  for (let value = 80; value <= 180; value += 10) assert.ok(tickText.has(String(value)), `box plot includes ${value} tick`);

  const ariaCases = [
    [639, /X-bar limits: UCL.*sample means.*R-chart limits.*sample ranges/i],
    [336, /minimum 6.*first quartile 15.*median 20.*mean 21.*third quartile 25.*maximum 32/i],
    [650, /Point offsets from each target center: A:/i],
    [424, /Cells by row:/i],
    [406, /normalized x and y coordinates.*A:/i],
    [620, /Area 9 is the triangular roof above Area 2/i],
    [443, /event 1 leads to AND gate 2.*gate 6 branches to basic events 9 and 10/i],
    [272, /Division 1: Shipper 1 blank.*Part B small volume/i],
    [450, /A by B: B minus-one responses 24 then 19.*B by C:/i],
  ];
  ariaCases.forEach(([number, expected]) => {
    const parsed = new dom.window.DOMParser().parseFromString(render(q(number).chart), 'text/html');
    const svg = parsed.querySelector('svg[role="img"]');
    assert.ok(svg, `Q${number} has an accessible image role`);
    assert.match(svg.getAttribute('aria-label'), expected, `Q${number} text alternative carries the plotted data`);
    assert.doesNotMatch(svg.getAttribute('aria-label'), /correct answer|keyed answer/i, `Q${number} text alternative is neutral`);
  });
});

test('audited domain assignments and source citations have the corrected distribution', () => {
  const counts = {};
  bank.forEach(question => { counts[question.sub] = (counts[question.sub] || 0) + 1; });
  assert.deepEqual(counts, { p1: 48, p2: 50, tm: 67, def: 73, mea: 178, ana: 90, imp: 81, con: 82, dfss: 25 });
  const corrections = {
    166: 'mea', 475: 'mea', 547: 'ana', 611: 'mea', 615: 'tm', 642: 'mea', 655: 'p1',
  };
  for (const [number, domain] of Object.entries(corrections)) assert.equal(q(Number(number)).sub, domain, `Q${number}`);
});
