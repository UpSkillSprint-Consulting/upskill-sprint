// Isolated, read-only reproduction of the Netlify edge-delivered test bank.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const port = Number(process.env.PORT || 8765);
const types = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.json':'application/json'};
const edge = (await import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
http.createServer(async (request, response) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); return response.end(); }
    const route = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (['/test-bank','/test-bank/','/test-bank.html'].includes(route)) {
      const result = await edge(new Request('https://upskillsprint.com/test-bank'), {
        next: async () => new Response(fs.readFileSync('test-bank.html', 'utf8'), {headers:{'content-type':'text/html'}})
      });
      response.writeHead(result.status, {'content-type':'text/html; charset=utf-8'});
      return response.end(request.method === 'HEAD' ? '' : await result.text());
    }
    let file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403); return response.end(); }
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); return response.end('Not found'); }
    response.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
    if (request.method === 'HEAD') response.end(); else fs.createReadStream(file).pipe(response);
  } catch (error) { response.writeHead(500); response.end(String(error)); }
}).listen(port, '127.0.0.1', () => console.log(`Student audit server: http://127.0.0.1:${port}`));
