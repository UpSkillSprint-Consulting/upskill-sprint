'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const source = fs.readFileSync(path.join(__dirname, '..', 'contrast-fix.js'), 'utf8');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fixture() {
  const dom = new JSDOM('<!doctype html><html data-theme="light"><head></head><body><button>Back to Exam Simulator</button></body></html>', {
    url:'https://upskillsprint.com/test-bank.html', runScripts:'outside-only', pretendToBeVisual:true
  });
  const w = dom.window;
  await new Promise(resolve => w.addEventListener('load', resolve, {once:true}));
  w.HTMLElement.prototype.getBoundingClientRect = () => ({width:200, height:40});
  // Model a native theme-aware foreground on an otherwise incorrectly styled
  // light surface. The contrast fixer must clear its own override on a switch.
  w.getComputedStyle = element => ({
    color: element.classList.contains('upskill-contrast-on-light') ? 'rgb(23, 32, 51)' : 'rgb(244, 247, 251)',
    backgroundColor: element === w.document.body ?
      (w.document.documentElement.dataset.theme === 'dark' ? 'rgb(17, 28, 45)' : 'rgb(255, 255, 255)') : 'rgba(0, 0, 0, 0)',
    visibility:'visible', display:'block', opacity:'1', fontSize:'14px', fontWeight:'600'
  });
  w.eval(source);
  return {dom,w,button:w.document.querySelector('button')};
}

test('a theme mutation during scan suppression still clears the obsolete forced text colour', async () => {
  const {w,button} = await fixture();
  try {
    assert.ok(button.classList.contains('upskill-contrast-on-light'));
    // Initialization leaves scan suppression active until the next task.
    w.document.documentElement.dataset.theme = 'dark';
    await wait(10);
    assert.equal(button.classList.contains('upskill-contrast-on-light'), false);
    await wait(560);
    assert.equal(button.classList.contains('upskill-contrast-on-light'), false);
  } finally { w.close(); }
});

test('rapid opposite theme changes are not discarded during the first settling window', async () => {
  const {w,button} = await fixture();
  try {
    await wait(5);
    w.document.documentElement.dataset.theme = 'dark';
    await wait(30);
    // Simulate an override from another same-frame scan, then switch again.
    button.classList.add('upskill-contrast-on-dark');
    w.document.documentElement.dataset.theme = 'light';
    await wait(10);
    assert.equal(button.classList.contains('upskill-contrast-on-dark'), false);
    await wait(560);
    assert.equal(button.classList.contains('upskill-contrast-on-light'), true);
  } finally { w.close(); }
});

test('already queued animation-frame scans do not measure a transitioning theme', async () => {
  const {w,button} = await fixture();
  try {
    await wait(5);
    const queued=[];
    w.requestAnimationFrame = callback => { queued.push(callback); return queued.length; };
    w.cancelAnimationFrame = () => {};
    w.dispatchEvent(new w.Event('resize'));
    w.document.documentElement.dataset.theme = 'dark';
    await wait(5);
    button.classList.add('upskill-contrast-on-dark');
    // This is the previously queued resize scan, not the theme cleanup frame.
    queued[0]();
    assert.equal(button.classList.contains('upskill-contrast-on-dark'), true,
      'a queued scan must leave theme-transition measurement to the settling pass');
  } finally { w.close(); }
});
