# Vanilla Resource/Behavior Pack Completeness Audit

**Audit date:** 2026-10-12  
**Repository:** `kj564/Surprise564`  
**Audited browser-game branch:** `main` at `1a9fe17a5aa890c5bb59dc4c21145f094f96c379`

## Result at a glance

| Area | Status | Evidence / limitation |
| --- | --- | --- |
| Upstream Resource Pack source | **Path-complete mirror** | The `VoxelCraft/` tree contains the same 18,902 Git tree entries (paths) as `ZtechNetwork/MCBVanillaResourcePack` at audit time. This confirms path coverage, not byte-for-byte identity of every file. |
| Upstream Behavior Pack source | **Present as submodule** | `VanillaBehaviorPack/` is a Git submodule pinned to `cd225093b19326166270a83b912186c0f5da6767`, matching the upstream `master` tree SHA checked during this audit (2,958 tree entries). |
| Browser runtime assets | **Intentionally partial** | `public/VoxelCraft/` is not meant to contain the entire RP. The setup script and GitHub Actions workflow stage the specific block textures, UI sprites, item icons, font, and chicken model/texture used by the browser game. |
| Local/CI asset staging lists | **In sync at audit time** | The required block texture, UI, newgui button, and item-icon arrays in `scripts/setup.sh` match the corresponding arrays in `.github/workflows/static.yml`. |
| Full Minecraft gameplay parity | **Not complete** | The browser game adapts selected behavior. It is not a Bedrock runtime and does not automatically execute BP JSON definitions. Crafting recipes, loot tables, all entities, biomes, trading, and all BP rules have not been fully ported into the browser engine. |
| Browser visual/interactions | **Requires browser testing** | Static validation and CI can check files and code wiring, but do not prove every screen, texture, or interaction renders correctly in a real browser. |

## Source of truth

- Resource Pack: [ZtechNetwork/MCBVanillaResourcePack](https://github.com/ZtechNetwork/MCBVanillaResourcePack)
- Behavior Pack: [ZtechNetwork/MCBVanillaBehaviorPack](https://github.com/ZtechNetwork/MCBVanillaBehaviorPack)
- In-repository RP mirror: `VoxelCraft/`
- BP reference submodule: `VanillaBehaviorPack/`
- Browser game implementation: `public/minecraft.html`
- Runtime copies staged for deployment: `public/VoxelCraft/`

## What “complete” means here

The full upstream pack sources are available in the repository (the RP as a checked-in tree and the BP as a pinned submodule). The browser runtime is deliberately smaller: only assets actually referenced by the browser game should be copied to `public/VoxelCraft/`.

This **does not** mean the browser game already implements every feature described by the Behavior Pack. Each desired system must be inspected in the upstream BP and adapted to browser-side JavaScript/Three.js. Bedrock-specific APIs and JSON data cannot be treated as executable browser code.

## Next implementation priorities

1. Maintain automated checks that the RP source tree and BP submodule remain present.
2. Keep local setup and CI staging lists synchronized and verify required staged files exist.
3. Compare the current browser block/item definitions with BP block, item, recipe, and loot data.
4. Port gameplay systems incrementally, starting with block drops/inventory consistency and crafting, with regression checks for existing movement, UI, save/load, and chicken rendering.
5. Run static checks and a real browser interaction pass before calling each system complete.

## Scope cleanup

The old `scripts/package-bedrock-addon.sh` and `scripts/validate-bedrock-addon.mjs` scripts referred to the removed `BedrockAddon/` and `VoxelCraftResourcePack/` directories. They do not package or validate the browser game and are removed separately from the retained `VanillaBehaviorPack/` reference submodule.
