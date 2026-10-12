# VoxelCraft Modern Engine — Architecture and Incremental Plan

Target: modern browser voxel sandbox; MCPE 2013 is a historical behavior and architecture reference. Priority: correct, complete mechanics before visual polish.

## Principles
- Implement browser-native systems; do not pretend to port the native C++ engine wholesale.
- Preserve `main` and the existing game as a reference.
- Keep simulation/data separate from Three.js rendering. Meshes are derived views, never the source of truth.
- Use explicit interfaces and deterministic rules instead of scattered block-ID conditionals.
- Version persistent data and test migrations.
- A feature is complete only when automated and browser tests cover it.

## Proposed module boundaries

Introduce these incrementally after checking the current app/build conventions; do not create empty scaffolding just to match a diagram.

```text
src/game/
  core/          fixed-step clock, seeded RNG, coordinates, events
  blocks/        registry, traits, shapes, hardness, drops, sounds
  world/         chunk storage, world access, generation, dirty regions
  physics/       AABB, collision queries, grounded state, jump/gravity
  interaction/   voxel raycast, reach, break progress, placement validation
  items/         definitions, stacks, tools, durability
  inventory/     slots, hotbar, transfer and container rules
  entities/      lifecycle, movement, AI and hitboxes
  crafting/      recipes and station matching
  persistence/   versioned schema, validation, migration and recovery
  rendering/     Three.js adapter, chunk meshing, materials, lighting
  input/         keyboard, pointer lock, mouse, touch and gamepad adapters
  ui/            menus, HUD, inventory, settings and accessibility
```

## Data contracts

### Blocks
Each block definition should include a stable namespaced key, legacy numeric mapping when known, per-face texture references, render layer/shape, occlusion, collision and selection shapes, hardness, tool requirements, drops, sounds, transparency, light blocking/emission, tick capability, state properties and behavior hooks where applicable. Defaults must be explicit and tested. Unknown blocks must fail safely rather than silently becoming unrelated solid cubes.

### World and chunks
- Chunk storage is independent of Three.js objects.
- Document coordinate conventions; test chunk/local conversion at negative positions and boundaries.
- Chunk changes mark affected mesh/light/neighbor regions dirty.
- Generation is seeded and repeatable for a given generator version.
- Missing/unloaded chunks must not be treated as air for collision or placement unless the loading contract explicitly permits it.

### Player simulation
- Fixed simulation step with bounded catch-up; rendering may interpolate.
- Separate camera orientation from body/collision state.
- Resolve floors, walls, ceilings, corners and chunk boundaries.
- Jumping requires a valid grounded state; flying is an explicit mode.
- Map input to intents; UI focus and pointer-lock transitions must not leak gameplay input.

### Interaction
- Voxel traversal raycast with documented tie-breaking.
- Centralize reach, line-of-sight, target face, placement collision, inventory count and game-mode checks.
- Breaking tracks progress/tool speed and only drops items when rules allow.
- Placement cannot overlap the player collision volume and must update neighbor-dependent state.
- Return structured results so UI/audio do not duplicate game rules.

### Persistence
- Save envelope includes schema and generator versions, world metadata, player state, chunk data and inventory.
- Validate payload size, types, coordinates and block IDs before loading.
- Write to a new version/key first; retain last-known-good data until save succeeds.
- Invalid saves offer recovery/reset rather than crashing or partially loading.
- Surface storage/quota failures clearly.

## Incremental plan

### Phase 0 — baseline and license gate
1. Record default branch SHA, open PR status, workflows and smoke-test results.
2. Verify provenance and asset permissions. Do not expand redistribution while unresolved.
3. Run existing foundation/game validation, production build and browser smoke test; record actual results.

### Phase 1 — architecture seam and regression harness
1. Add a testable engine entry point without deleting `public/minecraft.html`.
2. Introduce coordinate/chunk helpers and block registry contract.
3. Add unit tests for coordinates, block defaults and save schema validation.
4. Test the actual game route for startup, console errors and failed local asset requests.

### Phase 2 — mechanics core
1. World data, chunk boundaries and deterministic generation.
2. Player movement, fixed-step gravity, AABB collision and grounded/jump behavior.
3. Raycast selection, break timing, drops and placement validation.
4. Hotbar/inventory stack operations.
5. Versioned save/load and reload persistence tests.

### Phase 3 — world rules and content
1. Block states and non-cube shapes (stairs, slabs, doors, ladders, plants).
2. Tools, mining tiers, durability, drops and item use.
3. Crafting/recipes, containers and furnace-style processing.
4. Fluids, scheduled ticks, light and scoped entity AI.

### Phase 4 — modern features
Once baseline mechanics are reliable: settings, key remapping, touch/gamepad controls, accessibility, performance tooling, expanded biomes/world generation and optional resource packs. Keep advanced systems separate from the historically grounded compatibility layer.

### Phase 5 — visual refinement
Only after mechanics tests stabilize: UI layout, animation, lighting, material quality and mobile polish. Re-run regressions at each milestone.

## Test gates
- Static: foundation checks, game validation, lint/typecheck where configured, production build.
- Unit: seeded generation, negative chunk coordinates, collision geometry, raycast edge/tie cases, inventory conservation, placement/break/drop rules, save validation/migrations.
- Browser: real route startup, keyboard/pointer lock, break/place, inventory, save/reload and resize/touch where supported.
- Regression: no new console errors, missing textures, failed asset requests, broken host route or accidental changes to canonical references.
- Label manual checks as manual; static checks do not prove visual or gameplay correctness.

## Merge policy
- This branch is independent of `main`; do not delete or rewrite `main`.
- Never merge with required checks failing, missing or not yet run.
- Keep changes reviewable and report exactly which tests ran.
- If browser testing cannot run, state that limitation and do not claim it passed.
