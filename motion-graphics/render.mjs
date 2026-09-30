// Renders every composition to out/<id>.mp4 at 3840x2160 (scale 2), plus a poster still per clip.
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const only = process.argv.slice(2);
const stillsOnly = process.env.STILLS_ONLY === '1';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl)).filter((c) => !only.length || only.some((o) => c.id.startsWith(o)));
fs.mkdirSync('out/posters', {recursive: true});
for (const c of comps) {
  const t = Date.now();
  await renderStill({composition: c, serveUrl, output: `out/posters/${c.id}.jpg`, frame: c.durationInFrames - 1, scale: 0.5, imageFormat: 'jpeg', jpegQuality: 85});
  if (!stillsOnly) {
    await renderMedia({composition: c, serveUrl, codec: 'h264', crf: 16, scale: 2, pixelFormat: 'yuv420p', outputLocation: `out/${c.id}.mp4`, concurrency: 4});
  }
  console.log(`${c.id} done in ${((Date.now() - t) / 1000).toFixed(1)}s`);
}
