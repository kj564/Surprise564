# Development Rules for Surprise564

These rules prevent the browser game, native Bedrock packs, and original references from being mixed up.

## Non-negotiable source rules

1. **Consult `rujukan/` before writing comparable game code.** Find the closest original class/component/flow and understand its responsibilities before implementing a new version.
2. **Use original Minecraft files as the source of truth.** For exact assets, inspect the original files in `VoxelCraft/` and any relevant original files in `rujukan/`. Never invent a replacement when the correct source exists.
3. **Do not copy old code blindly.** The Pocket Edition reference is historical (2013). Learn from its architecture and behavior, then adapt to the browser runtime and document version-specific differences.
4. **Keep canonical sources immutable during adaptation.** Browser-specific changes belong in the browser implementation or staged runtime copy, not in the canonical original asset.
5. **Do not conflate runtimes.** The browser game is Three.js/JavaScript/HTML/CSS. `BedrockAddon/` and `VoxelCraftResourcePack/` target native Minecraft Bedrock and do not execute inside the browser game.
6. **Do not claim an unsupported feature works.** Keep labels and controls aligned with implemented behavior; document browser/native differences clearly.

## Change workflow

For each nontrivial feature or bug fix:

1. Define the expected behavior and identify the affected subsystem.
2. Read the relevant source in `rujukan/` and the [Foundation Reference Map](FOUNDATION-REFERENCE-MAP.md).
3. Inspect current implementation in `public/minecraft.html` and relevant native Bedrock files if applicable.
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
10. Report precisely what changed and which tests actually ran. Separate static checks from browser visual tests and native Bedrock tests.

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
- Are browser adaptations clearly separated from native Bedrock behavior?
- Are menu state, input handling, and CSS presentation kept understandable?
- Could the change break an unrelated screen, inventory action, or saved game?
- Have we actually run the checks we claim to have passed?

When the reference is incomplete or conflicts with the target runtime, explain the gap and make a deliberate adaptation. Do not conceal uncertainty behind invented implementation details.
