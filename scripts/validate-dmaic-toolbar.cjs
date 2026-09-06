/* Regression coverage for the toolbar, not just the formula-card population.
   Local fixtures use pinned MathJax assets; DMAIC_BASE_URL exercises a real deploy. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, webkit } = require('playwright');
const root = process.cwd();
const remote = process.env.DMAIC_BASE_URL;
const out = path.resolve('artifacts/dmaic-encyclopedia');
const target = remote ? 'preview' : 'local';
fs.mkdirSync(out, { recursive: true });
const report = { target, url: remote || 'local fixture', cases: [], samples: [], failures: [] };
const controlSelector = '.toolbar button, .toolbar input, .toolbar select, .toolbar a, .math-status button, .phase-nav a';
let base = remote, server;

async function snapshot(page, stale = false) {
  const result = await page.evaluate(({ controlSelector, stale }) => {
    const nodes = [...document.querySelectorAll(controlSelector)].filter(e => e.getClientRects().length);
    let fixture;
    const saved = nodes.map(e => e.className);
    if (stale) {
      // Reproduce the shared repair script's stale !important colours in the
      // same frame as measurement, before an observer can remove the evidence.
      fixture = document.createElement('style');
      fixture.textContent = '.upskill-contrast-on-light{color:#172033!important}.upskill-contrast-on-dark{color:#f4f7fb!important}';
      document.head.append(fixture);
      const wrongClass = document.documentElement.dataset.theme === 'dark' ? 'upskill-contrast-on-light' : 'upskill-contrast-on-dark';
      nodes.forEach(e => e.classList.add(wrongClass));
    }
    function rgb(s) { const v = s.match(/[\d.]+/g)?.map(Number) || [0, 0, 0]; return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
    function blend(c, bg) { return c.slice(0, 3).map((v, i) => v * c[3] + bg[i] * (1 - c[3])); }
    function bg(e) {
      const layers = []; for (let p = e; p; p = p.parentElement) { const c = rgb(getComputedStyle(p).backgroundColor); layers.push(c); if (c[3] === 1) break; }
      return layers.reverse().reduce((b, c) => blend(c, b), [255, 255, 255]);
    }
    function lum(c) { return c.slice(0, 3).reduce((s, v, i) => { v /= 255; return s + (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i]; }, 0); }
    function ratio(f, b) { const l = [lum(blend(rgb(f), b)), lum(b)].sort((a, b) => a - b); return (l[1] + .05) / (l[0] + .05); }
    const rows = nodes.map(e => {
      const s = getComputedStyle(e), back = bg(e), r = e.getBoundingClientRect();
      const fill = s.webkitTextFillColor || s.color;
      const row = { id: e.id || e.textContent.trim(), colour: s.color, fill, background: s.backgroundColor,
        contrast: Math.min(ratio(s.color, back), ratio(fill, back)), opacity: Number(s.opacity),
        clipped: r.left < -1 || r.right > innerWidth + 1, focus: e.matches(':focus-visible'),
        focusWidth: parseFloat(s.outlineWidth), focusContrast: ratio(s.outlineColor, bg(e.parentElement)) };
      if (e.matches('input,select')) row.borderContrast = ratio(s.borderTopColor, bg(e.parentElement));
      if (e.matches('input')) {
        const ph = getComputedStyle(e, '::placeholder');
        row.placeholderContrast = Math.min(ratio(ph.color, back), ratio(ph.webkitTextFillColor || ph.color, back));
        row.caretContrast = ratio(s.caretColor, back);
      }
      if (e.matches('select')) row.options = [...e.options].map(o => { const os = getComputedStyle(o), ob = bg(o); return { value: o.value, contrast: Math.min(ratio(os.color, ob), ratio(os.webkitTextFillColor || os.color, ob)) }; });
      return row;
    });
    if (fixture) { fixture.remove(); nodes.forEach((e, i) => { e.className = saved[i]; }); }
    return { theme: document.documentElement.dataset.theme, width: innerWidth, rows,
      documentOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
  }, { controlSelector, stale });
  report.samples.push(result);
  assert.ok(result.rows.length >= 10, 'toolbar is missing controls');
  for (const r of result.rows) {
    assert.ok(r.contrast >= 4.5, `${r.id}: text contrast ${r.contrast}, ${r.colour}/${r.background}`);
    assert.equal(r.opacity, 1, r.id + ' faded text'); assert.equal(r.clipped, false, r.id + ' off-screen');
    if (r.borderContrast !== undefined) assert.ok(r.borderContrast >= 3, r.id + ' field boundary contrast ' + r.borderContrast);
    if (r.placeholderContrast !== undefined) { assert.ok(r.placeholderContrast >= 4.5, 'search placeholder contrast'); assert.ok(r.caretContrast >= 3, 'search caret contrast'); }
    if (r.focus) { assert.ok(r.focusWidth >= 2, r.id + ' lacks keyboard focus ring'); assert.ok(r.focusContrast >= 3, r.id + ' focus contrast'); }
    for (const o of r.options || []) assert.ok(o.contrast >= 4.5, r.id + ' option ' + o.value + ' contrast ' + o.contrast);
  }
  assert.equal(result.documentOverflow, false, 'page overflow');
  return result;
}
async function run(name, fn) {
  try { await fn(); report.cases.push(name); console.log('PASS', name); }
  catch (e) { report.failures.push(name + ': ' + e.stack); console.error('FAIL', name, e.message); }
}
async function fixture(browser, colour, width, savedTheme) {
  const context = await browser.newContext({ viewport: { width, height: 1100 }, colorScheme: colour });
  if (savedTheme) await context.addInitScript(t => localStorage.setItem('upskill-theme', t), savedTheme);
  const page = await context.newPage();
  if (!remote) {
    const mathRoot = path.join(path.dirname(require.resolve('mathjax-full/package.json')), 'es5');
    await page.route(/https:\/\/.*mathjax.*/, route => {
      const rel = route.request().url().split('/es5/')[1]?.replace('tex-svg.min.js', 'tex-svg.js');
      if (!rel || rel.includes('..')) return route.abort();
      return route.fulfill({ path: path.join(mathRoot, rel), contentType: 'text/javascript' });
    });
    await page.route(/https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/, r => r.fulfill({ body: '', contentType: 'text/css' }));
  }
  await page.goto(base + '/lessons/lean-six-sigma/dmaic-formula-encyclopedia', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('[data-dmaic-encyclopedia]')?.dataset.mathStatus === 'ready', null, { timeout: 60000 });
  return { page, context };
}
(async () => {
  const browsers = [];
  try {
    if (remote) {
      assert.ok(/^https:\/\/[a-z0-9-]+\.netlify\.app$/.test(remote), 'only a Netlify preview URL is accepted');
      const expected = fs.readFileSync('dmaic-encyclopedia-controls.css', 'utf8').trim();
      let current = false;
      for (let i = 0; i < 24 && !current; i++) {
        try { const r = await fetch(remote + '/dmaic-encyclopedia-controls.css?toolbar-validation=' + Date.now(), { signal: AbortSignal.timeout(10000) }); current = r.ok && (await r.text()).trim() === expected; } catch {}
        if (!current) await new Promise(r => setTimeout(r, 5000));
      }
      assert.ok(current, 'preview has not deployed the exact CSS under test');
    } else {
      server = http.createServer((req, res) => {
        let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); if (!path.extname(name)) name += '.html';
        const f = path.resolve('.' + name);
        if (!f.startsWith(root + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end(); return; }
        res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml' })[path.extname(f)] || 'text/plain'); res.end(fs.readFileSync(f));
      });
      await new Promise(r => server.listen(0, '127.0.0.1', r)); base = 'http://127.0.0.1:' + server.address().port;
    }
    for (const [name, engine] of [['Chromium', chromium], ['WebKit', webkit]]) {
      const browser = await engine.launch(); browsers.push(browser);
      for (const theme of ['light', 'dark']) {
        const { page, context } = await fixture(browser, theme, 1440);
        try {
          for (const width of [1440, 1024, 768, 390, 360, 320]) await run(`${name} ${theme} ${width}px: controls, placeholders, options, stale repair colours`, async () => {
            await page.setViewportSize({ width, height: 1100 });
            assert.equal((await snapshot(page)).theme, theme);
            await snapshot(page, true);
            if ([1440, 390].includes(width)) await page.locator('.toolbar').screenshot({ path: path.join(out, `toolbar-${target}-${name}-${theme}-${width}.png`) });
          });
          await page.setViewportSize({ width: 1440, height: 1100 });
          await run(`${name} ${theme}: hover, keyboard focus and pointer-down states`, async () => {
            for (const selector of ['#searchInput', '#phaseFilter', '#examFilter', '#familyFilter', '#resetBtn', '#highYieldBtn', '#expandBtn', '#collapseBtn', '#themeBtn', '.upskill-format-request']) {
              const el = page.locator(selector); await el.hover(); await snapshot(page);
              await page.keyboard.press('Tab'); await el.focus(); const s = await snapshot(page);
              assert.ok(s.rows.some(r => r.focus), 'keyboard focus not visible');
              if (await el.evaluate(e => e.matches('button,a'))) {
                await el.hover(); await page.mouse.down(); await snapshot(page); await page.mouse.move(1, 1); await page.mouse.up();
              }
            }
          });
          await run(`${name} ${theme}: high-yield selected, typed search, selected dropdowns`, async () => {
            await page.click('#highYieldBtn'); assert.equal(await page.locator('#highYieldBtn').getAttribute('aria-pressed'), 'true'); await snapshot(page, true);
            await page.click('#resetBtn'); await page.fill('#searchInput', 'revenue'); await snapshot(page);
            await page.click('#resetBtn'); await page.selectOption('#phaseFilter', 'Analyze'); await page.selectOption('#examFilter', 'CMBB'); await page.selectOption('#familyFilter', { index: 1 }); await snapshot(page);
            await page.click('#resetBtn');
          });
          await run(`${name} ${theme}: 40 theme switches and post-reload persistence`, async () => {
            for (let i = 0; i < 40; i++) { await page.evaluate(i => document.querySelector(i % 2 ? '#themeBtn' : 'header.site [data-theme-toggle]').click(), i); await snapshot(page, true); }
            await page.reload(); await page.waitForFunction(() => document.querySelector('[data-dmaic-encyclopedia]')?.dataset.mathStatus === 'ready');
            assert.equal((await snapshot(page)).theme, theme);
            assert.equal(await page.locator('.formula-box mjx-container').count(), 111);
            assert.equal(await page.locator('[data-mjx-error], [data-mml-node="merror"]').count(), 0);
          });
        } finally { await context.close(); }
      }
      await run(`${name}: saved preference overrides opposite OS theme`, async () => {
        for (const theme of ['light', 'dark']) { const f = await fixture(browser, theme === 'dark' ? 'light' : 'dark', 390, theme); try { assert.equal((await snapshot(f.page, true)).theme, theme); } finally { await f.context.close(); } }
      });
    }
  } catch (e) { report.failures.push(e.stack); console.error(e); }
  finally {
    for (const browser of browsers) await browser.close();
    if (server) server.close();
    fs.writeFileSync(path.join(out, `toolbar-${target}-report.json`), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(out, `TOOLBAR-${target.toUpperCase()}-SUMMARY.md`), `# Toolbar validation (${target})\n\n${report.cases.length} passing scenarios; ${report.failures.length} failures.\n\n` + report.cases.map(c => '- PASS: ' + c).join('\n') + '\n\n' + report.failures.map(c => '- FAIL: ' + c).join('\n'));
    console.log('TOOLBAR RESULT', report.cases.length, 'passed;', report.failures.length, 'failed'); process.exitCode = report.failures.length ? 1 : 0;
  }
})();
