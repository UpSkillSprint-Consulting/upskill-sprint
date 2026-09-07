'use strict';
// Isolated source evaluation: no browser initialization, network, credentials, or real storage.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.join(__dirname, '..', '..');

function makeSandbox(options = {}) {
  const values = new Map();
  let clock = options.now || Date.UTC(2026, 8, 7, 18);
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const localStorage = {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(key), clear: () => values.clear(),
    key: index => Array.from(values.keys())[index] || null,
    get length() { return values.size; }
  };
  const questions = options.questions || [
    { qid: 'cssbb:fixture:q1', stem: 'Synthetic question one.', sub: 'p1', options: ['A', 'B'], answer: 0, why: 'Synthetic fixture.' },
    { qid: 'cssbb:fixture:q2', stem: 'Synthetic question two.', sub: 'p2', options: ['A', 'B'], answer: 1, why: 'Synthetic fixture.' }
  ];
  const exam = { questions: options.examLength || 165, minutes: 270, pass: 70, sets: { 1: questions }, bok: [{ domain: 'fixture', subs: [{ id: 'p1', name: 'One', w: 80 }, { id: 'p2', name: 'Two', w: 20 }] }] };
  const noop = () => {};
  const context = {
    console, Date: ClockDate, crypto, localStorage,
    document: { readyState: 'loading', addEventListener: noop, dispatchEvent: noop, getElementById: () => null,
      querySelector: () => ({ dataset: { exam: 'cssbb' } }) },
    addEventListener: noop, removeEventListener: noop, requestAnimationFrame: noop,
    setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options && options.detail; } },
    location: { href: 'https://segment01.invalid/test-bank', reload: () => { throw new Error('Unexpected reload'); } },
    fetch: () => { throw new Error('Network forbidden in Segment 01 sandbox'); },
    __TB: { EXAMS: { cssbb: exam } }
  };
  context.window = context;
  vm.createContext(context);
  function load(file) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file, timeout: 3000 });
  }
  function setExamData(data) {
    localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { cssbb: Object.assign({ questions: {}, attempts: [], sessions: [] }, data) } }));
  }
  return { context, exam, questions, localStorage, load, setExamData, setClock: value => { clock = value; }, now: () => clock };
}
module.exports = { makeSandbox };
