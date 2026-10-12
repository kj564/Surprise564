# Rebuild audit: source provenance, licensing, and implementation boundaries

Status: **HOLD direct source-code/asset port pending rights review**  
Branch: `rebuild/web-modern-foundation`

## Executive findings

1. The repository contains a historical Minecraft: Pocket Edition C++ source snapshot under `rujukan/pocket-edition-2013/mcpe-source/`. The snapshot does not include a discoverable root `LICENSE`, `COPYING`, or `NOTICE` file in that source subtree. The presence of source code in a public Git repository is not, by itself, permission to copy, modify, or redistribute it.
2. The public archive describing this 2013 source identifies it as originating from a source-code leak dated February 28, 2026. That provenance is a material legal risk. Treat the code as **not cleared for derivative implementation or redistribution** unless the relevant rights holder grants permission or qualified legal review confirms a lawful basis.
3. The repository's `LICENSE-ATTRIBUTION.md` says original project code is licensed by a repository license “if present, otherwise MIT-style permissive.” There is no root `LICENSE` file in the current tree, so the MIT-style fallback is unsupported and must not be relied on.
4. `VoxelCraft/` mirrors a third-party Minecraft Bedrock resource pack whose own README says the assets belong to Mojang/Microsoft. `VanillaBehaviorPack/` is a submodule of a template repository that also says the assets belong to Mojang/Microsoft. These are not cleared for unrestricted redistribution just because they are checked into this repository.
5. A third-party source archive or template license cannot grant rights to Mojang/Microsoft-owned code, textures, sounds, models, names, or trademarks.

## Evidence to verify and preserve

- Current repository tree: no root `LICENSE` file; `LICENSE-ATTRIBUTION.md` is present.
- `VoxelCraft/README.md`: states that the resource pack is a template and “All assets belong to Mojang & Microsoft.”
- `LICENSE-ATTRIBUTION.md`: identifies `VoxelCraft/` and `VanillaBehaviorPack/` as Mojang/Microsoft property and advises against redistributing them without verifying rights.
- Historical source reference: `rujukan/pocket-edition-2013/mcpe-source/`. No explicit license was found in the source subtree during this initial tree audit.
- Public archive reference: [SSMG64/PocketEdition](https://github.com/SSMG64/PocketEdition) describes the archived 2013 source and states its provenance. This is a provenance lead, not a license grant.
- General GitHub guidance: [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) explains that without a license, default copyright applies.

## Immediate safeguards

- Do not copy source lines, translate source files, or port proprietary algorithms line-by-line into the new engine while rights remain unresolved.
- Do not add new copies of Minecraft textures, sounds, fonts, models, logos, or other game assets to the new runtime.
- Do not describe the result as an official Minecraft port or use Minecraft branding in a way that implies endorsement.
- Keep the current game and all existing assets untouched on `main`; this rebuild branch is isolated.
- For the first implementation milestone, use independently authored TypeScript and original placeholder/test assets. Keep the design generic until a rights review clears any source-specific implementation and assets.
- Ask a qualified lawyer or the relevant rights holder to review whether the existing repository may continue to host the source snapshot and whether any proposed derivative is permitted. This document is an engineering risk register, not legal advice.

## What can be done safely as engineering work

- Define a generic voxel-game architecture and interfaces without copying source implementation.
- Build independent tests for voxel indexing, chunk boundaries, collision, raycasting, inventory data integrity, save/load, and browser lifecycle.
- Use source file names only as an audit index; record high-level expected behavior separately and avoid reproducing expressive implementation details until clearance.
- Use original code and assets with documented provenance and a clear license. Any new license for VoxelCraft-authored code must explicitly exclude third-party materials and must not claim rights the project does not own.

## Gate to resume source-specific porting

Direct porting may resume only after the project owner records a documented legal basis for the specific code and assets to be used. Clearance for code does not automatically clear art, sounds, trademarks, or the Bedrock behavior/resource packs. Track each asset/source family separately.
