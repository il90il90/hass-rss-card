/** Strict static checks for hass-rss-card preset layouts and timestamps. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src', 'hass-rss-card.ts'), 'utf8');
const built = readFileSync(
  join(root, 'custom_components', 'hass_rss', 'frontend', 'hass-rss-card.js'),
  'utf8',
);
const presetUtil = readFileSync(
  join(root, 'src', 'utils', 'preset-display.ts'),
  'utf8',
);

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function assertContains(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`${label}: missing '${needle}'`);
  }
}

function assertRegex(text, pattern, label) {
  if (!pattern.test(text)) {
    fail(`${label}: pattern not found`);
  }
}

const presets = ['ticker', 'list', 'card', 'magazine'];
for (const preset of presets) {
  assertContains(src, `case '${preset}':`, `preset switch (${preset})`);
  assertContains(built, preset, `built bundle mentions preset '${preset}'`);
}
assertContains(src, '_renderCompact', 'compact preset renderer');
assertContains(built, 'compact-item', 'compact layout in bundle');

const layoutMarkers = {
  compact: 'compact-item',
  ticker: 'ticker-wrap',
  list: 'list-items',
  card: 'card-item',
  magazine: 'magazine-item',
};
for (const [preset, marker] of Object.entries(layoutMarkers)) {
  assertContains(src, marker, `layout marker for ${preset}`);
  assertContains(built, marker, `built layout marker for ${preset}`);
}

assertContains(src, 'last-updated', 'feed last updated row');
assertContains(src, '_renderLastUpdated', 'last updated renderer');
assertContains(src, '_renderRelativeTime', 'article published renderer');
assertContains(built, 'last-updated', 'built last updated class');

for (const method of [
  '_renderCompactItem',
  '_renderTicker',
  '_renderList',
  '_renderCard',
  '_renderMagazine',
]) {
  assertContains(src, method, `render method ${method}`);
}

assertRegex(
  src,
  /_renderList\([\s\S]*?_renderRelativeTime\(item\.published\)/,
  'list preset shows article time',
);
assertRegex(
  src,
  /_renderCard\([\s\S]*?_renderRelativeTime\(item\.published\)/,
  'card preset shows article time',
);
assertRegex(
  src,
  /_renderMagazine\([\s\S]*?_renderRelativeTime\(item\.published\)/,
  'magazine preset shows article time',
);
assertRegex(
  src,
  /_renderTicker\([\s\S]*?_renderRelativeTime\(item\.published\)/,
  'ticker preset shows article time',
);
assertRegex(
  src,
  /_renderCompactItem\([\s\S]*?_renderRelativeTime\(item\.published\)/,
  'compact preset shows article time',
);

assertContains(src, 'resolvePresetDisplay', 'preset display resolver');
for (const preset of ['card', 'list', 'magazine']) {
  assertContains(presetUtil, `${preset}:`, `preset defaults for ${preset}`);
}

assertContains(src, 'preset-${preset}', 'preset CSS class on ha-card');
assertContains(built, 'preset-', 'built preset CSS class prefix');

assertRegex(
  src,
  /_renderMagazine\([\s\S]*?this\._normalizeIndex\(items\)/,
  'magazine uses carousel index',
);

if (src.includes("preset === 'list' || preset === 'magazine'")) {
  fail('magazine should support auto-advance (remove magazine from block list)');
}

assertContains(src, 'class="list-row"', 'list distinct row layout');
assertContains(src, 'class="card-row"', 'card distinct row layout');
assertContains(src, 'magazine-meta', 'magazine meta row');

console.log('PASS: card preset static checks (source + built bundle)');
