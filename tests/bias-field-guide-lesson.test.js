'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'the-lean-a-field-guide-to-bias';
const html = fs.readFileSync(path.join(root, 'lessons/statistics', `${slug}.html`), 'utf8');
const assets = path.join(root, 'assets/lessons', slug);
const docs = new JSDOM(html).window.document;

test('all 83 bias definitions and examples remain in searchable page content', () => {
  assert.ok(html.indexOf('<div class="hero">') < html.indexOf('<section class="dlzone three"'),
    'the lesson title and interactive introduction come before the posters');
  const cards = [...docs.querySelectorAll('#lesson-content [data-bias-index]')];
  assert.equal(cards.length, 83);
  assert.equal(new Set(cards.map(card => card.querySelector('h4').id)).size, 83);
  for (const card of cards) {
    assert.ok(card.querySelector('h4').textContent.trim());
    assert.ok(card.querySelector('p').textContent.trim().length > 35);
    assert.ok(card.querySelector('details .exbox').textContent.trim().length > 35);
  }
  assert.match(docs.querySelector('#bias-survivorship-bias + p').textContent, /survivors/i);
  assert.match(docs.querySelector('#bias-survivorship-bias').closest('article').textContent, /Thousands of dropouts/i);
  assert.deepEqual([...docs.querySelectorAll('#lesson-content .catblock h3')].map(x => x.id),
    ['bias-category-sel', 'bias-category-meas', 'bias-category-survey', 'bias-category-model',
      'bias-category-mind', 'bias-category-social', 'bias-category-belief', 'bias-category-sys']);
  assert.ok(docs.querySelector('#statistics-implementation #excel-functions table'));
  assert.ok(docs.querySelector('#statistics-implementation #minitab-navigation'));
  assert.ok(docs.querySelector('#name-that-bias #quizBox'));
  assert.equal(docs.querySelectorAll('#quiz .quiz-question').length, 5);
});

test('the original posters and previews are linked as real same-origin assets', () => {
  const expected = {
    '50-statistical-biases-poster.pdf': '0f9b3b7647b66f2d918a22a72336e8af2b7690b31b2b528e0ef84f8cc4a6baa4',
    '50-statistical-biases-poster-edition-2.pdf': '499181661f38e368bc6da7c10503ea2bfae6278199453e604ba069064ce846d7',
    '50-cognitive-biases-poster.pdf': '6681acfb5b3e302b24a2f69a85f5e2c17556a54a85857aa9df6d7dd6558b291e'
  };
  for (const [name, hash] of Object.entries(expected)) {
    const bytes = fs.readFileSync(path.join(assets, name));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), hash);
    assert.ok(docs.querySelector(`a[download][href="/assets/lessons/${slug}/${name}"]`));
  }
  for (let n = 1; n <= 3; n++) {
    assert.ok(fs.statSync(path.join(assets, `poster-preview-${n}.jpg`)).size > 30_000);
    assert.ok(docs.querySelector(`img[src="/assets/lessons/${slug}/poster-preview-${n}.jpg"]`));
  }
});

test('the filter, simulations and both quizzes execute without page errors', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const window = new JSDOM(html, {
    runScripts: 'dangerously', virtualConsole,
    url: `https://upskillsprint.com/lessons/statistics/${slug}`
  }).window;
  const document = window.document;
  assert.match(document.querySelector('#count').textContent, /Showing 83 of 83/);
  assert.ok(document.querySelector('#besselChart svg'));
  assert.ok(document.querySelector('#funnelChart svg'));
  document.querySelector('#q').value = 'survivorship';
  document.querySelector('#q').dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.match(document.querySelector('#count').textContent, /Showing 1 of 83/);
  document.querySelector('#q').value = '';
  document.querySelector('#q').dispatchEvent(new window.Event('input', { bubbles: true }));
  document.querySelector('#fire').click();
  assert.match(document.querySelector('#readout').textContent, /n = 10/);
  document.querySelector('#revealWald').click();
  assert.equal(document.querySelector('#revealWald').getAttribute('aria-expanded'), 'true');
  document.querySelector('#coilHead').click();
  document.querySelector('#waffleBtn').click();
  document.querySelector('#clusterBtn').click();
  document.querySelector('#coinBtn').click();
  document.querySelector('#qopts .opt').click();
  assert.ok(document.querySelector('#qnext:not([hidden])'));

  let event;
  document.addEventListener('upskill-quiz-result', e => { event = e.detail; });
  for (const [i, value] of ['b', 'c', 'a', 'd', 'b'].entries()) {
    document.querySelector(`#quiz-form input[name=q${i + 1}][value=${value}]`).checked = true;
  }
  document.querySelector('#quiz-submit').click();
  assert.equal(event.score, 5);
  assert.equal(event.total, 5);
  assert.match(document.querySelector('#quiz-result').textContent, /Score: 5 \/ 5/);
  assert.deepEqual(errors, []);
  window.close();
});
