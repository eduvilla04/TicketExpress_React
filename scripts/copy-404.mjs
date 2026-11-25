import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');
const fallback = join(dist, '404.html');

if (existsSync(index)) {
  copyFileSync(index, fallback);
  console.log('404.html generado para GitHub Pages');
} else {
  console.error('No se encontró dist/index.html');
  process.exitCode = 1;
}
