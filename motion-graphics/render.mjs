// Renders every composition to out/<id>.mp4 at 3840x2160 (scale 2), plus a poster still per clip.
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const FFDIR = path.resolve('node_modules/@remotion/compositor-linux-x64-gnu');
// ProRes 4444 at 4K is ~10 MB/s; re-wrap as lossless PNG-in-MOV (keeps alpha, ~4x smaller).
const toPngMov = (src, dst) => {
  execFileSync(path.join(FFDIR, 'ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-c:v', 'png', '-pix_fmt', 'rgba', dst], {
    env: {...process.env, LD_LIBRARY_PATH: FFDIR},
  });
  fs.rmSync(src);
};

const only = process.argv.slice(2);
const stillsOnly = process.env.STILLS_ONLY === '1';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl)).filter((c) => !only.length || only.some((o) => c.id.startsWith(o)));
fs.mkdirSync('out/posters', {recursive: true});
for (const c of comps) {
  const t = Date.now();
  await renderStill({composition: c, serveUrl, output: `out/posters/${c.id}.${c.id.endsWith('-ALPHA') ? 'png' : 'jpg'}`, frame: c.durationInFrames - 1, scale: 0.5, ...(c.id.endsWith('-ALPHA') ? {imageFormat: 'png'} : {imageFormat: 'jpeg', jpegQuality: 85})});
  const alpha = c.id.endsWith('-ALPHA');
  if (!stillsOnly && alpha) {
    await renderMedia({composition: c, serveUrl, codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le', imageFormat: 'png', scale: 2, outputLocation: `out/${c.id}.prores.mov`, concurrency: 4});
    toPngMov(`out/${c.id}.prores.mov`, `out/${c.id}.mov`);
  } else if (!stillsOnly) {
    await renderMedia({composition: c, serveUrl, codec: 'h264', crf: 16, scale: 2, pixelFormat: 'yuv420p', outputLocation: `out/${c.id}.mp4`, concurrency: 4});
  }
  console.log(`${c.id} done in ${((Date.now() - t) / 1000).toFixed(1)}s`);
}
