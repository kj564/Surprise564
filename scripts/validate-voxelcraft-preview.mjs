import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const htmlPath = join(root, 'public/voxelcraft-rebuild.html');
const bundlePath = join(root, 'public/voxelcraft-engine.bundle.js');
const html = readFileSync(htmlPath, 'utf8');
const modules = [...html.matchAll(/<script\s+type="module">([\s\S]*?)<\/script>/g)];
if (modules.length !== 1) throw new Error('Expected exactly one inline module script in the rebuild preview');
if (!html.includes('voxelcraft-engine.bundle.js')) throw new Error('Preview does not load the generated engine bundle');
if (!existsSync(bundlePath)) throw new Error('Generated engine bundle is missing; run prebuild first');
const bundle = readFileSync(bundlePath, 'utf8');
if (!bundle.includes('VoxelCraftEngine')) throw new Error('Generated bundle does not expose VoxelCraftEngine');

const tempDir = mkdtempSync(join(tmpdir(), 'voxelcraft-preview-'));
const tempFile = join(tempDir, 'preview.mjs');
try {
  writeFileSync(tempFile, modules[0][1], 'utf8');
  const result = spawnSync(process.execPath, ['--check', tempFile], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error('Preview module syntax check failed:\n' + (result.stderr || result.stdout || 'unknown syntax error'));
  }
} finally {
  try { unlinkSync(tempFile); } catch {}
}
console.log('Playable preview HTML, engine bundle and inline module syntax are valid.');
