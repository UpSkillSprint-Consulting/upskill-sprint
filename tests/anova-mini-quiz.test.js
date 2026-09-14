const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, '../lessons/statistics/anova-analysis-one-stop-shop.html'), 'utf8');
function setup() {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  window.matchMedia = () => ({ matches: true });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  const script = html.split('// ---------- Quiz ----------')[1].split('// Update SVGs')[0];
  window.eval(`const $ = (s, root = document) => root.querySelector(s); const $$ = (s, root = document) => [...root.querySelectorAll(s)]; ${script}`);
  const doc = window.document;
  return { dom, doc, questions: [...doc.querySelectorAll('#quiz-form .quiz-question')], submit: () => doc.querySelector('#quiz-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })) };
}
test('all 20 questions use the same selectable format and sequential groups', () => {
  const { dom, doc, questions } = setup();
  try {
    assert.equal(questions.length, 20);
    assert.equal(doc.querySelectorAll('#quiz details').length, 0);
    questions.forEach((q, i) => {
      const inputs = [...q.querySelectorAll('input[type="radio"]')];
      assert.equal(inputs.length, 4);
      assert.ok(inputs.every(input => input.name === `q${i + 1}`));
      assert.equal(inputs.filter(input => input.value === q.dataset.answer).length, 1);
      assert.match(q.querySelector('legend').textContent, new RegExp(`^${i + 1}\\.`));
      assert.equal(q.querySelector('.feedback').hidden, true);
    });
  } finally { dom.window.close(); }
});
test('20-question grading handles unanswered, partial and perfect scores without corrupting explanations', () => {
  const { dom, doc, questions, submit } = setup();
  try {
    const result = doc.querySelector('#quiz-result');
    submit();
    assert.match(result.textContent, /Score: 0\/20 \(0%\)/);
    assert.match(result.textContent, /answered 0 of 20/);
    questions.slice(0, 16).forEach(q => { q.querySelector(`input[value="${q.dataset.answer}"]`).checked = true; });
    submit();
    assert.match(result.textContent, /Score: 16\/20 \(80%\)/);
    assert.ok(result.classList.contains('pass'));
    questions.forEach(q => { q.querySelector(`input[value="${q.dataset.answer}"]`).checked = true; });
    submit();
    assert.match(result.textContent, /Score: 20\/20 \(100%\)/);
    const feedback = questions[17].querySelector('.feedback');
    const first = feedback.innerHTML;
    submit();
    assert.equal(feedback.innerHTML, first);
    assert.ok(feedback.querySelector('sup'), 'retains formatted explanation');
    doc.querySelector('#reset-quiz').click();
    assert.equal(doc.querySelectorAll('#quiz-form input:checked').length, 0);
    assert.ok(questions.every(q => q.querySelector('.feedback').hidden && !q.classList.contains('correct') && !q.classList.contains('incorrect')));
    assert.equal(result.textContent, 'Answer all 20 questions, then submit.');
  } finally { dom.window.close(); }
});
