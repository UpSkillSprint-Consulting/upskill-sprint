const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const cssPath = path.join(root, 'assets/osiris-tool-theme.css');
const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');

function readCss() {
  assert.ok(fs.existsSync(cssPath), 'assets/osiris-tool-theme.css is missing');
  return fs.readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
}

function block(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `missing rule block for ${selector}`);
  const tokens = {};
  for (const [, name, value] of match[1].matchAll(/(--osx-[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

function luminance(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const SURFACES = ['--osx-bg', '--osx-bg-sunken', '--osx-panel', '--osx-panel-raised'];
const TEXT = ['--osx-text-heading', '--osx-text', '--osx-text-2', '--osx-text-muted', '--osx-gold-text', '--osx-data', '--osx-red', '--osx-orange', '--osx-green', '--osx-blue'];
const NON_TEXT = ['--osx-gold-ui', '--osx-control-border'];

function themes() {
  const css = readCss();
  return {
    light: block(css, '.osx-tool,\n.osx-tokens'),
    dark: block(css, 'html[data-theme="dark"] .osx-tool,\nhtml[data-theme="dark"] .osx-tokens'),
  };
}

test('tool theme declares only --osx- custom properties', () => {
  const css = readCss();
  const declared = [...css.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/g)].map((m) => m[1]);
  assert.ok(declared.length > 20, 'expected the OSIRIS token set');
  assert.deepEqual(declared.filter((name) => !name.startsWith('--osx-')), []);
});

test('light and dark define the same colour tokens', () => {
  const { light, dark } = themes();
  const colourNames = (set) => Object.keys(set).filter((k) => !/font|radius/.test(k)).sort();
  assert.deepEqual(colourNames(dark).filter((k) => k !== '--osx-shadow'), colourNames(light).filter((k) => k !== '--osx-shadow'));
});

for (const theme of ['light', 'dark']) {
  test(`${theme}: text tokens are WCAG AA (4.5:1) on every surface`, () => {
    const set = themes()[theme];
    for (const text of TEXT) for (const surface of SURFACES) {
      const ratio = contrast(set[text], set[surface]);
      assert.ok(ratio >= 4.5, `${theme} ${text} ${set[text]} on ${surface} ${set[surface]} is ${ratio.toFixed(2)}:1`);
    }
    const onGold = contrast(set['--osx-on-gold'], set['--osx-gold-fill']);
    assert.ok(onGold >= 4.5, `${theme} button text on gold is ${onGold.toFixed(2)}:1`);
    const onData = contrast(set['--osx-on-data'], set['--osx-data']);
    assert.ok(onData >= 4.5, `${theme} badge text on data colour is ${onData.toFixed(2)}:1`);
  });

  test(`${theme}: focus and control borders reach 3:1 on every surface`, () => {
    const set = themes()[theme];
    for (const token of NON_TEXT) for (const surface of SURFACES) {
      const ratio = contrast(set[token], set[surface]);
      assert.ok(ratio >= 3, `${theme} ${token} on ${surface} is ${ratio.toFixed(2)}:1`);
    }
  });
}

test('tool theme never targets canonical site chrome', () => {
  const css = readCss();
  const selectors = [...css.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim()).filter((s) => !s.startsWith('@'));
  const chrome = /(^|[\s,>+~])(header|footer|nav)\b|\.site\b|\.brand\b|\.footer-grid|\.desktop-nav|\.theme-toggle|#lesson-progress-widget/;
  for (const selector of selectors) {
    assert.doesNotMatch(selector, chrome, `chrome selector in tool theme: ${selector}`);
    assert.ok(/\.osx-(tool|page|tokens)/.test(selector), `selector is not scoped to .osx-tool/.osx-page/.osx-tokens: ${selector}`);
  }
});

test('dock switches and form controls out-rank /theme.js dark overrides', () => {
  const css = readCss();
  assert.match(css, /html\[data-theme="dark"\] \.osx-tool \.osx-toggle input \{[^}]*background:[^;]*!important/);
  assert.match(css, /html\[data-theme="dark"\] \.osx-tool select,[\s\S]*?background: var\(--osx-panel-raised\) !important/);
  assert.match(css, /html\[data-theme="dark"\] body\.osx-page \{ background: #06060C !important; \}/);
});

test('guide §9.8 documents the theme and matches the stylesheet values', () => {
  const section = guide.match(/### 9\.8 Engineering tools: the OSIRIS tool theme[\s\S]*?\n---\n/);
  assert.ok(section, '§9.8 is missing from LESSON_CREATION_GUIDE.md');
  assert.match(section[0], /\/assets\/osiris-tool-theme\.css/);
  assert.match(section[0], /class="osx-page"/);
  assert.match(section[0], /class="osx-tool"/);
  assert.match(section[0], /role="switch"/, 'dock switches must be documented as native role="switch" checkboxes');
  assert.match(section[0], /aria-expanded="true" aria-controls=/, 'rail buttons must be documented with aria-expanded/aria-controls');
  const { light, dark } = themes();
  for (const row of section[0].matchAll(/^\| `(--osx-[\w-]+)` \|[^|]*\| `(#[0-9A-Fa-f]{6})` \| `(#[0-9A-Fa-f]{6})` \|$/gm)) {
    const [, name, darkHex, lightHex] = row;
    assert.equal(dark[name].toUpperCase(), darkHex.toUpperCase(), `guide dark ${name} out of sync`);
    assert.equal(light[name].toUpperCase(), lightHex.toUpperCase(), `guide light ${name} out of sync`);
  }
});

test('Engineering & Statistics Calculator uses the OSIRIS theme (§9.8 item 7)', () => {
  const page = fs.readFileSync(path.join(root, 'tools/engineering-statistics-calculator.html'), 'utf8');
  const skinPath = path.join(root, 'tools/calculator-assets/osiris-skin.css');
  assert.ok(fs.existsSync(skinPath), 'calculator skin is missing');
  const head = page.slice(0, page.indexOf('</head>'));
  const links = [...head.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
  assert.ok(links.includes('/assets/osiris-tool-theme.css'), 'shared theme not loaded');
  assert.equal(links.at(-1), '/tools/calculator-assets/osiris-skin.css', 'skin must be the last stylesheet');
  assert.match(page, /<body class="osx-page">/);
  assert.match(page, /<main id="calculator-shell" class="calculator-app osx-tokens">/);
  assert.match(page, /family=Inter:[^"]*family=JetBrains\+Mono/);

  const skin = fs.readFileSync(skinPath, 'utf8');
  for (const token of ['bg', 'panel', 'panel-2', 'line', 'line-soft', 'text', 'muted', 'faint', 'accent', 'action', 'on-action', 'teal', 'red', 'green', 'sans', 'mono']) {
    assert.match(skin, new RegExp(`--calc-${token}:\\s*var\\(--osx-`), `--calc-${token} is not mapped to an --osx token`);
  }
  assert.doesNotMatch(skin, /(^|[\s,])(header|footer)\.site|\.desktop-nav|\.theme-toggle/, 'skin must not touch site chrome');

  const plot = page.match(/function syncCanvasTheme\(\)\{[\s\S]*?\n\}/);
  assert.ok(plot, 'syncCanvasTheme() not found');
  assert.match(plot[0], /shadeEdge:"#006B7A"/, 'light plot shading should use the light data colour');
  assert.match(plot[0], /shadeEdge:"#00E5FF"/, 'dark plot shading should use the dark data colour');
  assert.doesNotMatch(page, /rgba\(232,238,244,\.(16|45)\)/, 'unshaded bars still hard-code the old palette');
});

test('calculator: cyan is reserved for data; decorative accents and graph series follow §9.8 rule 3', () => {
  const skin = fs.readFileSync(path.join(root, 'tools/calculator-assets/osiris-skin.css'), 'utf8');
  for (const selector of ['.guide-steps span', '.guide-recommendation', '.guide-recommendation strong', '.guide-table input[data-column]', '.fname', ':focus-visible']) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(skin, new RegExp(`#calculator-shell ${escaped}[^{]*\\{[^}]*var\\(--osx-gold-(text|ui)\\)`), `${selector} must use gold, not the data colour`);
  }
  const page = fs.readFileSync(path.join(root, 'tools/engineering-statistics-calculator.html'), 'utf8');
  assert.doesNotMatch(page, /href="\/tools\/calculator-manual" style="color:var\(--calc-teal\)/, 'User Manual link must use the accent, not the data colour');
  const graph = fs.readFileSync(path.join(root, 'tools/calculator-assets/advanced-ui.js'), 'utf8');
  assert.match(graph, /const darkColors=\['#00E5FF','#D4AF37'/, 'dark graph series 1/2 should be data cyan then gold');
  assert.match(graph, /const lightColors=\['#006B7A','#7A6420'/, 'light graph series 1/2 should be data teal then gold text');
  assert.match(skin, /html\[data-theme="dark"\] #calculator-shell :is\(input:not\(\[type="checkbox"\]\)[^{]*\{[^}]*border-color: var\(--osx-text-muted\) !important/, 'dark input borders must not fall back to the site navy line');
});
