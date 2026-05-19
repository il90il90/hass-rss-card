import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'dist', 'hass-rss-card.js');
const targetDir = join(root, 'custom_components', 'hass_rss', 'frontend');
const target = join(targetDir, 'hass-rss-card.js');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
console.log(`Copied card to ${target}`);
