# VoxelCraft Rebuild — Source and License Audit

Date: 2026-10-12
Branch: `rebuild/voxelcraft-modern-engine`
Baseline: `main` (preserved; no merge performed)

## Executive summary

This is a first-pass repository audit, not a legal opinion or a complete inventory of every file. The existing game is a browser implementation built around Three.js in `public/minecraft.html`; it is not the original MCPE engine. The historical MCPE 2013 C++ tree is a behavior/architecture reference. Modern features should be implemented as browser-native systems, with explicit compatibility decisions rather than copied wholesale from old code.

**Release blocker: licensing is not yet clear enough for redistribution.** A root `LICENSE` file was not found on `main`. `LICENSE-ATTRIBUTION.md` says original code is licensed under the repository license “if present, otherwise MIT-style permissive”; absence of a license does not itself grant an MIT license. The checked-in Minecraft resource-pack snapshot and `VanillaBehaviorPack/` contain Mojang/Microsoft-owned assets according to the repository's own attribution document. The old source tree's license and provenance must be verified before code is copied into new implementation files or the result is redistributed.

## What was inspected

- `README.md`: confirms browser game entry point is `public/minecraft.html`, hosted by Next.js and deployed to GitHub Pages; documents existing controls and expected validation commands.
- `package.json`: Next.js/React + TypeScript project with scripts for `validate:foundation`, `validate:game`, `build`, and lint; Three.js is currently loaded in the self-contained browser game rather than organized as a dedicated engine package.
- `docs/FOUNDATION-REFERENCE-MAP.md` and `docs/DEVELOPMENT-RULES.md`: define `rujukan/` as historical architecture/behavior reference, `VoxelCraft/` as asset mirror, and `VanillaBehaviorPack/` as a future logic reference.
- `rujukan/pocket-edition-2013/mcpe-source/handheld/src/world/level/tile/Tile.cpp` and `Tile.h`: demonstrate centralized tile definitions and properties, render layers, collision/shape categories, sounds, ticking and block metadata. `Tile.h` declares 256 legacy tile slots and several non-cube shapes. This supports using a data-driven block registry and explicit shape/interaction definitions instead of treating every block as an identical cube.
- `LICENSE-ATTRIBUTION.md`: acknowledges Mojang/Microsoft ownership of vanilla assets and cautions against redistribution outside the repository without verifying rights.

## License and provenance findings

| Area | Finding | Required action |
| --- | --- | --- |
| Repository-owned code | No root `LICENSE` file was found on `main`. Attribution document's fallback to “MIT-style” is not a substitute for an actual grant. | Confirm owner intent and add a clear license only for code the owner has rights to license. |
| MCPE 2013 source under `rujukan/` | Historical C++ code exists, but a license file at the checked path was not found and the inspected source excerpt did not establish a license. | Inspect repository history, upstream origin, copyright headers, and license for the exact source snapshot. Do not copy source verbatim until verified. |
| `VoxelCraft/` assets | Repository attribution identifies these as a snapshot/mirror of an upstream vanilla resource pack and says assets belong to Mojang/Microsoft. | Treat as reference/possibly restricted redistribution; verify upstream terms and permission before publishing new copies or expanding public deployment. |
| `VanillaBehaviorPack/` | Attribution identifies it as a retained submodule of an upstream behavior pack; no license was confirmed at the checked path. | Inspect submodule URL, commit, README and license independently. |
| Third-party runtime libraries | Package manifest includes Next.js, React, TypeScript and other dependencies. | Preserve package lock; run dependency/license inventory before release. |

### Safe working rule

Use the historical source to understand system responsibilities and observable behavior. Until licensing is verified, write original browser-native implementations from documented behavior and avoid copying substantial source fragments or bundling additional restricted assets. Keep attribution and provenance records. This is a risk-control rule, not a conclusion that all current files are unlawful or that a particular license applies.

## Architecture observations and risks

1. `public/minecraft.html` concentrates runtime behavior in one file. This is expedient for a prototype but makes system ownership, testing, and regressions difficult to isolate.
2. Existing documentation lists movement, terrain/chunks, raycast break/place, inventory, localStorage persistence, day/night and a basic chicken entity as current features. These should be verified against runtime behavior; README claims alone are not test evidence.
3. The legacy `Tile` interface covers much more than solid cubes: render layer, collision/shape, sound, emission, ticking, translucency, and entity-tile distinctions. A modern implementation needs these as explicit capabilities, not scattered ID checks.
4. Historical APIs and mobile-era assumptions are not browser APIs. Input, rendering, storage, asynchronous chunk work and device support require native web implementations.
5. Save compatibility and world corruption are high-risk. Introduce versioned save schemas, validation, migrations and safe fallback before changing persistence.
6. GitHub Pages is static hosting. Multiplayer requiring authoritative shared state would need a separate service and is outside the first offline single-player foundation.

## Audit exit criteria

- [ ] Confirm source repository and license for the MCPE snapshot, including exact commit/version and copyright headers.
- [ ] Confirm license/permission for each asset pack and behavior-pack submodule before public redistribution.
- [ ] Resolve repository-owned code licensing and correct the ambiguous fallback wording in `LICENSE-ATTRIBUTION.md`.
- [ ] Record a source-to-feature map for blocks, collision, player physics, interaction, inventory, world generation, entities, save/load and UI.
- [ ] Capture baseline automated checks and browser smoke tests before replacing runtime systems.
- [ ] Keep all rebuild work on this branch; do not merge unless required checks pass and a review is performed.
