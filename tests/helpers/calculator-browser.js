const fs=require('node:fs');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
function setup(options={}){
 const html=fs.readFileSync('tools/engineering-statistics-calculator.html','utf8');
 const dom=new JSDOM(html,{url:'https://calculator.test/tools/engineering-statistics-calculator',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.Blob=Blob;w.DecompressionStream=DecompressionStream;w.TextDecoder=TextDecoder;w.TextEncoder=TextEncoder;
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:s=>({width:String(s).length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
 class Worker {
  constructor(){const self={postMessage:data=>queueMicrotask(()=>this.onmessage?.({data}))};this.context=vm.createContext({console,self,setTimeout,clearTimeout});this.context.importScripts=file=>vm.runInContext(fs.readFileSync('tools/calculator-assets/'+file,'utf8'),this.context);vm.runInContext(fs.readFileSync('tools/calculator-assets/advanced-worker.js','utf8'),this.context);}
  postMessage(data){this.context.data=data;vm.runInContext('self.onmessage({data})',this.context);}
  terminate(){}
 }
 w.Worker=Worker;
 w.CSS = {escape:s=>String(s).replace(/[^a-zA-Z0-9_-]/g,'\\$&')};
 w.fetch=async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('.'+url,'utf8'))});
 const ctx=dom.getInternalVMContext();
 for(const script of w.document.scripts){const src=script.getAttribute('src');if(options.beforeScript)options.beforeScript(src,w);if(src?.startsWith('/tools/calculator-assets/')||src==='/test-bank-tables.js')vm.runInContext(fs.readFileSync('.'+src,'utf8'),ctx);else if(!src)vm.runInContext(script.textContent,ctx);}
 return {dom,w,d:w.document};
}
module.exports={setup};
