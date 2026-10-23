const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('lessons/lean-six-sigma/process-capability-cp-and-cpk.html', 'utf8');

function lessonPage(runExplorer = false) {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  if (runExplorer) {
    for (const script of dom.window.document.querySelectorAll('script:not([src]):not([type="application/ld+json"])')) {
      dom.window.eval(script.textContent);
    }
  }
  return dom;
}

// Independent reference: integrate the normal density, without using the lesson's CDF.
function normalTail(z) {
  const intervals = 4000;
  const step = (12 - z) / intervals;
  const density = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  let sum = density(z) + density(12);
  for (let i = 1; i < intervals; i++) sum += (i % 2 ? 4 : 2) * density(z + i * step);
  return sum * step / 3;
}

test('the all-observation Excel standard deviation produces overall performance indices', () => {
  const dom = lessonPage();
  const steps = [...dom.window.document.querySelectorAll('#software .panel ol li')];
  assert.ok(steps[0].textContent.includes('=STDEV.S(A2:A61)'), 'the example uses the overall sample spread');
  assert.match(steps[1].querySelector('strong').textContent, /P_\{p\}/);
  assert.match(steps[2].querySelector('strong').textContent, /P_\{pk\}/);
  assert.ok(steps[1].textContent.includes('=(E2-E1)/(6*E5)'));
  assert.ok(steps[2].textContent.includes('=MIN((E2-E4)/(3*E5), (E4-E1)/(3*E5))'));
  dom.window.close();
});

test('the centred benchmark table gives ppm consistent with its stated indices and rounding', () => {
  const dom = lessonPage();
  const table = dom.window.document.querySelector('#interpretation table');
  assert.match(table.caption.textContent, /centred/i, 'the table must state its centring assumption');
  const rows = [...table.querySelectorAll('tbody tr')].slice(1);
  assert.equal(rows.length, 4);
  for (const row of rows) {
    const [indexCell, ppmCell] = row.cells;
    const fraction = indexCell.textContent.match(/\\frac\{(\d+)\}\{(\d+)\}/);
    const index = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(indexCell.textContent.match(/\d+(?:\.\d+)?/)[0]);
    const ppmText = ppmCell.textContent.replaceAll(',', '').match(/\d+(?:\.\d+)?/)[0];
    const decimals = (ppmText.split('.')[1] || '').length;
    const expectedPpm = 2e6 * normalTail(3 * index);
    const roundingTolerance = 0.5 * 10 ** -decimals;
    assert.ok(Math.abs(Number(ppmText) - expectedPpm) <= roundingTolerance,
      'ppm must agree with the centred normal tails at the displayed precision');
  }
  dom.window.close();
});

test('the same Cpk can have different two-sided ppm when the process is off-centre', () => {
  const dom = lessonPage(true);
  const doc = dom.window.document;
  const centredCpk = doc.getElementById('cap-cpk').textContent;
  assert.equal(doc.getElementById('cap-oos').textContent, '\u2248 63 ppm');

  const lowerLimit = doc.getElementById('cap-lsl');
  lowerLimit.value = '90';
  lowerLimit.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(doc.getElementById('cap-cpk').textContent, centredCpk,
    'the nearest specification limit is unchanged');
  const expectedPpm = Math.round(1e6 * (normalTail((100 - 90) / 1.5) + normalTail((106 - 100) / 1.5)));
  assert.equal(doc.getElementById('cap-oos').textContent, '\u2248 ' + expectedPpm + ' ppm');
  assert.equal(expectedPpm, 32, 'the far tail is smaller despite an unchanged Cpk');
  dom.window.close();
});
