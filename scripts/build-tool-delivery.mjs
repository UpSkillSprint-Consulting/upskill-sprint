import {readFile,writeFile,readdir,mkdir,rm} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
import {TOOLS,assetTool} from '../content/tool-catalog.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const storage=source=>source.replace(/\blocalStorage\b/g,'ToolLocalStorage').replace(/\bsessionStorage\b/g,'ToolSessionStorage')
  .replace(/\blocation\.origin\b/g,'new URL(document.baseURI).origin');
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
function shell(key,tool) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escape(tool.name)} | UpSkill Sprint</title><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/tool-access.css"><script src="/theme.js"></script><script src="/supabase-config.js"></script><script src="/vendor/supabase.js"></script><script src="/auth.js"></script><script defer src="/tool-access-loader.js"></script></head><body data-tool-shell="${key}"><section id="tool-access-status" class="tool-access-status" role="status" aria-live="polite"><p class="eyebrow">Engineering tools</p><h1>${escape(tool.name)}</h1><p>Checking your tool access…</p><a href="/engineering-tools#${tool.card}">Back to Engineering Tools</a></section><noscript>Enable JavaScript and sign in to open your assigned tools.</noscript><div id="tool-access-content"></div></body></html>`;
}
export async function buildToolDelivery(root=ROOT) {
  const output=join(root,'content/tool-delivery-generated');
  await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
  const names=await readdir(join(root,'tools')), sizes={};
  for(const [key,tool] of Object.entries(TOOLS)) {
    let html=await readFile(join(root,tool.page),'utf8');
    // Gate before delivering the full document. The iframe contains only the
    // authorized package and is discarded on account changes/revocation.
    html=html.replace(/ data-require-auth| data-required-access="[^"]*"| data-access-resource="[^"]*"/g,'');
    html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(_tag,attrs,code)=>'<script'+attrs+'>'+storage(code)+'</script>');
    const assets={};
    for(const name of names) {
      const path='tools/'+name;
      if(assetTool(path)!==key)continue;
      const type=name.endsWith('.js')?'text/javascript':'text/css';
      const source=await readFile(join(root,path),'utf8');
      assets['/'+path]={type,source:type==='text/javascript'?storage(source):source};
    }
    const all=html+'\n'+Object.values(assets).map(a=>a.source).join('\n');
    for(const match of all.matchAll(/\/tools\/[\w.-]+\.(?:js|css)/g)) {
      if(assetTool(match[0]) && !assets[match[0]])throw new Error('Cross-tool or missing private asset: '+match[0]);
    }
    const packet=JSON.stringify({version:1,tool:key,html,assets});
    // The lookup's source HTML is over 8 MB; gzip keeps each authorized response
    // below the buffered function ceiling without extra database reads or libraries.
    const envelope=JSON.stringify({version:1,tool:key,encoding:'gzip',data:gzipSync(packet).toString('base64')});
    if(Buffer.byteLength(envelope)>5_500_000)throw new Error(key+' exceeds the protected delivery budget');
    sizes[key]={uncompressed:Buffer.byteLength(packet),response:Buffer.byteLength(envelope)};
    await writeFile(join(output,key+'.json'),envelope);
    await mkdir(dirname(join(root,'public-site',tool.page)),{recursive:true});
    await writeFile(join(root,'public-site',tool.page),shell(key,tool));
  }
  console.log('Protected tool packages (bytes):',JSON.stringify(sizes));
  return {sizes,output};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildToolDelivery();
