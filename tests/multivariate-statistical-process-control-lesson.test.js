const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('lessons/statistics/multivariate-statistical-process-control.html','utf8');
test('saved Minitab plots retain signals and limits',()=>{for(const [id,expected] of [['saved-t',[41,51]],['saved-gv',[46,51]],['combined-t',[41,51]],['combined-v',[46,51]],['saved-mewma',Array.from({length:16},(_,i)=>i+45)]]){const tag=html.match(new RegExp('<svg id="'+id+'"[^>]*>'))[0];const data=tag.match(/data-series="([^"]+)"/)[1].split(',').map(Number);const limit=Number(tag.match(/data-ucl="([^"]+)"/)[1]);assert.equal(data.length,60);assert.deepEqual(data.flatMap((v,i)=>v>limit?[i+1]:[]),expected);}});
test('lesson includes accessible interactive controls and quiz',()=>{assert.match(html,/id="ms-r"/);assert.match(html,/id="ms-lambda"/);assert.match(html,/aria-live="polite"/);assert.match(html,/upskill-quiz-result/);assert.equal((html.match(/class="quiz-question"/g)||[]).length,6);assert.match(html,/<details class="ms-impl"/);});
