import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
const root=new URL('../', import.meta.url).pathname;
const output=join(root,'public/images/optimized');await mkdir(output,{recursive:true});
const manifest={};let before=0,after=0;
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const file=join(dir,item.name);if(item.isDirectory()){if(item.name!=='optimized')await walk(file);continue;}if(!/\.(jpg|jpeg|png)$/i.test(file))continue;const key='/'+relative(join(root,'public'),file);const meta=await sharp(file).metadata();const id=relative(join(root,'public/images'),file).replace(/[^a-zA-Z0-9.-]/g,'-').replace(/\.[^.]+$/,'');const widths=[...new Set([Math.min(480,meta.width),Math.min(960,meta.width),Math.min(1600,meta.width)])];const variants=[];for(const width of widths){const name=`${id}-${width}.webp`;await sharp(file).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(join(output,name));variants.push({src:'/images/optimized/'+name,width});}manifest[key]={width:meta.width,height:meta.height,src:variants.at(-1).src,srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', ')};before+=(await stat(file)).size;after+=(await stat(join(root,'public',variants.at(-1).src))).size;}}
await walk(join(root,'public/images'));await writeFile(join(root,'src/data/image-manifest.json'),JSON.stringify(manifest));console.log(JSON.stringify({images:Object.keys(manifest).length,originalBytes:before,largestVariantBytes:after}));
