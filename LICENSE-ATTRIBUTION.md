# VoxelCraft — Asset Attribution & License

This repository is a fan project. **VoxelCraft is not affiliated with, endorsed by, or sponsored by Mojang Studios or Microsoft.** "Minecraft" is a trademark of Mojang Studios.

## Minecraft Bedrock assets

All vanilla Minecraft Bedrock assets (textures, sounds, models, animations, entity definitions, recipe JSON, etc.) located in:

- `VoxelCraft/` — checked-in mirror/snapshot of the upstream [ZtechNetwork/MCBVanillaResourcePack](https://github.com/ZtechNetwork/MCBVanillaResourcePack)
- `VanillaBehaviorPack/` — vanilla behavior pack template (git submodule of [ZtechNetwork/MCBVanillaBehaviorPack](https://github.com/ZtechNetwork/MCBVanillaBehaviorPack))

are identified by the upstream material as property of **Mojang Studios / Microsoft**. They are not made open-source or cleared for unrestricted redistribution by being present in this repository. Verify rights before redistributing or deploying them.

## Historical MCPE source archive

The historical C++ snapshot under `rujukan/pocket-edition-2013/mcpe-source/` has no explicit license file identified in the repository tree audit. Its public archive describes the source as originating from a 2026 source-code leak. Do not assume the code is licensed for reuse. See `docs/rebuild/LICENSING-AND-SOURCE-AUDIT.md`; direct porting and redistribution remain on hold pending a documented legal basis.

## Original VoxelCraft code

There is currently **no root `LICENSE` file** in this repository. Therefore, the repository does not currently provide an explicit project-level open-source license for original VoxelCraft code. Do not describe this code as MIT-licensed or MIT-style permissive unless the repository owner adds an actual license with appropriate authority and third-party exclusions. GitHub's [licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) explains that absent a license, default copyright applies.

Any future license for original VoxelCraft-authored code must not purport to license Mojang/Microsoft assets or other third-party material, and must be reviewed for compatibility with all included components.

## Game music

The upstream resource pack README says game music is not included for copyright reasons. Treat sound definition files as reference data, not permission to redistribute music.

## Required practice for new assets and dependencies

Every new asset or dependency must have a provenance record: source URL, author/rightsholder, license or permission basis, modification status, and whether it is approved for public deployment. Do not copy unlicensed Minecraft textures, sounds, fonts, models, logos, or other protected materials into new runtime output.

## Reporting asset issues

Issues with vanilla assets should be reported to the relevant rights holder or upstream project as appropriate. Do not imply the VoxelCraft project owns those assets.

## Disclaimer

This document is an engineering provenance record, not legal advice. Resolve unclear rights with the relevant rights holder or a qualified lawyer before distributing a derivative or deploying disputed material.
