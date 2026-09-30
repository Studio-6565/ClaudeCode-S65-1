// Exports one 4K still per graphic to out/stills/<id>.png (transparent for -ALPHA overlays).
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

// Frames that read better as a still than the final frame.
const pick = {
  'B23-PersonProductMorph': 125,
  'B28-PhonePortalBezel-ALPHA': 20,
};
const skip = new Set(['B29-PhonePortalMatte-ALPHA']);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl)).filter((c) => !skip.has(c.id));
fs.mkdirSync('out/stills', {recursive: true});
for (const c of comps) {
  await renderStill({composition: c, serveUrl, output: `out/stills/${c.id}.png`, frame: pick[c.id] ?? c.durationInFrames - 1, scale: 2, imageFormat: 'png'});
  console.log(c.id);
}
