// §SharedConstants.ts — Direct 1:1 translation of C++ SharedConstants.h + .cpp
// Source: rujukan/pocket-edition-2013/mcpe-source/handheld/src/SharedConstants.h + .cpp
// Rule Zero: Every line below maps to a specific line in the C++ source.

// --- SharedConstants.h:6-9 — enum LevelGeneratorVersion ---
enum LevelGeneratorVersion {
  LGV_ORIGINAL = 0,
}

// --- SharedConstants.h:11-13 — namespace Common ---
function getGameVersionString(versionSuffix: string = ''): string {
  return 'v0.6.1' + versionSuffix + ' alpha';
}

// --- SharedConstants.h:17-31 — namespace SharedConstants ---
const NetworkProtocolVersion = 9;
const NetworkProtocolLowestSupportedVersion = 9;
const GameProtocolVersion = 1;
const GameProtocolLowestSupportedVersion = 1;
const StorageVersion = 3;
const MaxChatLength = 100;
const TicksPerSecond = 20;
const GeneratorVersion = LevelGeneratorVersion.LGV_ORIGINAL;

export {
  LevelGeneratorVersion,
  getGameVersionString,
  NetworkProtocolVersion,
  NetworkProtocolLowestSupportedVersion,
  GameProtocolVersion,
  GameProtocolLowestSupportedVersion,
  StorageVersion,
  MaxChatLength,
  TicksPerSecond,
  GeneratorVersion
};
