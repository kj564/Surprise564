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
const declaredTileIndices = tileEntries.map(([, , index]) => Number(index));
const textureSource = section(/const TEXTURE_FILES = \[([\s\S]*?)\n    \];/, 'TEXTURE_FILES');
const textures = [...textureSource.matchAll(/'([^']+)'/g)].map(([, name]) => name);
const blockSource = section(/const BLOCKS = \{([\s\S]*?)\n    \};/, 'BLOCKS');
const blockEntries = [...blockSource.matchAll(/^\s*(\d+):\s*(null|\{[^\n]*\})/gm)];
const blocks = new Map(blockEntries.map(([, id, definition]) => [Number(id), definition]));

if (!source.includes('Overworld <span class="hud-separator">|</span> XYZ:') || !source.includes('Math.floor(worldTime * 1440)')) {
  fail('HUD should show Bedrock-style dimension, integer coordinates, and in-game clock');
} else {
  pass('HUD shows Bedrock-style dimension, coordinates, and in-game clock');
}

if (!source.includes("font-family: 'Minecraft Ten'") || !source.includes("./VoxelCraft/font/minecraft-ten.ttf")) {
  fail('Browser UI must use the original Bedrock Minecraft Ten font');
} else {
  pass('Browser UI references the original Bedrock Minecraft Ten font');
}

const vanillaUiTextures = [
  'background_panel', 'background_with_border', 'button_borderless_dark',
  'button_borderless_darkhover', 'button_borderless_darkpressed',
  'dialog_background_opaque', 'highlight_slot', 'hotbar_start_cap', 'hotbar_end_cap',
  'hotbar_0', 'hotbar_8',
  'hud_tip_text_background', 'item_cell', 'inventory_icon',
];
for (const texture of vanillaUiTextures) {
  if (!source.includes(`./VoxelCraft/textures/ui/${texture}.png`)) {
    fail(`Browser UI must use the staged vanilla Bedrock texture: ${texture}.png`);
  }
}
if (vanillaUiTextures.every(texture => source.includes(`./VoxelCraft/textures/ui/${texture}.png`))) {
  pass(`Browser UI references all ${vanillaUiTextures.length} original Bedrock UI textures`);
}

if (!tiles.size) fail('TILE table is empty');
else pass(`Parsed ${tiles.size} texture tile definitions`);

const tileIndices = [...tiles.values()];
if (new Set(tileIndices).size !== tileIndices.length) fail('TILE contains duplicate indices');
else pass('Texture tile indices are unique');
const expectedIndices = Array.from({ length: tileIndices.length }, (_, i) => i);
if ([...tileIndices].sort((a, b) => a - b).some((value, i) => value !== expectedIndices[i])) {
  fail('TILE indices must be contiguous from 0');
} else pass('Texture tile indices are contiguous from 0');
if (declaredTileIndices.some((value, i) => value !== i)) {
  fail('TILE declaration order must match TEXTURE_FILES array positions');
} else pass('TILE declaration order matches TEXTURE_FILES array positions');

if (textures.length !== tiles.size) fail(`TILE/TEXTURE_FILES count mismatch: ${tiles.size} vs ${textures.length}`);
else pass('TILE and TEXTURE_FILES have matching lengths');
if (new Set(textures).size !== textures.length) fail('TEXTURE_FILES contains duplicate texture names');
else pass('Texture source names are unique');

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
  for (const field of ['name:', 'top:', 'bottom:', 'side:', 'solid:']) {
    if (!definition.includes(field)) fail(`Block ${id} is missing required ${field.slice(0, -1)} field`);
  }
  const referencedTiles = [...definition.matchAll(/TILE\.([A-Z][A-Z0-9_]*)/g)].map(([, name]) => name);
  const usesOpaqueLeafTexture = referencedTiles.some(name => {
    const index = tiles.get(name);
    return index !== undefined && /leaves_.*_opaque/.test(textures[index] || '');
  });
  if (usesOpaqueLeafTexture && /transparent:\s*true/.test(definition)) {
    fail(`Block ${id} uses an opaque leaf texture but is configured as translucent`);
  }
}
if (!failures.some(message => message.startsWith('Block '))) pass('Every block texture reference resolves to a known tile');

if (!source.includes('saved.version === 1')) fail('World save loader must validate the save schema version');
else pass('World save loader validates schema version');
if (!source.includes('Number.isFinite')) fail('World coordinate APIs must reject non-finite coordinates');
else pass('World coordinate APIs guard non-finite coordinates');
if (!source.includes('!Number.isSafeInteger(x) || !Number.isSafeInteger(z)')) fail('World coordinate APIs must reject unsafe integer coordinates');
else pass('World coordinate APIs reject unsafe integer coordinates');
if (!source.includes('!Object.prototype.hasOwnProperty.call(BLOCKS, v)')) fail('World.setBlock must reject unknown block IDs');
else pass('World.setBlock rejects unknown block IDs');
if (!source.includes('invalidateChunk(cx - 1, cz)') ||
    !source.includes('invalidateChunk(cx + 1, cz)') ||
    !source.includes('invalidateChunk(cx, cz - 1)') ||
    !source.includes('invalidateChunk(cx, cz + 1)')) {
  fail('World.setBlock must invalidate loaded neighbors at all four horizontal chunk boundaries');
} else pass('Block edits invalidate loaded chunks across all four horizontal boundaries');

if (!source.includes('const epsilon = 1e-7')) fail('Player AABB collision must tolerate exact voxel-face contact');
else pass('Player collision ignores zero-area contact at voxel faces');
if (!source.includes('existing !== 0 && existing !== 19') ||
    !source.includes('if (!world.setBlock(px, py, pz, id)) return;')) {
  fail('Block placement must only replace air/water and must honor setBlock validation');
} else pass('Block placement cannot overwrite occupied voxels and honors world bounds');
if (!source.includes('if (!id || !world.setBlock(hit.x, hit.y, hit.z, 0)) return;')) {
  fail('Block breaking must honor the world mutation result');
} else pass('Block breaking stops when the world rejects a mutation');

if (!source.includes('if (!Number.isFinite(maxDist) || maxDist < 0) return null;') ||
    !source.includes('if (!Number.isFinite(nextDist) || nextDist > maxDist) return null;')) {
  fail('Voxel raycast must reject invalid reach and stop before entering a voxel beyond max distance');
} else pass('Voxel raycast validates reach and enforces the maximum interaction distance');

if (!source.includes("const sprint = keys['ShiftLeft'] && !player.fly;") ||
    !source.includes('player.speed * (sprint ? 1.5 : 1)')) {
  fail('Holding left Shift on the ground must enable sprint speed without changing flight controls');
} else pass('Ground sprint increases movement speed while flight speed remains independent');

if (!source.includes('const maxStep = 0.25;') ||
    !source.includes('Math.ceil(Math.abs(dy) / maxStep)') ||
    !source.includes('for (let i = 0; i < ySteps; i++)')) {
  fail('Player movement must use bounded vertical collision substeps to prevent tunneling');
} else pass('Player vertical movement uses collision substeps to prevent tunneling through blocks');

if (!source.includes("if (e.code === 'Space' && !e.repeat && !wasDown)")) {
  fail('Space double-tap flight toggle must ignore key-repeat events');
} else pass('Holding Space cannot trigger repeated flight-mode toggles from keyboard repeat');

for (const key of ['KeyK', 'KeyE', 'KeyT']) {
  if (!source.includes(`if (e.code === '${key}' && !e.repeat && !wasDown)`)) {
    fail(`${key} one-shot action must ignore keyboard repeat events`);
  }
}
if (['KeyK', 'KeyE', 'KeyT'].every(key => source.includes(`if (e.code === '${key}' && !e.repeat && !wasDown)`))) {
  pass('Save, inventory toggle, and time advance trigger once per key press');
}

if (!source.includes('function clearPressedKeys()') ||
    !source.includes('if (!locked) clearPressedKeys();') ||
    !source.includes("window.addEventListener('blur', clearPressedKeys);") ||
    !source.includes('lastSpaceTime = 0;')) {
  fail('Pressed keys and the Space double-tap timer must reset when focus or pointer lock is lost');
} else pass('Input state resets on focus loss and pointer-lock exit');

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s):`);
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else {
  console.log('\nVoxelCraft foundation checks passed.');
}
