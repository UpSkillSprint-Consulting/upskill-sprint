from pathlib import Path
p=Path('test-bank.html');s=p.read_text()
old="if(!completion||completion.saved===false||!writeAheadConfirmed(learning)){session.completed=false;return;}"
new="""if(!completion||completion.saved===false||!writeAheadConfirmed(learning)){
      session.completed=false;
      showLearningStorageNotice('Your completed test could not be safely saved. Your answers remain on this page. Keep it open and select See my results to retry; no completed result has been recorded.');
      // Preserve the original deadline rather than silently pausing a live exam.
      if(session.timed&&session.endsAt>Date.now())startTimer();
      return;
    }"""
assert old in s;s=s.replace(old,new,1)
old='      var index=session.i,selected=+b.dataset.opt,question=session.items[index].q;'
new="""      if(session.completed)return;
      // A failed timeout save must not let a learner revise expired answers.
      if(session.timed&&session.endsAt<=Date.now()){submitQuiz('timed-out');return;}
"""+old
assert old in s;s=s.replace(old,new,1)
old="    session.completed=true;\n    stopTimer();stopTools();"
new="    if(session.timed&&session.endsAt<=Date.now())completedReason='timed-out';\n"+old
assert old in s;s=s.replace(old,new,1);p.write_text(s)
p=Path('tests/test-bank-mbb-set3-final-student.test.js');s=p.read_text();old="assert.equal(w.document.querySelector('.tb-reshead'),null);assert.deepEqual(p.errors,[]);";new="assert.equal(w.document.querySelector('.tb-reshead'),null);assert.match(w.document.querySelector('#tb-learning-storage-notice').textContent,/could not be safely saved/);assert.deepEqual(p.errors,[]);";assert old in s;s=s.replace(old,new,1)
s+='''

test('failed timeout save cannot change expired answers, and retry keeps the timeout reason',async()=>{
 const p=await player();try{const {w,click,ticks}=p;const first=w.__TB.getFeedbackSnapshot().records[0].question;click('[data-opt="'+first.answer+'"]');const complete=w.__TBLearning.completeSession;w.__TBLearning.completeSession=()=>({saved:false});const now=w.Date.now();w.Date.now=()=>now+100000000;ticks.find(t=>t.fn.name==='tickTimer').fn();await wait(30);click('[data-opt="'+((first.answer+1)%4)+'"]');assert.equal(w.__TB.getFeedbackSnapshot().records[0].selected,first.answer);assert.ok(w.document.querySelector('#tb-learning-storage-notice'));
 let reason;w.__TBLearning.completeSession=function(c){reason=c.completedReason;return complete.call(this,c);};click('[data-goto="174"]');click('[data-submit]');await wait(60);assert.equal(reason,'timed-out');assert.match(w.document.querySelector('.tb-resverd').textContent,/1 of 175 correctly/);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
''';p.write_text(s)
