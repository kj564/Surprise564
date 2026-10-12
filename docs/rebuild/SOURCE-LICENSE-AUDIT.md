# Source and License Audit — VoxelCraft Rebuild

Audit date: 2026-10-12  
Scope: repository files visible on `main`, especially the MCPE 2013 source snapshot, vanilla asset mirrors, and rebuild code.

## Findings verified in this repository

1. **No root `LICENSE` file was found on `main`.** The existing `LICENSE-ATTRIBUTION.md` says original code is licensed under the repository license, “see `LICENSE` if present, otherwise MIT-style permissive.” Because no root license file was found, contributors must not interpret that sentence as a reliable grant of MIT rights. This rebuild does not assume the repository or reference source is MIT-licensed.
2. **The MCPE 2013 C++ source snapshot has no top-level `LICENSE`, `COPYING`, or `NOTICE` file identified in the checked-in path tree.** Files inspected include `handheld/src/world/level/tile/Tile.cpp`, `Tile.h`, and `handheld/src/world/phys/AABB.h`. These files contain implementation code but no license grant in the inspected opening sections. This is not proof that no upstream agreement exists; provenance and rights remain unverified.
3. **Vanilla assets are separately restricted.** `LICENSE-ATTRIBUTION.md` identifies the contents of `VoxelCraft/` and `VanillaBehaviorPack/` as Mojang/Microsoft property and warns against redistribution without verifying rights. The behavior pack is configured as the `ZtechNetwork/MCBVanillaBehaviorPack` submodule. Treat upstream availability as distinct from permission to redistribute.
4. **No historical C++ source fragments or new vanilla runtime assets are intentionally copied into the new TypeScript engine modules.** Source files are used to identify behavior and data contracts; new modules are independently authored. This clean-room practice reduces copying risk but does not resolve all legal questions around the source archive or game compatibility.

## Required release gates

- Establish the MCPE snapshot's provenance, upstream repository/revision, applicable license or written permission, and any redistribution conditions.
- Establish rights for every runtime asset shipped in a public build; prefer original assets or assets with clear, compatible licenses.
- Add an explicit license for newly authored VoxelCraft code only after repository owners choose the intended terms. Do not retroactively describe the historical MCPE source as covered by that license.
- Keep source snapshots and proprietary vanilla assets out of public release artifacts unless rights are verified.
- Obtain appropriate legal review before commercial distribution or presenting this project as a distributable Minecraft-compatible product.

## Engineering policy while unresolved

- Use MCPE 2013 as a behavioral reference, recording source paths and testable observations in `REFERENCE-MAP.md`.
- Do not paste, mechanically translate, or port source functions line-for-line into the browser engine.
- Implement independently specified behavior and use tests for observable mechanics (coordinates, collision, mining, placement, inventory and persistence).
- Keep this audit as an explicit blocker in release/merge review; passing tests does not grant asset or source rights.

## Limitations of this audit

This is a repository-level engineering audit, not a legal opinion. It verifies the checked-in tree and selected source files; it does not establish the full chain of title, historical distribution terms, contributor ownership, or any private permission from rights holders.
