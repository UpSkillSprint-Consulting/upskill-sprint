'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'test-bank-history-reconciliation.js'), 'utf8');

function api() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.__TBHistoryReconciliation;
}

function answer(id, sessionId, questionId, at, status = 'correct') {
  return { id, type: 'answer_recorded', sessionId, questionId, occurredAt: at, payload: { status } };
}

test('two conflicting legacy first labels reconcile to one first and one repeat', () => {
  const result = api().project({ questionStates: { q1: { attempts: 2, masteryHistory: [
    { id: 'a', at: 100, status: 'correct', priorAttempts: 0 },
    { id: 'b', at: 200, status: 'correct', priorAttempts: 0 }
  ] } } });
  assert.deepEqual({ answered: result.answered, unique: result.uniqueAnswered, first: result.first, repeat: result.repeat, unknown: result.unknown },
    { answered: 2, unique: 1, first: 1, repeat: 1, unknown: 0 });
});

test('the reproduced 698/649 snapshot reconciles without inventing or deleting evidence', () => {
  const states = {};
  for (let question = 0; question < 649; question += 1) {
    const count = question < 43 ? (question < 6 ? 3 : 2) : 1;
    states['q' + question] = { attempts: count, masteryHistory: Array.from({ length: count }, (_, index) => ({
      id: 'q' + question + '-' + index, at: 1000 + question * 10 + index, status: 'correct',
      priorAttempts: question >= 30 && index > 0 ? index : 0
    })) };
  }
  const result = api().project({ questionStates: states });
  assert.equal(result.answered, 698);
  assert.equal(result.uniqueAnswered, 649);
  assert.equal(result.first, 649);
  assert.equal(result.repeat, 49);
  assert.equal(result.unknown, 0);
  assert.equal(result.first + result.repeat + result.unknown, result.answered);
});

test('event identity, session revisions and completion answers are idempotent', () => {
  const events = [
    answer('same-op', 's1', 'q1', 100, 'incorrect'),
    answer('same-op', 's1', 'q1', 100, 'incorrect'),
    answer('revision', 's1', 'q1', 150, 'incorrect'),
    { id: 'complete', type: 'session_completed', sessionId: 's1', occurredAt: 200, payload: { answers: [{ questionId: 'q1', status: 'correct' }] } },
    answer('second', 's2', 'q1', 300, 'incorrect')
  ];
  const result = api().project({ events });
  assert.deepEqual({ answered: result.answered, first: result.first, repeat: result.repeat, correct: result.correct, incorrect: result.incorrect },
    { answered: 2, first: 1, repeat: 1, correct: 1, incorrect: 1 });
});

test('compacted and incomplete provenance is retained as unknown', () => {
  const result = api().project({ questionStates: { q1: {
    attempts: 3,
    masteryBaseline: { attempts: 2, correct: 1, incorrect: 1 },
    masteryHistory: [{ id: 'later', at: 300, status: 'correct' }]
  } } });
  assert.deepEqual({ answered: result.answered, first: result.first, repeat: result.repeat, unknown: result.unknown, complete: result.complete },
    { answered: 3, first: 0, repeat: 2, unknown: 1, complete: false });
  assert.equal(result.diagnostics[0].code, 'unknown-first-provenance');
});

test('classification precedes date filtering while reset epochs establish a new first', () => {
  const events = [answer('old', 's1', 'q1', 100), answer('new', 's2', 'q1', 200)];
  const windowed = api().project({ events, from: 150, to: 250 });
  assert.deepEqual({ answered: windowed.answered, first: windowed.first, repeat: windowed.repeat }, { answered: 1, first: 0, repeat: 1 });
  const reset = api().project({ events, epochStart: 150 });
  assert.deepEqual({ answered: reset.answered, first: reset.first, repeat: reset.repeat }, { answered: 1, first: 1, repeat: 0 });
});

test('current-bank scope excludes retired IDs only after global classification', () => {
  const result = api().project({
    events: [answer('one', 's1', 'current', 100), answer('two', 's2', 'retired', 200)],
    currentQuestionIds: ['current']
  });
  assert.deepEqual({ answered: result.answered, unique: result.uniqueAnswered, first: result.first }, { answered: 1, unique: 1, first: 1 });
});

test('a not-yet-hydrated ledger does not invent a known first', () => {
  const result = api().project({ events: [answer('survivor', 's2', 'q1', 200)], historyComplete: false });
  assert.deepEqual({ answered: result.answered, first: result.first, repeat: result.repeat, unknown: result.unknown, complete: result.complete },
    { answered: 1, first: 0, repeat: 0, unknown: 1, complete: false });
});

test('compacted accepted ledger totals remain counted with explicit unknown classification', () => {
  const result = api().project({ events: [answer('survivor', 's1', 'q1', 100)], ledgerAggregate: 4 });
  assert.deepEqual({ answered: result.answered, first: result.first, repeat: result.repeat, unknown: result.unknown },
    { answered: 4, first: 1, repeat: 0, unknown: 3 });
  assert.ok(result.diagnostics.some(item => item.code === 'compacted-ledger-detail'));
});

test('source disagreements are diagnostic and canonical overlap is counted once', () => {
  const result = api().project({
    events: [answer('event-1', 's1', 'q1', 100)],
    questionStates: { q1: { attempts: 2, masteryHistory: [
      { id: 'legacy-projection', learningEventId: 'event-1', attemptId: 's1', at: 100, status: 'correct' },
      { id: 'legacy-only', attemptId: 's2', at: 200, status: 'incorrect' }
    ] } }
  });
  assert.equal(result.answered, 2);
  assert.equal(result.diagnostics[0].code, 'source-count-mismatch');
  assert.deepEqual(JSON.parse(JSON.stringify(result.sourceCounts)), { ledger: 1, mastery: 2 });
});

test('dry-run conversion is deterministic, stable and performs no writes', () => {
  const reconciliation = api();
  const input = { events: [answer('a', 's1', 'q1', 100), answer('b', 's2', 'q1', 200)] };
  const first = reconciliation.dryRun(input);
  const second = reconciliation.dryRun(input);
  assert.equal(first.writes, 0);
  assert.deepEqual(first, second);
  assert.equal(new Set(first.stableOperationKeys).size, first.stableOperationKeys.length);
});

test('production loaders place the projector before mastery and analytics', () => {
  const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
  const edge = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/test-bank-mobile-picker.js'), 'utf8');
  for (const text of [html, edge]) {
    const reconciliation = text.indexOf('/test-bank-history-reconciliation.js');
    const mastery = text.indexOf('/test-bank-adaptive-mastery.js');
    const analytics = text.indexOf('/test-bank-analytics-dashboard.js');
    assert.ok(reconciliation >= 0 && reconciliation < mastery && mastery < analytics);
  }
});
