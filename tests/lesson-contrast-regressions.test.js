'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');

function openLesson(t, file, theme) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), {
    url: `https://upskillsprint.com/${file}`,
    runScripts: 'outside-only'
  });
  const { window } = dom;
  const document = window.document;
  t.after(() => window.close());
  // Preserve stylesheet order, including the theme script's generated rules.
  // No network, MathJax, lesson scripts, or contrast-fix.js run in this fixture.
  for (const link of document.querySelectorAll('link[rel="stylesheet"][href^="/"]')) {
    const style = document.createElement('style');
    style.textContent = fs.readFileSync(path.join(root, link.getAttribute('href').slice(1)), 'utf8');
    link.replaceWith(style);
  }
  window.localStorage.setItem('upskill-theme', theme);
  window.eval(fs.readFileSync(path.join(root, 'theme.js'), 'utf8'));
  assert.equal(document.documentElement.dataset.theme, theme);

  // jsdom computes root custom properties, but does not substitute var() in
  // colour/background declarations. These lesson colour tokens are root-defined;
  // substitute their computed values and let jsdom handle the actual cascade.
  const tokens = window.getComputedStyle(document.documentElement);
  for (const style of document.querySelectorAll('style')) {
    style.textContent = style.textContent.replace(
      /var\((--[\w-]+)(?:\s*,\s*([^()]+))?\)/g,
      (original, name, fallback) => tokens.getPropertyValue(name).trim() || fallback || original
    );
  }
  return window;
}

function rgb(colour) {
  const match = colour.match(/^rgba?\(([^)]+)\)$/);
  assert.ok(match, `expected a resolved RGB colour, received ${colour}`);
  const values = match[1].split(',').map(Number);
  assert.ok(values.length === 3 || values[3] === 1, `expected an opaque colour, received ${colour}`);
  return values.slice(0, 3);
}

function background(window, element) {
  for (let node = element; node; node = node.parentElement) {
    const colour = window.getComputedStyle(node).backgroundColor;
    if (colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent') return rgb(colour);
  }
  assert.fail('the tested text must have an explicit opaque background');
}

function luminance(channels) {
  const linear = channels.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function assertReadable(window, element, context) {
  const foreground = luminance(rgb(window.getComputedStyle(element).color));
  const surface = luminance(background(window, element));
  const ratio = (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05);
  assert.ok(ratio >= 4.5, `${context}: ${ratio.toFixed(2)}:1 is below 4.5:1`);
}

function assertTextAndDescendants(window, elements, context) {
  assert.ok(elements.length, `missing ${context}`);
  for (const element of elements) {
    for (const node of [element, ...element.querySelectorAll('*')]) {
      if ([...node.childNodes].some(child => child.nodeType === 3 && child.textContent.trim())) {
        assertReadable(window, node, `${context} ${node.tagName.toLowerCase()}`);
      }
    }
  }
}

for (const theme of ['light', 'dark']) {
  test(`ANOVA formula text has 4.5:1 source contrast in ${theme} mode`, t => {
    const window = openLesson(t, 'lessons/one-way-anova.html', theme);
    assertTextAndDescendants(window,
      window.document.querySelectorAll('#lesson-content .formula-box'), `${theme} formula`);
  });

  test(`ANOVA striped cells and their strong text have 4.5:1 source contrast in ${theme} mode`, t => {
    const window = openLesson(t, 'lessons/one-way-anova.html', theme);
    const cells = window.document.querySelectorAll('#lesson-content tr:nth-child(even) td');
    assert.ok([...cells].some(cell => cell.querySelector('strong')), 'include nested strong text');
    assertTextAndDescendants(window, cells, `${theme} striped cell`);
  });

  test(`outlier Reveal answer control has 4.5:1 source contrast in ${theme} mode`, t => {
    const window = openLesson(t, 'lessons/data-analytics/dealing-with-outliers.html', theme);
    const button = window.document.getElementById('practice-reveal-button');
    assert.ok(button);
    assertReadable(window, button, `${theme} Reveal answer`);
  });

  test(`every selected outlier lens has 4.5:1 source contrast in ${theme} mode`, t => {
    const window = openLesson(t, 'lessons/data-analytics/dealing-with-outliers.html', theme);
    const buttons = [...window.document.querySelectorAll('#lesson-content .lens-btn')];
    assert.ok(buttons.length);
    for (const selected of buttons) {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
      assertReadable(window, selected, `${theme} selected lens ${selected.textContent.trim()}`);
    }
  });
}
