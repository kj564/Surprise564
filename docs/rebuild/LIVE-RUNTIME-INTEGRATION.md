# Live Runtime Integration Notes

Inspected source: `public/minecraft.html` on `rebuild/voxelcraft-modern-engine`.

## Important compatibility finding

The current Three.js page uses a project-specific `BLOCKS` catalog, not the numeric IDs from the MCPE 2013 Tile registry. Numeric IDs must not be copied directly between the live page and `src/game/blocks/registry.ts`.

Examples verified from the current source:

| Block identity | Existing browser ID | Engine/MCPE legacy ID |
| --- | ---: | ---: |
| Air | 0 | 0 (engine sentinel) |
| Grass block | 1 | 2 |
| Dirt | 2 | 3 |
| Stone | 3 | 1 |
| Cobblestone | 4 | 4 |
| Oak log | 5 | 17 |
| Oak planks | 6 | 5 |
| Oak leaves | 7 | 18 |
| Sand | 8 | 12 |
| Gravel | 9 | 13 |
| Glass | 10 | 20 |
| Bedrock | 11 | 7 |
| Bricks | 12 | 45 |
| Water | 19 | 8 (flowing-water alias 9) |

This mismatch is material: e.g. browser ID `1` means grass, while engine ID `1` means stone. Any direct copy of block arrays or saved edits would silently corrupt world contents.

## Adapter added

`src/game/adapters/browser-block-ids.ts` contains explicit identity-based mappings for the subset that can be matched to an existing engine definition. Unknown/custom-only/ambiguous IDs return `undefined`; the adapter does not guess. Tests cover mismatched numeric IDs, unsupported crafting-table/furnace entries, and supported round trips.

## Existing live systems observed

- `World` owns a custom chunk map, procedural generation, saved block overrides, and mesh invalidation.
- `movePlayer(dt)` currently applies wish-direction movement, gravity and substepped axis collision directly to the live `player` object.
- `raycastVoxel(maxDist)`, `breakBlock()`, and `placeBlock()` currently act directly on the live `World` and custom `BLOCKS` catalog.
- Rendering meshes are rebuilt by `updateChunk` / `remeshAround`.
- Browser persistence currently stores block overrides in localStorage using its own version-1 shape.

## Integration status (updated 2026-10-17)

The rebuild is now available as a separate playable page at `public/voxelcraft-rebuild.html`. That preview uses the rebuilt engine for its own world state, player physics, targeting, mining, placement, inventory, terrain generation and local save/load. The legacy `public/minecraft.html` remains a separate runtime and has not been silently migrated.

The explicit ID adapter and atomic block-buffer translator remain compatibility tools; they are not permission to copy IDs or saved edits without checking every block identity. The preview generates its own engine-format terrain and does not convert the legacy world's full live state.

## Remaining safe integration sequence

1. Expand the explicit identity map only when the source texture/block identity is verified; keep unsupported/custom-only IDs explicit.
2. Build a read-only parity harness that samples the legacy generator and compares equivalent engine coordinates without mutating either world.
3. Cover browser behavior with automated and manual regression checks on desktop and touch devices.
4. Migrate block edits and saves only after versioned conversion tests prove round-trip preservation for every supported ID and report unsupported entries.
5. Retire any legacy live path only after gameplay parity, save migration, asset provenance and browser play tests are reviewed.

PR #97 was merged on 2026-10-12. Further rebuild work continues on `rebuild/voxelcraft-modern-engine`; the legacy `minecraft.html` remains intact while the dedicated preview advances independently. CI validates mechanics, build/export and static preview hooks, but it does not replace manual browser playtesting.
