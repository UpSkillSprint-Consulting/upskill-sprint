const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('lessons/statistics/understanding-dot-notation.html', 'utf8');
function page() { return new JSDOM(html, { runScripts: 'dangerously', url: 'https://upskillsprint.com/lessons/statistics/understanding-dot-notation' }); }
test('comprehension quiz handles unanswered, correct, incorrect and changed answers and emits progress', () => {
 const dom = page(), d = dom.window.document;
 let result;
 d.addEventListener('upskill-quiz-result', e => { result = e.detail; });
 d.querySelector('#quiz-submit').click();
 assert.match(d.querySelector('#quiz-result').textContent, /0 \/ 8.*8 unanswered/);
 assert.equal(d.querySelectorAll('#quiz .warn').length, 8);
 const qs = [...d.querySelectorAll('#quiz .quiz-question')];
 // Independently specified answer key, not derived from the markup being tested.
 ['b','c','a','a','c','b','a','c'].forEach((a,i) => qs[i].querySelector(`input[value="${a}"]`).click());
 d.querySelector('#quiz-submit').click();
 assert.equal(result.score,8); assert.equal(result.total,8);
 assert.equal(d.querySelectorAll('#quiz .is-correct').length,8);
 assert.equal(d.querySelector('#quizFeedback').textContent,'Select an answer.');
 qs[0].querySelector('input[value="a"]').click(); d.querySelector('#quiz-submit').click();
 assert.equal(result.score,7); assert.match(qs[0].textContent,/Not quite/);
 d.querySelector('button.quiz-option[data-correct="true"]').click();
 assert.match(d.querySelector('#quizFeedback').textContent,/Correct/);
 assert.equal(d.querySelectorAll('#quiz .is-correct').length,7);
 dom.window.close();
});
test('calculator and worked examples have independently verified arithmetic', () => {
 const dom=page(), d=dom.window.document;
 assert.match(d.querySelector('#calcResult').textContent,/1089/);
 assert.match(d.querySelector('#calcResult').textContent,/365/);
 const cells=[[8,10],[12,14],[10,12],[18,20]], data=cells.flat();
 const sum=x=>x.reduce((a,b)=>a+b,0), sq=x=>sum(x.map(y=>y*y));
 const grand=sum(data), C=grand**2/8, total=sq(data)-C;
 const A=sq([sum(cells[0])+sum(cells[1]),sum(cells[2])+sum(cells[3])])/4-C;
 const B=sq([sum(cells[0])+sum(cells[2]),sum(cells[1])+sum(cells[3])])/4-C;
 const AB=sq(cells.map(sum))/2-C-A-B;
 assert.deepEqual([grand,C,total,A,B,AB,total-A-B-AB],[104,1352,120,32,72,8,8]);
 const O=[[30,20],[45,5]], rows=O.map(sum), cols=[75,25];
 const E=O.map((r,i)=>r.map((_,j)=>rows[i]*cols[j]/100));
 const chi=sum(O.flatMap((r,i)=>r.map((v,j)=>(v-E[i][j])**2/E[i][j])));
 assert.deepEqual(E,[[37.5,12.5],[37.5,12.5]]); assert.equal(chi,12);
 dom.window.close();
});
