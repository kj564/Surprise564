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

if (!source.includes('grid-template-columns: repeat(9, minmax(38px, 52px))') ||
    !source.includes('grid-template-columns: repeat(6, minmax(34px, 1fr))')) {
  fail('Inventory grid must use nine Bedrock-style columns on desktop and a compact six-column layout on mobile');
} else pass('Inventory grid matches Bedrock-style desktop and mobile column layouts');

if (source.includes('#vcGuide .vc-actions { display: grid; grid-template-columns: 1fr; gap: 7px; }')) {
  pass('Behavior Pack ActionForm buttons use the native vertical list layout');
} else {
  fail('Behavior Pack ActionForm buttons must use the native vertical list layout');
}

if (source.includes('class="hud-brand">VoxelCraft') && source.includes('Overworld') && source.includes('browserBlocksBroken')) {
  pass('Browser HUD mirrors the Behavior Pack action bar with dimension, coordinates, time, and session stats');
} else {
  fail('Browser HUD should mirror the Behavior Pack action-bar layout');
}

if (!source.includes("@font-face") ||
    !source.includes("font-family: 'Minecraft Ten'") ||
    !source.includes("./VoxelCraft/font/minecraft-ten.ttf")) {
  fail('Browser UI must use the original Bedrock Minecraft Ten font');
} else pass('Browser UI references the original Bedrock Minecraft Ten font');

if (!source.includes('const clockMinutes = Math.floor((((worldTime % 1) + 1) % 1) * 1440);') ||
    !source.includes("padStart(2, '0')")) {
  fail('Browser HUD must show a live HH:mm clock like the Behavior Pack action bar');
} else pass('Browser HUD shows a live HH:mm clock like the Behavior Pack action bar');

if (source.includes('id="pauseOverlay"') && source.includes('id="resumeGameButton"') &&
    source.includes('function syncMenuVisibility()') && source.includes('gameStarted && locked && !inventoryOpen && !vcGuideOpen')) {
  pass('Bedrock-style pause screen is distinct from the title menu and pauses gameplay systems');
} else {
  fail('Pause screen must be separate from the title menu and pause gameplay systems');
}

if (source.includes('data-inv-filter="all"') && source.includes('data-inv-filter="nature"') &&
    source.includes('data-inv-filter="building"') && source.includes('data-inv-filter="minerals"') &&
    source.includes('function buildInventory(filter = activeInventoryFilter)')) {
  pass('Inventory UI has working category tabs for all blocks, nature, building, and minerals');
} else {
  fail('Inventory category tabs must filter the browser block catalog');
}

const vanillaUiTextures = [
  'menubackground',
  'background_panel', 'background_with_border', 'button_borderless_dark',
  'button_borderless_darkhover', 'button_borderless_darkpressed',
  'dialog_background_opaque', 'highlight_slot', 'hotbar_start_cap', 'hotbar_end_cap', 'cancel', 'inventory_icon',
  'hud_tip_text_background', 'item_cell',
];
for (const texture of vanillaUiTextures) {
  if (!source.includes(`./VoxelCraft/textures/ui/${texture}.png`)) {
    fail(`Browser UI must use the staged vanilla Bedrock texture: ${texture}.png`);
  }
}
if (vanillaUiTextures.every(texture => source.includes(`./VoxelCraft/textures/ui/${texture}.png`))) {
  pass(`Browser UI references all ${vanillaUiTextures.length} original Bedrock UI textures`);
}

if (source.includes('width: 40px;\n    height: 44px;') && source.includes('width: min(10vw, 38px); height: min(11vw, 42px);')) {
  pass('Hotbar slot proportions follow the original Bedrock HUD grid at desktop and mobile scales');
} else {
  fail('Hotbar slot proportions must follow the original Bedrock HUD grid at desktop and mobile scales');
}

if (source.includes('scaleX(1.2) scaleY(1.09)')) {
  pass('Selected hotbar slot follows the original Bedrock 24x24 highlight proportions');
} else {
  fail('Selected hotbar slot must follow the original Bedrock 24x24 highlight proportions');
}

const inventoryTabIcons = ['apple', 'brick', 'diamond'];
for (const icon of inventoryTabIcons) {
  if (!source.includes(`./VoxelCraft/textures/items/${icon}.png`)) {
    fail(`Inventory category tab must use the original resource-pack icon: ${icon}.png`);
  }
}
if (inventoryTabIcons.every(icon => source.includes(`./VoxelCraft/textures/items/${icon}.png`)) &&
    source.includes('button[data-inv-filter="all"]::before') &&
    source.includes("textures/ui/inventory_icon.png")) {
  pass('Inventory category tabs use original resource-pack icons for all, nature, building, and minerals');
}

const behaviorPackMenuActions = ['kit', 'heal', 'fly', 'day', 'night', 'weather', 'stats', 'close'];
for (const action of behaviorPackMenuActions) {
  if (!source.includes(`data-vc-action="${action}"`)) {
    fail(`VoxelCraft guide menu is missing action: ${action}`);
  }
}
if (behaviorPackMenuActions.every(action => source.includes(`data-vc-action="${action}"`)) &&
    source.includes("e.code === 'KeyG'") && source.includes("function openVcGuide()")) {
  pass('VoxelCraft guide matches the Behavior Pack action list and keeps the G shortcut');
}

const behaviorPackMenuIcons = ['book_writable', 'apple', 'feather', 'clock_item', 'bed_red', 'compass_item', 'book_normal'];
for (const icon of behaviorPackMenuIcons) {
  if (!source.includes(`./VoxelCraft/textures/items/${icon}.png`)) {
    fail(`Behavior Pack menu icon must use the staged original item texture: ${icon}.png`);
  }
}
if (behaviorPackMenuIcons.every(icon => source.includes(`./VoxelCraft/textures/items/${icon}.png`))) {
  pass(`Browser Behavior Pack menu references all ${behaviorPackMenuIcons.length} original item icons`);
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
