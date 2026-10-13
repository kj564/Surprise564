#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlPath = resolve('public/voxelcraft-rebuild.html');
const bundlePath = resolve('public/voxelcraft-engine.bundle.js');
const failures = [];
const pass = message => console.log('✓ ' + message);
const fail = message => failures.push(message);

if (!existsSync(htmlPath)) {
  fail('Playable rebuild preview HTML is missing');
} else {
  const html = readFileSync(htmlPath, 'utf8');
  if (html.includes(String.fromCharCode(92) + 'n')) fail('Preview markup contains escaped newline artifacts instead of real line breaks');
  else pass('Preview markup has no escaped newline artifacts');

  for (const [snippet, label] of [
    ["import * as THREE from 'three';", 'Three.js runtime import'],
    ["import './voxelcraft-engine.bundle.js';", 'rebuilt engine bundle import'],
    ['new Engine(', 'engine composition root initialization'],
    ['engine.step(dt,', 'fixed-step player simulation'],
    ['currentTarget()', 'voxel targeting flow'],
    ['engine.startMining(', 'timed block mining'],
    ['engine.placeSelected(', 'inventory-backed block placement'],
    ['engine.createSave(', 'versioned world save'],
    ['Engine.fromSave(', 'validated world load'],
    ['id="inventory-grid"', 'inventory overlay'],
    ['id="touch-controls"', 'touch controls'],\n    ['id="mine-progress-fill"', 'live mining progress bar'],\n    ["setMiningProgress(result.progress)", 'per-frame mining progress updates'],\n    ["hideMiningProgress()", 'mining progress cleanup on cancellation and release'],
  ]) {
    if (html.includes(snippet)) pass(label + ' is wired in the preview');
    else fail('Preview is missing ' + label);
  }

  if (!html.includes('let worldSeed=564;') ||
      !html.includes('generateTerrainChunk(engine.world,cx,cz,{seed:worldSeed})') ||
      !html.includes('seed:worldSeed,createdAt:worldCreatedAt') ||
      !html.includes('worldSeed=parsedSave.metadata.seed') ||
      !html.includes('ensureTerrainNeighborhood(engine.world,playerPosition.x,playerPosition.z,{seed:worldSeed,radius:1})')) {
    fail('Active terrain seed must be preserved across generation, save/load, and chunk streaming');
  } else pass('Terrain generation, persistence, and exploration share the active world seed');
}

if (!existsSync(bundlePath)) {
  fail('Rebuilt engine browser bundle is missing; run scripts/setup.sh');
} else {
  const bundle = readFileSync(bundlePath, 'utf8');
  for (const [snippet, label] of [
    ['VoxelCraftEngine', 'engine composition root'],
    ['VoxelCraftGenerateTerrainChunk', 'seeded terrain generator'],
    ['VoxelCraftEnsureTerrainNeighborhood', 'terrain neighborhood streaming'],
    ['VoxelCraftCreateMeshCache', 'dirty chunk mesh cache'],
  ]) {
    if (bundle.includes(snippet)) pass('Engine bundle includes ' + label);
    else fail('Engine bundle is missing ' + label);
  }
}

if (failures.length) {
  console.error('\\n' + failures.length + ' rebuild preview validation failure(s):');
  for (const message of failures) console.error('✗ ' + message);
  process.exitCode = 1;
} else {
  console.log('\\nVoxelCraft rebuild preview checks passed.');
}
