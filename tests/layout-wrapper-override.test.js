'use strict';

// Guards against a page-wrapper class being overridden by a second class on the
// same element (LESSON_CREATION_GUIDE §9.9). Example of the bug this catches:
//   .lz-wrap { max-width: 1120px; margin: 0 auto; }  .lz-prose { max-width: none; }
//   <div class="lz-wrap lz-prose">  -> the section runs edge to edge.
// Static scan only: simple one-class selectors in inline <style> blocks and in
// local stylesheets linked from the page. No rendering, so it is deterministic.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const SCAN_DIRS = ['lessons', 'tools', 'assets/lessons', 'exam-preview', 'engineering-tools'];

function walk(dir, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }

// Returns ordered rules for simple ".class" selectors (inside or outside @media).
function simpleRules(css) {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(stripComments(css)))) {
    const decl = m[2];
    for (const sel of m[1].split(',').map((s) => s.trim())) {
      const c = /^\.([\w-]+)$/.exec(sel);
      if (!c) continue;
      const mw = /(?:^|;)\s*max-width\s*:\s*([^;]+)/i.exec(decl);
      const autoMargin = /(?:^|;)\s*margin(?:-left|-right|-inline)?\s*:[^;]*\bauto\b/i.test(decl);
      if (mw) rules.push({ cls: c[1], maxWidth: mw[1].trim(), autoMargin });
    }
  }
  return rules;
}

function cssForPage(file, html) {
  let css = '';
  const linkRe = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  // Keep document order between linked sheets and inline blocks.
  const parts = [];
  let m;
  while ((m = linkRe.exec(html))) {
    const href = /href=["']([^"'?#]+)/i.exec(m[0]);
    if (!href || /^(https?:)?\/\//.test(href[1])) continue;
    const p = href[1].startsWith('/') ? path.join(root, href[1]) : path.join(root, path.dirname(file), href[1]);
    if (fs.existsSync(p)) parts.push([m.index, fs.readFileSync(p, 'utf8')]);
  }
  while ((m = styleRe.exec(html))) parts.push([m.index, m[1]]);
  parts.sort((a, b) => a[0] - b[0]);
  for (const [, c] of parts) css += '\n' + c;
  return css;
}

function findOverrides(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const rules = simpleRules(cssForPage(file, html));
  if (!rules.length) return [];
  const wrapperAt = new Map();
  rules.forEach((r, i) => {
    if (r.autoMargin && r.maxWidth !== 'none' && !wrapperAt.has(r.cls)) wrapperAt.set(r.cls, i);
  });
  const problems = new Set();
  const classRe = /class=["']([^"']+)["']/g;
  let m;
  while ((m = classRe.exec(html))) {
    const classes = m[1].split(/\s+/).filter(Boolean);
    for (const w of classes) {
      if (!wrapperAt.has(w)) continue;
      for (const other of classes) {
        if (other === w) continue;
        const later = rules.findIndex((r, i) => i > wrapperAt.get(w) && r.cls === other);
        if (later !== -1) problems.add(`${file}: class="${m[1]}" -> .${other}{max-width:${rules[later].maxWidth}} overrides wrapper .${w}`);
      }
    }
  }
  return [...problems];
}

test('no element combines a page wrapper with a later class that overrides its max-width', () => {
  const files = SCAN_DIRS.flatMap((d) => walk(d));
  assert.ok(files.length > 0, 'expected lesson and tool pages to scan');
  const problems = files.flatMap(findOverrides);
  assert.deepEqual(problems, [], `Nest the prose inside the wrapper instead (LESSON_CREATION_GUIDE §9.9):\n${problems.join('\n')}`);
});

module.exports = { findOverrides };
