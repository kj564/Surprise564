#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const failures = [];
const warnings = [];
const pass = (message) => console.log('✓ ' + message);
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const exists = (path) => existsSync(resolve(path));
const read = (path) => readFileSync(resolve(path), 'utf8');

function requirePaths(paths, label) {
  const missing = paths.filter((path) => !exists(path));
  if (missing.length) {
    for (const path of missing) fail(`${label}: missing ${path}`);
  } else {
    pass(`${label}: all ${paths.length} required paths exist`);
  }
}

function parseJson(path, label) {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    fail(`${label}: ${path} is missing or invalid JSON (${error.message})`);
    return null;
  }
}

function parseShellArray(source, name, label) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`(?:^|\\n)\\s*${escapedName}=\\(([^)]*)\\)`, 'm'));
  if (!match) {
    fail(`${label}: array ${name} was not found`);
    return [];
  }
  return (match[1].replace(/#.*$/gm, '').match(/[A-Za-z][A-Za-z0-9_]*/g) || []);
}

function compareArrays(sourceText, sourceName, ciText, ciName, label) {
  const local = parseShellArray(sourceText, sourceName, 'scripts/setup.sh');
  const ci = parseShellArray(ciText, ciName, '.github/workflows/static.yml');
  const localOnly = local.filter((item) => !ci.includes(item));
  const ciOnly = ci.filter((item) => !local.includes(item));
  if (localOnly.length || ciOnly.length || local.length !== ci.length) {
    fail(`${label}: local setup and CI differ (local-only: ${localOnly.join(', ') || 'none'}; CI-only: ${ciOnly.join(', ') || 'none'})`);
  } else {
    pass(`${label}: local setup and CI agree on all ${local.length} entries`);
  }
}

requirePaths([
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/Screen.cpp',
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/Gui.cpp',
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/components/Button.cpp',
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/components/InventoryPane.cpp',
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/gui/screens/StartMenuScreen.cpp',
  'rujukan/pocket-edition-2013/mcpe-source/handheld/src/client/Minecraft.cpp',
], 'Historical code references (rujukan)');

requirePaths([
  'VoxelCraft/manifest.json',
  'VoxelCraft/ui/start_screen.json',
  'VoxelCraft/ui/hud_screen.json',
  'VoxelCraft/textures/blocks/grass_top.png',
  'VoxelCraft/textures/ui/menubackground.png',
  'VoxelCraft/textures/gui/newgui/ButtonWithBorder.png',
  'VoxelCraft/textures/items/apple.png',
], 'Resource Pack source (RP: VoxelCraft)');

requirePaths([
  '.gitmodules',
  'VanillaBehaviorPack/manifest.json',
  'VanillaBehaviorPack/README.md',
  'VanillaBehaviorPack/blocks',
  'VanillaBehaviorPack/items',
  'VanillaBehaviorPack/recipes',
], 'Behavior Pack reference (BP: VanillaBehaviorPack)');

const modules = read('.gitmodules');
if (/\[submodule "VanillaBehaviorPack"\]/.test(modules) &&
    /path = VanillaBehaviorPack/.test(modules) &&
    /MCBVanillaBehaviorPack\.git/.test(modules)) {
  pass('Behavior Pack is configured as the expected upstream Git submodule');
} else {
  fail('.gitmodules must retain the VanillaBehaviorPack submodule and expected upstream URL');
}

const rp = parseJson('VoxelCraft/manifest.json', 'Resource Pack manifest');
const bp = parseJson('VanillaBehaviorPack/manifest.json', 'Behavior Pack manifest');

if (rp) {
  const resourceModule = (rp.modules || []).some((module) => module.type === 'resources');
  if (!rp.header?.uuid || !Array.isArray(rp.header?.version) || !resourceModule) {
    fail('Resource Pack manifest must define a header UUID/version and a resources module');
  } else {
    pass('Resource Pack manifest has a valid header and resources module');
  }
}

if (bp) {
  const dataModule = (bp.modules || []).some((module) => module.type === 'data');
  if (!bp.header?.uuid || !Array.isArray(bp.header?.version) || !dataModule) {
    fail('Behavior Pack manifest must define a header UUID/version and a data module');
  } else {
    pass('Behavior Pack manifest has a valid header and data module');
  }

  const rpDependency = (bp.dependencies || []).find((dependency) => dependency.uuid === rp?.header?.uuid);
  if (rp && !rpDependency) {
    warn('Behavior Pack does not declare a dependency on the checked-in Resource Pack UUID; verify this only if distributing the packs together.');
  } else if (rpDependency && JSON.stringify(rpDependency.version) !== JSON.stringify(rp.header.version)) {
    warn(`Behavior Pack dependency version (${rpDependency.version?.join('.')}) differs from Resource Pack version (${rp.header.version?.join('.')}); the browser game does not execute Bedrock manifests, so resolve this before packaging the packs together.`);
  } else if (rpDependency) {
    pass('Behavior Pack Resource Pack dependency UUID/version matches');
  }
}

const setup = read('scripts/setup.sh');
const workflow = read('.github/workflows/static.yml');
compareArrays(setup, 'REQUIRED', workflow, 'textures', 'Block texture staging');
compareArrays(setup, 'UI_REQUIRED', workflow, 'ui_textures', 'UI sprite staging');
compareArrays(setup, 'GUI_REQUIRED', workflow, 'gui_textures', 'New GUI button staging');
compareArrays(setup, 'ITEM_REQUIRED', workflow, 'item_textures', 'Item icon staging');

requirePaths([
  'public/minecraft.html',
  'public/VoxelCraft/models/entity/chicken.geo.json',
  'public/VoxelCraft/textures/entity/chicken/chicken.png',
  'public/VoxelCraft/textures/blocks/grass_top.png',
  'public/VoxelCraft/textures/ui/menubackground.png',
  'public/VoxelCraft/textures/gui/newgui/ButtonWithBorder.png',
  'public/VoxelCraft/textures/items/apple.png',
  'public/VoxelCraft/font/minecraft-ten.ttf',
], 'Staged browser runtime assets');

if (warnings.length) {
  console.warn(`\\n${warnings.length} foundation warning(s):`);
  for (const message of warnings) console.warn('! ' + message);
}
if (failures.length) {
  console.error(`\\n${failures.length} foundation validation failure(s):`);
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else {
  console.log('\\nRepository foundation checks passed.');
}
