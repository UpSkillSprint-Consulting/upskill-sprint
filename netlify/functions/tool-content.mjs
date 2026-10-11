import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {TOOLS} from '../../content/tool-catalog.mjs';
import {settings} from './exam-content.mjs';

const HEADERS={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store, max-age=0',
  'CDN-Cache-Control':'no-store','Netlify-CDN-Cache-Control':'no-store','Vary':'Authorization','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'};
const reply=(status,message)=>new Response(JSON.stringify({message}),{status,headers:HEADERS});
export function createHandler({getSettings=settings,request=fetch,
  loadPackage=tool=>readFile(join(process.cwd(),'content/tool-delivery-generated',tool+'.json'),'utf8')}={}) {
  return async req=>{
    if(req.method!=='GET')return reply(405,'Use GET to open a tool.');
    const params=new URL(req.url).searchParams,tool=params.get('tool');
    if(!Object.hasOwn(TOOLS,tool)||params.getAll('tool').length!==1)return reply(404,'This tool is not available.');
    if([...params.keys()].some(k=>!['tool','check'].includes(k))||params.getAll('check').length>1||params.has('check')&&params.get('check')!=='1')return reply(400,'Invalid tool request.');
    const token=req.headers.get('authorization');
    if(!token||token.length>8192||!/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token))return reply(401,'Sign in to open this tool.');
    const config=getSettings();if(!config)return reply(503,'Tool access is temporarily unavailable.');
    try {
      const decision=await request(config.url+'/rest/v1/rpc/can_access_tool',{
        method:'POST',headers:{apikey:config.key,Authorization:token,'Content-Type':'application/json'},
        body:JSON.stringify({requested_tool_key:tool}),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(8000)
      });
      if(decision.status===401)return reply(401,'Your sign-in has expired.');
      if(!decision.ok)return reply(503,'Tool access is temporarily unavailable.');
      const allowed=await decision.json();
      if(allowed===false)return reply(403,'This tool is locked. Ask an administrator to grant access.');
      if(allowed!==true)return reply(503,'Tool access is temporarily unavailable.');
      if(params.get('check')==='1')return new Response(JSON.stringify({allowed:true,tool}),{headers:HEADERS});
      return new Response(await loadPackage(tool),{headers:HEADERS});
    }catch{return reply(503,'Tool access is temporarily unavailable.');}
  };
}
export default createHandler();
