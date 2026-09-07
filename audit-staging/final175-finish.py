from pathlib import Path
p=Path('test-bank-feedback-loop.js');s=p.read_text();needle='      .tb-review-reference{max-width:100%;overflow-wrap:anywhere;line-height:1.6}'
assert needle in s
s=s.replace(needle,needle+'\n      .tb-review-option .tb-answer-copy,.tb-answer-compare strong,.tb-distractor-title{min-width:0;overflow-wrap:anywhere}\n      .tb-retry-option,.tb-similar-option{min-width:0;overflow-wrap:anywhere}',1);p.write_text(s)
p=Path('test-bank-retake-runner.js');s=p.read_text();old="""    if (!button) return;
    button = disownLegacyRetakeButton(button);
    const kind = resultKind(button) || retakeKind(button);
    if (kind === 'quick' || kind === 'focus') button.dataset.retakeKind = kind;""";new="""    if (!button) return;
    const kind = resultKind(button) || retakeKind(button);
    // This coordinator owns only Quick/Focused Quiz recipes. Preserve the core
    // Full Exam/Diagnostic listener; cloning those buttons makes them inert.
    if (kind !== 'quick' && kind !== 'focus') return;
    button = disownLegacyRetakeButton(button);
    button.dataset.retakeKind = kind;""";assert old in s;s=s.replace(old,new,1);p.write_text(s)
p=Path('tests/test-bank-mbb-set3-final-student.test.js');s=p.read_text()+'''

test('Full Exam retake retains its core listener when the Quick/Focused coordinator is loaded',async()=>{
 const p=await player();try{const {w,click}=p;for(const f of ['test-bank-retake-state.js','test-bank-retake-runner.js'])w.eval(read(f));const first=w.__TB.getFeedbackSnapshot();click('[data-opt="'+first.records[0].question.answer+'"]');click('[data-flag]');click('[data-goto="174"]');click('[data-submit]');await wait(100);
 const button=w.document.querySelector('[data-retake]');assert.ok(button);assert.match(button.textContent,/Full Exam/);assert.equal(button.dataset.upskillRetakeOwned,undefined);button.click();await wait(100);const next=w.__TB.getFeedbackSnapshot();assert.ok(w.document.querySelector('.tb-quiz'));assert.notEqual(next.sessionId,first.sessionId);assert.equal(next.records.length,175);assert.ok(next.records.every(r=>r.selected===null&&!r.flagged));assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});

test('narrow-screen review copy wraps long terms instead of escaping its grid column',()=>{
 const source=read('test-bank-feedback-loop.js');assert.ok(source.includes('.tb-review-option .tb-answer-copy,.tb-answer-compare strong,.tb-distractor-title{min-width:0;overflow-wrap:anywhere}'));
});
''';p.write_text(s)
