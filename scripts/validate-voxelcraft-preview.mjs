import { existsSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const htmlPath = join(root, 'public/minecraft.html');
const obsoletePath = join(root, 'public/voxelcraft-rebuild.html');
const bundlePath = join(root, 'public/voxelcraft-engine.bundle.js');
if (!existsSync(htmlPath)) throw new Error('The sole playable entrypoint public/minecraft.html is missing');
if (existsSync(obsoletePath)) throw new Error('Remove public/voxelcraft-rebuild.html; all gameplay must live in public/minecraft.html');
const html = readFileSync(htmlPath, 'utf8');
const modules = [...html.matchAll(/<script\s+type="module">([\s\S]*?)<\/script>/g)];
if (modules.length !== 1) throw new Error('Expected exactly one inline module script in public/minecraft.html');
for (const [snippet, label] of [
  ["import './voxelcraft-engine.bundle.js';", 'rebuilt engine bundle import'],
  ['new window.VoxelCraftEngine(', 'engine composition root initialization'],
  ['new window.VoxelCraftBlockRegistry(', 'block registry initialization'],
  ['syncEngineChunk(c)', 'legacy terrain synchronization into authoritative engine world'],
  ['voxelEngine.target(', 'authoritative voxel targeting'],
  ['voxelEngine.startMining(hit.block)', 'timed mining start'],
  ['voxelEngine.advanceMining(deltaSeconds, hit.block)', 'timed mining progression'],
  ['voxelEngine.placeSelected(hit)', 'inventory-backed transactional placement'],
  ["url('./VoxelCraft/textures/ui/menubackground.png')", 'original resource-pack main-menu texture'],
  ["url('./VoxelCraft/textures/ui/background_panel.png')", 'original resource-pack UI panel texture'],
  ['localStorage.setItem', 'browser-local world persistence'],
]) {
  if (!html.includes(snippet)) throw new Error('minecraft.html is missing ' + label);
}
if (!existsSync(bundlePath)) throw new Error('Generated engine bundle is missing; run build:voxel-engine first');
const bundle = readFileSync(bundlePath, 'utf8');
for (const symbol of ['VoxelCraftEngine', 'VoxelCraftBlockRegistry']) {
  if (!bundle.includes(symbol)) throw new Error('Generated engine bundle does not expose ' + symbol);
}
const tempDir = mkdtempSync(join(tmpdir(), 'voxelcraft-minecraft-'));
const tempFile = join(tempDir, 'minecraft-module.mjs');
try {
  writeFileSync(tempFile, modules[0][1], 'utf8');
  const result = spawnSync(process.execPath, ['--check', tempFile], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('minecraft.html module syntax check failed:\n' + (result.stderr || result.stdout || 'unknown syntax error'));
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
console.log('Single minecraft.html entrypoint, engine integration, original UI assets, persistence, and module syntax are valid.');
