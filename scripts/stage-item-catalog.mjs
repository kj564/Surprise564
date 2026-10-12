#!/usr/bin/env node
import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const sourceDir = resolve('VoxelCraft/textures/items');
const outputDir = resolve('public/VoxelCraft/textures/items');
const catalogPath = resolve('public/item-catalog.json');
await mkdir(outputDir, { recursive: true });
const files = (await readdir(sourceDir, { withFileTypes: true }))
  .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b));
if (!files.length) throw new Error('No original item PNGs found in ' + sourceDir);
for (const file of files) await cp(resolve(sourceDir, file), resolve(outputDir, file));
const items = files.map(file => {
  const id = basename(file, '.png');
  const name = id.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let category = 'materials';
  if (/sword|axe|pickaxe|shovel|hoe|bow|crossbow|trident|shield|helmet|chestplate|leggings|boots|fishing_rod|flint_and_steel|shears|spyglass|compass|clock|map/.test(id)) category = 'tools';
  else if (/apple|beef|chicken|pork|mutton|fish|salmon|bread|cake|cookie|carrot|potato|beetroot|stew|soup|melon|berries|pie|rabbit|cod|egg|milk|honey|kelp/.test(id)) category = 'food';
  else if (/ingot|nugget|diamond|emerald|coal|charcoal|quartz|lapis|redstone|amethyst|flint|leather|string|feather|bone|stick|brick|clay|gunpowder|paper|book|dye|powder|shard|shell|crystal/.test(id)) category = 'materials';
  else if (/boat|minecart|bucket|door|bed|sign|banner|armor_stand|item_frame|flower_pot|saddle|lead|totem|elytra/.test(id)) category = 'utility';
  return { id, name, file, category };
});
await writeFile(catalogPath, JSON.stringify({ version: 1, count: items.length, items }, null, 2) + '\n');
console.log('Staged ' + items.length + ' original Resource Pack item icons.');
