'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('DMAIC printing cancels in-flight theme transitions without changing the screen palette',()=>{
 const css=read('dmaic-encyclopedia-fixes.css'),print=css.slice(css.indexOf('@media print {'));
 assert.match(print,/body\.dmaic-encyclopedia-page,\s*body\.dmaic-encyclopedia-page \*,\s*body\.dmaic-encyclopedia-page \*::before,\s*body\.dmaic-encyclopedia-page \*::after\s*\{\s*transition: none !important;\s*animation: none !important;/);
 assert.match(print,/html\[data-theme\] body\.dmaic-encyclopedia-page \{[^}]*background: #fff !important;[^}]*color: #000 !important;/);
});
test('back-to-simulator foreground and background cannot transition out of sync',()=>{
 assert.match(read('test-bank-feedback-loop.js'),/\.tb-backsim\{transition:none!important\}/);
});
