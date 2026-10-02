import {createHash} from 'node:crypto';
export function randomFor(id) {
 let state=createHash('sha256').update('excel-sprint-v1:'+id).digest().readUInt32LE();
 return {int(min,max){state=(Math.imul(state,1664525)+1013904223)>>>0;return min+Math.floor(state/4294967296*(max-min+1));}};
}
export function workbookFingerprint(p) {
 const {id,title,scenario,columns,rows,parameters,tasks,bonus,sheets=[]}=p;
 return createHash('sha256').update(JSON.stringify({id,title,scenario,columns,rows,parameters,tasks,bonus,sheets})).digest('hex');
}
