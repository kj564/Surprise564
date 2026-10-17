#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlPath = resolve('public/minecraft.html');
const obsoletePath = resolve('public/voxelcraft-rebuild.html');
const bundlePath = resolve('public/voxelcraft-engine.bundle.js');
const failures = [];
const pass = message => console.log('✓ ' + message);
const fail = message => failures.push(message);

if (!existsSync(htmlPath)) fail('The single playable game entrypoint public/minecraft.html is missing');
else {
  const html = readFileSync(htmlPath, 'utf8');
  if (existsSync(obsoletePath)) fail('Obsolete second game page public/voxelcraft-rebuild.html must not exist');
  else pass('There is no duplicate rebuild HTML page');
  for (const [snippet, label] of [
    ["import './voxelcraft-engine.bundle.js';", 'engine bundle import'],
    ['new window.VoxelCraftEngine(', 'engine composition root'],
    ['syncEngineChunk(c)', 'world/chunk synchronization'],
    ['voxelEngine.target(', 'voxel targeting'],
    ['voxelEngine.startMining(hit.block)', 'timed block mining'],
    ['voxelEngine.advanceMining(deltaSeconds, hit.block)', 'mining progress and completion'],
    ['voxelEngine.placeSelected(hit)', 'block placement'],
    ['requestAnimationFrame(animate)', 'continuous rendered game loop'],
  ]) {
    if (html.includes(snippet)) pass(label + ' is wired into minecraft.html');
    else fail('minecraft.html is missing ' + label);
  }
}
if (!existsSync(bundlePath)) fail('Rebuilt engine browser bundle is missing; run scripts/setup.sh');
else {
  const bundle = readFileSync(bundlePath, 'utf8');
  for (const [snippet, label] of [
    ['VoxelCraftEngine', 'engine composition root'],
    ['VoxelCraftBlockRegistry', 'block registry'],
  ]) {
    if (bundle.includes(snippet)) pass('Engine bundle includes ' + label);
    else fail('Engine bundle is missing ' + label);
  }
}
if (failures.length) {
  console.error('\n' + failures.length + ' minecraft entrypoint validation failure(s):');
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else console.log('\nSingle minecraft.html runtime checks passed.');
