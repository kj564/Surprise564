import { mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const source = resolve(root, 'src/game/wasm/terrain-kernel/src/lib.rs');
const output = resolve(root, 'public/voxelcraft-kernel.wasm');
mkdirSync(dirname(output), { recursive: true });
if (!existsSync(source)) throw new Error('WASM terrain kernel source is missing');

const result = spawnSync('rustc', [
  '--edition=2021',
  '--target=wasm32-unknown-unknown',
  '--crate-type=cdylib',
  '-C', 'opt-level=3',
  '-C', 'panic=abort',
  source,
  '-o', output,
], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error('WASM build failed. Install Rust and the wasm32-unknown-unknown target.');
}
console.log('Built public/voxelcraft-kernel.wasm');
