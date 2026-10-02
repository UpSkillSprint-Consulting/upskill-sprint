(function () {
 'use strict';
 var tokenInput=document.getElementById('certificate-token'),fileInput=document.getElementById('certificate-file'),status=document.getElementById('certificate-status'),card=document.getElementById('certificate-document');
 if (!tokenInput || !card) return;
 var print=document.getElementById('certificate-print'),copy=document.getElementById('certificate-copy'),serial=0,verifiedToken='';
 var esc=function(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
 function clear(){serial++;verifiedToken='';card.hidden=true;card.innerHTML='';print.disabled=true;copy.disabled=true;status.className='';}
 function report(text,error){status.textContent=text;status.className=error?'certificate-error':'';status.setAttribute('role',error?'alert':'status');}
 function date(value){return new Intl.DateTimeFormat('en-CA',{dateStyle:'long',timeZone:'America/Regina'}).format(new Date(value));}
 async function verify(){
  clear();var current=serial,token=tokenInput.value.trim(),controller=new AbortController(),timer=setTimeout(function(){controller.abort();},20000);
  if (!token || token.length>10000){clearTimeout(timer);report('Paste a certificate token or choose a signed proof file.',true);return;}
  report('Verifying certificate signature…');
  try {
   var response=await fetch('/api/excel-sprint/certificate/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({certificateToken:token}),cache:'no-store',signal:controller.signal}),data=await response.json();
   if (current!==serial) return;
   if (!response.ok || data.verified!==true || !data.certificate) throw new Error(data.error || 'The certificate could not be verified.');
   var p=data.certificate;
   card.innerHTML='<header class="certificate-brand"><strong>UpSkillSprint</strong><span>Verified signed completion record</span></header><p class="certificate-eyebrow">Certificate of completion</p><h2>'+esc(p.title)+'</h2><p class="certificate-presented">Awarded to</p><p class="certificate-name">'+esc(p.learnerName)+'</p><p class="certificate-scope">'+esc(p.scope)+'</p><p>Every required task has a matching submitted output.</p><dl class="certificate-details"><div><dt>Completed</dt><dd>'+esc(date(p.completedAt))+'</dd></div><div><dt>Issued</dt><dd>'+esc(date(p.issuedAt))+'</dd></div><div><dt>Certificate ID</dt><dd>'+esc(p.certificateId)+'</dd></div></dl><footer><p>'+esc(p.limitations)+'</p><p>Verify this record at '+esc(location.origin+location.pathname)+' using the signed proof JSON. Core and Expert awards have separate completion requirements.</p></footer>';
   card.hidden=false;verifiedToken=token;print.disabled=false;copy.disabled=false;report('Signature valid. The verified scope is '+p.scope+'.');
  } catch(error){if(current!==serial)return;report(error.name==='AbortError'?'Verification timed out. Try again when the connection is stable.':error instanceof TypeError?'Cannot reach verification. Check your connection and try again.':error.message,true);}
  finally{clearTimeout(timer);}
 }
 document.getElementById('certificate-verify').addEventListener('click',verify);
 tokenInput.addEventListener('input',function(){clear();report('Proof changed. Verify it before printing.');});
 fileInput.addEventListener('change',async function(){
  clear();var current=serial,file=fileInput.files[0];if(!file)return;
  try{if(file.size>20000)throw new Error('Choose a signed certificate JSON file smaller than 20 KB.');var proof=JSON.parse(await file.text());if(current!==serial)return;if(!proof||typeof proof!=='object'||Array.isArray(proof)||proof.type!=='excel-sprint-certificate'||proof.version!==1||typeof proof.certificateToken!=='string'||proof.certificateToken.length>10000)throw new Error('This file is not a signed Excel Sprint certificate proof.');tokenInput.value=proof.certificateToken;await verify();}
  catch(error){if(current===serial)report(error instanceof SyntaxError?'The selected file is not valid JSON.':error.message,true);}
 });
 print.addEventListener('click',function(){if(verifiedToken&&!card.hidden)window.print();});
 copy.addEventListener('click',async function(){if(!verifiedToken)return;var current=serial,token=verifiedToken,link=location.origin+location.pathname+'#proof='+encodeURIComponent(token);try{await navigator.clipboard.writeText(link);if(current!==serial||token!==verifiedToken)return;report('Verification link copied. It contains the learner name in the signed proof.');}catch(_){if(current!==serial||token!==verifiedToken)return;tokenInput.focus();tokenInput.select();report('Clipboard is unavailable. Copy the selected token and share it with this verification page.');}});
 function fromHash(){clear();var params=new URLSearchParams(location.hash.slice(1)),proof=params.get('proof');if(proof){tokenInput.value=proof;verify();}else{tokenInput.value='';report('No certificate verified yet.');}}
 window.addEventListener('hashchange',fromHash);fromHash();
})();
