/* Full-population browser validation. Run from the repository root. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const zlib = require('node:zlib');
const { chromium, webkit } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const out = path.resolve('artifacts/dmaic-encyclopedia');
fs.mkdirSync(out, { recursive: true });
const encoded = [1, 2, 3, 4].map(i => fs.readFileSync('assets/lessons/dmaic-formula-encyclopedia/part-' + i + '.txt', 'utf8')).join('').replace(/\s/g, '');
const html = zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
const data = html.match(/<script>\s*(const R = String.raw;[\s\S]*?)<\/script>/)[1];
const source = data.slice(0, data.indexOf('const root = document.getElementById("formulaRoot");'));
const inventory = vm.runInNewContext(source + '; JSON.stringify(formulas)');
const formulas = JSON.parse(inventory);
assert.equal(formulas.length, 111);
assert.equal(new Set(formulas.map(f => f.id)).size, 111);
fs.writeFileSync(path.join(out, 'formula-inventory.json'), JSON.stringify(formulas, null, 2));
const report = { formulaFamilies: 111, cases: [], errors: [], matrix: [], audits: {} };
const failures = [];
function record(name, detail = {}) { report.cases.push({ name, ...detail }); console.log('PASS', name); }
async function run(name, fn) {
  try { await fn(); record(name); }
  catch (error) { failures.push(name + ': ' + error.message); console.error('FAIL', name, error); }
}
const server = http.createServer((req, res) => {
  let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!path.extname(name)) name += '.html';
  const file = path.resolve('.' + name);
  if (!file.startsWith(process.cwd() + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  const type = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml' }[path.extname(file)] || 'text/plain';
  res.setHeader('Content-Type', type); res.end(fs.readFileSync(file));
});
const mathRoot = path.dirname(require.resolve('mathjax-full/package.json'));
const fflateRoot = path.resolve(path.dirname(require.resolve('fflate')), '..');
let base;
async function newPage(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1300 }, colorScheme: 'light', ...options.context });
  const page = await context.newPage();
  const pageErrors = []; page.on('pageerror', e => pageErrors.push(e.message));
  const network = { primaryFails: false, bothFail: false, extensionFails: false, delay: 0, mathRequests: [], ...options.network };
  await page.route(/https:\/\/.*(?:mathjax|fflate).*/, async route => {
    const url = route.request().url();
    if (url.includes('/fflate@')) return route.fulfill({ path: path.join(fflateRoot, 'esm/browser.js'), contentType: 'text/javascript' });
    network.mathRequests.push(url);
    if (network.bothFail || (network.primaryFails && url.includes('jsdelivr')) || (network.extensionFails && url.includes('boldsymbol'))) return route.abort();
    if (network.delay && /tex-svg(?:\.min)?\.js/.test(url)) await new Promise(r => setTimeout(r, network.delay));
    const relative = url.split('/es5/')[1]?.replace('tex-svg.min.js', 'tex-svg.js');
    if (!relative || relative.includes('..')) return route.abort();
    await route.fulfill({ path: path.join(mathRoot, 'es5', relative), contentType: 'text/javascript' });
  });
  // No third-party tracking/fonts are required to validate the lesson itself.
  await page.route(/https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)\/.*/, r => r.fulfill({ body: '', contentType: 'text/css' }));
  if (options.lessonDelay) {
    await page.route('**/assets/lessons/dmaic-formula-encyclopedia/part-*.txt*', async route => {
      await new Promise(r => setTimeout(r, options.lessonDelay));
      await route.continue();
    });
  }
  if (options.noDecompression) await page.addInitScript(() => { window.DecompressionStream = undefined; });
  return { context, page, network, pageErrors };
}
async function open(page) { await page.goto(base + '/lessons/lean-six-sigma/dmaic-formula-encyclopedia', { waitUntil: 'domcontentloaded' }); }
async function waitForMathStatus(page, status) {
  // document.open/write replaces the loader asynchronously. The lesson main can
  // legitimately be absent for a polling tick; keep waiting rather than throw.
  await page.waitForFunction(expected => document.querySelector('[data-dmaic-encyclopedia]')?.dataset.mathStatus === expected, status, { timeout: 45000 });
}
async function ready(page) { await waitForMathStatus(page, 'ready'); }
async function audit(page) {
  return page.evaluate(() => {
    function rgb(s) { const a = s.match(/[\d.]+/g)?.map(Number) || [0, 0, 0]; return [a[0], a[1], a[2], a.length > 3 ? a[3] : 1]; }
    function background(el) {
      const layers = []; for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); layers.push(c); if (c[3] === 1) break; }
      return layers.reverse().reduce((bg, c) => c.slice(0, 3).map((v, i) => v * c[3] + bg[i] * (1 - c[3])), [255, 255, 255]);
    }
    function luminance(c) { return c.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
    function contrast(e) { const l = [luminance(rgb(getComputedStyle(e).color)), luminance(background(e))].sort((a, b) => a - b); return (l[1] + .05) / (l[0] + .05); }
    const cards = [...document.querySelectorAll('.formula-card')].map(card => {
      const box = card.querySelector('.formula-box'), svg = box.querySelector('svg'), rect = card.getBoundingClientRect();
      const b = box.getBoundingClientRect(), s = svg?.getBoundingClientRect();
      const text = [...card.querySelectorAll('.card-title,.card-family,.tag,.label,.card-body p,.source,summary,.formula-id')].filter(e => e.getClientRects().length);
      const assistive = [...box.querySelectorAll('mjx-assistive-mml')];
      return { id: card.dataset.formulaId, math: box.querySelectorAll('mjx-container').length, state: box.dataset.mathState,
        parseErrors: box.querySelectorAll('[data-mjx-error],[data-mml-node="merror"],mjx-merror').length,
        rawText: [...box.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()),
        assistiveMath: assistive.length,
        visibleAssistiveMath: assistive.filter(m => { const c = getComputedStyle(m); return c.position !== 'absolute' || c.clip !== 'rect(1px, 1px, 1px, 1px)'; }).length,
        inaccessibleAssistiveMath: assistive.filter(m => { const c = getComputedStyle(m); return !m.querySelector('math') || c.display === 'none' || c.visibility === 'hidden' || m.hidden || m.closest('[aria-hidden="true"]'); }).length,
        width: s?.width, height: s?.height, offPage: rect.left < -1 || rect.right > innerWidth + 1,
        verticalClip: !!s && (s.top < b.top - 2 || s.bottom > b.bottom + 2),
        overflow: box.scrollWidth > box.clientWidth + 2, keyboardScroll: box.tabIndex === 0,
        contrast: Math.min(...text.map(contrast), svg ? contrast(svg) : 0),
        badContrast: text.filter(e => contrast(e) < 4.49).map(e => ({ text: e.textContent.slice(0, 90), ratio: contrast(e) })) };
    });
    return { cards, documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      mathItems: [...MathJax.startup.document.math].length, theme: document.documentElement.dataset.theme,
      toolbarPosition: getComputedStyle(document.querySelector('.toolbar')).position };
  });
}
function assertAssistiveMath(c) {
  assert.equal(c.assistiveMath, 1, c.id + ' must retain semantic MathML');
  assert.equal(c.visibleAssistiveMath, 0, c.id + ' duplicates the equation with visible assistive MathML');
  assert.equal(c.inaccessibleAssistiveMath, 0, c.id + ' hides semantic math from screen readers');
}
function assertAudit(result) {
  assert.equal(result.cards.length, 111);
  for (const c of result.cards) {
    assert.equal(c.state, 'ready', c.id); assert.equal(c.math, 1, c.id); assert.equal(c.parseErrors, 0, c.id);
    assert.equal(c.rawText, false, c.id); assert.ok(c.width > 0 && c.height > 0, c.id);
    assertAssistiveMath(c);
    assert.equal(c.offPage, false, c.id + ' escapes viewport'); assert.equal(c.verticalClip, false, c.id + ' vertically clipped');
    assert.ok(c.contrast >= 4.49, c.id + ' contrast ' + JSON.stringify(c.badContrast));
    if (c.overflow) assert.equal(c.keyboardScroll, true, c.id + ' has inaccessible horizontal overflow');
  }
  assert.equal(result.documentOverflow, false, 'document horizontal overflow'); assert.equal(result.mathItems, 0, 'detached MathJax document entries');
}
async function oracle(page, label) {
  await page.evaluate(() => new Promise(requestAnimationFrame));
  const result = await page.evaluate(() => {
    const val = id => document.getElementById(id).value;
    const q = val('searchInput').trim().toLowerCase(), phase = val('phaseFilter'), exam = val('examFilter'), family = val('familyFilter');
    const high = document.getElementById('highYieldBtn').getAttribute('aria-pressed') === 'true';
    const expected = formulas.filter(f => (!q || [f.id, f.phase, f.family, f.title, ...f.exams, f.eq, f.use, f.trap, f.source].join(' ').toLowerCase().includes(q)) &&
      (!phase || f.phase === phase) && (!exam || f.exams.includes(exam)) && (!family || f.family === family) && (!high || f.high)).map(f => f.id);
    const actual = [...document.querySelectorAll('.formula-card:not([hidden])')].map(c => c.dataset.formulaId);
    return { expected, actual, count: document.getElementById('resultCount').textContent, total: document.querySelectorAll('.formula-card').length,
      nav: [...document.querySelectorAll('.phase-link:not([hidden])')].map(e => e.textContent), phases: [...new Set(formulas.filter(f => expected.includes(f.id)).map(f => f.phase))] };
  });
  assert.deepEqual(result.actual, result.expected, label); assert.equal(result.total, 111);
  assert.equal(result.count, result.actual.length + ' formula families shown of 111'); assert.deepEqual(result.nav, result.phases);
}
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  try {
    const fixture = await newPage(browser); const { page } = fixture;
    await open(page); await ready(page);
    await run('authoritative data are unchanged in the browser', async () => {
      assert.deepEqual(JSON.parse(await page.evaluate(() => JSON.stringify(formulas))), formulas);
      assert.equal(await page.evaluate(() => typeof render), 'undefined', 'legacy renderer must not be installed');
    });
    await run('assistive-math guard detects a missing stylesheet without removing accessible equations', async () => {
      assertAudit(await audit(page));
      await page.evaluate(() => { document.getElementById('MJX-SVG-styles').sheet.disabled = true; });
      try {
        const withoutStyles = await audit(page);
        assert.equal(withoutStyles.cards.filter(c => c.visibleAssistiveMath > 0).length, 111, 'guard must detect every duplicate if output styles are missing');
        assert.ok(withoutStyles.cards.every(c => c.assistiveMath === 1 && c.inaccessibleAssistiveMath === 0));
      } finally {
        await page.evaluate(() => { document.getElementById('MJX-SVG-styles').sheet.disabled = false; });
      }
      await page.evaluate(() => new Promise(requestAnimationFrame)); assertAudit(await audit(page));
    });
    for (const theme of ['light', 'dark']) {
      await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
      for (const width of [1440, 1024, 768, 390, 360, 320]) {
        await run('Chromium ' + width + 'px ' + theme + ': all 111 formula cards', async () => {
          await page.setViewportSize({ width, height: 1300 }); await page.waitForTimeout(250);
          const result = await audit(page); report.audits['chromium-' + width + '-' + theme] = result; assertAudit(result);
          if (width <= 980) assert.equal(result.toolbarPosition, 'static');
          report.matrix.push({ browser: 'Chromium', width, theme, formulas: 111 });
          if (width === 1440 || width === 390) {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: path.join(out, 'chromium-' + width + '-' + theme + '.png') });
            if (width === 1440) {
              const dir = path.join(out, 'cards-' + theme); fs.mkdirSync(dir, { recursive: true });
              for (const f of formulas) await page.locator('[data-formula-id="' + f.id + '"]').screenshot({ path: path.join(dir, f.id + '.png') });
            }
          }
        });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1300 });
    await run('every phase, certification, and formula-family filter', async () => {
      for (const [id, values] of [['phaseFilter', [...new Set(formulas.map(f => f.phase))]], ['examFilter', ['CSSBB', 'CQE', 'CMBB']], ['familyFilter', [...new Set(formulas.map(f => f.family))]]]) {
        for (const value of values) { await page.selectOption('#' + id, value); await oracle(page, id + ': ' + value); }
        await page.selectOption('#' + id, '');
      }
    });
    await run('search narrowing, broadening, special characters, combinations, empty results, reset', async () => {
      for (const q of ['gamma', 'g', 'I14', 'revenue', 'regression', '0<x', 'i<j', 'α', '<script>', '&', 'no-matching-formula-9876', '']) {
        await page.fill('#searchInput', q); await oracle(page, q);
      }
      await page.selectOption('#phaseFilter', 'Analyze'); await page.selectOption('#examFilter', 'CMBB');
      await page.fill('#searchInput', 'regression'); await page.click('#highYieldBtn'); await oracle(page, 'combined filters');
      await page.click('#resetBtn'); await oracle(page, 'reset');
      await page.fill('#searchInput', 'gamma'); await page.press('#searchInput', 'Escape'); await oracle(page, 'Escape');
      await page.fill('#searchInput', 'gamma'); await page.press('#searchInput', 'Enter'); await oracle(page, 'Enter'); await page.click('#resetBtn');
    });
    await run('1000 rapid input events and 100 filter/reset cycles retain the original SVG nodes', async () => {
      await page.evaluate(() => { window.auditSVGs = [...document.querySelectorAll('.formula-box svg')];
        const input = document.getElementById('searchInput'); for (let i = 0; i < 1000; i++) { input.value = i % 2 ? 'gamma' : 'I14'; input.dispatchEvent(new Event('input', { bubbles: true })); }
        for (let i = 0; i < 100; i++) { document.getElementById('highYieldBtn').click(); document.getElementById('resetBtn').click(); }
      });
      await oracle(page, 'rapid final state');
      assert.equal(await page.evaluate(() => auditSVGs.every((s, i) => s === document.querySelectorAll('.formula-box svg')[i])), true);
      assertAudit(await audit(page));
    });
    await run('all source details expand and collapse without losing equations', async () => {
      await page.click('#expandBtn'); assert.equal(await page.locator('#formulaRoot details[open]').count(), 111);
      const axe = await new AxeBuilder({ page }).include('[data-dmaic-encyclopedia]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      fs.writeFileSync(path.join(out, 'accessibility.json'), JSON.stringify(axe, null, 2)); assert.deepEqual(axe.violations.map(v => ({ id: v.id, count: v.nodes.length })), []);
      await page.click('#collapseBtn'); assert.equal(await page.locator('#formulaRoot details[open]').count(), 0);
    });
    await run('both theme controls stay synchronized over 20 alternating switches', async () => {
      for (let i = 0; i < 20; i++) {
        await page.click(i % 2 ? '#themeBtn' : 'header.site [data-theme-toggle]');
        await page.evaluate(() => new Promise(requestAnimationFrame));
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('[data-theme-toggle]')].every(e => e.getAttribute('aria-checked') === String(document.documentElement.dataset.theme === 'dark')) && !document.body.classList.contains('dark')), true);
      }
      await page.reload(); await ready(page);
      assert.equal(await page.evaluate(() => localStorage.getItem('upskill-theme') === document.documentElement.dataset.theme), true);
    });
    for (const theme of ['light', 'dark']) {
      await run('print rendering remains readable from ' + theme + ' mode', async () => {
        await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
        await page.emulateMedia({ media: 'print' });
        try {
          await page.waitForTimeout(250);
          const a = await audit(page); report.audits['print-' + theme] = a;
          assert.equal(a.cards.length, 111);
          for (const c of a.cards) {
            assert.equal(c.state, 'ready', c.id); assert.equal(c.math, 1, c.id);
            assert.equal(c.parseErrors, 0, c.id); assert.equal(c.rawText, false, c.id);
            assert.ok(c.width > 0 && c.height > 0, c.id); assertAssistiveMath(c);
            assert.ok(c.contrast >= 4.49, c.id + ' print contrast: ' + JSON.stringify(c.badContrast));
          }
          const palette = await page.evaluate(() => ({
            paper: getComputedStyle(document.body).backgroundColor,
            badges: [...document.querySelectorAll('[data-dmaic-encyclopedia] .formula-id, [data-dmaic-encyclopedia] .phase-icon')].map(e => ({
              id: e.textContent, color: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor
            }))
          }));
          assert.equal(palette.paper, 'rgb(255, 255, 255)', 'print paper must be white even in dark mode');
          assert.equal(palette.badges.length, 117);
          for (const badge of palette.badges) {
            assert.equal(badge.color, 'rgb(0, 0, 0)', badge.id + ' print text');
            assert.equal(badge.background, 'rgb(255, 255, 255)', badge.id + ' print background');
          }
          for (const id of ['P01', 'M18', 'I14']) await page.locator('[data-formula-id="' + id + '"]').screenshot({ path: path.join(out, 'print-' + theme + '-' + id + '.png') });
        } finally {
          await page.emulateMedia({ media: 'screen' });
        }
        await page.waitForTimeout(250); assertAudit(await audit(page));
      });
    }
    assert.deepEqual(fixture.pageErrors, []); await fixture.context.close();
    for (const [name, options] of [['7-second delayed MathJax', { network: { delay: 7000 } }], ['primary CDN failure with fallback', { network: { primaryFails: true } }], ['decompression fallback', { noDecompression: true }]]) {
      await run(name, async () => { const f = await newPage(browser, options); try { await open(f.page); await ready(f.page); assertAudit(await audit(f.page)); assert.deepEqual(f.pageErrors, []); } finally { await f.context.close(); } });
    }
    await run('both CDNs blocked: visible error, retained filters, retry recovers all 111', async () => {
      const f = await newPage(browser, { network: { bothFail: true }, lessonDelay: 250 });
      try {
        await open(f.page); await waitForMathStatus(f.page, 'error');
        assert.ok(f.network.mathRequests.some(url => url.includes('jsdelivr')));
        assert.ok(f.network.mathRequests.some(url => url.includes('cdnjs')));
        await f.page.fill('#searchInput', 'I14'); await oracle(f.page, 'offline search');
        assert.equal(await f.page.locator('.math-status button').isVisible(), true);
        f.network.bothFail = false; await f.page.click('.math-status button'); await ready(f.page); await oracle(f.page, 'recovered search');
        await f.page.click('#resetBtn'); assertAudit(await audit(f.page)); assert.deepEqual(f.pageErrors, []);
      } finally { await f.context.close(); }
    });
    const safari = await webkit.launch();
    try {
      for (const theme of ['light', 'dark']) for (const width of [1440, 390, 320]) {
        await run('WebKit ' + width + 'px ' + theme + ': all 111 formula cards', async () => {
          const f = await newPage(safari, { context: { viewport: { width, height: 1300 }, colorScheme: theme } });
          try { await open(f.page); await ready(f.page); const a = await audit(f.page); report.audits['webkit-' + width + '-' + theme] = a; assertAudit(a); assert.deepEqual(f.pageErrors, []); report.matrix.push({ browser: 'WebKit', width, theme, formulas: 111 }); }
          finally { await f.context.close(); }
        });
      }
    } finally { await safari.close(); }
  } catch (error) { failures.push(error.stack); }
  finally {
    await browser.close(); server.close(); report.errors = failures;
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(out, 'SUMMARY.md'), '# DMAIC encyclopedia validation\n\n' + report.cases.length + ' passing scenarios. ' + failures.length + ' failures.\n\n' + report.cases.map(c => '- PASS: ' + c.name).join('\n') + '\n\n' + failures.map(e => '- FAIL: ' + e).join('\n'));
    console.log('RESULT', report.cases.length, 'passed;', failures.length, 'failed'); process.exitCode = failures.length ? 1 : 0;
  }
})();
