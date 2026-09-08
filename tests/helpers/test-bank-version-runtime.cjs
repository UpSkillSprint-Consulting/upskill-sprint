'use strict';
// Manual-JSDOM harnesses must load the same deferred version prerequisites as
// the page. Synthetic authoring tests publish their own explicit fixture catalog.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../..');
function installVersions(w){
  if(!w.TextEncoder)w.TextEncoder=require('node:util').TextEncoder;
  if(!w.__TBVersions)w.eval(fs.readFileSync(path.join(root,'test-bank-versioning.js'),'utf8'));
  if(!w.__TBVersionCatalog)w.eval(fs.readFileSync(path.join(root,'test-bank-version-catalog.js'),'utf8'));
}
function publishFixture(w,examId){installVersions(w);w.__TBVersionCatalog.exams[examId]=w.__TBVersions.createExamCatalog(examId,w.__TB.EXAMS[examId],{source:'Synthetic test fixture',official:false});}
module.exports={installVersions,publishFixture};
