'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'test-bank.html'), 'utf8');
const raw = html
  .match(/var SET3_BANK=(\[[\s\S]*?\n\s*\]);/)[1]
  .replace(/,\s*\]$/, ']');
const bank = JSON.parse(raw);
const q = (number) => bank[number - 1];

test('audited Part B questions use their correct Body of Knowledge domains', () => {
  const expected = {
    con: [551, 557, 568, 582, 590, 600, 608, 619, 628, 639, 648, 657, 668, 673, 675, 677, 692],
    tm: [552, 555, 556, 558, 574, 578, 585, 591, 595, 602, 644, 649, 664, 671],
    ana: [553, 566, 604, 606, 638, 643, 645, 647, 653, 654, 658, 659, 661, 666, 667, 669, 670, 672, 674, 679, 681],
    dfss: [554, 613, 678, 688, 690],
    imp: [559, 572, 577, 597, 599, 611, 616, 623, 632, 642, 652, 656, 663, 665, 680, 682, 683, 685, 686, 689, 691],
    def: [561, 562, 567, 579, 580, 593, 601],
    p2: [570, 576, 598, 605, 615, 627, 631, 640, 684, 693],
    mea: [584, 592, 594, 607, 614, 618, 625, 633],
  };

  for (const [domain, numbers] of Object.entries(expected)) {
    for (const number of numbers) assert.equal(q(number).sub, domain, `Q${number}`);
  }

  const counts = {};
  bank.forEach((question) => { counts[question.sub] = (counts[question.sub] || 0) + 1; });
  assert.deepEqual(counts, { p1: 48, p2: 51, tm: 66, def: 74, mea: 174, ana: 89, imp: 84, con: 82, dfss: 26 });
});

test('exam-blocking calculation and hypothesis defects are corrected', () => {
  assert.match(q(211).stem, /present value of net benefits divided by the present value of costs/i);
  assert.equal(q(211).options[q(211).answer], '127.1%');
  assert.match(q(211).why, /\$130,782 \/ \$102,891 = 1\.271/);

  assert.match(q(410).stem, /H₀: ρ = 0 versus H₁: ρ &lt; 0/);
  assert.equal(q(410).options[q(410).answer], '−1.717');
  assert.match(q(410).why, /22 degrees of freedom/);

  assert.match(q(415).stem, /D = starting weight − ending weight/);
  assert.equal(q(415).options[q(415).answer], 'H₀: μD = 0 versus H₁: μD &gt; 0');

  assert.equal(q(481).options[q(481).answer], '0.8391');
  assert.match(q(481).why, /7,195\/373.*10,000\/435.*0\.8391/);
  assert.equal(q(483).options[q(483).answer], 'Increase the performance of the process.');
  assert.match(q(483).why, /performance = 0\.8391/);

  assert.equal(q(547).options[q(547).answer], '[28.228, 40.892]');
  assert.match(q(547).why, /34\.56 ± 6\.332/);

  assert.match(q(657).stem, /upper control limit for the X̄ chart/);
  assert.equal(q(657).options[q(657).answer], '926.1');

  assert.match(q(658).stem, /1,000 parts.*40 were defective/);
  assert.equal(q(658).options[q(658).answer], 'z₀ = −1.32, zcrit = −1.645; do not reject H₀.');
  assert.match(q(658).why, /np₀ = 49.*951.*−1\.32/);
});

test('external constants needed to solve calculation questions are supplied in-question', () => {
  const required = {
    107: ['2.355'],
    375: ['0.9869'],
    376: ['0.9869'],
    377: ['2.326'],
    378: ['2.326'],
    490: ['0.483'],
    491: ['0.076'],
    492: ['0.763', '0.448', '1.552'],
    493: ['0.763', '0.448', '1.552'],
    547: ['2.706'],
    553: ['3.117'],
    657: ['0.680'],
  };

  for (const [number, values] of Object.entries(required)) {
    const chart = q(Number(number)).chart;
    assert.equal(chart?.type, 'data-table', `Q${number} data table`);
    const rendered = JSON.stringify(chart);
    values.forEach((value) => assert.match(rendered, new RegExp(value.replace('.', '\\.')), `Q${number} includes ${value}`));
  }

  assert.deepEqual(q(375).chart, q(376).chart);
  assert.deepEqual(q(377).chart, q(378).chart);
  assert.deepEqual(q(492).chart, q(493).chart);
  assert.deepEqual(q(480).chart, q(481).chart);
  assert.deepEqual(q(481).chart, q(482).chart);
  assert.deepEqual(q(482).chart, q(483).chart);
});

test('audited citations and maintainability explanation align with the source guide', () => {
  assert.match(q(189).why, /\[I\.B\.3\]$/);
  [425, 426, 428].forEach((number) => assert.match(q(number).why, /\[VI\.C\.1\]$/));
  assert.match(q(523).why, /\[VIII\.B\.1\]$/);
  assert.match(q(690).why, /Design for Maintainability/);
  assert.doesNotMatch(q(690).why, /Manufacturability/);
});

test('known OCR damage is removed from audited questions and learning points', () => {
  const audited = [299, 323, 326, 356, 358, 368, 385, 388, 390, 400, 410, 415, 437, 453, 454, 457, 461, 462, 463, 490, 491, 553, 605, 607, 614, 618, 623, 638, 642, 647, 658, 667, 669, 670, 672];
  const broken = /�|0\.0 105|0\.0 1626|0\.0 12|32, 678|V IN|KB ls|15- minute|H 1|Ho:|a2 = 4\.5|parameter 8 = 2|a = 7\.59|95%,|24- 1|26-2|\b2k\b|\b23 full|\b25 full|\b27-3\b/;
  for (const number of audited) {
    const question = q(number);
    const text = [question.stem, ...question.options, question.why].join(' ');
    assert.doesNotMatch(text, broken, `Q${number}`);
  }

  const learningPoints = [212, 213, 214, 275, 296, 297, 298, 299, 301, 310, 323, 335, 351, 354, 356, 392, 399, 401, 419, 481, 491, 553, 607, 626, 629, 633, 635, 642, 653, 661, 668, 669];
  const garbling = /�|_\s*\d|Defec tives|Takt tzme|pomts|aGage|ap ts|L CL|S SE|I nteraction|H istorical|\bl x\b|\bPr\(X:s/;
  for (const number of learningPoints) assert.doesNotMatch(q(number).why, garbling, `Q${number} learning point`);
  assert.match(q(301).why, /EV = 1\.25.*1\.25².*= 1\.22/);
});

test('statistical conclusions use evidence-based language', () => {
  assert.match(q(647).why, /provides evidence against H₀/);
  assert.doesNotMatch(q(647).why, /conclude that H₁ is correct/i);
  assert.match(q(669).why, /insufficient evidence to reject H₀/);
  assert.match(q(669).why, /not the same as accepting or proving it/);
});
