import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  let file = join(root, safePath);
  try {
    const details = await stat(file);
    if (details.isDirectory()) file = join(file, 'index.html');
    await stat(file);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(4399, '127.0.0.1');
