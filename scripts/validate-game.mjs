#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
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

const uiPanelSource = section(/(\/\* === UI pass: consistent Bedrock-style layout, readable hierarchy, responsive sizing === \*\/[\s\S]*?<\/style>)/, 'final UI layer');
function lastCssRule(selector) {
  const ruleStart = uiPanelSource.lastIndexOf(selector + ' {');
  if (ruleStart < 0) return '';
  const bodyStart = ruleStart + selector.length + 2;
  const bodyEnd = uiPanelSource.indexOf('}', bodyStart);
  return bodyEnd < 0 ? '' : uiPanelSource.slice(bodyStart, bodyEnd);
}

const menuPanelRule = lastCssRule('#overlay .menu-wrap');
if (!menuPanelRule.includes("background-size: 16px 16px;") ||
    !menuPanelRule.includes("background-repeat: repeat;") ||
    !menuPanelRule.includes("border-image: url('./VoxelCraft/textures/ui/background_with_border.png') 1 fill / 3px / 0 stretch;")) {
  fail('Main menu panel must preserve original Resource Pack pixel tiling and 1px nine-slice border');
} else pass('Main menu panel uses original Resource Pack tile scale and nine-slice border');

for (const selector of ['#hotbar', '#overlay .help-options-panel', '#inventory .inv-grid']) {
  const rule = lastCssRule(selector);
  if (!rule.includes("background-size: 16px 16px;") ||
      !rule.includes("background-repeat: repeat;") ||
      !rule.includes("border-image: url('./VoxelCraft/textures/ui/background_with_border.png') 1 fill / 3px / 0 stretch;")) {
    fail(selector + ' must preserve original Resource Pack tile scale and nine-slice border');
  } else pass(selector + ' preserves original Resource Pack tile scale and nine-slice border');
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

if (!source.includes('data-inv-filter="items"') ||
    !source.includes("fetch('./item-catalog.json')") ||
    !source.includes("encodeURIComponent(item.file)") ||
    !source.includes("filter === 'items'")) {
  fail('Inventory must expose a browsable original item-icon catalog');
} else pass('Inventory exposes a dedicated item-icon catalog without pretending icons are gameplay mechanics');

const itemCatalogPath = resolve('public/item-catalog.json');
if (!existsSync(itemCatalogPath)) {
  fail('Generated item-catalog.json is missing; run scripts/stage-item-catalog.mjs before validation');
} else {
  try {
    const catalog = JSON.parse(readFileSync(itemCatalogPath, 'utf8'));
    if (catalog.version !== 1 || !Array.isArray(catalog.items) || catalog.count !== catalog.items.length || !catalog.items.length) {
      fail('Generated item catalog must have a valid version, count, and non-empty item list');
    } else {
      let catalogAssetsValid = true;
      const seenFiles = new Set();
      for (const item of catalog.items) {
        if (!item || typeof item.id !== 'string' || typeof item.file !== 'string' ||
            !item.file.endsWith('.png') || seenFiles.has(item.file)) {
          fail('Item catalog entries must have unique PNG filenames and stable IDs');
          catalogAssetsValid = false;
          break;
        }
        seenFiles.add(item.file);
        const originalPath = resolve('VoxelCraft/textures/items', item.file);
        const stagedPath = resolve('public/VoxelCraft/textures/items', item.file);
        if (!existsSync(originalPath) || !existsSync(stagedPath) ||
            !readFileSync(originalPath).equals(readFileSync(stagedPath))) {
          fail('Item icon must be staged byte-identically from Resource Pack: ' + item.file);
          catalogAssetsValid = false;
          break;
        }
      }
      if (catalogAssetsValid) pass('All ' + catalog.items.length + ' item catalog icons are staged byte-identically from the original Resource Pack');
    }
  } catch (error) {
    fail('Generated item catalog JSON is invalid: ' + error.message);
  }
}

const inventoryFilterSource = section(/const inventoryFilterSets = \{([\s\S]*?)\n    \};/, 'inventory category filters');
const inventoryCategoryIds = {};
for (const category of ['nature', 'building', 'minerals']) {
  const match = inventoryFilterSource.match(new RegExp(category + ': new Set\\(\\[([^\\]]*)\\]\\)'));
  inventoryCategoryIds[category] = match ? match[1].split(',').map((value) => Number(value.trim())).filter(Number.isInteger) : [];
}
const listedInventoryIds = Object.values(inventoryCategoryIds).flat();
// Air (ID 0) is a world-state sentinel, not a placeable inventory block.
const knownBlockIds = [...blocks.keys()].filter((id) => id !== 0);
const uncategorizedBlockIds = knownBlockIds.filter((id) => !listedInventoryIds.includes(id));
const unknownCategoryBlockIds = listedInventoryIds.filter((id) => !blocks.has(id));
if (new Set(listedInventoryIds).size !== listedInventoryIds.length) {
  fail('Inventory category filters must not list a block in multiple categories');
} else if (uncategorizedBlockIds.length || unknownCategoryBlockIds.length) {
  fail('Every defined block must appear in exactly one inventory category; missing: ' +
    (uncategorizedBlockIds.join(', ') || 'none') + '; unknown: ' +
    (unknownCategoryBlockIds.join(', ') || 'none'));
} else if (![25, 27, 29, 30, 31, 32, 33].every((id) => inventoryCategoryIds.minerals.includes(id)) ||
           [25, 27, 29, 32, 33].some((id) => inventoryCategoryIds.building.includes(id))) {
  fail('Mineral blocks must appear only in the minerals inventory category');
} else pass('Inventory categories are exclusive, complete, and classify mineral blocks consistently');

if (!source.includes('grid-template-columns: repeat(9, minmax(38px, 52px))') ||
    !source.includes('grid-template-columns: repeat(6, minmax(34px, 1fr))')) {
  fail('Inventory grid must use nine Bedrock-style columns on desktop and a compact six-column layout on mobile');
} else pass('Inventory grid matches Bedrock-style desktop and mobile column layouts');

if (source.includes('#vcGuide .vc-actions { display: grid; grid-template-columns: 1fr; gap: 7px; }')) {
  pass('Browser guide buttons use a single-column action list');
} else {
  fail('Browser guide action buttons must use a single-column layout');
}

if (source.includes('class="hud-brand">VoxelCraft') && source.includes('Overworld') && source.includes('browserStats.coins')) {
  pass('Browser HUD displays browser-owned dimension, coordinates, time, and session statistics');
} else {
  fail('Browser HUD should display browser-owned dimension, coordinates, time, and session statistics');
}
if (source.includes('const BROWSER_STATS_KEY') &&
    source.includes('browserStats.joins++') &&
    source.includes('browserStats.blocksBroken = browserBlocksBroken') &&
    source.includes('browserStats.blocksPlaced = browserBlocksPlaced') &&
    source.includes('localStorage.setItem(BROWSER_STATS_KEY')) {
  pass('Browser-only player statistics persist safely in browser storage');
} else {
  fail('Browser stats should safely persist visits, coins, and block activity');
}
if (source.includes('const coinRewards = { 20: 2, 21: 3, 22: 5, 23: 15, 24: 4, 26: 3, 28: 20, 31: 2 }')) {
  pass("Browser ore coin rewards use the browser game's local reward table");
} else {
  fail("Browser ore coin rewards must use the browser game's local reward table");
}

if (!source.includes("@font-face") ||
    !source.includes("font-family: 'Minecraft Ten'") ||
    !source.includes("./VoxelCraft/font/minecraft-ten.ttf")) {
  fail('Browser UI must use the original Bedrock Minecraft Ten font');
} else pass('Browser UI references the original Bedrock Minecraft Ten font');

if (source.includes("body { cursor: url('./VoxelCraft/textures/ui/cursor_pc.png') 4 4, auto; }") &&
    source.includes('#game { cursor: none; }')) {
  pass('Browser pointer uses the original Bedrock cursor outside the 3D viewport');
} else {
  fail('Browser pointer must use the staged original Bedrock cursor');
}

if (source.includes('#overlay .brand {') &&
    source.includes('top: 12px;') &&
    source.includes('left: 50%;') &&
    source.includes('transform: translateX(-50%);') &&
    source.includes('#overlay .menu-subtitle { display: none; }')) {
  pass('Browser title branding follows the original Resource Pack top-middle anchor');
} else {
  fail('Browser title branding should follow the original Resource Pack top-middle anchor');
}

if (!source.includes('const clockMinutes = Math.floor((((worldTime % 1) + 1) % 1) * 1440);') ||
    !source.includes("padStart(2, '0')")) {
  fail('Browser HUD must show a live HH:mm clock in the browser runtime');
} else pass('Browser HUD shows a live HH:mm clock in the browser runtime');

if (source.includes('body[data-ui-screen="inventory"] #overlay') &&
    source.includes('body[data-ui-screen="inventory"] #pauseOverlay') &&
    source.includes('body[data-ui-screen="inventory"] #vcGuide') &&
    source.includes('body[data-ui-screen="inventory"] #inventory') &&
    source.includes('display: none !important;') &&
    source.includes('z-index: 1000;')) {
  pass('Inventory screen cannot be covered by title, pause, or guide overlays');
} else {
  fail('Inventory screen must hide competing overlays and remain on top while active');
}

if (source.includes('id="pauseOverlay"') && source.includes('id="resumeGameButton"') &&
    source.includes('function syncMenuVisibility()') && source.includes("function getActiveUiScreen()") &&
    source.includes("document.body.dataset.uiScreen = activeScreen") &&
    source.includes("const gameplayActive = getActiveUiScreen() === 'playing'")) {
  pass('One screen state controls title, gameplay, pause, inventory, and guide visibility');
} else {
  fail('UI screens and gameplay activation must be derived from one screen state');
}

if (source.includes('aria-labelledby="inventoryTitle"') &&
    source.includes("if (e.code === 'Escape' && !e.repeat && !wasDown)") &&
    source.includes("if (inventoryOpen) { e.preventDefault(); toggleInventory(); return; }") &&
    source.includes("if (vcGuideOpen) { e.preventDefault(); closeVcGuide(); return; }") &&
    source.includes("if (gameStarted && !locked) { e.preventDefault(); resumeGame(); return; }")) {
  pass('Escape closes blocking screens, returns from pause, and inventory is announced as a modal dialog');
} else {
  fail('Escape navigation and accessible inventory dialog semantics must be present');
}

if (!source.includes("inventoryEl.classList.toggle('hidden', !inventoryOpen)") &&
    !source.includes("vcGuide.classList.remove('hidden')") &&
    !source.includes("vcGuide.classList.add('hidden')") &&
    source.includes("if (!inventoryOpen && vcGuideOpen) return;")) {
  pass('Inventory and guide transitions use the central screen-state controller');
} else {
  fail('Inventory and guide visibility must be controlled centrally, with mutually exclusive screens');
}

if (source.includes("event.key === 'ArrowRight'") && source.includes("event.key === 'ArrowLeft'") &&
    source.includes("event.key === 'Home'") && source.includes("event.key === 'End'") &&
    source.includes('tab.tabIndex = selected ? 0 : -1') &&
    source.includes('role="tabpanel" aria-labelledby="inventoryTabAll"') &&
    source.includes('aria-controls="invGrid"')) {
  pass('Inventory category tabs support arrow/Home/End navigation and roving keyboard focus');
} else {
  fail('Inventory category tabs must follow accessible keyboard tab-navigation behavior');
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
  'hud_tip_text_background', 'item_cell', 'cursor_pc',
  'TabTopBack', 'TabTopBackHover', 'TabTopFront', 'TabTopFrontHover',
];
for (const texture of vanillaUiTextures) {
  if (!source.includes(`./VoxelCraft/textures/ui/${texture}.png`)) {
    fail(`Browser UI must use the staged vanilla Bedrock texture: ${texture}.png`);
  }
}
if (vanillaUiTextures.every(texture => source.includes(`./VoxelCraft/textures/ui/${texture}.png`))) {
  pass(`Browser UI references all ${vanillaUiTextures.length} original Bedrock UI textures`);
}

// The browser game is an adapter: stage exact original pack assets, never redraw substitutes.
const stagedAssetGroups = [
  {
    label: 'vanilla Bedrock UI sprites',
    files: [
      ...['menubackground', 'background_panel', 'background_with_border', 'button_borderless_dark',
        'button_borderless_darkhover', 'button_borderless_darkpressed', 'dialog_background_opaque',
        'highlight_slot', 'hotbar_start_cap', 'hotbar_end_cap', 'cancel', 'inventory_icon',
        'hud_tip_text_background', 'item_cell', 'cursor_pc', 'TabTopBack', 'TabTopBackHover', 'TabTopFront', 'TabTopFrontHover']
        .map(name => [`VoxelCraft/textures/ui/${name}.png`, `public/VoxelCraft/textures/ui/${name}.png`]),
    ],
  },
  {
    label: 'vanilla Bedrock newgui button states',
    files: ['ButtonWithBorder', 'ButtonWithBorderHover', 'ButtonWithBorderPressed'].map(name => [
      `VoxelCraft/textures/gui/newgui/${name}.png`, `public/VoxelCraft/textures/gui/newgui/${name}.png`,
    ]),
  },
  {
    label: 'Resource Pack item sprites used by the browser guide',
    files: ['book_writable', 'apple', 'feather', 'clock_item', 'bed_red', 'compass_item', 'book_normal', 'brick', 'diamond'].map(name => [
      `VoxelCraft/textures/items/${name}.png`, `public/VoxelCraft/textures/items/${name}.png`,
    ]),
  },
  {
    label: 'original Bedrock UI font',
    files: [['VoxelCraft/font/minecraft-ten.ttf', 'public/VoxelCraft/font/minecraft-ten.ttf']],
  },
];
for (const group of stagedAssetGroups) {
  let groupValid = true;
  for (const [sourcePath, stagedPath] of group.files) {
    const sourceFile = resolve(sourcePath);
    const stagedFile = resolve(stagedPath);
    if (!existsSync(sourceFile)) {
      fail(`Missing original asset (${group.label}): ${sourcePath}`);
      groupValid = false;
      continue;
    }
    if (!existsSync(stagedFile)) {
      fail(`Missing staged asset (${group.label}): ${stagedPath}; run scripts/setup.sh first`);
      groupValid = false;
      continue;
    }
    if (!readFileSync(sourceFile).equals(readFileSync(stagedFile))) {
      fail(`Staged asset differs from original pack (${group.label}): ${stagedPath}`);
      groupValid = false;
    }
  }
  if (groupValid) pass(`Staged files are byte-identical to source: ${group.label}`);
}

const vanillaMenuTextures = ['ButtonWithBorder', 'ButtonWithBorderHover', 'ButtonWithBorderPressed'];
for (const texture of vanillaMenuTextures) {
  if (!source.includes(`./VoxelCraft/textures/gui/newgui/${texture}.png`)) {
    fail(`Main-menu buttons must use original Bedrock newgui texture: ${texture}.png`);
  }
}
if (vanillaMenuTextures.every(texture => source.includes(`./VoxelCraft/textures/gui/newgui/${texture}.png`))) {
  pass('Main-menu button states reference original Bedrock newgui textures');
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

const browserGuideActions = ['kit', 'heal', 'fly', 'day', 'night', 'weather', 'stats', 'close'];
for (const action of browserGuideActions) {
  if (!source.includes(`data-vc-action="${action}"`)) {
    fail(`VoxelCraft guide menu is missing action: ${action}`);
  }
}
if (browserGuideActions.every(action => source.includes(`data-vc-action="${action}"`)) &&
    source.includes("e.code === 'KeyG'") && source.includes("function openVcGuide()")) {
  pass('Browser guide actions are present and the G shortcut is retained (browser adaptation, not Behavior Pack commands)');
}

const browserGuideIcons = ['book_writable', 'apple', 'feather', 'clock_item', 'bed_red', 'compass_item', 'book_normal'];
for (const icon of browserGuideIcons) {
  if (!source.includes(`./VoxelCraft/textures/items/${icon}.png`)) {
    fail(`Browser guide must use the staged original Resource Pack item texture: ${icon}.png`);
  }
}
if (browserGuideIcons.every(icon => source.includes(`./VoxelCraft/textures/items/${icon}.png`))) {
  pass(`Browser guide references all ${browserGuideIcons.length} original Resource Pack item sprites`);
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

if (!source.includes('getBlockIfLoaded(x, y, z)') ||
    !source.includes('world.getBlockIfLoaded(baseX + nx, ny, baseZ + nz)')) {
  fail('Chunk meshing must inspect loaded neighbors without implicitly generating chunks outside the render window');
} else pass('Chunk meshing reads loaded neighbors without generating hidden chunks');

const ensureChunkBody = source.match(/ensureChunk\(cx, cz\)\s*\{([\s\S]*?)\n      getChunk\(/)?.[1] || '';
if (!ensureChunkBody.includes('this.chunks.set(k, c);') ||
    !ensureChunkBody.includes('this.invalidateChunk(cx - 1, cz);') ||
    !ensureChunkBody.includes('this.invalidateChunk(cx + 1, cz);') ||
    !ensureChunkBody.includes('this.invalidateChunk(cx, cz - 1);') ||
    !ensureChunkBody.includes('this.invalidateChunk(cx, cz + 1);')) {
  fail('Loading a chunk must invalidate loaded neighbors so boundary faces are remeshed');
} else pass('New chunks invalidate loaded neighbors for correct boundary remeshing');
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

// Validate the vanilla chicken assets as a matched source/staged pair.
// This catches broken deployments before the browser silently falls back to the placeholder model.
const chickenAssetPairs = [
  ['VoxelCraft/models/entity/chicken.geo.json', 'public/VoxelCraft/models/entity/chicken.geo.json'],
  ['VoxelCraft/textures/entity/chicken/chicken.png', 'public/VoxelCraft/textures/entity/chicken/chicken.png'],
];
let chickenAssetsMatch = true;
for (const [sourcePath, stagedPath] of chickenAssetPairs) {
  if (!existsSync(resolve(sourcePath))) {
    fail(`Missing original chicken asset: ${sourcePath}`);
    chickenAssetsMatch = false;
  } else if (!existsSync(resolve(stagedPath))) {
    fail(`Missing staged chicken asset: ${stagedPath}; run scripts/setup.sh first`);
    chickenAssetsMatch = false;
  } else if (!readFileSync(resolve(sourcePath)).equals(readFileSync(resolve(stagedPath)))) {
    fail(`Staged chicken asset differs from original Resource Pack: ${stagedPath}`);
    chickenAssetsMatch = false;
  }
}
if (chickenAssetsMatch) pass('Vanilla chicken geometry and texture are staged byte-identically from the original Resource Pack');

if (!source.includes("./VoxelCraft/models/entity/chicken.geo.json") ||
    !source.includes("./VoxelCraft/textures/entity/chicken/chicken.png") ||
    !source.includes('function setBedrockCubeUV(') ||
    !source.includes('function makeVanillaChickenModel()') ||
    !source.includes('window.__getChickenState')) {
  fail('Browser chicken renderer must load the original Bedrock model/texture and expose load diagnostics');
} else pass('Browser chicken renderer references vanilla assets and exposes diagnostic state');

const chickenGeometryPath = resolve('VoxelCraft/models/entity/chicken.geo.json');
if (existsSync(chickenGeometryPath)) {
  try {
    const chickenData = JSON.parse(readFileSync(chickenGeometryPath, 'utf8'));
    const geometries = chickenData['minecraft:geometry'];
    if (!Array.isArray(geometries) || geometries.length === 0) {
      fail('Vanilla chicken geometry JSON must contain a non-empty minecraft:geometry array');
    } else {
      const chickenModel = geometries.find(g => g.description?.identifier === 'geometry.chicken.v1.12') || geometries[0];
      const description = chickenModel.description || {};
      if (description.texture_width !== 64 || description.texture_height !== 32) {
        fail('Vanilla chicken model must declare its expected 64x32 texture atlas');
      } else pass('Vanilla chicken geometry declares the expected 64x32 texture atlas');
      const boneNames = new Set((chickenModel.bones || []).map(b => b.name));
      for (const bone of ['body', 'head', 'leg0', 'leg1', 'wing0', 'wing1']) {
        if (!boneNames.has(bone)) fail(`Vanilla chicken model is missing required bone: ${bone}`);
      }
      if (['body', 'head', 'leg0', 'leg1', 'wing0', 'wing1'].every(bone => boneNames.has(bone))) {
        pass('Vanilla chicken model includes body, head, both legs, and both wings');
      }
      let invalidCube = false;
      for (const bone of chickenModel.bones || []) {
        for (const cube of bone.cubes || []) {
          const size = cube.size;
          if (!Array.isArray(size) || size.length !== 3 || size.some(n => !Number.isFinite(n) || n <= 0)) {
            fail(`Chicken bone ${bone.name} contains a cube with invalid dimensions`);
            invalidCube = true;
          }
          if (Array.isArray(cube.uv)) {
            const [u, v] = cube.uv;
            if (!Number.isFinite(u) || !Number.isFinite(v) || u < 0 || v < 0 ||
                u + 2 * size[0] + 2 * size[2] > 64 || v + size[1] + size[2] > 32) {
              fail(`Chicken bone ${bone.name} has classic cube UV coordinates outside the 64x32 atlas`);
              invalidCube = true;
            }
          }
        }
      }
      if (!invalidCube) pass('Vanilla chicken cubes have positive dimensions and classic UV rectangles fit the atlas');
    }
  } catch (error) {
    fail('Vanilla chicken geometry JSON is invalid: ' + error.message);
  }
}

const chickenTexturePath = resolve('VoxelCraft/textures/entity/chicken/chicken.png');
if (existsSync(chickenTexturePath)) {
  const png = readFileSync(chickenTexturePath);
  const isPng = png.length >= 24 && png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!isPng) fail('Vanilla chicken texture must be a valid PNG file');
  else if (png.readUInt32BE(16) !== 64 || png.readUInt32BE(20) !== 32) {
    fail(`Vanilla chicken texture dimensions must be 64x32 (found ${png.readUInt32BE(16)}x${png.readUInt32BE(20)})`);
  } else pass('Vanilla chicken texture is a valid 64x32 PNG atlas');
}

// Tree features must be generated from world coordinates and clipped per chunk.
// This prevents crowns and trunks from being cut off at 16x16 chunk boundaries.
if (source.includes('for (let wx = baseX - 2; wx < baseX + CHUNK_X + 2; wx++)') &&
    source.includes('for (let wz = baseZ - 2; wz < baseZ + CHUNK_Z + 2; wz++)') &&
    source.includes('plantTree(c, wx, hf + 1, wz, wt)') &&
    source.includes('plantTree(c, worldX, ly, worldZ, woodType = 0)') &&
    source.includes('const h = 4 + Math.floor(hash2(worldX * 31, worldZ * 17) * 3)') &&
    source.includes('const x = wx - baseX, z = wz - baseZ;')) {
  pass('Tree generation is deterministic in world coordinates and preserves canopy voxels across chunk boundaries');
} else {
  fail('Tree generation must use world-space origins and write neighboring tree portions into each chunk');
}

// Chunk-local storage uses a flat typed array, so x/z bounds must be checked
// before indexing to avoid out-of-range coordinates aliasing adjacent voxel rows.
const chunkGetSource = source.match(/get\(x, y, z\)\s*\{([\s\S]*?)\n\s*\}/)?.[1] || '';
const chunkSetSource = source.match(/set\(x, y, z, v\)\s*\{([\s\S]*?)\n\s*\}/)?.[1] || '';
if (/x < 0 \|\| x >= CHUNK_X/.test(chunkGetSource) &&
    /y < 0 \|\| y >= CHUNK_Y/.test(chunkGetSource) &&
    /z < 0 \|\| z >= CHUNK_Z/.test(chunkGetSource) &&
    /x < 0 \|\| x >= CHUNK_X/.test(chunkSetSource) &&
    /y < 0 \|\| y >= CHUNK_Y/.test(chunkSetSource) &&
    /z < 0 \|\| z >= CHUNK_Z/.test(chunkSetSource) &&
    /!Number\.isInteger\(v\) \|\| v < 0 \|\| v > 255/.test(chunkSetSource) &&
    /return this\.data\[this\.idx\(x, y, z\)\];/.test(chunkGetSource)) {
  pass('Chunk voxel reads/writes guard local coordinates and byte-sized block ids');
} else {
  fail('Chunk voxel reads/writes must validate x/y/z bounds and block id range before indexing typed storage');
}

// Saved voxel edits must be indexed per chunk so chunk generation scales with
// edits in that chunk rather than scanning the entire world-save map.
if (source.includes('this.chunkOverrides = new Map()') &&
    source.includes('this.indexOverride(x, y, z, id)') &&
    source.includes('this.indexOverride(x, y, z, v)') &&
    source.includes('const chunkEdits = this.chunkOverrides.get(chunkKey(c.cx, c.cz))') &&
    !source.includes('for (const [key, id] of this.overrides)')) {
  pass('Saved voxel edits are indexed by chunk for bounded chunk-generation work');
} else {
  fail('Chunk generation must apply only edits indexed for that chunk, not scan every saved world edit');
}

// Match LevelChunk::setTile's no-op guard: unchanged block writes must not dirty chunks or rewrite the save.
if (source.includes('// Match the reference LevelChunk behavior: identical writes are no-ops.') &&
    source.includes('if (c.get(lx, y, lz) === v) return false;')) {
  pass('World block writes skip unchanged values before dirtying chunks or saving');
} else {
  fail('World.setBlock must skip unchanged values, following the reference LevelChunk no-op behavior');
}

const oreGenerationSource = source.match(/\/\/ ores in stone layer[\s\S]*?\/\/ === Phase 1C: stone variant patches/)?.[0] || '';
if (oreGenerationSource.includes('c.set(lx, y, lz, 24);  // lapis ore (deep; BLOCKS[24])') &&
    oreGenerationSource.includes('c.set(lx, y, lz, 28);  // emerald ore (very rare; BLOCKS[28])') &&
    /24:\s*\{\s*name:'Bijih Lapis'/.test(blockSource) &&
    /28:\s*\{\s*name:'Bijih Zamrud'/.test(blockSource)) {
  pass('Generated lapis and emerald ores use their matching BLOCKS ids');
} else {
  fail('Ore generation must map lapis to block id 24 and emerald to block id 28');
}

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s):`);
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else {
  console.log('\nVoxelCraft foundation checks passed.');
}
