# Development Rules for VoxelCraft

VoxelCraft is a **browser voxel game**. These rules keep development focused on the game and prevent implementation details from being guessed.

## Non-negotiable source rules

1. **Consult `rujukan/` before writing comparable game code.** Find the closest original class/component/flow and understand its responsibilities before implementing a new version.
2. **Keep `VanillaBehaviorPack/` as a future game-logic reference.** It is an intentional submodule that will inform game behavior; do not remove it during repository cleanup. Adapt relevant logic to the browser runtime.
3. **Use original Minecraft files as the source of truth for matching assets.** Inspect the original files in `VoxelCraft/`. Never invent a replacement when the correct source exists.
4. **Do not copy old code blindly.** The Pocket Edition reference is historical (2013). Learn from its architecture and behavior, then adapt to the browser runtime and document version-specific differences.
5. **Keep canonical sources immutable during adaptation.** Browser-specific changes belong in the browser implementation or staged runtime copy, not in the canonical original asset.
6. **Keep the scope on the browser game.** The game runs on Three.js, JavaScript, HTML, and CSS. Do not introduce unrelated addon/toolkit systems into the project without an explicit change of scope.
7. **Do not claim an unsupported feature works.** Keep labels and controls aligned with implemented behavior.

## Change workflow

For each nontrivial feature or bug fix:

1. Define the expected behavior and identify the affected game subsystem.
2. Read the relevant source in `rujukan/`, consult `VanillaBehaviorPack/` when implementing future game logic, and review the [Foundation Reference Map](FOUNDATION-REFERENCE-MAP.md).
3. Inspect current implementation in `public/minecraft.html`.
4. Inspect exact original assets before adjusting visuals or model rendering.
5. Make a focused change; avoid unrelated rewrites.
6. If adding an asset, update both `scripts/setup.sh` and `.github/workflows/static.yml`, plus runtime path lists and validation as needed.
7. Add or update checks in `scripts/validate-game.mjs`.
8. Run:
   ```bash
   bun run validate:game
   bun run build
   ```
9. Test affected keyboard, mouse, touch, focus, and screen transitions in a browser when relevant.
10. Report precisely what changed and which tests actually ran. Separate static checks from browser interaction and visual tests.

## Asset staging checklist

- [ ] Canonical original asset located and inspected.
- [ ] Runtime copy path is correct.
- [ ] Local staging in `scripts/setup.sh` updated.
- [ ] CI staging in `.github/workflows/static.yml` updated.
- [ ] Runtime loader/path references updated.
- [ ] Validation checks source presence and parity where appropriate.
- [ ] Attribution/licensing remains correct.

## Review checklist

- Does this follow the reference's responsibilities and state flow?
- Did we preserve original asset fidelity instead of drawing a substitute?
- Are behavior/state management and visual styling understandable?
- Could the change break an unrelated screen, inventory action, or saved game?
- Have we actually run the checks we claim to have passed?

When the reference is incomplete or conflicts with the target runtime, explain the gap and make a deliberate adaptation. Do not conceal uncertainty behind invented implementation details.
