from pathlib import Path
p=Path('scripts/student-review-browser.py')
s=p.read_text()
a='sets=page.locator(f\'[data-set="{bank}"]\')'
b='sets=page.locator(f\'[data-set="{bank}"]\' if mode==\'full\' else f\'[data-quiz-set-kind="{mode}"][data-quiz-set="{bank}"]\')'
assert s.count(a)==1
s=s.replace(a,b)
a='            original=page.evaluate(\'()=>JSON.stringify(__TB.getFeedbackSnapshot())\')'
b='''            assert before['setId']==bank, (exam,mode,bank,before['setId'])
            valid=page.evaluate("""({exam,bank,mode})=>{const e=__TB.EXAMS[exam],s=__TB.getFeedbackSnapshot();const rows=bank==='mix'?Object.values(e.sets||{1:e.bank}).flat():(e.sets?.[bank]||e.bank);const signature=q=>JSON.stringify([q.qid||q.id||null,q.stem,q.options]);const allowed=new Set(rows.map(signature));return s.records.every(r=>allowed.has(signature(r.question)));}""",{'exam':exam,'bank':bank,'mode':mode})
            assert valid, 'A delivered question is outside the selected test set'
'''+a
assert s.count(a)==1
s=s.replace(a,b)
p.write_text(s)
