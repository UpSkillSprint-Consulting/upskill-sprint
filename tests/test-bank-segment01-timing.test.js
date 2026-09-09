'use strict';
// Historical Segment 01 observation revalidated after the Segment 13 repair.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { makeSandbox } = require('./helpers/segment01-sandbox.cjs');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const emit = (name, value) => console.log('SEG01_' + name + ' ' + JSON.stringify(value));
const observe = (id, observed, desired) => emit('OBSERVATION', { id, observed, desired, desiredSatisfied: JSON.stringify(observed) === JSON.stringify(desired), fixedByThisPR: true });

test('revalidation G14: hiding a question retains the preceding visible interval in both Phase-2 fallbacks', () => {
  const results = [];
  for (const [file, marker, state, method] of [
    ['test-bank-phase2-runtime-coordinator.js', 'window.__TBPhase2Runtime =', 'stem=key;startedAt=at;', 'commit'],
    ['test-bank-phase2-hardening.js', 'window.__TBPhase2Hardening=', 'activeStem=key;activeSince=at;', 'commitTime']
  ]) {
    const s = makeSandbox();
    const source = read(file);
    assert.equal(source.split(marker).length, 2, 'Revalidate timing seam if source changes');
    const map = method === 'commit' ? 'times' : 'frozenTimes';
    const instrumented = source.replace(marker, 'window.__TBSegment01Time={seed:function(key,at){' + state + '},commit:' + method + ',get:function(){return Object.assign({},' + map + ');}};\n' + marker);
    require('node:vm').runInContext(instrumented, s.context, { filename: file, timeout: 3000 });
    const probe = s.context.__TBSegment01Time;
    probe.seed(s.questions[0].qid, s.now() - 10000);
    // visibilitychange is delivered with document.hidden already true; the
    // preceding visible interval must be committed before hidden time begins.
    s.context.document.hidden = true;
    probe.commit();
    results.push({ file, savedVisibleMilliseconds: probe.get()[s.questions[0].qid] || 0 });
  }
  assert.deepEqual(results.map(r => r.savedVisibleMilliseconds), [10000, 10000]);
  observe('G14', results.map(r => r.savedVisibleMilliseconds), [10000, 10000]);
  emit('TIMING_OWNERS', results);
  emit('TIMING_FINGERPRINTS', ['test-bank-session-timing.js', 'test-bank-deep-feedback.js', ...results.map(r => r.file)].map(file => ({ file, sha256: crypto.createHash('sha256').update(read(file)).digest('hex') })));
});
