#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const gamePath = resolve('public/minecraft.html');
const source = readFileSync(gamePath, 'utf8');
const failures = [];
const pass = (message) => console.log('✓ ' + message);
const fail = (message) => failures.push(message);

function section(pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error('Could not parse ' + label + ' from public/minecraft.html');
  return match[1];
}

const tileSource = section(/const TILE = \{([\s\S]*?)\n    \};/, 'TILE');
const tileEntries = [...tileSource.matchAll(/\b([A-Z][A-Z0-9_]*):\s*(\d+)/g)];
const tiles = new Map(tileEntries.map(([, name, index]) => [name, Number(index)]));
const textureSource = section(/const TEXTURE_FILES = \[([\s\S]*?)\n    \];/, 'TEXTURE_FILES');
const textures = [...textureSource.matchAll(/'([^']+)'/g)].map(([, name]) => name);
const blockSource = section(/const BLOCKS = \{([\s\S]*?)\n    \};/, 'BLOCKS');
const blockEntries = [...blockSource.matchAll(/^\s*(\d+):\s*(null|\{[^\\n]*\})/gm)];
const blocks = new Map(blockEntries.map(([, id, definition]) => [Number(id), definition]));

if (!tiles.size) fail('TILE table is empty');
else pass(`Parsed ${tiles.size} texture tile definitions`);

const tileIndices = [...tiles.values()];
if (new Set(tileIndices).size !== tileIndices.length) fail('TILE contains duplicate indices');
else pass('Texture tile indices are unique');
const expectedIndices = Array.from({ length: tileIndices.length }, (_, i) => i);
if ([...tileIndices].sort((a, b) => a - b).some((value, i) => value !== expectedIndices[i])) {
  fail('TILE indices must be contiguous from 0');
} else pass('Texture tile indices are contiguous from 0');

if (textures.length !== tiles.size) fail(`TILE/TEXTURE_FILES count mismatch: ${tiles.size} vs ${textures.length}`);
else pass('TILE and TEXTURE_FILES have matching lengths');

for (const [name, index] of tiles) {
  if (index >= textures.length) fail(`Tile ${name} points outside TEXTURE_FILES (index ${index})`);
  if (textures[index] === undefined) fail(`Missing texture entry for tile ${name}`);
}
if (textures.length <= 16 * 6) pass(`Atlas capacity valid (${textures.length}/96 tiles)`);
else fail(`Atlas capacity exceeded (${textures.length}/96 tiles)`);

if (blocks.size < 2 || blocks.get(0) !== 'null') fail('Block ID 0 must be null (air)');
else pass(`Parsed ${blocks.size} block IDs; ID 0 is air`);
const blockIds = [...blocks.keys()].sort((a, b) => a - b);
if (blockIds.some((id, i) => id !== i)) fail('Block IDs must be contiguous from 0');
else pass('Block IDs are contiguous from 0');

for (const [id, definition] of blocks) {
  if (definition === 'null') continue;
  for (const [, tileName] of definition.matchAll(/TILE\.([A-Z][A-Z0-9_]*)/g)) {
    if (!tiles.has(tileName)) fail(`Block ${id} references undefined TILE.${tileName}`);
  }
  for (const field of ['name:', 'top:', 'bottom:', 'side:']) {
    if (!definition.includes(field)) fail(`Block ${id} is missing required ${field.slice(0, -1)} field`);
  }
}
if (!failures.some(message => message.startsWith('Block '))) pass('Every block texture reference resolves to a known tile');

if (!source.includes('saved.version === 1')) fail('World save loader must validate the save schema version');
else pass('World save loader validates schema version');
if (!source.includes('Number.isFinite')) fail('World coordinate APIs must reject non-finite coordinates');
else pass('World coordinate APIs guard non-finite coordinates');
if (!source.includes('!Object.prototype.hasOwnProperty.call(BLOCKS, v)')) fail('World.setBlock must reject unknown block IDs');
else pass('World.setBlock rejects unknown block IDs');

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s):`);
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else {
  console.log('\nVoxelCraft foundation checks passed.');
}
