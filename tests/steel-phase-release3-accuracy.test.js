'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool() {
  const ctx = bootTool();
  await ready(ctx.win);
  return ctx;
}

function smoothing(doc, points) {
  doc.getElementById('spx-r3-smooth').value = String(points);
}

test('Release 3 uses crossing time for the 800 to 500 cooling rate', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'crossing-rate.csv'
  );
  assert.ok(Math.abs(win.__SPX.release3.intervalRate(800, 500) - 300 / 110) < 1e-12);
  assert.match(doc.getElementById('spx-r3-metrics').textContent, /2\.73\s*°C\/s/);
  assert.match(doc.getElementById('spx-r3-metrics').textContent, /Crossing-based/);
});

test('Release 3 averages every duplicate timestamp without pairwise bias', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,100\n0,200\n0,300\n1,190\n2,180',
    'duplicates.csv'
  );
  assert.equal(win.__SPX.release3.getData()[0].temp, 200);
  assert.equal(win.__SPX.release3.getStats().duplicates, 2);
  assert.match(doc.getElementById('spx-r3-file-status').textContent, /2 duplicate timestamps were averaged/);
});

test('near-duplicate timestamps are rejected transactionally when fewer than three remain', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n1,700\n2,600',
    'retained-good.csv'
  );
  const before = JSON.stringify(win.__SPX.release3.getData());

  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_s,Temperature_C\n0,800\n0.0000000004,700\n0.0000000008,600',
      'near-duplicates.csv'
    ),
    /three unique numeric samples.*previous thermal record was retained/i
  );
  assert.equal(JSON.stringify(win.__SPX.release3.getData()), before);
  assert.match(doc.getElementById('spx-r3-record-name').textContent,
    /retained-good\.csv/);
  assert.doesNotMatch(win.__SPX.release3.report(), /near-duplicates\.csv/);
});

test('thermal arrests do not claim an Ms match below the martensite model scope', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.state.chem.C = 0;
  smoothing(doc, 1);
  const temperatures = [700, 650, 600, 550, 520, 515, 515, 515, 515, 515, 515, 515, 510, 480, 450, 420, 390];
  const text = ['Time_s,Temperature_C'].concat(
    temperatures.map((temperature, index) => `${index * 10},${temperature}`)
  ).join('\n');
  win.__SPX.release3.loadText(text, 'low-carbon-arrest.csv');

  const events = win.__SPX.release3.getEvents();
  assert.ok(events.length > 0, 'fixture must produce a candidate arrest');
  assert.ok(events.every(event => event.critical !== 'Ms estimate'));
  assert.doesNotMatch(doc.getElementById('spx-r3-events').textContent, /Near Ms estimate/i);
  assert.match(doc.getElementById('spx-r3-events').textContent,
    /Unassigned thermal arrest.*Ms comparison withheld below 0\.02 wt% C/i);
});

test('thermal arrests gate Ms when the shared critical-temperature validity check fails', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  Object.assign(win.state.chem, { C: .60, Cr: 5 });
  const critical = win.__SPX.chemMetrics();
  assert.ok(critical.ac3 <= critical.ac1,
    'fixture must put the Andrews completion estimate outside the shared model domain');
  smoothing(doc, 1);
  const arrest = Math.round(critical.ms);
  const temperatures = [500, 420, 340, 260, arrest + 5,
    arrest, arrest, arrest, arrest, arrest, arrest, arrest,
    arrest - 5, 150, 120, 100];
  win.__SPX.release3.loadText(
    ['Time_s,Temperature_C'].concat(
      temperatures.map((temperature, index) => `${index * 10},${temperature}`)
    ).join('\n'),
    'invalid-critical-order.csv'
  );

  const events = win.__SPX.release3.getEvents();
  assert.ok(events.length > 0, 'fixture must produce a candidate arrest');
  assert.ok(events.every(event => event.critical !== 'Ms estimate'));
  assert.doesNotMatch(doc.getElementById('spx-r3-events').textContent, /Near Ms estimate/i);
  assert.match(doc.getElementById('spx-r3-events').textContent,
    /Ms comparison withheld.*completion estimate at or below Ac₁/i);
});

test('chemistry changes immediately relabel candidate arrests against the current Ms validity', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const carbon = doc.getElementById('spx-chem-C');
  carbon.value = '.05';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  smoothing(doc, 1);
  const temperatures = [700, 650, 600, 550, 500, 482,
    480, 480, 480, 480, 480, 480, 478, 450, 420, 390, 360];
  win.__SPX.release3.loadText(
    ['Time_s,Temperature_C'].concat(
      temperatures.map((temperature, index) => `${index * 10},${temperature}`)
    ).join('\n'),
    'chemistry-relabel.csv'
  );
  assert.match(doc.getElementById('spx-r3-events').textContent, /Near Ms estimate/i);
  const before = JSON.stringify(win.__SPX.release3.getEvents());

  carbon.value = '.8';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  const after = win.__SPX.release3.getEvents();
  assert.notEqual(JSON.stringify(after), before);
  assert.ok(after.every(event => event.critical !== 'Ms estimate'));
  assert.doesNotMatch(doc.getElementById('spx-r3-events').textContent, /Near Ms estimate/i);
});

test('invalid smoothing windows retain the last valid analysis', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const input = doc.getElementById('spx-r3-smooth');
  input.value = '1';
  input.dispatchEvent(new win.Event('input', { bubbles: true }));
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'smoothing.csv'
  );
  const before = JSON.stringify(win.__SPX.release3.getData());

  for (const value of ['', '100', '4']) {
    input.value = value;
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.equal(JSON.stringify(win.__SPX.release3.getData()), before,
      `analysis remains unchanged for ${value || 'blank'}`);
    assert.equal(win.serializable().release3.config.smooth, 1,
      'invalid input does not replace the stored smoothing window');
    assert.match(doc.getElementById('spx-r3-file-status').textContent,
      /not recalculated.*previous valid result remains displayed/i);
  }

  input.value = '3';
  input.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(input.getAttribute('aria-invalid'), 'false');
  assert.equal(win.serializable().release3.config.smooth, 3);
  assert.doesNotMatch(doc.getElementById('spx-r3-file-status').textContent, /not recalculated/i);
});

test('time and temperature must be mapped to different columns', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'distinct-columns.csv'
  );
  const before = JSON.stringify(win.__SPX.release3.getData());
  const time = doc.getElementById('spx-r3-time-col');
  const temperature = doc.getElementById('spx-r3-temp-col');
  temperature.value = time.value;
  temperature.dispatchEvent(new win.Event('change', { bubbles: true }));

  assert.equal(time.getAttribute('aria-invalid'), 'true');
  assert.equal(temperature.getAttribute('aria-invalid'), 'true');
  assert.equal(JSON.stringify(win.__SPX.release3.getData()), before);
  assert.match(doc.getElementById('spx-r3-file-status').textContent,
    /time and temperature must use different columns.*not recalculated/i);

  temperature.value = 'Temperature_C';
  temperature.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.equal(time.getAttribute('aria-invalid'), 'false');
  assert.equal(temperature.getAttribute('aria-invalid'), 'false');
});

test('Release 3 parses semicolon data with decimal commas strictly', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s;Temperature_C\n0,0;800,0\n10,0;700,0\n110,0;500,0',
    'decimal-comma.csv'
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(win.__SPX.release3.getData().map(p => [p.time, p.temp]))),
    [[0, 800], [10, 700], [110, 500]]
  );
  assert.ok(Math.abs(win.__SPX.release3.intervalRate(800, 500) - 300 / 110) < 1e-12);
});

test('delimiter detection ignores commas inside quoted semicolon fields', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    '"Time, elapsed";"Temperature, furnace"\n"0,0";"800,0"\n"10,0";"700,0"\n"110,0";"500,0"',
    'quoted-semicolon.csv'
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(win.__SPX.release3.getData().map(p => [p.time, p.temp]))),
    [[0, 800], [10, 700], [110, 500]]
  );
  assert.ok(Math.abs(win.__SPX.release3.intervalRate(800, 500) - 300 / 110) < 1e-12);
});

test('Release 3 comparison keeps physical cycle time, start, and zero-degree target', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'physical-time.csv'
  );
  const scenario = win.serializable();
  scenario.cycle = [
    { t: 900, d: 1, m: 'Heat' },
    { t: 0, d: 1, m: 'Cool' }
  ];
  assert.equal(win.restore(scenario), true);
  win.__SPX.release3.analyze();
  assert.deepEqual(
    JSON.parse(JSON.stringify(win.__SPX.release3.getSimulated().map(p => [p.time, p.temp]))),
    [[0, 25], [60, 900], [120, 0]]
  );
  assert.match(doc.getElementById('spx-r3-comparison').textContent, /No duration normalization is applied/);

  const paths = doc.querySelectorAll('#spx-r3-temp-svg path');
  assert.ok(paths.length >= 2, 'measured and simulated paths render');
  const coordinates = paths[1].getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
  const yValues = coordinates.filter((_, index) => index % 2 === 1);
  assert.ok(yValues.every(y => y >= 25 && y <= 375), 'simulated temperatures stay inside the chart domain');
});

test('a structurally failed load retains the previous filename and data', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'good.csv'
  );
  const before = win.__SPX.release3.getData();
  assert.throws(
    () => win.__SPX.release3.loadText('Time_s,Temperature_C\n0,900', 'bad.csv'),
    /header and three data rows/
  );
  assert.deepEqual(win.__SPX.release3.getData(), before);
  assert.match(doc.getElementById('spx-r3-record-name').textContent, /good\.csv/);
  const report = win.__SPX.release3.report();
  assert.match(report, /Source:<\/strong> good\.csv/);
  assert.doesNotMatch(report, /bad\.csv/);
});

test('a semantically invalid load retains the previous thermal record', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,800\n10,700\n110,500',
    'good-semantic.csv'
  );
  const before = JSON.parse(JSON.stringify(win.__SPX.release3.getData()));
  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_s,Temperature_C\n0,-273.15\n1,-274\n2,not-a-number',
      'physically-invalid.csv'
    ),
    /three unique numeric samples above absolute zero/
  );
  assert.deepEqual(JSON.parse(JSON.stringify(win.__SPX.release3.getData())), before);
  assert.match(doc.getElementById('spx-r3-record-name').textContent, /good-semantic\.csv/);
  assert.doesNotMatch(win.__SPX.release3.report(), /physically-invalid\.csv/);
});

test('converted and smoothed non-finite values are rejected before replacing valid data', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  doc.getElementById('spx-r3-time-unit').value = 'h';
  win.__SPX.release3.loadText(
    'Time_h,Temperature_C\n0,800\n1,700\n2,600',
    'finite-before-overflow.csv'
  );
  const before = JSON.stringify(win.__SPX.release3.getData());

  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_h,Temperature_C\n0,800\n1,700\n2,600\n1e308,500',
      'converted-overflow.csv'
    ),
    /converted time or temperature exceeds finite analysis limits.*previous thermal record was retained/i
  );
  assert.equal(JSON.stringify(win.__SPX.release3.getData()), before);
  assert.match(doc.getElementById('spx-r3-record-name').textContent,
    /finite-before-overflow\.csv/);

  smoothing(doc, 3);
  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_h,Temperature_C\n0,1e308\n1,1e308\n2,1e308',
      'smoothing-overflow.csv'
    ),
    /smoothing window produced a non-finite result.*previous thermal record was retained/i
  );
  assert.equal(JSON.stringify(win.__SPX.release3.getData()), before);
  assert.doesNotMatch(win.__SPX.release3.report(), /converted-overflow|smoothing-overflow/);
});

test('thermal imports enforce file-size and column-count ceilings', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  assert.throws(
    () => win.__SPX.release3.loadText('x'.repeat(5 * 1024 * 1024 + 1), 'too-large.csv'),
    /5 MiB text limit/
  );
  const header = Array.from({ length: 101 }, (_, i) => `C${i}`).join(',');
  const row = Array.from({ length: 101 }, () => '1').join(',');
  assert.throws(
    () => win.__SPX.release3.loadText(`${header}\n${row}\n${row}\n${row}`, 'too-wide.csv'),
    /100-column limit/
  );
  const tooManyRows = 'Time_s,Temperature_C\n' +
    Array.from({ length: 100001 }, (_, i) => `${i},500`).join('\n');
  assert.throws(
    () => win.__SPX.release3.loadText(tooManyRows, 'too-tall.csv'),
    /100000 data-row limit/
  );
});

test('absolute-zero temperatures are rejected in Celsius and Fahrenheit data', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  smoothing(doc, 1);
  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_s,Temperature_C\n0,-273.15\n1,-273.15\n2,-273.15',
      'absolute-zero-c.csv'
    ),
    /above absolute zero/
  );
  doc.getElementById('spx-r3-temp-unit').value = 'F';
  assert.throws(
    () => win.__SPX.release3.loadText(
      'Time_s,Temperature_F\n0,-459.67\n1,-459.67\n2,-459.67',
      'absolute-zero-f.csv'
    ),
    /above absolute zero/
  );
});

test('zero reflected temperature survives calculation, save, and restore', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const reflected = doc.getElementById('spx-r3-ir-reflected');
  reflected.value = '0';
  reflected.dispatchEvent(new win.Event('input', { bubbles: true }));
  const saved = win.serializable();
  assert.equal(saved.release3.measurement.irReflected, 0);
  reflected.value = '100';
  assert.equal(win.restore(saved), true);
  assert.equal(reflected.value, '0');
});

test('restored infrared temperatures use the global display unit, not the data-column unit', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const imperial = win.serializable();
  imperial.unit = 'imperial';
  imperial.release3.config.tempUnit = 'C';
  imperial.release3.measurement.irReflected = -300;
  assert.equal(win.restore(imperial), true);
  assert.equal(doc.getElementById('spx-r3-ir-reflected').value, '-300', '-300 °F is above absolute zero');

  const metric = win.serializable();
  metric.unit = 'metric';
  metric.release3.config.tempUnit = 'F';
  metric.release3.measurement.irReflected = -300;
  assert.equal(win.restore(metric), true);
  assert.equal(doc.getElementById('spx-r3-ir-reflected').value, '100', '-300 °C is below absolute zero');
});

test('infrared calculation with an absolute-zero input is explicitly withheld', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  doc.querySelector('#spx-r3-method [data-method="ir"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  const indicated = doc.getElementById('spx-r3-ir-indicated');
  indicated.value = '-273.15';
  indicated.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.match(doc.getElementById('spx-r3-measure-result').textContent, /above absolute zero/i);
  assert.doesNotMatch(doc.getElementById('spx-r3-measure-result').textContent, /corrected from/i);
});

test('invalid thermocouple and infrared inputs retain state and withhold quantitative output', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const result = () => doc.getElementById('spx-r3-measure-result').textContent;

  const diameter = doc.getElementById('spx-r3-tc-diameter');
  diameter.value = '';
  diameter.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(diameter.getAttribute('aria-invalid'), 'true');
  assert.match(result(), /Quantitative measurement output is withheld/i);
  assert.doesNotMatch(result(), /relative-lag tendency/i);
  assert.equal(win.serializable().release3.measurement.tcDiameter, 1.5,
    'blank/non-finite input does not replace the prior valid value');

  diameter.value = '13';
  diameter.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(diameter.getAttribute('aria-invalid'), 'true');
  assert.doesNotMatch(result(), /relative-lag tendency/i);
  diameter.value = '1.5';
  diameter.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(diameter.getAttribute('aria-invalid'), 'false');
  assert.match(result(), /relative-lag tendency/i);

  doc.querySelector('#spx-r3-method [data-method="ir"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  const cases = [
    ['spx-r3-ir-indicated', '', '900'],
    ['spx-r3-ir-e-set', '1.1', '.85'],
    ['spx-r3-ir-e-actual', '0.01', '.75'],
    ['spx-r3-ir-reflected', '-273.15', '100'],
    ['spx-r3-ir-target', '0', '100'],
    ['spx-r3-ir-spot', '100001', '25']
  ];
  for (const [id, invalid, valid] of cases) {
    const input = doc.getElementById(id);
    input.value = invalid;
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
    assert.equal(input.getAttribute('aria-invalid'), 'true', `${id} marks the raw value invalid`);
    assert.match(result(), /Quantitative measurement output is withheld/i);
    assert.doesNotMatch(result(), /greybody estimate/i);
    input.value = valid;
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
    assert.equal(input.getAttribute('aria-invalid'), 'false', `${id} recovers after correction`);
  }
  assert.match(result(), /greybody estimate/i);
});

test('thermocouple assistant reports only an uncalibrated relative-lag tendency', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const result = doc.getElementById('spx-r3-measure-result').textContent;
  assert.match(result, /uncalibrated relative-lag tendency/i);
  assert.match(result, /attachment-bias warning/i);
  assert.match(result, /Type K is recorded for context, not used to infer/i);
  assert.match(result, /not a response time in seconds/i);
  assert.match(result, /junction and sheath.*medium and velocity.*calibration or step-test/is);
  assert.doesNotMatch(result, /time constant|\b\d+(?:\.\d+)?\s*s\b/i);
  assert.doesNotMatch(result, /(?:Low|Moderate|High) measurement-risk indication/i);
});

test('thermocouple attachment bias cannot be disguised by a low relative-lag tendency', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const diameter = doc.getElementById('spx-r3-tc-diameter');
  diameter.value = '.1';
  diameter.dispatchEvent(new win.Event('input', { bubbles: true }));
  const attachment = doc.getElementById('spx-r3-tc-attach');
  attachment.value = 'furnace';
  attachment.dispatchEvent(new win.Event('change', { bubbles: true }));
  const shielding = doc.getElementById('spx-r3-tc-shield');
  shielding.value = 'low';
  shielding.dispatchEvent(new win.Event('change', { bubbles: true }));

  const result = doc.getElementById('spx-r3-measure-result').textContent;
  assert.match(result, /relative-lag tendency:\s*11\/100/i);
  assert.match(result, /attachment-bias warning.*furnace atmosphere.*not necessarily the workpiece core/is);
  assert.doesNotMatch(result, /Low measurement-risk indication/i);
});

test('Release 3 uses honest cooling references and portable report chart styles', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  doc.getElementById('spx-r3-sample').click();
  win.__SPX.release3.getEvents().forEach(event => {
    assert.doesNotMatch(event.label, /Ac[13₁₃]/, 'cooling arrest must not be labelled with Ac');
  });
  assert.match(doc.querySelector('#spx-r3-events').parentElement.textContent, /Cooling Ar temperatures are not predicted/);
  const report = win.__SPX.release3.report();
  assert.match(report, /--spx-accent:#0e7490/);
  assert.match(report, /\.spx-gridline\{stroke:#dfe5ec/);
});

test('restored measurement settings are whitelisted and cannot inject report markup', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const scenario = win.serializable();
  scenario.release3 = {
    config: { timeUnit: 'fortnight', tempUnit: '<img>', smooth: 999, sensitivity: -5 },
    measurement: {
      method: 'ir',
      tcType: '<img src=x onerror=alert(1)>',
      tcAttach: 'unknown',
      tcShield: 'unknown',
      irSurface: '<svg onload=alert(1)>',
      irESet: 9,
      irEActual: -2
    }
  };

  assert.equal(win.restore(scenario), true);
  assert.equal(doc.getElementById('spx-r3-time-unit').value, 's');
  assert.equal(doc.getElementById('spx-r3-temp-unit').value, 'C');
  assert.equal(doc.getElementById('spx-r3-smooth').value, '51');
  assert.equal(doc.getElementById('spx-r3-sensitivity').value, '20');
  assert.equal(doc.getElementById('spx-r3-tc-type').value, 'K');
  assert.equal(doc.getElementById('spx-r3-ir-surface').value, 'scale');
  assert.equal(doc.querySelector('#spx-r3-measure-result img, #spx-r3-measure-result svg'), null);
  assert.doesNotMatch(win.__SPX.release3.report(), /onerror|onload/);
});
