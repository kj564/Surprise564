# Live Runtime Integration Notes

Inspected source: `public/minecraft.html` on the merged `main` baseline; the new playable mechanics preview is `public/voxelcraft-rebuild.html`.

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

## Safe next integration sequence

1. Expand the explicit identity map and decide how unsupported custom blocks map before any conversion.
2. Add a read-only world adapter and compare generated/read blocks against the live source at selected coordinates.
3. Integrate the new collision/targeting code behind a feature flag and run browser-level regression checks.
4. Migrate block edits and saves only after a versioned conversion test proves round-trip preservation.
5. Remove the old live path only after parity tests and browser play tests pass.

The adapter is a first compatibility seam, not a claim that the rebuilt engine already controls the original `public/minecraft.html` runtime. The rebuild is now merged into `main` as a separate playable preview at `public/voxelcraft-rebuild.html`; the original runtime remains intact. Future work should expand identity mappings and parity tests before migrating the original save format or replacing its runtime.


## Merged preview safeguards

The playable preview now keeps the active world seed in one runtime variable. Save/load and newly streamed chunks reuse the saved seed instead of silently switching to the default seed after loading.

The GitHub Pages workflow builds the browser engine bundle, checks the preview's inline module syntax, validates touch/mining/inventory/save-load wiring, checks seed continuity and markup integrity, and verifies that both `voxelcraft-rebuild.html` and `voxelcraft-engine.bundle.js` are included in the exported site. These checks reduce regressions but do not replace hands-on browser and mobile-device playtesting.
