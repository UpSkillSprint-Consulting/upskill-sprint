import {readFile,access} from 'node:fs/promises';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {TOOLS} from '../content/tool-catalog.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export async function auditToolPublicContent(root=ROOT){
  for(const [key,tool] of Object.entries(TOOLS)){
    const page=await readFile(join(root,'public-site',tool.page),'utf8');
    if(!page.includes('data-tool-shell="'+key+'"')||page.length>8000||/SPEC_DATA|MaterialCheckerEngine|spx-tool/.test(page))throw new Error('Tool application leaked into shell: '+key);
    const envelope=JSON.parse(await readFile(join(root,'content/tool-delivery-generated',key+'.json'),'utf8'));
    const {gunzipSync}=await import('node:zlib');
    const packet=JSON.parse(gunzipSync(Buffer.from(envelope.data,'base64')));
    for(const path of Object.keys(packet.assets)){
      let exists=true;try{await access(join(root,'public-site',path.slice(1)));}catch{exists=false;}
      if(exists)throw new Error('Private tool asset staged: '+path);
    }
  }
  console.log('Tool public-content scan: 3 clean shells; protected runtime assets excluded.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await auditToolPublicContent();
