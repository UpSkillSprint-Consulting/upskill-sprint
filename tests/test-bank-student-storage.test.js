'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync('test-bank-memory-learning.js','utf8');

test('memory-only guard clears legacy exam data and preserves non-exam storage',()=>{
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://upskillsprint.com/test-bank',runScripts:'outside-only'});
  const w=dom.window;
  try{
    for(const storage of [w.localStorage,w.sessionStorage]){
      storage.setItem('tb-adaptive-cssbb','legacy answer');
      storage.setItem('audit-account-token','fixture-only-token');
      storage.setItem('audit-theme','dark');
    }
    w.eval(source);
    for(const storage of [w.localStorage,w.sessionStorage]){
      assert.equal(Object.keys(storage).includes('tb-adaptive-cssbb'),false);
      for(const key of ['tb-attempt','test-bank-review','upskill-test-bank-progress']){
        storage.setItem(key,'must not persist');
        assert.equal(storage.getItem(key),null);
        assert.equal(Object.keys(storage).includes(key),false,'a hidden value must not persist behind a filtered getter');
      }
      assert.equal(storage.getItem('audit-account-token'),'fixture-only-token');
      assert.equal(storage.getItem('audit-theme'),'dark');
      storage.setItem('audit-theme','light');assert.equal(storage.getItem('audit-theme'),'light');
      storage.removeItem('audit-account-token');assert.equal(storage.getItem('audit-account-token'),null);
    }
    assert.equal(w.__TB_MEMORY_ONLY,true);
  }finally{w.close();}
});
test('a browser denying storage access still receives the in-memory scoring engine',()=>{
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://upskillsprint.com/test-bank',runScripts:'outside-only'});
  const w=dom.window;
  try{
    for(const name of ['localStorage','sessionStorage'])Object.defineProperty(w,name,{configurable:true,get(){throw new w.DOMException('Blocked in isolated test','SecurityError');}});
    w.eval(source);
    assert.equal(w.__TBLearning.memoryOnly,true);
    assert.equal(w.__TBVersions.classify({options:['A','B'],answer:1},1),'correct');
  }finally{w.close();}
});
