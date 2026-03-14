import fs from 'fs';
import path from 'path';

const src = 'assets/eevolution-2-electrical-engineering-logo.png';
const dest = 'public/logo.png';

try {
  fs.copyFileSync(src, dest);
  console.log(`Successfully copied ${src} to ${dest}`);
} catch (err) {
  console.error('Error copying file:', err);
  process.exit(1);
}
