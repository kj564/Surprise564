# Repository Structure and Responsibilities

Surprise564 is a **browser voxel game project**, not a Minecraft Bedrock addon toolkit. Read [Development Rules](DEVELOPMENT-RULES.md) and [Foundation Reference Map](FOUNDATION-REFERENCE-MAP.md) before changing gameplay.

## Authority model

- **Code/architecture reference:** `rujukan/` is the first stop before implementing gameplay, input, inventory, screens, UI components, or rendering behavior. Its checked-in Pocket Edition source is historical; use it to learn original architecture and behavior.
- **Original asset source:** `VoxelCraft/` contains the original Minecraft Resource Pack assets used as the canonical source for matching textures, models, sprites, and fonts.
- **Browser runtime:** `public/minecraft.html` is the game's main implementation. `public/VoxelCraft/` contains staged runtime copies, not canonical source assets.
- **Host and deployment:** `src/app/` hosts the game; `.github/workflows/static.yml` stages assets, validates, builds, and deploys the static site.

## Annotated tree

```text
Surprise564/
├── rujukan/                          # PRIMARY code/architecture reference; consult before coding
│   └── pocket-edition-2013/
│       └── mcpe-source/
│           ├── docs/                 # Reference documentation
│           ├── handheld/             # Historical Pocket Edition client source
│           └── tools/                # Original source tooling
├── VoxelCraft/                       # Original resource pack; canonical asset source
├── public/
│   ├── minecraft.html                # Browser game: Three.js world, input, UI, gameplay
│   └── VoxelCraft/                   # Staged assets served to the browser
│       ├── textures/blocks/
│       ├── textures/entity/chicken/
│       ├── textures/ui/
│       ├── textures/gui/newgui/
│       ├── textures/items/
│       ├── models/entity/
│       └── font/
├── src/app/
│   ├── layout.tsx                    # Next.js root layout
│   ├── page.tsx                      # Host page; embeds minecraft.html
│   └── globals.css                   # Host/global styles, not game logic
├── scripts/
│   ├── setup.sh                      # Stage required game assets and install dependencies
│   └── validate-game.mjs             # Static validation for browser-game foundations
├── .github/workflows/
│   └── static.yml                    # Stage assets, validate, build, verify, deploy to Pages
├── docs/
│   ├── DEVELOPMENT-RULES.md          # Mandatory workflow and design rules
│   ├── FOUNDATION-REFERENCE-MAP.md   # Which original sources govern each system
│   ├── STRUCTURE.md                  # This directory map
│   └── ASSETS.md                     # Asset provenance and staging rules
├── next.config.ts                    # Static export and GitHub Pages basePath
├── package.json                      # Commands and dependencies
├── bun.lock                          # Locked dependency graph
├── LICENSE-ATTRIBUTION.md             # Attribution and licensing notes
└── README.md                         # Project entry point
```

## Where changes belong

| Change | Edit / inspect first | Important constraint |
| --- | --- | --- |
| Gameplay, movement, world, block interactions | `rujukan/`, then `public/minecraft.html` | Port behavior intentionally; browser runtime is not Minecraft's engine. |
| Inventory, pause/menu screens, focus and input | `rujukan/` GUI/screen code, then `public/minecraft.html` | Keep state transitions separate from styling; test keyboard/mouse interaction. |
| Original texture, model, font, or UI sprite | `VoxelCraft/` and matching original source files | Never silently substitute a lookalike. |
| Asset used by the browser | Canonical source + `scripts/setup.sh` + `.github/workflows/static.yml` | Local setup and CI must stage the same asset. |
| Browser host page or routing | `src/app/`, `next.config.ts` | Do not move game logic into the iframe host page. |
| Static checks or build pipeline | `scripts/validate-game.mjs`, `.github/workflows/static.yml` | Add checks for new asset paths and source parity. |

## Runtime and asset flow

```text
rujukan/ ──> understand original code structure and behavior
VoxelCraft/ ──> canonical original resource-pack assets
                         │
                         ├── scripts/setup.sh
                         └── .github/workflows/static.yml
                                      │
                                      ▼
                           public/VoxelCraft/ (staged copies)
                                      │
                                      ▼
                           public/minecraft.html
                                      │
                                      ▼
                          Next.js static export (out/)
                                      │
                                      ▼
                              GitHub Pages
```

The historical source is a design/behavior reference, not a dependency imported by the browser game. The game adapts selected concepts to Three.js, JavaScript, HTML, and CSS.

## Local development and validation

```bash
git clone https://github.com/kj564/Surprise564.git
cd Surprise564
./scripts/setup.sh
bun run dev
```

Before opening a pull request:

```bash
bun run validate:game
bun run build
```

Passing static validation/build does not replace browser interaction testing. Report clearly which checks actually ran.
